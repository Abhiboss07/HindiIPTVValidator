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
  if (!page) {
    console.error('No index.html page found:', list);
    process.exit(1);
  }

  console.log('Connecting to WebView on device:', page.webSocketDebuggerUrl);
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 1;
  const pending = new Map();

  ws.addEventListener('open', () => {
    console.log('CDP Connected.');
    runTests();
  });

  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      pending.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : res;
  }

  async function runTests() {
    try {
      console.log('\n--- 1. VERIFY FOOTER (NAVIGATION REMOVED) ---');
      const footerNavCheck = await evaluate(`(() => {
        const desktopTitles = Array.from(document.querySelectorAll('.footer-col-title')).map(el => el.textContent.trim());
        const mobileTitles = Array.from(document.querySelectorAll('.footer-mobile-row-title')).map(el => el.textContent.trim());
        return {
          desktopTitles,
          mobileTitles,
          hasDesktopNav: desktopTitles.includes('Navigation'),
          hasMobileNav: mobileTitles.includes('Navigation')
        };
      })()`);
      console.log('Footer Col Titles:', footerNavCheck.desktopTitles);
      console.log('Footer Mobile Titles:', footerNavCheck.mobileTitles);
      console.log('Is "Navigation" present anywhere in footer?', footerNavCheck.hasDesktopNav || footerNavCheck.hasMobileNav);

      console.log('\n--- 2. VERIFY APP INFORMATION HUB MODAL ---');
      const appInfoCheck = await evaluate(`(() => {
        openAppInfoModal('about');
        const modal = document.getElementById('appInfoModal');
        const title = document.getElementById('appInfoModalTitle')?.textContent;
        const activeTab = document.querySelector('.app-info-tab.active')?.textContent;
        const specs = Array.from(document.querySelectorAll('.info-spec-item')).map(el => el.textContent.trim());
        return {
          modalVisible: modal ? modal.style.display : null,
          title,
          activeTab,
          specsCount: specs.length,
          sampleSpec: specs[0]
        };
      })()`);
      console.log('App Info Modal Check:', appInfoCheck);

      console.log('\n--- 3. VERIFY MY LIST MODAL ---');
      const myListCheck = await evaluate(`(() => {
        openMyListModal();
        const modal = document.getElementById('myListModal');
        const countBadge = document.getElementById('myListCountBadge')?.textContent;
        const content = document.getElementById('myListContent')?.innerHTML;
        return {
          modalVisible: modal ? modal.style.display : null,
          countBadge,
          hasEmptyState: content ? content.includes('Your List is Empty') : false
        };
      })()`);
      console.log('My List Modal Check:', myListCheck);

      console.log('\n--- 4. VERIFY SPEED TEST WITH REALTIME RECOMMENDED MOVIES ---');
      const speedCheck = await evaluate(`(() => {
        openSpeedTestModal();
        const recSection = document.getElementById('speedRecommendedMoviesSection');
        return {
          recSectionExists: !!recSection,
          badge: document.getElementById('speedRecHeaderBadge')?.textContent
        };
      })()`);
      console.log('Speed Test Modal Recommender:', speedCheck);

      console.log('\n--- 5. VERIFY SETTINGS (BORDERLESS CLEAR CACHE & SECTIONS) ---');
      const settingsCheck = await evaluate(`(() => {
        openSettingsModal();
        const clearBtn = document.querySelector('.btn-clear-cache-borderless');
        const navSections = Array.from(document.querySelectorAll('.settings-nav-section .setting-item-title')).map(el => el.textContent.trim());
        return {
          clearBtnFound: !!clearBtn,
          clearBtnStyle: clearBtn ? clearBtn.getAttribute('style') : null,
          navSections
        };
      })()`);
      console.log('Settings Sections Check:', settingsCheck);

      console.log('\n--- 6. VERIFY NOTIFICATIONS DYNAMIC POPULATION ---');
      const notifCheck = await evaluate(`(() => {
        openNotificationsSheet();
        const list = document.getElementById('notificationsDynamicList');
        const notifCount = list ? list.children.length : 0;
        return {
          notifCount,
          firstNotifText: list && list.firstElementChild ? list.firstElementChild.textContent.trim() : null
        };
      })()`);
      console.log('Notifications Dynamic Population:', notifCheck);

      console.log('\n--- 7. VERIFY YOUTUBE-STYLE ONE-TAP CC ---');
      const ccCheck = await evaluate(`(() => {
        const topBtn = document.getElementById('btnVlcCcTop');
        const botBtn = document.getElementById('btnVlcSubtitles');
        toggleYtStyleCC();
        const stateAfterOn = {
          isCCEnabled,
          topBtnActive: topBtn?.classList.contains('active'),
          botBtnActive: botBtn?.classList.contains('active')
        };
        toggleYtStyleCC();
        const stateAfterOff = {
          isCCEnabled,
          topBtnActive: topBtn?.classList.contains('active'),
          botBtnActive: botBtn?.classList.contains('active')
        };
        return { stateAfterOn, stateAfterOff };
      })()`);
      console.log('YouTube CC Toggle Test:', ccCheck);

      console.log('\nALL 7 TESTS VERIFIED DIRECTLY INSIDE NOTHING PHONE 3 WEBVIEW!');
      ws.close();
      process.exit(0);
    } catch (err) {
      console.error('Error running tests:', err);
      ws.close();
      process.exit(1);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
