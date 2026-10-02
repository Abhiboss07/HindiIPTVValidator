import json
import urllib.request
import urllib.error
import urllib.parse
import http.client
import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

USER_AGENT = "Mozilla/5.0 (Linux; Android 16; Nothing Phone 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36"
socket.setdefaulttimeout(10)

def probe_url(url):
    if not url:
        return {'alive': False, 'status': 0, 'reason': 'EMPTY', 'resolved_url': None, 'content_type': None}
    
    if 'youtube.com' in url or 'youtu.be' in url:
        return {'alive': True, 'status': 200, 'reason': 'YOUTUBE_EMBED', 'resolved_url': url, 'content_type': 'video/embed'}
    
    req = urllib.request.Request(url, headers={
        'User-Agent': USER_AGENT,
        'Range': 'bytes=0-1024'
    })
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            ctype = resp.headers.get('Content-Type', '')
            final_url = resp.geturl()
            if status in [200, 206, 302]:
                return {'alive': True, 'status': status, 'reason': 'OK', 'resolved_url': final_url, 'content_type': ctype}
            return {'alive': False, 'status': status, 'reason': f'HTTP_{status}', 'resolved_url': final_url, 'content_type': ctype}
    except urllib.error.HTTPError as e:
        if e.code in [200, 206]:
            return {'alive': True, 'status': e.code, 'reason': 'OK', 'resolved_url': e.geturl(), 'content_type': e.headers.get('Content-Type')}
        is_temp = e.code in [429, 500, 502, 503, 504]
        return {'alive': False, 'status': e.code, 'reason': 'TEMP_ERROR' if is_temp else f'HTTP_{e.code}', 'resolved_url': None, 'content_type': None}
    except Exception as ex:
        return {'alive': False, 'status': 0, 'reason': str(ex)[:40], 'resolved_url': None, 'content_type': None}

if __name__ == '__main__':
    test_urls = [
        "https://archive.org/download/suzume.compressed/Suzume%28%E3%81%99%E3%81%9A%E3%82%81%E3%81%AE%E6%88%B8%E7%B7%A0%E3%81%BE%E3%82%8A%29.com.mp4",
        "https://archive.org/download/83-2021-1080p-z-flix-co/22%20-%20Bollywood%20-%202021/Tribhanga%20-%20Tedhi%20Medhi%20Crazy%20%282021%29%201080p_zFlix%20CO.mp4",
        "https://archive.org/download/83-2021-1080p-z-flix-co/13%20-%20Bollywood%20-%202021/Mimi%20%282021%29%20Hindi%201080p_zFlix%20CO.mp4"
    ]
    for u in test_urls:
        res = probe_url(u)
        print(f"URL: {u[:60]}... -> {res['alive']}, status={res['status']}, ctype={res['content_type']}")
