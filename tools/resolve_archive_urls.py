import json
import urllib.request
import concurrent.futures

CATALOG_PATH = "data/movies_catalog.json"

def resolve_url(item):
    movie_id = item["id"]
    url = item["streamUrl"]
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
        with urllib.request.urlopen(req, timeout=8) as resp:
            final_url = resp.geturl()
            return movie_id, url, final_url, None
    except Exception as e:
        return movie_id, url, None, str(e)

def main():
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    movies = data["movies"]
    archive_items = [m for m in movies if m.get("streamUrl") and "archive.org/download/" in m["streamUrl"]]
    print(f"Total archive.org items to resolve: {len(archive_items)}")

    updates = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        results = executor.map(resolve_url, archive_items)
        for mid, orig_url, final_url, err in results:
            if final_url and final_url != orig_url:
                updates[mid] = (orig_url, final_url)
                print(f"✓ {mid}: {final_url[:70]}...")
            elif err:
                print(f"✗ {mid} error: {err}")
            else:
                print(f"= {mid}: no redirect")

    print(f"\nResolved {len(updates)} URLs to direct iaXXXXXX endpoints.")

    # Apply updates to catalog
    modified = 0
    for m in movies:
        mid = m.get("id")
        if mid in updates:
            orig_url, direct_url = updates[mid]
            m["streamUrl"] = direct_url
            if "backupUrls" not in m or not isinstance(m["backupUrls"], list):
                m["backupUrls"] = []
            if orig_url not in m["backupUrls"]:
                m["backupUrls"].append(orig_url)
            modified += 1

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated {modified} entries in {CATALOG_PATH} with direct high-speed endpoints and backup links.")

if __name__ == "__main__":
    main()
