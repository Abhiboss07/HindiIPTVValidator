const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('===============================================================');
  console.log('      T2L COMPREHENSIVE PLAYWRIGHT E2E TEST SUITE');
  console.log('===============================================================\n');

  const screenshotsDir = path.resolve(__dirname, '..', 'reports', 'playwright_screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log(`  [BROWSER ERROR] ${msg.text()}`);
    }
  });

  const passedTests = [];
  const failedTests = [];

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passedTests.push({ name, details });
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? '- ' + details : ''}`);
      failedTests.push({ name, details });
    }
  }

  try {
    const targetUrl = 'http://127.0.0.1:8089/index.html';
    console.log(`Connecting to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // -------------------------------------------------------------
    // Test 1: Page Shell & DOM Readiness
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: DOM SHELL & CATALOG INITIALIZATION ---');
    const pageTitle = await page.title();
    assert(pageTitle.includes('T2L') || pageTitle.length > 0, 'Page title loaded', pageTitle);

    const catalogStats = await page.evaluate(async () => {
      if (typeof CatalogProvider === 'undefined') return null;
      const all = CatalogProvider.getAll();
      return {
        count: all ? all.length : 0,
        isLoaded: CatalogProvider.isLoaded ? CatalogProvider.isLoaded() : true
      };
    });

    assert(catalogStats && catalogStats.count >= 200, 'Catalog loaded with >= 200 titles', `Count: ${catalogStats ? catalogStats.count : 0}`);

    // -------------------------------------------------------------
    // Test 2: Specific Catalog Additions & Classifications
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: RECENT ADDITIONS & CANONICAL CLASSIFICATION ---');
    const classificationResults = await page.evaluate(() => {
      const idsToCheck = [
        'series_aspirants',
        'series_pitchers',
        'series_kota_factory',
        'series_gullak',
        'series_panchayat',
        'vod_coffee_run_4k',
        'vod_parasite',
        'series_crash_landing_on_you',
        'series_descendants_of_the_sun',
        'series_squid_game_s2_2025'
      ];

      return idsToCheck.map(id => {
        const item = CatalogProvider.getById(id);
        if (!item) return { id, found: false };
        const cls = typeof getContentClassification === 'function' ? getContentClassification(item) : null;
        return {
          id,
          found: true,
          title: item.title,
          posterUrl: item.posterUrl,
          backdropUrl: item.backdropUrl,
          mediaType: item.mediaType,
          episodesCount: (item.episodes && item.episodes.length) || 0,
          seasonsCount: (item.seasons && item.seasons.length) || 0,
          cls: cls
        };
      });
    });

    for (const r of classificationResults) {
      assert(r.found, `Item '${r.id}' found in CatalogProvider`);
      if (r.found) {
        if (r.id === 'series_aspirants') {
          assert(r.cls && r.cls.isSeries && !r.cls.isTrailer, 'TVF Aspirants classified as Series (not Trailer)');
          assert(r.cls && r.cls.badgeLabel && r.cls.badgeLabel.includes('1080p FHD'), 'TVF Aspirants badgeLabel is 1080p FHD', r.cls ? r.cls.badgeLabel : '');
          assert(r.posterUrl === 'assets/posters/series_aspirants.jpg', 'TVF Aspirants uses local posterUrl', r.posterUrl);
        } else if (r.id === 'series_pitchers') {
          assert(r.cls && r.cls.isSeries && !r.cls.isTrailer, 'TVF Pitchers classified as Series (not Trailer)');
          assert(r.posterUrl === 'assets/posters/series_pitchers.jpg', 'TVF Pitchers uses local posterUrl', r.posterUrl);
        } else if (r.id === 'series_squid_game_s2_2025') {
          assert(r.cls && r.cls.isTrailer, 'Squid Game S2 correctly identified as Trailer');
          assert(r.cls && r.cls.badgeLabel && r.cls.badgeLabel.includes('Trailer'), 'Squid Game S2 badge is Trailer (4K)', r.cls ? r.cls.badgeLabel : '');
        } else if (r.id === 'vod_coffee_run_4k') {
          assert(r.cls && r.cls.isMovie && !r.cls.isTrailer, 'Coffee Run 4K classified as playable movie/short');
          assert(r.posterUrl === 'assets/posters/vod_coffee_run_4k.jpg', 'Coffee Run 4K uses local poster', r.posterUrl);
        } else if (r.id === 'vod_parasite') {
          assert(r.cls && r.cls.isMovie, 'Parasite classified as full movie');
          assert(r.posterUrl === 'assets/posters/vod_parasite.jpg', 'Parasite uses local poster', r.posterUrl);
        }
      }
    }

    // -------------------------------------------------------------
    // Test 3: Image Assets Natural Dimensions Verification
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: IMAGE ASSETS RESOLUTION & LOCAL RENDERING ---');
    const imageLoadResults = await page.evaluate(async () => {
      const postersToTest = [
        'assets/posters/series_aspirants.jpg',
        'assets/posters/series_pitchers.jpg',
        'assets/posters/vod_coffee_run_4k.jpg',
        'assets/posters/vod_parasite.jpg',
        'assets/posters/series_crash_landing_on_you.jpg',
        'assets/posters/series_descendants_of_the_sun.jpg'
      ];

      const results = [];
      for (const src of postersToTest) {
        const img = new Image();
        const p = new Promise(resolve => {
          img.onload = () => resolve({ src, loaded: true, width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => resolve({ src, loaded: false, error: true });
        });
        img.src = src;
        results.push(await p);
      }
      return results;
    });

    for (const imgRes of imageLoadResults) {
      assert(imgRes.loaded && imgRes.width > 0, `Poster loaded cleanly: ${imgRes.src} (${imgRes.width}x${imgRes.height})`);
    }

    // -------------------------------------------------------------
    // Test 4: UI Navigation & Rails Rendering
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: UI NAVIGATION & RAILS RENDERING ---');
    // Home view check
    const homeCardsCount = await page.evaluate(() => {
      const home = document.getElementById('page-home');
      return home ? home.querySelectorAll('.theatrical-card').length : 0;
    });
    assert(homeCardsCount > 20, 'Home page populated with theatrical cards', `Found: ${homeCardsCount}`);

    const webSeriesCards = await page.evaluate(() => {
      const row = document.getElementById('homeWebSeriesRow');
      if (!row) return [];
      const cards = row.querySelectorAll('.theatrical-card');
      return Array.from(cards).map(c => {
        const titleEl = c.querySelector('.theatrical-title');
        const pillEl = c.querySelector('.theatrical-quality-pill');
        const metaEl = c.querySelector('.theatrical-meta');
        return {
          title: titleEl ? titleEl.textContent.trim() : '',
          pill: pillEl ? pillEl.textContent.trim() : '',
          meta: metaEl ? metaEl.textContent.trim() : ''
        };
      });
    });

    assert(webSeriesCards.length > 5, 'Acclaimed Web-Series rail contains cards', `Found: ${webSeriesCards.length}`);
    const foundAspirantsCard = webSeriesCards.some(c => c.title.includes('Aspirants') && c.pill.includes('1080p FHD'));
    assert(foundAspirantsCard, 'Aspirants card displays 1080p FHD pill in Web-Series rail');

    // Screenshot Home view
    await page.screenshot({ path: path.join(screenshotsDir, '01_home_view.png') });
    console.log('  📸 Captured 01_home_view.png');

    // Navigate to Movies/Cinema Page
    console.log('Switching to Movies/Cinema page via switchPage("movies")...');
    await page.evaluate(() => {
      if (typeof switchPage === 'function') switchPage('movies');
    });
    await page.waitForTimeout(1500);

    const moviesPageActive = await page.evaluate(() => {
      const pageMovies = document.getElementById('page-movies');
      return pageMovies && (pageMovies.classList.contains('active') || pageMovies.style.display !== 'none');
    });
    assert(moviesPageActive, 'Cinema / Movies page is active');

    const cinemaCardsCount = await page.evaluate(() => {
      const pageMovies = document.getElementById('page-movies');
      return pageMovies ? pageMovies.querySelectorAll('.theatrical-card').length : 0;
    });
    assert(cinemaCardsCount > 20, 'Cinema page populated with movie cards', `Found: ${cinemaCardsCount}`);

    await page.screenshot({ path: path.join(screenshotsDir, '02_cinema_view.png') });
    console.log('  📸 Captured 02_cinema_view.png');

    // Switch back to Home Page
    console.log('Switching back to Home page via switchPage("home")...');
    await page.evaluate(() => {
      if (typeof switchPage === 'function') switchPage('home');
    });
    await page.waitForTimeout(1000);

    // -------------------------------------------------------------
    // Test 5: Theatrical Details Modal Workflow
    // -------------------------------------------------------------
    console.log('\n--- SUITE 5: THEATRICAL DETAILS MODAL & SEASONS/EPISODES ---');
    // Open Aspirants Modal
    console.log('Opening TVF Aspirants details modal...');
    await page.evaluate(() => {
      if (typeof openMovieDetails === 'function') {
        openMovieDetails('series_aspirants');
      }
    });
    await page.waitForTimeout(1200);

    const modalState = await page.evaluate(() => {
      const modal = document.getElementById('movieDetailsModal');
      const isVisible = modal && (modal.classList.contains('open') || modal.classList.contains('active') || modal.style.display !== 'none');
      const title = document.getElementById('movieDetailsTitle') ? document.getElementById('movieDetailsTitle').textContent.trim() : '';
      const badge = document.getElementById('movieDetailsResolution') ? document.getElementById('movieDetailsResolution').textContent.trim() : '';
      const duration = document.getElementById('movieDetailsDuration') ? document.getElementById('movieDetailsDuration').textContent.trim() : '';
      const episodesSec = document.getElementById('seriesEpisodesSection');
      const episodesList = document.querySelectorAll('.series-episode-item, .episode-card, #seriesEpisodesList > div');
      const streamBtnText = document.getElementById('btnMovieStreamText') ? document.getElementById('btnMovieStreamText').textContent.trim() : '';
      return {
        isVisible,
        title,
        badge,
        duration,
        episodesSecVisible: episodesSec ? episodesSec.style.display !== 'none' : false,
        episodesRendered: episodesList.length,
        streamBtnText
      };
    });

    assert(modalState.isVisible, 'Details Modal opened for TVF Aspirants');
    assert(modalState.title.includes('Aspirants'), 'Modal title reflects TVF Aspirants', modalState.title);
    assert(modalState.badge.includes('1080p FHD'), 'Modal badge reflects 1080p FHD', modalState.badge);
    assert(modalState.duration.includes('5 Episodes'), 'Modal duration reflects 5 Episodes', modalState.duration);
    assert(modalState.episodesSecVisible, 'Episodes section is visible for Aspirants');
    assert(modalState.streamBtnText.includes('STREAM SERIES'), 'Primary CTA is STREAM SERIES', modalState.streamBtnText);

    await page.screenshot({ path: path.join(screenshotsDir, '04_aspirants_modal.png') });
    console.log('  📸 Captured 04_aspirants_modal.png');

    // Close Modal
    await page.evaluate(() => {
      if (typeof closeMovieDetails === 'function') closeMovieDetails();
    });
    await page.waitForTimeout(800);

    // Open Coffee Run 4K Modal
    console.log('Opening Coffee Run 4K details modal...');
    await page.evaluate(() => {
      if (typeof openMovieDetails === 'function') {
        openMovieDetails('vod_coffee_run_4k');
      }
    });
    await page.waitForTimeout(1200);

    const coffeeModal = await page.evaluate(() => {
      const modal = document.getElementById('movieDetailsModal');
      const isVisible = modal && (modal.classList.contains('open') || modal.classList.contains('active') || modal.style.display !== 'none');
      const title = document.getElementById('movieDetailsTitle') ? document.getElementById('movieDetailsTitle').textContent.trim() : '';
      const badge = document.getElementById('movieDetailsResolution') ? document.getElementById('movieDetailsResolution').textContent.trim() : '';
      const playBtn = document.getElementById('btnMovieStream');
      const playBtnText = document.getElementById('btnMovieStreamText') ? document.getElementById('btnMovieStreamText').textContent.trim() : '';
      return {
        isVisible,
        title,
        badge,
        hasPlayBtn: !!playBtn,
        playBtnText
      };
    });

    assert(coffeeModal.isVisible, 'Details Modal opened for Coffee Run 4K');
    assert(coffeeModal.title.includes('Coffee Run'), 'Modal title reflects Coffee Run', coffeeModal.title);
    assert(coffeeModal.hasPlayBtn, 'Play button present for Coffee Run');
    assert(coffeeModal.playBtnText.includes('STREAM DIRECT') || coffeeModal.playBtnText.includes('WATCH'), 'Play button text is active', coffeeModal.playBtnText);

    await page.screenshot({ path: path.join(screenshotsDir, '05_coffee_run_modal.png') });
    console.log('  📸 Captured 05_coffee_run_modal.png');

    // Close Modal
    await page.evaluate(() => {
      if (typeof closeMovieDetails === 'function') closeMovieDetails();
    });
    await page.waitForTimeout(600);

    // Open Squid Game S2 (Trailer Series) Modal
    console.log('Opening Squid Game Season 2 trailer modal...');
    await page.evaluate(() => {
      if (typeof openMovieDetails === 'function') {
        openMovieDetails('series_squid_game_s2_2025');
      }
    });
    await page.waitForTimeout(1200);

    const squidModal = await page.evaluate(() => {
      const title = document.getElementById('movieDetailsTitle') ? document.getElementById('movieDetailsTitle').textContent.trim() : '';
      const badge = document.getElementById('movieDetailsResolution') ? document.getElementById('movieDetailsResolution').textContent.trim() : '';
      const playBtnText = document.getElementById('btnMovieStreamText') ? document.getElementById('btnMovieStreamText').textContent.trim() : '';
      return { title, badge, playBtnText };
    });

    assert(squidModal.badge.includes('Trailer'), 'Squid Game S2 modal badge shows Trailer', squidModal.badge);
    assert(squidModal.playBtnText.includes('WATCH TRAILER'), 'Squid Game S2 CTA is WATCH TRAILER', squidModal.playBtnText);
    await page.screenshot({ path: path.join(screenshotsDir, '06_squid_game_s2_modal.png') });
    console.log('  📸 Captured 06_squid_game_s2_modal.png');

    await page.evaluate(() => {
      if (typeof closeMovieDetails === 'function') closeMovieDetails();
    });
    await page.waitForTimeout(600);

    // -------------------------------------------------------------
    // Test 6: Hero Banner Rotator Verification
    // -------------------------------------------------------------
    console.log('\n--- SUITE 6: HERO BANNER ROTATOR ---');
    await page.evaluate(() => {
      if (typeof switchPage === 'function') switchPage('home');
    });
    await page.waitForTimeout(1000);

    const heroDetails = await page.evaluate(() => {
      const hero = document.getElementById('homeHeroSection');
      const title = document.getElementById('homeHeroTitle');
      const backdrop = document.getElementById('homeHeroBackdrop');
      const watchBtn = document.getElementById('homeHeroWatchBtn');
      return {
        hasHero: !!hero,
        title: title ? title.textContent.trim() : '',
        backdropSrc: backdrop ? backdrop.getAttribute('src') : '',
        hasWatchBtn: !!watchBtn
      };
    });

    assert(heroDetails.hasHero, 'Home Hero section element exists');
    assert(heroDetails.title.length > 0, 'Hero banner displays active title', heroDetails.title);
    assert(heroDetails.backdropSrc.length > 0, 'Hero banner has active backdrop', heroDetails.backdropSrc);
    assert(heroDetails.hasWatchBtn, 'Hero banner has primary Watch button');

    await page.screenshot({ path: path.join(screenshotsDir, '03_hero_banner.png') });
    console.log('  📸 Captured 03_hero_banner.png');

    assert(heroDetails.hasHero, 'Hero Carousel element exists');
    assert(heroDetails.title.length > 0, 'Hero banner displays active title', heroDetails.title);

    // -------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log(`TEST SUMMARY: ${passedTests.length} PASSED, ${failedTests.length} FAILED`);
    console.log(`BROWSER ERRORS: ${consoleErrors.length}`);
    console.log('===============================================================\n');

    if (failedTests.length > 0) {
      console.error('Failed test details:');
      failedTests.forEach(f => console.error(` - ${f.name} (${f.details})`));
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('FATAL TEST EXCEPTION:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
