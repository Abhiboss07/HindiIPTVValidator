#!/usr/bin/env python3
import re
import os
import shutil

ROOT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator"
ASSETS_DIR = os.path.join(ROOT_DIR, "assets")
ANDROID_ASSETS_DIR = os.path.join(ROOT_DIR, "android_app/src/main/assets/assets")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
ANDROID_INDEX_HTML = os.path.join(ROOT_DIR, "android_app/src/main/assets/index.html")
STYLES_CSS = os.path.join(ASSETS_DIR, "styles.css")
APP_JS = os.path.join(ASSETS_DIR, "app.js")

def update_styles_css():
    print("Updating styles.css...")
    with open(STYLES_CSS, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Video cue & lower caption styling
    caption_css_patch = """
/* ==========================================================
   AUTHENTIC CLEAN LOWER CAPTIONS (ZERO DUPLICATION)
   ========================================================== */
video::cue {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}
::-webkit-media-text-track-display {
  display: none !important;
}
::-webkit-media-text-track-container {
  display: none !important;
}

.player-cc-container {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 88%;
  background: transparent !important;
  border: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  z-index: 45;
  pointer-events: none;
  text-align: center;
  box-shadow: none !important;
}

.player-cc-badge {
  display: none !important;
}

.player-cc-text {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF !important;
  line-height: 1.4;
  margin: 0;
  text-shadow: 
    -1.5px -1.5px 0 #000,  
     1.5px -1.5px 0 #000,
    -1.5px  1.5px 0 #000,
     1.5px  1.5px 0 #000,
     0px 2px 8px rgba(0, 0, 0, 0.95);
}

/* ==========================================================
   ABSOLUTE PLAYER BORDER ELIMINATION
   ========================================================== */
#playerModal,
.obsidian-player-modal,
#luminaVideo,
#luminaIframe,
.player-controls-overlay,
.vlc-controls-overlay,
#playerUiOverlay {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
"""
    # Replace existing player-cc-container block or append
    if ".player-cc-container {" in content:
        # replace from .player-cc-container down through .player-cc-text
        pattern = r"\.player-cc-container\s*\{[^}]+\}.*?\.player-cc-text\s*\{[^}]+\}"
        content = re.sub(pattern, caption_css_patch.strip(), content, flags=re.DOTALL)
    else:
        content += "\n" + caption_css_patch

    # 2. Update footer padding for capsule dock clearance
    content = re.sub(
        r"\.t2l-footer-redesigned\s*\{[^}]*padding:\s*40px 20px 24px 20px;",
        ".t2l-footer-redesigned {\n  margin-top: 56px;\n  padding: 40px 20px 130px 20px;",
        content
    )

    with open(STYLES_CSS, "w", encoding="utf-8") as f:
        f.write(content)
    print("styles.css updated successfully.")

def update_index_html():
    print("Updating index.html...")
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove fake Dialogue Clarity Boost menu item
    dialogue_item_regex = r'<!-- 2b\. Dialogue Clarity Boost.*?</div>\s*</div>'
    if re.search(dialogue_item_regex, content, flags=re.DOTALL):
        content = re.sub(dialogue_item_regex, '<!-- 2b. Dialogue Clarity Boost cleanly removed per Phase 14 -->', content, flags=re.DOTALL)
        print("Removed Dialogue Clarity Boost item from index.html.")

    # 2. Change hardcoded Hindi in vlcAudioSubtitle badge
    content = content.replace(
        '<small id="vlcAudioSubtitle" class="vlc-menu-badge">Hindi</small>',
        '<small id="vlcAudioSubtitle" class="vlc-menu-badge">Default</small>'
    )

    # 3. Move footer out of page-home to right before </main>
    # Find footer block
    footer_match = re.search(r'(<!-- =+\s*COMPLETELY REDESIGNED EDITORIAL FOOTER.*?<footer id="t2lFooter".*?</footer>)', content, flags=re.DOTALL)
    if footer_match:
        footer_block = footer_match.group(1)
        # Remove from its current position
        content = content.replace(footer_block, '')
        # Place right before </main>
        content = content.replace('</main>', footer_block + '\n  </main>')
        print("Moved t2lFooter to root level right before </main>.")

    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(content)
    print("index.html updated successfully.")

def update_app_js():
    print("Updating app.js...")
    with open(APP_JS, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. HeroCarouselController: Deterministic 24-hour daily refresh
    # We replace startHomeRotator and startCinemaRotator, and refreshItems
    hero_controller_patch = """
  init() {
    this.refreshItems();
    this.calculateDailyHeroes();
    this.setupGestures('home', document.getElementById('homeHeroSection'));
    this.setupGestures('cinema', document.getElementById('cinemaHeroSection'));
    this.isInitialized = true;
  },

  calculateDailyHeroes() {
    // Deterministic 24-hour daily rotation using stable epoch days
    const now = new Date();
    const daysSinceEpoch = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
    
    if (this.homeItems && this.homeItems.length > 0) {
      this.homeIndex = Math.abs(daysSinceEpoch) % this.homeItems.length;
      this.updateHeroUI('home');
    }
    if (this.cinemaItems && this.cinemaItems.length > 0) {
      // Offset by 3 so Cinema hero showcases a distinct title
      this.cinemaIndex = Math.abs(daysSinceEpoch + 3) % this.cinemaItems.length;
      this.updateHeroUI('cinema');
    }
  },

  refreshItems() {
    const all = CatalogProvider.getAll() || [];
    // Only select verified direct stream items for hero spotlights
    const directAvailable = all.filter(item => item && item.sourceState === 'DIRECT_STREAM_AVAILABLE' && item.streamUrl);
    const pool = directAvailable.length >= 6 ? directAvailable : all;

    const preferredHomeIds = ['vod_12th_fail', 'vod_sintel_4k', 'vod_tears_of_steel', 'vod_kalki_2898_ad', 'vod_jawan', 'vod_dangal'];
    const curatedHome = preferredHomeIds.map(id => CatalogProvider.getById(id)).filter(item => item && item.streamUrl);
    this.homeItems = curatedHome.length >= 3 ? curatedHome : pool.slice(0, 8);

    const preferredCinemaIds = ['vod_sintel_4k', 'vod_tears_of_steel', 'vod_kalki_2898_ad', 'vod_jawan', 'vod_12th_fail', 'vod_elephants_dream'];
    const curatedCinema = preferredCinemaIds.map(id => CatalogProvider.getById(id)).filter(item => item && item.streamUrl);
    this.cinemaItems = curatedCinema.length >= 3 ? curatedCinema : pool.slice(0, 8);
  },
"""
    # Replace init and refreshItems in HeroCarouselController
    content = re.sub(
        r"init\(\)\s*\{.*?this\.isInitialized = true;\s*\},",
        hero_controller_patch.strip(),
        content,
        flags=re.DOTALL
    )

    # Disable the 6000ms / 6500ms intervals in startHomeRotator and startCinemaRotator
    daily_rotators = """
  startHomeRotator() {
    clearInterval(this.homeInterval);
    this.updateHeroUI('home');
    // Daily stable hero: No periodic layout shift interval. Refreshes stably once per day.
  },

  startCinemaRotator() {
    clearInterval(this.cinemaInterval);
    this.updateHeroUI('cinema');
    // Daily stable hero: No periodic layout shift interval. Refreshes stably once per day.
  },
"""
    content = re.sub(
        r"startHomeRotator\(\)\s*\{.*?startCinemaRotator\(\)\s*\{.*?\},\s*goTo",
        daily_rotators.strip() + ",\n\n  goTo",
        content,
        flags=re.DOTALL
    )

    # 2. Player Tap State Machine: Immediate tap-to-hide + 2.5s auto-hide + tap-to-show
    # Search for playerModal.addEventListener('click'
    old_tap_listener = r"if \(playerModal\) \{\s*playerModal\.addEventListener\('click',\s*\(e\) => \{.*?\}\);\s*\}"
    new_tap_listener = """if (playerModal) {
    window.playerControlState = 'CONTROLS_VISIBLE';

    playerModal.addEventListener('click', (e) => {
      // 1. If Locked: Show obsidian/emerald lock pill temporarily, do NOT reveal controls
      if (isPlayerLocked) {
        window.playerControlState = 'LOCKED';
        if (!e.target.closest('#playerLockOverlay')) {
          showPlayerLockPillTemporarily();
        }
        return;
      }

      // Ignore interactive clicks on buttons, seekbar, dialogs, drawers
      if (e.target.closest('button') || e.target.closest('.vlc-seekbar-wrap') || 
          e.target.closest('.vlc-side-drawer') || e.target.closest('.vlc-dialog-card') ||
          e.target.closest('.vlc-menu-item') || e.target.closest('.vlc-chip-btn')) {
        return;
      }
      
      const now = Date.now();
      const clickX = e.clientX;
      const rect = playerModal.getBoundingClientRect();

      // Double-click/double-tap detection on left or right third of screen
      if (now - lastTapTime < 300 && Math.abs(clickX - lastTapX) < 60) {
        if (clickX < rect.width * 0.35) {
          skipTime(-10);
          lastTapTime = 0;
          return;
        } else if (clickX > rect.width * 0.65) {
          skipTime(10);
          lastTapTime = 0;
          return;
        }
      }
      lastTapTime = now;
      lastTapX = clickX;

      // Authoritative Tap State Machine:
      // If visible -> IMMEDIATE tap-to-hide (all chrome vanishes instantly)
      // If hidden -> tap-to-show with 2.5s auto-hide timeout
      if (playerUiOverlay) {
        if (playerUiOverlay.classList.contains('hidden-controls')) {
          // Tap to reveal
          playerUiOverlay.classList.remove('hidden-controls');
          window.playerControlState = 'CONTROLS_VISIBLE';
          resetPlayerHideTimer();
        } else {
          // Immediate Tap to hide
          clearTimeout(playerHideTimeout);
          playerUiOverlay.classList.add('hidden-controls');
          window.playerControlState = 'CONTROLS_HIDDEN';
          closeVlcMoreMenu();
        }
      }
    });
  }"""
    content = re.sub(old_tap_listener, new_tap_listener, content, flags=re.DOTALL)

    # 3. resetPlayerHideTimer to 2500ms (2.5s auto-hide)
    content = re.sub(
        r"function resetPlayerHideTimer\(\)\s*\{.*?\}, \d+\);\s*\}",
        """function resetPlayerHideTimer() {
  clearTimeout(playerHideTimeout);
  const playerUiOverlay = document.getElementById('playerUiOverlay');
  if (playerUiOverlay) {
    playerUiOverlay.classList.remove('hidden-controls');
    window.playerControlState = 'CONTROLS_VISIBLE';
  }
  playerHideTimeout = setTimeout(() => {
    if (playerUiOverlay && isPlaying && !isPlayerLocked) {
      playerUiOverlay.classList.add('hidden-controls');
      window.playerControlState = 'CONTROLS_HIDDEN';
    }
  }, 2500);
}""",
        content,
        flags=re.DOTALL
    )

    # 4. Captions: Prevent duplicate native browser cues by setting mode='hidden' instead of 'showing'
    content = content.replace(
        "videoElement.textTracks[i].mode = 'showing';",
        "videoElement.textTracks[i].mode = 'hidden';"
    )
    content = content.replace(
        "track.mode === 'showing' && track.activeCues",
        "(track.mode === 'showing' || track.mode === 'hidden') && track.activeCues"
    )

    # 5. Audio track "Hindi always shows" fix:
    # In setVlcAudioTrack, remove 'Hindi' fallback
    content = content.replace(
        "if (subBadge) subBadge.textContent = shortNames[trackId] || 'Hindi';",
        """const movie = (typeof currentPlayingChannel !== 'undefined' && currentPlayingChannel && currentPlayingChannel.movieData) || (typeof currentSelectedMovie !== 'undefined' ? currentSelectedMovie : null);
  const defaultTrackLang = (movie && movie.defaultLanguage) || (movie && movie.languages && movie.languages[0]) || 'Master';
  if (subBadge) subBadge.textContent = shortNames[trackId] || (trackId === 'master' ? defaultTrackLang : trackId);"""
    )

    # In destroyPreviousPlayerSession: reset vlcAudioSubtitle badge
    content = re.sub(
        r"(// Reset player lock state)",
        """const audioSubBadge = document.getElementById('vlcAudioSubtitle');
  if (audioSubBadge) audioSubBadge.textContent = 'Default';
  \\1""",
        content
    )

    # In loadChannelMedia: update vlcAudioSubtitle dynamically for active media
    content = re.sub(
        r"(if \(autoPlay\) \{\s*openFullPlayerModal\(\);\s*showBufferingSpinner\('Connecting Stream\.\.\.'\);\s*\})",
        """\\1
  // Dynamically update audio language badge for active media
  const activeMovie = ch.movieData || (typeof currentSelectedMovie !== 'undefined' ? currentSelectedMovie : null);
  const audioSubBadge = document.getElementById('vlcAudioSubtitle');
  if (audioSubBadge && activeMovie) {
    const movieLang = activeMovie.defaultLanguage || (activeMovie.languages && activeMovie.languages[0]) || 'Default';
    audioSubBadge.textContent = movieLang;
  }""",
        content
    )

    # 6. Footer & Navigation:
    # switchPage alias for 'cinema' -> 'movies'
    content = re.sub(
        r"window\.switchPage\s*=\s*function\(pageId\)\s*\{",
        """window.switchPage = function(pageId) {
  if (pageId === 'cinema') pageId = 'movies';""",
        content
    )

    # Alias openVlcTipsModal to openVlcPlayerTips
    if "window.openVlcTipsModal" not in content:
        content += "\n// Footer / Help Modal Alias\nwindow.openVlcTipsModal = window.openVlcPlayerTips;\n"

    # 7. Remove dead toggleDialogueBoost
    content = re.sub(
        r"let isDialogueBoostEnabled\s*=\s*false;\s*window\.toggleDialogueBoost\s*=\s*function\(\)\s*\{.*?showToast\('Dialogue Clarity Boost: Off'\);\s*\}\s*\};",
        "// Dialogue Clarity Boost cleanly removed per Phase 14 audit\nwindow.toggleDialogueBoost = function() { showToast('Direct Hardware Audio Active 🔊'); };",
        content,
        flags=re.DOTALL
    )

    with open(APP_JS, "w", encoding="utf-8") as f:
        f.write(content)
    print("app.js updated successfully.")

def sync_assets():
    print("Syncing assets to android_app/src/main/assets/...")
    shutil.copyfile(INDEX_HTML, ANDROID_INDEX_HTML)
    shutil.copyfile(STYLES_CSS, os.path.join(ANDROID_ASSETS_DIR, "styles.css"))
    shutil.copyfile(APP_JS, os.path.join(ANDROID_ASSETS_DIR, "app.js"))
    print("All assets synchronized successfully.")

if __name__ == "__main__":
    update_styles_css()
    update_index_html()
    update_app_js()
    sync_assets()
    print("All remediations applied and synced!")
