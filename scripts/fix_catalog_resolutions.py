import json
import re

CATALOG_PATH = 'data/movies_catalog.json'
with open(CATALOG_PATH, 'r') as f:
    data = json.load(f)

updated_count = 0
for m in data['movies']:
    has_stream = bool(m.get('streamUrl') or m.get('episodes'))
    is_direct = m.get('sourceState') == 'DIRECT_STREAM_AVAILABLE'
    
    # Clean up series or movies with working full content that were labeled "Official Trailer"
    if has_stream and is_direct:
        res = m.get('resolution') or ''
        if 'Trailer' in res:
            if m.get('mediaType') == 'series' or m.get('contentType') == 'SERIES':
                m['resolution'] = '1080p FHD (Episodes)'
                m['quality'] = '1080p'
                m['qualityHonestBadge'] = '1080p FHD'
            else:
                m['resolution'] = '1080p Full HD'
                m['quality'] = '1080p'
                m['qualityHonestBadge'] = '1080p Full HD'
            updated_count += 1
            print(f"Fixed {m['id']} resolution -> {m['resolution']}")
        
        # Ensure quality is set if missing
        if not m.get('quality'):
            res_str = m.get('resolution') or ''
            if '4K' in res_str or '2160' in res_str:
                m['quality'] = '4K'
            elif '1080' in res_str or 'FHD' in res_str:
                m['quality'] = '1080p'
            elif '720' in res_str:
                m['quality'] = '720p'
            elif '480' in res_str:
                m['quality'] = '480p'
            else:
                m['quality'] = '1080p'
        
        if not m.get('qualityHonestBadge'):
            m['qualityHonestBadge'] = m.get('resolution') or (m.get('quality') + ' HD')

data['version'] = data.get('version', 20) + 1
with open(CATALOG_PATH, 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Sync to Android assets
with open('android_app/src/main/assets/data/movies_catalog.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Successfully fixed {updated_count} titles and synced to Android assets.")
