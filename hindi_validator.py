#!/usr/bin/env python3
"""
Hindi IPTV Validator - Filters and validates Hindi language channels only
"""

import m3u8, subprocess, requests, time, json, re, yaml, argparse
from tqdm import tqdm
from urllib.parse import urlparse

def is_hindi_channel(title, metadata_info):
    """Check if channel supports Hindi language"""
    
    # Hindi keywords in channel names
    hindi_keywords = [
        'hindi', 'bharat', 'india', 'desi', 'aaj tak', 'zee', 'sony', 'star',
        'colors', 'ndtv', 'republic', 'abp', 'news18', 'times now', 'dd',
        'sab', '&tv', 'mtv india', '9xm', 'b4u', 'aastha', 'sanskar', 'ishwar',
        'disney hindi', 'discovery hindi', 'animal planet hindi', 'national geographic hindi',
        'history tv18', 'fox life hindi', 'axn hindi', 'hbo hindi', 'warner tv hindi',
        'sony pix hindi', 'movies now hindi', 'fxl hindi', 'star movies hindi',
        'utv action hindi', 'utv movies hindi', 'nickelodeon india', 'cartoon network india',
        'pogo', 'hungama tv', 'discovery kids india', 'marvel hq', 'sonic',
        'food food', 'living foodz', 'zee khana khazana', 'tlc india', 'travel xp hindi',
        'cnbc tv18', 'bloomberg tv india', 'et now', 'ndtv profit', 'ndtv good times'
    ]
    
    # International brands that offer Hindi content
    international_hindi_brands = [
        'disney', 'discovery', 'animal planet', 'national geographic', 'history',
        'fox life', 'axn', 'hbo', 'warner', 'sony pix', 'movies now', 'fxl',
        'star movies', 'utv action', 'utv movies', 'nickelodeon', 'cartoon network',
        'pogo', 'hungama', 'discovery kids', 'marvel', 'sonic', 'tlc', 'travel xp',
        'cnbc', 'bloomberg', 'et now'
    ]
    
    title_lower = title.lower()
    
    # Check if title contains Hindi keywords
    for keyword in hindi_keywords:
        if keyword in title_lower:
            return True
    
    # Check if channel is from India (most likely to have Hindi content)
    if metadata_info.get('country') == 'IN':
        return True
    
    # Check for international brands with Hindi content
    for brand in international_hindi_brands:
        if brand in title_lower and ('hindi' in title_lower or 'india' in title_lower):
            return True
    
    # Check for Hindi indicators in title
    hindi_indicators = ['hindi', 'india', 'bharat', 'desi']
    for indicator in hindi_indicators:
        if indicator in title_lower:
            return True
    
    return False

def is_stream_working(url, timeout=15, headers=None, proxies=None, retries=3):
    """Enhanced stream validation with better error handling"""
    
    for attempt in range(retries):
        try:
            cmd = [
                "ffprobe", "-v", "error",
                "-timeout", str(timeout * 1000000),
                "-i", url,
                "-show_entries", "format",
                "-print_format", "json"
            ]
            
            # Add headers if provided
            if headers:
                for key, value in headers.items():
                    cmd.extend(["-headers", f"{key}: {value}"])
            
            # Add user agent if not provided
            if not headers or 'User-Agent' not in headers:
                cmd.extend(["-headers", "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"])
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout+5)
            
            if result.returncode == 0:
                # Additional check for geo-blocking
                if "geo" in result.stderr.lower() or "blocked" in result.stderr.lower():
                    print(f"⚠️  Channel may be geo-blocked: {url}")
                    return False
                return True
            else:
                # Check for common error patterns
                stderr = result.stderr.lower()
                if "connection refused" in stderr or "network unreachable" in stderr:
                    return False
                if "403" in stderr or "forbidden" in stderr:
                    print(f"🚫 Channel blocked: {url}")
                    return False
                if "404" in stderr or "not found" in stderr:
                    return False
                    
        except subprocess.TimeoutExpired:
            if attempt == retries - 1:
                print(f"⏰ Channel timeout: {url}")
                return False
            time.sleep(2)
        except Exception as e:
            if attempt == retries - 1:
                print(f"❌ Channel error: {url} - {str(e)}")
                return False
            time.sleep(1)
    
    return False

def parse_m3u_metadata(input_file):
    """Parse M3U file to extract channel metadata from titles"""
    channels = {}
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        current_title = None
        for line in lines:
            line = line.strip()
            if line.startswith('#EXTINF:'):
                # Extract title from EXTINF line
                title_match = re.search(r',(.+)$', line)
                if title_match:
                    current_title = title_match.group(1).strip()
            elif line and not line.startswith('#') and current_title:
                # This is a URL line
                channels[line] = {
                    "title": current_title,
                    "country": "Unknown",
                    "category": "Unknown",
                    "language": "Unknown"
                }
                current_title = None
    except Exception as e:
        print(f"Error parsing M3U metadata: {e}")
    
    return channels

def load_channel_metadata(metadata_file="channels.yml"):
    """Load channel metadata from YAML file"""
    try:
        with open(metadata_file, 'r', encoding='utf-8') as f:
            return yaml.safe_load(f) or {}
    except FileNotFoundError:
        print(f"Metadata file {metadata_file} not found. Using default metadata.")
        return {}
    except Exception as e:
        print(f"Error loading metadata: {e}")
        return {}

