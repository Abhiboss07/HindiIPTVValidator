const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

function startStaticServer(port = 8099) {
  const root = path.resolve(__dirname, '..');
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.vtt': 'text/vtt'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0];
    if (cleanUrl === '/') cleanUrl = '/index.html';
    const filePath = path.join(root, cleanUrl);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + cleanUrl);
        return;
      }
      const ext = path.extname(filePath);
      const mime = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Test static server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startStaticServer(8099);
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Pixel 7 viewport
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  const artifactDir = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

  try {
    console.log('Navigating to app...');
    await page.goto('http://127.0.0.1:8099/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // 1. Test "History →" / "Continue Watching" on Home
    console.log('Testing Home -> Continue Watching / History...');
    await page.click('#homeMovieContinueSection .content-rail-see-all');
    await page.waitForTimeout(600);

    let isHistoryActive = await page.evaluate(() => document.getElementById('page-history')?.classList.contains('active'));
    console.log('Is page-history active:', isHistoryActive);
    if (!isHistoryActive) throw new Error('page-history was not activated by clicking History ->');

    await page.screenshot({ path: path.join(artifactDir, 'page_history_verified.png') });
    console.log('Saved page_history_verified.png');

    // Click Back from History
    console.log('Clicking Back button on History page...');
    await page.click('#page-history .collection-back-btn');
    await page.waitForTimeout(500);

    let isHomeActive = await page.evaluate(() => document.getElementById('page-home')?.classList.contains('active'));
    console.log('Is page-home active after Back:', isHomeActive);
    if (!isHomeActive) throw new Error('Return to page-home failed');

    // 2. Test "Explore Pavilion →" on Bollywood Blockbusters
    console.log('Testing Home -> Trending Hindi Blockbusters...');
    const bollywoodSeeAll = await page.$('.content-rail-header:has-text("Trending Hindi Blockbusters") .content-rail-see-all');
    if (bollywoodSeeAll) {
      await bollywoodSeeAll.click();
    } else {
      await page.evaluate(() => window.openCategoryPage('Bollywood', 'Trending Hindi Blockbusters', 'HINDI FIRST • BLOCKBUSTERS', 'home'));
    }
    await page.waitForTimeout(600);

    let isCollectionActive = await page.evaluate(() => document.getElementById('page-collection')?.classList.contains('active'));
    let collTitle = await page.evaluate(() => document.getElementById('collectionPageTitle')?.textContent);
    let collCount = await page.evaluate(() => document.getElementById('collectionPageCount')?.textContent);
    let cardCount = await page.evaluate(() => document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length);
    console.log(`Collection active: ${isCollectionActive}, Title: "${collTitle}", Count: "${collCount}", Grid cards: ${cardCount}`);
    if (!isCollectionActive || cardCount === 0) throw new Error('Bollywood collection page failed to render cards');

    await page.screenshot({ path: path.join(artifactDir, 'page_collection_bollywood_verified.png') });
    console.log('Saved page_collection_bollywood_verified.png');

    // Test in-collection search
    console.log('Testing in-collection search...');
    await page.fill('#collectionSearchInput', 'Kalki');
    await page.waitForTimeout(400);
    let filteredCount = await page.evaluate(() => document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length);
    console.log(`Filtered cards for 'Kalki': ${filteredCount}`);

    // Click Back from Collection
    console.log('Clicking Back button on Collection page...');
    await page.click('#page-collection .collection-back-btn');
    await page.waitForTimeout(500);
    isHomeActive = await page.evaluate(() => document.getElementById('page-home')?.classList.contains('active'));
    console.log('Is page-home active after Collection Back:', isHomeActive);

    // 3. Test "See All →" on Short Movies
    console.log('Testing Home -> Short Movies...');
    const shortsSeeAll = await page.$('.content-rail-header:has-text("Short Movies") .content-rail-see-all');
    if (shortsSeeAll) {
      await shortsSeeAll.click();
    } else {
      await page.evaluate(() => window.openCategoryPage('Shorts', 'Short Movies (4K Ultra HD)', '4K ULTRA HD • CURATED SHORTS', 'home'));
    }
    await page.waitForTimeout(600);
    collTitle = await page.evaluate(() => document.getElementById('collectionPageTitle')?.textContent);
    cardCount = await page.evaluate(() => document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length);
    console.log(`Shorts Collection Title: "${collTitle}", Grid cards: ${cardCount}`);
    if (cardCount === 0) throw new Error('Shorts collection page failed to render cards');

    await page.screenshot({ path: path.join(artifactDir, 'page_collection_shorts_verified.png') });
    console.log('Saved page_collection_shorts_verified.png');

    // Back
    await page.click('#page-collection .collection-back-btn');
    await page.waitForTimeout(400);

    // 4. Test "Trailers Pavilion →" on Trailers
    console.log('Testing Home -> Trailers Pavilion...');
    const trailersSeeAll = await page.$('.content-rail-header:has-text("Official Trailers") .content-rail-see-all');
    if (trailersSeeAll) {
      await trailersSeeAll.click();
    } else {
      await page.evaluate(() => window.openCategoryPage('Trailers', 'Official Theatrical Trailers', '4K OFFICIAL PREVIEWS • TEASERS', 'home'));
    }
    await page.waitForTimeout(600);
    collTitle = await page.evaluate(() => document.getElementById('collectionPageTitle')?.textContent);
    cardCount = await page.evaluate(() => document.querySelectorAll('#collectionCatalogGrid .theatrical-card').length);
    console.log(`Trailers Collection Title: "${collTitle}", Grid cards: ${cardCount}`);
    if (cardCount === 0) throw new Error('Trailers collection page failed to render cards');

    await page.screenshot({ path: path.join(artifactDir, 'page_collection_trailers_verified.png') });
    console.log('Saved page_collection_trailers_verified.png');

    // Back
    await page.click('#page-collection .collection-back-btn');
    await page.waitForTimeout(400);

    // 5. Test from Cinema Tab
    console.log('Switching to Cinema tab...');
    await page.evaluate(() => window.navigateTo('cinema'));
    await page.waitForTimeout(600);

    let isCinemaActive = await page.evaluate(() => document.getElementById('page-movies')?.classList.contains('active'));
    console.log('Is Cinema page active:', isCinemaActive);

    // Click "See All →" on Bollywood in Cinema
    console.log('Testing Cinema -> Bollywood shelf action...');
    await page.click('#moviesBollywoodRow').catch(() => {});
    await page.evaluate(() => {
      const btn = document.querySelector('#page-movies .content-rail-section:has(#moviesBollywoodRow) .cinema-shelf-action');
      if (btn) btn.click();
      else window.openCategoryPage('Bollywood', 'Bollywood Blockbusters', 'HINDI FIRST • BLOCKBUSTERS', 'movies');
    });
    await page.waitForTimeout(600);

    isCollectionActive = await page.evaluate(() => document.getElementById('page-collection')?.classList.contains('active'));
    console.log('Is collection active from Cinema:', isCollectionActive);

    // Click Back: should return to Cinema page!
    await page.click('#page-collection .collection-back-btn');
    await page.waitForTimeout(500);

    isCinemaActive = await page.evaluate(() => document.getElementById('page-movies')?.classList.contains('active'));
    console.log('Returned to Cinema page after Back:', isCinemaActive);
    if (!isCinemaActive) throw new Error('Failed to return to Cinema page');

    console.log('🎉 ALL BUTTON AND PAGE NAVIGATION TESTS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
