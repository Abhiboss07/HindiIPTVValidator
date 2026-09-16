#!/usr/bin/env python3
import json
import re
import os

def update_file(path, new_content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {path} ({len(new_content)} bytes)")

def apply_fixes():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    catalog_path = os.path.join(repo_root, 'data', 'movies_catalog.json')

    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog_data = json.load(f)

    movies = catalog_data.get('movies', [])
    catalog_json_str = json.dumps(movies, separators=(',', ':'), ensure_ascii=False)

    app_js_files = [
        os.path.join(repo_root, 'assets', 'app.js'),
        os.path.join(repo_root, 'android_app', 'src', 'main', 'assets', 'assets', 'app.js')
    ]

    for app_js_path in app_js_files:
        print(f"\nProcessing {app_js_path}...")
        with open(app_js_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Update DEFAULT_MOVIES_CATALOG inline definition
        # Look for const DEFAULT_MOVIES_CATALOG = [ ... ];
        cat_pattern = re.compile(r'const DEFAULT_MOVIES_CATALOG = \[.*?\];\nconst CatalogProvider = {', re.DOTALL)
        replacement = f"const DEFAULT_MOVIES_CATALOG = {catalog_json_str};\nconst CatalogProvider = {{"
        if cat_pattern.search(content):
            content = cat_pattern.sub(replacement, content, count=1)
            print("  ✅ Updated DEFAULT_MOVIES_CATALOG")
        else:
            print("  ⚠️ Could not find DEFAULT_MOVIES_CATALOG pattern!")

        # 2. Bump CURRENT_CATALOG_VERSION to 6
        content = re.sub(
            r'const CURRENT_CATALOG_VERSION = \d+;',
            'const CURRENT_CATALOG_VERSION = 6;',
            content
        )
        print("  ✅ Bumped CURRENT_CATALOG_VERSION to 6")

        # 3. Fix loadChannelMedia to guard against empty/null ch.url
        old_load = """function loadChannelMedia(ch, autoPlay) {
  const requestId = ++currentStreamRequestId;"""
        new_load = """function loadChannelMedia(ch, autoPlay) {
  if (!ch || !ch.url) {
    console.warn('loadChannelMedia called with empty stream URL:', ch);
    showToast('Cannot play: Media stream URL is missing or unavailable.');
    return;
  }
  const requestId = ++currentStreamRequestId;"""
        if old_load in content:
            content = content.replace(old_load, new_load, 1)
            print("  ✅ Added empty URL guard to loadChannelMedia")
        elif new_load in content:
            print("  ℹ️ loadChannelMedia already has guard")
        else:
            print("  ⚠️ Could not find exact loadChannelMedia anchor")

        # 4. Fix startTorrentPlayback isTorrent flag
        old_stp = """  const torrentChannel = {
    id: 'torrent_' + (infoHash || Date.now()),
    name: title || 'Torrent Media Stream',
    url: streamUrl,
    backupUrls: backupUrls || [],
    isLocal: false,
    isTorrent: true,
    type: 'video',
    category: 'VOD Cinema',
    quality: movieData && movieData.resolution ? movieData.resolution.split(' ')[0] : '1080p',
    flag: '⚡',
    movieData: movieData || null
  };

  playChannel(torrentChannel);
  startTorrentHudMonitor();"""

        new_stp = """  const isRealTorrent = !streamUrl.startsWith('http://') && !streamUrl.startsWith('https://') ? true : (streamUrl.includes(':8080/torrent') || streamUrl.includes('/torrent/stream'));
  const torrentChannel = {
    id: 'torrent_' + (infoHash || Date.now()),
    name: title || 'Torrent Media Stream',
    url: streamUrl,
    backupUrls: backupUrls || [],
    isLocal: false,
    isTorrent: isRealTorrent,
    type: 'video',
    category: 'VOD Cinema',
    quality: movieData && movieData.resolution ? movieData.resolution.split(' ')[0] : '1080p',
    flag: isRealTorrent ? '🧲' : '⚡',
    movieData: movieData || null
  };

  playChannel(torrentChannel);
  if (isRealTorrent) {
    startTorrentHudMonitor();
  }"""
        if old_stp in content:
            content = content.replace(old_stp, new_stp, 1)
            print("  ✅ Fixed startTorrentPlayback isTorrent detection")
        elif new_stp in content:
            print("  ℹ️ startTorrentPlayback already updated")
        else:
            print("  ⚠️ Could not find exact startTorrentPlayback anchor")

        # 5. Fix renderEpisodeItemMarkup with quality badge
        old_markup = """function renderEpisodeItemMarkup(movie, ep) {
  const isTorrentPlayable = (ep.sourceState === 'TORRENT_SOURCE_AVAILABLE' || (!ep.sourceState && ep.season === 1)) && !!movie.torrentUri;
  const isPlayable = !!ep.streamUrl || isTorrentPlayable;
  if (isPlayable) {
    return `
      <div class="series-ep-item" onclick="playSeriesEpisode('${movie.id}', '${ep.id}')">
        <div class="series-ep-left">
          <span class="series-ep-play-icon">▶</span>
          <div class="series-ep-info">
            <span class="series-ep-title">${ep.title}</span>
            <span class="series-ep-duration">${ep.duration || ''}</span>
          </div>
        </div>
        <button type="button" class="series-ep-play-btn" onclick="event.stopPropagation(); playSeriesEpisode('${movie.id}', '${ep.id}')">Stream</button>
      </div>
    `;
  } else {"""

        new_markup = """function renderEpisodeItemMarkup(movie, ep) {
  const isTorrentPlayable = (ep.sourceState === 'TORRENT_SOURCE_AVAILABLE' || (!ep.sourceState && ep.season === 1)) && !!movie.torrentUri;
  const isPlayable = !!ep.streamUrl || isTorrentPlayable;
  if (isPlayable) {
    const qBadge = ep.qualityHonestBadge ? `<span style="font-size: 10px; background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); border-radius: 4px; padding: 1px 6px; font-weight: 600; margin-left: 6px;">${ep.qualityHonestBadge}</span>` : '';
    return `
      <div class="series-ep-item" onclick="playSeriesEpisode('${movie.id}', '${ep.id}')">
        <div class="series-ep-left">
          <span class="series-ep-play-icon">▶</span>
          <div class="series-ep-info">
            <div style="display: flex; align-items: center;">
              <span class="series-ep-title">${ep.title}</span>
              ${qBadge}
            </div>
            <span class="series-ep-duration">${ep.duration || ''}</span>
          </div>
        </div>
        <button type="button" class="series-ep-play-btn" onclick="event.stopPropagation(); playSeriesEpisode('${movie.id}', '${ep.id}')">Stream</button>
      </div>
    `;
  } else {"""
        if old_markup in content:
            content = content.replace(old_markup, new_markup, 1)
            print("  ✅ Updated renderEpisodeItemMarkup with honest badge")
        elif new_markup in content:
            print("  ℹ️ renderEpisodeItemMarkup already updated")
        else:
            print("  ⚠️ Could not find exact renderEpisodeItemMarkup anchor")

        # 6. Fix openMovieDetails season sorting and series playability detection
        old_details_block = """  if (movie.mediaType === 'series' && (hasSeasonsData || hasEpisodes)) {
    if (episodesSec) episodesSec.style.display = 'block';
    if (episodesBadge) episodesBadge.textContent = movie.durationFormatted || (movie.episodes ? movie.episodes.length + ' Episodes' : '');

    if (episodesList) {
      if (hasSeasonsData) {
        // Season-grouped rendering with dropdown selector
        const seasonOptions = movie.seasons.map(s =>
          `<option value="${s.seasonNumber}">Season ${s.seasonNumber}${s.title ? ' — ' + s.title : ''}</option>`
        ).join('');

        const seasonSelector = `
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 0 4px;">
            <label style="font-size: 13px; font-weight: 700; color: #e2e8f0; white-space: nowrap;">Season:</label>
            <select id="seasonSelector" onchange="renderSeasonEpisodes('${movie.id}', this.value)"
              style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); color: #f1f5f9; font-size: 13px; font-weight: 600; appearance: auto;">
              ${seasonOptions}
            </select>
          </div>
        `;

        const firstSeason = movie.seasons[0];
        const firstSeasonEps = firstSeason.episodes.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
        episodesList.innerHTML = seasonSelector + `<div id="seasonEpisodesContainer">${firstSeasonEps}</div>`;
      } else {
        // Flat episodes fallback (backward compatibility)
        episodesList.innerHTML = movie.episodes.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
      }
    }
  } else {
    if (episodesSec) episodesSec.style.display = 'none';
  }

  // Primary Stream & Trailer Action Buttons Handling
  const btnStream = document.getElementById('btnMovieStream');
  const btnStreamText = document.getElementById('btnMovieStreamText');
  const btnTrailer = document.getElementById('btnMovieTrailer');

  const sState = movie.sourceState || (movie.streamUrl ? 'DIRECT_STREAM_AVAILABLE' : (movie.trailerUrl ? 'TRAILER_ONLY' : (movie.torrentUri ? 'TORRENT_SOURCE_AVAILABLE' : 'NO_AUTHORIZED_SOURCE')));
  const isDirect = sState === 'DIRECT_STREAM_AVAILABLE' || !!movie.streamUrl;
  const isTrailerOnly = sState === 'TRAILER_ONLY' || (!!movie.trailerUrl && !movie.streamUrl && !movie.torrentUri);
  const isTorrent = sState === 'TORRENT_SOURCE_AVAILABLE' || (!!movie.torrentUri && !movie.streamUrl);"""

        new_details_block = """  if (movie.mediaType === 'series' && (hasSeasonsData || hasEpisodes)) {
    if (episodesSec) episodesSec.style.display = 'block';
    if (episodesBadge) episodesBadge.textContent = movie.durationFormatted || (movie.episodes ? movie.episodes.length + ' Episodes' : '');

    if (episodesList) {
      if (hasSeasonsData) {
        // Ensure seasons are sorted numerically
        movie.seasons.sort((a, b) => (parseInt(a.seasonNumber, 10) || 0) - (parseInt(b.seasonNumber, 10) || 0));

        const seasonOptions = movie.seasons.map(s =>
          `<option value="${s.seasonNumber}">Season ${s.seasonNumber}${s.title ? ' — ' + s.title : ''}</option>`
        ).join('');

        const seasonSelector = `
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 0 4px;">
            <label style="font-size: 13px; font-weight: 700; color: #e2e8f0; white-space: nowrap;">Season:</label>
            <select id="seasonSelector" onchange="renderSeasonEpisodes('${movie.id}', this.value)"
              style="flex: 1; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08); color: #f1f5f9; font-size: 13px; font-weight: 600; appearance: auto;">
              ${seasonOptions}
            </select>
          </div>
        `;

        const firstSeason = movie.seasons[0];
        const sortedFirstEps = [...(firstSeason.episodes || [])].sort((a, b) => (parseInt(a.episodeNumber, 10) || 0) - (parseInt(b.episodeNumber, 10) || 0));
        const firstSeasonEps = sortedFirstEps.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
        episodesList.innerHTML = seasonSelector + `<div id="seasonEpisodesContainer">${firstSeasonEps}</div>`;
      } else {
        // Flat episodes fallback (backward compatibility)
        const sortedFlatEps = [...(movie.episodes || [])].sort((a, b) => (parseInt(a.episodeNumber, 10) || 0) - (parseInt(b.episodeNumber, 10) || 0));
        episodesList.innerHTML = sortedFlatEps.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
      }
    }
  } else {
    if (episodesSec) episodesSec.style.display = 'none';
  }

  // Primary Stream & Trailer Action Buttons Handling
  const btnStream = document.getElementById('btnMovieStream');
  const btnStreamText = document.getElementById('btnMovieStreamText');
  const btnTrailer = document.getElementById('btnMovieTrailer');

  // Check whether any playable episode exists across seasons
  const hasPlayableSeriesEp = movie.mediaType === 'series' && (
    (movie.seasons && movie.seasons.some(s => s.episodes && s.episodes.some(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!movie.torrentUri)))) ||
    (movie.episodes && movie.episodes.some(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!movie.torrentUri)))
  );

  const sState = movie.sourceState || (movie.streamUrl ? 'DIRECT_STREAM_AVAILABLE' : (movie.trailerUrl ? 'TRAILER_ONLY' : (movie.torrentUri ? 'TORRENT_SOURCE_AVAILABLE' : 'NO_AUTHORIZED_SOURCE')));
  const isDirect = (sState === 'DIRECT_STREAM_AVAILABLE' || !!movie.streamUrl || hasPlayableSeriesEp) && !movie.torrentUri;
  const isTrailerOnly = sState === 'TRAILER_ONLY' || (!!movie.trailerUrl && !movie.streamUrl && !movie.torrentUri && !hasPlayableSeriesEp);
  const isTorrent = sState === 'TORRENT_SOURCE_AVAILABLE' || (!!movie.torrentUri && !movie.streamUrl);"""

        if old_details_block in content:
            content = content.replace(old_details_block, new_details_block, 1)
            print("  ✅ Updated openMovieDetails series season sorting & playability detection")
        elif new_details_block in content:
            print("  ℹ️ openMovieDetails already updated")
        else:
            print("  ⚠️ Could not find exact openMovieDetails anchor")

        # 7. Fix renderSeasonEpisodes sorting
        old_rse = """window.renderSeasonEpisodes = function(movieId, seasonNumber) {
  const movie = CatalogProvider.getById(movieId);
  if (!movie || !movie.seasons) return;
  const season = movie.seasons.find(s => String(s.seasonNumber) === String(seasonNumber));
  if (!season) return;
  const container = document.getElementById('seasonEpisodesContainer');
  if (!container) return;
  container.innerHTML = season.episodes.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
};"""

        new_rse = """window.renderSeasonEpisodes = function(movieId, seasonNumber) {
  const movie = CatalogProvider.getById(movieId);
  if (!movie || !movie.seasons) return;
  const season = movie.seasons.find(s => String(s.seasonNumber) === String(seasonNumber));
  if (!season) return;
  const container = document.getElementById('seasonEpisodesContainer');
  if (!container) return;
  const sortedEps = [...(season.episodes || [])].sort((a, b) => (parseInt(a.episodeNumber, 10) || 0) - (parseInt(b.episodeNumber, 10) || 0));
  container.innerHTML = sortedEps.map(ep => renderEpisodeItemMarkup(movie, ep)).join('');
};"""
        if old_rse in content:
            content = content.replace(old_rse, new_rse, 1)
            print("  ✅ Updated renderSeasonEpisodes with numerical sorting")
        elif new_rse in content:
            print("  ℹ️ renderSeasonEpisodes already updated")
        else:
            print("  ⚠️ Could not find exact renderSeasonEpisodes anchor")

        # 8. Fix playSeriesEpisode strict matching (no silent ep[0] fallback)
        old_pse = """window.playSeriesEpisode = function(movieId, episodeId) {
  const movie = CatalogProvider.getById(movieId);
  if (!movie) return;

  // Search episode across seasons first, then flat list
  let ep = null;
  if (movie.seasons && Array.isArray(movie.seasons)) {
    for (const s of movie.seasons) {
      if (s.episodes) {
        ep = s.episodes.find(e => e.id === episodeId);
        if (ep) break;
      }
    }
  }
  if (!ep && movie.episodes) {
    ep = movie.episodes.find(e => e.id === episodeId) || movie.episodes[0];
  }
  if (!ep && movie.seasons && movie.seasons[0] && movie.seasons[0].episodes) {
    ep = movie.seasons[0].episodes[0];
  }

  if (!ep) {
    showToast('Episode not found');
    return;
  }

  const isTorrentPlayable = (ep.sourceState === 'TORRENT_SOURCE_AVAILABLE' || (!ep.sourceState && ep.season === 1)) && !!movie.torrentUri;
  if (!ep.streamUrl && !isTorrentPlayable) {
    showToast('Episode "' + ep.title + '" is currently not available for streaming');
    return;
  }

  window.currentPlayingEpisodeId = ep.id;
  nextEpDismissedForStream = false;

  const btnNext = document.getElementById('btnPlayerNextEp');
  if (btnNext) btnNext.style.display = 'inline-flex';

  const epTitle = `${movie.title}: ${ep.title}`;
  startMovieStream(movieId, ep.streamUrl, epTitle, false, ep.id);
};"""

        new_pse = """window.playSeriesEpisode = function(movieId, episodeId) {
  const movie = CatalogProvider.getById(movieId);
  if (!movie) return;

  // Search episode across seasons first, then flat list (STRICT matching)
  let ep = null;
  if (movie.seasons && Array.isArray(movie.seasons)) {
    for (const s of movie.seasons) {
      if (s.episodes) {
        ep = s.episodes.find(e => String(e.id) === String(episodeId));
        if (ep) break;
      }
    }
  }
  if (!ep && movie.episodes) {
    ep = movie.episodes.find(e => String(e.id) === String(episodeId));
  }

  // Strictly reject if episode was requested by ID but does not exist
  if (!ep) {
    showToast('Episode not found in catalog');
    return;
  }

  const isTorrentPlayable = (ep.sourceState === 'TORRENT_SOURCE_AVAILABLE' || (!ep.sourceState && ep.season === 1)) && !!movie.torrentUri;
  if (!ep.streamUrl && !isTorrentPlayable) {
    showToast('Episode "' + ep.title + '" has no authorized public stream available');
    return;
  }

  window.currentPlayingEpisodeId = ep.id;
  nextEpDismissedForStream = false;

  const btnNext = document.getElementById('btnPlayerNextEp');
  if (btnNext) btnNext.style.display = 'inline-flex';

  const epTitle = `${movie.title}: ${ep.title}`;
  startMovieStream(movieId, ep.streamUrl, epTitle, false, ep.id);
};"""

        if old_pse in content:
            content = content.replace(old_pse, new_pse, 1)
            print("  ✅ Updated playSeriesEpisode strict episode matching")
        elif new_pse in content:
            print("  ℹ️ playSeriesEpisode already updated")
        else:
            print("  ⚠️ Could not find exact playSeriesEpisode anchor")

        # 9. Fix handleStreamMovieClick for series
        old_hsmc = """    // If no prior resume episode, begin with S1:E1
    const firstEp = (currentSelectedMovie.seasons && currentSelectedMovie.seasons[0] && currentSelectedMovie.seasons[0].episodes && currentSelectedMovie.seasons[0].episodes[0]) ||
                    (currentSelectedMovie.episodes && currentSelectedMovie.episodes[0]);
    if (firstEp) {
      playSeriesEpisode(currentSelectedMovie.id, firstEp.id);
      return;
    }"""

        new_hsmc = """    // Find first playable episode, or fallback to first episode
    let targetEp = null;
    if (currentSelectedMovie.seasons && Array.isArray(currentSelectedMovie.seasons)) {
      for (const s of currentSelectedMovie.seasons) {
        if (s.episodes) {
          targetEp = s.episodes.find(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!currentSelectedMovie.torrentUri));
          if (targetEp) break;
        }
      }
    }
    if (!targetEp && currentSelectedMovie.episodes) {
      targetEp = currentSelectedMovie.episodes.find(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!currentSelectedMovie.torrentUri));
    }
    if (!targetEp) {
      targetEp = (currentSelectedMovie.seasons && currentSelectedMovie.seasons[0] && currentSelectedMovie.seasons[0].episodes && currentSelectedMovie.seasons[0].episodes[0]) ||
                 (currentSelectedMovie.episodes && currentSelectedMovie.episodes[0]);
    }
    if (targetEp) {
      playSeriesEpisode(currentSelectedMovie.id, targetEp.id);
      return;
    }"""

        if old_hsmc in content:
            content = content.replace(old_hsmc, new_hsmc, 1)
            print("  ✅ Updated handleStreamMovieClick to find first playable episode")
        elif new_hsmc in content:
            print("  ℹ️ handleStreamMovieClick already updated")
        else:
            print("  ⚠️ Could not find exact handleStreamMovieClick anchor")

        update_file(app_js_path, content)

if __name__ == '__main__':
    apply_fixes()
