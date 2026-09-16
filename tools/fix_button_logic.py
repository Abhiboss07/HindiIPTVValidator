#!/usr/bin/env python3
import os

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app_js_files = [
    os.path.join(repo_root, 'assets', 'app.js'),
    os.path.join(repo_root, 'android_app', 'src', 'main', 'assets', 'assets', 'app.js')
]

old_block = """  // Check whether any playable episode exists across seasons
  const hasPlayableSeriesEp = movie.mediaType === 'series' && (
    (movie.seasons && movie.seasons.some(s => s.episodes && s.episodes.some(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!movie.torrentUri)))) ||
    (movie.episodes && movie.episodes.some(e => !!e.streamUrl || (e.sourceState === 'TORRENT_SOURCE_AVAILABLE' && !!movie.torrentUri)))
  );

  const sState = movie.sourceState || (movie.streamUrl ? 'DIRECT_STREAM_AVAILABLE' : (movie.trailerUrl ? 'TRAILER_ONLY' : (movie.torrentUri ? 'TORRENT_SOURCE_AVAILABLE' : 'NO_AUTHORIZED_SOURCE')));
  const isDirect = (sState === 'DIRECT_STREAM_AVAILABLE' || !!movie.streamUrl || hasPlayableSeriesEp) && (!movie.torrentUri || !!movie.streamUrl || hasPlayableSeriesEp);
  const isTrailerOnly = sState === 'TRAILER_ONLY' || (!!movie.trailerUrl && !movie.streamUrl && !movie.torrentUri && !hasPlayableSeriesEp);
  const isTorrent = (sState === 'TORRENT_SOURCE_AVAILABLE' || !!movie.torrentUri) && !movie.streamUrl && !hasPlayableSeriesEp;"""

new_block = """  // Check whether direct HTTP stream exists vs torrent
  const hasDirectStreamEp = movie.mediaType === 'series' && (
    (movie.seasons && movie.seasons.some(s => s.episodes && s.episodes.some(e => !!e.streamUrl))) ||
    (movie.episodes && movie.episodes.some(e => !!e.streamUrl))
  );

  const sState = movie.sourceState || (movie.streamUrl ? 'DIRECT_STREAM_AVAILABLE' : (movie.trailerUrl ? 'TRAILER_ONLY' : (movie.torrentUri ? 'TORRENT_SOURCE_AVAILABLE' : 'NO_AUTHORIZED_SOURCE')));
  const isTorrent = (sState === 'TORRENT_SOURCE_AVAILABLE' || (!movie.streamUrl && !hasDirectStreamEp && !!movie.torrentUri));
  const isDirect = !isTorrent && (sState === 'DIRECT_STREAM_AVAILABLE' || !!movie.streamUrl || hasDirectStreamEp);
  const isTrailerOnly = !isTorrent && !isDirect && (sState === 'TRAILER_ONLY' || (!!movie.trailerUrl && !movie.streamUrl && !hasDirectStreamEp));"""

for path in app_js_files:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if old_block in c:
        c = c.replace(old_block, new_block, 1)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"✅ Updated button logic in {path}")
    else:
        print(f"⚠️ Could not find exact old_block in {path}")
