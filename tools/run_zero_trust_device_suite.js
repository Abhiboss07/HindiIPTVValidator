const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function captureScreenshot(filename) {
  const targetPath = path.join(ARTIFACT_DIR, filename);
  try {
    execSync(`adb -s 00015364U000110 exec-out screencap -p > "${targetPath}"`);
    console.log(`  📸 Screenshot captured: ${filename}`);
  } catch (e) {
    console.error(`  ⚠️ Screenshot error for ${filename}:`, e.message);
  }
}

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9228/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(t => t.type === 'page');
          if (page) {
            resolve(page.webSocketDebuggerUrl);
          } else {
            reject(new Error('No CDP targets found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('================================================================================');
  console.log('     T2L ZERO-TRUST PHYSICAL DEVICE REGRESSION SUITE (NOTHING PHONE 3)');
  console.log('================================================================================\n');

  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);

  let msgId = 0;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const result = await sendCdp('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (result && result.result) {
      return result.result.value;
    }
    return null;
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      passed++;
      console.log(`  [PASS] ${testName}${details ? ' (' + details + ')' : ''}`);
    } else {
      failed++;
      console.log(`  [FAIL] ${testName}${details ? ' -> REASON: ' + details : ''}`);
    }
  }

  // --- TEST 1: APP VERSION & CATALOG VERSION 8 PARITY ---
  console.log('--- TEST 1: ZERO-TRUST RUNTIME CATALOG & VERSION 8 ---');
  const catVer = await evaluate(`localStorage.getItem('t2l_catalog_version') || 'unloaded'`);
  const loadedTitles = await evaluate(`CatalogProvider.getAll().length`);
  assert(loadedTitles === 53, 'Runtime catalog loaded exactly 53 titles', `titles=${loadedTitles}`);
  assert(catVer === '8', 'Runtime catalog version is 8', `version=${catVer}`);

  // --- TEST 2: MIRZAPUR ZERO-TRUST UNAVAILABLE & NO STREAM OFFLINE ---
  console.log('\n--- TEST 2: MIRZAPUR ZERO-TRUST UNAVAILABLE & IDENTITY ---');
  await evaluate(`openMovieDetails('series_mirzapur')`);
  await sleep(600);

  const mTitle = await evaluate(`document.getElementById('movieDetailsTitle').textContent.trim()`);
  const mBtnText = await evaluate(`document.getElementById('btnMovieStreamText').textContent.trim()`);
  const mBtnDisabled = await evaluate(`document.getElementById('btnMovieStream').disabled`);
  const mEpCount = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
  const mUnavailBadges = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-badge-unavail').length`);

  assert(mTitle === 'Mirzapur', 'Mirzapur title correct', mTitle);
  assert(mBtnText === 'SERIES UNAVAILABLE', 'Action button shows SERIES UNAVAILABLE', mBtnText);
  assert(mBtnDisabled === true, 'Action button is disabled', `disabled=${mBtnDisabled}`);
  assert(mEpCount === 9, 'Season 1 has 9 canonical episodes', `count=${mEpCount}`);
  assert(mUnavailBadges === 9, 'All Season 1 episodes display Unavailable badge', `unavail=${mUnavailBadges}`);
  captureScreenshot('device_zero_trust_mirzapur_modal.png');

  // Attempt clicking Episode 1 -> must NOT start dead stream or show Stream Offline
  await evaluate(`playSeriesEpisode('series_mirzapur', 'mirzapur_s1e1')`);
  await sleep(500);
  const toastAfter = await evaluate(`document.getElementById('toast') ? document.getElementById('toast').textContent : ''`);
  assert(toastAfter.includes('no authorized public stream') || toastAfter.includes('unavailable'),
    'Clicking Mirzapur S1E1 shows honest unavailable toast without crashing', toastAfter);

  await evaluate(`closeMovieDetails()`);
  await sleep(400);

  // --- TEST 3: PANCHAYAT CANONICAL INTEGRITY (S1, S2, S3) ---
  console.log('\n--- TEST 3: PANCHAYAT IDENTITY & 24 CANONICAL EPISODES ---');
  await evaluate(`openMovieDetails('series_panchayat')`);
  await sleep(600);

  const pBtnText = await evaluate(`document.getElementById('btnMovieStreamText').textContent.trim()`);
  const pBtnDisabled = await evaluate(`document.getElementById('btnMovieStream').disabled`);
  assert(pBtnText === 'SERIES UNAVAILABLE', 'Panchayat button shows SERIES UNAVAILABLE', pBtnText);
  assert(pBtnDisabled === true, 'Panchayat button is disabled');

  // Check Season 1 episodes
  const s1e1 = await evaluate(`document.querySelector('#seasonEpisodesContainer .series-ep-title') ? document.querySelector('#seasonEpisodesContainer .series-ep-title').textContent : ''`);
  assert(s1e1.includes('Gram Panchayat Phulera'), 'S01E01 is Gram Panchayat Phulera', s1e1);

  // Switch to Season 2
  await evaluate(`renderSeasonEpisodes('series_panchayat', 2)`);
  await sleep(400);
  const s2Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
  assert(s2Count === 8, 'Season 2 has 8 canonical episodes', `count=${s2Count}`);

  // Switch to Season 3
  await evaluate(`renderSeasonEpisodes('series_panchayat', 3)`);
  await sleep(400);
  const s3Count = await evaluate(`document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length`);
  assert(s3Count === 8, 'Season 3 has 8 canonical episodes', `count=${s3Count}`);
  captureScreenshot('device_zero_trust_panchayat_modal.png');

  await evaluate(`closeMovieDetails()`);
  await sleep(400);

  // --- TEST 4: SHERLOCK HOLMES 1080P FULL HD PLAYBACK ---
  console.log('\n--- TEST 4: SHERLOCK HOLMES 1080P PLAYBACK & ZERO MUTING ---');
  await evaluate(`openMovieDetails('series_sherlock_holmes')`);
  await sleep(600);

  const shBadge = await evaluate(`document.getElementById('movieDetailsResolution').textContent.trim()`);
  assert(shBadge.includes('1080p'), 'Sherlock displays 1080p Full HD resolution', shBadge);
  captureScreenshot('device_zero_trust_sherlock_modal.png');

  // Play S01E01
  await evaluate(`playSeriesEpisode('series_sherlock_holmes', 'sherlock_s1e1')`);
  console.log('  Waiting for video stream playback...');

  let videoState = null;
  for (let i = 0; i < 20; i++) {
    await sleep(1000);
    videoState = await evaluate(`
      (() => {
        const v = document.getElementById('luminaVideo');
        if (!v) return null;
        return {
          paused: v.paused,
          currentTime: v.currentTime,
          readyState: v.readyState,
          videoWidth: v.videoWidth,
          videoHeight: v.videoHeight,
          muted: v.muted,
          src: v.src
        };
      })()
    `);
    if (videoState && videoState.readyState >= 3 && videoState.videoWidth > 0) break;
  }

  assert(videoState && videoState.videoWidth === 1920 && videoState.videoHeight === 1080,
    'Sherlock Holmes video decoded at genuine 1920x1080 Full HD',
    videoState ? `${videoState.videoWidth}x${videoState.videoHeight}` : 'null');
  assert(videoState && videoState.muted === false, 'Audio output is unmuted on hardware player', `muted=${videoState && videoState.muted}`);
  captureScreenshot('device_zero_trust_sherlock_playback.png');

  // --- TEST 5: STREAM-DRIVEN AUDIO MODAL HONESTY ---
  console.log('\n--- TEST 5: AUDIO MODAL STREAM-DRIVEN HONESTY ---');
  await evaluate(`openVlcAudioModal()`);
  await sleep(500);

  const audioModalText = await evaluate(`document.getElementById('vlcAudioTracksList').textContent`);
  assert(audioModalText.includes('Master Audio Track • Studio Dialogue'),
    'Audio modal displays authentic Master Audio Track', 'single studio master track');
  assert(audioModalText.includes('Single Studio Master Audio Track'),
    'Audio modal displays honest single-track stream notice', 'multi-track notice present');
  captureScreenshot('device_zero_trust_audio_modal.png');

  await evaluate(`closeVlcAudioModal()`);
  await evaluate(`closePlayerModal()`);
  await sleep(500);

  // --- TEST 6: DOWNLOADS MODAL & NAVIGATION ---
  console.log('\n--- TEST 6: DOWNLOADS SUBSYSTEM MODAL & TRACKING ---');
  await evaluate(`openDownloadsManagerModal()`);
  await sleep(600);

  const dlModalVisible = await evaluate(`document.getElementById('downloadsManagerModal').style.display !== 'none'`);
  assert(dlModalVisible === true, 'Downloads Manager modal opens cleanly', `visible=${dlModalVisible}`);
  captureScreenshot('device_zero_trust_downloads_modal.png');

  await evaluate(`closeDownloadsManagerModal()`);
  await sleep(400);

  // --- TEST 7: MOVIES TAB 5-TAB DOCK & POSTER RENDERING ---
  console.log('\n--- TEST 7: 5-TAB NAVIGATION DOCK & FULL MOVIES TAB ---');
  await evaluate(`switchPage('movies')`);
  await sleep(600);

  const activePage = await evaluate(`currentActivePage`);
  assert(activePage === 'movies', 'Active page routed to movies', activePage);

  // Verify all rendered posters in Movies tab have valid dimensions
  const invalidThumbs = await evaluate(`
    (() => {
      const imgs = document.querySelectorAll('#page-movies img');
      let broken = 0;
      imgs.forEach(img => {
        if (img.naturalWidth === 0 && img.src && !img.src.includes('placeholder')) broken++;
      });
      return broken;
    })()
  `);
  assert(invalidThumbs === 0, 'Zero broken or unrendered poster thumbnails across entire Movies tab', `broken=${invalidThumbs}`);
  captureScreenshot('device_zero_trust_movies_tab.png');

  // --- TEST 8: LIVE TV & RADIO NAVIGATION ---
  console.log('\n--- TEST 8: LIVE TV & RADIO CHANNEL FEEDS ---');
  await evaluate(`switchPage('live')`);
  await sleep(500);
  const liveCount = await evaluate(`document.querySelectorAll('#liveChannelsFeed .channel-list-item').length`);
  assert(liveCount > 0, 'Live TV channels feed rendered', `count=${liveCount}`);

  await evaluate(`switchPage('radio')`);
  await sleep(500);
  const radioCount = await evaluate(`document.querySelectorAll('#radioStationsFeed .obsidian-bento-item').length`);
  assert(radioCount > 0, 'Radio stations feed rendered', `count=${radioCount}`);

  await evaluate(`switchPage('home')`);
  await sleep(500);
  captureScreenshot('device_zero_trust_final_home.png');

  console.log('\n================================================================================');
  console.log(`ZERO-TRUST PHYSICAL DEVICE RESULTS: ${passed} / ${passed + failed} TESTS PASSED`);
  console.log('================================================================================\n');

  ws.close();

  if (failed === 0) {
    console.log('🎉 ALL ZERO-TRUST PHYSICAL DEVICE TESTS PASSED ON NOTHING PHONE 3!');
    process.exit(0);
  } else {
    console.log(`⚠️ ${failed} TESTS FAILED ON PHYSICAL DEVICE.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
