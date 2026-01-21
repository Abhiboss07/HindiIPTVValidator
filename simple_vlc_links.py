#!/usr/bin/env python3
"""
Simple VLC Direct Link Generator
Creates direct streaming links that can be pasted into VLC
"""

import json
import webbrowser
import os
from hindi_validator_demo import validate_hindi_playlist_demo

def create_direct_links(input_file, metadata_file="channels.yml"):
    """Create direct streaming links for VLC"""
    
    print("🎬 Creating Direct VLC Streaming Links...")
    print("=" * 45)
    
    # Get Hindi channels
    channels = validate_hindi_playlist_demo(
        input_file, 
        "temp.json", 
        metadata_file=metadata_file, 
        output_format="json"
    )
    
    if not channels:
        print("❌ No working channels found!")
        return
    
    print(f"📊 Found {len(channels)} working Hindi channels")
    print("\n📋 Direct VLC Links (copy and paste into VLC):")
    print("-" * 60)
    
    # Create list of direct links
    vlc_links = []
    for i, (url, info) in enumerate(channels.items(), 1):
        title = info['title']
        country = info.get('country', 'IN')
        category = info.get('category', 'Unknown')
        
        print(f"{i:2d}. 📺 {title}")
        print(f"     🇮🇳 {country} • {category}")
        print(f"     🔗 {url}")
        print()
        
        vlc_links.append(url)
    
    # Create M3U file for VLC import
    m3u_content = "#EXTM3U\n"
    for url, info in channels.items():
        title = info['title']
        country = info.get('country', 'IN')
        category = info.get('category', 'Unknown')
        m3u_content += f"#EXTINF:-1,{title} [{country}] [{category}] [Hindi]\n{url}\n"
    
    # Save M3U file
    m3u_file = "hindi_channels_direct.m3u"
    with open(m3u_file, "w", encoding='utf-8') as f:
        f.write(m3u_content)
    
    # Create text file with all links
    links_file = "vlc_direct_links.txt"
    with open(links_file, "w", encoding='utf-8') as f:
        for url in vlc_links:
            f.write(url + "\n")
    
    print(f"\n🎉 Files Created:")
    print(f"   📋 {links_file} - All direct links (one per line)")
    print(f"   📄 {m3u_file} - M3U file for VLC import")
    
    print(f"\n📺 How to Use:")
    print(f"   1️⃣  Open VLC Media Player")
    print(f"   2️⃣  Press Ctrl+N (Open Network Stream)")
    print(f"   3️⃣  Paste any link from {links_file}")
    print(f"   4️⃣  Or use File → Open File → select {m3u_file}")
    
    return links_file, m3u_file

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Create Direct VLC Links for Hindi Channels")
    parser.add_argument("input_file", help="Input M3U file")
    parser.add_argument("--metadata", help="Channel metadata YAML file", default="channels.yml")
    
    args = parser.parse_args()
    
    create_direct_links(args.input_file, args.metadata)
