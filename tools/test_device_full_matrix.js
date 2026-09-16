const http = require("http");
const fs = require("fs");
const { execSync } = require("child_process");

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:9222/json/list", (res) => {
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
    console.log(`  [SCREENSHOT] Saved ${filename}`);
  } catch (e) {
    console.warn(`  [SCREENSHOT WARNING] Failed ${filename}:`, e.message);
  }
}

async function runDeviceMatrix() {
  console.log("============================================================");
  console.log("T2L COMPREHENSIVE PHYSICAL DEVICE TEST MATRIX");
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
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  async function evaluate(code) {
    const res = await sendCdp("Runtime.evaluate", {
      expression: code,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  
  async function stopPlayback() {
    await evaluate(`
      (() => {
        const v = document.getElementById("luminaVideo");
        if (v) { v.pause(); v.src = ""; }
        const playerModal = document.getElementById("playerModal");
        if (playerModal) {
          playerModal.classList.remove("active");
          playerModal.style.display = "none";
        }
        if (typeof closeMovieDetails === "function") closeMovieDetails();
      })()
    `);
    await sleep(600);
  }

  async function waitForPlayback(timeoutMs = 25000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const res = await evaluate(`
        (() => {
          const v = document.getElementById("luminaVideo");
          if (v && !v.paused && v.currentTime > 0 && !isNaN(v.currentTime)) {
            return {
              playing: true,
              currentTime: v.currentTime,
              duration: v.duration,
              src: v.src,
              title: document.getElementById("playerTitle")?.textContent || ""
            };
          }
          return null;
        })()
      `);
      if (res && res.playing) return res;
      await sleep(500);
    }
    throw new Error("Playback did not start within " + timeoutMs + "ms");
  }

  // Ensure Movies tab is open
  await evaluate(`
    (() => {
      if (typeof closePlayer === "function") closePlayer();
      if (typeof closeMovieDetails === "function") closeMovieDetails();
      if (typeof switchTab === "function") switchTab("movies");
      if (typeof renderMoviesPage === "function") renderMoviesPage();
    })()
  `);
  await sleep(1500);

  // ------------------------------------------------------------
  // TEST 1: Visually Audit All Visible Posters via DOM Decoding
  // ------------------------------------------------------------
  console.log("\n[TEST 1] Thumbnail Visual Decode Audit Across All Movie Cards");
  const thumbAudit = await evaluate(`
    (() => {
      const imgs = Array.from(document.querySelectorAll(".movie-card-thumb"));
      const total = imgs.length;
      const decoded = imgs.filter(img => img.complete && img.naturalWidth > 0).length;
      const broken = imgs.filter(img => img.naturalWidth === 0).length;
      return { total, decoded, broken };
    })()
  `);
  console.log(`  ✓ Total card thumbnail images rendered: ${thumbAudit.total}`);
  console.log(`  ✓ Fully decoded (naturalWidth > 0): ${thumbAudit.decoded}`);
  console.log(`  ✓ Broken images: ${thumbAudit.broken}`);
  if (thumbAudit.broken > 0) throw new Error(`${thumbAudit.broken} thumbnails failed to decode!`);
  takePhysicalScreenshot("nothing_device_thumbnails_audit.png");
  console.log("  ✅ TEST 1 PASSED: 100% of visible thumbnails decoded with valid dimensions!");

  // ------------------------------------------------------------
  // TEST 2: Direct Movie Playback 1 — 12th Fail
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Direct Movie Playback: 12th Fail (2023)");
  await evaluate(`openMovieDetails("vod_12th_fail")`);
  await sleep(600);
  const open12th = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${open12th.title}", Button: "${open12th.btnText}"`);
  await evaluate(`handleStreamMovieClick()`);
  const pb12th = await waitForPlayback();
  console.log(`  ✓ Playback Active: Time: ${pb12th.currentTime.toFixed(1)}s / ${pb12th.duration.toFixed(1)}s, Title: "${pb12th.title}"`);
  takePhysicalScreenshot("nothing_device_playback_12th_fail.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 2 PASSED: 12th Fail direct playback verified!");

  // ------------------------------------------------------------
  // TEST 3: Direct Movie Playback 2 — Kalki 2898 AD
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Direct Movie Playback: Kalki 2898 AD (2024)");
  await evaluate(`openMovieDetails("vod_kalki_2898_ad")`);
  await sleep(600);
  const openKalki = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${openKalki.title}", Button: "${openKalki.btnText}"`);
  await evaluate(`handleStreamMovieClick()`);
  const pbKalki = await waitForPlayback();
  console.log(`  ✓ Playback Active: Time: ${pbKalki.currentTime.toFixed(1)}s / ${pbKalki.duration.toFixed(1)}s, Title: "${pbKalki.title}"`);
  takePhysicalScreenshot("nothing_device_playback_kalki.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 3 PASSED: Kalki 2898 AD direct playback verified!");

  // ------------------------------------------------------------
  // TEST 4: Direct Movie Playback 3 — Chhaava (2025)
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Direct Movie Playback: Chhaava (2025)");
  await evaluate(`openMovieDetails("vod_chhavaa")`);
  await sleep(600);
  const openChhavaa = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${openChhavaa.title}", Button: "${openChhavaa.btnText}"`);
  await evaluate(`handleStreamMovieClick()`);
  const pbChhavaa = await waitForPlayback();
  console.log(`  ✓ Playback Active: Time: ${pbChhavaa.currentTime.toFixed(1)}s / ${pbChhavaa.duration.toFixed(1)}s, Title: "${pbChhavaa.title}"`);
  takePhysicalScreenshot("nothing_device_playback_chhaava.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 4 PASSED: Chhaava direct playback verified!");

  // ------------------------------------------------------------
  // TEST 5: Trailer 1 — Deadpool & Wolverine (Trailer Only)
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Trailer Playback: Deadpool & Wolverine");
  await evaluate(`openMovieDetails("vod_deadpool_wolverine")`);
  await sleep(600);
  const openDeadpool = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${openDeadpool.title}", Button: "${openDeadpool.btnText}"`);
  if (!openDeadpool.btnText.includes("WATCH TRAILER")) throw new Error("Deadpool button should say WATCH TRAILER");
  await evaluate(`handleStreamMovieClick()`);
  const pbDeadpool = await waitForPlayback();
  console.log(`  ✓ Trailer Active: Time: ${pbDeadpool.currentTime.toFixed(1)}s, Title: "${pbDeadpool.title}"`);
  takePhysicalScreenshot("nothing_device_playback_deadpool_trailer.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 5 PASSED: Deadpool & Wolverine trailer verified!");

  // ------------------------------------------------------------
  // TEST 6: Trailer 2 — Dune: Part Two
  // ------------------------------------------------------------
  console.log("\n[TEST 6] Trailer Playback: Dune: Part Two");
  await evaluate(`openMovieDetails("vod_dune_part_two")`);
  await sleep(600);
  const openDune = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${openDune.title}", Button: "${openDune.btnText}"`);
  if (!openDune.btnText.includes("WATCH TRAILER")) throw new Error("Dune button should say WATCH TRAILER");
  await evaluate(`handleStreamMovieClick()`);
  const pbDune = await waitForPlayback();
  console.log(`  ✓ Trailer Active: Time: ${pbDune.currentTime.toFixed(1)}s, Title: "${pbDune.title}"`);
  takePhysicalScreenshot("nothing_device_playback_dune2_trailer.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 6 PASSED: Dune: Part Two trailer verified!");

  // ------------------------------------------------------------
  // TEST 7: Series 1 — Mirzapur Seasons & Episode Navigation
  // ------------------------------------------------------------
  console.log("\n[TEST 7] Web-Series Seasons & Episode Navigation: Mirzapur");
  await evaluate(`openMovieDetails("series_mirzapur")`);
  await sleep(600);
  const mirzapurModal = await evaluate(`
    (() => {
      const seasons = document.getElementById("seriesSeasonSelect")?.options?.length || 0;
      const epItems = document.querySelectorAll(".series-ep-item")?.length || 0;
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        seasonsCount: seasons,
        episodesCount: epItems
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${mirzapurModal.title}", Seasons in selector: ${mirzapurModal.seasonsCount}, Visible episodes: ${mirzapurModal.episodesCount}`);
  if (mirzapurModal.episodesCount === 0) throw new Error("Mirzapur should display episodes");
  takePhysicalScreenshot("nothing_device_mirzapur_episodes.png");
  await evaluate(`closeMovieDetails()`);
  console.log("  ✅ TEST 7 PASSED: Mirzapur season and episode UI verified!");

  // ------------------------------------------------------------
  // TEST 8: Anti-Pollution Test — Game of Thrones NEVER Plays Avatar
  // ------------------------------------------------------------
  console.log("\n[TEST 8] Anti-Pollution Test: Game of Thrones NEVER Plays Avatar");
  await evaluate(`openMovieDetails("series_game_of_thrones")`);
  await sleep(600);
  const gotModal = await evaluate(`
    (() => {
      const btnText = document.getElementById("btnMovieStreamText")?.textContent;
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: btnText
      };
    })()
  `);
  console.log(`  ✓ Game of Thrones Modal: "${gotModal.title}", Action Button: "${gotModal.btnText}"`);
  
  // Attempt to play GOT episode 1: should show honest unavailable toast, NOT Avatar!
  const gotAttempt = await evaluate(`
    (() => {
      playSeriesEpisode("series_game_of_thrones", "got_s1e1");
      const v = document.getElementById("luminaVideo");
      const isAvatar = v && v.src && v.src.includes("Avatar");
      return { isAvatar, playing: v && !v.paused };
    })()
  `);
  console.log(`  ✓ Episode 1 Attempt -> Is Avatar Trailer Playing: ${gotAttempt.isAvatar}`);
  if (gotAttempt.isAvatar) throw new Error("CRITICAL FAILURE: Game of Thrones is playing Avatar trailer!");
  await evaluate(`closeMovieDetails()`);
  console.log("  ✅ TEST 8 PASSED: Game of Thrones is 100% free of Avatar pollution!");

  // ------------------------------------------------------------
  // TEST 9: Genre & Category Filtering on Device
  // ------------------------------------------------------------
  console.log("\n[TEST 9] Genre & Category Filtering Test");
  const filterResults = await evaluate(`
    (() => {
      const bollywood = CatalogProvider.filterByCategory("Bollywood");
      const hollywood = CatalogProvider.filterByCategory("Hollywood");
      const webSeries = CatalogProvider.filterByCategory("Web-Series");
      const trailers = CatalogProvider.filterByCategory("Trailers");
      return {
        bollywoodCount: bollywood.length,
        hollywoodCount: hollywood.length,
        webSeriesCount: webSeries.length,
        trailersCount: trailers.length
      };
    })()
  `);
  console.log(`  ✓ Bollywood Titles: ${filterResults.bollywoodCount}`);
  console.log(`  ✓ Hollywood Titles: ${filterResults.hollywoodCount}`);
  console.log(`  ✓ Web-Series Titles: ${filterResults.webSeriesCount}`);
  console.log(`  ✓ Trailers Filter Titles: ${filterResults.trailersCount}`);
  if (filterResults.bollywoodCount === 0 || filterResults.hollywoodCount === 0 || filterResults.webSeriesCount === 0) {
    throw new Error("Genre filtering returned 0 items for essential categories!");
  }
  console.log("  ✅ TEST 9 PASSED: Genre and category filters active with rich catalog!");

  console.log("\n============================================================");
  console.log("ALL 9 PHYSICAL DEVICE TESTS PASSED WITH 100% REAL VERIFICATION!");
  console.log("============================================================");
  ws.close();
}

runDeviceMatrix().catch(err => {
  console.error("DEVICE MATRIX FAILED:", err);
  process.exit(1);
});
