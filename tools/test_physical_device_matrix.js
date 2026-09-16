const http = require("http");
const fs = require("fs");
const { execSync } = require("child_process");

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:9223/json/list", (res) => {
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

function takePhysicalScreenshot(filename) {
  try {
    execSync(`adb -s 00015364U000110 exec-out screencap -p > /home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/${filename}`);
    console.log(`  [PHYSICAL SCREENSHOT SAVED] ${filename}`);
  } catch (e) {
    console.warn(`  [SCREENSHOT WARNING] Failed ${filename}:`, e.message);
  }
}

async function runDeviceMatrix() {
  console.log("============================================================");
  console.log("NOTHING PHONE 3 - PHYSICAL DEVICE LIVE VOD VERIFICATION");
  console.log("============================================================");

  const target = await getDevToolsTarget();
  console.log("Connected to Physical Target:", target.title);
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
    // 1. Close any open drawer and verify Home Page
    await evaluate(`if (window.isMenuDrawerOpen) toggleMenuDrawer()`);
    await sleep(300);
    await evaluate(`switchPage('home')`);
    await sleep(400);

    console.log("\n--- 1. BOTTOM NAVIGATION DOCK (NO SEPARATE MOVIES TAB) ---");
    const dockTabs = await evaluate(`
      Array.from(document.querySelectorAll('.obsidian-dock-nav .dock-tab-btn')).map(b => b.id)
    `);
    console.log("  Dock buttons on Nothing Phone 3:", JSON.stringify(dockTabs));
    assert(dockTabs.length === 4, `4 dock tabs (found: ${dockTabs.length})`);
    assert(!dockTabs.includes('tab-movies'), "Movies tab removed from dock");
    takePhysicalScreenshot("device_dock_4tabs.png");

    console.log("\n--- 2. HOME EXPERIENCE CINEMA & WEB-SERIES ROWS ---");
    const homeCinema = await evaluate(`
      ({
        bollywoodCards: document.querySelectorAll('#homeBollywoodRow .movie-card').length,
        webSeriesCards: document.querySelectorAll('#homeWebSeriesRow .movie-card').length,
        hollywoodCards: document.querySelectorAll('#homeHollywoodRow .movie-card').length
      })
    `);
    console.log("  Home cinema cards:", JSON.stringify(homeCinema));
    assert(homeCinema.bollywoodCards > 0, `Bollywood row populated (${homeCinema.bollywoodCards} titles)`);
    assert(homeCinema.webSeriesCards > 0, `Web-Series row populated (${homeCinema.webSeriesCards} titles)`);
    assert(homeCinema.hollywoodCards > 0, `Hollywood row populated (${homeCinema.hollywoodCards} titles)`);
    takePhysicalScreenshot("device_home_cinema_rows.png");

    console.log("\n--- 3. HAMBURGER MENU: INSTANT STREAMER ---");
    await evaluate(`openInstantStreamerModal()`);
    await sleep(400);
    const instantModalOpen = await evaluate(`document.getElementById('torrentModal').classList.contains('active')`);
    assert(instantModalOpen, "Instant Streamer modal active");
    takePhysicalScreenshot("device_instant_streamer_modal.png");
    await evaluate(`closeInstantStreamerModal()`);
    await sleep(300);

    console.log("\n--- 4. MOVIE DETAILS: KALKI 2898 AD (SD 480P QUALITY SELECTOR) ---");
    await evaluate(`openMovieDetails('vod_kalki_2898_ad')`);
    await sleep(400);
    const kalkiData = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent,
        qualityBadge: document.getElementById('movieDetailsActiveQualityBadge').textContent,
        btnText: document.getElementById('btnMovieStreamText').textContent
      })
    `);
    console.log("  Kalki details on device:", JSON.stringify(kalkiData));
    assert(kalkiData.qualityBadge.includes("SD 480p"), `Honest SD 480p badge: ${kalkiData.qualityBadge}`);
    assert(kalkiData.btnText.includes("SD 480p"), `Stream button reflects SD 480p: ${kalkiData.btnText}`);
    takePhysicalScreenshot("device_kalki_sd480p_modal.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(300);

    console.log("\n--- 5. MOVIE DETAILS: ADAPTIVE HLS (BIG BUCK BUNNY) ---");
    await evaluate(`openMovieDetails('vod_bbb_720p')`);
    await sleep(400);
    const bbbData = await evaluate(`
      ({
        title: document.getElementById('movieDetailsTitle').textContent,
        qualityBadge: document.getElementById('movieDetailsActiveQualityBadge').textContent,
        pillsCount: document.querySelectorAll('#movieQualityPillsContainer .movie-quality-pill').length
      })
    `);
    console.log("  Big Buck Bunny on device:", JSON.stringify(bbbData));
    assert(bbbData.qualityBadge.includes("Auto"), `Default quality Auto: ${bbbData.qualityBadge}`);
    assert(bbbData.pillsCount >= 4, `Adaptive pills present: ${bbbData.pillsCount}`);
    takePhysicalScreenshot("device_bbb_adaptive_modal.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(300);

    console.log("\n--- 6. PLAYBACK LAUNCH & IN-PLAYER DYNAMIC QUALITY ---");
    await evaluate(`startMovieStream('vod_bbb_720p')`);
    await sleep(2200);
    const isPlayerOpen = await evaluate(`document.getElementById('playerModal').classList.contains('active')`);
    assert(isPlayerOpen, "Player modal open and streaming active");

    await evaluate(`openVlcQualityModal()`);
    await sleep(500);
    const vlcRows = await evaluate(`document.querySelectorAll('#vlcQualityOptionsList .vlc-radio-row').length`);
    assert(vlcRows > 0, `Dynamic VLC quality options rendered: ${vlcRows}`);
    takePhysicalScreenshot("device_vlc_player_dynamic_quality.png");
    await evaluate(`closeVlcQualityModal()`);
    await sleep(300);

    // Pause player
    await evaluate(`if (window.videoElement) window.videoElement.pause()`);

    console.log("\n============================================================");
    console.log(`DEVICE TESTS: ${passedTests} / ${totalTests} PASSED!`);
    console.log("============================================================");
    process.exit(0);
  } catch (e) {
    console.error("Device test failed:", e);
    process.exit(1);
  } finally {
    ws.close();
  }
}

runDeviceMatrix();
