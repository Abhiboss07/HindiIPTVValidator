import json
import os

CATALOG_PATH = '/home/abhiboss/Projects/HindiIPTVValidator/data/movies_catalog.json'

def cleanup_catalog():
    if not os.path.exists(CATALOG_PATH):
        print(f"File not found: {CATALOG_PATH}")
        return
        
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    changes_swarm = 0
    changes_resolution = 0
    changes_quality_class = 0
    
    for item in data.get('movies', []):
        # Rule 1: Remove swarmSeeders if no torrentUri
        if not item.get('torrentUri'):
            if item.get('swarmSeeders') is not None:
                item['swarmSeeders'] = None
                changes_swarm += 1
                
        # Rule 2 & 3: Fix resolution and qualityClass based on sourceState
        source_state = item.get('sourceState')
        if source_state == 'NO_AUTHORIZED_SOURCE':
            if item.get('resolution') != 'Source Unavailable':
                item['resolution'] = 'Source Unavailable'
                changes_resolution += 1
            if item.get('qualityClass') is not None:
                item['qualityClass'] = None
                changes_quality_class += 1
        elif source_state == 'TRAILER_ONLY':
            if item.get('resolution') != 'Trailer Only':
                item['resolution'] = 'Trailer Only'
                changes_resolution += 1
            if item.get('qualityClass') is not None:
                item['qualityClass'] = None
                changes_quality_class += 1
                
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    print(f"Summary of changes:")
    print(f"- swarmSeeders removed (set to null): {changes_swarm}")
    print(f"- resolution corrected: {changes_resolution}")
    print(f"- qualityClass set to null: {changes_quality_class}")
    print("Cleanup complete.")

if __name__ == '__main__':
    cleanup_catalog()
