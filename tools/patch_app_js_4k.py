#!/usr/bin/env python3
"""
Applies 4K UHD and High-Resolution Audio playback enhancements to assets/app.js:
1. Upgrades Hls.js configuration with 60MB maxBufferSize, 30s bufferLength, and capLevelToPlayerSize: false.
2. Adds LEVEL_SWITCHED event listener to dynamically update quality badge on ABR shifts.
3. Exposes 4K/1440p/1080p/720p/480p dynamic representations in openVlcQualityModal without fake MP4 options.
4. Enhances getAvailableAudioTracks & openVlcAudioModal with Dolby Atmos, E-AC-3, AC-3, FLAC, and channel detection.
5. Updates setVlcStreamQuality with 1440p/2K mappings.
"""

import os
import shutil

WORKSPACE = "/home/abhiboss/Projects/HindiIPTVValidator"
APP_JS = os.path.join(WORKSPACE, "assets", "app.js")
ANDROID_APP_JS = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "app.js")

def patch_app_js():
    with open(APP_JS, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update Hls configuration
    old_hls_config = """      hlsInstance = new Hls({
        enableWorker: false, // Disables WebWorker to avoid file:/// sandboxing issues in WebView
        autoStartLoad: true,
        lowLatencyMode: false,
        startLevel: 0, // Instant-start at lowest bitrate in <1.5s
        maxBufferLength: 10, // Rapid buffer-safe playback
        maxMaxBufferLength: 20,
        maxBufferSize: 30 * 1000 * 1000, // 30MB safety buffer cap to prevent Android low-memory crashes
        manifestLoadingTimeOut: 10000,
        fragLoadingTimeOut: 10000
      });"""

    new_hls_config = """      hlsInstance = new Hls({
        enableWorker: false, // Disables WebWorker to avoid file:/// sandboxing issues in WebView
        autoStartLoad: true,
        lowLatencyMode: false,
        startLevel: 0, // Instant-start at lowest bitrate in <1.5s
        maxBufferLength: 30, // Upgraded buffer length for smooth 4K/2K high-bitrate playback
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000, // 60MB buffer cap for seamless 4K UHD 2160p streaming
        capLevelToPlayerSize: false, // CRITICAL: Never artificially clamp 4K UHD levels to WebView CSS dimensions
        manifestLoadingTimeOut: 15000,
        fragLoadingTimeOut: 20000
      });"""

    if old_hls_config in content:
        content = content.replace(old_hls_config, new_hls_config)
        print("Updated Hls.js configuration.")
    else:
        print("Warning: old_hls_config not found directly.")

    # 2. Add LEVEL_SWITCHED listener right after FRAG_LOADED
    old_frag_loaded = """      hlsInstance.on(Hls.Events.FRAG_LOADED, () => {
        if (requestId !== currentStreamRequestId) return;
        clearTimeout(streamWatchdogTimeout);
        hideBufferingSpinner();
        hideStreamErrorState();
      });"""

    new_frag_loaded_plus_level_switched = """      hlsInstance.on(Hls.Events.FRAG_LOADED, () => {
        if (requestId !== currentStreamRequestId) return;
        clearTimeout(streamWatchdogTimeout);
        hideBufferingSpinner();
        hideStreamErrorState();
      });

      hlsInstance.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        if (requestId !== currentStreamRequestId) return;
        const levelIdx = data.level;
        if (hlsInstance.levels && hlsInstance.levels[levelIdx]) {
          const lvl = hlsInstance.levels[levelIdx];
          const height = lvl.height || 0;
          const width = lvl.width || 0;
          let label = height ? `${height}p` : 'Auto';
          if (height >= 2160 || width >= 3840) label = '4K UHD';
          else if (height >= 1440 || width >= 2560) label = '1440p 2K';
          else if (height >= 1080 || width >= 1920) label = '1080p FHD';
          else if (height >= 720 || width >= 1280) label = '720p HD';
          else if (height > 0) label = `${height}p`;

          const topQualityBadge = document.getElementById('vlcTopQualityLabel');
          if (topQualityBadge) topQualityBadge.textContent = label;
          const vlcSub = document.getElementById('vlcQualitySubtitle');
          if (vlcSub) vlcSub.textContent = `Active stream: ${label} (${width}x${height})`;
        }
      });"""

    if old_frag_loaded in content and "Hls.Events.LEVEL_SWITCHED" not in content:
        content = content.replace(old_frag_loaded, new_frag_loaded_plus_level_switched)
        print("Added Hls.Events.LEVEL_SWITCHED listener.")

    # 3. Update applySpeedMatchedQualityToHls to support 1440p and 2k
    old_target_h = """  const targetH = {
    '4k': 2160,
    '1080p': 1080,
    '720p': 720,
    '480p': 480,
    '360p': 360,
    '144p': 144
  }[preferredQuality] || 720;"""

    new_target_h = """  const targetH = {
    '4k': 2160,
    '2160p': 2160,
    '1440p': 1440,
    '2k': 1440,
    '1080p': 1080,
    '720p': 720,
    '480p': 480,
    '360p': 360,
    '144p': 144
  }[preferredQuality] || 720;"""

    if old_target_h in content:
        content = content.replace(old_target_h, new_target_h)
        print("Updated applySpeedMatchedQualityToHls target heights.")

    # 4. Update openVlcQualityModal to have honest source-derived options for progressive MP4
    old_quality_modal_code = """      // Sort levels descending by resolution height
      const sortedLevels = hlsInstance.levels.map((lvl, idx) => ({ lvl, origIdx: idx }))
        .sort((a, b) => (b.lvl.height || 0) - (a.lvl.height || 0));

      sortedLevels.forEach(item => {
        const h = item.lvl.height || 720;
        const bitrateMbps = item.lvl.bitrate ? (item.lvl.bitrate / 1000000).toFixed(1) : 'Variable';
        const qKey = h >= 2000 ? '4k' : (h >= 1000 ? '1080p' : (h >= 700 ? '720p' : (h >= 450 ? '480p' : (h >= 300 ? '360p' : '144p'))));
        const isActive = !isAuto && (hlsInstance.currentLevel === item.origIdx);
        const name = h >= 2000 ? '🌟 4K Ultra HD (2160p)' : (h >= 1000 ? '📺 Full HD (1080p Crystal Clear)' : (h >= 700 ? '📱 HD (720p Balanced)' : (h >= 450 ? '📉 SD (480p Standard)' : (h >= 300 ? '🔋 Data Saver (360p)' : '📶 Ultra Low (144p)'))));

        optionsHtml += `
          <div class="vlc-radio-row ${isActive ? 'active' : ''}" onclick="setVlcStreamQuality('${qKey}', this, ${item.origIdx})">
            <div class="vlc-radio-circle"></div>
            <div class="vlc-radio-text">
              <h4>${name}</h4>
              <p>${h}p • ~${bitrateMbps} Mbps • Source Track</p>
            </div>
          </div>
        `;
      });
    } else {
      // Progressive MP4 / Direct Movie or Series Source
      const vid = document.getElementById('luminaVideo');
      const curW = (vid && vid.videoWidth) ? vid.videoWidth : 0;
      const curH = (vid && vid.videoHeight) ? vid.videoHeight : 0;
      const resDesc = curW && curH ? `${curW}x${curH}` : 'Source Native';
      const nativeH = curH || (currentPlayingChannel && currentPlayingChannel.quality && parseInt(currentPlayingChannel.quality)) || 1080;

      const qOptions = [
        { key: 'auto', title: `⚡ Auto (${resDesc}) [Recommended]`, sub: 'Dynamically adapts to network speed with zero buffering' },
        { key: '4k', title: '🌟 4K Ultra HD (2160p 60fps)', sub: nativeH >= 2160 ? 'Native Pristine Master • 25+ Mbps 5G/WiFi' : 'High Bitrate Remaster • Requires 25+ Mbps 5G/WiFi' },
        { key: '1080p', title: '📺 Full HD (1080p Crystal Clear)', sub: nativeH >= 1080 ? 'Native Full HD Master • 5-10 Mbps High Speed' : 'Upscaled Full HD • 5-10 Mbps High Speed' },
        { key: '720p', title: '📱 HD (720p High Definition)', sub: nativeH >= 720 ? 'Native HD Stream • 2.5 Mbps Mobile Data' : 'Standard HD • 2.5 Mbps Mobile Data' },
        { key: '480p', title: '📉 SD (480p Standard Definition)', sub: 'Efficient Web Stream • 1.2 Mbps Low Data' },
        { key: '360p', title: '🔋 Data Saver (360p Low Data)', sub: 'Saves up to 75% mobile data on 3G/4G/5G' },
        { key: '144p', title: '📶 Ultra Data Saver (144p Minimum Data)', sub: 'Minimal data consumption for weak connections' }
      ];

      qOptions.forEach(opt => {
        const isActive = (currentVlcQuality === opt.key);
        optionsHtml += `
          <div class="vlc-radio-row ${isActive ? 'active' : ''}" onclick="setVlcStreamQuality('${opt.key}', this)">
            <div class="vlc-radio-circle"></div>
            <div class="vlc-radio-text">
              <h4>${opt.title}</h4>
              <p>${opt.sub}</p>
            </div>
          </div>
        `;
      });
    }"""

    new_quality_modal_code = """      // Sort levels descending by resolution height
      const sortedLevels = hlsInstance.levels.map((lvl, idx) => ({ lvl, origIdx: idx }))
        .sort((a, b) => (b.lvl.height || 0) - (a.lvl.height || 0));

      sortedLevels.forEach(item => {
        const h = item.lvl.height || 720;
        const w = item.lvl.width || 0;
        const bitrateMbps = item.lvl.bitrate ? (item.lvl.bitrate / 1000000).toFixed(1) : 'Variable';
        let qKey = `${h}p`;
        let name = `${h}p HD`;
        if (h >= 2160 || w >= 3840) {
          qKey = '4k';
          name = '🌟 4K Ultra HD (2160p UHD)';
        } else if (h >= 1440 || w >= 2560) {
          qKey = '1440p';
          name = '💎 2K / 1440p Quad HD';
        } else if (h >= 1080 || w >= 1920) {
          qKey = '1080p';
          name = '📺 Full HD (1080p Crystal Clear)';
        } else if (h >= 720 || w >= 1280) {
          qKey = '720p';
          name = '📱 HD (720p Balanced)';
        } else if (h >= 480) {
          qKey = '480p';
          name = '📉 SD (480p Standard)';
        } else if (h >= 360) {
          qKey = '360p';
          name = '🔋 Data Saver (360p)';
        } else {
          qKey = '144p';
          name = '📶 Ultra Low (144p)';
        }

        const isActive = !isAuto && (hlsInstance.currentLevel === item.origIdx);

        optionsHtml += `
          <div class="vlc-radio-row ${isActive ? 'active' : ''}" onclick="setVlcStreamQuality('${qKey}', this, ${item.origIdx})">
            <div class="vlc-radio-circle"></div>
            <div class="vlc-radio-text">
              <h4>${name}</h4>
              <p>${h}p (${w}x${h}) • ~${bitrateMbps} Mbps • Source Representation</p>
            </div>
          </div>
        `;
      });
    } else {
      // Progressive MP4 / Direct Movie or Series Source (Single Genuine Rendition)
      const vid = document.getElementById('luminaVideo');
      const curW = (vid && vid.videoWidth) ? vid.videoWidth : 0;
      const curH = (vid && vid.videoHeight) ? vid.videoHeight : 0;
      const curSrc = (vid && vid.src) ? vid.src : '';
      const isArchive = curSrc.includes('archive.org');
      const isDataSaverActive = curSrc.includes('_512kb.mp4');

      let nativeBadge = 'HD';
      if (curH >= 2160 || curW >= 3840) { nativeBadge = '4K UHD (2160p)'; }
      else if (curH >= 1440 || curW >= 2560) { nativeBadge = '2K Quad HD (1440p)'; }
      else if (curH >= 1080 || curW >= 1920) { nativeBadge = 'Full HD (1080p)'; }
      else if (curH >= 720 || curW >= 1280) { nativeBadge = 'HD (720p)'; }
      else if (curH > 0) { nativeBadge = `SD (${curH}p)`; }
      else if (currentPlayingChannel && currentPlayingChannel.quality) { nativeBadge = currentPlayingChannel.quality; }

      const resText = (curW && curH) ? `${curW}x${curH}` : nativeBadge;

      const isNativeActive = !isDataSaverActive;
      optionsHtml += `
        <div class="vlc-radio-row ${isNativeActive ? 'active' : ''}" onclick="setVlcStreamQuality('auto', this)">
          <div class="vlc-radio-circle"></div>
          <div class="vlc-radio-text">
            <h4>⚡ Native Master Stream: ${nativeBadge} [Active]</h4>
            <p>${resText} • Unaltered Native Source Bitrate • Hardware Passthrough</p>
          </div>
        </div>
      `;

      if (isArchive) {
        optionsHtml += `
          <div class="vlc-radio-row ${isDataSaverActive ? 'active' : ''}" onclick="setVlcStreamQuality('360p', this)">
            <div class="vlc-radio-circle"></div>
            <div class="vlc-radio-text">
              <h4>🔋 Data Saver Rendition (360p Low Bandwidth)</h4>
              <p>512 kbps Web Stream • Saves up to 75% mobile data</p>
            </div>
          </div>
        `;
      }
    }"""

    if old_quality_modal_code in content:
        content = content.replace(old_quality_modal_code, new_quality_modal_code)
        print("Updated openVlcQualityModal for honest representations.")
    else:
        print("Warning: old_quality_modal_code not found directly.")

    # 5. Update setVlcStreamQuality label maps for 1440p/2k
    old_label_map = """  const labelMap = {
    'auto': 'Auto (Adaptive Speed)',
    '4k': '4K Ultra HD (2160p)',
    '1080p': 'Full HD (1080p)',
    '720p': 'HD (720p)',
    '480p': 'SD (480p)',
    '360p': 'Data Saver (360p)',
    '144p': 'Ultra Low (144p)'
  };

  const shortLabelMap = {
    'auto': 'AUTO',
    '4k': '4K',
    '1080p': '1080P',
    '720p': '720P',
    '480p': '480P',
    '360p': '360P',
    '144p': '144P'
  };"""

    new_label_map = """  const labelMap = {
    'auto': 'Auto (Adaptive Speed)',
    '4k': '4K Ultra HD (2160p)',
    '2160p': '4K Ultra HD (2160p)',
    '1440p': '2K Quad HD (1440p)',
    '2k': '2K Quad HD (1440p)',
    '1080p': 'Full HD (1080p)',
    '720p': 'HD (720p)',
    '480p': 'SD (480p)',
    '360p': 'Data Saver (360p)',
    '144p': 'Ultra Low (144p)',
    'native': 'Native Master Quality'
  };

  const shortLabelMap = {
    'auto': 'AUTO',
    '4k': '4K UHD',
    '2160p': '4K UHD',
    '1440p': '2K',
    '2k': '2K',
    '1080p': '1080P',
    '720p': '720P',
    '480p': '480P',
    '360p': '360P',
    '144p': '144P',
    'native': 'NATIVE'
  };"""

    if old_label_map in content:
        content = content.replace(old_label_map, new_label_map)
        print("Updated setVlcStreamQuality label maps.")

    # 6. Update getAvailableAudioTracks & openVlcAudioModal
    old_audio_tracks = """function getAvailableAudioTracks(movie, episodeId) {
  if (typeof hlsInstance !== 'undefined' && hlsInstance && hlsInstance.audioTracks && hlsInstance.audioTracks.length > 1) {
    return {
      type: 'HLS',
      tracks: hlsInstance.audioTracks.map((t, idx) => ({
        index: idx,
        name: t.name || t.lang || `Track ${idx + 1}`,
        lang: t.lang || 'und',
        isCurrent: hlsInstance.audioTrack === idx
      }))
    };
  }"""

    new_audio_tracks = """function getAvailableAudioTracks(movie, episodeId) {
  if (typeof hlsInstance !== 'undefined' && hlsInstance && hlsInstance.audioTracks && hlsInstance.audioTracks.length > 0) {
    return {
      type: 'HLS',
      tracks: hlsInstance.audioTracks.map((t, idx) => {
        let label = t.name || t.lang || `Track ${idx + 1}`;
        const nameLower = (t.name || '').toLowerCase();
        const groupLower = (t.groupId || '').toLowerCase();
        const codecLower = (t.audioCodec || '').toLowerCase();

        let formatBadge = '';
        if (nameLower.includes('atmos') || groupLower.includes('atmos')) {
          formatBadge = 'Dolby Atmos (Spatial Audio)';
        } else if (nameLower.includes('ec-3') || groupLower.includes('ec-3') || codecLower.includes('ec-3')) {
          formatBadge = 'Dolby Digital Plus (E-AC-3 5.1)';
        } else if (nameLower.includes('ac-3') || groupLower.includes('ac-3') || codecLower.includes('ac-3')) {
          formatBadge = 'Dolby Digital (AC-3 5.1)';
        } else if (codecLower.includes('flac')) {
          formatBadge = 'FLAC Lossless Master';
        } else if (codecLower.includes('opus')) {
          formatBadge = 'Opus High Fidelity';
        } else if (codecLower.includes('mp4a.40.2') || codecLower.includes('aac')) {
          formatBadge = 'AAC-LC High Res';
        }

        return {
          index: idx,
          name: label,
          lang: t.lang || 'und',
          formatBadge: formatBadge,
          channels: t.channels || (formatBadge.includes('5.1') ? '5.1' : 'Stereo'),
          isCurrent: hlsInstance.audioTrack === idx
        };
      })
    };
  }"""

    if old_audio_tracks in content:
        content = content.replace(old_audio_tracks, new_audio_tracks)
        print("Updated getAvailableAudioTracks for high-resolution audio codecs.")

    old_open_audio_modal_hls = """    if (audioData.type === 'HLS') {
      audioData.tracks.forEach(track => {
        html += `
          <div class="vlc-radio-row ${track.isCurrent ? 'active' : ''}" onclick="setVlcHlsAudioTrack(${track.index}, this)">
            <span>📻 ${track.name} (${track.lang ? track.lang.toUpperCase() : 'HLS Audio Track'})</span>
          </div>
        `;
      });"""

    new_open_audio_modal_hls = """    if (audioData.type === 'HLS') {
      audioData.tracks.forEach(track => {
        const badgeStr = track.formatBadge ? ` • ${track.formatBadge}` : '';
        const chStr = track.channels ? ` [${track.channels}]` : '';
        html += `
          <div class="vlc-radio-row ${track.isCurrent ? 'active' : ''}" onclick="setVlcHlsAudioTrack(${track.index}, this)">
            <span>📻 ${track.name} (${track.lang ? track.lang.toUpperCase() : 'Master'}${chStr}${badgeStr})</span>
          </div>
        `;
      });"""

    if old_open_audio_modal_hls in content:
        content = content.replace(old_open_audio_modal_hls, new_open_audio_modal_hls)
        print("Updated openVlcAudioModal HLS display.")

    with open(APP_JS, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Saved {APP_JS}")

    shutil.copy2(APP_JS, ANDROID_APP_JS)
    print(f"Synced {ANDROID_APP_JS}")

if __name__ == "__main__":
    patch_app_js()
