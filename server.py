#!/usr/bin/env python3
"""
AakashStream PWA Server
Serves the 3D Web App & PWA assets with correct MIME types, ServiceWorker headers, and VLC playlist routing.
"""

import http.server
import socketserver
import socket
import os
import sys

PORT = 8080

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

class PWAHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.m3u': 'audio/x-mpegurl',
        '.m3u8': 'application/vnd.apple.mpegurl',
        '.json': 'application/json',
        '.webmanifest': 'application/manifest+json',
        '.svg': 'image/svg+xml',
        '.js': 'application/javascript',
        '.css': 'text/css'
    }

    def end_headers(self):
        # Enable CORS for all assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        
        # PWA Service Worker Scope Header
        if self.path == '/sw.js':
            self.send_header('Service-Worker-Allowed', '/')
            self.send_header('Cache-Control', 'no-cache')
            
        super().end_headers()

    def do_GET(self):
        user_agent = self.headers.get('User-Agent', '').lower()
        # If an external player (VLC, Kodi, IPTV Smarters) requests the root URL, serve the M3U playlist directly
        if self.path in ['/', ''] and any(player in user_agent for player in ['vlc', 'iptv', 'kodi', 'exoplayer', 'lavf']):
            self.path = '/playlist.m3u'
            
        super().do_GET()

if __name__ == "__main__":
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    local_ip = get_local_ip()
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", port), PWAHandler) as httpd:
        print("=" * 68)
        print("⚡ AAKASHSTREAM - 3D LIVE TV, ALL INDIA RADIO & WORLD HUB")
        print("=" * 68)
        print(f"📱 Open in Phone / PC Browser:  http://{local_ip}:{port}/")
        print(f"   (Tap 'Install App' in browser to install as a native app on home screen)")
        print()
        print(f"📺 For VLC Media Player Stream:  http://{local_ip}:{port}/playlist.m3u")
        print("=" * 68)
        print("Press Ctrl+C to stop the server.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
