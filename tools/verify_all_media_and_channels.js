const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const artifactDir = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR]: ${msg.text()}`);
    }
  });

  console.log('Navigating to http://127.0.0.1:8089/...');
  await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Verify Live TV Page
  console.log('Testing Live TV page...');
  await page.evaluate(() => switchPage('live'));
  await page.waitForTimeout(1500);

  const liveTvStats = await page.evaluate(() => {
    const cards = document.querySelectorAll('.live-channel-card');
    const categories = Array.from(document.querySelectorAll('#liveCategoryChips .lumina-chip')).map(el => el.textContent.trim());
    return {
      channelCardsCount: cards.length,
      categories: categories
    };
  });
  console.log('Live TV cards count:', liveTvStats.channelCardsCount);
  console.log('Live TV categories:', liveTvStats.categories);

  await page.screenshot({ path: path.join(artifactDir, 'playwright_livetv_verified_hindi.png') });
  console.log('Saved playwright_livetv_verified_hindi.png');

  // Filter CARTOONS
  console.log('Filtering Cartoons & Kids...');
  await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('#liveCategoryChips .lumina-chip'));
    const cartoonChip = chips.find(c => c.textContent.toLowerCase().includes('cartoon') || c.textContent.toLowerCase().includes('kids'));
    if (cartoonChip) cartoonChip.click();
    else if (typeof filterLiveCategory === 'function') filterLiveCategory('CARTOONS');
  });
  await page.waitForTimeout(1000);

  const cartoonChannels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.live-channel-name')).map(el => el.textContent.trim());
  });
  console.log('Cartoons & Kids channels:', cartoonChannels.slice(0, 10));
  await page.screenshot({ path: path.join(artifactDir, 'playwright_livetv_cartoons_hindi.png') });
  console.log('Saved playwright_livetv_cartoons_hindi.png');

  // 2. Verify Radio Page
  console.log('Testing Radio page...');
  await page.evaluate(() => switchPage('radio'));
  await page.waitForTimeout(1500);

  const radioStats = await page.evaluate(() => {
    const cards = document.querySelectorAll('.radio-compact-tile');
    const names = Array.from(document.querySelectorAll('.radio-tile-name')).map(el => el.textContent.trim());
    return {
      count: cards.length,
      stations: names
    };
  });
  console.log(`Radio Stations (${radioStats.count}):`, radioStats.stations);

  await page.screenshot({ path: path.join(artifactDir, 'playwright_radio_verified_hindi.png') });
  console.log('Saved playwright_radio_verified_hindi.png');

  // 3. Verify Cinema Page
  console.log('Testing Cinema page...');
  await page.evaluate(() => switchPage('movies'));
  await page.waitForTimeout(1500);

  const cinemaStats = await page.evaluate(() => {
    const wsRow = document.getElementById('moviesWebSeriesRow');
    const bRow = document.getElementById('moviesBollywoodRow');
    const tRow = document.getElementById('moviesTrailersRow');
    return {
      webSeriesCount: wsRow ? wsRow.querySelectorAll('.theatrical-card').length : 0,
      bollywoodCount: bRow ? bRow.querySelectorAll('.theatrical-card').length : 0,
      trailersCount: tRow ? tRow.querySelectorAll('.theatrical-card').length : 0
    };
  });
  console.log('Cinema page stats:', cinemaStats);

  await page.screenshot({ path: path.join(artifactDir, 'playwright_cinema_final_verified.png') });
  console.log('Saved playwright_cinema_final_verified.png');

  await browser.close();
  console.log('E2E validation finished successfully!');
})();
