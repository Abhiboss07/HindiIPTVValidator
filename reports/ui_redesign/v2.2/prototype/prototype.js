/**
 * T2L Aurora Cinema V2.2 — Prototype Interactivity & Transitions
 */

// 1. Splash Auto-Dismiss (1200ms)
function dismissSplash() {
  const splash = document.getElementById('t2lSplash');
  if (splash) {
    splash.classList.add('splash-hidden');
  }
}

const initialUrlParams = new URLSearchParams(window.location.search);
if (initialUrlParams.has('noSplash') || (window.location.hash && window.location.hash !== '#splash')) {
  dismissSplash();
}

setTimeout(() => {
  // Only auto-dismiss if not explicitly kept open via URL param
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('keepSplash') && window.location.hash !== '#splash') {
    dismissSplash();
  }
}, 1200);

// 2. Header Scroll Glass Transition
window.addEventListener('scroll', () => {
  const header = document.getElementById('t2lHeader');
  if (window.scrollY > 40) {
    header?.classList.add('is-scrolled');
  } else {
    header?.classList.remove('is-scrolled');
  }
}, { passive: true });

// 3. Page Navigation Handler
function navigateTo(viewId, btnElement) {
  // Hide all views
  document.querySelectorAll('.t2l-view').forEach(view => {
    view.classList.remove('active');
  });

  // Show target view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Update navigation dock active state
  if (btnElement) {
    document.querySelectorAll('.dock-item-btn').forEach(btn => {
      btn.classList.remove('active');
      const pill = btn.querySelector('.dock-active-pill');
      if (pill) pill.remove();
    });

    btnElement.classList.add('active');
    const newPill = document.createElement('span');
    newPill.className = 'dock-active-pill';
    btnElement.prepend(newPill);
  } else {
    // Sync dock button by viewId
    const targetBtn = document.querySelector(`.dock-item-btn[onclick*="'${viewId}'"]`);
    if (targetBtn) {
      document.querySelectorAll('.dock-item-btn').forEach(btn => {
        btn.classList.remove('active');
        const pill = btn.querySelector('.dock-active-pill');
        if (pill) pill.remove();
      });
      targetBtn.classList.add('active');
      const newPill = document.createElement('span');
      newPill.className = 'dock-active-pill';
      targetBtn.prepend(newPill);
    }
  }
}

