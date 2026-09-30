const http = require('http');

async function main() {
  const list = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = list.find(p => p.type === 'page' && p.url.includes('index.html'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  ws.addEventListener('open', async () => {
    const cmd = process.argv[2];
    await evaluate(`(() => {
      closeMyListModal();
      closeAppInfoModal();
      closeSpeedTestModal();
      closeSettingsModal();
      closeNotificationsSheet();
      closeHamburger();
    })()`);

    if (cmd === 'appinfo') {
      await evaluate(`openAppInfoModal('about')`);
    } else if (cmd === 'settings') {
      await evaluate(`openSettingsModal()`);
    } else if (cmd === 'speed') {
      await evaluate(`openSpeedTestModal()`);
    } else if (cmd === 'notif') {
      await evaluate(`openNotificationsSheet()`);
    } else if (cmd === 'mylist') {
      await evaluate(`openMyListModal()`);
    } else if (cmd === 'home') {
      await evaluate(`switchPage('home')`);
    }
    ws.close();
    process.exit(0);
  });

  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });

  function evaluate(expression) {
    return new Promise(resolve => {
      const msgId = id++;
      pending.set(msgId, res => resolve(res ? res.value : null));
      ws.send(JSON.stringify({
        id: msgId,
        method: 'Runtime.evaluate',
        params: { expression, returnByValue: true, awaitPromise: true }
      }));
    });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
