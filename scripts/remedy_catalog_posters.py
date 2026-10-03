#!/usr/bin/env python3
"""
remedy_catalog_posters.py
Comprehensive remediation for movie, web series, and short movie thumbnails:
1. Replaces incorrect posters (Kill, Rockstar, Ludo, Kesari) with verified authentic posters.
2. Replaces landscape thumbnails (Crash Landing on You, Descendants of the Sun, Aspirants, Pitchers, Parasite)
   with authentic portrait (2:3) posters that fit perfectly into theatrical card frames.
3. Separates short movies and classic films sharing duplicate thumbnails (Spring, Charge, Sprite Fright,
   Wing It, Agent 327, Coffee Run, Andaz Apna Apna, Hungama, De Dana Dan, Chupke Chupke, Anand, Munna Bhai,
   Gol Maal, Hum Aapke Hain Koun, 3 Idiots) into dedicated, unique high-quality posters.
4. Generates standard 2:3 portrait dimensions (e.g. 600x900) so every card renders without cropping or distortion.
5. Synchronizes data/movies_catalog.json and android_app/src/main/assets/.
"""

import os, sys, json, ssl, urllib.request
from PIL import Image, ImageOps

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB_POSTERS_DIR = os.path.join(WORKSPACE, "assets", "posters")
ANDROID_POSTERS_DIR = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "assets", "posters")
CATALOG_PATH = os.path.join(WORKSPACE, "data", "movies_catalog.json")
ANDROID_CATALOG_PATH = os.path.join(WORKSPACE, "android_app", "src", "main", "assets", "data", "movies_catalog.json")

os.makedirs(WEB_POSTERS_DIR, exist_ok=True)
os.makedirs(ANDROID_POSTERS_DIR, exist_ok=True)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

# Target remediation mapping:
# (catalog_id, filename, image_url, title)
TARGETS = [
    # 1. Correct wrong Bollywood posters
    ("vod_kill_2024", "vod_kill_2024.jpg", "https://media.themoviedb.org/t/p/w500/m2zXTuNPkywdYLyWlVyJZW2QOJH.jpg", "Kill (2024)"),
    ("vod_rockstar_2011", "vod_rockstar_2011.jpg", "https://media.themoviedb.org/t/p/w500/sIW1JIcnL8ejX8a0WbN9KzlEReP.jpg", "Rockstar (2011)"),
    ("vod_ludo_2020", "vod_ludo_2020.jpg", "https://media.themoviedb.org/t/p/w500/7wSaO6aY9vpwK7z67vq3HpGCrnX.jpg", "Ludo (2020)"),
    ("vod_kesari_2019", "vod_kesari_2019.jpg", "https://media.themoviedb.org/t/p/w500/3Us1Jy29ypWzkIPNnGbtfV3PQ2e.jpg", "Kesari (2019)"),

    # 2. Correct web series thumbnails not fitting 2:3 portrait ratio
    ("series_crash_landing_on_you", "series_crash_landing_on_you.jpg", "https://media.themoviedb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg", "Crash Landing on You"),
    ("series_descendants_of_the_sun", "series_descendants_of_the_sun.jpg", "https://media.themoviedb.org/t/p/w500/lv59yQgT4pRzomE4blx7eLboe2o.jpg", "Descendants of the Sun"),
    ("series_aspirants", "series_aspirants.jpg", "https://media.themoviedb.org/t/p/w500/lG8wK40jH4EX6dbVFI1fzw2E96N.jpg", "TVF Aspirants"),
    ("series_pitchers", "series_pitchers.jpg", "https://media.themoviedb.org/t/p/w500/sun1QTlXI4qsEfxKQiPrxdqt7rd.jpg", "TVF Pitchers"),
    ("vod_parasite", "vod_parasite.jpg", "https://media.themoviedb.org/t/p/w500/igICOruFgiqdY1HXwTNRuXJute.jpg", "Parasite"),

    # 3. Short movies with unique, dedicated posters
    ("vod_spring_4k", "vod_spring_4k.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Spring2019PillarPosterBlender.jpg/600px-Spring2019PillarPosterBlender.jpg", "Spring (4K)"),
    ("vod_charge_4k", "vod_charge_4k.jpg", "https://studio.blender.org/files/public/thumbnail/ae/13/ae134adfbfa91160947451873ab09c6d_m.webp", "Charge (4K)"),
    ("vod_sprite_fright_4k", "vod_sprite_fright_4k.jpg", "https://studio.blender.org/files/public/thumbnail/ce/83/ce833b1d7d5862f1c6e64f7d5b8b0fc9_m.webp", "Sprite Fright (4K)"),
    ("vod_wing_it_4k", "vod_wing_it_4k.jpg", "https://studio.blender.org/files/public/thumbnail/c2/6d/c26d3b56aeb6bc9bf1ba6ee8e27b7ccd_m.webp", "Wing It! (4K)"),
    ("vod_agent_327_4k", "vod_agent_327_4k.jpg", "https://media.themoviedb.org/t/p/w500/tSIMZK9XZSIb1dL3iQeTESEZvHw.jpg", "Agent 327 (4K)"),
    ("vod_coffee_run_4k", "vod_coffee_run_4k.jpg", "https://studio.blender.org/files/public/thumbnail/7a/43/7a43fa6b0bc44e62f1cbb21473800e07_m.webp", "Coffee Run (4K)"),

    # 4. Classic movies previously sharing Hera Pheri & Jab We Met
    ("vod_andaz_apna_apna", "vod_andaz_apna_apna.jpg", "https://upload.wikimedia.org/wikipedia/en/1/15/Andaz_Apna_Apna.jpg", "Andaz Apna Apna (1994)"),
    ("vod_hungama_2003", "vod_hungama_2003.jpg", "https://upload.wikimedia.org/wikipedia/en/b/b5/Hungama_poster.jpg", "Hungama (2003)"),
    ("vod_de_dana_dan_2009", "vod_de_dana_dan_2009.jpg", "https://media.themoviedb.org/t/p/w500/wPPAlHNWkiuvtFfURLGGXMQay6F.jpg", "De Dana Dan (2009)"),
    ("vod_chupke_chupke_1975", "vod_chupke_chupke_1975.jpg", "https://media.themoviedb.org/t/p/w500/iNMFkUL3iMJiaP7MtsFmedG5eIT.jpg", "Chupke Chupke (1975)"),
    ("vod_anand_1971", "vod_anand_1971.jpg", "https://upload.wikimedia.org/wikipedia/en/c/c9/Anand_film.jpg", "Anand (1971)"),
    ("vod_munna_bhai_mbbs", "vod_munna_bhai_mbbs.jpg", "https://media.themoviedb.org/t/p/w500/g8xvUFKNxUqlCzvRoKAFo1kVOvk.jpg", "Munna Bhai M.B.B.S. (2003)"),
    ("vod_gol_maal_1979", "vod_gol_maal_1979.jpg", "https://upload.wikimedia.org/wikipedia/en/3/36/Gol_Maal_poster.jpg", "Gol Maal (1979)"),
    ("vod_hum_aapke_hain_koun", "vod_hum_aapke_hain_koun.jpg", "https://media.themoviedb.org/t/p/w500/idoQFaSz4yASIU8cVABqBZ0ubs7.jpg", "Hum Aapke Hain Koun..! (1994)"),
    ("vod_3_idiots_full", "vod_3_idiots_full.jpg", "https://media.themoviedb.org/t/p/w500/gmSRHU1Wtiatj8KoyVt8rT9ockx.jpg", "3 Idiots (Full Movie)"),
]

