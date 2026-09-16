#!/usr/bin/env python3
"""Fetch real poster images from TMDB website for all placeholder titles."""
import os, sys, re, time, urllib.request, urllib.parse, json, ssl

WORKSPACE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTER_DIR = os.path.join(WORKSPACE, "assets", "posters")

# SSL context for HTTPS
ctx = ssl.create_default_context()

# TMDB search mapping - title to TMDB slug/ID
# Format: (catalog_id, tmdb_type, tmdb_search_query)
TITLES = [
    ("series_sherlock_holmes", "tv", "The Adventures of Sherlock Holmes"),
    ("vod_interstellar", "movie", "Interstellar"),
    ("vod_dark_knight", "movie", "The Dark Knight"),
    ("vod_dune_part_two", "movie", "Dune Part Two"),
    ("vod_shaitaan", "movie", "Shaitaan 2024"),
    ("vod_alien_romulus", "movie", "Alien Romulus"),
    ("vod_munjya", "movie", "Munjya"),
    ("vod_leo", "movie", "Leo 2023"),
    ("vod_tiger_3", "movie", "Tiger 3"),
    ("vod_salaar", "movie", "Salaar"),
    ("vod_dunki", "movie", "Dunki"),
    ("vod_gadar_2", "movie", "Gadar 2"),
    ("vod_inception", "movie", "Inception"),
    ("series_squid_game", "tv", "Squid Game"),
    ("series_all_of_us_are_dead", "tv", "All of Us Are Dead"),
    ("series_crash_landing_on_you", "tv", "Crash Landing on You"),
    ("series_vincenzo", "tv", "Vincenzo"),
    ("series_the_glory", "tv", "The Glory"),
    ("series_business_proposal", "tv", "Business Proposal"),
    ("series_descendants_of_the_sun", "tv", "Descendants of the Sun"),
    ("series_happiness", "tv", "Happiness 2021"),
    ("series_my_name", "tv", "My Name 2021"),
    ("series_sweet_home", "tv", "Sweet Home"),
    ("series_goblin", "tv", "Goblin kdrama"),
    ("series_true_beauty", "tv", "True Beauty"),
    ("series_the_untamed", "tv", "The Untamed"),
    ("series_falling_into_your_smile", "tv", "Falling Into Your Smile"),
    ("series_hidden_love", "tv", "Hidden Love"),
    ("series_love_between_fairy_and_devil", "tv", "Love Between Fairy and Devil"),
    ("series_put_your_head_on_my_shoulder", "tv", "Put Your Head on My Shoulder"),
    ("series_meteor_garden", "tv", "Meteor Garden 2018"),
    ("series_word_of_honor", "tv", "Word of Honor"),
    ("series_reset", "tv", "Reset 2022"),
    ("vod_train_to_busan", "movie", "Train to Busan"),
    ("vod_parasite", "movie", "Parasite 2019"),
    ("vod_the_raid_redemption", "movie", "The Raid Redemption"),
    ("vod_ip_man", "movie", "Ip Man 2008"),
    ("vod_ip_man_4", "movie", "Ip Man 4 The Finale"),
    ("vod_peninsula", "movie", "Peninsula 2020"),
    ("vod_kung_fu_hustle", "movie", "Kung Fu Hustle"),
    ("vod_shaolin_soccer", "movie", "Shaolin Soccer"),
    ("vod_the_outlaws", "movie", "The Outlaws 2017"),
    ("vod_the_roundup", "movie", "The Roundup 2022"),
    ("vod_demon_slayer_mugen_train", "movie", "Demon Slayer Mugen Train"),
    ("vod_jujutsu_kaisen_0", "movie", "Jujutsu Kaisen 0"),
    ("vod_suzume", "movie", "Suzume"),
    ("vod_your_name", "movie", "Your Name 2016"),
    ("series_death_note", "tv", "Death Note anime"),
    ("series_naruto_classic", "tv", "Naruto"),
    ("series_solo_leveling", "tv", "Solo Leveling"),
    ("vod_one_piece_film_red", "movie", "One Piece Film Red"),
    ("vod_stree", "movie", "Stree 2018"),
    ("vod_drishyam_2", "movie", "Drishyam 2 2022"),
    ("vod_kantara", "movie", "Kantara"),
    ("vod_kgf_chapter_1", "movie", "KGF Chapter 1"),
    ("vod_baahubali_1", "movie", "Baahubali The Beginning"),
    ("vod_baahubali_2", "movie", "Baahubali 2 The Conclusion"),
    ("vod_tumbbad", "movie", "Tumbbad"),
    ("vod_andhadhun", "movie", "Andhadhun"),
    ("vod_shershaah", "movie", "Shershaah"),
    ("vod_3_idiots", "movie", "3 Idiots"),
    ("vod_gangs_of_wasseypur", "movie", "Gangs of Wasseypur"),
    ("vod_vikram_vedha", "movie", "Vikram Vedha 2022"),
]

