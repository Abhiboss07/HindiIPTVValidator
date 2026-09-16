#!/usr/bin/env python3
import os
import re

def update_file(path, new_content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {path} ({len(new_content)} bytes)")

def apply_app_fixes():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    app_js_files = [
        os.path.join(repo_root, 'assets', 'app.js'),
        os.path.join(repo_root, 'android_app', 'src', 'main', 'assets', 'assets', 'app.js')
    ]

    for app_js_path in app_js_files:
        print(f"\nProcessing {app_js_path}...")
        with open(app_js_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Fix switchPage to properly support dedicated movies tab and lazy local media scan
        old_switch_page = """window.switchPage = function(pageId) {
  try {
    if (pageId === 'movies') {
      // Natural integration: No dedicated movies tab. Redirect to home cinema section.
      pageId = 'home';
      currentActivePage = 'home';
      document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.dock-tab-btn').forEach(b => b.classList.remove('active'));
      const homePage = document.getElementById('page-home');
      const homeTab = document.getElementById('tab-home');
      if (homePage) homePage.classList.add('active');
      if (homeTab) homeTab.classList.add('active');
      renderHomePage();
      const bollywoodSec = document.getElementById('homeBollywoodRow');
      if (bollywoodSec) {
        setTimeout(() => { bollywoodSec.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
      }
      return;
    }

    currentActivePage = pageId;
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.dock-tab-btn').forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    const targetTab = document.getElementById('tab-' + pageId);
    if (targetPage) targetPage.classList.add('active');
    if (targetTab) targetTab.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'home') renderHomePage();
    if (pageId === 'live') renderLiveTVPage();
    if (pageId === 'radio') renderRadioPage();
    if (pageId === 'favs') renderFavoritesPage();
    if (pageId === 'local') renderLocalPage();
  } catch (e) {
    console.error('Error in switchPage(' + pageId + '):', e);
  }
};"""

        new_switch_page = """window.switchPage = function(pageId) {
  try {
    currentActivePage = pageId;
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.dock-tab-btn').forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    const targetTab = document.getElementById('tab-' + pageId);
    if (targetPage) targetPage.classList.add('active');
    if (targetTab) targetTab.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageId === 'home') {
      renderHomePage();
    } else if (pageId === 'live') {
      renderLiveTVPage();
    } else if (pageId === 'radio') {
      renderRadioPage();
    } else if (pageId === 'movies') {
      if (typeof renderMoviesPage === 'function') renderMoviesPage();
    } else if (pageId === 'favs') {
      renderFavoritesPage();
    } else if (pageId === 'local') {
      renderLocalPage();
      if (!window.deviceMediaScanned) {
        window.deviceMediaScanned = true;
        setTimeout(() => { autoScanDeviceMedia(); }, 150);
      }
    }
  } catch (e) {
    console.error('Error in switchPage(' + pageId + '):', e);
  }
};"""

        if old_switch_page in content:
            content = content.replace(old_switch_page, new_switch_page, 1)
            print("  ✅ Fixed switchPage (Movies tab enabled, lazy scan configured)")
        else:
            print("  ⚠️ Could not find exact switchPage pattern!")

        # 2. Fix initApp: unblock main thread on startup
        old_init_app = """  try {
    loadDatabase().then(() => {
      try { renderAllPages(); } catch (e) { console.error('renderAllPages after DB note:', e); }
    });
  } catch (e) {
    console.warn('loadDatabase dispatch note:', e);
  }

  try { renderAllPages(); } catch (e) { console.error('Initial renderAllPages note:', e); }
  try { setTimeout(() => { autoScanDeviceMedia(); }, 300); } catch (e) {}"""

        new_init_app = """  try {
    loadDatabase().then(() => {
      try { renderHomePage(); } catch (e) { console.error('renderHomePage after DB note:', e); }
    });
  } catch (e) {
    console.warn('loadDatabase dispatch note:', e);
  }

  try { renderHomePage(); } catch (e) { console.error('Initial renderHomePage note:', e); }"""

        if old_init_app in content:
            content = content.replace(old_init_app, new_init_app, 1)
            print("  ✅ Fixed initApp (Removed eager scan & eager 884-channel DOM rendering)")
        else:
            print("  ⚠️ Could not find exact initApp pattern!")

        # 3. Fix WebAudio createMediaElementSource hijacking in initWebAudioDSP
        old_dsp = """    if (!webAudioSource && currentAudioTrack !== 'passthrough') {
      webAudioSource = webAudioCtx.createMediaElementSource(videoElement);
      
      webAudioVocalFilter = webAudioCtx.createBiquadFilter();
      webAudioVocalFilter.type = 'peaking';
      webAudioVocalFilter.frequency.value = 2200;
      webAudioVocalFilter.Q.value = 1.8;
      webAudioVocalFilter.gain.value = 0;

      if (webAudioCtx.createStereoPanner) {
        webAudioPanner = webAudioCtx.createStereoPanner();
        webAudioPanner.pan.value = 0;
        webAudioSource.connect(webAudioVocalFilter);
        webAudioVocalFilter.connect(webAudioPanner);
        webAudioPanner.connect(webAudioCtx.destination);
      } else {
        webAudioSource.connect(webAudioVocalFilter);
        webAudioVocalFilter.connect(webAudioCtx.destination);
      }
    }"""

        new_dsp = """    // Note: Do NOT call createMediaElementSource(videoElement).
    // In Chromium/Android WebView, routing HTMLMediaElement through WebAudio silences
    // cross-origin media that lack CORS headers, causing complete audio loss."""

        if old_dsp in content:
            content = content.replace(old_dsp, new_dsp, 1)
            print("  ✅ Removed createMediaElementSource hijacking in initWebAudioDSP")
        else:
            print("  ⚠️ Could not find exact old_dsp pattern!")

        # 4. Fix setVlcAudioTrack to support real HLS audio track switching & prevent muting
        old_set_audio = """  if (trackId !== 'passthrough') {
    initWebAudioDSP();
  }

  const videoElement = document.getElementById('luminaVideo');
  if (videoElement) {
    videoElement.muted = false; // Ensure unmuted direct hardware sound
    if (videoElement.audioTracks && videoElement.audioTracks.length > 0) {
      for (let i = 0; i < videoElement.audioTracks.length; i++) {
        videoElement.audioTracks[i].enabled = (trackId === 'english' || trackId === 'dual_right' ? i === 1 : i === 0);
      }
    }
  }"""

        new_set_audio = """  const videoElement = document.getElementById('luminaVideo');
  if (videoElement) {
    videoElement.muted = false; // Ensure direct unmuted hardware sound
    if (videoElement.audioTracks && videoElement.audioTracks.length > 0) {
      for (let i = 0; i < videoElement.audioTracks.length; i++) {
        videoElement.audioTracks[i].enabled = (trackId === 'english' || trackId === 'dual_right' ? i === 1 : i === 0);
      }
    }
  }

  // Real HLS audio track switching via Hls.js
  if (typeof hlsInstance !== 'undefined' && hlsInstance && hlsInstance.audioTracks && hlsInstance.audioTracks.length > 0) {
    const targetLang = (shortNames[trackId] || trackId).toLowerCase();
    const trackIndex = hlsInstance.audioTracks.findIndex(t => 
      (t.name && t.name.toLowerCase().includes(targetLang)) ||
      (t.lang && t.lang.toLowerCase().includes(targetLang))
    );
    if (trackIndex >= 0) {
      hlsInstance.audioTrack = trackIndex;
      console.log('Switched Hls.js audioTrack to:', trackIndex, hlsInstance.audioTracks[trackIndex]);
    }
  }"""

        if old_set_audio in content:
            content = content.replace(old_set_audio, new_set_audio, 1)
            print("  ✅ Fixed setVlcAudioTrack (Real HLS switching, no WebAudio muting)")
        else:
            print("  ⚠️ Could not find exact old_set_audio pattern!")

        # 5. Remove loading="lazy" from renderMovieCard
        old_thumb = """        <img class="movie-card-thumb" 
             src="${poster}" 
             alt="${movie.title}" 
             loading="lazy" 
             decoding="async" 
             onerror="this.onerror=null; this.src='assets/placeholder.png';" />"""

        new_thumb = """        <img class="movie-card-thumb" 
             src="${poster}" 
             alt="${movie.title}" 
             decoding="async" 
             onerror="this.onerror=null; this.src='assets/placeholder.png';" />"""

        if old_thumb in content:
            content = content.replace(old_thumb, new_thumb, 1)
            print("  ✅ Removed loading='lazy' from renderMovieCard (fixed horizontal scroll blank posters)")
        else:
            print("  ⚠️ Could not find exact old_thumb pattern!")

        update_file(app_js_path, content)

if __name__ == '__main__':
    apply_app_fixes()
