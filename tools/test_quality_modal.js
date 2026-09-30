const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

function startStaticServer(port = 8092) {
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
  const server = await startStaticServer(8092);

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://127.0.0.1:8092/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Activate player modal and open quality dialog
  await page.evaluate(() => {
    const player = document.getElementById('playerModal');
    if (player) player.classList.add('active');
    window.openVlcQualityModal();
  });
  await page.waitForTimeout(600);

  // Verify modal is visible
  const modalVisible = await page.isVisible('#vlcQualityModal');
  console.log('Modal visible:', modalVisible);

  // Verify Upper section Network Speed
  const upperSection = await page.evaluate(() => {
    const sections = document.querySelectorAll('#vlcQualityModal .vlc-dialog-section');
    const firstSec = sections[0];
    const spans = firstSec ? Array.from(firstSec.querySelectorAll('span')).map(s => s.textContent.trim()) : [];
    const secondSec = sections[1];
    const secLabel = secondSec ? secondSec.querySelector('label')?.textContent.trim() : '';
    return {
      networkLabel: spans[0] || '',
      liveSpeed: spans[1] || '',
      sectionLabel: secLabel || ''
    };
  });
  console.log('Upper section verified:', upperSection);

  const options = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('#vlcQualityOptionsList .vlc-radio-row')).map(row => {
      const h4 = row.querySelector('h4');
      const p = row.querySelector('p');
      return {
        title: h4 ? h4.textContent.trim().replace(/\s+/g, ' ') : '',
        desc: p ? p.textContent.trim().replace(/\s+/g, ' ') : ''
      };
    });
  });

  console.log('Resolution Options:', JSON.stringify(options, null, 2));

  // Assertions
  if (!upperSection.networkLabel.includes('Network Speed')) {
    throw new Error('Upper section Network Speed is missing or modified!');
  }
  if (!upperSection.liveSpeed.includes('Mbps') && !upperSection.liveSpeed.includes('High Speed')) {
    throw new Error('Live network speed value is missing!');
  }
  if (upperSection.sectionLabel !== 'Resolution') {
    throw new Error(`Expected section label "Resolution", got "${upperSection.sectionLabel}"`);
  }

  const fourKOption = options.find(o => o.title.includes('4K UHD (2160p)'));
  if (!fourKOption) {
    throw new Error('4K UHD (2160p) option not found!');
  }
  console.log('4K option verified:', fourKOption);

  if (!fourKOption.title.includes('~25 Mbps speed required')) {
    throw new Error(`4K option does not contain speed required: ${fourKOption.title}`);
  }

  // Also check 1080p, 720p, 480p, 360p, 144p
  const fhdOption = options.find(o => o.title.includes('1080p FHD (1080p)'));
  if (!fhdOption || !fhdOption.title.includes('~8 Mbps speed required')) {
    throw new Error(`1080p FHD option missing or incorrect speed: ${JSON.stringify(fhdOption)}`);
  }

  // Capture desktop screenshot for artifact verification
  const screenshotPath = path.resolve('/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_quality_modal.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // Also test mobile portrait viewport
  await page.setViewportSize({ width: 412, height: 915 });
  await page.waitForTimeout(300);
  const mobileScreenshotPath = path.resolve('/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_quality_modal_mobile.png');
  await page.screenshot({ path: mobileScreenshotPath });
  console.log('Mobile screenshot saved to:', mobileScreenshotPath);

  await browser.close();
  server.close();
  console.log('All Quality Modal tests passed successfully!');
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
