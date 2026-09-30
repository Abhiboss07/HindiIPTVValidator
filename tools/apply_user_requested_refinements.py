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

def update_index_html():
    print("Updating index.html...")
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Rename "Audio Track & DSP" -> "Audio Tracks" in menu
    content = content.replace(
        '<span>Audio Track & DSP</span>',
        '<span>Audio Tracks</span>'
    )

    # 2. In vlcAudioModal: Title -> "Audio Tracks", label -> "🎧 Audio Languages"
    content = content.replace(
        '<div class="vlc-dialog-title">Audio Tracks & Channels</div>',
        '<div class="vlc-dialog-title">Audio Tracks</div>'
    )
    content = content.replace(
        '<label class="vlc-dialog-label">🎧 Audio Languages & Streams</label>',
        '<label class="vlc-dialog-label">🎧 Audio Languages</label>'
    )

    # 3. Simplify Stream Quality & Data Speed live speed section in index.html
    old_speed_section = r'<!-- Network Speed Live Monitor -->\s*<div class="vlc-dialog-section" style="background: rgba\(255, 255, 255, 0\.04\); border-radius: 12px; padding: 12px;">.*?</div>\s*</div>'
    new_speed_section = """<!-- Network Speed Live Monitor -->
                <div class="vlc-dialog-section" style="background: rgba(255, 255, 255, 0.04); border-radius: 10px; padding: 10px 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 12px; color: #94a3b8; font-weight: 600;">📡 Network Speed</span>
                        <span id="vlcLiveNetworkSpeed" style="font-family: var(--font-mono); color: #10B981; font-size: 13px; font-weight: 700;">Live ~ 8.4 Mbps</span>
                    </div>
                </div>"""
    content = re.sub(old_speed_section, new_speed_section, content, flags=re.DOTALL)

    # 4. Equalizer Modal: update to visual bands container
    old_eq_modal = r'<!-- Equalizer Dialog -->.*?<div id="vlcEqModal".*?<button class="vlc-dialog-btn-primary" onclick="closeVlcEqModal\(\)">Done</button>\s*</div>\s*</div>'
    new_eq_modal = """<!-- Equalizer Dialog -->
        <div id="vlcEqModal" class="vlc-dialog-backdrop" onclick="closeVlcEqModal()" style="display: none;">
            <div class="vlc-dialog-card" onclick="event.stopPropagation()">
                <div class="vlc-dialog-title">Audio Equalizer</div>
                <div class="vlc-chips-row" style="margin-bottom: 16px;">
                    <button class="vlc-chip-btn active" onclick="setVlcEqualizerPreset('Flat')">Flat</button>
                    <button class="vlc-chip-btn" onclick="setVlcEqualizerPreset('Rock')">Rock</button>
                    <button class="vlc-chip-btn" onclick="setVlcEqualizerPreset('Pop')">Pop</button>
                    <button class="vlc-chip-btn" onclick="setVlcEqualizerPreset('Bass Boost')">Bass Boost</button>
                    <button class="vlc-chip-btn" onclick="setVlcEqualizerPreset('Vocals')">Vocals</button>
                    <button class="vlc-chip-btn" onclick="setVlcEqualizerPreset('Cinema')">Cinema</button>
                </div>
                <div id="vlcEqBandsContainer" class="vlc-eq-visualizer"></div>
                <button class="vlc-dialog-btn-primary" onclick="closeVlcEqModal()" style="margin-top: 14px;">Done</button>
            </div>
        </div>"""
    content = re.sub(old_eq_modal, new_eq_modal, content, flags=re.DOTALL)

    with open(INDEX_HTML, "w", encoding="utf-8") as f:
        f.write(content)
    print("index.html updated.")

