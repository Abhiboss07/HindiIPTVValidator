const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

function startStaticServer(port = 8093) {
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

(async () => {
  const server = await startStaticServer(8093);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:8093/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Activate player modal
  console.log('Activating player modal...');
  await page.evaluate(() => {
    const player = document.getElementById('playerModal');
    if (player) {
      player.classList.add('active');
      player.style.display = 'flex';
    }
  });
  await page.waitForTimeout(400);

  // 1. Lock the player
  console.log('Testing togglePlayerLock()...');
  await page.evaluate(() => {
    window.togglePlayerLock();
  });
  await page.waitForTimeout(200);

  // Verify lock pill is visible
  const isPillVisible = await page.evaluate(() => {
    const pill = document.getElementById('playerLockOverlay');
    return pill && pill.style.display === 'flex' && !pill.classList.contains('fade-out');
  });
  console.log('Lock pill immediately visible after locking:', isPillVisible);
  if (!isPillVisible) throw new Error('Lock pill did not appear when locked!');

  // Capture screenshot of visible lock capsule
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_locked_visible.png' });

  // 2. Wait 3 seconds (2-3 sec auto-hide threshold)
  console.log('Waiting 3s for lock capsule to auto-dissolve...');
  await page.waitForTimeout(3000);

  const isPillHidden = await page.evaluate(() => {
    const pill = document.getElementById('playerLockOverlay');
    return pill && (pill.style.display === 'none' || pill.classList.contains('fade-out'));
  });
  console.log('Lock pill automatically dissolved after 3s:', isPillHidden);
  if (!isPillHidden) throw new Error('Lock pill did not auto-dissolve within 2-3 sec!');

  // Capture screenshot of clean video screen after capsule dissolved
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_locked_dissolved.png' });

  // 3. Tap the screen while locked
  console.log('Tapping video screen while locked...');
  await page.click('#playerModal', { position: { x: 600, y: 400 } });
  await page.waitForTimeout(200);

  const isPillReappeared = await page.evaluate(() => {
    const pill = document.getElementById('playerLockOverlay');
    return pill && pill.style.display === 'flex' && !pill.classList.contains('fade-out');
  });
  console.log('Lock pill reappeared on screen tap:', isPillReappeared);
  if (!isPillReappeared) throw new Error('Lock pill did not reappear on screen tap!');

  // Capture screenshot of reappeared capsule
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_locked_reappeared.png' });

  // 4. Tap the lock pill to unlock
  console.log('Tapping lock pill to unlock...');
  await page.click('#playerLockOverlay');
  await page.waitForTimeout(200);

  const isUnlocked = await page.evaluate(() => {
    const pill = document.getElementById('playerLockOverlay');
    const controls = document.getElementById('playerUiOverlay');
    return pill.style.display === 'none' && !controls.classList.contains('hidden-controls');
  });
  console.log('Player unlocked and controls restored:', isUnlocked);
  if (!isUnlocked) throw new Error('Player did not unlock cleanly!');

  await browser.close();
  server.close();
  console.log('All player lock auto-hide tests passed perfectly!');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
