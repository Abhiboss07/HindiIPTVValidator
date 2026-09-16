import json
import os
from PIL import Image

with open("data/movies_catalog.json") as f:
    cat = json.load(f)

movies = cat.get("movies", [])
print(f"Total catalog movies: {len(movies)}")

posters_root = "assets/posters"
posters_android = "android_app/src/main/assets/assets/posters"

missing_root = []
missing_android = []
corrupted = []
zero_size = []

for m in movies:
    mid = m["id"]
    purl = m.get("posterUrl", "")
    if not purl:
        print(f"⚠️ No posterUrl for {mid}")
        continue
    
    # Extract filename
    fname = os.path.basename(purl)
    root_path = os.path.join(posters_root, fname)
    android_path = os.path.join(posters_android, fname)
    
    if not os.path.exists(root_path):
        missing_root.append((mid, purl, root_path))
    elif os.path.getsize(root_path) == 0:
        zero_size.append((mid, root_path))
    else:
        try:
            with Image.open(root_path) as im:
                im.verify()
        except Exception as e:
            corrupted.append((mid, root_path, str(e)))
            
    if not os.path.exists(android_path):
        missing_android.append((mid, purl, android_path))

print(f"Missing in assets/posters: {len(missing_root)}")
for x in missing_root:
    print(f"  ❌ {x[0]}: {x[1]} -> {x[2]}")

print(f"Missing in android_app assets: {len(missing_android)}")
for x in missing_android:
    print(f"  ❌ {x[0]}: {x[1]} -> {x[2]}")

print(f"Zero size posters: {len(zero_size)}")
print(f"Corrupted posters: {len(corrupted)}")
