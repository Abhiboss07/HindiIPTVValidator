const http = require("http");

async function getDevToolsTarget() {
  return new Promise((resolve, reject) => {
    http.get("http://localhost:9222/json/list", (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === "page" || t.url.includes("index.html"));
          if (page) resolve(page);
          else reject(new Error("No suitable WebView target found on port 9222"));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function diagnose() {
  const target = await getDevToolsTarget();
  console.log("Connected to target:", target.title);
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  let msgId = 0;
  const pending = new Map();
  const consoleMessages = [];
  const networkRequests = [];

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
    if (data.method === "Runtime.consoleAPICalled") {
      const args = (data.params.args || []).map(a => a.value || a.description || JSON.stringify(a)).join(" ");
      console.log(`[CONSOLE ${data.params.type.toUpperCase()}] ${args}`);
      consoleMessages.push({ type: data.params.type, text: args });
    }
    if (data.method === "Network.requestWillBeSent") {
      networkRequests.push({ url: data.params.request.url, method: data.params.request.method });
      console.log(`[NET REQ] ${data.params.request.method} ${data.params.request.url}`);
    }
    if (data.method === "Network.loadingFailed") {
      console.log(`[NET FAIL] ${data.params.errorText} for request ${data.params.requestId}`);
    }
    if (data.method === "Network.responseReceived") {
      console.log(`[NET RESP] ${data.params.response.status} ${data.params.response.url} (${data.params.response.mimeType})`);
    }
  });

  await new Promise((res, rej) => {
    ws.addEventListener("open", res);
    ws.addEventListener("error", rej);
  });

  const sendCdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });

  await sendCdp("Runtime.enable");
  await sendCdp("Network.enable");

  console.log("\n=== TEST 1: Play 4K UHD Reference Movie ===");
  await sendCdp("Runtime.evaluate", {
    expression: `
      window.handleStreamMovieClick = window.handleStreamMovieClick;
      window.currentSelectedMovie = CatalogProvider.getById('vod_4k_uhd_reference_showcase');
      window.handleStreamMovieClick();
    `
  });

  await sleep(4000);

  const videoState = await sendCdp("Runtime.evaluate", {
    expression: `
      (() => {
        const v = document.getElementById('luminaVideo');
        return {
          src: v ? v.src : '',
          currentSrc: v ? v.currentSrc : '',
          paused: v ? v.paused : true,
          readyState: v ? v.readyState : 0,
          networkState: v ? v.networkState : 0,
          error: v && v.error ? { code: v.error.code, message: v.error.message } : null,
          videoWidth: v ? v.videoWidth : 0,
          videoHeight: v ? v.videoHeight : 0,
          currentTime: v ? v.currentTime : 0
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Video State after 4s:", videoState.result.value);

  console.log("\n=== TEST 2: Play 1080p Movie (Rang De Basanti) ===");
  await sendCdp("Runtime.evaluate", {
    expression: `
      window.currentSelectedMovie = CatalogProvider.getById('vod_rang_de_basanti_2006');
      window.handleStreamMovieClick();
    `
  });
  await sleep(4000);
  const rdbState = await sendCdp("Runtime.evaluate", {
    expression: `
      (() => {
        const v = document.getElementById('luminaVideo');
        return {
          src: v ? v.src : '',
          currentSrc: v ? v.currentSrc : '',
          paused: v ? v.paused : true,
          readyState: v ? v.readyState : 0,
          networkState: v ? v.networkState : 0,
          error: v && v.error ? { code: v.error.code, message: v.error.message } : null,
          videoWidth: v ? v.videoWidth : 0,
          videoHeight: v ? v.videoHeight : 0,
          currentTime: v ? v.currentTime : 0
        };
      })()
    `,
    returnByValue: true
  });
  console.log("RDB Video State after 4s:", rdbState.result.value);

  console.log("\n=== TEST 3: Play Live TV (Aaj Tak HD) ===");
  await sendCdp("Runtime.evaluate", {
    expression: `
      const ch = FALLBACK_CHANNELS.find(c => c.id === 'aajtak-hd' || c.id === 'discovery-channel-hindi-hd');
      window.playChannel(ch);
    `
  });
  await sleep(4000);
  const liveState = await sendCdp("Runtime.evaluate", {
    expression: `
      (() => {
        const v = document.getElementById('luminaVideo');
        return {
          src: v ? v.src : '',
          currentSrc: v ? v.currentSrc : '',
          paused: v ? v.paused : true,
          readyState: v ? v.readyState : 0,
          networkState: v ? v.networkState : 0,
          error: v && v.error ? { code: v.error.code, message: v.error.message } : null,
          videoWidth: v ? v.videoWidth : 0,
          videoHeight: v ? v.videoHeight : 0,
          currentTime: v ? v.currentTime : 0
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Live TV Video State after 4s:", liveState.result.value);

  process.exit(0);
}

diagnose().catch(e => {
  console.error(e);
  process.exit(1);
});
