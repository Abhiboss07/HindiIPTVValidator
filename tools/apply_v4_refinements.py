import re
import os

ROOT_DIR = "/home/abhiboss/Projects/HindiIPTVValidator"
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")
ANDROID_INDEX_PATH = os.path.join(ROOT_DIR, "android_app/src/main/assets/index.html")
STYLES_PATH = os.path.join(ROOT_DIR, "assets/styles.css")
ANDROID_STYLES_PATH = os.path.join(ROOT_DIR, "android_app/src/main/assets/assets/styles.css")
APP_JS_PATH = os.path.join(ROOT_DIR, "assets/app.js")
ANDROID_APP_JS_PATH = os.path.join(ROOT_DIR, "android_app/src/main/assets/assets/app.js")

# ==============================================================================
# 1. UPDATE index.html
# ==============================================================================
print("Updating index.html...")
with open(INDEX_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Ookla gauge SVG inside index.html
old_gauge_pattern = re.compile(r'<!-- Ookla-Style Speedometer Arc Dial -->.*?<!-- Central Digital Readout \(Ookla Style\) -->.*?</div>\s*</div>', re.DOTALL)

new_gauge_html = '''<!-- Ookla-Style Speedometer Arc Dial -->
            <div class="ookla-gauge-wrapper">
                <svg class="ookla-gauge-svg" viewBox="0 0 280 210">
                    <defs>
                        <linearGradient id="ooklaArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00F2FE" />
                            <stop offset="60%" stop-color="#38BDF8" />
                            <stop offset="100%" stop-color="#10B981" />
                        </linearGradient>
                        <filter id="ooklaGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <!-- Background Track Arc (240 deg, r=85, center=(140, 148)) -->
                    <path class="ookla-track-arc" d="M 66.4 190.5 A 85 85 0 1 1 213.6 190.5" />

                    <!-- Active Glowing Progress Arc -->
                    <path id="ooklaProgressArc" class="ookla-progress-arc" d="M 66.4 190.5 A 85 85 0 1 1 213.6 190.5" />

                    <!-- Minor & Major Dial Tick Marks on the Arc -->
                    <g class="ookla-ticks" stroke="rgba(255, 255, 255, 0.28)" stroke-width="2" stroke-linecap="round">
                        <line x1="69.9" y1="188.5" x2="63.0" y2="192.5" />
                        <line x1="60.2" y1="133.9" x2="52.4" y2="132.5" />
                        <line x1="87.9" y1="86.0" x2="82.8" y2="79.8" />
                        <line x1="140.0" y1="67.0" x2="140.0" y2="59.0" stroke="#38BDF8" stroke-width="2.5" />
                        <line x1="192.1" y1="86.0" x2="197.2" y2="79.8" />
                        <line x1="219.8" y1="133.9" x2="227.6" y2="132.5" />
                        <line x1="210.1" y1="188.5" x2="217.0" y2="192.5" />
                    </g>

                    <!-- Scale Tick Numbers — Positioned precisely at the UPPER / OUTER side of the arc -->
                    <text x="46" y="204" class="ookla-tick-lbl" text-anchor="middle">0</text>
                    <text x="34" y="130" class="ookla-tick-lbl" text-anchor="middle">5</text>
                    <text x="70" y="66" class="ookla-tick-lbl" text-anchor="middle">15</text>
                    <text x="140" y="44" class="ookla-tick-lbl" text-anchor="middle">30</text>
                    <text x="210" y="66" class="ookla-tick-lbl" text-anchor="middle">50</text>
                    <text x="246" y="130" class="ookla-tick-lbl" text-anchor="middle">100</text>
                    <text x="234" y="204" class="ookla-tick-lbl" text-anchor="middle">250+</text>

                    <!-- Speedometer Needle Pointer -->
                    <g id="ooklaNeedleGroup" transform="translate(140, 148) rotate(-120)">
                        <path d="M -3 0 L 0 -76 L 3 0 Z" fill="#38BDF8" filter="url(#ooklaGlow)" />
                        <circle cx="0" cy="0" r="8" fill="#141720" stroke="#38BDF8" stroke-width="2.5" />
                        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
                    </g>
                </svg>

                <!-- Central Digital Readout (Ookla Style) -->
                <div class="ookla-readout-center">
                    <span id="speedMeterVal" class="ookla-digits">0.0</span>
                    <span class="ookla-unit-text">Mbps</span>
                    <span class="ookla-sub-text">↓ DOWNLOAD</span>
                </div>
            </div>'''

if old_gauge_pattern.search(content):
    content = old_gauge_pattern.sub(new_gauge_html, content)
    print("✓ Replaced Ookla Speedometer SVG in index.html")
else:
    print("⚠️ Could not match old Ookla Speedometer SVG pattern")

# Replace Subtitle Modal in index.html to show CC and Movie-Provided Subtitles cleanly
old_subs_modal = re.compile(r'<!-- 1\. Dedicated Subtitles & Closed Captions Dialog -->.*?<div id="vlcSubtitlesModal".*?<!-- Subtitle Sync Offset -->', re.DOTALL)

new_subs_modal = '''<!-- 1. Dedicated Subtitles & Closed Captions Dialog -->
        <div id="vlcSubtitlesModal" class="vlc-dialog-backdrop" onclick="closeVlcSubtitlesModal()" style="display: none;">
            <div class="vlc-dialog-card" onclick="event.stopPropagation()">
                <div class="vlc-dialog-title">Subtitles & Captions</div>
                
                <!-- Universal Closed Captions (CC) Section -->
                <div class="vlc-dialog-section">
                    <label class="vlc-dialog-label">💬 Closed Captions (CC)</label>
                    <div id="vlcSubtitleTracksList" class="vlc-chips-row" style="max-height: 120px; overflow-y: auto;">
                        <button class="vlc-chip-btn active" onclick="setVlcSubtitleTrack('off', this)">Off</button>
                        <button class="vlc-chip-btn" onclick="setVlcSubtitleTrack('cc:hi', this)">🇮🇳 Hindi (CC)</button>
                        <button class="vlc-chip-btn" onclick="setVlcSubtitleTrack('cc:en', this)">🌐 English (CC)</button>
                    </div>
                </div>

                <!-- Movie-Provided Subtitles Section (Shown when active movie has provided subtitles) -->
                <div id="vlcMovieProvidedSubsSection" class="vlc-dialog-section" style="margin-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 8px;">
                    <label class="vlc-dialog-label">🎬 Movie Subtitles (Provided with Movie)</label>
                    <div id="vlcMovieSubtitleTracksList" class="vlc-chips-row" style="max-height: 100px; overflow-y: auto;">
                        <div class="vlc-empty-tracks-msg">No extra movie-provided tracks. Use CC above.</div>
                    </div>
                </div>

                <!-- Subtitle Sync Offset -->'''

if old_subs_modal.search(content):
    content = old_subs_modal.sub(new_subs_modal, content)
    print("✓ Updated Subtitle Modal structure in index.html")
else:
    print("⚠️ Could not match old Subtitle Modal pattern")

with open(INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(content)
with open(ANDROID_INDEX_PATH, "w", encoding="utf-8") as f:
    f.write(content)
print("✓ Saved index.html and synced to Android assets")

