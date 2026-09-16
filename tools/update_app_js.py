import json
import re

# 1. Read calibrated catalog
with open("data/movies_catalog.json", "r", encoding="utf-8") as f:
    cat = json.load(f)

movies_json = json.dumps(cat["movies"], ensure_ascii=False)

# 2. Read app.js
with open("assets/app.js", "r", encoding="utf-8") as f:
    code = f.read()

# Replace CURRENT_CATALOG_VERSION
code = re.sub(
    r"const CURRENT_CATALOG_VERSION = \d+;",
    "const CURRENT_CATALOG_VERSION = 8;",
    code
)

# Replace DEFAULT_MOVIES_CATALOG
# It is defined as: const DEFAULT_MOVIES_CATALOG = [...];
# Find its boundary
prefix = "const DEFAULT_MOVIES_CATALOG = "
idx_start = code.find(prefix)
if idx_start != -1:
    idx_end = code.find(";\n", idx_start + len(prefix))
    if idx_end != -1:
        code = code[:idx_start + len(prefix)] + movies_json + code[idx_end:]
        print("✅ Updated DEFAULT_MOVIES_CATALOG in app.js")
    else:
        print("❌ Could not find end of DEFAULT_MOVIES_CATALOG")
else:
    print("❌ Could not find DEFAULT_MOVIES_CATALOG")

# 3. Update openVlcAudioModal and audio logic
old_audio_modal = """window.openVlcAudioModal = function() {
  closeVlcMoreMenu();
  const modal = document.getElementById('vlcAudioModal');
  if (!modal) return;

  const tracksList = document.getElementById('vlcAudioTracksList');
  if (tracksList) {
    const movie = (typeof currentChannel !== 'undefined' && currentChannel && currentChannel.movieData) || (typeof currentSelectedMovie !== 'undefined' ? currentSelectedMovie : null);
    const langs = (movie && movie.languages && movie.languages.length > 0)
      ? movie.languages
      : ['Hindi', 'English'];

    const langIcons = {
      'Hindi': '🇮🇳',
      'Telugu': '🇮🇳',
      'Tamil': '🇮🇳',
      'Kannada': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Marathi': '🇮🇳',
      'English': '🌐',
      'Universal Audio': '🎵'
    };

    let html = '';
    langs.forEach((l, idx) => {
      const code = l.toLowerCase();
      const isActive = (currentAudioTrack === code || (currentAudioTrack === 'passthrough' && idx === 0));
      const icon = langIcons[l] || '🎧';
      html += `
        <div class="vlc-radio-row ${isActive ? 'active' : ''}" onclick="setVlcAudioTrack('${code}', this)">
          <span>${icon} ${l} (Original Dialogue & Studio Master)</span>
        </div>
      `;
    });

    html += `
      <div class="vlc-radio-row ${currentAudioTrack === 'speech_boost' ? 'active' : ''}" onclick="setVlcAudioTrack('speech_boost', this)">
        <span>⚡ Clear Voice Speech AI Boost (Enhanced Vocals)</span>
      </div>
      <div class="vlc-radio-row ${currentAudioTrack === 'passthrough' ? 'active' : ''}" onclick="setVlcAudioTrack('passthrough', this)">
        <span>🔊 Original Dolby / Direct Stream Passthrough</span>
      </div>
    `;

    tracksList.innerHTML = html;
  }

  modal.style.display = 'flex';
};"""

