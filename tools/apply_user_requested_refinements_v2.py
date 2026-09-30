import re
import os

print("Starting Refinements V2 Implementation...")

INDEX_HTML_PATHS = ['index.html', 'android_app/src/main/assets/index.html']
STYLES_CSS_PATHS = ['assets/styles.css', 'android_app/src/main/assets/assets/styles.css']
APP_JS_PATHS = ['assets/app.js', 'android_app/src/main/assets/assets/app.js']

# ==============================================================================
# 1. UPDATE INDEX.HTML
# ==============================================================================
for p in INDEX_HTML_PATHS:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()

    # A. Remove "Navigation" from Desktop Footer Grid
    # Match the Navigation column in footer-desktop-grid
    nav_col_pattern = r'<!-- Col 1: Navigation -->\s*<div>\s*<div class="footer-col-title">Navigation</div>\s*<div class="footer-link-stack">[\s\S]*?</div>\s*</div>'
    html = re.sub(nav_col_pattern, '<!-- Col 1: Navigation (Removed as requested) -->', html)

    # B. Update "My List" in footer Discover col
    html = html.replace(
        """<span class="footer-link-item" onclick="switchPage('movies'); filterCinemaMode('Bollywood', null);">My List</span>""",
        """<span class="footer-link-item" onclick="openMyListModal();">My List</span>"""
    )

    # C. Update Information links in footer Information col
    html = html.replace(
        """<span class="footer-link-item" onclick="showToast('T2L Cinema Platform v2.4 (Unified Production)');">About</span>
                <span class="footer-link-item" onclick="openVlcTipsModal();">Help</span>
                <span class="footer-link-item" onclick="showToast('T2L Privacy: Zero third-party telemetry, local-first storage.');">Privacy</span>""",
        """<span class="footer-link-item" onclick="openAppInfoModal('about');">About</span>
                <span class="footer-link-item" onclick="openAppInfoModal('help');">Help</span>
                <span class="footer-link-item" onclick="openAppInfoModal('privacy');">Privacy</span>"""
    )

    # D. Remove "Navigation" from Mobile Accordion
    mob_nav_pattern = r'<div class="footer-mobile-row" onclick="navigateTo\(\'cinema\'\);">\s*<span class="footer-mobile-row-title">Navigation</span>\s*<span class="footer-mobile-row-chevron">›</span>\s*</div>'
    html = re.sub(mob_nav_pattern, '<!-- Navigation Mobile Row (Removed as requested) -->', html)

    # E. Update Information mobile row to open App Info Modal
    html = html.replace(
        """<div class="footer-mobile-row" onclick="openVlcTipsModal();">
              <span class="footer-mobile-row-title">Information</span>
              <span class="footer-mobile-row-chevron">›</span>
            </div>""",
        """<div class="footer-mobile-row" onclick="openAppInfoModal('about');">
              <span class="footer-mobile-row-title">Information</span>
              <span class="footer-mobile-row-chevron">›</span>
            </div>"""
    )

    # F. Update Drawer Hamburger Menu
    # My list in drawer
    html = html.replace(
        """<div class="drawer-menu-item" onclick="closeHamburger(); switchPage('movies'); filterCinemaMode('Bollywood', null);">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span class="drawer-item-text">My List</span>""",
        """<div class="drawer-menu-item" onclick="closeHamburger(); openMyListModal();">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <span class="drawer-item-text">My List</span>"""
    )

    # Drawer Information items
    html = html.replace(
        """<div class="drawer-menu-item" onclick="closeHamburger(); showToast('T2L Cinema Platform v2.4 (Unified Production)');">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <span class="drawer-item-text">About</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>

        <div class="drawer-menu-item" onclick="closeHamburger(); openVlcTipsModal();">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <span class="drawer-item-text">Help</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>

        <div class="drawer-menu-item" onclick="closeHamburger(); showToast('T2L Privacy: Zero third-party telemetry, local-first storage.');">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <span class="drawer-item-text">Privacy</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>""",
        """<div class="drawer-menu-item" onclick="closeHamburger(); openAppInfoModal('about');">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <span class="drawer-item-text">About</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>

        <div class="drawer-menu-item" onclick="closeHamburger(); openAppInfoModal('help');">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <span class="drawer-item-text">Help</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>

        <div class="drawer-menu-item" onclick="closeHamburger(); openAppInfoModal('privacy');">
          <div class="drawer-item-left">
            <div class="drawer-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <span class="drawer-item-text">Privacy</span>
          </div>
          <span class="drawer-item-chevron">›</span>
        </div>"""
    )

    # G. Add YouTube-style CC button to Player Top Actions
    if 'id="btnVlcCcTop"' not in html:
        html = html.replace(
            """<div class="vlc-top-actions">""",
            """<div class="vlc-top-actions">
                    <button id="btnVlcCcTop" class="vlc-icon-btn yt-cc-top-btn" onclick="toggleYtStyleCC(event)" title="Subtitles & Closed Captions [CC]">
                        <span class="yt-cc-pill-text">CC</span>
                    </button>"""
        )

    # H. Update Bottom Toolbar Subtitle button to 1-tap YouTube CC toggle
    html = html.replace(
        """<button id="btnVlcSubtitles" class="vlc-tool-btn" onclick="openVlcSubtitlesModal(event)" title="Subtitles & Closed Captions [CC]">""",
        """<button id="btnVlcSubtitles" class="vlc-tool-btn" onclick="toggleYtStyleCC(event)" oncontextmenu="openVlcSubtitlesModal(event); return false;" title="Subtitles & Closed Captions [CC] (Tap to toggle, hold for tracks)">"""
    )

    # I. Settings Modal: Remove border from Clear Cache button & Add About, Help, Privacy sections
    old_clear_btn = """<button class="btn-emerald-sm" style="background: #232323; border: 1px solid rgba(255,255,255,0.1); justify-content: center; width: 100%;" onclick="clearAppData()">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="#f87171"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        <span style="color: #f87171;">Clear Recents & Cache</span>
                    </button>"""
    
    new_settings_sections = """<!-- Separate Sections: About, Help, Privacy -->
                <div class="settings-nav-section" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                    <div class="setting-item-row" style="cursor: pointer; padding: 12px; background: rgba(255,255,255,0.04); border-radius: 12px;" onclick="closeSettingsModal(); openAppInfoModal('about');">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 16px;">ℹ️</span>
                            <div>
                                <div class="setting-item-title" style="margin: 0;">About T2L Cinema</div>
                                <div class="setting-item-desc" style="margin: 0;">v2.5.0 Production • Platform & System Specs</div>
                            </div>
                        </div>
                        <span style="color: #94a3b8; font-size: 16px;">›</span>
                    </div>

                    <div class="setting-item-row" style="cursor: pointer; padding: 12px; background: rgba(255,255,255,0.04); border-radius: 12px;" onclick="closeSettingsModal(); openAppInfoModal('help');">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 16px;">💡</span>
                            <div>
                                <div class="setting-item-title" style="margin: 0;">Help & Playback Guide</div>
                                <div class="setting-item-desc" style="margin: 0;">Gestures, seek shortcuts, audio & CC tips</div>
                            </div>
                        </div>
                        <span style="color: #94a3b8; font-size: 16px;">›</span>
                    </div>

                    <div class="setting-item-row" style="cursor: pointer; padding: 12px; background: rgba(255,255,255,0.04); border-radius: 12px;" onclick="closeSettingsModal(); openAppInfoModal('privacy');">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 16px;">🛡️</span>
                            <div>
                                <div class="setting-item-title" style="margin: 0;">Privacy & Security Guarantee</div>
                                <div class="setting-item-desc" style="margin: 0;">100% On-device, zero telemetry & trackers</div>
                            </div>
                        </div>
                        <span style="color: #94a3b8; font-size: 16px;">›</span>
                    </div>
                </div>

                <div class="drawer-divider"></div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Borderless Clear Recents & Cache Button as requested -->
                    <button class="btn-clear-cache-borderless" style="background: rgba(239, 68, 68, 0.12); border: none !important; outline: none !important; border-radius: 12px; padding: 13px; justify-content: center; width: 100%; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: background 0.2s;" onclick="clearAppData()">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="#f87171"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        <span style="color: #f87171; font-weight: 700; font-size: 13px;">Clear Recents & Cache</span>
                    </button>
                </div>"""
    html = html.replace(old_clear_btn, new_settings_sections)

    # J. Update Notifications Sheet to have clean dynamic container and mark all as read button
    old_notif_body = """      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="background: var(--t2l-surface-2); padding: 12px; border-radius: var(--t2l-radius-md); border: 1px solid var(--t2l-border-subtle);">
          <div style="font-size: 12px; font-weight: 700; color: var(--t2l-cyan); margin-bottom: 2px;">NEW RELEASE</div>
          <div style="font-size: 13px; font-weight: 600;">Kalki 2898 AD is now available in Hindi HD.</div>
          <div style="font-size: 11px; color: var(--t2l-text-muted); margin-top: 4px;">2 hours ago</div>
        </div>
      </div>"""
    new_notif_body = """      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; color: var(--t2l-text-muted);">Recent Releases & System Highlights</span>
        <button style="background: none; border: none; color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer;" onclick="clearAllNotifications()">Mark all read</button>
      </div>
      <div id="notificationsDynamicList" style="display: flex; flex-direction: column; gap: 10px; max-height: calc(100vh - 160px); overflow-y: auto;">
        <!-- Dynamically rendered -->
      </div>"""
    html = html.replace(old_notif_body, new_notif_body)

    # K. Add Speed Recommended Movies container in speedTestModal
    if 'id="speedRecommendedMoviesSection"' not in html:
        old_speed_action_btn = """<button id="btnRunSpeedTest" class="btn-speed-test-action" onclick="runLiveSpeedTest(true)">"""
        speed_rec_movies_markup = """<!-- Realtime Movie Recommendations Matched to Bandwidth -->
            <div id="speedRecommendedMoviesSection" style="margin-top: 14px; margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div style="font-size: 12px; font-weight: 700; color: #f1f5f9;">Recommended For Your Speed</div>
                    <span id="speedRecHeaderBadge" style="font-size: 10px; font-weight: 700; color: #10b981; background: rgba(16, 185, 129, 0.15); padding: 2px 6px; border-radius: 4px;">Zero Buffering</span>
                </div>
                <div id="speedRecommendedMoviesList" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px;">
                    <!-- Dynamically populated based on tested speed -->
                </div>
            </div>

            <button id="btnRunSpeedTest" class="btn-speed-test-action" onclick="runLiveSpeedTest(true)">"""
        html = html.replace(old_speed_action_btn, speed_rec_movies_markup)

    # L. Add #myListModal and #appInfoModal before toast
    if 'id="myListModal"' not in html:
        modals_markup = """    <!-- ==========================================================
         MY LIST (WATCHLIST) DEDICATED MODAL
         ========================================================== -->
    <div id="myListModal" class="side-drawer-backdrop" onclick="closeMyListModal()">
        <div class="my-list-modal-card" onclick="event.stopPropagation()">
            <div class="settings-header" style="margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(229, 9, 20, 0.15); display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#e50914"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div>
                        <h3 style="font-size: 17px; font-weight: 800; color: #fff; margin: 0;">My List</h3>
                        <span id="myListCountBadge" style="font-size: 11px; color: #94a3b8;">Saved Titles (0)</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button id="btnMyListClear" style="background: none; border: none; color: #ef4444; font-size: 11px; font-weight: 700; cursor: pointer; display: none;" onclick="clearMyList()">Clear All</button>
                    <button class="icon-btn-plain" onclick="closeMyListModal()" aria-label="Close My List">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="#a3a3a3"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            </div>

            <div id="myListContent" class="my-list-content-scroll">
                <!-- Dynamically rendered by renderMyListUI() -->
            </div>
        </div>
    </div>

    <!-- ==========================================================
         COMPREHENSIVE APP INFORMATION HUB MODAL (About, Help, Privacy)
         ========================================================== -->
    <div id="appInfoModal" class="side-drawer-backdrop" onclick="closeAppInfoModal()">
        <div class="app-info-modal-card" onclick="event.stopPropagation()">
            <div class="settings-header" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <svg viewBox="0 0 48 48" fill="none" style="width: 26px; height: 26px;">
                        <path d="M 9 12 H 39" stroke="url(#hdrAuroraGrad)" stroke-width="4.2" stroke-linecap="round"/>
                        <path d="M 24 12 L 13 36" stroke="url(#hdrAuroraGrad)" stroke-width="4.2" stroke-linecap="round"/>
                        <path d="M 13 36 H 37 V 26" stroke="url(#hdrAuroraGrad)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div>
                        <h3 id="appInfoModalTitle" style="font-size: 17px; font-weight: 800; color: #fff; margin: 0;">T2L Cinema</h3>
                        <span style="font-size: 11px; color: #94a3b8;">Unified Production v2.5.0</span>
                    </div>
                </div>
                <button class="icon-btn-plain" onclick="closeAppInfoModal()" aria-label="Close Info">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#a3a3a3"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            </div>

            <!-- Tab Switcher -->
            <div class="app-info-tab-bar">
                <button id="infoTabBtnAbout" class="app-info-tab active" onclick="switchAppInfoTab('about')">About</button>
                <button id="infoTabBtnHelp" class="app-info-tab" onclick="switchAppInfoTab('help')">Help & FAQs</button>
                <button id="infoTabBtnPrivacy" class="app-info-tab" onclick="switchAppInfoTab('privacy')">Privacy</button>
            </div>

            <!-- Tab 1: About App Details -->
            <div id="infoTabContentAbout" class="app-info-tab-panel active">
                <div class="info-card-block">
                    <div class="info-card-title">🎬 About T2L Cinema</div>
                    <p class="info-card-desc">T2L (Television to Live) is a next-generation high-fidelity media platform engineered for Android, TV, and high-performance Web environments. Combining cinematic film streaming, fast-zapping live TV broadcasts, and acoustic radio broadcasts.</p>
                </div>

                <div class="info-specs-grid">
                    <div class="info-spec-item">
                        <span class="info-spec-label">Version</span>
                        <span class="info-spec-val">v2.5.0 (Build 2026.09)</span>
                    </div>
                    <div class="info-spec-item">
                        <span class="info-spec-label">Architecture</span>
                        <span class="info-spec-val">Android MediaBridge + Blink</span>
                    </div>
                    <div class="info-spec-item">
                        <span class="info-spec-label">Video Engine</span>
                        <span class="info-spec-val">MSE / HLS.js + ExoPlayer</span>
                    </div>
                    <div class="info-spec-item">
                        <span class="info-spec-label">Audio Engine</span>
                        <span class="info-spec-val">5-Band Equalizer + Direct Passthrough</span>
                    </div>
                    <div class="info-spec-item">
                        <span class="info-spec-label">VOD Catalog</span>
                        <span class="info-spec-val">180+ Verified Titles (4K/1080p/720p)</span>
                    </div>
                    <div class="info-spec-item">
                        <span class="info-spec-label">Broadcast Channels</span>
                        <span class="info-spec-val">890+ Live TV & Radio Stations</span>
                    </div>
                </div>

                <div class="info-card-block" style="margin-top: 12px;">
                    <div class="info-card-title">⚡ Core Features</div>
                    <ul class="info-bullet-list">
                        <li><strong>Deterministic 24-Hour Hero Refresh:</strong> Daily featured pool with smooth 4s auto-slide.</li>
                        <li><strong>YouTube-Style Instant Closed Captions:</strong> 1-tap toggling with clean translucent caption pills.</li>
                        <li><strong>Live Bandwidth Auto-Matching:</strong> Real-time speed testing that pairs your stream buffer with network speed.</li>
                        <li><strong>Offline Downloads & Local Vault:</strong> Direct device download support and offline playback.</li>
                    </ul>
                </div>
            </div>

            <!-- Tab 2: Help & Gestures Guide -->
            <div id="infoTabContentHelp" class="app-info-tab-panel" style="display: none;">
                <div class="info-card-block">
                    <div class="info-card-title">📱 Interactive Player Gestures</div>
                    <div class="help-gesture-grid">
                        <div class="help-gesture-item">
                            <span class="help-gesture-icon">⏩</span>
                            <div>
                                <strong>Double Tap Right</strong>
                                <p>Quickly seeks forward by 10 seconds with haptic visual ripple.</p>
                            </div>
                        </div>
                        <div class="help-gesture-item">
                            <span class="help-gesture-icon">⏪</span>
                            <div>
                                <strong>Double Tap Left</strong>
                                <p>Quickly seeks backward by 10 seconds.</p>
                            </div>
                        </div>
                        <div class="help-gesture-item">
                            <span class="help-gesture-icon">🔆</span>
                            <div>
                                <strong>Vertical Swipe (Left Side)</strong>
                                <p>Smoothly adjust screen brightness from 10% to 100%.</p>
                            </div>
                        </div>
                        <div class="help-gesture-item">
                            <span class="help-gesture-icon">🔊</span>
                            <div>
                                <strong>Vertical Swipe (Right Side)</strong>
                                <p>Control playback volume with high-precision decibel steps.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-card-block" style="margin-top: 12px;">
                    <div class="info-card-title">💬 Audio & Subtitles FAQ</div>
                    <p class="info-card-desc"><strong>How to toggle Subtitles:</strong> Simply tap the <code>[CC]</code> button on the top right or bottom toolbar. Captions will automatically show. Long press the button or open the menu to choose alternative language tracks.</p>
                    <p class="info-card-desc" style="margin-top: 6px;"><strong>Changing Aspect Ratio:</strong> Tap the aspect button in the toolbar to cycle between 16:9 Fit, Fill Screen (Crop), 100% Original, and Stretch.</p>
                </div>
            </div>

            <!-- Tab 3: Privacy & Security Guarantee -->
            <div id="infoTabContentPrivacy" class="app-info-tab-panel" style="display: none;">
                <div class="info-card-block">
                    <div class="info-card-title">🔒 100% Local-First Privacy</div>
                    <p class="info-card-desc">Your privacy is fundamental to T2L. This application operates entirely offline-first with zero tracking:</p>
                    <ul class="info-bullet-list" style="margin-top: 8px;">
                        <li><strong>Zero Analytics or Trackers:</strong> No Google Analytics, no Facebook SDK, no advertising beacons.</li>
                        <li><strong>On-Device Local Storage:</strong> Watch history, continue watching bookmarks, and watchlist remain exclusively stored in your local browser sandbox.</li>
                        <li><strong>No Account Required:</strong> Free, instant streaming without signing up, entering email addresses, or sharing personal data.</li>
                        <li><strong>1-Tap Instant Wipe:</strong> You can purge all cached data and watch history at any time using the Clear Cache button in Settings.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
"""
        html = html.replace('<!-- Toast Notification -->', modals_markup + '\n    <!-- Toast Notification -->')

    with open(p, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Updated {p} successfully.")

