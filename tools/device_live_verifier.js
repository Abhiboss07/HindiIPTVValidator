const http = require('http');

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json/list', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === 'page');
          if (page) resolve(page);
          else reject(new Error('No page target found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function runDeviceVerification() {
  console.log("============================================================");
  console.log("T2L PHYSICAL DEVICE (NOTHING PHONE 3) LIVE VERIFICATION");
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

  async function evaluate(code) {
    const res = await sendCdp('Runtime.evaluate', {
      expression: code,
      awaitPromise: true,
      returnByValue: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  // ------------------------------------------------------------
  // TEST 1: Navigate to Movies & Load Catalog
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 1] Navigate to Movies Tab & Load Catalog");
  const loadResult = await evaluate(`
    (async () => {
      if (typeof switchTab === 'function') switchTab('movies');
      if (typeof renderMoviesPage === 'function') await renderMoviesPage();
      return {
        catalogLoaded: CatalogProvider.loaded,
        count: CatalogProvider.movies.length,
        bollywoodCount: document.getElementById('moviesBollywoodRow')?.children.length || 0,
        webSeriesCount: document.getElementById('moviesWebSeriesRow')?.children.length || 0,
        hollywoodCount: document.getElementById('moviesHollywoodRow')?.children.length || 0,
        comedyCount: document.getElementById('moviesComedyRow')?.children.length || 0,
        horrorCount: document.getElementById('moviesHorrorRow')?.children.length || 0,
        trailersCount: document.getElementById('moviesTrailersRow')?.children.length || 0
      };
    })()
  `);
  console.log("  ✓ Catalog Titles Loaded:", loadResult.count);
  console.log("  ✓ Bollywood Row Cards:", loadResult.bollywoodCount);
  console.log("  ✓ Web-Series Row Cards:", loadResult.webSeriesCount);
  console.log("  ✓ Hollywood Row Cards:", loadResult.hollywoodCount);
  console.log("  ✓ Comedy Row Cards:", loadResult.comedyCount);
  console.log("  ✓ Horror Row Cards:", loadResult.horrorCount);
  console.log("  ✓ Trailers Row Cards:", loadResult.trailersCount);
  if (loadResult.count !== 52) throw new Error("Expected 52 titles, got " + loadResult.count);
  console.log("  ✅ DEVICE TEST 1 PASSED: Catalog and genre rows active on device!");

  // ------------------------------------------------------------
  // TEST 2: Verify Thumbnails & Posters in DOM
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 2] Verify Poster Thumbnails on Device");
  const posterCheck = await evaluate(`
    (() => {
      const thumbs = Array.from(document.querySelectorAll('.movie-card-thumb'));
      const sampleUrls = thumbs.slice(0, 5).map(t => t.style.backgroundImage);
      const invalidThumbs = thumbs.filter(t => !t.style.backgroundImage || t.style.backgroundImage.includes('undefined'));
      return {
        totalThumbnails: thumbs.length,
        invalidCount: invalidThumbs.length,
        samples: sampleUrls
      };
    })()
  `);
  console.log("  ✓ Total Thumbnails Rendered in DOM:", posterCheck.totalThumbnails);
  console.log("  ✓ Sample Poster Backgrounds:", posterCheck.samples);
  if (posterCheck.invalidCount > 0) throw new Error("Found invalid poster thumbnails: " + posterCheck.invalidCount);
  console.log("  ✅ DEVICE TEST 2 PASSED: All movie card thumbnails properly bound!");

  // ------------------------------------------------------------
  // TEST 3: Root-Cause Regression — Game of Thrones vs Avatar
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 3] Game of Thrones Isolation (Anti-Avatar Regression)");
  const gotCheck = await evaluate(`
    (() => {
      openMovieDetails('series_game_of_thrones');
      const modal = document.getElementById('movieDetailsModal');
      const title = document.getElementById('movieDetailsTitle')?.textContent;
      const seasonSel = document.getElementById('seasonSelector');
      const seasonOptions = seasonSel ? Array.from(seasonSel.options).map(o => o.text) : [];
      const epContainer = document.getElementById('seasonEpisodesContainer');
      const epCount = epContainer ? epContainer.children.length : 0;
      const firstEpTitle = epContainer?.querySelector('.series-ep-title')?.textContent;
      
      const movie = currentSelectedMovie;
      const isAvatarStream = movie.streamUrl && movie.streamUrl.includes('Avatar');
      const isAvatarTrailer = movie.trailerUrl && movie.trailerUrl.includes('Avatar');
      
      return {
        modalVisible: modal?.style.display !== 'none',
        title: title,
        seasonOptions: seasonOptions,
        firstSeasonEpCount: epCount,
        firstEpTitle: firstEpTitle,
        hasAvatarStream: !!isAvatarStream,
        hasAvatarTrailer: !!isAvatarTrailer,
        streamUrl: movie.streamUrl,
        trailerUrl: movie.trailerUrl,
        contentType: movie.contentType
      };
    })()
  `);
  console.log("  ✓ Modal Opened Title:", gotCheck.title);
  console.log("  ✓ Seasons Available:", gotCheck.seasonOptions);
  console.log("  ✓ Season 1 Episode Count:", gotCheck.firstSeasonEpCount, "(First: " + gotCheck.firstEpTitle + ")");
  console.log("  ✓ streamUrl:", gotCheck.streamUrl, "| trailerUrl:", gotCheck.trailerUrl);
  console.log("  ✓ Contains Avatar stream?", gotCheck.hasAvatarStream ? "❌ CRITICAL FAILURE" : "✅ NO");
  console.log("  ✓ Contains Avatar trailer?", gotCheck.hasAvatarTrailer ? "❌ CRITICAL FAILURE" : "✅ NO");
  if (gotCheck.hasAvatarStream || gotCheck.hasAvatarTrailer) {
    throw new Error("CRITICAL BUG: Game of Thrones still contains Avatar!");
  }
  console.log("  ✅ DEVICE TEST 3 PASSED: Game of Thrones is 100% isolated from Avatar trailer!");

  // ------------------------------------------------------------
  // TEST 4: Trailer Playback vs Stream Button
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 4] Trailer Playback Separation (Avatar: The Way of Water)");
  const avatarCheck = await evaluate(`
    (() => {
      openMovieDetails('vod_avatar_way_of_water');
      const btnTrailer = document.getElementById('btnMovieTrailer');
      const btnStream = document.getElementById('btnMovieStream');
      const btnStreamText = document.getElementById('btnMovieStreamText');
      const movie = currentSelectedMovie;
      
      // Test triggering trailer click
      handleWatchTrailerClick();
      const session = activePlaybackSession;
      
      return {
        title: movie.title,
        trailerVisible: btnTrailer?.style.display !== 'none',
        streamText: btnStreamText?.textContent,
        trailerUrl: movie.trailerUrl,
        streamUrl: movie.streamUrl,
        sessionIsTrailer: session?.isTrailer,
        sessionContentId: session?.contentId,
        sessionOverrideUrl: session?.overrideUrl
      };
    })()
  `);
  console.log("  ✓ Movie Title:", avatarCheck.title);
  console.log("  ✓ Watch Trailer Button Visible:", avatarCheck.trailerVisible);
  console.log("  ✓ Stream Button State:", avatarCheck.streamText);
  console.log("  ✓ Active Session isTrailer:", avatarCheck.sessionIsTrailer);
  console.log("  ✓ Active Session contentId:", avatarCheck.sessionContentId);
  console.log("  ✓ Active Session URL:", avatarCheck.sessionOverrideUrl);
  if (!avatarCheck.trailerVisible) throw new Error("Trailer button should be visible for Avatar");
  if (!avatarCheck.sessionIsTrailer) throw new Error("Playback session should be marked as trailer");
  if (avatarCheck.sessionContentId !== 'vod_avatar_way_of_water') throw new Error("Wrong session contentId");
  console.log("  ✅ DEVICE TEST 4 PASSED: Trailer cleanly separated from movie stream!");

  // ------------------------------------------------------------
  // TEST 5: Legitimate Full Movie Direct Stream (12th Fail)
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 5] Verified Direct Movie Stream (12th Fail)");
  const fail12Check = await evaluate(`
    (() => {
      openMovieDetails('vod_12th_fail');
      const btnStream = document.getElementById('btnMovieStream');
      const btnStreamText = document.getElementById('btnMovieStreamText');
      const movie = currentSelectedMovie;
      
      return {
        title: movie.title,
        streamEnabled: !btnStream?.disabled,
        streamText: btnStreamText?.textContent,
        streamUrl: movie.streamUrl,
        contentType: movie.contentType
      };
    })()
  `);
  console.log("  ✓ Movie Title:", fail12Check.title);
  console.log("  ✓ Stream Button:", fail12Check.streamText, "(enabled: " + fail12Check.streamEnabled + ")");
  console.log("  ✓ Stream URL:", fail12Check.streamUrl);
  if (!fail12Check.streamEnabled) throw new Error("12th Fail stream button should be enabled");
  if (!fail12Check.streamUrl || !fail12Check.streamUrl.includes('12th_Fail')) throw new Error("12th Fail streamUrl is invalid");
  console.log("  ✅ DEVICE TEST 5 PASSED: Full movie stream ready for instant playback!");

  // ------------------------------------------------------------
  // TEST 6: Player UI & Torrent HUD Banner Verification
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 6] Player UI & HUD Banner Verification");
  const playerUiCheck = await evaluate(`
    (() => {
      const hud = document.getElementById('torrentHud');
      const hudComputed = window.getComputedStyle(hud);
      const btnQuickSpeed = document.getElementById('btnPlayerQuickSpeed');
      const btnDialogue = document.getElementById('btnPlayerDialogueBoost');
      const drawerDialogue = document.querySelector('#vlcMoreDrawer .vlc-menu-item[onclick*="toggleDialogueBoost"]');
      const drawerSpeed = document.querySelector('#vlcMoreDrawer .vlc-menu-item[onclick*="openVlcSpeedModal"]');
      
      return {
        hudDisplay: hudComputed.display,
        hudVisibility: hudComputed.visibility,
        hudRemovedFromFlow: hudComputed.display === 'none',
        quickSpeedRemovedFromToolbar: btnQuickSpeed === null,
        dialogueBoostRemovedFromToolbar: btnDialogue === null,
        dialogueBoostInOptionsDrawer: drawerDialogue !== null,
        playbackSpeedInOptionsDrawer: drawerSpeed !== null
      };
    })()
  `);
  console.log("  ✓ Torrent HUD computed display:", playerUiCheck.hudDisplay);
  console.log("  ✓ Torrent HUD computed visibility:", playerUiCheck.hudVisibility);
  console.log("  ✓ Quick Speed removed from transport toolbar?", playerUiCheck.quickSpeedRemovedFromToolbar ? "YES" : "NO");
  console.log("  ✓ Dialogue Boost removed from transport toolbar?", playerUiCheck.dialogueBoostRemovedFromToolbar ? "YES" : "NO");
  console.log("  ✓ Dialogue Clarity Boost present in options drawer (⋯)?", playerUiCheck.dialogueBoostInOptionsDrawer ? "YES" : "NO");
  console.log("  ✓ Playback Speed present in options drawer (⋯)?", playerUiCheck.playbackSpeedInOptionsDrawer ? "YES" : "NO");
  if (!playerUiCheck.hudRemovedFromFlow) throw new Error("Torrent HUD must be completely hidden!");
  if (!playerUiCheck.quickSpeedRemovedFromToolbar || !playerUiCheck.dialogueBoostRemovedFromToolbar) throw new Error("Toolbar extra buttons not removed");
  if (!playerUiCheck.dialogueBoostInOptionsDrawer || !playerUiCheck.playbackSpeedInOptionsDrawer) throw new Error("Drawer options missing");
  console.log("  ✅ DEVICE TEST 6 PASSED: Player UI cleaned and options drawer organized!");

  // ------------------------------------------------------------
  // TEST 7: Series Episode Ordering & Next Episode Progression
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 7] Series Next Episode Progression");
  const nextEpCheck = await evaluate(`
    (() => {
      openMovieDetails('series_game_of_thrones');
      playSeriesEpisode('series_game_of_thrones', 'got_s1e1');
      const ep1Playing = window.currentPlayingEpisodeId;
      const btnNext = document.getElementById('btnPlayerNextEp');
      const btnNextVisible = btnNext && btnNext.style.display !== 'none';
      
      // Advance to next episode
      playNextSeriesEpisode();
      const ep2Playing = window.currentPlayingEpisodeId;
      
      return {
        initialEpisode: ep1Playing,
        btnNextVisible: btnNextVisible,
        advancedToEpisode: ep2Playing
      };
    })()
  `);
  console.log("  ✓ Initial Playing Episode:", nextEpCheck.initialEpisode);
  console.log("  ✓ Next Episode Button Displayed:", nextEpCheck.btnNextVisible);
  console.log("  ✓ Advanced to Next Episode:", nextEpCheck.advancedToEpisode);
  if (nextEpCheck.advancedToEpisode !== 'got_s1e2') throw new Error("Expected progression to got_s1e2, got " + nextEpCheck.advancedToEpisode);
  console.log("  ✅ DEVICE TEST 7 PASSED: Next episode seamlessly auto-advanced!");

  // ------------------------------------------------------------
  // TEST 8: Genre & Category Filtering
  // ------------------------------------------------------------
  console.log("\n[DEVICE TEST 8] Genre & Category Filtering");
  const filterCheck = await evaluate(`
    (() => {
      filterMovieCategory('Horror');
      const horrorGridCount = document.getElementById('moviesCatalogGrid')?.children.length || 0;
      const horrorTitle = document.getElementById('moviesGridTitle')?.textContent;
      
      filterMovieCategory('Comedy');
      const comedyGridCount = document.getElementById('moviesCatalogGrid')?.children.length || 0;
      const comedyTitle = document.getElementById('moviesGridTitle')?.textContent;

      filterMovieCategory('Bollywood');
      const bollyGridCount = document.getElementById('moviesCatalogGrid')?.children.length || 0;
      const bollyTitle = document.getElementById('moviesGridTitle')?.textContent;
      
      filterMovieCategory('Hollywood');
      const hollyGridCount = document.getElementById('moviesCatalogGrid')?.children.length || 0;
      const hollyTitle = document.getElementById('moviesGridTitle')?.textContent;

      // Restore 'all'
      filterMovieCategory('all');
      const restoredDisplay = document.getElementById('moviesRowsContainer')?.style.display;

      return {
        horrorTitle, horrorGridCount,
        comedyTitle, comedyGridCount,
        bollyTitle, bollyGridCount,
        hollyTitle, hollyGridCount,
        restoredDisplay
      };
    })()
  `);
  console.log("  ✓ Filter Horror:", filterCheck.horrorTitle, "->", filterCheck.horrorGridCount, "items");
  console.log("  ✓ Filter Comedy:", filterCheck.comedyTitle, "->", filterCheck.comedyGridCount, "items");
  console.log("  ✓ Filter Bollywood:", filterCheck.bollyTitle, "->", filterCheck.bollyGridCount, "items");
  console.log("  ✓ Filter Hollywood:", filterCheck.hollyTitle, "->", filterCheck.hollyGridCount, "items");
  console.log("  ✓ Restored All rows display:", filterCheck.restoredDisplay);
  if (filterCheck.horrorGridCount === 0 || filterCheck.comedyGridCount === 0 || filterCheck.bollyGridCount === 0) {
    throw new Error("Genre filtering returned 0 items");
  }
  console.log("  ✅ DEVICE TEST 8 PASSED: Category & Genre filtering working perfectly!");

  console.log("\n============================================================");
  console.log("🎉 ALL 8 PHYSICAL DEVICE VERIFICATION TESTS PASSED (8/8)!");
  console.log("============================================================");

  ws.close();
  process.exit(0);
}

runDeviceVerification().catch(err => {
  console.error("FATAL DEVICE VERIFICATION ERROR:", err);
  process.exit(1);
});