def update_styles_css():
    print("Updating styles.css...")
    with open(STYLES_CSS, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Hero backdrop & content transition for buttery smooth sliding
    hero_transition_css = """
/* ==========================================================
   SMOOTH HERO CAROUSEL ANIMATIONS
   ========================================================== */
.hero-backdrop-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  z-index: 1;
  transition: opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), transform 850ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.hero-content {
  position: relative;
  z-index: 3;
  transition: opacity 350ms cubic-bezier(0.16, 1, 0.3, 1), transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

/* ==========================================================
   OPTIMIZED THUMBNAILS FOR BIGGER BOXES
   ========================================================== */
.continue-backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  image-rendering: -webkit-optimize-contrast;
  transition: transform 0.3s ease;
}

.theatrical-horizon-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  image-rendering: -webkit-optimize-contrast;
}

.movie-card-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  image-rendering: -webkit-optimize-contrast;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ==========================================================
   DYNAMIC EQUALIZER VISUALIZER
   ========================================================== */
.vlc-eq-visualizer {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 130px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 12px;
  padding: 12px 10px 10px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.vlc-eq-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
  justify-content: flex-end;
}

.vlc-eq-bar-track {
  width: 14px;
  height: 72px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.vlc-eq-bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #22D3EE 0%, #10B981 100%);
  border-radius: 9999px;
  transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.vlc-eq-db-label {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  color: #10B981;
  font-weight: 700;
}

.vlc-eq-freq-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}
"""
    if "/* SMOOTH HERO CAROUSEL ANIMATIONS */" not in content and "SMOOTH HERO CAROUSEL ANIMATIONS" not in content:
        content += "\n" + hero_transition_css

    with open(STYLES_CSS, "w", encoding="utf-8") as f:
        f.write(content)
    print("styles.css updated.")

def update_app_js():
    print("Updating app.js...")
    with open(APP_JS, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Movie details modal button: remove (1080p HD) and show only STREAM DIRECT
    content = re.sub(
        r"let qLabel = 'DIRECT';.*?btnStreamText\.textContent = `STREAM \$\{qLabel\}`;",
        "btnStreamText.textContent = 'STREAM DIRECT';",
        content,
        flags=re.DOTALL
    )

    # 2. Hero slider animation: add smooth crossfade in updateHeroUI
    old_hero_ui_transition = r"if \(backdropEl\) \{\s*backdropEl\.style\.opacity = '0\.35';.*?backdropEl\.src = item\.backdropUrl \|\| item\.posterUrl \|\| 'assets/placeholder\.png';\s*backdropEl\.style\.opacity = '1';\s*\};\s*img\.src = item\.backdropUrl \|\| item\.posterUrl \|\| 'assets/placeholder\.png';\s*\}"
    new_hero_ui_transition = """const heroContent = document.querySelector(isHome ? '#homeHeroSection .hero-content' : '#cinemaHeroSection .hero-content');
    if (heroContent) {
      heroContent.style.opacity = '0.35';
      heroContent.style.transform = 'translateY(4px)';
    }

    if (backdropEl) {
      backdropEl.style.opacity = '0.2';
      backdropEl.style.transform = 'scale(1.025)';
      const nextSrc = item.backdropUrl || item.posterUrl || 'assets/placeholder.png';
      const img = new Image();
      img.onload = () => {
        backdropEl.src = nextSrc;
        backdropEl.style.opacity = '1';
        backdropEl.style.transform = 'scale(1)';
        if (heroContent) {
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateY(0)';
        }
      };
      img.onerror = () => {
        backdropEl.src = 'assets/placeholder.png';
        backdropEl.style.opacity = '1';
        backdropEl.style.transform = 'scale(1)';
        if (heroContent) {
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateY(0)';
        }
      };
      img.src = nextSrc;
    }"""
    content = re.sub(old_hero_ui_transition, new_hero_ui_transition, content, flags=re.DOTALL)

    # 3. Audio Tracks Modal: Show ONLY language options, remove (Fixed) and remove passthrough
    old_audio_modal_logic = r"window\.openVlcAudioModal = function\(e\) \{.*?modal\.style\.display = 'flex';\s*\};"
    new_audio_modal_logic = """window.openVlcAudioModal = function(e) {
  if (e) e.stopPropagation();
  closeVlcMoreMenu();
  const modal = document.getElementById('vlcAudioModal');
  if (!modal) return;

  const tracksList = document.getElementById('vlcAudioTracksList');
  if (tracksList) {
    let html = '';
    const movie = (typeof currentPlayingChannel !== 'undefined' && currentPlayingChannel && currentPlayingChannel.movieData) || (typeof currentSelectedMovie !== 'undefined' ? currentSelectedMovie : null);
    const audioData = getAvailableAudioTracks(movie, window.currentPlayingEpisodeId);

    if (audioData.type === 'HLS') {
      audioData.tracks.forEach(track => {
        const langName = track.name || track.lang || 'Master';
        const icon = (track.lang && (track.lang.toLowerCase() === 'hi' || track.lang.toLowerCase() === 'hin')) ? '🇮🇳' : '🌐';
        html += `
          <div class="vlc-radio-row ${track.isCurrent ? 'active' : ''}" onclick="setVlcHlsAudioTrack(${track.index}, this)">
            <span>${icon} ${langName}</span>
          </div>
        `;
      });
    } else if (audioData.type === 'URL_SWITCH') {
      audioData.tracks.forEach(track => {
        const icon = track.lang === 'Hindi' ? '🇮🇳' : (track.lang === 'English' ? '🌐' : (track.lang === 'Korean' ? '🎧' : '🎵'));
        html += `
          <div class="vlc-radio-row ${track.isCurrent ? 'active' : ''}" onclick="switchMovieAudioStream('${track.lang}', this)">
            <span>${icon} ${track.lang}</span>
          </div>
        `;
      });
    } else if (audioData.type === 'CONTAINER_TRACKS') {
      audioData.tracks.forEach(track => {
        const icon = track.lang === 'Hindi' ? '🇮🇳' : (track.lang === 'English' ? '🌐' : '🎧');
        html += `
          <div class="vlc-radio-row ${track.isCurrent ? 'active' : ''}" onclick="setVlcContainerAudioTrack('${track.lang}', ${track.index}, this)">
            <span>${icon} ${track.lang}</span>
          </div>
        `;
      });
    } else {
      const primaryLang = (audioData.tracks && audioData.tracks[0]) ? audioData.tracks[0].name : ((movie && movie.defaultLanguage) || 'English');
      const icon = primaryLang === 'Hindi' ? '🇮🇳' : '🌐';
      html += `
        <div class="vlc-radio-row active" onclick="setVlcAudioTrack('master', this)">
          <span>${icon} ${primaryLang}</span>
        </div>
      `;
    }

    tracksList.innerHTML = html;
  }

  modal.style.display = 'flex';
};"""
    content = re.sub(old_audio_modal_logic, new_audio_modal_logic, content, flags=re.DOTALL)

    # 4. Stream Quality Modal: Compact and clean with no giant paragraphs
    old_quality_modal_logic = r"window\.openVlcQualityModal = function\(e\) \{.*?modal\.style\.display = 'flex';\s*\};"
    new_quality_modal_logic = """window.openVlcQualityModal = function(e) {
  if (e) e.stopPropagation();
  closeVlcMoreMenu();
  updateLiveNetworkSpeedDisplay();

  const optionsList = document.getElementById('vlcQualityOptionsList');
  if (optionsList) {
    let optionsHtml = '';

    if (hlsInstance && hlsInstance.levels && hlsInstance.levels.length > 0) {
      const isAuto = (currentVlcQuality === 'auto' || hlsInstance.currentLevel === -1);
      optionsHtml += `
        <div class="vlc-radio-row ${isAuto ? 'active' : ''}" onclick="setVlcStreamQuality('auto', this, -1)">
          <div class="vlc-radio-circle"></div>
          <div class="vlc-radio-text">
            <h4>⚡ Auto (Best Quality)</h4>
          </div>
        </div>
      `;

      const sortedLevels = hlsInstance.levels.map((lvl, idx) => ({ lvl, origIdx: idx }))
        .sort((a, b) => (b.lvl.height || 0) - (a.lvl.height || 0));

      sortedLevels.forEach(item => {
        const h = item.lvl.height || 720;
        const w = item.lvl.width || 0;
        let name = `${h}p HD`;
        let qKey = `${h}p`;
        if (h >= 2160 || w >= 3840) {
          qKey = '4k';
          name = '🌟 4K UHD (2160p)';
        } else if (h >= 1440 || w >= 2560) {
          qKey = '1440p';
          name = '💎 2K Quad HD (1440p)';
        } else if (h >= 1080 || w >= 1920) {
          qKey = '1080p';
          name = '📺 Full HD (1080p)';
        } else if (h >= 720 || w >= 1280) {
          qKey = '720p';
          name = '📱 HD (720p)';
        } else {
          qKey = '480p';
          name = '🔋 Data Saver (480p)';
        }

        const isActive = !isAuto && (hlsInstance.currentLevel === item.origIdx);
        optionsHtml += `
          <div class="vlc-radio-row ${isActive ? 'active' : ''}" onclick="setVlcStreamQuality('${qKey}', this, ${item.origIdx})">
            <div class="vlc-radio-circle"></div>
            <div class="vlc-radio-text">
              <h4>${name}</h4>
            </div>
          </div>
        `;
      });
    } else {
      const vid = document.getElementById('luminaVideo');
      const curW = (vid && vid.videoWidth) ? vid.videoWidth : 0;
      const curH = (vid && vid.videoHeight) ? vid.videoHeight : 0;
      let nativeBadge = 'Full HD (1080p)';
      if (curH >= 2160 || curW >= 3840) nativeBadge = '4K UHD (2160p)';
      else if (curH >= 1440 || curW >= 2560) nativeBadge = '2K Quad HD (1440p)';
      else if (curH >= 1080 || curW >= 1920) nativeBadge = 'Full HD (1080p)';
      else if (curH >= 720 || curW >= 1280) nativeBadge = 'HD (720p)';

      optionsHtml += `
        <div class="vlc-radio-row active" onclick="setVlcStreamQuality('auto', this)">
          <div class="vlc-radio-circle"></div>
          <div class="vlc-radio-text">
            <h4>🌟 ${nativeBadge}</h4>
          </div>
        </div>
      `;
    }

    optionsList.innerHTML = optionsHtml;
  }

  const modal = document.getElementById('vlcQualityModal');
  if (modal) modal.style.display = 'flex';
};"""
    content = re.sub(old_quality_modal_logic, new_quality_modal_logic, content, flags=re.DOTALL)

    # 5. Equalizer Presets Visualizer
    eq_code = """
const EQUALIZER_PRESETS = {
  'Flat':       { gains: [0, 0, 0, 0, 0], heights: [50, 50, 50, 50, 50] },
  'Rock':       { gains: [+5, +3, -1, +3, +6], heights: [75, 65, 45, 65, 80] },
  'Pop':        { gains: [-1, +2, +5, +3, -2], heights: [45, 60, 75, 65, 40] },
  'Bass Boost': { gains: [+8, +5, +1, 0, -1], heights: [90, 75, 55, 50, 45] },
  'Vocals':     { gains: [-2, +1, +6, +4, +1], heights: [40, 55, 80, 70, 55] },
  'Cinema':     { gains: [+6, +2, +1, +4, +5], heights: [80, 60, 55, 70, 75] }
};

window.renderEqualizerVisualizer = function(presetName) {
  const container = document.getElementById('vlcEqBandsContainer');
  if (!container) return;
  const preset = EQUALIZER_PRESETS[presetName] || EQUALIZER_PRESETS['Flat'];
  const bands = ['60Hz', '230Hz', '910Hz', '4kHz', '14kHz'];

  container.innerHTML = bands.map((band, idx) => {
    const gain = preset.gains[idx];
    const gainStr = gain > 0 ? `+${gain}dB` : `${gain}dB`;
    const h = preset.heights[idx];
    return `
      <div class="vlc-eq-col">
        <span class="vlc-eq-db-label">${gainStr}</span>
        <div class="vlc-eq-bar-track">
          <div class="vlc-eq-bar-fill" style="height: ${h}%;"></div>
        </div>
        <span class="vlc-eq-freq-label">${band}</span>
      </div>
    `;
  }).join('');
};

window.openVlcEqModal = function() {
  closeVlcMoreMenu();
  const modal = document.getElementById('vlcEqModal');
  if (modal) modal.style.display = 'flex';
  const currentPreset = document.getElementById('vlcEqSubtitle')?.textContent?.trim() || 'Flat';
  renderEqualizerVisualizer(currentPreset);
};

window.setVlcEqualizerPreset = function(name) {
  const badge = document.getElementById('vlcEqSubtitle');
  if (badge) badge.textContent = name;
  const chips = document.querySelectorAll('#vlcEqModal .vlc-chip-btn');
  chips.forEach(c => {
    c.classList.toggle('active', c.textContent.trim() === name);
  });
  renderEqualizerVisualizer(name);
  showToast('Equalizer: ' + name);
};
"""
    # Replace openVlcEqModal and setVlcEqualizerPreset
    content = re.sub(
        r"window\.openVlcEqModal\s*=\s*function\(\)\s*\{.*?window\.setVlcEqualizerPreset\s*=\s*function\(name\)\s*\{.*?showToast\('Equalizer: ' \+ name\);\s*\};",
        eq_code.strip(),
        content,
        flags=re.DOTALL
    )

    # 6. Rock-solid Subtitle parser & active track highlight fix
    # In populateVlcSubtitleTracks: check t.mode === 'showing' || t.mode === 'hidden'
    content = content.replace(
        "active: (t.mode === 'showing')",
        "active: (t.mode === 'showing' || t.mode === 'hidden')"
    )

    # Update setVlcSubtitleTrack to parse VTT cues directly into in-memory store so it never turns off
    vtt_parser_patch = """
let currentParsedVttCues = [];

async function loadAndParseVttFile(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const cues = [];
    const lines = text.split(/\\r?\\n/);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (line.includes('-->')) {
        const parts = line.split('-->');
        const parseTime = (tStr) => {
          const p = tStr.trim().split(' ')[0].split(':');
          if (p.length === 3) return parseFloat(p[0]) * 3600 + parseFloat(p[1]) * 60 + parseFloat(p[2]);
          if (p.length === 2) return parseFloat(p[0]) * 60 + parseFloat(p[1]);
          return 0;
        };
        const start = parseTime(parts[0]);
        const end = parseTime(parts[1]);
        let cueText = '';
        i++;
        while (i < lines.length && lines[i].trim() !== '') {
          cueText += (cueText ? '\\n' : '') + lines[i].trim();
          i++;
        }
        if (cueText) cues.push({ start, end, text: cueText.replace(/<[^>]+>/g, '') });
      }
      i++;
    }
    return cues;
  } catch (e) {
    return [];
  }
}
"""
    if "loadAndParseVttFile" not in content:
      content = vtt_parser_patch + "\n" + content

    # Hook loadAndParseVttFile into setVlcSubtitleTrack
    content = re.sub(
        r"else if \(source === 'native' && videoElement && videoElement\.textTracks\) \{.*?showToast\(`Subtitles: \$\{selectedLabel\} \[CC\]`\);",
        """else if (source === 'native' && videoElement) {
    const tracks = videoElement.querySelectorAll('track');
    const targetTrack = tracks[idx];
    if (targetTrack && targetTrack.src) {
      loadAndParseVttFile(targetTrack.src).then(cues => {
        currentParsedVttCues = cues;
      });
    }
    if (videoElement.textTracks) {
      for (let i = 0; i < videoElement.textTracks.length; i++) {
        if (i === idx) {
          videoElement.textTracks[i].mode = 'hidden';
          selectedLabel = videoElement.textTracks[i].label || videoElement.textTracks[i].language || selectedLabel;
        } else {
          videoElement.textTracks[i].mode = 'disabled';
        }
      }
    }
  }

  updateCCUI();
  updateActiveCueText();
  showToast(`Subtitles: ${selectedLabel} [CC]`);""",
        content,
        flags=re.DOTALL
    )

    # In updateActiveCueText: check currentParsedVttCues as authoritative primary
    content = re.sub(
        r"function updateActiveCueText\(\)\s*\{.*?if \(activeText && activeText\.trim\(\)\) \{",
        """function updateActiveCueText() {
  const videoElement = document.getElementById('luminaVideo');
  const ccBox = document.getElementById('playerCcBox');
  const ccText = document.getElementById('playerCcText');
  if (!videoElement || !isCCEnabled) {
    if (ccBox) ccBox.style.display = 'none';
    return;
  }
  let activeText = '';

  // 1. Direct in-memory parsed VTT cues (Bulletproof against CORS and WebView limitations)
  if (currentParsedVttCues && currentParsedVttCues.length > 0) {
    const cur = videoElement.currentTime;
    const match = currentParsedVttCues.find(c => cur >= c.start && cur <= c.end);
    if (match) activeText = match.text;
  }

  // 2. Fallback to native textTracks if in-memory empty
  if (!activeText && videoElement.textTracks) {
    for (let i = 0; i < videoElement.textTracks.length; i++) {
      const track = videoElement.textTracks[i];
      if ((track.mode === 'showing' || track.mode === 'hidden') && track.activeCues && track.activeCues.length > 0) {
        activeText = Array.from(track.activeCues).map(c => c.text).join('\\n');
        break;
      }
    }
  }

  if (activeText && activeText.trim()) {""",
        content,
        flags=re.DOTALL
    )

    with open(APP_JS, "w", encoding="utf-8") as f:
        f.write(content)
    print("app.js updated.")

def sync():
    print("Syncing assets to android_app...")
    shutil.copyfile(INDEX_HTML, ANDROID_INDEX_HTML)
    shutil.copyfile(STYLES_CSS, os.path.join(ANDROID_ASSETS_DIR, "styles.css"))
    shutil.copyfile(APP_JS, os.path.join(ANDROID_ASSETS_DIR, "app.js"))
    print("Sync complete.")

if __name__ == "__main__":
    update_index_html()
    update_styles_css()
    update_app_js()
    sync()
