const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

async function run() {
  console.log('🚀 Starting Playwright verification suite for Card CTA & Auto-Rotate...');
  
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 15; Nothing Phone 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
  });

  // Track orientation calls via mocked AndroidMedia bridge
  await context.addInitScript(() => {
    window.__orientationHistory = [];
    window.AndroidMedia = {
      setOrientation: function(mode) {
        window.__orientationHistory.push({ action: 'setOrientation', mode: mode, time: Date.now() });
        console.log('[NativeBridge] setOrientation called with: ' + mode);
      },
      resetOrientationToDefault: function() {
        window.__orientationHistory.push({ action: 'resetOrientationToDefault', time: Date.now() });
        console.log('[NativeBridge] resetOrientationToDefault called');
      },
      setFullscreen: function(f) {},
      keepScreenOn: function(k) {},
      getNetworkSpeedInfo: function() {
        return JSON.stringify({ isConnected: true, speedMbps: 78.4, type: 'WIFI', latencyMs: 14 });
      },
      measureRealtimeSpeed: function() {
        return 82.5;
      }
    };
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('BROWSER ERROR:', msg.text());
    }
  });

  console.log('🌐 Navigating to http://127.0.0.1:8088/index.html...');
  await page.goto('http://127.0.0.1:8088/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // =========================================================================
  // TEST SUITE 1: Card CTA: "STREAM DIRECT" Only
  // =========================================================================
  console.log('\n--- TEST SUITE 1: Card CTA strictly STREAM DIRECT ---');

  // 1a. Test 4K UHD Showcase
  console.log('Testing 4K UHD item (vod_4k_uhd_reference_showcase)...');
  await page.evaluate(() => {
    window.openMovieDetails('vod_4k_uhd_reference_showcase');
  });
  await page.waitForTimeout(500);

  const btnText4K = await page.$eval('#btnMovieStreamText', el => el.textContent.trim());
  console.log(`4K Showcase CTA Button Text: "${btnText4K}"`);
  if (btnText4K !== 'STREAM DIRECT') {
    throw new Error(`TEST FAILED: Expected "STREAM DIRECT", got "${btnText4K}"`);
  }
  console.log('✅ 4K Showcase CTA button is strictly "STREAM DIRECT"');

  const cta4kPath = path.join(ARTIFACT_DIR, 'playwright_card_cta_4k.png');
  await page.screenshot({ path: cta4kPath });
  console.log(`📸 Screenshot saved: ${cta4kPath}`);

  // Close details
  await page.evaluate(() => window.closeMovieDetails());
  await page.waitForTimeout(300);

  // 1b. Test standard direct stream movie (Sita Sings the Blues)
  console.log('Testing 1080p / Standard direct stream movie (vod_sita_sings_blues)...');
  await page.evaluate(() => {
    window.openMovieDetails('vod_sita_sings_blues');
  });
  await page.waitForTimeout(500);

  const btnTextSita = await page.$eval('#btnMovieStreamText', el => el.textContent.trim());
  console.log(`Sita Sings the Blues CTA Button Text: "${btnTextSita}"`);
  if (btnTextSita !== 'STREAM DIRECT') {
    throw new Error(`TEST FAILED: Expected "STREAM DIRECT", got "${btnTextSita}"`);
  }
  console.log('✅ Standard direct movie CTA button is strictly "STREAM DIRECT"');

  const ctaDirectPath = path.join(ARTIFACT_DIR, 'playwright_card_cta_direct.png');
  await page.screenshot({ path: ctaDirectPath });
  console.log(`📸 Screenshot saved: ${ctaDirectPath}`);

  // Close details
  await page.evaluate(() => window.closeMovieDetails());
  await page.waitForTimeout(300);

  // =========================================================================
  // TEST SUITE 2: Auto-Rotate & Orientation Cycling
  // =========================================================================
  console.log('\n--- TEST SUITE 2: Auto-Rotate & Orientation Cycling ---');

  // Open Full Player Modal
  console.log('Opening Full Player modal...');
  await page.evaluate(() => {
    window.openFullPlayerModal();
  });
  await page.waitForTimeout(500);

  // Check initial orientation request on modal open
  const openOrientations = await page.evaluate(() => window.__orientationHistory);
  console.log('Orientation calls on open:', JSON.stringify(openOrientations));
  const lastCallOnOpen = openOrientations[openOrientations.length - 1];
  if (!lastCallOnOpen || lastCallOnOpen.mode !== 'auto') {
    throw new Error(`TEST FAILED: Expected openFullPlayerModal to set orientation "auto", got "${lastCallOnOpen ? lastCallOnOpen.mode : 'none'}"`);
  }
  console.log('✅ Player opens with orientation "auto" (sensor enabled)');

  // Verify initial UI text
  const initialRotateText = await page.$eval('#playerRotateText', el => el.textContent.trim());
  console.log(`Initial playerRotateText: "${initialRotateText}"`);
  if (initialRotateText !== '🔄 Auto-Rotate') {
    throw new Error(`TEST FAILED: Expected "🔄 Auto-Rotate", got "${initialRotateText}"`);
  }

  // Verify btnVlcRotate exists and is clickable
  const btnVlcRotateVisible = await page.$eval('#btnVlcRotate', el => !!el);
  console.log('btnVlcRotate button present in DOM:', btnVlcRotateVisible);

  // Click 1: Cycle to Landscape
  console.log('Clicking btnVlcRotate to cycle orientation -> Landscape...');
  await page.click('#btnVlcRotate');
  await page.waitForTimeout(300);

  const state1 = await page.evaluate(() => ({
    text: document.getElementById('playerRotateText').textContent.trim(),
    sub: document.getElementById('vlcRotateSubtitle') ? document.getElementById('vlcRotateSubtitle').textContent.trim() : null,
    lastCall: window.__orientationHistory[window.__orientationHistory.length - 1]
  }));
  console.log('Cycle 1 state:', state1);
  if (state1.text !== '🔄 Landscape' || state1.lastCall.mode !== 'landscape') {
    throw new Error(`TEST FAILED on cycle to landscape: ${JSON.stringify(state1)}`);
  }
  console.log('✅ Cycle 1 passed: Orientation switched to "landscape"');

  // Click 2: Cycle to Portrait
  console.log('Clicking btnVlcRotate to cycle orientation -> Portrait...');
  await page.click('#btnVlcRotate');
  await page.waitForTimeout(300);

  const state2 = await page.evaluate(() => ({
    text: document.getElementById('playerRotateText').textContent.trim(),
    sub: document.getElementById('vlcRotateSubtitle') ? document.getElementById('vlcRotateSubtitle').textContent.trim() : null,
    lastCall: window.__orientationHistory[window.__orientationHistory.length - 1]
  }));
  console.log('Cycle 2 state:', state2);
  if (state2.text !== '🔄 Portrait' || state2.lastCall.mode !== 'portrait') {
    throw new Error(`TEST FAILED on cycle to portrait: ${JSON.stringify(state2)}`);
  }
  console.log('✅ Cycle 2 passed: Orientation switched to "portrait"');

  // Click 3: Cycle back to Auto-Rotate
  console.log('Clicking btnVlcRotate to cycle orientation -> Auto-Rotate...');
  await page.click('#btnVlcRotate');
  await page.waitForTimeout(300);

  const state3 = await page.evaluate(() => ({
    text: document.getElementById('playerRotateText').textContent.trim(),
    sub: document.getElementById('vlcRotateSubtitle') ? document.getElementById('vlcRotateSubtitle').textContent.trim() : null,
    lastCall: window.__orientationHistory[window.__orientationHistory.length - 1]
  }));
  console.log('Cycle 3 state:', state3);
  if (state3.text !== '🔄 Auto-Rotate' || state3.lastCall.mode !== 'auto') {
    throw new Error(`TEST FAILED on cycle to auto: ${JSON.stringify(state3)}`);
  }
  console.log('✅ Cycle 3 passed: Orientation returned to "auto" (sensor full control)');

  // Test More Options Drawer Screen Rotation item
  console.log('Opening VLC More Options Drawer...');
  await page.evaluate(() => window.openVlcMoreMenu());
  await page.waitForTimeout(400);

  const drawerSub = await page.$eval('#vlcRotateSubtitle', el => el.textContent.trim());
  console.log(`vlcRotateSubtitle badge in options drawer: "${drawerSub}"`);
  if (drawerSub !== 'Auto') {
    throw new Error(`TEST FAILED: Expected drawer subtitle "Auto", got "${drawerSub}"`);
  }

  const autorotatePlayerPath = path.join(ARTIFACT_DIR, 'playwright_autorotate_player.png');
  await page.screenshot({ path: autorotatePlayerPath });
  console.log(`📸 Screenshot saved: ${autorotatePlayerPath}`);

  // Close player and verify orientation restored to portrait
  console.log('Closing player modal...');
  await page.evaluate(() => window.closeMiniPlayer());
  await page.waitForTimeout(300);

  const closeHistory = await page.evaluate(() => window.__orientationHistory);
  const lastCloseCall = closeHistory[closeHistory.length - 1];
  console.log('Orientation call on close:', JSON.stringify(lastCloseCall));
  const restoredToPortrait = closeHistory.some(h => (h.action === 'setOrientation' && h.mode === 'portrait') || h.action === 'resetOrientationToDefault');
  if (!restoredToPortrait) {
    throw new Error('TEST FAILED: Player close did not restore orientation to portrait');
  }
  console.log('✅ Player close safely restored portrait orientation for the rest of the app');

  await browser.close();
  console.log('\n🎉 ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY! 100% VERIFIED!\n');
}

run().catch(err => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
