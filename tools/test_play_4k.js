const http = require("http");
const { execSync } = require("child_process");

http.get("http://localhost:9222/json/list", res => {
  let d = ""; res.on("data", c => d += c);
  res.on("end", async () => {
    const p = JSON.parse(d)[0];
    const ws = new WebSocket(p.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 0;
    const send = (m, params = {}) => new Promise(resolve => {
      const msgId = ++id;
      const h = ev => {
        const data = JSON.parse(ev.data);
        if (data.id === msgId) {
          ws.removeEventListener("message", h);
          resolve(data.result);
        }
      };
      ws.addEventListener("message", h);
      ws.send(JSON.stringify({ id: msgId, method: m, params }));
    });

    console.log("1. Starting 4K UHD Showcase...");
    await send("Runtime.evaluate", {
      expression: `
        const m = CatalogProvider.getById('vod_4k_uhd_reference_showcase');
        window.openMovieDetails('vod_4k_uhd_reference_showcase');
        setTimeout(() => window.handleStreamMovieClick(), 500);
      `
    });

    console.log("2. Waiting for 4K video playback...");
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const res = await send("Runtime.evaluate", {
        expression: `(() => {
          const v = document.getElementById("luminaVideo");
          let hlsInfo = null;
          if (window.hlsInstance && window.hlsInstance.levels) {
            const lvl = window.hlsInstance.levels[window.hlsInstance.currentLevel];
            if (lvl) hlsInfo = { width: lvl.width, height: lvl.height, bitrate: lvl.bitrate };
          }
          return {
            paused: v ? v.paused : true,
            currentTime: v ? v.currentTime : 0,
            readyState: v ? v.readyState : 0,
            videoWidth: v ? v.videoWidth : 0,
            videoHeight: v ? v.videoHeight : 0,
            hasHls: !!window.hlsInstance,
            hlsLevel: window.hlsInstance ? window.hlsInstance.currentLevel : -1,
            hlsInfo: hlsInfo
          };
        })()`,
        returnByValue: true
      });
      const s = res.result.value;
      console.log(`[T+${i+1}s] ReadyState=${s.readyState}, Width=${s.videoWidth}x${s.videoHeight}, CurrentTime=${s.currentTime.toFixed(1)}s, Paused=${s.paused}, HasHls=${s.hasHls}, HlsLevel=${s.hlsLevel}`);
      if (s.readyState >= 3 && s.currentTime > 1) {
        console.log("SUCCESS: 4K UHD is actively playing on physical device!");
        execSync("adb exec-out screencap -p > /home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/device_physical_4k_verified_playing.png");
        console.log("Captured device_physical_4k_verified_playing.png");
        break;
      }
    }
    process.exit(0);
  });
});
