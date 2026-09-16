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

function takePhysicalScreenshot(filename) {
  try {
    execSync(`adb -s ${SERIAL} exec-out screencap -p > ${ARTIFACT_DIR}/${filename}`);
    console.log(`  [SCREENSHOT] Saved ${filename}`);
  } catch (e) {
    console.warn(`  [SCREENSHOT WARNING] Failed ${filename}:`, e.message);
  }
}

async function run() {
  console.log("============================================================");
  console.log("T2L NEGATIVE TESTING & LIVE TV REGRESSION");
  console.log("Device: Nothing Phone 3 (" + SERIAL + ")");
  console.log("============================================================");

  // Bring app to foreground
  execSync(`adb -s ${SERIAL} shell am start -n com.aakashstream.app/.MainActivity`);
  await sleep(1000);

  const target = await getDevToolsTarget();
  console.log("Connected to Target:", target.title);
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

  async function evaluate(expression) {
    const res = await sendCdp("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  try {
    // 1. Negative Test: Call playSeriesEpisode on unavailable episode
    console.log("\n[TEST 1] Testing playSeriesEpisode on unavailable episode ('series_panchayat', 'panchayat_s2e3')...");
    const unavailResult = await evaluate(`
      (() => {
        let toastMsg = null;
        const origShowToast = window.showToast;
        window.showToast = function(msg) {
          toastMsg = msg;
          if (origShowToast) origShowToast(msg);
        };

        playSeriesEpisode('series_panchayat', 'panchayat_s2e3');

        const player = document.getElementById('playerModal');
        const isActive = player ? player.classList.contains('active') : false;
        return {
          toast: toastMsg,
          playerModalActive: isActive
        };
      })()
    `);
    console.log("Unavailable Episode Play Result:", JSON.stringify(unavailResult, null, 2));

    // 2. Negative Test: Call handleStreamMovieClick on unavailable series
    console.log("\n[TEST 2] Testing handleStreamMovieClick on unavailable series...");
    const seriesClickResult = await evaluate(`
      (() => {
        let toastMsg = null;
        const origShowToast = window.showToast;
        window.showToast = function(msg) {
          toastMsg = msg;
          if (origShowToast) origShowToast(msg);
        };

        const panchayat = CatalogProvider.getById('series_panchayat');
        handleStreamMovieClick(panchayat);

        const player = document.getElementById('playerModal');
        const isActive = player ? player.classList.contains('active') : false;
        return {
          toast: toastMsg,
          playerModalActive: isActive
        };
      })()
    `);
    console.log("Unavailable Series Click Result:", JSON.stringify(seriesClickResult, null, 2));

    // 3. Regression: Live TV Playback
    console.log("\n[TEST 3] Testing Live TV Playback...");
    // Switch to Live tab and play first channel
    await evaluate(`
      (() => {
        if (typeof switchPage === 'function') switchPage('live');
        const firstCh = Array.isArray(window.channels) && window.channels.length > 0 ? window.channels[0] : null;
        if (firstCh && typeof playChannel === 'function') {
          playChannel(firstCh);
        }
      })()
    `);

    console.log("Waiting 5 seconds for Live TV playback buffer...");
    await sleep(5000);

    const liveTvState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        const player = document.getElementById('playerModal');
        return {
          playerActive: player ? player.classList.contains('active') : false,
          src: video ? video.src : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : null,
          readyState: video ? video.readyState : null
        };
      })()
    `);
    console.log("Live TV Player State at T=5s:", JSON.stringify(liveTvState, null, 2));

    if (liveTvState.playerActive) {
      takePhysicalScreenshot("device_livetv_active.png");
    }

    console.log("\n============================================================");
    console.log("NEGATIVE & REGRESSION TESTS COMPLETE!");
    console.log("============================================================");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    ws.close();
  }
}

run();
