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

    console.log("1. Starting Sita Ramam VOD Stream...");
    await send("Runtime.evaluate", {
      expression: `
        window.closeFullPlayerModal();
      `
    });
    await new Promise(r => setTimeout(r, 600));

    await send("Runtime.evaluate", {
      expression: `
        window.openMovieDetails("vod_sita_ramam_2022");
      `
    });
    await new Promise(r => setTimeout(r, 600));

    await send("Runtime.evaluate", {
      expression: `
        window.handleStreamMovieClick();
      `
    });

    console.log("2. Waiting for progressive video playback...");
    for (let i = 0; i < 25; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const res = await send("Runtime.evaluate", {
        expression: `(() => {
          const v = document.getElementById("luminaVideo");
          const b = document.getElementById("vlcTopQualityLabel");
          return {
            src: v ? v.src : "",
            paused: v ? v.paused : true,
            currentTime: v ? v.currentTime : 0,
            readyState: v ? v.readyState : 0,
            videoWidth: v ? v.videoWidth : 0,
            videoHeight: v ? v.videoHeight : 0,
            badge: b ? b.textContent : ""
          };
        })()`,
        returnByValue: true
      });
      const s = res.result.value;
      console.log(`[T+${i+1}s] ReadyState=${s.readyState}, Dimensions=${s.videoWidth}x${s.videoHeight}, CurrentTime=${s.currentTime.toFixed(1)}s, Paused=${s.paused}, Badge=${s.badge}`);
      if (s.src.includes("sita-ramam") && s.readyState >= 3 && s.currentTime > 2) {
        console.log("SUCCESS: Sita Ramam is actively playing on physical device!");
        execSync("adb exec-out screencap -p > /home/abhiboss/.gemini/antigravity/brain/e8e871f2-e695-492a-ac55-e9c04e592021/device_physical_vod_sita_ramam_verified.png");
        console.log("Captured device_physical_vod_sita_ramam_verified.png");
        break;
      }
    }
    process.exit(0);
  });
});
