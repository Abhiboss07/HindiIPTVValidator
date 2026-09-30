#!/usr/bin/env python3
import re
import sys

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    # 1. CatalogProvider.loaded: false
    if '  loaded: true,\n  async load() {' in code:
        code = code.replace('  loaded: true,\n  async load() {', '  loaded: false,\n  async load() {', 1)

    # 2. Add destroyPreviousPlayerSession() before loadChannelMedia
    if 'function destroyPreviousPlayerSession()' not in code:
        teardown_code = '''
let playerLockPillTimeout = null;

function destroyPreviousPlayerSession() {
  clearTimeout(streamWatchdogTimeout);
  
  if (hlsInstance) {
    try {
      hlsInstance.stopLoad();
      hlsInstance.detachMedia();
      hlsInstance.destroy();
    } catch (e) {}
    hlsInstance = null;
    window.hlsInstance = null;
  }

  const videoElement = document.getElementById('luminaVideo');
  if (videoElement) {
    try {
      const oldTracks = videoElement.querySelectorAll('track');
      oldTracks.forEach(t => t.remove());
    } catch (eTrk) {}
    
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load();
    videoElement.style.display = 'block';
  }

  const iframeElement = document.getElementById('luminaIframe');
  if (iframeElement) {
    iframeElement.src = 'about:blank';
    iframeElement.style.display = 'none';
  }
  window.currentEmbeddedYouTubeId = null;

  // Reset player lock state
  isPlayerLocked = false;
  clearTimeout(playerLockPillTimeout);
  const lockOverlay = document.getElementById('playerLockOverlay');
  if (lockOverlay) {
    lockOverlay.style.display = 'none';
    lockOverlay.classList.remove('fade-out');
  }

  // Clear subtitle UI
  const ccBox = document.getElementById('playerCcBox');
  const ccText = document.getElementById('playerCcText');
  if (ccBox) ccBox.style.display = 'none';
  if (ccText) ccText.textContent = '';
  isCCEnabled = false;
  currentSubtitleTrackId = 'off';
  if (typeof updateCCUI === 'function') updateCCUI();

  // Stop native DDP audio & torrent if active
  if (window.AndroidMedia && window.AndroidMedia.stopNativeAudio) {
    try { window.AndroidMedia.stopNativeAudio(); } catch (e) {}
  }
  isNativeDDPActive = false;

  if (typeof torrentHudInterval !== 'undefined' && torrentHudInterval) {
    clearInterval(torrentHudInterval);
    torrentHudInterval = null;
  }
  const torrentHud = document.getElementById('torrentHud');
  if (torrentHud) torrentHud.style.display = 'none';
  if (window.AndroidMedia && window.AndroidMedia.stopTorrentStream) {
    try { window.AndroidMedia.stopTorrentStream(); } catch(eT) {}
  }
}

function showPlayerLockPillTemporarily() {
  const lockOverlay = document.getElementById('playerLockOverlay');
  if (!lockOverlay || !isPlayerLocked) return;
  lockOverlay.style.display = 'flex';
  lockOverlay.classList.remove('fade-out');
  clearTimeout(playerLockPillTimeout);
  playerLockPillTimeout = setTimeout(() => {
    if (isPlayerLocked && lockOverlay) {
      lockOverlay.classList.add('fade-out');
    }
  }, 2500);
}

function attachMovieSubtitleTracks(movie) {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;
  const oldTracks = videoElement.querySelectorAll('track');
  oldTracks.forEach(t => t.remove());

  if (movie && Array.isArray(movie.subtitles) && movie.subtitles.length > 0) {
    movie.subtitles.forEach((sub, idx) => {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = sub.label || sub.lang || `Track ${idx + 1}`;
      track.srclang = (sub.lang || 'en').toLowerCase();
      track.src = sub.src;
      track.default = (idx === 0);
      videoElement.appendChild(track);
    });
  }
  setupCueRendering();
}

function updateActiveCueText() {
  const videoElement = document.getElementById('luminaVideo');
  const ccBox = document.getElementById('playerCcBox');
  const ccText = document.getElementById('playerCcText');
  if (!videoElement || !isCCEnabled) {
    if (ccBox) ccBox.style.display = 'none';
    return;
  }
  let activeText = '';
  if (videoElement.textTracks) {
    for (let i = 0; i < videoElement.textTracks.length; i++) {
      const track = videoElement.textTracks[i];
      if (track.mode === 'showing' && track.activeCues && track.activeCues.length > 0) {
        activeText = Array.from(track.activeCues).map(c => c.text).join('\\n');
        break;
      }
    }
  }
  if (activeText && activeText.trim()) {
    if (ccText) ccText.textContent = activeText.trim();
    if (ccBox) ccBox.style.display = 'block';
  } else {
    if (ccBox) ccBox.style.display = 'none';
  }
}

let cueListenersAttached = false;
function setupCueRendering() {
  const videoElement = document.getElementById('luminaVideo');
  if (!videoElement) return;

  const handleCue = () => {
    updateActiveCueText();
  };

  if (videoElement.textTracks) {
    for (let i = 0; i < videoElement.textTracks.length; i++) {
      const track = videoElement.textTracks[i];
      track.removeEventListener('cuechange', handleCue);
      track.addEventListener('cuechange', handleCue);
    }
    videoElement.textTracks.onchange = () => {
      for (let i = 0; i < videoElement.textTracks.length; i++) {
        const track = videoElement.textTracks[i];
        track.removeEventListener('cuechange', handleCue);
        track.addEventListener('cuechange', handleCue);
      }
      updateActiveCueText();
      if (typeof populateVlcSubtitleTracks === 'function') {
        populateVlcSubtitleTracks();
      }
    };
  }

  if (!cueListenersAttached) {
    cueListenersAttached = true;
    videoElement.addEventListener('timeupdate', () => {
      if (isCCEnabled) updateActiveCueText();
    });
  }
}
'''
        target = 'function loadChannelMedia(ch, autoPlay) {'
        assert target in code, "loadChannelMedia target not found"
        code = code.replace(target, teardown_code + '\n' + target, 1)

    # 3. Call destroyPreviousPlayerSession() inside loadChannelMedia
    if 'destroyPreviousPlayerSession();' not in code:
        target = 'function loadChannelMedia(ch, autoPlay) {\n'
        code = code.replace(target, target + '  destroyPreviousPlayerSession();\n', 1)

    # 4. Remove synchronous blocking resolveRedirectUrl
    archive_sync = '''  // Pre-resolve 302 redirect for archive.org to ensure direct 206 Partial Content byte ranges
  if (streamUrl && streamUrl.includes('archive.org/download/')) {
    if (window.AndroidMedia && window.AndroidMedia.resolveRedirectUrl) {
      try {
        const resolved = window.AndroidMedia.resolveRedirectUrl(streamUrl);
        if (resolved && resolved !== streamUrl) {
          streamUrl = resolved;
        }
      } catch (eRes) {}
    }
  }'''
    if archive_sync in code:
        code = code.replace(archive_sync, '  // Direct streaming: WebView automatically follows HTTP 302/307 redirects without blocking the main UI thread', 1)

    # 5. In closeMiniPlayer, call destroyPreviousPlayerSession()
    close_mini_old = '''window.closeMiniPlayer = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const videoElement = document.getElementById('luminaVideo');'''
    close_mini_new = '''window.closeMiniPlayer = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  destroyPreviousPlayerSession();
  const videoElement = document.getElementById('luminaVideo');'''
    if close_mini_old in code:
        code = code.replace(close_mini_old, close_mini_new, 1)

    # 6. Update togglePlayerLock to use showPlayerLockPillTemporarily
    toggle_lock_old = '''window.togglePlayerLock = function() {
  closeVlcMoreMenu();
  isPlayerLocked = !isPlayerLocked;
  const uiOverlay = document.getElementById('playerUiOverlay');
  const lockOverlay = document.getElementById('playerLockOverlay');
  
  if (isPlayerLocked) {
    if (uiOverlay) uiOverlay.classList.add('hidden-controls');
    if (lockOverlay) lockOverlay.style.display = 'flex';
    showToast('Controls Locked 🔒');
  } else {
    if (lockOverlay) lockOverlay.style.display = 'none';
    if (uiOverlay) uiOverlay.classList.remove('hidden-controls');
    showToast('Controls Unlocked 🔓');
    resetPlayerHideTimer();
  }
};'''
    toggle_lock_new = '''window.togglePlayerLock = function() {
  closeVlcMoreMenu();
  isPlayerLocked = !isPlayerLocked;
  const uiOverlay = document.getElementById('playerUiOverlay');
  const lockOverlay = document.getElementById('playerLockOverlay');
  
  if (isPlayerLocked) {
    if (uiOverlay) uiOverlay.classList.add('hidden-controls');
    showPlayerLockPillTemporarily();
    showToast('Controls Locked 🔒');
  } else {
    clearTimeout(playerLockPillTimeout);
    if (lockOverlay) {
      lockOverlay.style.display = 'none';
      lockOverlay.classList.remove('fade-out');
    }
    if (uiOverlay) uiOverlay.classList.remove('hidden-controls');
    showToast('Controls Unlocked 🔓');
    resetPlayerHideTimer();
  }
};'''
    if toggle_lock_old in code:
        code = code.replace(toggle_lock_old, toggle_lock_new, 1)

    # 7. In playerModal touchstart and click, call showPlayerLockPillTemporarily
    target_click = '''    playerModal.addEventListener('click', (e) => {
      if (isPlayerLocked) return;'''
    repl_click = '''    playerModal.addEventListener('click', (e) => {
      if (isPlayerLocked) {
        if (!e.target.closest('#playerLockOverlay')) {
          showPlayerLockPillTemporarily();
        }
        return;
      }'''
    if target_click in code:
        code = code.replace(target_click, repl_click, 1)

    target_touch = '''  playerModal.addEventListener('touchstart', (e) => {
    if (isPlayerLocked) return;'''
    repl_touch = '''  playerModal.addEventListener('touchstart', (e) => {
    if (isPlayerLocked) {
      if (!e.target.closest('#playerLockOverlay')) {
        showPlayerLockPillTemporarily();
      }
      return;
    }'''
    if target_touch in code:
        code = code.replace(target_touch, repl_touch, 1)

    # 8. startMovieStream: Direct streams bypass modal and start instantly
    old_prep_start = '''  // Poll progress with session guard to eliminate race conditions
  let ticks = 0;
  if (streamPrepInterval) clearInterval(streamPrepInterval);
  const currentSessionId = sessionId;

  streamPrepInterval = setInterval(() => {
    // Guard against stale callback from previous request
    if (!activePlaybackSession || activePlaybackSession.sessionId !== currentSessionId) {
      clearInterval(streamPrepInterval);
      return;
    }

    ticks++;
    let peers = 0;
    let verified = 0;

    if (window.AndroidMedia && window.AndroidMedia.getTorrentStatus) {
      try {
        const s = JSON.parse(window.AndroidMedia.getTorrentStatus());
        peers = s.connectedPeers || 0;
        verified = s.verifiedPieces || 0;
      } catch (e) {}
    }

    const peerCounter = document.getElementById('prepPeerCount');
    if (peerCounter) peerCounter.textContent = peers;

    const isDirectOrTrailer = isTrailer || !!movie.streamUrl || !!overrideUrl;

    if (isDirectOrTrailer) {
      // Instant fast-start: bypass artificial 1.8s delay and launch immediately
      clearInterval(streamPrepInterval);
      streamPrepInterval = null;
      setPrepStage(2, 'done');
      setPrepStage(3, 'done');
      setPrepStage(4, 'done');
      if (barEl) barEl.style.width = '100%';
      if (pctEl) pctEl.textContent = '100%';
      if (statusEl) statusEl.textContent = 'Buffer Ready! Starting playback...';
      if (startBtn) startBtn.disabled = false;
      forceLaunchPreparedStream(currentSessionId);
      return;
    }'''
    
    new_prep_start = '''  const isDirectOrTrailer = isTrailer || !!movie.streamUrl || !!overrideUrl;

  if (isDirectOrTrailer) {
    if (prepModal) {
      prepModal.classList.remove('active');
      prepModal.style.display = 'none';
    }
    forceLaunchPreparedStream(sessionId);
    return;
  }

  // Poll progress with session guard to eliminate race conditions
  let ticks = 0;
  if (streamPrepInterval) clearInterval(streamPrepInterval);
  const currentSessionId = sessionId;

  streamPrepInterval = setInterval(() => {
    // Guard against stale callback from previous request
    if (!activePlaybackSession || activePlaybackSession.sessionId !== currentSessionId) {
      clearInterval(streamPrepInterval);
      return;
    }

    ticks++;
    let peers = 0;
    let verified = 0;

    if (window.AndroidMedia && window.AndroidMedia.getTorrentStatus) {
      try {
        const s = JSON.parse(window.AndroidMedia.getTorrentStatus());
        peers = s.connectedPeers || 0;
        verified = s.verifiedPieces || 0;
      } catch (e) {}
    }

    const peerCounter = document.getElementById('prepPeerCount');
    if (peerCounter) peerCounter.textContent = peers;'''
    if old_prep_start in code:
        code = code.replace(old_prep_start, new_prep_start, 1)

    # 9. In loadChannelMedia, attach movie subtitle tracks if available
    attach_sub_target = "  const isM3U8 = streamUrl && (streamUrl.endsWith('.m3u8') || streamUrl.includes('.m3u8') || streamUrl.includes('m3u8'));"
    attach_sub_code = '''  // Attach WebVTT subtitle tracks if available in movie metadata
  if (ch.movieData) {
    attachMovieSubtitleTracks(ch.movieData);
  } else if (currentSelectedMovie) {
    attachMovieSubtitleTracks(currentSelectedMovie);
  }

  const isM3U8 = streamUrl && (streamUrl.endsWith('.m3u8') || streamUrl.includes('.m3u8') || streamUrl.includes('m3u8'));'''
    if attach_sub_target in code and 'attachMovieSubtitleTracks(ch.movieData);' not in code:
        code = code.replace(attach_sub_target, attach_sub_code, 1)

    # 10. In Hls.js setup, listen for subtitle updates
    hls_sub_target = '''      hlsInstance.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        if (requestId !== currentStreamRequestId) return;
        try {
          if (typeof applyPreferredAudioTrack === 'function') {
            applyPreferredAudioTrack(hlsInstance, ch.movieData || currentSelectedMovie);
          }
        } catch (eA) {}
      });'''
    hls_sub_code = '''      hlsInstance.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        if (requestId !== currentStreamRequestId) return;
        try {
          if (typeof applyPreferredAudioTrack === 'function') {
            applyPreferredAudioTrack(hlsInstance, ch.movieData || currentSelectedMovie);
          }
        } catch (eA) {}
      });

      hlsInstance.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
        if (requestId !== currentStreamRequestId) return;
        try {
          if (typeof populateVlcSubtitleTracks === 'function') {
            populateVlcSubtitleTracks();
          }
        } catch (eSub) {}
      });

      hlsInstance.on(Hls.Events.SUBTITLE_TRACK_LOADED, () => {
        if (requestId !== currentStreamRequestId) return;
        try {
          if (typeof populateVlcSubtitleTracks === 'function') {
            populateVlcSubtitleTracks();
          }
        } catch (eSub) {}
      });'''
    if hls_sub_target in code:
        code = code.replace(hls_sub_target, hls_sub_code, 1)

    # 11. In setVlcSubtitleTrack, call updateActiveCueText
    set_sub_target = "  updateCCUI();\n  showToast(`Subtitles: ${selectedLabel} [CC]`);"
    set_sub_code = "  updateCCUI();\n  updateActiveCueText();\n  showToast(`Subtitles: ${selectedLabel} [CC]`);"
    if set_sub_target in code:
        code = code.replace(set_sub_target, set_sub_code, 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Successfully patched {filepath}")

if __name__ == '__main__':
    patch_file('assets/app.js')
    patch_file('android_app/src/main/assets/assets/app.js')
