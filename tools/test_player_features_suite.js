const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

function startStaticServer(port = 8091) {
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
  console.log('🚀 Starting Playwright Video Player Features Verification Suite...');
  const server = await startStaticServer(8091);
  console.log('HTTP Static server listening on http://127.0.0.1:8091');

  const browser = await chromium.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Pixel 7 screen size
  });

  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[BROWSER ERROR] ${msg.text()}`);
  });

  console.log('Navigating to http://127.0.0.1:8091/index.html...');
  await page.goto('http://127.0.0.1:8091/index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Launch a movie in player modal
  console.log('Launching Tears of Steel 4K in Player...');
  await page.evaluate(() => {
    window.startMovieStream('vod_tears_of_steel_4k');
  });
  await page.waitForTimeout(1500);

  // Ensure player modal is open
  const isPlayerOpen = await page.evaluate(() => {
    const modal = document.getElementById('playerModal');
    return modal && modal.classList.contains('active');
  });
  console.log(`Player modal active: ${isPlayerOpen}`);

  // 2. Test Subtitles & Captions
  console.log('\n--- TESTING SUBTITLES & CAPTIONS ---');
  await page.evaluate(() => {
    if (typeof window.openVlcSubtitlesModal === 'function') {
      window.openVlcSubtitlesModal();
    }
  });
  await page.waitForTimeout(500);

  // Take screenshot of Subtitle Modal
  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_subtitle_modal.png' });
  console.log('Captured screenshot: playwright_player_subtitle_modal.png');

  // Verify that redundant movie-provided subs section was completely removed
  const redundantSubsSection = await page.evaluate(() => {
    return document.getElementById('vlcMovieProvidedSubsSection') !== null;
  });
  console.log('Redundant Movie Provided Subtitles Section exists:', redundantSubsSection);
  if (redundantSubsSection) throw new Error('vlcMovieProvidedSubsSection should be removed from Subtitles modal!');

  const ccTestResult = await page.evaluate(() => {
    window.setVlcSubtitleTrack('cc:hi');
    const ccBox = document.getElementById('playerCcBox');
    const ccText = document.getElementById('playerCcText');
    const isBoxVisible = ccBox && (ccBox.style.display !== 'none');
    
    // Simulate cue update
    if (typeof window.updateActiveCueText === 'function') {
      window.updateActiveCueText();
    }
    const hasCueText = ccText && ccText.textContent.length > 0;

    return {
      isBoxVisible,
      hasCueText,
      sampleText: ccText ? ccText.textContent : '',
      currentSubtitleTrackId: window.currentSubtitleTrackId
    };
  });

  console.log('Subtitles Hindi CC Test Result:', ccTestResult);
  if (!ccTestResult.isBoxVisible) throw new Error('playerCcBox is not visible after selecting cc:hi');
  if (!ccTestResult.hasCueText) throw new Error('playerCcText has no cue text populated');

  // Test Subtitle Delay adjustment
  const delayResult = await page.evaluate(() => {
    window.adjustTrackDelay(0.5);
    return window.currentTrackDelay;
  });
  console.log(`Subtitle Track Delay adjusted to: ${delayResult}s`);
  if (delayResult !== 0.5) throw new Error('adjustTrackDelay did not correctly adjust delay');

  // 3. Test Audio Equalizer
  console.log('\n--- TESTING AUDIO EQUALIZER ---');
  await page.evaluate(() => {
    if (typeof window.openVlcEqModal === 'function') {
      window.openVlcEqModal();
    }
  });
  await page.waitForTimeout(500);

  // Take screenshot of Equalizer Modal (Bass Boost preset)
  await page.evaluate(() => {
    window.setVlcEqualizerPreset('Bass Boost');
  });
  await page.waitForTimeout(400);

  const eqBarsCount = await page.evaluate(() => {
    const container = document.getElementById('vlcEqBandsContainer');
    if (!container) return 0;
    const bars = container.querySelectorAll('.vlc-eq-col');
    return bars.length;
  });
  console.log(`Equalizer visualizer rendered ${eqBarsCount} frequency bands`);
  if (eqBarsCount !== 5) throw new Error(`Expected 5 EQ frequency bands, got ${eqBarsCount}`);

  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_equalizer_modal.png' });
  console.log('Captured screenshot: playwright_player_equalizer_modal.png');

  // Test Cinema Preset
  await page.evaluate(() => {
    window.setVlcEqualizerPreset('Cinema');
  });
  await page.waitForTimeout(300);

  // 4. Test Audio Track Selection
  console.log('\n--- TESTING AUDIO TRACK SELECTION ---');
  await page.evaluate(() => {
    if (typeof window.openVlcAudioModal === 'function') {
      window.openVlcAudioModal();
    }
  });
  await page.waitForTimeout(500);

  const audioModalContent = await page.evaluate(() => {
    const list = document.getElementById('vlcAudioTracksList');
    if (!list) return { found: false, text: '' };
    return {
      found: true,
      text: list.innerText,
      hasFixedWord: list.innerText.includes('(Fixed)'),
      hasStudioMaster: list.innerText.includes('Studio Master Audio'),
      hasPassthrough: list.innerText.includes('Dolby & Multi-Channel Hardware Passthrough'),
      hasSimpleLanguage: list.innerText.includes('English') || list.innerText.includes('Hindi')
    };
  });

  console.log('Audio Track Modal State:', audioModalContent);
  if (audioModalContent.hasFixedWord) {
    throw new Error('Audio track modal STILL contains the confusing "(Fixed)" string!');
  }
  if (audioModalContent.hasStudioMaster) {
    throw new Error('Audio track modal should NOT contain "Studio Master Audio" jargon!');
  }
  if (audioModalContent.hasPassthrough) {
    throw new Error('Audio track modal should NOT contain "Dolby & Multi-Channel Hardware Passthrough"!');
  }
  if (!audioModalContent.hasSimpleLanguage) {
    throw new Error('Audio track modal must show simple language provided by movie (e.g. English, Hindi)!');
  }

  await page.screenshot({ path: '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/playwright_player_audio_modal.png' });
  console.log('Captured screenshot: playwright_player_audio_modal.png');

  // Test selecting simple master track
  await page.evaluate(() => {
    window.setVlcAudioTrack('master');
  });
  await page.waitForTimeout(300);

  console.log('\n🎉 ALL VIDEO PLAYER SUITE VERIFICATION CHECKS PASSED PERFECTLY!');
  
  await browser.close();
  server.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
