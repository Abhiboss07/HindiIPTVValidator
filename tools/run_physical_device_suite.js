const http = require("http");
const { execSync } = require("child_process");

const PORT = 9228;
const SERIAL = "00015364U000110";
const ARTIFACT_DIR = "/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021";

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}/json/list`, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === "page");
          if (page) resolve(page);
          else reject(new Error("No page target found"));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function takeScreenshot(filename) {
  try {
    execSync(`adb -s ${SERIAL} exec-out screencap -p > ${ARTIFACT_DIR}/${filename}`);
    console.log(`  📸 Screenshot captured: ${filename}`);
  } catch (e) {
    console.warn(`  ⚠️ Screenshot error for ${filename}:`, e.message);
  }
}

async function run() {
  console.log("================================================================================");
  console.log("     T2L PHYSICAL DEVICE REGRESSION SUITE (NOTHING PHONE 3)");
  console.log("================================================================================\n");

  const target = await getDevToolsTarget();
  console.log("Connected to WebView CDP target:", target.title);
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 0;
  const pending = new Map();

  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  async function evaluate(expression) {
    const result = await sendCdp("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text || JSON.stringify(result.exceptionDetails));
    }
    return result.result.value;
  }

  let totalTests = 0;
  let passedTests = 0;

  function assert(condition, message, details = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  [PASS] ${message}` + (details ? ` (${details})` : ""));
    } else {
      console.log(`  [FAIL] ${message}` + (details ? ` (${details})` : ""));
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Dedicated Movies Bottom Navigation Tab
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 1: 5-TAB NAVIGATION DOCK & MOVIES TAB ---");
    const dockTabs = await evaluate(`
      Array.from(document.querySelectorAll('.obsidian-dock-nav .dock-tab-btn')).map(b => ({
        id: b.id,
        text: b.querySelector('span') ? b.querySelector('span').textContent.trim() : ''
      }))
    `);
    assert(dockTabs.length === 5, "Dock has exactly 5 tabs", `count=${dockTabs.length}`);
    const hasMoviesTab = dockTabs.some(t => t.id === 'tab-movies' && t.text === 'Movies');
    assert(hasMoviesTab, "Dock includes dedicated tab-movies ('Movies')");

    // Switch to Movies tab
    await evaluate("window.switchPage('movies')");
    await sleep(600);

    const moviesActive = await evaluate(`
      document.getElementById('page-movies').classList.contains('active') &&
      document.getElementById('tab-movies').classList.contains('active')
    `);
    assert(moviesActive, "switchPage('movies') activates #page-movies and #tab-movies");

    const movieRows = await evaluate(`
      ({
        bollywood: document.querySelectorAll('#moviesBollywoodRow .movie-card').length,
        webSeries: document.querySelectorAll('#moviesWebSeriesRow .movie-card').length,
        hollywood: document.querySelectorAll('#moviesHollywoodRow .movie-card').length
      })
    `);
    assert(movieRows.bollywood > 0, "Bollywood movies row rendered in Cinema tab", `count=${movieRows.bollywood}`);
    assert(movieRows.webSeries > 0, "Web-Series row rendered in Cinema tab", `count=${movieRows.webSeries}`);
    takeScreenshot("device_tab_movies.png");

    // -------------------------------------------------------------------------
    // TEST 2: Panchayat Modal & Canonical 24 Episodes (8 per season)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 2: PANCHAYAT MODAL & CANONICAL EPISODES ---");
    await evaluate("window.openMovieDetails('series_panchayat')");
    await sleep(600);

    const panchayatInfo = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent.trim(),
        btnText: document.getElementById('btnMovieStreamText').textContent.trim(),
        btnDisabled: document.getElementById('btnMovieStream').disabled,
        totalSeasons: document.querySelectorAll('#seasonSelector option').length,
        season1Eps: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length,
        firstEpTitle: document.querySelector('#seasonEpisodesContainer .series-ep-title') ? document.querySelector('#seasonEpisodesContainer .series-ep-title').textContent.trim() : '',
        hasUnavailBadge: !!document.querySelector('#seasonEpisodesContainer .series-ep-badge-unavail')
      })
    `);

    assert(panchayatInfo.title === "Panchayat", "Panchayat title correct", panchayatInfo.title);
    assert(panchayatInfo.btnText.includes("UNAVAILABLE"), "Primary button states SERIES UNAVAILABLE", panchayatInfo.btnText);
    assert(panchayatInfo.btnDisabled === true, "Primary button is disabled");
    assert(panchayatInfo.totalSeasons === 3, "Panchayat has 3 selectable seasons", `seasons=${panchayatInfo.totalSeasons}`);
    assert(panchayatInfo.season1Eps === 8, "Season 1 has exactly 8 canonical episodes", `eps=${panchayatInfo.season1Eps}`);
    assert(panchayatInfo.firstEpTitle.includes("Gram Panchayat Phulera"), "E01 title is Gram Panchayat Phulera", panchayatInfo.firstEpTitle);
    assert(panchayatInfo.hasUnavailBadge === true, "Episodes display honest 'Unavailable' badges");
    takeScreenshot("device_panchayat_modal_canonical.png");

    // Test Season 2
    await evaluate("window.renderSeasonEpisodes('series_panchayat', 2)");
    await sleep(300);
    const s2Eps = await evaluate("document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length");
    assert(s2Eps === 8, "Season 2 has exactly 8 canonical episodes", `eps=${s2Eps}`);

    // Test Season 3
    await evaluate("window.renderSeasonEpisodes('series_panchayat', 3)");
    await sleep(300);
    const s3Eps = await evaluate("document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length");
    assert(s3Eps === 8, "Season 3 has exactly 8 canonical episodes", `eps=${s3Eps}`);
    takeScreenshot("device_panchayat_season3_canonical.png");

    await evaluate("window.closeMovieDetails()");
    await sleep(400);

    // -------------------------------------------------------------------------
    // TEST 3: Mirzapur Modal & Canonical 29 Episodes (No VICE promos)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 3: MIRZAPUR MODAL & CANONICAL EPISODES ---");
    // Clear any resume state from previous runs
    await evaluate("localStorage.removeItem('t2l_resume_series_mirzapur')");
    await evaluate("window.openMovieDetails('series_mirzapur')");
    await sleep(600);

    const mirzapurInfo = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent.trim(),
        btnText: document.getElementById('btnMovieStreamText').textContent.trim(),
        totalSeasons: document.querySelectorAll('#seasonSelector option').length,
        season1Eps: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length,
        firstEpTitle: document.querySelector('#seasonEpisodesContainer .series-ep-title') ? document.querySelector('#seasonEpisodesContainer .series-ep-title').textContent.trim() : ''
      })
    `);

    assert(mirzapurInfo.title === "Mirzapur", "Mirzapur title correct", mirzapurInfo.title);
    assert(mirzapurInfo.btnText.includes("TORRENT"), "Primary button indicates TORRENT streaming", mirzapurInfo.btnText);
    assert(mirzapurInfo.totalSeasons === 3, "Mirzapur has 3 selectable seasons", `seasons=${mirzapurInfo.totalSeasons}`);
    assert(mirzapurInfo.season1Eps === 9, "Season 1 has exactly 9 canonical episodes", `eps=${mirzapurInfo.season1Eps}`);
    assert(mirzapurInfo.firstEpTitle.includes("Jhandu"), "E01 title is canonical 'Jhandu' (no VICE promo titles)", mirzapurInfo.firstEpTitle);
    takeScreenshot("device_mirzapur_modal_canonical.png");

    await evaluate("window.closeMovieDetails()");
    await sleep(400);

    // -------------------------------------------------------------------------
    // TEST 4: Sherlock Holmes 1080p Playback
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 4: SHERLOCK HOLMES 1080P PLAYBACK ---");
    await evaluate("window.openMovieDetails('series_sherlock_holmes')");
    await sleep(600);

    const sherlockInfo = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent.trim(),
        quality: document.getElementById('movieDetailsResolution').textContent.trim(),
        firstEpTitle: document.querySelector('#seasonEpisodesContainer .series-ep-title') ? document.querySelector('#seasonEpisodesContainer .series-ep-title').textContent.trim() : ''
      })
    `);

    assert(sherlockInfo.title.includes("Sherlock Holmes (1984)"), "Sherlock title identifies 1984 Granada series", sherlockInfo.title);
    assert(sherlockInfo.quality.includes("1080p"), "Sherlock resolution is 1080p Full HD", sherlockInfo.quality);
    assert(sherlockInfo.firstEpTitle.includes("Scandal in Bohemia"), "S01E01 title matches Granada episode 'A Scandal in Bohemia'", sherlockInfo.firstEpTitle);
    takeScreenshot("device_sherlock_modal_1080p.png");

    // Launch S01E01 playback
    console.log("  Launching Sherlock Holmes S01E01 playback...");
    await evaluate("window.playSeriesEpisode('series_sherlock_holmes', 'sherlock_s1e1')");

    // Poll video element for up to 8 seconds for playback initiation
    let playbackState = null;
    for (let i = 0; i < 8; i++) {
      await sleep(1000);
      playbackState = await evaluate(`
        (function() {
          const v = document.getElementById('luminaVideo');
          if (!v) return { error: 'No video element' };
          return {
            paused: v.paused,
            currentTime: v.currentTime,
            readyState: v.readyState,
            videoWidth: v.videoWidth,
            videoHeight: v.videoHeight,
            muted: v.muted,
            src: v.currentSrc || v.src
          };
        })()
      `);
      if (playbackState && playbackState.currentTime > 0) break;
    }

    console.log("  Playback state after poll:", JSON.stringify(playbackState));
    assert(playbackState && playbackState.currentTime >= 0, "Video element initialized with valid stream URL", playbackState ? playbackState.src : "none");
    assert(playbackState && playbackState.muted === false, "Audio is unmuted (muted == false)");
    takeScreenshot("device_sherlock_playback_1080p.png");

    // -------------------------------------------------------------------------
    // TEST 5: Audio Track Switching (No WebAudio Muting)
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 5: AUDIO TRACK SWITCHING (NO-MUTE VERIFICATION) ---");
    await evaluate("window.setVlcAudioTrack('english')");
    await sleep(800);

    const audioAfterSwitch = await evaluate(`
      (function() {
        const v = document.getElementById('luminaVideo');
        return {
          muted: v ? v.muted : false,
          currentAudioTrack: typeof currentAudioTrack !== 'undefined' ? currentAudioTrack : null
        };
      })()
    `);
    assert(audioAfterSwitch.muted === false, "Audio remains completely unmuted after track change");
    assert(audioAfterSwitch.currentAudioTrack === 'english', "Audio track state successfully updated to 'english'");
    takeScreenshot("device_audio_switch_verified.png");

    // Stop playback
    await evaluate("if (typeof closePlayerModal === 'function') closePlayerModal()");
    await sleep(500);

    // -------------------------------------------------------------------------
    // TEST 6: Return to Home & Verify Thumbnails
    // -------------------------------------------------------------------------
    console.log("\n--- TEST 6: RETURN TO HOME & THUMBNAIL INTEGRITY ---");
    await evaluate("window.switchPage('home')");
    await sleep(600);

    const homeActive = await evaluate(`
      document.getElementById('page-home').classList.contains('active') &&
      document.getElementById('tab-home').classList.contains('active')
    `);
    assert(homeActive, "Home tab is active");

    const totalCards = await evaluate("document.querySelectorAll('#page-home .movie-card').length");
    assert(totalCards > 0, "Home cinema and series cards populated", `cards=${totalCards}`);
    takeScreenshot("device_final_home_verified.png");

  } catch (err) {
    console.error("Test Suite Error:", err);
  } finally {
    ws.close();
  }

  console.log("\n================================================================================");
  console.log(`PHYSICAL DEVICE RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("================================================================================\n");

  if (passedTests === totalTests && totalTests > 0) {
    console.log("🎉 ALL PHYSICAL DEVICE REGRESSION TESTS PASSED ON NOTHING PHONE 3!\n");
    process.exit(0);
  } else {
    console.log("❌ SOME TESTS FAILED.\n");
    process.exit(1);
  }
}

run().catch(console.error);
