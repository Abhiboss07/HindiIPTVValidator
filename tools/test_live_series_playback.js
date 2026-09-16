const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

const SERIAL = '00015364U000110';
const ARTIFACT_DIR = '/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021';

function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9228/json', (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const targets = JSON.parse(raw);
          const page = targets.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
          if (page) resolve(page.webSocketDebuggerUrl);
          else reject(new Error('No debuggable page target found'));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function takePhysicalScreenshot(filename) {
  try {
    execSync(`adb -s ${SERIAL} exec-out screencap -p > ${ARTIFACT_DIR}/${filename}`);
    console.log(`  📸 [SCREENSHOT] Saved ${filename}`);
  } catch (e) {
    console.warn(`  ⚠️ Failed to save screenshot ${filename}:`, e.message);
  }
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Connecting to WebView on physical device Nothing Phone 3...');
  const wsUrl = await getWsUrl();
  const cdp = new CdpClient(wsUrl);
  await cdp.connect();
  console.log('Connected to CDP!');

  // Check catalog version and movies count
  const catInfo = await cdp.eval(`({
    version: typeof CURRENT_CATALOG_VERSION !== 'undefined' ? CURRENT_CATALOG_VERSION : null,
    totalMovies: CatalogProvider ? CatalogProvider.getAll().length : 0,
    panchayat: CatalogProvider ? CatalogProvider.getById('series_panchayat') : null,
    mirzapur: CatalogProvider ? CatalogProvider.getById('series_mirzapur') : null,
    sherlock: CatalogProvider ? CatalogProvider.getById('series_sherlock_holmes') : null
  })`);

  console.log('\n--- Catalog Verification ---');
  console.log('Catalog Version in WebView:', catInfo.version);
  console.log('Total Movies/Series:', catInfo.totalMovies);
  console.log('Panchayat state:', catInfo.panchayat ? catInfo.panchayat.sourceState : 'missing');
  console.log('Panchayat streamUrl:', catInfo.panchayat ? catInfo.panchayat.streamUrl : 'missing');
  console.log('Mirzapur state:', catInfo.mirzapur ? catInfo.mirzapur.sourceState : 'missing');
  console.log('Sherlock state:', catInfo.sherlock ? catInfo.sherlock.sourceState : 'missing');
  console.log('Sherlock badge:', catInfo.sherlock ? catInfo.sherlock.qualityHonestBadge : 'missing');

  // Test 1: Open Panchayat details
  console.log('\n--- Testing Panchayat Series ---');
  await cdp.eval(`openMovieDetails('series_panchayat')`);
  await sleep(1000);

  const panchayatModalState = await cdp.eval(`({
    modalVisible: document.getElementById('movieDetailsModal').classList.contains('active'),
    title: document.getElementById('movieDetailsTitle').textContent,
    btnStreamText: document.getElementById('btnMovieStreamText').textContent,
    btnDisabled: document.getElementById('btnMovieStream').disabled,
    btnClass: document.getElementById('btnMovieStream').className,
    totalEpsInList: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length,
    lockedEps: document.querySelectorAll('#seasonEpisodesContainer .series-ep-unavailable').length
  })`);

  console.log('Panchayat Modal State:', panchayatModalState);
  takePhysicalScreenshot('device_panchayat_modal_verified.png');

  // Click Stream on Panchayat!
  console.log('\nClicking Stream Series for Panchayat...');
  await cdp.eval(`handleStreamMovieClick()`);
  await sleep(3000);

  let playState = await cdp.eval(`({
    prepActive: document.getElementById('streamPrepModal') ? document.getElementById('streamPrepModal').classList.contains('active') : false,
    playerActive: document.getElementById('playerModal') ? document.getElementById('playerModal').classList.contains('active') : false,
    videoSrc: document.getElementById('mainVideo') ? document.getElementById('mainVideo').src : '',
    currentTime: document.getElementById('mainVideo') ? document.getElementById('mainVideo').currentTime : 0,
    paused: document.getElementById('mainVideo') ? document.getElementById('mainVideo').paused : true,
    readyState: document.getElementById('mainVideo') ? document.getElementById('mainVideo').readyState : 0
  })`);
  console.log('Panchayat Playback State (after 3s):', playState);

  // Wait another 3s for buffering/playback
  await sleep(3000);
  playState = await cdp.eval(`({
    playerActive: document.getElementById('playerModal') ? document.getElementById('playerModal').classList.contains('active') : false,
    videoSrc: document.getElementById('mainVideo') ? document.getElementById('mainVideo').src : '',
    currentTime: document.getElementById('mainVideo') ? document.getElementById('mainVideo').currentTime : 0,
    paused: document.getElementById('mainVideo') ? document.getElementById('mainVideo').paused : true,
    duration: document.getElementById('mainVideo') ? document.getElementById('mainVideo').duration : 0,
    readyState: document.getElementById('mainVideo') ? document.getElementById('mainVideo').readyState : 0
  })`);
  console.log('Panchayat Playback State (after 6s):', playState);
  takePhysicalScreenshot('device_panchayat_playback_active.png');

  // Close player
  await cdp.eval(`closePlayerModal()`);
  await sleep(800);

  // Test 2: Sherlock Holmes in 1080p
  console.log('\n--- Testing Sherlock Holmes 1080p ---');
  await cdp.eval(`openMovieDetails('series_sherlock_holmes')`);
  await sleep(1000);

  const sherlockModalState = await cdp.eval(`({
    title: document.getElementById('movieDetailsTitle').textContent,
    btnStreamText: document.getElementById('btnMovieStreamText').textContent,
    btnDisabled: document.getElementById('btnMovieStream').disabled,
    qualityBadge: document.getElementById('movieDetailsQualityBadge').textContent,
    totalEpsInList: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length
  })`);
  console.log('Sherlock Modal State:', sherlockModalState);
  takePhysicalScreenshot('device_sherlock_1080p_modal.png');

  console.log('Clicking Stream Series for Sherlock Holmes 1080p...');
  await cdp.eval(`handleStreamMovieClick()`);
  await sleep(4000);

  const sherlockPlayState = await cdp.eval(`({
    playerActive: document.getElementById('playerModal').classList.contains('active'),
    videoSrc: document.getElementById('mainVideo').src,
    currentTime: document.getElementById('mainVideo').currentTime,
    paused: document.getElementById('mainVideo').paused,
    duration: document.getElementById('mainVideo').duration,
    readyState: document.getElementById('mainVideo').readyState
  })`);
  console.log('Sherlock Playback State:', sherlockPlayState);
  takePhysicalScreenshot('device_sherlock_1080p_playback_active.png');

  await cdp.eval(`closePlayerModal()`);
  await sleep(800);

  // Test 3: Mirzapur Direct Playback
  console.log('\n--- Testing Mirzapur Direct Playback ---');
  await cdp.eval(`openMovieDetails('series_mirzapur')`);
  await sleep(1000);

  const mirzapurModalState = await cdp.eval(`({
    title: document.getElementById('movieDetailsTitle').textContent,
    btnStreamText: document.getElementById('btnMovieStreamText').textContent,
    btnDisabled: document.getElementById('btnMovieStream').disabled,
    btnClass: document.getElementById('btnMovieStream').className,
    totalEpsInList: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length
  })`);
  console.log('Mirzapur Modal State:', mirzapurModalState);
  takePhysicalScreenshot('device_mirzapur_direct_modal.png');

  console.log('Clicking Stream Series for Mirzapur...');
  await cdp.eval(`handleStreamMovieClick()`);
  await sleep(4000);

  const mirzapurPlayState = await cdp.eval(`({
    playerActive: document.getElementById('playerModal').classList.contains('active'),
    videoSrc: document.getElementById('mainVideo').src,
    currentTime: document.getElementById('mainVideo').currentTime,
    paused: document.getElementById('mainVideo').paused,
    duration: document.getElementById('mainVideo').duration,
    readyState: document.getElementById('mainVideo').readyState
  })`);
  console.log('Mirzapur Playback State:', mirzapurPlayState);
  takePhysicalScreenshot('device_mirzapur_direct_playback_active.png');

  await cdp.eval(`closePlayerModal()`);
  await sleep(800);

  // Test 4: Verify All Series Buttons
  console.log('\n--- Testing All Series Buttons Status ---');
  const allSeries = [
    'series_stranger_things',
    'series_breaking_bad',
    'series_kota_factory',
    'series_sacred_games',
    'series_farzi',
    'series_money_heist',
    'series_scam_1992',
    'series_family_man',
    'series_paatal_lok',
    'series_game_of_thrones'
  ];

  for (const sId of allSeries) {
    await cdp.eval(`openMovieDetails('${sId}')`);
    await sleep(400);
    const state = await cdp.eval(`({
      id: currentSelectedMovie.id,
      title: currentSelectedMovie.title,
      btnText: document.getElementById('btnMovieStreamText').textContent,
      btnDisabled: document.getElementById('btnMovieStream').disabled,
      epsCount: document.querySelectorAll('#seasonEpisodesContainer .series-ep-item').length,
      lockedCount: document.querySelectorAll('#seasonEpisodesContainer .series-ep-unavailable').length
    })`);
    console.log(`Series ${sId}: ${state.title} -> Button: "${state.btnText}" | Disabled: ${state.btnDisabled} | Total Eps: ${state.epsCount} | Locked: ${state.lockedCount}`);
    await cdp.eval(`closeMovieDetails()`);
    await sleep(300);
  }

  cdp.close();
  console.log('\n🎉 Live Physical Device Verification Completed Successfully!');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