def enhance_channel_metadata(channels, metadata_config):
    """Enhance channels with metadata from config"""
    for country, country_data in metadata_config.items():
        if isinstance(country_data, list):
            # Simple list of channel names
            for channel_name in country_data:
                if not channel_name:  # Skip empty channel names
                    continue
                for url, channel_info in channels.items():
                    if (channel_info and 
                        channel_info.get("title") and 
                        channel_name.lower() in channel_info["title"].lower()):
                        channel_info["country"] = country
                        channel_info["category"] = "General"
        elif isinstance(country_data, dict):
            # Structured data with categories
            for category, channel_list in country_data.items():
                for channel_name in channel_list:
                    if not channel_name:  # Skip empty channel names
                        continue
                    for url, channel_info in channels.items():
                        if (channel_info and 
                            channel_info.get("title") and 
                            channel_name.lower() in channel_info["title"].lower()):
                            channel_info["country"] = country
                            channel_info["category"] = category
    
    return channels

def filter_hindi_channels(channels):
    """Filter channels to only include Hindi language channels"""
    hindi_channels = {}
    
    for url, info in channels.items():
        if is_hindi_channel(info["title"], info):
            info["language"] = "Hindi"
            hindi_channels[url] = info
    
    return hindi_channels

def filter_channels(channels, country=None, category=None):
    """Filter channels by country and/or category"""
    filtered = {}
    
    for url, info in channels.items():
        include = True
        
        if country and info["country"].lower() != country.lower():
            include = False
        
        if category and info["category"].lower() != category.lower():
            include = False
        
        if include:
            filtered[url] = info
    
    return filtered

def validate_hindi_playlist(input_file, output_file, metadata_file=None, country=None, category=None, 
                           headers=None, proxies=None, output_format="m3u"):
    """Validate and filter Hindi IPTV playlist"""
    
    print("🇮🇳 Hindi IPTV Channel Validator")
    print("=" * 40)
    
    # Parse channels from M3U
    print("📋 Parsing M3U file...")
    channels = parse_m3u_metadata(input_file)
    print(f"   Found {len(channels)} total channels")
    
    # Load and enhance metadata
    if metadata_file:
        print("📝 Loading metadata...")
        metadata_config = load_channel_metadata(metadata_file)
        channels = enhance_channel_metadata(channels, metadata_config)
    
    # Filter for Hindi channels first
    print("🔍 Filtering for Hindi channels...")
    hindi_channels = filter_hindi_channels(channels)
    print(f"   Found {len(hindi_channels)} Hindi channels")
    
    # Additional filtering if specified
    if country or category:
        print(f"🎯 Applying filters: {country or 'All countries'}, {category or 'All categories'}")
        hindi_channels = filter_channels(hindi_channels, country, category)
        print(f"   After filtering: {len(hindi_channels)} channels")
    
    if not hindi_channels:
        print("❌ No Hindi channels found matching the criteria")
        return {}
    
    # Validate streams
    print("🔧 Testing stream availability...")
    valid_hindi_channels = {}
    dead_channels = []
    blocked_channels = []
    
    for url, info in tqdm(hindi_channels.items(), desc="Validating"):
        if is_stream_working(url, headers=headers, proxies=proxies):
            valid_hindi_channels[url] = info
        else:
            dead_channels.append(info["title"])
    
    # Output results
    print(f"\n📊 Validation Results:")
    print(f"   ✅ Working Hindi channels: {len(valid_hindi_channels)}")
    print(f"   ❌ Dead channels removed: {len(dead_channels)}")
    print(f"   🚫 Blocked channels removed: {len(blocked_channels)}")
    
    if dead_channels:
        print(f"\n🪦 Dead channels:")
        for channel in dead_channels[:5]:  # Show first 5
            print(f"   - {channel}")
        if len(dead_channels) > 5:
            print(f"   ... and {len(dead_channels) - 5} more")
    
    # Save results
    if output_format == "json":
        with open(output_file, "w", encoding='utf-8') as f:
            json.dump(valid_hindi_channels, f, indent=2, ensure_ascii=False)
    else:
        # M3U format
        with open(output_file, "w", encoding='utf-8') as f:
            f.write("#EXTM3U\n")
            f.write("#EXT-X-VERSION:3\n")
            for url, info in valid_hindi_channels.items():
                title = f"{info['title']} [{info['country']}] [{info['category']}] [Hindi]"
                f.write(f"#EXTINF:-1,{title}\n")
                f.write(f"{url}\n")
    
    print(f"\n💾 Saved {len(valid_hindi_channels)} working Hindi channels to {output_file}")
    return valid_hindi_channels

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hindi IPTV Playlist Validator")
    parser.add_argument("input_file", help="Input M3U file")
    parser.add_argument("output_file", help="Output file")
    parser.add_argument("--metadata", help="Channel metadata YAML file", default="channels.yml")
    parser.add_argument("--country", help="Filter by country (default: IN for India)")
    parser.add_argument("--category", help="Filter by category (News, Sports, Entertainment, etc.)")
    parser.add_argument("--format", choices=["m3u", "json"], default="m3u", help="Output format")
    parser.add_argument("--user-agent", help="Custom User-Agent header")
    parser.add_argument("--proxy", help="Proxy URL (e.g., http://127.0.0.1:8080)")
    
    args = parser.parse_args()
    
    # Default to India if no country specified
    if not args.country:
        args.country = "IN"
    
    # Prepare headers
    headers = {}
    if args.user_agent:
        headers["User-Agent"] = args.user_agent
    
    # Prepare proxies
    proxies = {}
    if args.proxy:
        proxies["http"] = args.proxy
        proxies["https"] = args.proxy
    
    validate_hindi_playlist(
        args.input_file,
        args.output_file,
        metadata_file=args.metadata,
        country=args.country,
        category=args.category,
        headers=headers,
        proxies=proxies,
        output_format=args.format
    )
