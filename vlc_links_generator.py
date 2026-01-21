#!/usr/bin/env python3
"""
VLC Direct Stream Link Generator
Creates direct streaming links that can be pasted into VLC
"""

import json
import webbrowser
from urllib.parse import quote
from hindi_validator_demo import validate_hindi_playlist_demo

def generate_vlc_links(input_file, metadata_file="channels.yml"):
    """Generate direct VLC streaming links"""
    
    print("🎬 Generating VLC Direct Stream Links...")
    print("=" * 50)
    
    # Get Hindi channels
    channels = validate_hindi_playlist_demo(
        input_file, 
        "temp_output.json", 
        metadata_file=metadata_file, 
        output_format="json"
    )
    
    # Generate HTML page with direct links
    html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hindi IPTV Channels - Direct VLC Links</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }}
        .category {{
            margin-bottom: 30px;
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .category h2 {{
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-top: 0;
        }}
        .channel-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }}
        .channel {{
            background: #f8f9fa;
            border: 1px solid #e1e5e9;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s ease;
        }}
        .channel:hover {{
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }}
        .channel-title {{
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            font-size: 16px;
        }}
        .channel-meta {{
            color: #666;
            font-size: 12px;
            margin-bottom: 10px;
        }}
        .vlc-link {{
            display: inline-block;
            background: #667eea;
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 5px;
            font-size: 14px;
            transition: background 0.3s ease;
        }}
        .vlc-link:hover {{
            background: #5a67d8;
        }}
        .stats {{
            background: #e8f5e8;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }}
        .copy-all {{
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            margin: 10px;
        }}
        .copy-all:hover {{
            background: #218838;
        }}
        .instructions {{
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🇮🇳 Hindi IPTV Channels</h1>
        <h3>Direct VLC Streaming Links - {len(channels)} Working Channels</h3>
        <p>Click any channel to open directly in VLC, or copy all links for batch import</p>
    </div>

    <div class="instructions">
        <h3>📋 How to Use These Links:</h3>
        <ol>
            <li><strong>Single Channel:</strong> Click any channel link below to open directly in VLC</li>
            <li><strong>Multiple Channels:</strong> Copy all links and paste into VLC → "Open Network Stream"</li>
            <li><strong>Direct URL:</strong> Each link can be copied and pasted directly into VLC's "Open Network Stream" dialog</li>
        </ol>
    </div>

    <div class="stats">
        <button class="copy-all" onclick="copyAllLinks()">📋 Copy All VLC Links</button>
        <button class="copy-all" onclick="downloadM3U()">⬇️ Download M3U File</button>
    </div>
"""
    
    # Group channels by category
    categories = {}
    for url, info in channels.items():
        category = info.get('category', 'Unknown')
        if category not in categories:
            categories[category] = []
        categories[category].append((info['title'], url, info.get('country', 'IN')))
    
    # Generate category sections
    for category, channel_list in sorted(categories.items()):
        html_content += f"""
    <div class="category">
        <h2>📺 {category} ({len(channel_list)} channels)</h2>
        <div class="channel-grid">
"""
        
        for title, url, country in channel_list:
            vlc_url = url
            html_content += f"""
            <div class="channel">
                <div class="channel-title">{title}</div>
                <div class="channel-meta">🇮🇳 {country} • {category}</div>
                <a href="{vlc_url}" class="vlc-link" target="_blank">📺 Open in VLC</a>
            </div>
"""
        
        html_content += """
        </div>
    </div>
"""
    
    # Add JavaScript functions
    all_links = [url for url, info in channels.items()]
    m3u_content = "#EXTM3U\n"
    for url, info in channels.items():
        m3u_content += f"#EXTINF:-1,{info['title']} [{info['country']}] [{info['category']}] [Hindi]\n{url}\n"
    
    html_content += """
    <script>
        function copyAllLinks() {
            const links = `""" + json.dumps(all_links) + """`;
            navigator.clipboard.writeText(JSON.parse(links).join('\\n'));
            alert('✅ All """ + str(len(all_links)) + """ VLC links copied to clipboard!');
        }
        
        function downloadM3U() {
            const m3uContent = `""" + m3u_content.replace('`', '\\`') + """`;
            const blob = new Blob([m3uContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hindi_channels.m3u';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>
"""
    
    # Save HTML file
    html_file = "vlc_hindi_channels.html"
    with open(html_file, "w", encoding='utf-8') as f:
        f.write(html_content)
    
    # Save M3U file
    m3u_file = "hindi_channels_vlc.m3u"
    with open(m3u_file, "w", encoding='utf-8') as f:
        f.write(m3u_content)
    
    print(f"\n🎉 Success! Generated files:")
    print(f"   📄 {html_file} - Interactive web page with VLC links")
    print(f"   📋 {m3u_file} - Direct M3U file for VLC import")
    print(f"   📊 {len(channels)} working Hindi channels")
    
    # Open in browser
    try:
        import os
        file_path = os.path.abspath(html_file)
        webbrowser.open(f'file://{file_path}')
        print(f"   🌐 Opened {html_file} in your browser")
    except:
        print(f"   📁 Open {html_file} manually in your browser")
    
    return html_file, m3u_file

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate VLC Direct Streaming Links for Hindi Channels")
    parser.add_argument("input_file", help="Input M3U file")
    parser.add_argument("--metadata", help="Channel metadata YAML file", default="channels.yml")
    
    args = parser.parse_args()
    
    generate_vlc_links(args.input_file, args.metadata)
