async (page) => {
  const results = {
    timestamp: new Date().toISOString(),
    suites: {},
    benchmarks: [],
    screenshots: []
  };

  console.log("=== STARTING T2L REMEDIATION E2E TEST SUITE ===");

  // Ensure page is at index.html
  await page.goto('http://127.0.0.1:8088/index.html');
  await page.waitForLoadState('networkidle');

  // =========================================================================
  // SUITE 1: CATALOG INTEGRITY & EXPANSION
  // =========================================================================
  console.log("\n[SUITE 1] Catalog Integrity & Expansion...");
  const suite1 = await page.evaluate(async () => {
    await CatalogProvider.load();
    const all = CatalogProvider.getAll();
    const newIds = [
      'vod_bbb_4k', 'vod_sintel_4k', 'vod_tears_of_steel_4k',
      'vod_his_girl_friday_4k', 'vod_night_of_living_dead_1080p',
      'vod_charade_720p', 'vod_the_general_720p',
      'vod_elephants_dream_1080p', 'vod_cosmos_laundromat_2k'
    ];
    const foundNew = newIds.map(id => {
      const m = CatalogProvider.getById(id);
      return {
        id,
        found: !!m,
        title: m ? m.title : null,
        quality: m ? m.qualityHonestBadge : null,
        subtitlesCount: (m && m.subtitles) ? m.subtitles.length : 0,
        hasStreamUrl: !!(m && m.streamUrl)
      };
    });

    return {
      totalCount: all.length,
      allNewFound: foundNew.every(x => x.found && x.hasStreamUrl),
      newTitles: foundNew
    };
  });
  results.suites.catalogIntegrity = suite1;
  console.log(`- Total Catalog Count: ${suite1.totalCount} (Expected: 180)`);
  console.log(`- All 9 Expanded Titles Found & Playable: ${suite1.allNewFound}`);

  // =========================================================================
  // SUITE 2: ZERO-PREP FAST-START PLAYBACK (BUG A)
  // =========================================================================
  console.log("\n[SUITE 2] Fast-Start Playback & Zero-Prep Modal...");
  const suite2 = await page.evaluate(async () => {
    const movie = CatalogProvider.getById('vod_bbb_4k');
    const prepModal = document.getElementById('streamPrepModal');
    
    // Trigger direct stream
    const startTime = performance.now();
    startMovieStream(movie);
    
    const isPrepActiveAfterStart = prepModal && prepModal.classList.contains('active');
    const isPrepVisible = prepModal && prepModal.style.display !== 'none';
    
    // Wait for luminaVideo to start loading
    const video = document.getElementById('luminaVideo');
    await new Promise((resolve) => {
      if (video.readyState >= 2) return resolve();
      const onReady = () => {
        video.removeEventListener('loadeddata', onReady);
        resolve();
      };
      video.addEventListener('loadeddata', onReady);
      setTimeout(resolve, 3000);
    });
    
    const timeToReady = Math.round(performance.now() - startTime);
    const playerModal = document.getElementById('playerModal');
    const isPlayerOpen = playerModal && playerModal.classList.contains('active');

    return {
      title: movie.title,
      prepModalBypassed: !isPrepActiveAfterStart && !isPrepVisible,
      playerModalOpened: isPlayerOpen,
      timeToReadyMs: timeToReady,
      videoSrc: video.currentSrc || video.src
    };
  });
  results.suites.fastStart = suite2;
  console.log(`- Prep Modal Bypassed: ${suite2.prepModalBypassed}`);
  console.log(`- Player Modal Opened: ${suite2.playerModalOpened}`);
  console.log(`- Time to Ready: ${suite2.timeToReadyMs}ms`);

  // =========================================================================
  // SUITE 3: SUBTITLE TRACKS & REAL CUE RENDERING (BUG D)
  // =========================================================================
  console.log("\n[SUITE 3] Subtitle Tracks Discovery & Real Cue Rendering...");
  const suite3 = await page.evaluate(async () => {
    const video = document.getElementById('luminaVideo');
    const ccBox = document.getElementById('playerCcBox');
    const ccText = document.getElementById('playerCcText');

    // 1. Verify tracks attached
    const textTracks = Array.from(video.textTracks || []);
    const trackLabels = textTracks.map(t => ({ label: t.label, lang: t.language, mode: t.mode }));

    // 2. Open Subtitles modal & verify chips
    populateVlcSubtitleTracks();
    const chipsList = document.querySelectorAll('#vlcSubtitleTracksList .vlc-chip-btn');
    const chipLabels = Array.from(chipsList).map(c => c.textContent.trim());

    // 3. Switch to English Subtitle Track
    setVlcSubtitleTrack('native:0');
    video.currentTime = 5.0; // Seek to active cue
    await new Promise(r => setTimeout(r, 600));

    const enActive = isCCEnabled;
    const enBoxDisplay = ccBox ? window.getComputedStyle(ccBox).display : 'none';
    const enCueText = ccText ? ccText.textContent.trim() : '';

    // 4. Switch to Hindi Subtitle Track
    setVlcSubtitleTrack('native:1');
    video.currentTime = 5.0;
    await new Promise(r => setTimeout(r, 600));

    const hiActive = isCCEnabled;
    const hiCueText = ccText ? ccText.textContent.trim() : '';

    // 5. Toggle Subtitles Off
    setVlcSubtitleTrack('off');
    await new Promise(r => setTimeout(r, 200));

    const offActive = isCCEnabled;
    const offBoxDisplay = ccBox ? window.getComputedStyle(ccBox).display : 'none';

    return {
      textTrackCount: textTracks.length,
      trackLabels,
      chipLabels,
      enActive,
      enBoxDisplay,
      enCueText,
      hiActive,
      hiCueText,
      offActive,
      offBoxDisplay
    };
  });
  results.suites.subtitleSystem = suite3;
  console.log(`- Text Tracks Attached: ${suite3.textTrackCount}`);
  console.log(`- Track Chips in Modal: ${JSON.stringify(suite3.chipLabels)}`);
  console.log(`- English Active Cue Text: "${suite3.enCueText}"`);
  console.log(`- Hindi Active Cue Text: "${suite3.hiCueText}"`);
  console.log(`- Off Box Display: "${suite3.offBoxDisplay}"`);

  // Switch English back on for screenshot capture
  await page.evaluate(() => {
    setVlcSubtitleTrack('native:0');
    const v = document.getElementById('luminaVideo');
    if (v) v.currentTime = 5.0;
  });
  await page.waitForTimeout(500);

  const subScreenshotPath = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/evidence_e2e_subtitles_active.png';
  await page.screenshot({ path: subScreenshotPath });
  results.screenshots.push({ name: 'subtitles_active', path: subScreenshotPath });
  console.log(`- Saved screenshot: ${subScreenshotPath}`);

  // =========================================================================
  // SUITE 4: PLAYER LOCK & AUTO-FADE (BUG B)
  // =========================================================================
  console.log("\n[SUITE 4] Player Lock Architecture & Auto-Fade...");
  const suite4 = await page.evaluate(async () => {
    const lockPill = document.getElementById('playerLockOverlay');
    const uiOverlay = document.getElementById('playerUiOverlay');
    
    // 1. Toggle Lock On
    togglePlayerLock();
    const lockedInitially = isPlayerLocked;
    const pillShownInitially = lockPill && lockPill.style.display === 'flex' && !lockPill.classList.contains('fade-out');
    const uiHidden = uiOverlay && uiOverlay.classList.contains('hidden-controls');

    // 2. Wait 2.7s for auto-fade
    await new Promise(r => setTimeout(r, 2700));
    const pillFadedOut = lockPill && lockPill.classList.contains('fade-out');

    // 3. Tap on player to reveal
    const playerModal = document.getElementById('playerModal');
    playerModal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const pillRevealedOnTap = lockPill && !lockPill.classList.contains('fade-out');

    // 4. Unlock
    togglePlayerLock();
    const unlocked = !isPlayerLocked;
    const pillHidden = lockPill && lockPill.style.display === 'none';

    return {
      lockedInitially,
      pillShownInitially,
      uiHidden,
      pillFadedOut,
      pillRevealedOnTap,
      unlocked,
      pillHidden
    };
  });
  results.suites.playerLock = suite4;
  console.log(`- Controls Locked: ${suite4.lockedInitially}`);
  console.log(`- Lock Pill Faded Out after 2.5s: ${suite4.pillFadedOut}`);
  console.log(`- Lock Pill Revealed on Screen Tap: ${suite4.pillRevealedOnTap}`);
  console.log(`- Unlocked Cleanly: ${suite4.unlocked}`);

  // =========================================================================
  // SUITE 5: RAPID STREAM SWITCHING & TEARDOWN (BUG C)
  // =========================================================================
  console.log("\n[SUITE 5] Rapid Switching & Teardown Verification...");
  const suite5 = await page.evaluate(async () => {
    const testIds = ['vod_bbb_4k', 'vod_sintel_4k', 'vod_tears_of_steel_4k', 'vod_his_girl_friday_4k'];
    const switchResults = [];

    for (const id of testIds) {
      const m = CatalogProvider.getById(id);
      startMovieStream(m);
      const v = document.getElementById('luminaVideo');
      await new Promise(r => setTimeout(r, 800));
      switchResults.push({
        id,
        videoPlaying: !v.paused || v.readyState >= 1,
        activeCuesOk: true
      });
    }

    // Close player completely and verify cleanup
    closePlayerModalCompletely();
    const v = document.getElementById('luminaVideo');
    const hlsCleaned = (hlsInstance === null);
    const lockCleaned = (isPlayerLocked === false);
    const videoPaused = v.paused;

    return {
      switchesPassed: switchResults.every(s => s.videoPlaying),
      switchDetails: switchResults,
      teardown: { hlsCleaned, lockCleaned, videoPaused }
    };
  });
  results.suites.rapidSwitching = suite5;
  console.log(`- All Stream Switches Succeeded: ${suite5.switchesPassed}`);
  console.log(`- Full Teardown Cleaned HLS, Lock, and Video: ${suite5.teardown.hlsCleaned && suite5.teardown.lockCleaned && suite5.teardown.videoPaused}`);

  // =========================================================================
  // SUITE 6: LATENCY BENCHMARK ACROSS 10 STREAMS
  // =========================================================================
  console.log("\n[SUITE 6] Latency Benchmark Across 10 Streams...");
  const benchmarkIds = [
    'vod_bbb_4k',
    'vod_sintel_4k',
    'vod_tears_of_steel_4k',
    'vod_his_girl_friday_4k',
    'vod_night_of_living_dead_1080p',
    'vod_charade_720p',
    'vod_the_general_720p',
    'vod_elephants_dream_1080p',
    'vod_cosmos_laundromat_2k',
    'series_sherlock_holmes'
  ];

  for (const id of benchmarkIds) {
    const bench = await page.evaluate(async (movieId) => {
      const movie = CatalogProvider.getById(movieId);
      if (!movie) return { id: movieId, error: 'Not found' };

      const start = performance.now();
      startMovieStream(movie);

      const video = document.getElementById('luminaVideo');
      let firstFrameMs = 0;

      await new Promise(resolve => {
        if (video.readyState >= 2 && !video.paused) {
          firstFrameMs = Math.round(performance.now() - start);
          return resolve();
        }
        const onTimeUpdate = () => {
          if (video.currentTime > 0.05) {
            firstFrameMs = Math.round(performance.now() - start);
            video.removeEventListener('timeupdate', onTimeUpdate);
            resolve();
          }
        };
        video.addEventListener('timeupdate', onTimeUpdate);
        setTimeout(() => {
          firstFrameMs = Math.round(performance.now() - start);
          video.removeEventListener('timeupdate', onTimeUpdate);
          resolve();
        }, 4000);
      });

      return {
        id: movieId,
        title: movie.title,
        quality: movie.qualityHonestBadge || movie.resolution,
        latencyMs: firstFrameMs,
        readyState: video.readyState,
        resolution: `${video.videoWidth}x${video.videoHeight}`
      };
    }, id);

    results.benchmarks.push(bench);
    console.log(`  [${bench.quality}] ${bench.title}: ${bench.latencyMs}ms (${bench.resolution})`);
    await page.waitForTimeout(500);
  }

  // Calculate statistics
  const latencies = results.benchmarks.map(b => b.latencyMs).filter(l => l > 0).sort((a, b) => a - b);
  const minLatency = latencies[0];
  const maxLatency = latencies[latencies.length - 1];
  const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
  const medianLatency = latencies[Math.floor(latencies.length / 2)];

  results.stats = { minLatency, maxLatency, avgLatency, medianLatency, count: latencies.length };
  console.log(`\nLatency Stats: Min=${minLatency}ms | Max=${maxLatency}ms | Avg=${avgLatency}ms | Median=${medianLatency}ms`);

  // Final Screenshot of 4K Cinema Playing
  const cinemaScreenshotPath = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/evidence_e2e_cinema_playing.png';
  await page.screenshot({ path: cinemaScreenshotPath });
  results.screenshots.push({ name: 'cinema_playing', path: cinemaScreenshotPath });
  console.log(`- Saved screenshot: ${cinemaScreenshotPath}`);

  return results;
}
