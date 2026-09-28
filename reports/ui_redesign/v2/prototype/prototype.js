/**
 * T2L V2 Prototype Interaction Controller
 */

function navigateTo(targetView) {
  // Update view visibility
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

  // Update capsule dock active state
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

// Search Modal
function openSearchModal() {
  const modal = document.getElementById('spotlightSearchModal');
  if (modal) modal.classList.add('active');
  const input = document.getElementById('spotlightInput');
  if (input) setTimeout(() => input.focus(), 100);
}

function closeSearchModal() {
  const modal = document.getElementById('spotlightSearchModal');
  if (modal) modal.classList.remove('active');
}

// Movie Details Modal
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

// Series Details Modal
function openSeriesDetails(title) {
  const modal = document.getElementById('seriesDetailsModal');
  if (modal) modal.classList.add('active');
}

function closeSeriesDetails() {
  const modal = document.getElementById('seriesDetailsModal');
  if (modal) modal.classList.remove('active');
}

// OLED Theater Player Modal
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

// Secondary Hub Drawer
function openHubDrawer() {
  const drawer = document.getElementById('hubDrawerModal');
  if (drawer) drawer.classList.add('active');
}

function closeHubDrawer() {
  const drawer = document.getElementById('hubDrawerModal');
  if (drawer) drawer.classList.remove('active');
}
