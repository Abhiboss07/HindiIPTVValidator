const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Launching T2L Interactive Test Window via Playwright...');

  const browser = await chromium.launch({
    headless: false,
    executablePath: '/home/abhiboss/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--start-maximized'
    ]
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:8888/ ...');
  await page.goto('http://127.0.0.1:8888/', { waitUntil: 'domcontentloaded' });

  console.log('====================================================================');
  console.log('✨ T2L Web App is now open and visible on your desktop screen!');
  console.log('👉 You can now test:');
  console.log('   1. YouTube Streams (e.g. Parasite, One-Punch Man, Solo Leveling, Jujutsu Kaisen)');
  console.log('      - Notice our video player is completely disabled.');
  console.log('      - Native YouTube CC and settings buttons work with zero clash.');
  console.log('      - Top-left floating "Back" pill allows smooth exit.');
  console.log('   2. Series & Anime Episodes:');
  console.log('      - Panchayat (Season 1 with 8 episodes, Season 2 with 8 episodes).');
  console.log('      - Undekhi (Season 1 with 10 eps, Season 2 with 10 eps, Season 3 with 8 eps).');
  console.log('      - Death Note (37 episodes).');
  console.log('   3. Non-YouTube Streams (MP4 / HLS / Live TV):');
  console.log('      - Full custom VLC player controls, gestures, and audio tracks active.');
  console.log('====================================================================');

  // Keep process alive while the user tests
  await new Promise((resolve) => {
    browser.on('disconnected', resolve);
    page.on('close', resolve);
  });

  console.log('Browser window closed by user. Exiting test session.');
  process.exit(0);
})();
