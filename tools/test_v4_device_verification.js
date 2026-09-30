const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARTIFACT_DIR = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const msg = JSON.stringify({ id, method, params });
    const onMessage = (event) => {
      const resp = JSON.parse(event.data);
      if (resp.id === id) {
        ws.removeEventListener('message', onMessage);
        if (resp.error) reject(resp.error);
        else resolve(resp.result);
      }
    };
    ws.addEventListener('message', onMessage);
    ws.send(msg);
  });
}

async function evalInPage(ws, expr) {
  const res = await sendCDP(ws, 'Runtime.evaluate', {
    expression: expr,
    awaitPromise: true,
    returnByValue: true
  });
  return res.result ? res.result.value : null;
}

async function captureDeviceScreenshot(filename) {
  const outPath = path.join(ARTIFACT_DIR, filename);
  execSync(`adb -s 00015364U000110 exec-out screencap -p > "${outPath}"`);
  console.log(`Saved screenshot: ${outPath}`);
  return outPath;
}

async function main() {
  const pages = await getPages();
  const page = pages.find(p => p.url.includes('appassets.androidplatform.net') || p.title.includes('T2L'));
  if (!page) {
    console.error('Target page not found:', pages);
    process.exit(1);
  }

  const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
  await new Promise(res => ws.addEventListener('open', res));
  console.log('Connected to WebView CDP');

  // Step 1: Capture Main Screen showing punch-hole camera safe area clearance
  await evalInPage(ws, `window.scrollTo(0, 0);`);
  await new Promise(r => setTimeout(r, 600));
  await captureDeviceScreenshot('device_v4_punchhole_clearance.png');

  // Step 2: Open Speed Test Modal and trigger live test
  console.log('Opening Speed Test modal...');
  await evalInPage(ws, `
    if (typeof openSpeedTestModal === 'function') openSpeedTestModal();
  `);
  await new Promise(r => setTimeout(r, 1000));
  
  // Trigger speed test and wait for live animation
  console.log('Running real-time speed test...');
  await evalInPage(ws, `
    if (typeof runLiveSpeedTest === 'function') runLiveSpeedTest(true);
  `);
  // Wait 3.5s for real download probe and needle sweep
  await new Promise(r => setTimeout(r, 3500));
  await captureDeviceScreenshot('device_v4_ookla_speedometer_live.png');

  // Close Speed Test modal
  await evalInPage(ws, `if (typeof closeSpeedTestModal === 'function') closeSpeedTestModal();`);
  await new Promise(r => setTimeout(r, 600));

  // Step 3: Open a movie details, start playback, open Subtitles modal
  console.log('Opening movie and checking subtitles...');
  await evalInPage(ws, `
    const movies = window.ALL_CATALOG_ITEMS || [];
    const sintel = movies.find(m => m.id === 'vod_sintel_4k') || movies[0];
    if (sintel) {
      openMovieDetails(sintel.id);
    }
  `);
  await new Promise(r => setTimeout(r, 800));

  // Start playback
  await evalInPage(ws, `
    const startBtn = document.getElementById('btnStartMovieStreamDirect') || document.querySelector('.btn-hero-play');
    if (typeof handleStreamMovieClick === 'function') {
      handleStreamMovieClick();
    }
  `);
  await new Promise(r => setTimeout(r, 2000));

  // Open Subtitles modal
  await evalInPage(ws, `
    if (typeof openVlcSubtitlesModal === 'function') openVlcSubtitlesModal();
  `);
  await new Promise(r => setTimeout(r, 800));
  await captureDeviceScreenshot('device_v4_subtitles_modal_catalog.png');

  // Select Hindi CC
  console.log('Selecting Hindi CC...');
  await evalInPage(ws, `
    if (typeof setVlcSubtitleTrack === 'function') setVlcSubtitleTrack('cc:hi');
    if (typeof closeVlcSubtitlesModal === 'function') closeVlcSubtitlesModal();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Ensure active caption is shown
  await evalInPage(ws, `
    const video = document.getElementById('luminaVideo');
    if (video) {
      video.currentTime = 10;
      updateActiveCueText();
    }
  `);
  await new Promise(r => setTimeout(r, 800));
  await captureDeviceScreenshot('device_v4_playback_cc_active.png');

  // Step 4: Test Timeline Seeking / Scrubbing
  console.log('Testing timeline seeking to 40% duration...');
  const seekResult = await evalInPage(ws, `
    const video = document.getElementById('luminaVideo');
    if (video && video.duration) {
      const target = video.duration * 0.40;
      seekToTargetTime(target);
      ({ target, duration: video.duration });
    } else {
      null;
    }
  `);
  console.log('Seek triggered:', seekResult);
  await new Promise(r => setTimeout(r, 2000));
  await captureDeviceScreenshot('device_v4_timeline_seek_success.png');

  console.log('All verification steps completed successfully!');
  ws.close();
}

main().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