// 4. Cinema Architectural Discovery Mode Switcher
function filterCinemaMode(mode, btnElement) {
  document.querySelectorAll('.cinema-mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Subtle visual cue or section scroll
  if (mode === 'premieres') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (mode === 'theatrical') {
    const shelf = document.querySelector('.cinema-repertory-grid');
    if (shelf) shelf.scrollIntoView({ behavior: 'smooth' });
  } else if (mode === 'sagas') {
    const saga = document.querySelector('.saga-card');
    if (saga) saga.scrollIntoView({ behavior: 'smooth' });
  }
}

// 5. Details Modal with Card-to-Backdrop Expand Transition
const catalogDatabase = {
  '12th Fail': {
    year: '2023',
    runtime: '2h 27m',
    genre: 'Biographical Drama',
    quality: '720p HD Master · Hindi',
    poster: '/assets/posters/vod_12th_fail.jpg',
    synopsis: 'Based on Anurag Pathak\'s bestselling novel, Manoj Kumar Sharma battles intense poverty and social obstacles to clear the prestigious UPSC Civil Services examination.'
  },
  'Kalki 2898 AD': {
    year: '2024',
    runtime: '3h 01m',
    genre: 'Mythological Sci-Fi',
    quality: '720p HD · 2.39:1 Scope',
    poster: '/assets/posters/vod_kalki_2898_ad.jpg',
    synopsis: 'Set in a post-apocalyptic world in the year 2898 AD, a battle unfolds between divine forces and supreme dystopian rulers for the survival of humanity.'
  },
  'Jawan': {
    year: '2023',
    runtime: '2h 49m',
    genre: 'High-Octane Action Thriller',
    quality: '1080p BluRay · Atmos',
    poster: '/assets/posters/vod_jawan.jpg',
    synopsis: 'A prison warden driven by a personal vendetta recruits inmates to execute daring heists that expose societal injustices across the nation.'
  },
  'Dangal': {
    year: '2016',
    runtime: '2h 41m',
    genre: 'Biographical Sports Drama',
    quality: '1080p Full HD · Multi-Audio',
    poster: '/assets/posters/vod_dangal.jpg',
    synopsis: 'Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to triumph against all odds and win India\'s first wrestling gold medals.'
  },
  'Game of Thrones': {
    year: '2011–2019',
    runtime: '8 Seasons · 73 Episodes',
    genre: 'Epic High Fantasy',
    quality: '1080p HD Master · 5.1 Surround',
    poster: '/assets/posters/series_game_of_thrones.jpg',
    synopsis: 'Nine noble families fight for control over the mythical lands of Westeros, while an ancient enemy returns after being dormant for millennia.'
  },
  'Mirzapur': {
    year: '2018–2024',
    runtime: '3 Seasons · 29 Episodes',
    genre: 'Crime Drama & Action',
    quality: '1080p FHD · Hindi Raw',
    poster: '/assets/posters/series_mirzapur.jpg',
    synopsis: 'The iron-fisted rule of Akhandanand Tripathi, a ruthless mafia don of Mirzapur, is challenged when his reckless son initiates a deadly gang war.'
  },
  'Panchayat': {
    year: '2020–2024',
    runtime: '2 Seasons · 16 Episodes',
    genre: 'Rural Social Comedy',
    quality: '1080p HD Master',
    poster: '/assets/posters/series_panchayat.jpg',
    synopsis: 'An engineering graduate takes up a job as a secretary of a Panchayat office in a remote village of Uttar Pradesh due to lack of better job options.'
  },
  'Stranger Things': {
    year: '2016–2024',
    runtime: '4 Seasons · 34 Episodes',
    genre: 'Sci-Fi Horror Mystery',
    quality: '1080p HD · Atmos',
    poster: '/assets/posters/series_stranger_things.jpg',
    synopsis: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
  },
  'Sita Sings the Blues': {
    year: '2008',
    runtime: '1h 22m',
    genre: 'Animated Musical / Public Domain',
    quality: '720p HD · Creative Commons',
    poster: '/assets/posters/vod_sita_sings_blues.jpg',
    synopsis: 'An animated tale of the Hindu epic Ramayana juxtaposed with a modern personal heartbreak, set to the 1920s jazz vocals of Annette Hanshaw.'
  },
  'His Girl Friday': {
    year: '1940',
    runtime: '1h 32m',
    genre: 'Classic Screwball Comedy / Public Domain',
    quality: '1080p Remaster · Public Domain',
    poster: '/assets/posters/vod_his_girl_friday.jpg',
    synopsis: 'A newspaper editor uses every trick in the book to keep his ace reporter ex-wife from remarrying and leaving the newspaper business.'
  }
};

let currentModalTitle = '';

function openMovieDetails(title) {
  const data = catalogDatabase[title] || {
    year: '2024',
    runtime: '2h 15m',
    genre: 'Cinema Master',
    quality: '1080p HD',
    poster: '/assets/posters/vod_12th_fail.jpg',
    synopsis: 'High-definition cinematic feature from the T2L Vault.'
  };

  currentModalTitle = title;
  const modal = document.getElementById('detailsModal');
  const heroImg = document.getElementById('modalHeroImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalDesc = document.getElementById('modalDesc');

  if (modal && heroImg && modalTitle) {
    heroImg.src = data.poster;
    modalTitle.textContent = title;
    modalMeta.textContent = `${data.year} • ${data.genre} • ${data.runtime} • ${data.quality}`;
    modalDesc.textContent = data.synopsis;

    // Use View Transitions API if supported
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        modal.classList.add('is-open');
      });
    } else {
      modal.classList.add('is-open');
    }
  }
}

