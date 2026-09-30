import re

INDEX_PATHS = ['index.html', 'android_app/src/main/assets/index.html']
STYLES_PATHS = ['assets/styles.css', 'android_app/src/main/assets/assets/styles.css']
APP_JS_PATHS = ['assets/app.js', 'android_app/src/main/assets/assets/app.js']

print("Starting Refinements V3...")

# ==============================================================================
# 1. UPDATE INDEX.HTML
# ==============================================================================
for p in INDEX_PATHS:
    with open(p, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1A. REMOVE the new CC button (btnVlcCcTop) from video player top actions
    cc_top_pattern = r'\s*<button id="btnVlcCcTop"[\s\S]*?</button>'
    html = re.sub(cc_top_pattern, '', html)

    # 1B. Restore btnVlcSubtitles to standard onclick="openVlcSubtitlesModal(event)"
    html = html.replace(
        """<button id="btnVlcSubtitles" class="vlc-tool-btn" onclick="toggleYtStyleCC(event)" oncontextmenu="openVlcSubtitlesModal(event); return false;" title="Subtitles & Closed Captions [CC] (Tap to toggle, hold for tracks)">""",
        """<button id="btnVlcSubtitles" class="vlc-tool-btn" onclick="openVlcSubtitlesModal(event)" title="Subtitles & Closed Captions [CC]">"""
    )

    # 1C. REDESIGN ABOUT SECTION (NO HORIZONTAL SCROLLING, FULLY VISIBLE ROWS)
    old_about_tab = """            <!-- Tab 1: About App Details -->
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
            </div>"""

    new_about_tab = """            <!-- Tab 1: About App Details (Redesigned: 100% visible, zero horizontal scroll) -->
            <div id="infoTabContentAbout" class="app-info-tab-panel active">
                <div class="info-card-block">
                    <div class="info-card-title">🎬 About T2L Cinema</div>
                    <p class="info-card-desc">T2L (Television to Live) is a unified, high-performance media platform built for Android, TV, and modern web environments. It seamlessly bridges on-demand cinema, high-bitrate live television, and acoustic radio streaming.</p>
                </div>

                <!-- Vertical Full-Width Specifications List -->
                <div class="info-specs-list">
                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">🏷️</span>
                            <span class="info-spec-label">App Version</span>
                        </div>
                        <span class="info-spec-val">v2.5.0 Production</span>
                    </div>

                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">⚡</span>
                            <span class="info-spec-label">Architecture</span>
                        </div>
                        <span class="info-spec-val">MediaBridge + Chromium</span>
                    </div>

                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">🎬</span>
                            <span class="info-spec-label">Video Engine</span>
                        </div>
                        <span class="info-spec-val">HLS.js MSE & ExoPlayer</span>
                    </div>

                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">🔊</span>
                            <span class="info-spec-label">Audio Pipeline</span>
                        </div>
                        <span class="info-spec-val">5-Band Equalizer DSP</span>
                    </div>

                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">🎞️</span>
                            <span class="info-spec-label">VOD Catalog</span>
                        </div>
                        <span class="info-spec-val">180+ Verified Titles</span>
                    </div>

                    <div class="info-spec-row">
                        <div class="info-spec-row-left">
                            <span class="info-spec-icon">📡</span>
                            <span class="info-spec-label">Live Broadcast</span>
                        </div>
                        <span class="info-spec-val">890+ Fast Channels</span>
                    </div>
                </div>

                <div class="info-card-block" style="margin-top: 12px;">
                    <div class="info-card-title">⚡ Platform Highlights</div>
                    <ul class="info-bullet-list">
                        <li><strong>Deterministic Hero Carousel:</strong> Curated 24h stability with smooth 4s cinematic auto-slide.</li>
                        <li><strong>Bandwidth Matching:</strong> Ookla-style active speedometer pairing streams with zero lag.</li>
                        <li><strong>Personal Watchlist:</strong> Offline-first My List bookmarks with 1-tap playback.</li>
                        <li><strong>Local Vault:</strong> Direct device download support and offline local media playback.</li>
                    </ul>
                </div>
            </div>"""

    if old_about_tab in html:
        html = html.replace(old_about_tab, new_about_tab)
        print(f"Redesigned About section in {p}")

    # 1D. REPLACE SPEED TEST METER CIRCLE WITH OOKLA-STYLE SPEEDOMETER GAUGE
    old_speed_meter = """            <div class="speed-meter-container">
                <div id="speedGaugeCircle" class="speed-gauge-circle">
                    <span id="speedMeterVal" class="speed-gauge-val">--</span>
                    <span class="speed-gauge-unit">MBPS DOWNLOAD</span>
                </div>
            </div>"""

    new_speed_meter = """            <!-- Ookla-Style Speedometer Arc Dial -->
            <div class="ookla-gauge-wrapper">
                <svg class="ookla-gauge-svg" viewBox="0 0 280 180">
                    <defs>
                        <linearGradient id="ooklaArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00F2FE" />
                            <stop offset="60%" stop-color="#38BDF8" />
                            <stop offset="100%" stop-color="#10B981" />
                        </linearGradient>
                        <filter id="ooklaGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <!-- Background Track Arc (240 deg) -->
                    <path class="ookla-track-arc" d="M 50 148 A 95 95 0 1 1 230 148" />

                    <!-- Active Glowing Progress Arc -->
                    <path id="ooklaProgressArc" class="ookla-progress-arc" d="M 50 148 A 95 95 0 1 1 230 148" />

                    <!-- Scale Tick Numbers -->
                    <text x="44" y="166" class="ookla-tick-lbl">0</text>
                    <text x="48" y="92" class="ookla-tick-lbl">5</text>
                    <text x="88" y="44" class="ookla-tick-lbl">15</text>
                    <text x="140" y="28" class="ookla-tick-lbl" text-anchor="middle">30</text>
                    <text x="192" y="44" class="ookla-tick-lbl">50</text>
                    <text x="232" y="92" class="ookla-tick-lbl">100</text>
                    <text x="236" y="166" class="ookla-tick-lbl">250+</text>

                    <!-- Speedometer Needle Pointer -->
                    <g id="ooklaNeedleGroup" transform="translate(140, 148) rotate(-120)">
                        <path d="M -3 0 L 0 -88 L 3 0 Z" fill="#38BDF8" filter="url(#ooklaGlow)" />
                        <circle cx="0" cy="0" r="10" fill="#141720" stroke="#38BDF8" stroke-width="3" />
                        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
                    </g>
                </svg>

                <!-- Central Digital Readout (Ookla Style) -->
                <div class="ookla-readout-center">
                    <span id="speedMeterVal" class="ookla-digits">0.0</span>
                    <span class="ookla-unit-text">Mbps</span>
                    <span class="ookla-sub-text">↓ DOWNLOAD</span>
                </div>
            </div>"""

    if old_speed_meter in html:
        html = html.replace(old_speed_meter, new_speed_meter)
        print(f"Replaced Speed Test Meter with Ookla Gauge in {p}")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Saved {p}")

