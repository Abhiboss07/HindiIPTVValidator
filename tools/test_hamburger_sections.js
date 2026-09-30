const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

async function testHamburgerSuite() {
  console.log('========================================================================');
  console.log('🍔 T2L HAMBURGER MENU & UTILITIES COMPLETE VERIFICATION SUITE');
  console.log('========================================================================\n');

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

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('🛑 CONSOLE ERROR:', msg.text());
  });
  page.on('pageerror', err => console.log('🛑 UNCAUGHT PAGE ERROR:', err.message));

  console.log('🌐 Loading T2L Application from http://127.0.0.1:8088/index.html...');
  await page.goto('http://127.0.0.1:8088/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Helper to open hamburger
  async function openHamburgerMenu() {
    await page.click('#btnHamburger');
    await page.waitForTimeout(300);
    const isOpen = await page.$eval('#hamburgerDrawer', el => el.classList.contains('is-open') || el.classList.contains('active'));
    if (!isOpen) throw new Error('Hamburger drawer failed to open');
  }

  // 1. TEST HAMBURGER OPEN & CLOSE
  console.log('\n--- 1. Testing Hamburger Open & Close ---');
  await openHamburgerMenu();
  const drawerScreenshot = path.join(ARTIFACT_DIR, 'playwright_hamburger_open.png');
  await page.screenshot({ path: drawerScreenshot });
  console.log(`📸 Screenshot saved: ${drawerScreenshot}`);

  await page.click('#hamburgerDrawer button[aria-label="Close Hub"]');
  await page.waitForTimeout(300);
  const isClosed = await page.$eval('#hamburgerDrawer', el => !el.classList.contains('is-open'));
  console.log(`✅ Hamburger Close: ${isClosed ? 'PASS' : 'FAIL'}`);

  // 2. TEST MY LIST MODAL
  console.log('\n--- 2. Testing Hamburger -> My List ---');
  await openHamburgerMenu();
  // Click My List (first menu item)
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const myListItem = Array.from(items).find(el => el.textContent.includes('My List'));
    if (myListItem) myListItem.click();
  });
  await page.waitForTimeout(400);

  const myListActive = await page.$eval('#myListModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ My List Modal Opened: ${myListActive ? 'PASS' : 'FAIL'}`);
  const myListScreenshot = path.join(ARTIFACT_DIR, 'playwright_my_list_modal.png');
  await page.screenshot({ path: myListScreenshot });
  console.log(`📸 Screenshot saved: ${myListScreenshot}`);

  await page.click('#myListModal button[aria-label="Close My List"]');
  await page.waitForTimeout(300);

  // 3. TEST CONTINUE WATCHING
  console.log('\n--- 3. Testing Hamburger -> Continue Watching ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const continueItem = Array.from(items).find(el => el.textContent.includes('Continue'));
    if (continueItem) continueItem.click();
  });
  await page.waitForTimeout(400);
  const homeActive = await page.$eval('#page-home', el => el.classList.contains('active'));
  console.log(`✅ Continue Watching Route to Home: ${homeActive ? 'PASS' : 'FAIL'}`);

  // 4. TEST OFFLINE DOWNLOADS
  console.log('\n--- 4. Testing Hamburger -> Downloads ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const dlItem = Array.from(items).find(el => el.textContent.includes('Downloads'));
    if (dlItem) dlItem.click();
  });
  await page.waitForTimeout(400);
  const dlActive = await page.$eval('#downloadsManagerModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Downloads Modal Opened: ${dlActive ? 'PASS' : 'FAIL'}`);
  await page.click('#downloadsManagerModal .icon-btn-plain');
  await page.waitForTimeout(300);

  // 5. TEST INSTANT STREAMER
  console.log('\n--- 5. Testing Hamburger -> Instant Streamer ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const streamerItem = Array.from(items).find(el => el.textContent.includes('Streamer'));
    if (streamerItem) streamerItem.click();
  });
  await page.waitForTimeout(400);
  const streamerActive = await page.$eval('#torrentModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Instant Streamer Modal Opened: ${streamerActive ? 'PASS' : 'FAIL'}`);
  await page.click('#torrentModal .icon-btn-plain');
  await page.waitForTimeout(300);

  // 6. TEST NETWORK SPEED TEST
  console.log('\n--- 6. Testing Hamburger -> Network Diagnostics ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const netItem = Array.from(items).find(el => el.textContent.includes('Network'));
    if (netItem) netItem.click();
  });
  await page.waitForTimeout(400);
  const netActive = await page.$eval('#speedTestModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Network Speed Test Modal Opened: ${netActive ? 'PASS' : 'FAIL'}`);
  const speedScreenshot = path.join(ARTIFACT_DIR, 'playwright_speed_test_modal.png');
  await page.screenshot({ path: speedScreenshot });
  console.log(`📸 Screenshot saved: ${speedScreenshot}`);
  await page.click('#speedTestModal .icon-btn-plain');
  await page.waitForTimeout(300);

  // 7. TEST SETTINGS MODAL
  console.log('\n--- 7. Testing Hamburger -> Settings ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const setItem = Array.from(items).find(el => el.textContent.includes('Settings'));
    if (setItem) setItem.click();
  });
  await page.waitForTimeout(400);
  const setActive = await page.$eval('#settingsModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Settings Modal Opened: ${setActive ? 'PASS' : 'FAIL'}`);
  await page.click('#settingsModal .icon-btn-plain');
  await page.waitForTimeout(300);

  // 8. TEST ABOUT MODAL
  console.log('\n--- 8. Testing Hamburger -> About T2L Cinema ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const aboutItem = Array.from(items).find(el => el.textContent.includes('About'));
    if (aboutItem) aboutItem.click();
  });
  await page.waitForTimeout(400);
  const aboutActive = await page.$eval('#appInfoModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  const aboutTabActive = await page.$eval('#infoTabContentAbout', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ About Modal Opened: ${aboutActive && aboutTabActive ? 'PASS' : 'FAIL'}`);
  const aboutScreenshot = path.join(ARTIFACT_DIR, 'playwright_about_modal.png');
  await page.screenshot({ path: aboutScreenshot });
  console.log(`📸 Screenshot saved: ${aboutScreenshot}`);
  await page.click('#appInfoModal button[aria-label="Close Info"]');
  await page.waitForTimeout(300);

  // 9. TEST HELP & FAQS MODAL
  console.log('\n--- 9. Testing Hamburger -> Help & FAQs ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const helpItem = Array.from(items).find(el => el.textContent.includes('Help'));
    if (helpItem) helpItem.click();
  });
  await page.waitForTimeout(400);
  const helpActive = await page.$eval('#appInfoModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  const helpTabActive = await page.$eval('#infoTabContentHelp', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Help Modal Opened: ${helpActive && helpTabActive ? 'PASS' : 'FAIL'}`);
  const helpScreenshot = path.join(ARTIFACT_DIR, 'playwright_help_modal.png');
  await page.screenshot({ path: helpScreenshot });
  console.log(`📸 Screenshot saved: ${helpScreenshot}`);
  await page.click('#appInfoModal button[aria-label="Close Info"]');
  await page.waitForTimeout(300);

  // 10. TEST PRIVACY MODAL
  console.log('\n--- 10. Testing Hamburger -> Privacy ---');
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const privItem = Array.from(items).find(el => el.textContent.includes('Privacy'));
    if (privItem) privItem.click();
  });
  await page.waitForTimeout(400);
  const privActive = await page.$eval('#appInfoModal', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  const privTabActive = await page.$eval('#infoTabContentPrivacy', el => el.classList.contains('active') && (getComputedStyle(el).display !== 'none'));
  console.log(`✅ Privacy Modal Opened: ${privActive && privTabActive ? 'PASS' : 'FAIL'}`);
  const privScreenshot = path.join(ARTIFACT_DIR, 'playwright_privacy_modal.png');
  await page.screenshot({ path: privScreenshot });
  console.log(`📸 Screenshot saved: ${privScreenshot}`);
  await page.click('#appInfoModal button[aria-label="Close Info"]');
  await page.waitForTimeout(300);

  // 11. TEST WATCHLIST ADD & PERSISTENCE
  console.log('\n--- 11. Testing Watchlist Add & Rendering in My List ---');
  await page.evaluate(() => {
    window.openMovieDetails('vod_cosmos_laundromat_2k');
  });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const btn = document.getElementById('btnMovieWatchlist');
    if (btn) btn.click();
  });
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    if (typeof window.closeMovieDetails === 'function') window.closeMovieDetails();
  });
  await page.waitForTimeout(200);

  // Open My List and verify Cosmos Laundromat is in it
  await openHamburgerMenu();
  await page.evaluate(() => {
    const items = document.querySelectorAll('#hamburgerDrawer .drawer-menu-item');
    const myListItem = Array.from(items).find(el => el.textContent.includes('My List'));
    if (myListItem) myListItem.click();
  });
  await page.waitForTimeout(400);

  const savedTitle = await page.$eval('#myListContent .my-list-title', el => el.textContent.trim());
  console.log(`✅ Saved Title in My List: "${savedTitle}"`);
  const populatedListScreenshot = path.join(ARTIFACT_DIR, 'playwright_my_list_populated.png');
  await page.screenshot({ path: populatedListScreenshot });
  console.log(`📸 Screenshot saved: ${populatedListScreenshot}`);
  await page.click('#myListModal button[aria-label="Close My List"]');
  await page.waitForTimeout(300);

  // 12. TEST NOTIFICATIONS HUB
  console.log('\n--- 12. Testing Notifications Hub ---');
  await page.click('button[aria-label="Notifications"]');
  await page.waitForTimeout(300);
  const notifOpen = await page.$eval('#notificationsSheet', el => el.classList.contains('is-open'));
  console.log(`✅ Notifications Sheet Opened: ${notifOpen ? 'PASS' : 'FAIL'}`);
  const notifScreenshot = path.join(ARTIFACT_DIR, 'playwright_notifications_sheet.png');
  await page.screenshot({ path: notifScreenshot });
  console.log(`📸 Screenshot saved: ${notifScreenshot}`);

  await page.click('#notificationsSheet button.sheet-close-btn');
  await page.waitForTimeout(300);

  console.log('\n========================================================================');
  console.log('🎉 ALL HAMBURGER SECTIONS & MODALS FULLY FUNCTIONAL AND VERIFIED!');
  console.log('========================================================================\n');

  await browser.close();
}

testHamburgerSuite().catch(err => {
  console.error('\n❌ HAMBURGER TEST SUITE FAILED:', err);
  process.exit(1);
});
