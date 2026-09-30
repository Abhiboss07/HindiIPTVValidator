const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

function startStaticServer(port = 8094) {
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
    let filePath = path.join(root, req.url.split('?')[0]);
    if (filePath.endsWith('/') || !path.extname(filePath)) {
      filePath = path.join(filePath, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(err.code === 'ENOENT' ? 404 : 500);
        res.end(`Error: ${err.code}`);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise(resolve => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Server running at http://127.0.0.1:${port}/`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startStaticServer(8094);
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
      console.log(`[Browser Console Error] ${msg.text()}`);
    }
  });

  try {
    console.log('Navigating to app...');
    await page.goto('http://127.0.0.1:8094/index.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 1. Verify Home Page Rows
    const homeWebSeriesCount = await page.$$eval('#homeWebSeriesRow .theatrical-card', els => els.length);
    const homeTrailersCount = await page.$$eval('#homeTrailersRow .theatrical-card', els => els.length);
    console.log(`Home Web-Series Count: ${homeWebSeriesCount}`);
    console.log(`Home Trailers Count: ${homeTrailersCount}`);

    // Verify titles in Home Web-Series
    const homeSeriesTitles = await page.$$eval('#homeWebSeriesRow .theatrical-title', els => els.map(e => e.textContent.trim()));
    console.log('Home Series Sample Titles:', homeSeriesTitles.slice(0, 6));

    // Verify titles in Home Trailers
    const homeTrailerTitles = await page.$$eval('#homeTrailersRow .theatrical-title', els => els.map(e => e.textContent.trim()));
    console.log('Home Trailer Sample Titles:', homeTrailerTitles.slice(0, 6));

    // Scroll to Home Web-Series and Trailers
    await page.evaluate(() => document.getElementById('homeWebSeriesRow')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_home_webseries_row.png' });
    console.log('Saved playwright_home_webseries_row.png');

    await page.evaluate(() => document.getElementById('homeTrailersRow')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_home_trailers_row.png' });
    console.log('Saved playwright_home_trailers_row.png');

    // 2. Navigate to Cinema Page
    await page.evaluate(() => navigateTo('cinema'));
    await page.waitForTimeout(1500);

    const cinemaWebSeriesCount = await page.$$eval('#moviesWebSeriesRow .theatrical-card', els => els.length);
    const cinemaTrailersCount = await page.$$eval('#moviesTrailersRow .theatrical-card', els => els.length);
    console.log(`Cinema Web-Series Count: ${cinemaWebSeriesCount}`);
    console.log(`Cinema Trailers Count: ${cinemaTrailersCount}`);

    // Scroll to Cinema Web-Series
    await page.evaluate(() => document.getElementById('moviesWebSeriesRow')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_webseries_row.png' });
    console.log('Saved playwright_cinema_webseries_row.png');

    // Scroll to Cinema Trailers
    await page.evaluate(() => document.getElementById('moviesTrailersRow')?.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_trailers_row.png' });
    console.log('Saved playwright_cinema_trailers_row.png');

    // 3. Open Gullak Modal
    await page.evaluate(() => openMovieDetails('series_gullak'));
    await page.waitForTimeout(1000);

    const gullakTitle = await page.$eval('#movieDetailsTitle', e => e.textContent.trim());
    const gullakBadge = await page.$eval('#seriesTotalEpisodesBadge', e => e.textContent.trim());
    console.log(`Gullak Modal Title: ${gullakTitle}, Badge: ${gullakBadge}`);

    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_gullak_modal.png' });
    console.log('Saved playwright_gullak_modal.png');

    // 4. Test Elephants Dream Playback
    await page.evaluate(() => {
      document.getElementById('movieDetailsModal')?.classList.remove('active');
      openMovieDetails('vod_elephants_dream_1080p');
    });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_elephants_modal.png' });
    console.log('Saved playwright_elephants_modal.png');

    // Launch Stream
    await page.evaluate(() => handleStreamMovieClick());
    await page.waitForTimeout(5000);

    const playerState = await page.evaluate(() => {
      const v = document.getElementById('luminaVideo');
      const errBanner = document.getElementById('playerErrorBanner') || document.querySelector('.player-error');
      const toast = document.querySelector('.t2l-toast.error');
      const modal = document.getElementById('playerModal');
      return {
        playerModalActive: modal ? modal.classList.contains('active') : null,
        paused: v ? v.paused : null,
        currentTime: v ? v.currentTime : null,
        duration: v ? v.duration : null,
        src: v ? v.src : null,
        videoWidth: v ? v.videoWidth : null,
        videoHeight: v ? v.videoHeight : null,
        readyState: v ? v.readyState : null,
        error: v && v.error ? { code: v.error.code, message: v.error.message } : null,
        errBanner: errBanner ? errBanner.textContent : null,
        toast: toast ? toast.textContent : null
      };
    });

    console.log('Elephants Dream Player State:', JSON.stringify(playerState, null, 2));

    await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_elephants_playback.png' });
    console.log('Saved playwright_elephants_playback.png');

    console.log('All tests finished successfully!');
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

run();
