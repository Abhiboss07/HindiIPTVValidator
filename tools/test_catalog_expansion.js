const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR]: ${msg.text()}`);
    }
  });

  const artifactDir = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

  console.log('Navigating to http://127.0.0.1:8089/...');
  await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Check Home Page rails
  const homeWsCount = await page.evaluate(() => {
    const el = document.getElementById('homeWebSeriesRow');
    return el ? el.querySelectorAll('.theatrical-card').length : 0;
  });
  const homeTrailersCount = await page.evaluate(() => {
    const el = document.getElementById('homeTrailersRow');
    return el ? el.querySelectorAll('.theatrical-card').length : 0;
  });
  console.log(`Home Web Series cards: ${homeWsCount}, Home Trailers cards: ${homeTrailersCount}`);

  // Scroll to trailers rail on Home
  await page.evaluate(() => {
    const t = document.getElementById('homeTrailersRow');
    if (t) t.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_home_trailers_expansion.png') });
  console.log('Saved playwright_home_trailers_expansion.png');

  // 2. Navigate to Cinema Page
  await page.evaluate(() => navigateTo('cinema'));
  await page.waitForTimeout(2000);

  // Check Bollywood Row
  const bollywoodTitles = await page.evaluate(() => {
    const row = document.getElementById('moviesBollywoodRow');
    if (!row) return [];
    return Array.from(row.querySelectorAll('.theatrical-title')).map(el => el.textContent.trim());
  });
  console.log(`Cinema Bollywood row (${bollywoodTitles.length} items):`, bollywoodTitles.slice(0, 6));

  await page.evaluate(() => {
    const el = document.getElementById('moviesBollywoodRow');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_cinema_bollywood_new.png') });
  console.log('Saved playwright_cinema_bollywood_new.png');

  // Check Web Series Row
  const seriesTitles = await page.evaluate(() => {
    const row = document.getElementById('moviesWebSeriesRow');
    if (!row) return [];
    return Array.from(row.querySelectorAll('.theatrical-title')).map(el => el.textContent.trim());
  });
  console.log(`Cinema Web Series row (${seriesTitles.length} items):`, seriesTitles.slice(0, 6));

  await page.evaluate(() => {
    const el = document.getElementById('moviesWebSeriesRow');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_cinema_webseries_new.png') });
  console.log('Saved playwright_cinema_webseries_new.png');

  // Check Trailers Row
  const trailersTitles = await page.evaluate(() => {
    const row = document.getElementById('moviesTrailersRow');
    if (!row) return [];
    return Array.from(row.querySelectorAll('.theatrical-title')).map(el => el.textContent.trim());
  });
  console.log(`Cinema Trailers row (${trailersTitles.length} items):`, trailersTitles.slice(0, 6));

  await page.evaluate(() => {
    const el = document.getElementById('moviesTrailersRow');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_cinema_trailers_new.png') });
  console.log('Saved playwright_cinema_trailers_new.png');

  // 3. Test Hera Pheri Modal & Direct YouTube Playback
  console.log('Testing Hera Pheri...');
  await page.evaluate(() => openMovieDetails('vod_hera_pheri_2000'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_hera_pheri_modal.png') });
  console.log('Saved playwright_hera_pheri_modal.png');

  await page.evaluate(() => handleStreamMovieClick());
  await page.waitForTimeout(2500);

  const playerState = await page.evaluate(() => {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('luminaIframe');
    const video = document.getElementById('luminaVideo');
    return {
      modalActive: modal ? modal.classList.contains('active') : false,
      hasIframe: !!iframe,
      iframeDisplay: iframe ? iframe.style.display : null,
      iframeSrc: iframe ? iframe.src : null,
      videoDisplay: video ? video.style.display : null
    };
  });
  console.log('Player state for Hera Pheri:', playerState);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_hera_pheri_playback.png') });
  console.log('Saved playwright_hera_pheri_playback.png');

  // Close player
  await page.evaluate(() => {
    if (typeof closePlayerModal === 'function') closePlayerModal();
    const modal = document.getElementById('playerModal');
    if (modal) { modal.classList.remove('active'); modal.style.display = 'none'; }
  });
  await page.waitForTimeout(1000);

  // 4. Test TVF Pitchers Modal & Episode Playback
  console.log('Testing TVF Pitchers...');
  await page.evaluate(() => openMovieDetails('series_tvf_pitchers'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_pitchers_modal.png') });
  console.log('Saved playwright_pitchers_modal.png');

  const pitchersEpsCount = await page.evaluate(() => {
    const el = document.getElementById('seriesEpisodesList');
    return el ? el.querySelectorAll('.series-episode-item').length : 0;
  });
  console.log('TVF Pitchers rendered episodes count:', pitchersEpsCount);

  // Click Episode 1 Play
  await page.evaluate(() => {
    const playBtn = document.querySelector('.episode-play-btn');
    if (playBtn) playBtn.click();
    else handleStreamMovieClick();
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_pitchers_playback.png') });
  console.log('Saved playwright_pitchers_playback.png');

  // Close player
  await page.evaluate(() => {
    if (typeof closePlayerModal === 'function') closePlayerModal();
    const modal = document.getElementById('playerModal');
    if (modal) { modal.classList.remove('active'); modal.style.display = 'none'; }
  });
  await page.waitForTimeout(1000);

  // 5. Test 2025 Superman Trailer
  console.log('Testing Superman (2025)...');
  await page.evaluate(() => openMovieDetails('vod_superman_2025'));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_superman_modal.png') });
  console.log('Saved playwright_superman_modal.png');

  await page.evaluate(() => handleStreamMovieClick());
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(artifactDir, 'playwright_superman_playback.png') });
  console.log('Saved playwright_superman_playback.png');

  await browser.close();
  console.log('All verification completed successfully!');
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
