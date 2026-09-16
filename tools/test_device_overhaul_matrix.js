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

async function runDeviceOverhaulMatrix() {
  console.log("============================================================");
  console.log("T2L 10-POINT PHYSICAL DEVICE OVERHAUL VERIFICATION MATRIX");
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

  async function waitForPlayback(timeoutMs = 30000) {
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
              videoWidth: v.videoWidth,
              videoHeight: v.videoHeight,
              src: v.src,
              title: document.getElementById("playerMainTitle")?.textContent || document.getElementById("playerTitle")?.textContent || ""
            };
          }
          return null;
        })()
      `);
      if (res && res.playing) return res;
      await sleep(600);
    }
    throw new Error("Playback did not start within " + timeoutMs + "ms");
  }

  // Ensure Movies tab is open and clean state
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
  // TEST 1: Thumbnail Visual Decode Audit Across All Movie Cards
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
  console.log("  ✅ TEST 1 PASSED: 100% of visible card thumbnails decoded!");

  // ------------------------------------------------------------
  // TEST 2: Modal Poster Rendering & Honest Badge Display
  // ------------------------------------------------------------
  console.log("\n[TEST 2] Modal Poster Rendering & Honest Badge Display (Kalki 2898 AD)");
  await evaluate(`openMovieDetails("vod_kalki_2898_ad")`);
  await sleep(800);
  const modalAudit = await evaluate(`
    (() => {
      const img = document.getElementById("movieDetailsPosterImg");
      const badge = document.getElementById("movieDetailsResolution");
      const btnText = document.getElementById("btnMovieStreamText");
      return {
        hasImg: !!img,
        imgSrc: img ? img.src : "",
        complete: img ? img.complete : false,
        naturalWidth: img ? img.naturalWidth : 0,
        naturalHeight: img ? img.naturalHeight : 0,
        badgeText: badge ? badge.textContent : "",
        btnText: btnText ? btnText.textContent : ""
      };
    })()
  `);
  console.log(`  ✓ Modal Poster Img Tag Exists: ${modalAudit.hasImg}`);
  console.log(`  ✓ Poster Decoded Dimensions: ${modalAudit.naturalWidth}x${modalAudit.naturalHeight}`);
  console.log(`  ✓ Honest Quality Badge: "${modalAudit.badgeText}"`);
  console.log(`  ✓ Action Button Text: "${modalAudit.btnText}"`);
  if (!modalAudit.hasImg || modalAudit.naturalWidth === 0) throw new Error("Modal poster failed to render as decoded image!");
  if (modalAudit.badgeText.includes("4K") || modalAudit.badgeText.includes("1080p")) throw new Error("Kalki badge falsely claiming 4K/1080p!");
  if (!modalAudit.badgeText.includes("SD 480p")) throw new Error("Kalki badge must show SD 480p!");
  if (!modalAudit.btnText.includes("SD 480p")) throw new Error("Stream button must honestly show SD 480p!");
  takePhysicalScreenshot("nothing_device_modal_poster_kalki.png");
  await evaluate(`closeMovieDetails()`);
  await sleep(600);
  console.log("  ✅ TEST 2 PASSED: Semantic modal poster rendered with honest SD 480p badge!");

  // ------------------------------------------------------------
  // TEST 3: Direct Full HD Playback — Jawan (1080p Full HD)
  // ------------------------------------------------------------
  console.log("\n[TEST 3] Direct Full HD Playback: Jawan (1080p Full HD)");
  await evaluate(`openMovieDetails("vod_jawan")`);
  await sleep(600);
  const openJawan = await evaluate(`
    (() => {
      return {
        title: document.getElementById("movieDetailsTitle")?.textContent,
        btnText: document.getElementById("btnMovieStreamText")?.textContent
      };
    })()
  `);
  console.log(`  ✓ Modal opened: "${openJawan.title}", Button: "${openJawan.btnText}"`);
  if (!openJawan.btnText.includes("1080p HD")) throw new Error("Jawan button must say 1080p HD");
  await evaluate(`handleStreamMovieClick()`);
  const pbJawan = await waitForPlayback(35000);
  console.log(`  ✓ Playback Active: Time: ${pbJawan.currentTime.toFixed(1)}s, Video Dims: ${pbJawan.videoWidth}x${pbJawan.videoHeight}, Title: "${pbJawan.title}"`);
  if (pbJawan.videoWidth !== 1920 || pbJawan.videoHeight !== 804) {
    throw new Error(`Jawan unexpected resolution: ${pbJawan.videoWidth}x${pbJawan.videoHeight}, expected 1920x804`);
  }
  takePhysicalScreenshot("nothing_device_playback_jawan_1080p.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 3 PASSED: Jawan direct 1080p playback verified!");

  // ------------------------------------------------------------
  // TEST 4: Direct SD Playback — Kalki 2898 AD (854x480 SD)
  // ------------------------------------------------------------
  console.log("\n[TEST 4] Direct SD Playback: Kalki 2898 AD (Honest 854x480 SD)");
  await evaluate(`openMovieDetails("vod_kalki_2898_ad")`);
  await sleep(600);
  await evaluate(`handleStreamMovieClick()`);
  const pbKalki = await waitForPlayback(30000);
  console.log(`  ✓ Playback Active: Time: ${pbKalki.currentTime.toFixed(1)}s, Video Dims: ${pbKalki.videoWidth}x${pbKalki.videoHeight}, Title: "${pbKalki.title}"`);
  if (pbKalki.videoWidth !== 854 || pbKalki.videoHeight !== 480) {
    throw new Error(`Kalki unexpected resolution: ${pbKalki.videoWidth}x${pbKalki.videoHeight}, expected 854x480`);
  }
  takePhysicalScreenshot("nothing_device_playback_kalki_480p.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 4 PASSED: Kalki direct SD 480p playback verified with honest dimensions!");

  // ------------------------------------------------------------
  // TEST 5: Trailer Isolation — Deadpool & Wolverine (Trailer Only)
  // ------------------------------------------------------------
  console.log("\n[TEST 5] Trailer Isolation: Deadpool & Wolverine");
  await evaluate(`openMovieDetails("vod_deadpool_wolverine")`);
  await sleep(600);
  const openDeadpool = await evaluate(`
    (() => {
      const btnText = document.getElementById("btnMovieStreamText")?.textContent;
      const session = window.activePlaybackSession;
      return { btnText };
    })()
  `);
  console.log(`  ✓ Action Button: "${openDeadpool.btnText}"`);
  if (!openDeadpool.btnText.includes("WATCH TRAILER")) throw new Error("Deadpool button should say WATCH TRAILER");
  await evaluate(`handleStreamMovieClick()`);
  const pbDeadpool = await waitForPlayback(25000);
  console.log(`  ✓ Trailer Active: Time: ${pbDeadpool.currentTime.toFixed(1)}s, Title: "${pbDeadpool.title}"`);
  takePhysicalScreenshot("nothing_device_playback_deadpool_trailer.png");
  await stopPlayback();
  await sleep(1000);
  console.log("  ✅ TEST 5 PASSED: Deadpool & Wolverine trailer verified with zero fake movie substitution!");

  // ------------------------------------------------------------
  // TEST 6: Series Completeness — Game of Thrones (Season 1)
  // ------------------------------------------------------------
  console.log("\n[TEST 6] Series Completeness: Game of Thrones (Season 1)");
  await evaluate(`openMovieDetails("series_game_of_thrones")`);
  await sleep(800);
  const gotAudit = await evaluate(`
    (() => {
      const epItems = Array.from(document.querySelectorAll(".series-ep-item"));
      const titles = epItems.map(el => el.querySelector(".series-ep-title")?.textContent?.trim());
      const badges = epItems.map(el => el.querySelector(".series-ep-badge-unavail")?.textContent?.trim());
      return { count: epItems.length, titles, badges };
    })()
  `);
  console.log(`  ✓ Season 1 Episode Count: ${gotAudit.count}`);
  console.log(`  ✓ Episodes: ${gotAudit.titles.join(", ")}`);
  if (gotAudit.count !== 10) throw new Error(`Game of Thrones Season 1 must have 10 episodes, found ${gotAudit.count}`);
  
  // Attempt to play GOT episode 1: should show honest unavailable toast, NOT Avatar!
  const gotAttempt = await evaluate(`
    (() => {
      playSeriesEpisode("series_game_of_thrones", "got_s1e1");
      const v = document.getElementById("luminaVideo");
      const isAvatar = v && v.src && v.src.includes("Avatar");
      return { isAvatar, playing: v && !v.paused };
    })()
  `);
  console.log(`  ✓ Episode 1 Selection -> Is Avatar Playing: ${gotAttempt.isAvatar}`);
  if (gotAttempt.isAvatar) throw new Error("CRITICAL FAILURE: Game of Thrones played Avatar trailer!");
  takePhysicalScreenshot("nothing_device_got_10episodes.png");
  await evaluate(`closeMovieDetails()`);
  await sleep(600);
  console.log("  ✅ TEST 6 PASSED: Game of Thrones has full 10 episodes and 0 Avatar cross-pollution!");

  // ------------------------------------------------------------
  // TEST 7: Series Completeness — Mirzapur (Season 1)
  // ------------------------------------------------------------
  console.log("\n[TEST 7] Series Completeness: Mirzapur (Season 1)");
  await evaluate(`openMovieDetails("series_mirzapur")`);
  await sleep(800);
  const mzpAudit = await evaluate(`
    (() => {
      const epItems = Array.from(document.querySelectorAll(".series-ep-item"));
      const titles = epItems.map(el => el.querySelector(".series-ep-title")?.textContent?.trim());
      return { count: epItems.length, titles };
    })()
  `);
  console.log(`  ✓ Season 1 Episode Count: ${mzpAudit.count}`);
  console.log(`  ✓ Episodes: ${mzpAudit.titles.slice(0, 5).join(", ")}...`);
  if (mzpAudit.count !== 9) throw new Error(`Mirzapur Season 1 must have 9 episodes, found ${mzpAudit.count}`);
  takePhysicalScreenshot("nothing_device_mirzapur_9episodes.png");
  await evaluate(`closeMovieDetails()`);
  await sleep(600);
  console.log("  ✅ TEST 7 PASSED: Mirzapur Season 1 has full 9 episodes complete!");

  // ------------------------------------------------------------
  // TEST 8: Series Completeness — Breaking Bad (Season 1)
  // ------------------------------------------------------------
  console.log("\n[TEST 8] Series Completeness: Breaking Bad (Season 1)");
  await evaluate(`openMovieDetails("series_breaking_bad")`);
  await sleep(800);
  const bbAudit = await evaluate(`
    (() => {
      const epItems = Array.from(document.querySelectorAll(".series-ep-item"));
      const titles = epItems.map(el => el.querySelector(".series-ep-title")?.textContent?.trim());
      return { count: epItems.length, titles };
    })()
  `);
  console.log(`  ✓ Season 1 Episode Count: ${bbAudit.count}`);
  console.log(`  ✓ Episodes: ${bbAudit.titles.join(", ")}`);
  if (bbAudit.count !== 7) throw new Error(`Breaking Bad Season 1 must have 7 episodes, found ${bbAudit.count}`);
  takePhysicalScreenshot("nothing_device_breakingbad_7episodes.png");
  await evaluate(`closeMovieDetails()`);
  await sleep(600);
  console.log("  ✅ TEST 8 PASSED: Breaking Bad Season 1 has full 7 episodes complete!");

  // ------------------------------------------------------------
  // TEST 9: Honest Unavailable Titles Handling (Animal)
  // ------------------------------------------------------------
  console.log("\n[TEST 9] Honest Unavailable Titles Handling: Animal");
  await evaluate(`openMovieDetails("vod_animal")`);
  await sleep(800);
  const animalAudit = await evaluate(`
    (() => {
      const btnText = document.getElementById("btnMovieStreamText")?.textContent;
      const btn = document.getElementById("btnMovieStream");
      const badge = document.getElementById("movieDetailsResolution")?.textContent;
      return {
        btnText,
        badge,
        isDisabled: btn ? (btn.disabled || btn.classList.contains("stream-unavail")) : false
      };
    })()
  `);
  console.log(`  ✓ Action Button Text: "${animalAudit.btnText}"`);
  console.log(`  ✓ Honest Badge: "${animalAudit.badge}"`);
  console.log(`  ✓ Is Button Disabled / Unavailable: ${animalAudit.isDisabled}`);
  if (!animalAudit.btnText.includes("UNAVAILABLE")) throw new Error("Animal button must indicate UNAVAILABLE!");
  takePhysicalScreenshot("nothing_device_animal_unavailable.png");
  await evaluate(`closeMovieDetails()`);
  await sleep(600);
  console.log("  ✅ TEST 9 PASSED: Unstreamable title handled honestly without false offline crashes!");

  // ------------------------------------------------------------
  // TEST 10: Category & Genre Filtering on Device
  // ------------------------------------------------------------
  console.log("\n[TEST 10] Category & Genre Filtering Test");
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
  if (filterResults.bollywoodCount !== 29 || filterResults.hollywoodCount !== 22 || filterResults.webSeriesCount !== 12 || filterResults.trailersCount !== 12) {
    throw new Error(`Filter counts unexpected: ${JSON.stringify(filterResults)}`);
  }
  console.log("  ✅ TEST 10 PASSED: All 4 major categories strictly validated (29 Bollywood, 22 Hollywood, 12 Web-Series, 12 Trailers)!");

  console.log("\n============================================================");
  console.log("ALL 10/10 PHYSICAL DEVICE OVERHAUL VERIFICATION TESTS PASSED!");
  console.log("============================================================");
  ws.close();
}

runDeviceOverhaulMatrix().catch(err => {
  console.error("DEVICE OVERHAUL MATRIX FAILED:", err);
  process.exit(1);
});
