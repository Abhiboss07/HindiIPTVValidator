import json
import subprocess
import sys

with open("data/movies_catalog.json") as f:
    cat = json.load(f)

movies = cat.get("movies", [])

def probe_url(url):
    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "stream=index,codec_type,codec_name,width,height,channels,sample_rate:stream_tags=language,title:format=duration,size,bit_rate",
        "-of", "json",
        url
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=25)
        if res.returncode == 0:
            return json.loads(res.stdout)
        else:
            return {"error": res.stderr.strip()[:200]}
    except subprocess.TimeoutExpired:
        return {"error": "ffprobe timeout (25s)"}
    except Exception as e:
        return {"error": str(e)}

print("=== PROBING PLAYABLE VOD SOURCES ===")
for m in movies:
    mid = m["id"]
    title = m.get("title", "")
    st = m.get("streamUrl")
    
    # Also check episode 1 for series
    ep1_url = None
    if m.get("seasons"):
        for s in m["seasons"]:
            for ep in s.get("episodes", []):
                if ep.get("streamUrl"):
                    ep1_url = ep["streamUrl"]
                    break
            if ep1_url:
                break
    
    target_url = st or ep1_url
    if not target_url:
        continue
    
    print(f"\nProbing: {mid} ({title})")
    print(f"URL: {target_url}")
    data = probe_url(target_url)
    
    if "error" in data:
        print(f"  ❌ Error: {data['error']}")
        continue
    
    streams = data.get("streams", [])
    video_streams = [s for s in streams if s.get("codec_type") == "video"]
    audio_streams = [s for s in streams if s.get("codec_type") == "audio"]
    
    print(f"  Format: duration={data.get('format', {}).get('duration')}, size={data.get('format', {}).get('size')}, bit_rate={data.get('format', {}).get('bit_rate')}")
    
    for v in video_streams:
        print(f"  📹 Video: {v.get('codec_name')}, {v.get('width')}x{v.get('height')}")
        
    for a in audio_streams:
        tags = a.get("tags", {})
        lang = tags.get("language") or tags.get("title") or "und"
        print(f"  🔊 Audio: index={a.get('index')}, codec={a.get('codec_name')}, channels={a.get('channels')}, rate={a.get('sample_rate')}, lang={lang}")