new_audio_modal = """window.openVlcAudioModal = function() {
  closeVlcMoreMenu();
  const modal = document.getElementById('vlcAudioModal');
  if (!modal) return;

  const tracksList = document.getElementById('vlcAudioTracksList');
  if (tracksList) {
    let html = '';
    const isHlsMulti = typeof hlsInstance !== 'undefined' && hlsInstance && hlsInstance.audioTracks && hlsInstance.audioTracks.length > 1;

    if (isHlsMulti) {
      hlsInstance.audioTracks.forEach((track, idx) => {
        const trackName = track.name || track.lang || `Track ${idx + 1}`;
        const isCurrent = hlsInstance.audioTrack === idx;
        html += `
          <div class="vlc-radio-row ${isCurrent ? 'active' : ''}" onclick="setVlcHlsAudioTrack(${idx}, this)">
            <span>📻 ${trackName} (${track.lang ? track.lang.toUpperCase() : 'HLS Audio Track'})</span>
          </div>
        `;
      });
    } else {
      const movie = (typeof currentChannel !== 'undefined' && currentChannel && currentChannel.movieData) || (typeof currentSelectedMovie !== 'undefined' ? currentSelectedMovie : null);
      const primaryLang = (movie && movie.languages && movie.languages[0]) || (movie && movie.defaultLanguage) || 'Master Dialogue';
      html += `
        <div class="vlc-radio-row active" onclick="setVlcAudioTrack('master', this)">
          <span>🎧 ${primaryLang} (Master Audio Track • Studio Dialogue)</span>
        </div>
      `;
    }

    html += `
      <div class="vlc-radio-row ${currentAudioTrack === 'speech_boost' ? 'active' : ''}" onclick="setVlcAudioTrack('speech_boost', this)">
        <span>⚡ Clear Voice Speech AI Boost (Enhanced Vocals)</span>
      </div>
      <div class="vlc-radio-row ${currentAudioTrack === 'passthrough' ? 'active' : ''}" onclick="setVlcAudioTrack('passthrough', this)">
        <span>🔊 Direct Hardware Audio Passthrough</span>
      </div>
    `;

    if (!isHlsMulti) {
      html += `
        <p style="font-size: 11px; color: #64748b; margin-top: 10px; text-align: center; line-height: 1.4;">
          ℹ️ Single Studio Master Audio Track • Multi-track switching is supported for multi-language broadcast streams.
        </p>
      `;
    }

    tracksList.innerHTML = html;
  }

  modal.style.display = 'flex';
};

window.setVlcHlsAudioTrack = function(trackIdx, elem) {
  if (typeof hlsInstance !== 'undefined' && hlsInstance && hlsInstance.audioTracks && hlsInstance.audioTracks[trackIdx]) {
    hlsInstance.audioTrack = trackIdx;
    const t = hlsInstance.audioTracks[trackIdx];
    const trackName = t.name || t.lang || `Track ${trackIdx + 1}`;
    const subBadge = document.getElementById('vlcAudioSubtitle');
    if (subBadge) subBadge.textContent = trackName;
    const rows = document.querySelectorAll('#vlcAudioTracksList .vlc-radio-row');
    rows.forEach(r => r.classList.remove('active'));
    if (elem) elem.classList.add('active');
    showToast(`Switched audio track to: ${trackName} 🔊`);
  }
};"""

if old_audio_modal in code:
    code = code.replace(old_audio_modal, new_audio_modal)
    print("✅ Updated openVlcAudioModal and added setVlcHlsAudioTrack")
else:
    print("⚠️ Old audio modal exact text not found, will check pattern")

# 4. Update HTTP download to open downloads modal
old_dl_route2 = """    if (window.AndroidMedia && window.AndroidMedia.startHttpDownload) {
      try {
        window.AndroidMedia.startHttpDownload(movie.streamUrl, movie.title, filename);
        showToast('⬇️ Download Started: ' + movie.title);
      } catch (e) {
        showToast('Download started');
      }
    } else {
      // Fallback: try opening URL in browser for download
      try {
        window.open(movie.streamUrl, '_blank');
        showToast('Opening download in browser...');
      } catch (e) {
        showToast('Download unavailable');
      }
    }
    return;"""

new_dl_route2 = """    if (window.AndroidMedia && window.AndroidMedia.startHttpDownload) {
      try {
        window.AndroidMedia.startHttpDownload(movie.streamUrl, movie.title, filename);
        showToast('⬇️ Download Started: ' + movie.title);
      } catch (e) {
        showToast('Download started');
      }
    } else {
      // Fallback: try opening URL in browser for download
      try {
        window.open(movie.streamUrl, '_blank');
        showToast('Opening download in browser...');
      } catch (e) {
        showToast('Download unavailable');
      }
    }
    openDownloadsManagerModal();
    return;"""

if old_dl_route2 in code:
    code = code.replace(old_dl_route2, new_dl_route2)
    print("✅ Updated startMovieDownload to openDownloadsManagerModal for HTTP downloads")
else:
    print("⚠️ Old HTTP download exact text not found")

with open("assets/app.js", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved updated assets/app.js")
