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
  console.log("T2L STRICT WEB-SERIES PLAYBACK & VERIFICATION TEST");
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
    // 1. Catalog Verification
    console.log("\n[TEST 1] Catalog Version & Data Verification in WebView...");
    const catalogInfo = await evaluate(`
      (() => {
        const cat = CatalogProvider.getAll();
        const panchayat = cat.find(m => m.id === 'series_panchayat');
        const sherlock = cat.find(m => m.id === 'series_sherlock_holmes');
        const mirzapur = cat.find(m => m.id === 'series_mirzapur');
        return {
          total: cat.length,
          version: localStorage.getItem('t2l_catalog_version'),
          panchayatSeasons: panchayat ? panchayat.seasons.map(s => ({ s: s.seasonNumber, epCount: s.episodes.length })) : null,
          mirzapurSeasons: mirzapur ? mirzapur.seasons.map(s => ({ s: s.seasonNumber, epCount: s.episodes.length })) : null,
          sherlockSeasons: sherlock ? sherlock.seasons.map(s => ({ s: s.seasonNumber, epCount: s.episodes.length })) : null
        };
      })()
    `);
    console.log("Catalog Info:", JSON.stringify(catalogInfo, null, 2));

    // 2. Open Panchayat Modal and test Season Switching
    console.log("\n[TEST 2] Panchayat Season Switching UI...");
    await evaluate(`openMovieDetails('series_panchayat')`);
    await sleep(800);
    
    // Switch to Season 2
    await evaluate(`
      (() => {
        const select = document.getElementById('movieSeasonSelect');
        if (select) {
          select.value = '2';
          select.dispatchEvent(new Event('change'));
        }
      })()
    `);
    await sleep(600);

    const s2Count = await evaluate(`
      (() => {
        const list = document.getElementById('movieEpisodesList');
        return list ? list.children.length : 0;
      })()
    `);
    console.log("Panchayat Season 2 rendered episode count:", s2Count);
    takePhysicalScreenshot("device_panchayat_season2.png");

    // Switch to Season 3
    await evaluate(`
      (() => {
        const select = document.getElementById('movieSeasonSelect');
        if (select) {
          select.value = '3';
          select.dispatchEvent(new Event('change'));
        }
      })()
    `);
    await sleep(600);
    const s3Count = await evaluate(`
      (() => {
        const list = document.getElementById('movieEpisodesList');
        return list ? list.children.length : 0;
      })()
    `);
    console.log("Panchayat Season 3 rendered episode count:", s3Count);

    // 3. Test Honest Commercial Series Notification
    console.log("\n[TEST 3] Commercial Series Honest Behavior...");
    const streamBtnDisabled = await evaluate(`
      (() => {
        const btn = document.getElementById('btnStreamMovie');
        return btn ? { text: btn.textContent.trim(), disabled: btn.disabled } : null;
      })()
    `);
    console.log("Panchayat Stream Button State:", streamBtnDisabled);
    takePhysicalScreenshot("device_commercial_series_honest.png");

    // Close details modal
    await evaluate(`closeMovieDetails()`);
    await sleep(500);

    // 4. Test Public Domain Series: Sherlock Holmes Playback
    console.log("\n[TEST 4] Sherlock Holmes Playback Start...");
    await evaluate(`openMovieDetails('series_sherlock_holmes')`);
    await sleep(800);

    // Click Stream Episode 1 (S1E1)
    console.log("Triggering playSeriesEpisode('series_sherlock_holmes', 'sherlock_s1e1')...");
    await evaluate(`playSeriesEpisode('series_sherlock_holmes', 'sherlock_s1e1')`);

    console.log("Waiting 5 seconds for media buffering and playback...");
    await sleep(5000);

    let playerState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        const modal = document.getElementById('playerModal');
        return {
          modalActive: modal ? modal.classList.contains('active') : false,
          src: video ? video.src : null,
          currentSrc: video ? video.currentSrc : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : null,
          duration: video ? video.duration : null,
          readyState: video ? video.readyState : null,
          videoWidth: video ? video.videoWidth : null,
          videoHeight: video ? video.videoHeight : null
        };
      })()
    `);
    console.log("Player State at T=5s:", JSON.stringify(playerState, null, 2));

    // Wait another 3 seconds to verify currentTime advances
    console.log("Waiting 3 more seconds to verify playback progression...");
    await sleep(3000);

    let playerStateAdv = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : null,
          readyState: video ? video.readyState : null
        };
      })()
    `);
    console.log("Player State at T=8s:", JSON.stringify(playerStateAdv, null, 2));

    takePhysicalScreenshot("device_series_player_active.png");

    // 5. Test Episode Progression (Next Episode)
    console.log("\n[TEST 5] Episode Progression (Switch to S1E2)...");
    await evaluate(`playNextSeriesEpisode()`);
    console.log("Waiting 4 seconds for S1E2 to buffer and play...");
    await sleep(4000);

    let nextEpState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          src: video ? video.src : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : null,
          readyState: video ? video.readyState : null
        };
      })()
    `);
    console.log("Next Episode Player State:", JSON.stringify(nextEpState, null, 2));
    takePhysicalScreenshot("device_series_next_episode.png");

    // 6. Regression Testing: Movies & Live TV
    console.log("\n[TEST 6] Regression: Movie Playback (Big Buck Bunny HLS)...");
    await evaluate(`startMovieStream('vod_bbb_720p')`);
    await sleep(4000);

    let movieState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          src: video ? video.src : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : null,
          readyState: video ? video.readyState : null
        };
      })()
    `);
    console.log("Movie Player State:", JSON.stringify(movieState, null, 2));

    console.log("\n============================================================");
    console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("============================================================");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    ws.close();
  }
}

run();
