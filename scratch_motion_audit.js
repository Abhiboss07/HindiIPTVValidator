async (page) => {
  // ====================================================================
  // Phase 38 — Honest Motion Profiler v2
  // Measures: p50/p95/p99 frame time, consecutive drops, Long Tasks,
  //           interaction latency, display Hz detection, jank score.
  // Does NOT fake 60 FPS when frames are actually long.
  // ====================================================================

  await page.goto('http://127.0.0.1:8089/index.html?v=' + Date.now());
  await page.waitForTimeout(1500);

  const results = await page.evaluate(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // ── Detect actual display refresh rate ──────────────────────────
    async function detectRefreshRate() {
      return new Promise(resolve => {
        const times = [];
        let last = 0;
        let count = 0;
        function tick(now) {
          if (last > 0) times.push(now - last);
          last = now;
          count++;
          if (count < 30) requestAnimationFrame(tick);
          else {
            const sorted = times.slice().sort((a, b) => a - b);
            const median = sorted[Math.floor(sorted.length / 2)];
            const hz = Math.round(1000 / median);
            resolve({ hz, medianIntervalMs: Math.round(median * 100) / 100 });
          }
        }
        requestAnimationFrame(tick);
      });
    }

    // ── Long Tasks Observer ─────────────────────────────────────────
    let longTasks = [];
    let longTaskObserver = null;
    function startLongTaskObserver() {
      longTasks = [];
      if (typeof PerformanceObserver !== 'undefined') {
        try {
          longTaskObserver = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
              longTasks.push({
                durationMs: Math.round(entry.duration * 100) / 100,
                startTimeMs: Math.round(entry.startTime * 100) / 100
              });
            }
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) { /* longtask not supported */ }
      }
    }
    function stopLongTaskObserver() {
      if (longTaskObserver) {
        longTaskObserver.disconnect();
        longTaskObserver = null;
      }
      const captured = [...longTasks];
      longTasks = [];
      return captured;
    }

    // ── Frame Profiler v2 ───────────────────────────────────────────
    function createProfiler(displayHz) {
      const frameBudgetMs = 1000 / displayHz;
      let running = false;
      let frameTimes = [];
      let lastTime = 0;
      let animId = null;

      function onFrame(now) {
        if (!running) return;
        if (lastTime > 0) frameTimes.push(now - lastTime);
        lastTime = now;
        animId = requestAnimationFrame(onFrame);
      }

      return {
        start() {
          frameTimes = [];
          lastTime = 0;
          running = true;
          startLongTaskObserver();
          animId = requestAnimationFrame(onFrame);
        },
        stop() {
          running = false;
          if (animId) cancelAnimationFrame(animId);
          const lt = stopLongTaskObserver();

          if (frameTimes.length < 2) {
            return {
              totalFrames: frameTimes.length,
              displayHz,
              frameBudgetMs,
              verdict: 'INSUFFICIENT_DATA',
              longTasks: lt
            };
          }

          const sorted = frameTimes.slice().sort((a, b) => a - b);
          const n = sorted.length;
          const p = (pct) => sorted[Math.min(Math.floor(n * pct / 100), n - 1)];
          const sum = sorted.reduce((a, b) => a + b, 0);
          const avg = sum / n;

          // Count frames that exceeded the budget
          const jankThreshold = frameBudgetMs * 1.1; // 10% tolerance
          const droppedFrames = sorted.filter(t => t > jankThreshold).length;
          const droppedPct = Math.round((droppedFrames / n) * 1000) / 10;

          // Consecutive drops — worst streak
          let maxConsecutiveDrops = 0;
          let currentStreak = 0;
          for (const t of frameTimes) {
            if (t > jankThreshold) {
              currentStreak++;
              if (currentStreak > maxConsecutiveDrops) maxConsecutiveDrops = currentStreak;
            } else {
              currentStreak = 0;
            }
          }

          // Effective FPS (accounts for real render time, not just rAF cadence)
          // A frame that takes 33ms on a 60Hz display means we dropped a frame
          const effectiveFrameCount = frameTimes.reduce((acc, t) => {
            return acc + Math.max(1, Math.round(t / frameBudgetMs));
          }, 0);
          const effectiveFps = Math.round((n / effectiveFrameCount) * displayHz * 10) / 10;

          // Jank score: 0 = perfect, 100 = disaster
          const jankScore = Math.min(100, Math.round(
            (droppedPct * 0.4) +
            (Math.min(p(99), 200) / 200 * 30) +
            (maxConsecutiveDrops * 5) +
            (lt.length * 3)
          ));

          let verdict;
          if (jankScore <= 10) verdict = 'EXCELLENT';
          else if (jankScore <= 25) verdict = 'GOOD';
          else if (jankScore <= 45) verdict = 'ACCEPTABLE';
          else if (jankScore <= 65) verdict = 'JANKY';
          else verdict = 'SEVERE_JANK';

          return {
            displayHz,
            frameBudgetMs: Math.round(frameBudgetMs * 100) / 100,
            totalFrames: n,
            effectiveFps,
            frameTimeMs: {
              avg: Math.round(avg * 100) / 100,
              min: Math.round(sorted[0] * 100) / 100,
              p50: Math.round(p(50) * 100) / 100,
              p95: Math.round(p(95) * 100) / 100,
              p99: Math.round(p(99) * 100) / 100,
              max: Math.round(sorted[n - 1] * 100) / 100
            },
            droppedFrames,
            droppedPct,
            maxConsecutiveDrops,
            jankScore,
            verdict,
            longTasks: lt
          };
        }
      };
    }

    // ── Begin Profiling ─────────────────────────────────────────────
    const displayInfo = await detectRefreshRate();
    const profiler = createProfiler(displayInfo.hz);
    const report = {
      timestamp: new Date().toISOString(),
      display: displayInfo,
      tests: {}
    };

    // ─── 1. HOME SCROLLING ──────────────────────────────────────────
    window.switchPage('home');
    await sleep(600);
    profiler.start();
    for (let i = 0; i < 10; i++) {
      window.scrollTo({ top: i * 200, behavior: 'smooth' });
      await sleep(60);
    }
    for (let i = 10; i >= 0; i--) {
      window.scrollTo({ top: i * 200, behavior: 'smooth' });
      await sleep(60);
    }
    await sleep(200);
    report.tests.homeScrolling = profiler.stop();

    // ─── 2. CINEMA SCROLLING + RAILS ────────────────────────────────
    window.switchPage('cinema');
    if (typeof window.renderMoviesPage === 'function') await window.renderMoviesPage();
    await sleep(600);
    profiler.start();
    for (let i = 0; i < 8; i++) {
      window.scrollTo({ top: i * 250, behavior: 'smooth' });
      await sleep(60);
    }
    const rails = document.querySelectorAll('.content-rail-scroll, .theatrical-rail, .rail-scroll');
    for (const rail of Array.from(rails).slice(0, 4)) {
      rail.scrollBy({ left: 500, behavior: 'smooth' });
      await sleep(80);
      rail.scrollBy({ left: -500, behavior: 'smooth' });
      await sleep(80);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await sleep(200);
    report.tests.cinemaScrolling = profiler.stop();

    // ─── 3. LIVE TV SCROLLING (300+ cards) ──────────────────────────
    window.switchPage('live');
    await sleep(600);
    profiler.start();
    for (let i = 0; i < 12; i++) {
      window.scrollTo({ top: i * 350, behavior: 'smooth' });
      await sleep(60);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await sleep(200);
    report.tests.liveTvScrolling = profiler.stop();

    // ─── 4. SEARCH TYPING ───────────────────────────────────────────
    window.openSearch();
    await sleep(300);
    profiler.start();
    const t0Search = performance.now();
    const searchInput = document.getElementById('spotlightInput');
    const searchQuery = 'Hera Pheri';
    let accum = '';
    for (const char of searchQuery) {
      accum += char;
      if (searchInput) searchInput.value = accum;
      window.handleSpotlightSearch(accum);
      await sleep(50);
    }
    await sleep(300);
    const searchMetrics = profiler.stop();
    searchMetrics.interactionLatencyMs = Math.round(performance.now() - t0Search);
    report.tests.searchTyping = searchMetrics;
    window.closeSpotlightSearch();
    await sleep(300);

    // ─── 5. MOVIE DETAIL MODAL OPEN ─────────────────────────────────
    const t0Modal = performance.now();
    profiler.start();
    window.openMovieDetails('vod_hera_pheri_2000');
    await sleep(400);
    const modalOpenMetrics = profiler.stop();
    modalOpenMetrics.interactionLatencyMs = Math.round(performance.now() - t0Modal);
    report.tests.modalOpen = modalOpenMetrics;

    // ─── 6. MOVIE DETAIL MODAL CLOSE ────────────────────────────────
    const t0Close = performance.now();
    profiler.start();
    window.closeMovieDetails();
    await sleep(350);
    const modalCloseMetrics = profiler.stop();
    modalCloseMetrics.interactionLatencyMs = Math.round(performance.now() - t0Close);
    report.tests.modalClose = modalCloseMetrics;

    // ─── 7. SUBTITLE MODAL ──────────────────────────────────────────
    window.openMovieDetails('vod_welcome_2007');
    window.handleStreamMovieClick && window.handleStreamMovieClick();
    await sleep(500);
    profiler.start();
    const t0Sub = performance.now();
    window.openVlcSubtitlesModal();
    await sleep(250);
    window.closeVlcSubtitlesModal();
    await sleep(250);
    const subMetrics = profiler.stop();
    subMetrics.interactionLatencyMs = Math.round(performance.now() - t0Sub);
    report.tests.subtitleModal = subMetrics;

    // ─── 8. AUDIO MODAL ─────────────────────────────────────────────
    profiler.start();
    const t0Audio = performance.now();
    window.openVlcAudioModal();
    await sleep(250);
    window.closeVlcAudioModal();
    await sleep(250);
    const audioMetrics = profiler.stop();
    audioMetrics.interactionLatencyMs = Math.round(performance.now() - t0Audio);
    report.tests.audioModal = audioMetrics;

    // ─── 9. PLAYER CONTROLS TOGGLE ──────────────────────────────────
    const overlay = document.getElementById('playerUiOverlay');
    if (overlay) {
      profiler.start();
      const t0Ctrl = performance.now();
      overlay.classList.add('hidden-controls');
      await sleep(250);
      overlay.classList.remove('hidden-controls');
      await sleep(250);
      overlay.classList.add('hidden-controls');
      await sleep(250);
      overlay.classList.remove('hidden-controls');
      await sleep(250);
      const ctrlMetrics = profiler.stop();
      ctrlMetrics.interactionLatencyMs = Math.round(performance.now() - t0Ctrl);
      report.tests.playerControls = ctrlMetrics;
    }

    if (typeof window.closeMiniPlayer === 'function') window.closeMiniPlayer();
    await sleep(200);

    // ─── 10. NAVIGATION TRANSITIONS ─────────────────────────────────
    profiler.start();
    const t0Nav = performance.now();
    const navPages = ['home', 'movies', 'live', 'radio', 'favs', 'local', 'home'];
    for (const p of navPages) {
      window.switchPage(p);
      await sleep(180);
    }
    const navMetrics = profiler.stop();
    navMetrics.interactionLatencyMs = Math.round(performance.now() - t0Nav);
    report.tests.navigation = navMetrics;

    // ─── 11. RAPID MODAL OPEN/CLOSE (interruptibility) ──────────────
    profiler.start();
    const t0Rapid = performance.now();
    for (let i = 0; i < 5; i++) {
      window.openMovieDetails('vod_hera_pheri_2000');
      await sleep(80);
      window.closeMovieDetails();
      await sleep(80);
    }
    const rapidMetrics = profiler.stop();
    rapidMetrics.interactionLatencyMs = Math.round(performance.now() - t0Rapid);
    report.tests.rapidModalCycle = rapidMetrics;

    // ─── MEMORY ─────────────────────────────────────────────────────
    if (performance.memory) {
      report.memory = {
        jsHeapUsedMB: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024) * 10) / 10,
        jsHeapTotalMB: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024) * 10) / 10,
        jsHeapLimitMB: Math.round(performance.memory.jsHeapSizeLimit / (1024 * 1024))
      };
    }

    return report;
  });

  return results;
}
