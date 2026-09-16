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
  console.log("T2L FINAL STRICT WEB-SERIES REPAIR VERIFICATION MATRIX");
  console.log("Physical Device: Nothing Phone 3 (" + SERIAL + ")");
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
    // -------------------------------------------------------------
    // PHASE A: Complete Catalog Completeness & Sanity
    // -------------------------------------------------------------
    console.log("\n[PHASE A] Verifying Complete Series Catalog Completeness...");
    const seriesStats = await evaluate(`
      (() => {
        const cat = CatalogProvider.getAll();
        const series = cat.filter(m => m.mediaType === 'series' || m.type === 'Web-Series');
        return series.map(s => ({
          id: s.id,
          title: s.title,
          sourceState: s.sourceState,
          seasonCount: s.seasons ? s.seasons.length : 0,
          seasonEps: s.seasons ? s.seasons.map(sn => ({ season: sn.seasonNumber, count: sn.episodes.length })) : [],
          totalEpisodes: s.seasons ? s.seasons.reduce((sum, sn) => sum + sn.episodes.length, 0) : s.episodes.length
        }));
      })()
    `);

    console.table(seriesStats.map(s => ({
      Title: s.title,
      Seasons: s.seasonCount,
      "Season Details": s.seasonEps.map(sn => `S${sn.season}: ${sn.count} eps`).join(', '),
      Total: s.totalEpisodes,
      State: s.sourceState
    })));

    const panchayat = seriesStats.find(s => s.id === 'series_panchayat');
    if (!panchayat || panchayat.totalEpisodes !== 24) {
      throw new Error(`Panchayat must have 24 episodes, found ${panchayat ? panchayat.totalEpisodes : 0}`);
    }
    const mirzapur = seriesStats.find(s => s.id === 'series_mirzapur');
    if (!mirzapur || mirzapur.totalEpisodes !== 29) {
      throw new Error(`Mirzapur must have 29 episodes, found ${mirzapur ? mirzapur.totalEpisodes : 0}`);
    }
    const familyMan = seriesStats.find(s => s.id === 'series_family_man');
    if (!familyMan || familyMan.totalEpisodes !== 19) {
      throw new Error(`The Family Man must have 19 episodes, found ${familyMan ? familyMan.totalEpisodes : 0}`);
    }
    const sacredGames = seriesStats.find(s => s.id === 'series_sacred_games');
    if (!sacredGames || sacredGames.totalEpisodes !== 16) {
      throw new Error(`Sacred Games must have 16 episodes, found ${sacredGames ? sacredGames.totalEpisodes : 0}`);
    }
    const kotaFactory = seriesStats.find(s => s.id === 'series_kota_factory');
    if (!kotaFactory || kotaFactory.totalEpisodes !== 15) {
      throw new Error(`Kota Factory must have 15 episodes, found ${kotaFactory ? kotaFactory.totalEpisodes : 0}`);
    }
    const sherlock = seriesStats.find(s => s.id === 'series_sherlock_holmes');
    if (!sherlock || sherlock.totalEpisodes !== 31) {
      throw new Error(`Sherlock Holmes must have 31 episodes, found ${sherlock ? sherlock.totalEpisodes : 0}`);
    }
    console.log("  ✅ PHASE A PASSED: All series season and episode counts 100% canonical and complete!");

    // -------------------------------------------------------------
    // PHASE B: Modal UI & Dynamic Season Switching on Physical Device
    // -------------------------------------------------------------
    console.log("\n[PHASE B] Testing Modal Dynamic Season Switching...");
    await evaluate(`
      if (typeof closePlayerModal === 'function') closePlayerModal();
      openMovieDetails('series_panchayat');
    `);
    await sleep(800);

    // Verify S1
    const pS1Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
    console.log("  ✓ Panchayat Season 1 Rendered Count:", pS1Count);
    if (pS1Count !== 8) throw new Error("Expected 8 episodes in Panchayat S1");

    // Switch to S2
    await evaluate(`renderSeasonEpisodes('series_panchayat', 2)`);
    await sleep(500);
    const pS2Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
    console.log("  ✓ Panchayat Season 2 Rendered Count:", pS2Count);
    if (pS2Count !== 8) throw new Error("Expected 8 episodes in Panchayat S2");

    // Switch to S3
    await evaluate(`renderSeasonEpisodes('series_panchayat', 3)`);
    await sleep(500);
    const pS3Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
    console.log("  ✓ Panchayat Season 3 Rendered Count:", pS3Count);
    if (pS3Count !== 8) throw new Error("Expected 8 episodes in Panchayat S3");

    takePhysicalScreenshot("final_panchayat_seasons_verified.png");
    await evaluate(`closeMovieDetails()`);
    await sleep(500);
    console.log("  ✅ PHASE B PASSED: Dynamic season switching validated with full episode listings!");

    // -------------------------------------------------------------
    // PHASE C: Physical Device Media Playback & Time Progression
    // -------------------------------------------------------------
    console.log("\n[PHASE C] Physical Device Media Playback (Sherlock Holmes S1E1)...");
    await evaluate(`
      openMovieDetails('series_sherlock_holmes');
      playSeriesEpisode('series_sherlock_holmes', 'sherlock_s1e1');
    `);

    console.log("  Waiting 5 seconds for media stream buffering...");
    await sleep(5000);

    const t1State = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          src: video ? video.src : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : 0,
          readyState: video ? video.readyState : 0,
          duration: video ? video.duration : 0
        };
      })()
    `);
    console.log("  ✓ Playback Check 1 (T=5s):", JSON.stringify(t1State));

    console.log("  Waiting 4 seconds to prove forward progression...");
    await sleep(4000);

    const t2State = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          currentTime: video ? video.currentTime : 0,
          paused: video ? video.paused : null,
          readyState: video ? video.readyState : 0
        };
      })()
    `);
    console.log("  ✓ Playback Check 2 (T=9s):", JSON.stringify(t2State));

    if (t2State.paused) throw new Error("Video is paused!");
    if (t2State.currentTime <= t1State.currentTime) {
      throw new Error(`Video did not advance: t1=${t1State.currentTime}, t2=${t2State.currentTime}`);
    }
    console.log(`  ✓ Time advanced by ${(t2State.currentTime - t1State.currentTime).toFixed(2)}s!`);
    takePhysicalScreenshot("final_series_playback_active.png");

    // -------------------------------------------------------------
    // PHASE D: Episode Switching & Next Progression
    // -------------------------------------------------------------
    console.log("\n[PHASE D] Testing Episode Progression via playNextSeriesEpisode()...");
    await evaluate(`playNextSeriesEpisode()`);
    console.log("  Waiting 4 seconds for Episode 2 buffering...");
    await sleep(4000);

    const nextState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        const title = document.getElementById('playerMainTitle')?.textContent;
        return {
          title,
          src: video ? video.src : null,
          currentTime: video ? video.currentTime : 0,
          paused: video ? video.paused : null
        };
      })()
    `);
    console.log("  ✓ Next Episode State:", JSON.stringify(nextState));
    if (!nextState.src || !nextState.src.includes('S02.mp4')) {
      throw new Error("Next episode src does not point to S02.mp4: " + nextState.src);
    }
    takePhysicalScreenshot("final_series_next_episode.png");
    console.log("  ✅ PHASE D PASSED: Episode progression advanced seamlessly to S01:E02!");

    // -------------------------------------------------------------
    // PHASE E: Regression (Movie Direct HLS)
    // -------------------------------------------------------------
    console.log("\n[PHASE E] Testing Regression: Movie Direct Stream (Big Buck Bunny)...");
    await evaluate(`startMovieStream('vod_bbb_720p')`);
    await sleep(4000);
    const movieState = await evaluate(`
      (() => {
        const video = document.getElementById('videoElement') || document.querySelector('video');
        return {
          src: video ? video.src : null,
          paused: video ? video.paused : null,
          currentTime: video ? video.currentTime : 0,
          readyState: video ? video.readyState : 0
        };
      })()
    `);
    console.log("  ✓ Movie Playback State:", JSON.stringify(movieState));
    if (movieState.paused || movieState.readyState < 2) {
      throw new Error("Movie playback failed: " + JSON.stringify(movieState));
    }
    console.log("  ✅ PHASE E PASSED: Movie playback remains 100% operational!");

    console.log("\n============================================================");
    console.log("🎉 ALL FINAL VERIFICATION PHASES COMPLETED WITH 100% SUCCESS!");
    console.log("============================================================");

  } catch (err) {
    console.error("FATAL VERIFICATION ERROR:", err);
    process.exit(1);
  } finally {
    ws.close();
  }
}

run();
