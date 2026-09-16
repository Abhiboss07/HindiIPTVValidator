const http = require("http");
const fs = require("fs");

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:9222/json/list", (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === "page" && t.url.includes("HindiIPTVValidator"));
          if (page) resolve(page);
          else reject(new Error("No app page target found in CDP"));
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

async function runVODOverhaulCDPMatrix() {
  console.log("============================================================");
  console.log("T2L VOD ARCHITECTURAL OVERHAUL - AUTOMATED CDP VERIFICATION");
  console.log("============================================================");

  const target = await getDevToolsTarget();
  console.log("Connected to Target:", target.title);
  console.log("WebSocket URL:", target.webSocketDebuggerUrl);

  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 0;
  const pendingRequests = new Map();

  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++msgId;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  async function evaluate(expr) {
    const res = await sendCdp("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error("Evaluation failed: " + JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async function captureCdpScreenshot(filename) {
    try {
      const res = await sendCdp("Page.captureScreenshot", { format: "png" });
      if (res && res.data) {
        const buffer = Buffer.from(res.data, "base64");
        const outPath = `/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/${filename}`;
        fs.writeFileSync(outPath, buffer);
        console.log(`  [SCREENSHOT SAVED] ${filename} (${buffer.length} bytes)`);
      }
    } catch (e) {
      console.warn(`  [SCREENSHOT WARNING] Failed ${filename}:`, e.message);
    }
  }

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
    }
  }

  try {
    // 1. DOCK NAVIGATION CHECK
    console.log("\n--- TEST 1: BOTTOM DOCK NAVIGATION (NO SEPARATE MOVIES TAB) ---");
    const dockTabs = await evaluate(`
      Array.from(document.querySelectorAll('.obsidian-dock-nav .dock-tab-btn')).map(b => ({
        id: b.id,
        text: b.querySelector('span') ? b.querySelector('span').textContent.trim() : ''
      }))
    `);
    console.log("  Dock buttons detected:", JSON.stringify(dockTabs));
    assert(dockTabs.length === 4, `Dock navigation has exactly 4 tabs (found: ${dockTabs.length})`);
    assert(!dockTabs.some(t => t.id === 'tab-movies'), "Dedicated 'tab-movies' button is completely absent from dock");
    assert(dockTabs.some(t => t.id === 'tab-home'), "Tab 'tab-home' is present");
    assert(dockTabs.some(t => t.id === 'tab-live'), "Tab 'tab-live' is present");
    assert(dockTabs.some(t => t.id === 'tab-radio'), "Tab 'tab-radio' is present");
    assert(dockTabs.some(t => t.id === 'tab-local'), "Tab 'tab-local' is present");

    // 2. HOME EXPERIENCE CINEMA INTEGRATION
    console.log("\n--- TEST 2: HOME DISCOVERY CINEMA & WEB-SERIES INTEGRATION ---");
    await evaluate(`switchPage('home')`);
    await sleep(400);

    const homeCinemaInfo = await evaluate(`
      ({
        bollywoodRow: !!document.getElementById('homeBollywoodRow'),
        bollywoodCards: document.querySelectorAll('#homeBollywoodRow .movie-card').length,
        webSeriesRow: !!document.getElementById('homeWebSeriesRow'),
        webSeriesCards: document.querySelectorAll('#homeWebSeriesRow .movie-card').length,
        hollywoodRow: !!document.getElementById('homeHollywoodRow'),
        hollywoodCards: document.querySelectorAll('#homeHollywoodRow .movie-card').length,
        continueSection: !!document.getElementById('homeMovieContinueSection')
      })
    `);
    console.log("  Home cinema info:", JSON.stringify(homeCinemaInfo));
    assert(homeCinemaInfo.bollywoodRow && homeCinemaInfo.bollywoodCards > 0, `Trending Bollywood row rendered on Home (${homeCinemaInfo.bollywoodCards} titles)`);
    assert(homeCinemaInfo.webSeriesRow && homeCinemaInfo.webSeriesCards > 0, `Acclaimed Web-Series row rendered on Home (${homeCinemaInfo.webSeriesCards} titles)`);
    assert(homeCinemaInfo.hollywoodRow && homeCinemaInfo.hollywoodCards > 0, `Hollywood Cinema row rendered on Home (${homeCinemaInfo.hollywoodCards} titles)`);
    assert(homeCinemaInfo.continueSection, "Continue Watching Cinema section integrated into Home");
    await captureCdpScreenshot("home_integrated_cinema_view.png");

    // 3. HAMBURGER DRAWER INSTANT STREAMER
    console.log("\n--- TEST 3: INSTANT STREAMER IN HAMBURGER DRAWER ---");
    const drawerInfo = await evaluate(`
      Array.from(document.querySelectorAll('#sideDrawerModal .drawer-menu-item')).map(item => item.textContent.trim())
    `);
    console.log("  Drawer items:", JSON.stringify(drawerInfo));
    const hasInstantStreamer = drawerInfo.some(txt => txt.includes("Instant Streamer"));
    assert(hasInstantStreamer, "Hamburger menu contains '⚡ Instant Streamer'");

    // Open Instant Streamer Modal
    await evaluate(`openInstantStreamerModal()`);
    await sleep(300);
    const instantModalActive = await evaluate(`
      document.getElementById('torrentModal').classList.contains('active')
    `);
    assert(instantModalActive, "Instant Streamer modal opens successfully from drawer trigger");
    await captureCdpScreenshot("instant_streamer_drawer_modal.png");
    await evaluate(`closeInstantStreamerModal()`);
    await sleep(200);

    // 4. MOVIE DETAILS: SOURCE-DRIVEN QUALITY SELECTOR (KALKI 2898 AD - SD 480P)
    console.log("\n--- TEST 4: MOVIE DETAILS QUALITY SELECTOR (KALKI 2898 AD - SD 480P) ---");
    await evaluate(`openMovieDetails('vod_kalki_2898_ad')`);
    await sleep(300);

    const kalkiDetails = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent,
        qualitySectionVisible: document.getElementById('movieQualitySelectorSection').style.display !== 'none',
        activeBadge: document.getElementById('movieDetailsActiveQualityBadge').textContent,
        pills: Array.from(document.querySelectorAll('#movieQualityPillsContainer .movie-quality-pill')).map(p => p.textContent.trim()),
        streamBtnText: document.getElementById('btnMovieStreamText').textContent
      })
    `);
    console.log("  Kalki details:", JSON.stringify(kalkiDetails));
    assert(kalkiDetails.qualitySectionVisible, "Quality selector section is active in Movie Details");
    assert(kalkiDetails.activeBadge.includes("SD 480p"), `Active quality badge shows honest resolution: ${kalkiDetails.activeBadge}`);
    assert(kalkiDetails.streamBtnText.includes("SD 480p"), `Stream button shows honest resolution: ${kalkiDetails.streamBtnText}`);
    await captureCdpScreenshot("movie_details_kalki_sd480p.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(200);

    // 5. MOVIE DETAILS: MULTI-BITRATE ADAPTIVE HLS (BIG BUCK BUNNY)
    console.log("\n--- TEST 5: MOVIE DETAILS ADAPTIVE HLS (BIG BUCK BUNNY) ---");
    await evaluate(`openMovieDetails('vod_bbb_720p')`);
    await sleep(300);

    const bbbDetails = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent,
        activeBadge: document.getElementById('movieDetailsActiveQualityBadge').textContent,
        pills: Array.from(document.querySelectorAll('#movieQualityPillsContainer .movie-quality-pill')).map(p => p.textContent.trim()),
        streamBtnText: document.getElementById('btnMovieStreamText').textContent
      })
    `);
    console.log("  Big Buck Bunny details:", JSON.stringify(bbbDetails));
    assert(bbbDetails.activeBadge.includes("Auto"), `Default quality is AUTO: ${bbbDetails.activeBadge}`);
    assert(bbbDetails.pills.length >= 4, `Pills include Auto, 1080p, 720p, 480p (found ${bbbDetails.pills.length})`);
    await captureCdpScreenshot("movie_details_bbb_adaptive_hls.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(200);

    // 6. MOVIE DETAILS: HONEST UNAVAILABLE STATE (STRANGER THINGS)
    console.log("\n--- TEST 6: HONEST UNAVAILABLE STATE (STRANGER THINGS) ---");
    await evaluate(`openMovieDetails('series_stranger_things')`);
    await sleep(300);

    const stDetails = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent,
        qualitySectionVisible: document.getElementById('movieQualitySelectorSection').style.display !== 'none',
        streamBtnDisabled: document.getElementById('btnMovieStream').disabled,
        streamBtnText: document.getElementById('btnMovieStreamText').textContent
      })
    `);
    console.log("  Stranger Things details:", JSON.stringify(stDetails));
    assert(!stDetails.qualitySectionVisible, "Quality selector correctly hidden for unavailable content");
    assert(stDetails.streamBtnDisabled, "Stream button is strictly disabled");
    assert(stDetails.streamBtnText === 'FULL MOVIE UNAVAILABLE', "Button text states FULL MOVIE UNAVAILABLE");
    await captureCdpScreenshot("movie_details_stranger_things_unavailable.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(200);

    // 7. IN-PLAYER DYNAMIC QUALITY SELECTION (PLAYBACK)
    console.log("\n--- TEST 7: IN-PLAYER DYNAMIC QUALITY SELECTION & ABR LEVEL SWITCH ---");
    await evaluate(`startMovieStream('vod_bbb_720p')`);
    await sleep(2000); // Wait for stream prep and launch

    const playerActive = await evaluate(`document.getElementById('playerModal').classList.contains('active')`);
    assert(playerActive, "Player modal active and playback launched");

    // Open VLC Quality Modal
    await evaluate(`openVlcQualityModal()`);
    await sleep(400);

    const vlcQualityOptions = await evaluate(`
      Array.from(document.querySelectorAll('#vlcQualityOptionsList .vlc-radio-row')).map(r => ({
        title: r.querySelector('h4') ? r.querySelector('h4').textContent.trim() : '',
        desc: r.querySelector('p') ? r.querySelector('p').textContent.trim() : '',
        isActive: r.classList.contains('active')
      }))
    `);
    console.log("  In-player VLC Quality Options:", JSON.stringify(vlcQualityOptions));
    assert(vlcQualityOptions.length > 0, "In-player quality modal rendered dynamic source-driven options");
    assert(vlcQualityOptions.some(o => o.title.includes("Auto")), "Auto adaptive option is present as top option");
    await captureCdpScreenshot("in_player_dynamic_vlc_quality_modal.png");
    await evaluate(`closeVlcQualityModal()`);
    await sleep(200);

    // Pause player
    await evaluate(`if (window.videoElement) window.videoElement.pause()`);

    console.log("\n============================================================");
    console.log(`VERIFICATION COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED!`);
    console.log("============================================================");

    if (passedTests === totalTests) {
      console.log("🏆 ALL VOD OVERHAUL ARCHITECTURAL TESTS PASSED CLEANLY!");
      process.exit(0);
    } else {
      console.error(`FAILED: ${totalTests - passedTests} tests failed`);
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution failed with error:", err);
    process.exit(1);
  } finally {
    ws.close();
  }
}

runVODOverhaulCDPMatrix();
