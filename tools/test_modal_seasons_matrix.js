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
  console.log("T2L MODAL SEASONS & EPISODES UI VERIFICATION MATRIX");
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
    // Ensure player modal is closed
    console.log("\n[SETUP] Closing player modal if open...");
    await evaluate(`
      (() => {
        if (typeof closePlayerModal === 'function') closePlayerModal();
        const player = document.getElementById('playerModal');
        if (player) {
          player.classList.remove('active');
          player.style.display = 'none';
        }
        const video = document.getElementById('videoElement') || document.querySelector('video');
        if (video) {
          video.pause();
          video.src = '';
        }
      })()
    `);
    await sleep(500);

    // 1. Panchayat Modal Test
    console.log("\n[TEST 1] Opening Panchayat Modal...");
    await evaluate(`openMovieDetails('series_panchayat')`);
    await sleep(800);

    const panchayatS1Info = await evaluate(`
      (() => {
        const btnText = document.getElementById('btnMovieStreamText');
        const btn = document.getElementById('btnMovieStream');
        const sel = document.getElementById('seasonSelector');
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        const firstEp = eps.length > 0 ? eps[0] : null;
        const titleEl = firstEp ? firstEp.querySelector('.series-ep-title') : null;
        const durEl = firstEp ? firstEp.querySelector('.series-ep-duration') : null;
        return {
          streamBtnText: btnText ? btnText.textContent.trim() : null,
          streamBtnDisabled: btn ? btn.disabled : null,
          selectorValue: sel ? sel.value : null,
          epCount: eps.length,
          firstEpTitle: titleEl ? titleEl.textContent.trim() : null,
          firstEpDuration: durEl ? durEl.textContent.trim() : null
        };
      })()
    `);
    console.log("Panchayat S1 Info:", JSON.stringify(panchayatS1Info, null, 2));

    // Switch Panchayat to Season 2
    console.log("\n[TEST 2] Switching Panchayat to Season 2...");
    await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        if (sel) {
          sel.value = '2';
          renderSeasonEpisodes('series_panchayat', 2);
        }
      })()
    `);
    await sleep(600);

    const panchayatS2Info = await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        return {
          selectorValue: sel ? sel.value : null,
          epCount: eps.length,
          firstEpTitle: eps.length > 0 ? eps[0].querySelector('.series-ep-title').textContent.trim() : null,
          lastEpTitle: eps.length > 0 ? eps[eps.length - 1].querySelector('.series-ep-title').textContent.trim() : null
        };
      })()
    `);
    console.log("Panchayat S2 Info:", JSON.stringify(panchayatS2Info, null, 2));
    takePhysicalScreenshot("device_panchayat_season2.png");

    // Switch Panchayat to Season 3
    console.log("\n[TEST 3] Switching Panchayat to Season 3...");
    await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        if (sel) {
          sel.value = '3';
          renderSeasonEpisodes('series_panchayat', 3);
        }
      })()
    `);
    await sleep(600);

    const panchayatS3Info = await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        return {
          selectorValue: sel ? sel.value : null,
          epCount: eps.length,
          firstEpTitle: eps.length > 0 ? eps[0].querySelector('.series-ep-title').textContent.trim() : null,
          lastEpTitle: eps.length > 0 ? eps[eps.length - 1].querySelector('.series-ep-title').textContent.trim() : null
        };
      })()
    `);
    console.log("Panchayat S3 Info:", JSON.stringify(panchayatS3Info, null, 2));
    takePhysicalScreenshot("device_panchayat_season3.png");

    // Close Panchayat modal
    await evaluate(`closeMovieDetails()`);
    await sleep(500);

    // 2. Mirzapur Modal Test (S1 9 eps, S2 10 eps, S3 10 eps)
    console.log("\n[TEST 4] Opening Mirzapur Modal...");
    await evaluate(`openMovieDetails('series_mirzapur')`);
    await sleep(800);

    const mirzapurInfo = await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        const options = sel ? Array.from(sel.options).map(o => ({ val: o.value, text: o.textContent })) : [];
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        return {
          options,
          s1EpCount: eps.length,
          s1FirstEp: eps.length > 0 ? eps[0].querySelector('.series-ep-title').textContent.trim() : null
        };
      })()
    `);
    console.log("Mirzapur S1 Info:", JSON.stringify(mirzapurInfo, null, 2));

    // Switch to Mirzapur S2
    await evaluate(`renderSeasonEpisodes('series_mirzapur', 2)`);
    await sleep(500);
    const mirzapurS2Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
    console.log("Mirzapur S2 Episode Count:", mirzapurS2Count);

    // Switch to Mirzapur S3
    await evaluate(`renderSeasonEpisodes('series_mirzapur', 3)`);
    await sleep(500);
    const mirzapurS3Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
    console.log("Mirzapur S3 Episode Count:", mirzapurS3Count);
    takePhysicalScreenshot("device_mirzapur_season3.png");

    // Close Mirzapur modal
    await evaluate(`closeMovieDetails()`);
    await sleep(500);

    // 3. Sherlock Holmes Modal Test (Playable Series)
    console.log("\n[TEST 5] Opening Sherlock Holmes Modal...");
    await evaluate(`openMovieDetails('series_sherlock_holmes')`);
    await sleep(800);

    const sherlockS1Info = await evaluate(`
      (() => {
        const btnText = document.getElementById('btnMovieStreamText');
        const btn = document.getElementById('btnMovieStream');
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        const firstStreamBtn = eps.length > 0 ? eps[0].querySelector('.series-ep-play-btn') : null;
        return {
          streamBtnText: btnText ? btnText.textContent.trim() : null,
          streamBtnDisabled: btn ? btn.disabled : null,
          s1EpCount: eps.length,
          firstEpTitle: eps.length > 0 ? eps[0].querySelector('.series-ep-title').textContent.trim() : null,
          firstEpPlayable: firstStreamBtn ? !firstStreamBtn.disabled : false,
          firstEpPlayText: firstStreamBtn ? firstStreamBtn.textContent.trim() : null
        };
      })()
    `);
    console.log("Sherlock Holmes S1 Info:", JSON.stringify(sherlockS1Info, null, 2));

    // Switch Sherlock Holmes to Season 2
    console.log("\n[TEST 6] Switching Sherlock Holmes to Season 2...");
    await evaluate(`
      (() => {
        const sel = document.getElementById('seasonSelector');
        if (sel) {
          sel.value = '2';
          renderSeasonEpisodes('series_sherlock_holmes', 2);
        }
      })()
    `);
    await sleep(600);

    const sherlockS2Info = await evaluate(`
      (() => {
        const eps = document.querySelectorAll('#seasonEpisodesContainer .series-ep-item');
        return {
          s2EpCount: eps.length,
          firstEpTitle: eps.length > 0 ? eps[0].querySelector('.series-ep-title').textContent.trim() : null,
          lastEpTitle: eps.length > 0 ? eps[eps.length - 1].querySelector('.series-ep-title').textContent.trim() : null
        };
      })()
    `);
    console.log("Sherlock Holmes S2 Info:", JSON.stringify(sherlockS2Info, null, 2));
    takePhysicalScreenshot("device_sherlock_season2.png");

    console.log("\n============================================================");
    console.log("MODAL SEASONS & EPISODES MATRIX COMPLETE!");
    console.log("============================================================");

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    ws.close();
  }
}

run();
