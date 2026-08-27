import urllib.request
import re

url = "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=8) as resp:
        content = resp.read().decode('utf-8')
except Exception as e:
    print(f"Error fetching in.m3u: {e}")
    content = ""

lines = content.splitlines()
print(f"Total lines in in.m3u: {len(lines)}")

channels = []
current_info = None

for line in lines:
    if line.startswith('#EXTINF:'):
        current_info = line
    elif line.startswith('http') and current_info:
        # Extract title
        m = re.search(r',(.+)$', current_info)
        title = m.group(1).strip() if m else "Unknown"
        channels.append({'title': title, 'url': line.strip()})
        current_info = None

print(f"Found {len(channels)} channels in in.m3u")

# Test channels with quick timeout
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
working_streams = []

for ch in channels:
    if len(working_streams) >= 40:
        break
    try:
        req = urllib.request.Request(ch['url'], headers=headers)
        with urllib.request.urlopen(req, timeout=2.5) as r:
            if r.getcode() == 200:
                working_streams.append(ch)
                print(f"✅ WORKING [200]: {ch['title']} -> {ch['url'][:60]}...")
    except:
        pass

print(f"Total verified working: {len(working_streams)}")
