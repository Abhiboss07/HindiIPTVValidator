/**
 * T2L V2.1 Prototype Interaction Controller
 */

// 1. Splash Screen Auto-Dismiss
window.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('t2lSplash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('splash-hidden');
    }, 1200);
  }
});

function replaySplash() {
  const splash = document.getElementById('t2lSplash');
  if (splash) {
    splash.classList.remove('splash-hidden');
    setTimeout(() => {
      splash.classList.add('splash-hidden');
    }, 1200);
  }
}

// 2. Art-Aware Transparent Header Scroll Listener
window.addEventListener('scroll', () => {
  const header = document.getElementById('t2lHeader');
  if (header) {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
});

// 3. View Navigation
function navigateTo(targetView) {
  const views = ['home', 'cinema', 'live', 'radio', 'local'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) {
      if (v === targetView) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });

  views.forEach(v => {
    const tab = document.getElementById(`tab-${v}`);
    if (tab) {
      if (v === targetView) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    }
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// 4. Cinema Segment Controller
function setCinemaSegment(btn) {
  const parent = btn.parentElement;
  if (parent) {
    Array.from(parent.children).forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
  }
}

// 5. Notifications Panel
function openNotifications() {
  const p = document.getElementById('notificationPanel');
  if (p) p.classList.add('active');
}

function closeNotifications() {
  const p = document.getElementById('notificationPanel');
  if (p) p.classList.remove('active');
}

// 6. Profile & Hub Drawer
function openProfile() {
  const p = document.getElementById('profilePanel');
  if (p) p.classList.add('active');
}

function closeProfile() {
  const p = document.getElementById('profilePanel');
  if (p) p.classList.remove('active');
}

// 7. Spotlight Search Overlay
function openSearchModal() {
  const modal = document.getElementById('spotlightSearchModal');
  if (modal) modal.style.display = 'block';
  const input = document.getElementById('spotlightInput');
  if (input) setTimeout(() => input.focus(), 100);
}

function closeSearchModal() {
  const modal = document.getElementById('spotlightSearchModal');
  if (modal) modal.style.display = 'none';
}

// 8. Movie Details Modal
function openMovieDetails(title) {
  const modal = document.getElementById('movieDetailsModal');
  if (modal) {
    modal.classList.add('active');
    const titleEl = document.getElementById('detailsTitleText');
    if (titleEl) titleEl.textContent = title;
  }
}

function closeMovieDetails() {
  const modal = document.getElementById('movieDetailsModal');
  if (modal) modal.classList.remove('active');
}

// 9. Series Details Modal
function openSeriesDetails(title) {
  const modal = document.getElementById('seriesDetailsModal');
  if (modal) modal.classList.add('active');
}

function closeSeriesDetails() {
  const modal = document.getElementById('seriesDetailsModal');
  if (modal) modal.classList.remove('active');
}

// 10. OLED Theater Player Modal
function openPlayer(title, subtitle) {
  const modal = document.getElementById('theaterPlayerModal');
  if (modal) {
    modal.classList.add('active');
    const titleEl = document.getElementById('playerTitleText');
    if (titleEl) titleEl.textContent = title;
    const subEl = document.getElementById('playerSubtitleText');
    if (subEl && subtitle) subEl.textContent = subtitle;
  }
}

function closePlayer() {
  const modal = document.getElementById('theaterPlayerModal');
  if (modal) modal.classList.remove('active');
}

let isPlaying = false;
function togglePlayState() {
  isPlaying = !isPlaying;
  const btn = document.getElementById('playerPlayToggle');
  if (btn) btn.textContent = isPlaying ? '❚❚' : '▶';
}
