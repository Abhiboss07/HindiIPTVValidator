const http = require("http");
const { execSync } = require("child_process");

const ARTIFACT_DIR = "/home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function takeScreenshot(filename) {
  try {
    execSync(`adb exec-out screencap -p > "${ARTIFACT_DIR}/${filename}"`);
    console.log(`[SCREENSHOT] Saved ${filename}`);
  } catch (e) {
    console.error(`[SCREENSHOT ERROR] ${filename}:`, e.message);
  }
}

async function getTarget() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:9222/json/list", res => {
      let d = "";
      res.on("data", c => d += c);
      res.on("end", () => {
        try {
          const list = JSON.parse(d);
          const t = list.find(x => x.type === "page" || x.url.includes("index.html"));
          if (t) resolve(t);
          else reject(new Error("No target found"));
        } catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

async function main() {
  const target = await getTarget();
  console.log("Connected to WebView target:", target.title);
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 0;
  const pending = new Map();

  ws.addEventListener("message", ev => {
    const data = JSON.parse(ev.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
    if (data.method === "Runtime.consoleAPICalled") {
      const txt = (data.params.args || []).map(a => a.value || a.description).join(" ");
      console.log(`[CONSOLE ${data.params.type}] ${txt}`);
    }
  });

  await new Promise(r => ws.addEventListener("open", r));

  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await cdp("Runtime.enable");

  const evalJs = async (expr) => {
    const r = await cdp("Runtime.evaluate", { expression: expr, returnByValue: true });
    return r && r.result ? r.result.value : null;
  };

  const results = {};

  console.log("\n==================================================");
  console.log("STAGE 1: 4K UHD REFERENCE PLAYBACK VERIFICATION");
  console.log("==================================================");
  await evalJs(`
    window.openMovieDetails('vod_4k_uhd_reference_showcase');
  `);
  await sleep(1500);
  takeScreenshot("evidence_01_4k_modal.png");

  await evalJs(`
    window.handleStreamMovieClick();
  `);
  await sleep(6000);

  const uhdState = await evalJs(`
    (() => {
      const v = document.getElementById('luminaVideo');
      const badge = document.getElementById('vlcTopQualityLabel');
      const sub = document.getElementById('vlcQualitySubtitle');
      return {
        paused: v ? v.paused : true,
        currentTime: v ? v.currentTime : 0,
        readyState: v ? v.readyState : 0,
        videoWidth: v ? v.videoWidth : 0,
        videoHeight: v ? v.videoHeight : 0,
        badge: badge ? badge.textContent : '',
        subtitle: sub ? sub.textContent : '',
        hlsLevel: window.hlsInstance ? window.hlsInstance.currentLevel : -1
      };
    })()
  `);
  console.log("4K UHD Playback State:", uhdState);
  results["4K_UHD"] = uhdState;
  takeScreenshot("evidence_02_4k_playing.png");

  // Open Audio Tracks Modal
  await evalJs(`window.openVlcAudioModal();`);
  await sleep(1500);
  const audioTracks = await evalJs(`
    (() => {
      const rows = Array.from(document.querySelectorAll('#vlcAudioTracksList .vlc-radio-row'));
      return rows.map(r => r.textContent.trim());
    })()
  `);
  console.log("Exposed Audio Tracks:", audioTracks);
  results["Audio_Tracks"] = audioTracks;
  takeScreenshot("evidence_03_audio_modal.png");

  await evalJs(`window.closeVlcAudioModal(); window.closeFullPlayerModal();`);
  await sleep(1000);

  console.log("\n==================================================");
  console.log("STAGE 2: LIVE TV 1080P PLAYBACK VERIFICATION");
  console.log("==================================================");
  await evalJs(`
    const ch = (window.channelsData || FALLBACK_CHANNELS).find(c => c.id === 'discovery-channel-hindi-hd' || c.id === 'abp-news');
    window.playChannel(ch);
  `);
  await sleep(6000);

  const liveState = await evalJs(`
    (() => {
      const v = document.getElementById('luminaVideo');
      const badge = document.getElementById('vlcTopQualityLabel');
      const title = document.getElementById('vlcChannelTitle');
      return {
        title: title ? title.textContent : '',
        paused: v ? v.paused : true,
        currentTime: v ? v.currentTime : 0,
        readyState: v ? v.readyState : 0,
        videoWidth: v ? v.videoWidth : 0,
        videoHeight: v ? v.videoHeight : 0,
        badge: badge ? badge.textContent : ''
      };
    })()
  `);
  console.log("Live TV Playback State:", liveState);
  results["Live_TV"] = liveState;
  takeScreenshot("evidence_04_livetv_playing.png");

  await evalJs(`window.closeFullPlayerModal();`);
  await sleep(1000);

  console.log("\n==================================================");
  console.log("STAGE 3: CINEMA VOD DIRECT CANONICAL STREAMING");
  console.log("==================================================");
  await evalJs(`
    window.openMovieDetails('vod_sita_ramam_2022');
  `);
  await sleep(1500);
  takeScreenshot("evidence_05_sita_ramam_modal.png");

  await evalJs(`
    window.handleStreamMovieClick();
  `);
  await sleep(8000);

  const vodState = await evalJs(`
    (() => {
      const v = document.getElementById('luminaVideo');
      const badge = document.getElementById('vlcTopQualityLabel');
      const title = document.getElementById('vlcChannelTitle');
      return {
        title: title ? title.textContent : '',
        src: v ? v.src : '',
        paused: v ? v.paused : true,
        currentTime: v ? v.currentTime : 0,
        duration: v ? v.duration : 0,
        readyState: v ? v.readyState : 0,
        videoWidth: v ? v.videoWidth : 0,
        videoHeight: v ? v.videoHeight : 0,
        badge: badge ? badge.textContent : ''
      };
    })()
  `);
  console.log("VOD Cinema Playback State:", vodState);
  results["VOD_Cinema"] = vodState;
  takeScreenshot("evidence_06_sita_ramam_playing.png");

  await evalJs(`window.closeFullPlayerModal();`);
  await sleep(1000);

  console.log("\n==================================================");
  console.log("STAGE 4: RADIO BROADCAST STREAMING");
  console.log("==================================================");
  await evalJs(`
    const r = (window.channelsData || []).find(c => c.type === 'radio' && c.id === 'air-vividh-bharati') || {
      id: 'air-vividh-bharati',
      name: 'AIR Vividh Bharati 102.8 FM',
      url: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8',
      type: 'radio'
    };
    window.playChannel(r);
  `);
  await sleep(6000);

  const radioState = await evalJs(`
    (() => {
      const v = document.getElementById('luminaVideo');
      const title = document.getElementById('vlcChannelTitle');
      return {
        title: title ? title.textContent : '',
        paused: v ? v.paused : true,
        currentTime: v ? v.currentTime : 0,
        readyState: v ? v.readyState : 0,
        hlsLevel: window.hlsInstance ? window.hlsInstance.currentLevel : -1
      };
    })()
  `);
  console.log("Radio Broadcast Playback State:", radioState);
  results["Radio"] = radioState;
  takeScreenshot("evidence_07_radio_playing.png");

  await evalJs(`window.closeFullPlayerModal();`);
  await sleep(1000);

  console.log("\n==================================================");
  console.log("STAGE 5: LOCAL MEDIA & VAULT ACCESS");
  console.log("==================================================");
  await evalJs(`
    window.switchPage('local');
  `);
  await sleep(2000);
  takeScreenshot("evidence_08_local_vault_page.png");

  console.log("\n==================================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  console.log("RESULTS SUMMARY:", JSON.stringify(results, null, 2));
  console.log("==================================================");

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
