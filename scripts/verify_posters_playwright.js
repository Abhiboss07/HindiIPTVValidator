const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  console.log('===============================================================');
  console.log('  T2L POSTER FIDELITY & THUMBNAIL FIT PLAYWRIGHT TEST SUITE');
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
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  const failedTests = [];
  const passedTests = [];

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
    // SUITE 1: SPECIFIC CORRECTED MOVIE POSTERS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 1: TARGET BOLLYWOOD MOVIE POSTERS ---');
    const targetMovies = [
      { id: 'vod_kill_2024', expectedSrc: 'assets/posters/vod_kill_2024.jpg', name: 'Kill' },
      { id: 'vod_rockstar_2011', expectedSrc: 'assets/posters/vod_rockstar_2011.jpg', name: 'Rockstar' },
      { id: 'vod_ludo_2020', expectedSrc: 'assets/posters/vod_ludo_2020.jpg', name: 'Ludo' },
      { id: 'vod_kesari_2019', expectedSrc: 'assets/posters/vod_kesari_2019.jpg', name: 'Kesari' }
    ];

    const movieChecks = await page.evaluate(async (targets) => {
      return targets.map(t => {
        const item = CatalogProvider.getById(t.id);
        if (!item) return { ...t, found: false };
        return {
          ...t,
          found: true,
          posterUrl: item.posterUrl,
          backdropUrl: item.backdropUrl,
          title: item.title
        };
      });
    }, targetMovies);

    for (const mc of movieChecks) {
      assert(mc.found, `Catalog item found: ${mc.name} (${mc.id})`);
      assert(mc.posterUrl === mc.expectedSrc, `Poster path points to dedicated asset for ${mc.name}`, mc.posterUrl);
    }

    // Open detail modal for Kill to verify rendering and capture screenshot
    console.log('Verifying Kill (2024) modal...');
    await page.evaluate(() => openMovieDetails('vod_kill_2024'));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'poster_kill_2024_modal.png') });
    console.log('  📸 Captured poster_kill_2024_modal.png');
    await page.evaluate(() => closeMovieDetails());
    await page.waitForTimeout(600);

    // Open detail modal for Rockstar to verify rendering and capture screenshot
    console.log('Verifying Rockstar (2011) modal...');
    await page.evaluate(() => openMovieDetails('vod_rockstar_2011'));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'poster_rockstar_modal.png') });
    console.log('  📸 Captured poster_rockstar_modal.png');
    await page.evaluate(() => closeMovieDetails());
    await page.waitForTimeout(600);

    // -------------------------------------------------------------
    // SUITE 2: WEB SERIES THUMBNAIL 2:3 PORTRAIT FIT
    // -------------------------------------------------------------
    console.log('\n--- SUITE 2: WEB SERIES THUMBNAIL ASPECT RATIO & FIT ---');
    const seriesList = [
      { id: 'series_crash_landing_on_you', name: 'Crash Landing on You' },
      { id: 'series_descendants_of_the_sun', name: 'Descendants of the Sun' },
      { id: 'series_aspirants', name: 'TVF Aspirants' },
      { id: 'series_pitchers', name: 'TVF Pitchers' },
      { id: 'vod_parasite', name: 'Parasite' }
    ];

    const seriesPosterChecks = await page.evaluate(async (items) => {
      const results = [];
      for (const it of items) {
        const movie = CatalogProvider.getById(it.id);
        if (!movie) {
          results.push({ ...it, found: false });
          continue;
        }

        // Test actual image loading and natural dimensions in browser
        const img = new Image();
        const p = new Promise(resolve => {
          img.onload = () => resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
            ratio: (img.naturalWidth / img.naturalHeight).toFixed(2),
            isPortrait: img.naturalHeight > img.naturalWidth
          });
          img.onerror = () => resolve({ error: true });
        });
        img.src = movie.posterUrl;
        const imgData = await p;

        results.push({
          ...it,
          found: true,
          posterUrl: movie.posterUrl,
          imgData
        });
      }
      return results;
    }, seriesList);

    for (const sc of seriesPosterChecks) {
      assert(sc.found, `Item found: ${sc.name}`);
      assert(!sc.imgData.error, `Image loaded cleanly for ${sc.name} (${sc.posterUrl})`);
      assert(sc.imgData.isPortrait, `Image is authentic portrait (height > width): ${sc.name}`, `${sc.imgData.width}x${sc.imgData.height}`);
      assert(sc.imgData.width === 600 && sc.imgData.height === 900, `Image matches 2:3 ratio standard (600x900): ${sc.name}`);
    }

    // Scroll to Asian rail on Home to visually verify Crash Landing & Descendants
    await page.evaluate(() => {
      const row = document.getElementById('homeAsianRow');
      if (row) row.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'posters_asian_series_fit.png') });
    console.log('  📸 Captured posters_asian_series_fit.png');

    // -------------------------------------------------------------
    // SUITE 3: SHORT MOVIES UNIQUE THUMBNAILS (NO DUPLICATES)
    // -------------------------------------------------------------
    console.log('\n--- SUITE 3: SHORT MOVIES THUMBNAIL UNIQUENESS ---');
    const shortsChecks = await page.evaluate(async () => {
      const shortIds = [
        'vod_spring_4k',
        'vod_charge_4k',
        'vod_sprite_fright_4k',
        'vod_wing_it_4k',
        'vod_agent_327_4k',
        'vod_coffee_run_4k',
        'vod_tears_of_steel_4k',
        'vod_sintel_4k',
        'vod_bbb_4k'
      ];

      const loadedShorts = [];
      for (const id of shortIds) {
        const item = CatalogProvider.getById(id);
        if (item) {
          const img = new Image();
          const p = new Promise(resolve => {
            img.onload = () => resolve({ loaded: true, w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ loaded: false });
          });
          img.src = item.posterUrl;
          const status = await p;
          loadedShorts.push({
            id,
            title: item.title,
            posterUrl: item.posterUrl,
            status
          });
        }
      }
      return loadedShorts;
    });

    const posterSet = new Set();
    let hasDupes = false;
    for (const sc of shortsChecks) {
      assert(sc.status.loaded, `Short movie poster loaded: ${sc.title} (${sc.posterUrl})`);
      if (posterSet.has(sc.posterUrl)) {
        hasDupes = true;
        console.error(`  Duplicate short poster found: ${sc.posterUrl} for ${sc.title}`);
      }
      posterSet.add(sc.posterUrl);
    }
    assert(!hasDupes, 'Zero duplicate posters across short movies collection');
    assert(posterSet.size >= 10, 'All 10 short movies have distinct, unique posters', `Unique count: ${posterSet.size}`);

    // Scroll to Short Movies rail on Home
    await page.evaluate(() => {
      const row = document.getElementById('homeShortsRow');
      if (row) row.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'posters_short_movies_unique.png') });
    console.log('  📸 Captured posters_short_movies_unique.png');

    // -------------------------------------------------------------
    // SUITE 4: BOLLYWOOD CLASSICS UNIQUE THUMBNAILS
    // -------------------------------------------------------------
    console.log('\n--- SUITE 4: BOLLYWOOD CLASSICS THUMBNAIL UNIQUENESS ---');
    const classicsList = [
      'vod_andaz_apna_apna',
      'vod_hungama_2003',
      'vod_de_dana_dan_2009',
      'vod_chupke_chupke_1975',
      'vod_anand_1971',
      'vod_munna_bhai_mbbs',
      'vod_gol_maal_1979',
      'vod_hum_aapke_hain_koun',
      'vod_3_idiots_full',
      'vod_hera_pheri_2000'
    ];

    const classicsChecks = await page.evaluate(async (ids) => {
      const results = [];
      for (const id of ids) {
        const item = CatalogProvider.getById(id);
        if (item) {
          const img = new Image();
          const p = new Promise(resolve => {
            img.onload = () => resolve({ loaded: true, w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ loaded: false });
          });
          img.src = item.posterUrl;
          const status = await p;
          results.push({
            id,
            title: item.title,
            posterUrl: item.posterUrl,
            status
          });
        }
      }
      return results;
    }, classicsList);

    const classicPostersSet = new Set();
    let classicDupes = false;
    for (const cc of classicsChecks) {
      assert(cc.status.loaded, `Classic movie poster loaded: ${cc.title} (${cc.posterUrl})`);
      if (classicPostersSet.has(cc.posterUrl)) {
        classicDupes = true;
        console.error(`  Duplicate classic poster found: ${cc.posterUrl} for ${cc.title}`);
      }
      classicPostersSet.add(cc.posterUrl);
    }
    assert(!classicDupes, 'Zero duplicate posters across Bollywood classics');
    assert(classicPostersSet.size === classicsList.length, 'All 10 Bollywood classics have distinct, authentic posters');

    // Scroll to Bollywood rail on Home
    await page.evaluate(() => {
      const row = document.getElementById('homeBollywoodRow');
      if (row) row.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, 'posters_bollywood_classics_unique.png') });
    console.log('  📸 Captured posters_bollywood_classics_unique.png');

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n===============================================================');
    console.log(`TEST RESULTS: ${passedTests.length} PASSED, ${failedTests.length} FAILED`);
    console.log('===============================================================\n');

    if (failedTests.length > 0) {
      process.exitCode = 1;
    }

  } catch (err) {
    console.error('FATAL SUITE ERROR:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();
