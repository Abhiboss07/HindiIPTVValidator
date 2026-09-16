const http = require("http");
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
    console.log(`  📸 [SCREENSHOT SAVED] ${filename}`);
  } catch (e) {
    console.warn(`  ⚠️ [SCREENSHOT WARNING] Failed ${filename}:`, e.message);
  }
}

async function runAuditFixesVerification() {
  console.log("============================================================");
  console.log("PHYSICAL DEVICE VERIFICATION — AUDIT FIXES");
  console.log("Device: Nothing Phone 3 (00015364U000110)");
  console.log("============================================================");

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
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  };

  await new Promise(resolve => ws.onopen = resolve);
  await sendCdp("Runtime.enable");
  await sendCdp("DOM.enable");

  async function evaluate(expr) {
    const res = await sendCdp("Runtime.evaluate", { expression: expr, returnByValue: true });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  const results = [];
  function assert(testName, condition, details) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName} — ${details}`);
      results.push({ testName, status: "PASS", details });
    } else {
      console.error(`  ❌ FAIL: ${testName} — ${details}`);
      results.push({ testName, status: "FAIL", details });
    }
  }

  // 1. Catalog Version & Loading Test
  console.log("\n[TEST 1] Catalog Version & Cache Validation");
  await evaluate("CatalogProvider.load()");
  await sleep(1000);
  const catVersion = await evaluate("localStorage.getItem('t2l_catalog_version')");
  const movieCount = await evaluate("CatalogProvider.getAll().length");
  assert("Catalog Version Bump", catVersion === "5", `Catalog version in localStorage is ${catVersion}`);
  assert("Catalog Loaded Count", movieCount === 52, `Catalog loaded exactly ${movieCount} items`);

  // 2. Thumbnail lazy loading test
  console.log("\n[TEST 2] Thumbnail Lazy Loading Validation");
  const eagerThumbs = await evaluate("document.querySelectorAll('.movie-card-thumb[loading=\"eager\"]').length");
  const lazyThumbs = await evaluate("document.querySelectorAll('.movie-card-thumb[loading=\"lazy\"]').length");
  assert("No Eager Thumbnails", eagerThumbs === 0, `Eager loading thumbnails count: ${eagerThumbs}`);
  assert("Lazy Thumbnails Active", lazyThumbs > 0, `Lazy loading thumbnails count: ${lazyThumbs}`);

  // 3. Unavailable Visual Indicator Test
  console.log("\n[TEST 3] Unavailable Movie Cards Styling");
  const unavailCards = await evaluate("document.querySelectorAll('.movie-card.is-unavailable').length");
  assert("Unavailable Cards Tagged", unavailCards >= 25, `Found ${unavailCards} unavailable movie cards with .is-unavailable class`);
  takePhysicalScreenshot("audit_verify_home_cinema_rows.png");

  // 4. Kalki 2898 AD (Direct Stream MP4) Verification
  console.log("\n[TEST 4] Direct Stream MP4 Modal (Kalki 2898 AD)");
  await evaluate("openMovieDetails('vod_kalki_2898_ad')");
  await sleep(600);
  const kalkiSwarmVisible = await evaluate("document.getElementById('movieDetailsSwarmBadge').style.display !== 'none'");
  const kalkiDownloadVisible = await evaluate("document.getElementById('btnMovieDownload').style.display !== 'none'");
  const kalkiQualityPillText = await evaluate("document.querySelector('#movieQualityPillsContainer .movie-quality-pill').innerText");
  assert("Swarm Badge Hidden for Non-Torrent", !kalkiSwarmVisible, `Kalki swarm badge visible: ${kalkiSwarmVisible}`);
  assert("Download Button Visible for Direct MP4", kalkiDownloadVisible, `Kalki download button visible: ${kalkiDownloadVisible}`);
  assert("Honest Quality Pill Label", kalkiQualityPillText.includes("Direct Stream") || kalkiQualityPillText.includes("SD 480p"), `Pill label: ${kalkiQualityPillText.replace(/\n/g, ' ')}`);
  takePhysicalScreenshot("audit_verify_kalki_direct_mp4.png");

  // 5. Test Download Button on Kalki (Triggers HTTP Download)
  console.log("\n[TEST 5] HTTP Download Execution (Kalki 2898 AD)");
  const downloadResult = await evaluate(`
    (() => {
      let toastMsg = '';
      const origShowToast = window.showToast;
      window.showToast = (msg) => { toastMsg = msg; if (origShowToast) origShowToast(msg); };
      handleDownloadMovieClick();
      return toastMsg;
    })()
  `);
  assert("Download Started Feedback", downloadResult.includes("Download Started") || downloadResult.includes("Download"), `Toast feedback: "${downloadResult}"`);
  takePhysicalScreenshot("audit_verify_download_toast.png");

  // 6. Stranger Things (Unavailable Series) Verification
  console.log("\n[TEST 6] Unavailable Content Modal (Stranger Things)");
  await evaluate("openMovieDetails('series_stranger_things')");
  await sleep(600);
  const stSwarmVisible = await evaluate("document.getElementById('movieDetailsSwarmBadge').style.display !== 'none'");
  const stDownloadVisible = await evaluate("document.getElementById('btnMovieDownload').style.display !== 'none'");
  const stStreamBtnText = await evaluate("document.getElementById('btnMovieStreamText').innerText");
  const stQualityVisible = await evaluate("document.getElementById('movieQualitySelectorSection').style.display !== 'none'");
  assert("Swarm Badge Hidden for Unavailable", !stSwarmVisible, `Stranger Things swarm visible: ${stSwarmVisible}`);
  assert("Download Button Hidden for Unavailable", !stDownloadVisible, `Stranger Things download visible: ${stDownloadVisible}`);
  assert("Quality Selector Hidden for Unavailable", !stQualityVisible, `Quality selector visible: ${stQualityVisible}`);
  assert("Stream Button Shows Unavailable", stStreamBtnText.includes("UNAVAILABLE"), `Stream button text: "${stStreamBtnText}"`);
  takePhysicalScreenshot("audit_verify_stranger_things_unavailable.png");

  // 7. Mirzapur (Torrent S1 + Incomplete S2/S3) Episode Isolation Test
  console.log("\n[TEST 7] Mirzapur Episode Isolation");
  await evaluate("openMovieDetails('series_mirzapur')");
  await sleep(600);
  const mirzapurSwarmVisible = await evaluate("document.getElementById('movieDetailsSwarmBadge').style.display !== 'none'");
  const mirzapurDownloadVisible = await evaluate("document.getElementById('btnMovieDownload').style.display !== 'none'");
  const mirzapurMagnetVisible = await evaluate("document.getElementById('btnMovieMagnetCopy').style.display !== 'none'");
  assert("Swarm Badge Visible for Real Torrent", mirzapurSwarmVisible, `Mirzapur swarm badge visible: ${mirzapurSwarmVisible}`);
  assert("Download Button Visible for Torrent", mirzapurDownloadVisible, `Mirzapur download visible: ${mirzapurDownloadVisible}`);
  assert("Magnet Copy Button Visible", mirzapurMagnetVisible, `Magnet copy button visible: ${mirzapurMagnetVisible}`);

  // Test S1 Episode 1 Stream button
  const s1Playable = await evaluate(`
    (() => {
      const ep1 = document.querySelector('#seasonEpisodesContainer .series-ep-item');
      return ep1 ? !ep1.classList.contains('series-ep-unavailable') : false;
    })()
  `);
  assert("Mirzapur S1E1 Is Playable", s1Playable, `S1E1 is playable: ${s1Playable}`);

  // Select Season 2 and verify S2E1 is UNAVAILABLE
  await evaluate("renderSeasonEpisodes('series_mirzapur', 2)");
  await sleep(300);
  const s2Unavailable = await evaluate(`
    (() => {
      const ep = document.querySelector('#seasonEpisodesContainer .series-ep-item');
      return ep ? ep.classList.contains('series-ep-unavailable') : false;
    })()
  `);
  assert("Mirzapur S2E1 Marked Unavailable", s2Unavailable, `S2E1 marked unavailable: ${s2Unavailable}`);

  // Attempt to play S2E1 and verify it does NOT play S1 torrent
  const s2ClickToast = await evaluate(`
    (() => {
      let toastMsg = '';
      const origShowToast = window.showToast;
      window.showToast = (msg) => { toastMsg = msg; if (origShowToast) origShowToast(msg); };
      playSeriesEpisode('series_mirzapur', 'mirzapur_s2e1');
      return toastMsg;
    })()
  `);
  assert("Mirzapur S2E1 Rejection Toast", s2ClickToast.includes("not available"), `Clicking S2E1 gave toast: "${s2ClickToast}"`);
  takePhysicalScreenshot("audit_verify_mirzapur_episodes.png");

  // 8. Stree 2 (Trailer Only) Verification
  console.log("\n[TEST 8] Trailer Only Modal (Stree 2)");
  await evaluate("openMovieDetails('vod_stree_2')");
  await sleep(600);
  const stree2SwarmVisible = await evaluate("document.getElementById('movieDetailsSwarmBadge').style.display !== 'none'");
  const stree2DownloadVisible = await evaluate("document.getElementById('btnMovieDownload').style.display !== 'none'");
  const stree2StreamBtnText = await evaluate("document.getElementById('btnMovieStreamText').innerText");
  assert("Stree 2 Swarm Badge Hidden", !stree2SwarmVisible, `Stree 2 swarm visible: ${stree2SwarmVisible}`);
  assert("Stree 2 Download Button Hidden", !stree2DownloadVisible, `Stree 2 download visible: ${stree2DownloadVisible}`);
  assert("Stree 2 Stream Button Says Trailer", stree2StreamBtnText.includes("TRAILER"), `Button text: "${stree2StreamBtnText}"`);
  takePhysicalScreenshot("audit_verify_stree2_trailer.png");

  // 9. Close modal and return to clean state
  await evaluate("closeMovieDetails()");
  await sleep(400);

  console.log("\n============================================================");
  console.log(`VERIFICATION COMPLETE: ${results.filter(r => r.status === 'PASS').length}/${results.length} PASS`);
  console.log("============================================================");

  ws.close();
}

runAuditFixesVerification().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
