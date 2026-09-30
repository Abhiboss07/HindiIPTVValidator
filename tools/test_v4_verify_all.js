const http = require('http');
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

function captureDeviceScreenshot(filename) {
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

  // 1. Capture punch-hole camera clearance
  await evalInPage(ws, `window.scrollTo(0, 0);`);
  await new Promise(r => setTimeout(r, 600));
  captureDeviceScreenshot('device_v4_punchhole_clearance.png');

  // 2. Open Network Speed modal & run real-time test
  console.log('Opening speed test modal...');
  await evalInPage(ws, `if (typeof openSpeedTestModal === 'function') openSpeedTestModal();`);
  await new Promise(r => setTimeout(r, 800));

  console.log('Running real-time speed test...');
  await evalInPage(ws, `if (typeof runLiveSpeedTest === 'function') runLiveSpeedTest(true);`);
  await new Promise(r => setTimeout(r, 3600));
  captureDeviceScreenshot('device_v4_ookla_speedometer_live.png');

  await evalInPage(ws, `if (typeof closeSpeedTestModal === 'function') closeSpeedTestModal();`);
  await new Promise(r => setTimeout(r, 600));

  // 3. Play movie directly via startMovieStream
  console.log('Starting movie stream directly...');
  await evalInPage(ws, `
    const item = (window.DEFAULT_MOVIES_CATALOG?.movies || []).find(m => m.id === 'vod_sintel_4k') ||
                 (window.DEFAULT_MOVIES_CATALOG?.movies || [])[0];
    if (item && typeof startMovieStream === 'function') {
      startMovieStream(item.id);
    }
  `);
  await new Promise(r => setTimeout(r, 2500));

  // 4. Open Subtitles modal
  console.log('Opening Subtitles modal...');
  await evalInPage(ws, `if (typeof openVlcSubtitlesModal === 'function') openVlcSubtitlesModal();`);
  await new Promise(r => setTimeout(r, 800));
  captureDeviceScreenshot('device_v4_subtitles_modal.png');

  // 5. Select Hindi CC and close modal
  console.log('Selecting Hindi CC...');
  await evalInPage(ws, `
    if (typeof setVlcSubtitleTrack === 'function') setVlcSubtitleTrack('cc:hi');
    if (typeof closeVlcSubtitlesModal === 'function') closeVlcSubtitlesModal();
  `);
  await new Promise(r => setTimeout(r, 1200));

  // Force active cue display and capture
  await evalInPage(ws, `
    const video = document.getElementById('luminaVideo');
    if (video) {
      video.currentTime = 8;
      updateActiveCueText();
    }
  `);
  await new Promise(r => setTimeout(r, 800));
  captureDeviceScreenshot('device_v4_playback_cc_active.png');

  // 6. Test timeline scrubbing / seeking to 35% of video
  console.log('Testing timeline scrubbing / seeking to 35%...');
  const seekVal = await evalInPage(ws, `
    const video = document.getElementById('luminaVideo');
    if (video && video.duration) {
      const target = video.duration * 0.35;
      seekToTargetTime(target);
      ({ target: formatSeekTime(target), cur: formatSeekTime(video.currentTime), dur: formatSeekTime(video.duration) });
    } else {
      seekToTargetTime(120);
      ({ target: '2:00' });
    }
  `);
  console.log('Seek status:', seekVal);
  await new Promise(r => setTimeout(r, 2200));
  captureDeviceScreenshot('device_v4_timeline_seek_success.png');

  console.log('Verification finished!');
  ws.close();
}

main().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});