def fetch_tmdb_poster_url(search_query, media_type="movie"):
    """Search TMDB website and extract poster URL from og:image tag."""
    query = urllib.parse.quote(search_query)
    search_url = f"https://www.themoviedb.org/search/{media_type}?query={query}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
    }
    
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        
        # Find the first result link
        if media_type == "movie":
            pattern = r'href="(/movie/\d+[^"]*)"'
        else:
            pattern = r'href="(/tv/\d+[^"]*)"'
        
        match = re.search(pattern, html)
        if not match:
            return None
            
        detail_path = match.group(1)
        # Clean the path - just need /movie/ID or /tv/ID
        detail_path = re.match(r'/(movie|tv)/\d+', detail_path).group(0)
        detail_url = f"https://www.themoviedb.org{detail_path}"
        
        # Fetch the detail page
        req2 = urllib.request.Request(detail_url, headers=headers)
        with urllib.request.urlopen(req2, context=ctx, timeout=15) as resp2:
            html2 = resp2.read().decode("utf-8", errors="ignore")
        
        # Extract og:image (poster)
        og_match = re.search(r'og:image"\s+content="(https://[^"]*t/p/w\d+/[^"]+\.jpg)"', html2)
        if og_match:
            poster_url = og_match.group(1)
            # Upgrade to w500 size
            poster_url = re.sub(r'/t/p/w\d+/', '/t/p/w500/', poster_url)
            return poster_url
        
        # Fallback: look for image.tmdb.org in JSON-LD
        img_match = re.search(r'"image"\s*:\s*"(https://image\.tmdb\.org/t/p/w\d+/[^"]+\.jpg)"', html2)
        if img_match:
            poster_url = img_match.group(1)
            poster_url = re.sub(r'/t/p/w\d+/', '/t/p/w500/', poster_url)
            return poster_url
            
    except Exception as e:
        print(f"    Error searching: {e}")
    
    return None

def download_image(url, filepath):
    """Download image from URL to filepath."""
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        "Accept": "image/*",
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = resp.read()
        
        # Verify it's a JPEG
        if data[:2] != b'\xff\xd8':
            print(f"    WARNING: Not a valid JPEG!")
            return False
        
        with open(filepath, "wb") as f:
            f.write(data)
        
        return True
    except Exception as e:
        print(f"    Download error: {e}")
        return False

# --- MAIN ---
print("=" * 80)
print("    TMDB POSTER DOWNLOADER - Replacing 63 placeholder posters")
print("=" * 80)

success = 0
failed = []

for i, (catalog_id, mtype, search_q) in enumerate(TITLES):
    print(f"\n[{i+1}/{len(TITLES)}] {catalog_id} -> Searching: {search_q}")
    
    poster_url = fetch_tmdb_poster_url(search_q, mtype)
    
    if poster_url:
        print(f"  Found: {poster_url}")
        filepath = os.path.join(POSTER_DIR, f"{catalog_id}.jpg")
        
        # Backup old placeholder
        if os.path.exists(filepath):
            backup = filepath + ".placeholder.bak"
            if not os.path.exists(backup):
                os.rename(filepath, backup)
        
        if download_image(poster_url, filepath):
            fsize = os.path.getsize(filepath)
            print(f"  Downloaded: {fsize} bytes")
            success += 1
        else:
            failed.append(catalog_id)
            # Restore backup
            backup = filepath + ".placeholder.bak"
            if os.path.exists(backup):
                os.rename(backup, filepath)
    else:
        print(f"  FAILED: No poster found on TMDB")
        failed.append(catalog_id)
    
    # Rate limit: 0.5s between requests
    time.sleep(0.5)

print(f"\n{'='*80}")
print(f"RESULTS: {success} downloaded, {len(failed)} failed")
if failed:
    print(f"Failed: {failed}")
print(f"{'='*80}")
