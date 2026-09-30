const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Built-in static server for testing
function startStaticServer(port = 8089) {
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
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(root, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });

  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  console.log('🚀 Starting Playwright Short Films & Trailers Verification...');
  const server = await startStaticServer(8089);
  console.log('HTTP Static server listening on http://127.0.0.1:8089');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Pixel 7 screen size
  });

  const page = await context.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[BROWSER ERROR] ${msg.text()}`);
  });

  console.log('Navigating to http://127.0.0.1:8089/index.html...');
  await page.goto('http://127.0.0.1:8089/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Verify Home Page 4K Short Cinema Rail
  console.log('Verifying Home Page 4K Short Cinema Rail...');
  const homeShortsCount = await page.evaluate(() => {
    const row = document.getElementById('homeShortsRow');
    return row ? row.querySelectorAll('.theatrical-card').length : 0;
  });
  console.log(`✅ homeShortsRow populated with: ${homeShortsCount} titles`);
  if (homeShortsCount === 0) throw new Error('homeShortsRow is empty!');
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_home_shorts_row.png' });

  // 2. Switch to Movies Page
  console.log('Switching to Movies Page (Cinema Pavilion)...');
  await page.evaluate(() => window.switchPage('movies'));
  await page.waitForTimeout(1000);

  // Verify dedicated Short Cinema Section on Cinema Page
  const cinemaShortSection = await page.evaluate(() => {
    const sec = document.getElementById('moviesShortCinemaSection');
    const kicker = sec?.querySelector('.cinema-shelf-kicker')?.textContent;
    const heading = sec?.querySelector('.cinema-shelf-heading')?.textContent;
    const count = sec?.querySelectorAll('.theatrical-card').length || 0;
    return {
      exists: sec !== null,
      kicker,
      heading,
      count
    };
  });
  console.log('Cinema Page Short Movies Section:', cinemaShortSection);
  if (!cinemaShortSection.exists) throw new Error('moviesShortCinemaSection does not exist on Cinema page!');
  if (cinemaShortSection.count === 0) throw new Error('moviesShortsRow inside moviesShortCinemaSection is empty!');

  // Filter Cinema Mode by 'Shorts'
  await page.evaluate(() => window.filterCinemaMode('Shorts'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_shorts_section.png' });
  console.log('Captured screenshot: playwright_cinema_shorts_section.png');

  // Verify Trailers Row
  const trailersCount = await page.evaluate(() => {
    const row = document.getElementById('moviesTrailersRow');
    return row ? row.querySelectorAll('.theatrical-card').length : 0;
  });
  console.log(`✅ moviesTrailersRow populated with: ${trailersCount} titles`);
  if (trailersCount === 0) throw new Error('moviesTrailersRow is empty!');

  // 3. Test Tears of Steel Detail Modal
  console.log('Testing Tears of Steel Detail Modal...');
  await page.evaluate(() => window.openMovieDetails('vod_tears_of_steel_4k'));
  await page.waitForTimeout(500);

  const tosData = await page.evaluate(() => {
    return {
      title: document.getElementById('movieDetailsTitle')?.textContent,
      categoryChip: document.getElementById('movieDetailsCategoryChip')?.textContent,
      duration: document.getElementById('movieDetailsDuration')?.textContent,
      resolution: document.getElementById('movieDetailsResolution')?.textContent
    };
  });
  console.log('Tears of Steel Modal:', tosData);
  if (!tosData.categoryChip.includes('Short Film')) {
    throw new Error('Tears of Steel categoryChip is missing Short Film designation: ' + tosData.categoryChip);
  }
  if (!tosData.duration.includes('Complete')) {
    throw new Error('Tears of Steel duration is missing Complete Open Movie designation: ' + tosData.duration);
  }

  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_tears_of_steel_modal.png' });
  await page.evaluate(() => window.closeMovieDetails());
  await page.waitForTimeout(300);

  // 4. Test Sintel Detail Modal
  console.log('Testing Sintel Detail Modal...');
  await page.evaluate(() => window.openMovieDetails('vod_sintel_4k'));
  await page.waitForTimeout(500);

  const sintelData = await page.evaluate(() => {
    return {
      title: document.getElementById('movieDetailsTitle')?.textContent,
      categoryChip: document.getElementById('movieDetailsCategoryChip')?.textContent,
      duration: document.getElementById('movieDetailsDuration')?.textContent,
      resolution: document.getElementById('movieDetailsResolution')?.textContent
    };
  });
  console.log('Sintel Modal:', sintelData);
  if (!sintelData.categoryChip.includes('Short Film')) {
    throw new Error('Sintel categoryChip is missing Short Film designation: ' + sintelData.categoryChip);
  }

  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_sintel_modal.png' });
  await page.evaluate(() => window.closeMovieDetails());
  await page.waitForTimeout(300);

  // 5. Test Trailer Playback
  console.log('Testing Trailer Playback...');
  await page.evaluate(() => window.openMovieDetails('vod_sikandar_2025'));
  await page.waitForTimeout(500);
  
  const sikandarData = await page.evaluate(() => {
    return {
      title: document.getElementById('movieDetailsTitle')?.textContent,
      categoryChip: document.getElementById('movieDetailsCategoryChip')?.textContent,
      btnText: document.getElementById('btnStreamText')?.textContent
    };
  });
  console.log('Sikandar (Trailer Only):', sikandarData);
  if (!sikandarData.categoryChip.includes('Trailer')) {
    throw new Error('Sikandar categoryChip must say Trailer: ' + sikandarData.categoryChip);
  }

  // Click Watch Trailer
  await page.evaluate(() => window.handleStreamMovieClick());
  await page.waitForTimeout(1500);

  const trailerPlayerState = await page.evaluate(() => {
    const modal = document.getElementById('playerModal');
    const iframe = document.getElementById('luminaIframe');
    return {
      isModalActive: modal?.classList.contains('active'),
      isEmbedded: modal?.classList.contains('is-embedded-player'),
      iframeDisplay: iframe?.style.display,
      iframeSrc: iframe?.src
    };
  });
  console.log('Trailer Player State:', trailerPlayerState);
  if (!trailerPlayerState.isModalActive) throw new Error('Player modal not active for trailer!');
  if (!trailerPlayerState.iframeSrc.includes('youtube-nocookie.com/embed/')) {
    throw new Error('Iframe src does not contain valid YouTube embed: ' + trailerPlayerState.iframeSrc);
  }

  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_trailer_player.png' });

  console.log('🎉 ALL PLAYWRIGHT SHORTS & TRAILERS VERIFICATION TESTS PASSED SUCCESSFULLY!');
  await browser.close();
  server.close();
  process.exit(0);
})();