def download_and_format_portrait(url, target_filename, target_w=600, target_h=900):
    """
    Downloads image from url, converts to RGB, and creates an authentic 2:3 vertical poster.
    If source image is landscape or square, it places it cleanly with a cinematic background fit.
    """
    web_dest = os.path.join(WEB_POSTERS_DIR, target_filename)
    android_dest = os.path.join(ANDROID_POSTERS_DIR, target_filename)

    tmp_path = f"/tmp/{target_filename}.tmp"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
            data = resp.read()
        with open(tmp_path, "wb") as f:
            f.write(data)

        # Process image with Pillow
        with Image.open(tmp_path) as img:
            img = img.convert("RGB")
            orig_w, orig_h = img.size
            ratio = orig_w / orig_h

            target_ratio = target_w / target_h  # 0.6667 (2:3)

            # If already near 2:3 (e.g. 0.60 to 0.75), resize cleanly to target_w x target_h
            if 0.60 <= ratio <= 0.75:
                final_img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            elif ratio > target_ratio:
                # Wider / Landscape image (e.g. 16:9 Blender thumbnails)
                # Create a 2:3 portrait poster with dark cinematic styling and centered art
                final_img = Image.new("RGB", (target_w, target_h), (11, 15, 25)) # Deep navy/dark slate

                # Resize landscape image to fit width
                scale = target_w / orig_w
                new_h = int(orig_h * scale)
                fitted = img.resize((target_w, new_h), Image.Resampling.LANCZOS)

                # Position vertically centered
                y_offset = (target_h - new_h) // 2
                final_img.paste(fitted, (0, y_offset))
            else:
                # Taller image - center crop to 2:3
                final_img = ImageOps.fit(img, (target_w, target_h), method=Image.Resampling.LANCZOS)

            # Save as high-quality JPEG
            final_img.save(web_dest, "JPEG", quality=92)
            final_img.save(android_dest, "JPEG", quality=92)

        if os.path.exists(tmp_path):
            os.remove(tmp_path)

        print(f"✅ Success: {target_filename} ({target_w}x{target_h}) saved from {url}")
        return True
    except Exception as e:
        print(f"❌ Error downloading {target_filename} from {url}: {e}")
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        return False

def update_catalogs():
    """Update data/movies_catalog.json and android_app/... to point to dedicated posters."""
    for cat_file in [CATALOG_PATH, ANDROID_CATALOG_PATH]:
        with open(cat_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        movies = data.get("movies", [])
        updated_count = 0

        target_map = {item[0]: item[1] for item in TARGETS}

        for m in movies:
            mid = m.get("id")
            if mid in target_map:
                new_poster = f"assets/posters/{target_map[mid]}"
                m["posterUrl"] = new_poster
                # If backdrop was missing or wrong duplicate, point to valid backdrop or poster
                if m.get("backdropUrl") in ["assets/posters/vod_tears_of_steel.jpg", "assets/posters/vod_hera_pheri_2000.jpg", "assets/posters/vod_jab_we_met_2007.jpg"]:
                    m["backdropUrl"] = new_poster
                updated_count += 1

        with open(cat_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"✅ Updated {updated_count} movies in {cat_file}")

def main():
    print("=============================================================")
    print("     T2L CATALOG POSTER REMEDIATION & FIT ENGINE")
    print("=============================================================\n")

    success_count = 0
    for cid, filename, url, title in TARGETS:
        print(f"Processing '{title}' ({cid})...")
        if download_and_format_portrait(url, filename):
            success_count += 1

    print(f"\nDownloaded and formatted {success_count}/{len(TARGETS)} posters.")

    print("\nUpdating catalogs...")
    update_catalogs()

    print("\n🎉 REMEDIATION COMPLETE!")

if __name__ == "__main__":
    main()
