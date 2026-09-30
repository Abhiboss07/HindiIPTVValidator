const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:8089/', { waitUntil: 'networkidle' });
  await page.evaluate(() => navigateTo('cinema'));
  await page.waitForTimeout(1500);

  // 1. Trailers Rail screenshot
  const trailersEl = await page.$('#moviesTrailersRow');
  if (trailersEl) {
    await trailersEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const sec = await page.evaluateHandle(el => el.closest('.content-rail-section'), trailersEl);
    if (sec) {
      await sec.asElement().screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_trailers_rail.png' });
      console.log('Saved playwright_cinema_trailers_rail.png');
    }
  }

  // 2. Web Series Rail screenshot
  const seriesEl = await page.$('#moviesWebSeriesRow');
  if (seriesEl) {
    await seriesEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const sec = await page.evaluateHandle(el => el.closest('.content-rail-section'), seriesEl);
    if (sec) {
      await sec.asElement().screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_webseries_rail.png' });
      console.log('Saved playwright_cinema_webseries_rail.png');
    }
  }

  // 3. Bollywood Rail screenshot
  const bEl = await page.$('#moviesBollywoodRow');
  if (bEl) {
    await bEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const sec = await page.evaluateHandle(el => el.closest('.content-rail-section'), bEl);
    if (sec) {
      await sec.asElement().screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_cinema_bollywood_rail.png' });
      console.log('Saved playwright_cinema_bollywood_rail.png');
    }
  }

  await browser.close();
})();