function openSeriesDetails(title) {
  openMovieDetails(title);
}

function closeMovieDetails() {
  const modal = document.getElementById('detailsModal');
  if (modal) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        modal.classList.remove('is-open');
      });
    } else {
      modal.classList.remove('is-open');
    }
  }
}

// 6. Player Modal Handler
function openPlayer(title, meta) {
  const modal = document.getElementById('playerModal');
  const titleEl = document.getElementById('playerTitle');
  const metaEl = document.getElementById('playerMeta');
  if (modal) {
    if (titleEl) titleEl.textContent = title;
    if (metaEl) metaEl.textContent = meta || 'Direct Master Stream';
    modal.classList.add('is-open');
  }
}

function openPlayerFromModal() {
  closeMovieDetails();
  openPlayer(currentModalTitle, 'Cinema Master · High-Fidelity');
}

function closePlayer() {
  const modal = document.getElementById('playerModal');
  if (modal) {
    modal.classList.remove('is-open');
  }
}

// 7. Slide-Over Notifications & Profile
function openNotifications() {
  document.getElementById('notificationsSheet')?.classList.add('is-open');
}

function closeNotifications(e) {
  if (!e || e.target === document.getElementById('notificationsSheet') || e.target.closest('.t2l-icon-btn')) {
    document.getElementById('notificationsSheet')?.classList.remove('is-open');
  }
}

function openProfile() {
  document.getElementById('profileSheet')?.classList.add('is-open');
}

function closeProfile(e) {
  if (!e || e.target === document.getElementById('profileSheet') || e.target.closest('.t2l-icon-btn')) {
    document.getElementById('profileSheet')?.classList.remove('is-open');
  }
}

// 8. Brand Showcase Inspector
function toggleBrandShowcase() {
  const showcase = document.getElementById('brandShowcase');
  if (showcase) {
    showcase.classList.toggle('is-visible');
  }
}

// 9. URL Hash Router for Easy Testing & Screenshots
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash === '#splash') {
    const splash = document.getElementById('t2lSplash');
    if (splash) {
      splash.classList.remove('splash-hidden');
      splash.classList.add('is-static');
    }
  } else if (hash === '#cinema') {
    navigateTo('cinema');
  } else if (hash === '#cinema-scroll') {
    navigateTo('cinema');
    document.getElementById('view-cinema')?.classList.add('focus-scroll');
    const header = document.getElementById('t2lHeader');
    header?.classList.add('is-scrolled');
  } else if (hash === '#live') {
    navigateTo('live');
  } else if (hash === '#radio') {
    navigateTo('radio');
  } else if (hash === '#local') {
    navigateTo('local');
  } else if (hash === '#brand-showcase') {
    toggleBrandShowcase();
  } else if (hash === '#brand-concepts') {
    toggleBrandShowcase();
    document.getElementById('sectionConcepts')?.classList.remove('is-hidden');
    document.getElementById('sectionSelected')?.classList.add('is-hidden');
    document.getElementById('sectionSizes')?.classList.add('is-hidden');
  } else if (hash === '#brand-selected') {
    toggleBrandShowcase();
    document.getElementById('sectionConcepts')?.classList.add('is-hidden');
    document.getElementById('sectionSelected')?.classList.remove('is-hidden');
    document.getElementById('sectionSizes')?.classList.add('is-hidden');
  } else if (hash === '#brand-sizes') {
    toggleBrandShowcase();
    document.getElementById('sectionConcepts')?.classList.add('is-hidden');
    document.getElementById('sectionSelected')?.classList.add('is-hidden');
    document.getElementById('sectionSizes')?.classList.remove('is-hidden');
  } else if (hash === '#player') {
    openPlayer('12th Fail', 'Hindi Master · 720p HD');
  } else if (hash === '#details') {
    navigateTo('cinema');
    openMovieDetails('Kalki 2898 AD');
  } else if (hash === '#footer') {
    navigateTo('home');
    document.getElementById('view-home')?.classList.add('focus-footer');
  }
});
