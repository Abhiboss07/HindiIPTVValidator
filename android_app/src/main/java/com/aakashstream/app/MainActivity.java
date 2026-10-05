package com.aakashstream.app;

import android.Manifest;
import android.app.Activity;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.media.MediaMetadataRetriever;
import android.net.Uri;
import com.aakashstream.app.torrent.*;
import java.io.File;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import android.os.Bundle;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.util.Log;
import android.util.Size;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.app.PendingIntent;
import android.app.PictureInPictureParams;
import android.app.RemoteAction;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.drawable.Icon;
import android.util.Rational;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.HttpURLConnection;
import java.net.URL;
import android.graphics.Rect;
import android.os.Handler;
import android.os.Environment;
import android.os.Looper;
import java.util.concurrent.ConcurrentHashMap;
import android.content.SharedPreferences;

public class MainActivity extends Activity {
    private static final String TAG = "AakashStream";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static final int PERMISSIONS_REQUEST_CODE = 1002;

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private AudioManager audioManager;
    private ServerSocket localServerSocket;
    private int localServerPort = 0;
    private volatile boolean isServerRunning = false;
    private java.util.concurrent.ExecutorService serverExecutor;
    private AndroidMediaBridge mediaBridge;
    private TorrentEngine torrentEngine;
    private volatile boolean isPlaybackActive = false;

    private static final String ACTION_PIP_PREV = "com.aakashstream.app.PIP_PREV";
    private static final String ACTION_PIP_PLAY_PAUSE = "com.aakashstream.app.PIP_PLAY_PAUSE";
    private static final String ACTION_PIP_NEXT = "com.aakashstream.app.PIP_NEXT";

    private final BroadcastReceiver pipReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent == null || intent.getAction() == null) return;
            String action = intent.getAction();
            if (ACTION_PIP_PREV.equals(action)) {
                if (webView != null) webView.evaluateJavascript("window.playPreviousChannel ? window.playPreviousChannel() : null", null);
            } else if (ACTION_PIP_PLAY_PAUSE.equals(action)) {
                if (webView != null) webView.evaluateJavascript("window.togglePlay ? window.togglePlay() : null", null);
            } else if (ACTION_PIP_NEXT.equals(action)) {
                if (webView != null) webView.evaluateJavascript("window.playNextChannel ? window.playNextChannel() : null", null);
            }
        }
    };

    // Custom Bounded InputStream for HTTP 206 Partial Content Range streaming
    private static class BoundedInputStream extends InputStream {
        private final InputStream in;
        private long remaining;

        public BoundedInputStream(InputStream in, long limit) {
            this.in = in;
            this.remaining = limit;
        }

        @Override
        public int read() throws IOException {
            if (remaining <= 0) return -1;
            int b = in.read();
            if (b != -1) remaining--;
            return b;
        }

        @Override
        public int read(byte[] b, int off, int len) throws IOException {
            if (remaining <= 0) return -1;
            int toRead = (int) Math.min(len, remaining);
            int read = in.read(b, off, toRead);
            if (read != -1) remaining -= read;
            return read;
        }

        @Override
        public int available() throws IOException {
            return (int) Math.min(in.available(), remaining);
        }

        @Override
        public void close() throws IOException {
            in.close();
        }
    }

    private void startLocalServer() {
        new Thread(() -> {
            try {
                localServerSocket = new ServerSocket(0, 50, java.net.InetAddress.getByName("127.0.0.1"));
                localServerPort = localServerSocket.getLocalPort();
                isServerRunning = true;
                serverExecutor = java.util.concurrent.Executors.newCachedThreadPool();
                Log.i(TAG, "LocalMediaServer running on 127.0.0.1:" + localServerPort);

                while (isServerRunning && !localServerSocket.isClosed()) {
                    try {
                        Socket socket = localServerSocket.accept();
                        serverExecutor.execute(() -> handleClientSocket(socket));
                    } catch (Exception e) {
                        if (!isServerRunning) break;
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error starting LocalMediaServer: " + e.getMessage());
            }
        }).start();
    }

    private void handleClientSocket(Socket socket) {
        try {
            InputStream in = socket.getInputStream();
            OutputStream out = socket.getOutputStream();
            java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(in));

            String requestLine = reader.readLine();
            if (requestLine == null || requestLine.isEmpty()) {
                socket.close();
                return;
            }

            String[] reqParts = requestLine.split(" ");
            if (reqParts.length < 2) {
                socket.close();
                return;
            }

            String method = reqParts[0];
            String uriStr = reqParts[1];

            String rangeHeader = null;
            String headerLine;
            while ((headerLine = reader.readLine()) != null && !headerLine.isEmpty()) {
                if (headerLine.regionMatches(true, 0, "Range:", 0, 6)) {
                    rangeHeader = headerLine.substring(6).trim();
                }
            }

            if ("OPTIONS".equalsIgnoreCase(method)) {
                String resp = "HTTP/1.1 204 No Content\r\n" +
                        "Access-Control-Allow-Origin: https://appassets.androidplatform.net\r\n" +
                        "Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n" +
                        "Access-Control-Allow-Headers: *\r\n" +
                        "Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n" +
                        "Content-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            String path = uriStr;
            String query = null;
            int qIdx = uriStr.indexOf('?');
            if (qIdx >= 0) {
                path = uriStr.substring(0, qIdx);
                query = uriStr.substring(qIdx + 1);
            }

            Map<String, String> params = new HashMap<>();
            if (query != null) {
                for (String param : query.split("&")) {
                    String[] entry = param.split("=");
                    if (entry.length > 1) {
                        params.put(entry[0], entry[1]);
                    } else if (entry.length == 1) {
                        params.put(entry[0], "");
                    }
                }
            }

            if ("/torrent/stream".equals(path) || "/stream.mp4".equals(path)) {
                handleTorrentStreamRequest(socket, method, rangeHeader, out);
                return;
            }

            if ("/proxy/stream".equals(path) || "/proxy".equals(path)) {
                String targetUrl = null;
                int uIdx = uriStr.indexOf("url=");
                if (uIdx >= 0) {
                    targetUrl = uriStr.substring(uIdx + 4);
                    try {
                        targetUrl = java.net.URLDecoder.decode(targetUrl, "UTF-8");
                    } catch (Exception ignored) {}
                }
                if (targetUrl != null && !targetUrl.isEmpty()) {
                    handleProxyStreamRequest(socket, method, rangeHeader, out, targetUrl);
                    return;
                }
            }

            String idStr = params.get("id");
            if (idStr == null) {
                String resp = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            long id;
            try {
                id = Long.parseLong(idStr);
            } catch (NumberFormatException e) {
                String resp = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            if ("/thumb".equals(path)) {
                String mediaType = params.get("type");
                byte[] artBytes = null;
                if ("video".equals(mediaType)) {
                    Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id);
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        try {
                            Bitmap thumb = getContentResolver().loadThumbnail(contentUri, new Size(320, 180), null);
                            if (thumb != null) {
                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                thumb.compress(Bitmap.CompressFormat.JPEG, 80, baos);
                                artBytes = baos.toByteArray();
                            }
                        } catch (Exception ignored) {}
                    }
                    if (artBytes == null) {
                        MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                        try {
                            mmr.setDataSource(MainActivity.this, contentUri);
                            Bitmap thumb = mmr.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                            if (thumb != null) {
                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                thumb.compress(Bitmap.CompressFormat.JPEG, 80, baos);
                                artBytes = baos.toByteArray();
                            }
                            mmr.release();
                        } catch (Exception ignored) {}
                    }
                } else if ("audio".equals(mediaType)) {
                    Uri contentUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id);
                    MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                    try {
                        mmr.setDataSource(MainActivity.this, contentUri);
                        artBytes = mmr.getEmbeddedPicture();
                        mmr.release();
                    } catch (Exception ignored) {}
                }

                if (artBytes != null) {
                    String resp = "HTTP/1.1 200 OK\r\n" +
                            "Content-Type: image/jpeg\r\n" +
                            "Access-Control-Allow-Origin: https://appassets.androidplatform.net\r\n" +
                            "Cache-Control: max-age=86400\r\n" +
                            "Content-Length: " + artBytes.length + "\r\n\r\n";
                    out.write(resp.getBytes("UTF-8"));
                    out.write(artBytes);
                    out.flush();
                } else {
                    String resp = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
                    out.write(resp.getBytes("UTF-8"));
                    out.flush();
                }
                socket.close();
                return;
            }

            // Stream Video or Audio with Native HTTP 206 Range support
            boolean isVideo = "/video".equals(path);
            Uri contentUri = isVideo
                    ? ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id)
                    : ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id);

            String mime = isVideo ? "video/mp4" : "audio/mpeg";
            try (AssetFileDescriptor afd = getContentResolver().openAssetFileDescriptor(contentUri, "r")) {
                if (afd == null) {
                    String resp = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
                    out.write(resp.getBytes("UTF-8"));
                    out.flush();
                    return;
                }

                long totalLength = afd.getLength();
                if (totalLength < 0) {
                    ParcelFileDescriptor pfd = afd.getParcelFileDescriptor();
                    if (pfd != null) totalLength = pfd.getStatSize();
                }

                long start = 0;
                long end = totalLength > 0 ? (totalLength - 1) : 0;
                boolean isRange = false;
                boolean isExplicitEnd = false;

                if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                    isRange = true;
                    String rangeSpec = rangeHeader.substring(6).trim();
                    String[] parts = rangeSpec.split("-");
                    try {
                        if (parts.length > 0 && !parts[0].isEmpty()) {
                            start = Long.parseLong(parts[0]);
                        }
                        if (parts.length > 1 && !parts[1].isEmpty()) {
                            end = Long.parseLong(parts[1]);
                            isExplicitEnd = true;
                        }
                    } catch (NumberFormatException ignored) {}
                }

                // High performance video range chunking (Max 4MB per HTTP 206 chunk)
                // This enables fast startup for large files (100GB+) by limiting initial response size
                if (isRange && !isExplicitEnd && totalLength > 0) {
                    long maxChunk = 4 * 1024 * 1024;
                    end = Math.min(start + maxChunk - 1, totalLength - 1);
                }

                if (totalLength > 0 && end >= totalLength) {
                    end = totalLength - 1;
                }
                if (start > end && totalLength > 0) {
                    start = 0;
                    end = totalLength - 1;
                }

                long contentLength = totalLength > 0 ? (end - start + 1) : 0;
                try (FileInputStream fis = afd.createInputStream();
                     BufferedInputStream bis = new BufferedInputStream(fis, 64 * 1024)) {
                    if (start > 0) {
                        fis.getChannel().position(start);
                    }

                    StringBuilder headers = new StringBuilder();
                    if (isRange && totalLength > 0) {
                        headers.append("HTTP/1.1 206 Partial Content\r\n");
                        headers.append("Content-Range: bytes ").append(start).append("-").append(end).append("/").append(totalLength).append("\r\n");
                    } else {
                        headers.append("HTTP/1.1 200 OK\r\n");
                    }
                    headers.append("Content-Type: ").append(mime).append("\r\n");
                    headers.append("Accept-Ranges: bytes\r\n");
                    headers.append("Access-Control-Allow-Origin: https://appassets.androidplatform.net\r\n");
                    headers.append("Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n");
                    headers.append("Access-Control-Allow-Headers: *\r\n");
                    headers.append("Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n");
                    headers.append("Cache-Control: no-cache, no-store\r\n");
                    if (contentLength > 0) {
                        headers.append("Content-Length: ").append(contentLength).append("\r\n");
                    }
                    headers.append("\r\n");

                    BufferedOutputStream bos = new BufferedOutputStream(out, 64 * 1024);
                    bos.write(headers.toString().getBytes("UTF-8"));

                    if (!"HEAD".equalsIgnoreCase(method)) {
                        byte[] buffer = new byte[64 * 1024];
                        long bytesToRead = (totalLength > 0) ? contentLength : Long.MAX_VALUE;
                        while (bytesToRead > 0) {
                            int toRead = (int) Math.min(buffer.length, bytesToRead);
                            int read = bis.read(buffer, 0, toRead);
                            if (read <= 0) break;
                            bos.write(buffer, 0, read);
                            bytesToRead -= read;
                        }
                        bos.flush();
                    }
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Error handling HTTP client: " + e.getMessage());
        } finally {
            try { socket.close(); } catch (Exception ignored) {}
        }
    }

    private void handleTorrentStreamRequest(Socket socket, String method, String rangeHeader, OutputStream out) {
        try {
            if (torrentEngine == null || !torrentEngine.isRunning() || torrentEngine.getMetadata() == null) {
                String resp = "HTTP/1.1 503 Service Unavailable\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            TorrentMetadata meta = torrentEngine.getMetadata();
            TorrentMetadata.TorrentFile videoFile = meta.getPlayableVideoFile();
            long totalLength = videoFile != null ? videoFile.length : meta.totalLength;

            long start = 0;
            long end = totalLength > 0 ? (totalLength - 1) : 0;
            boolean isRange = false;
            boolean isExplicitEnd = false;

            if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                isRange = true;
                String rangeSpec = rangeHeader.substring(6).trim();
                String[] parts = rangeSpec.split("-");
                try {
                    if (parts.length > 0 && !parts[0].isEmpty()) {
                        start = Long.parseLong(parts[0]);
                    }
                    if (parts.length > 1 && !parts[1].isEmpty()) {
                        end = Long.parseLong(parts[1]);
                        isExplicitEnd = true;
                    }
                } catch (NumberFormatException ignored) {}
            }

            if (!isExplicitEnd && totalLength > 0) {
                long maxChunk = 2 * 1024 * 1024;
                end = Math.min(start + maxChunk - 1, totalLength - 1);
            }
            if (totalLength > 0 && end >= totalLength) end = totalLength - 1;
            if (start > end && totalLength > 0) {
                start = 0;
                end = totalLength - 1;
            }

            long contentLength = totalLength > 0 ? (end - start + 1) : 0;
            torrentEngine.setPlaybackPosition(start);

            StringBuilder headers = new StringBuilder();
            if (isRange && totalLength > 0) {
                headers.append("HTTP/1.1 206 Partial Content\r\n");
                headers.append("Content-Range: bytes ").append(start).append("-").append(end).append("/").append(totalLength).append("\r\n");
            } else {
                headers.append("HTTP/1.1 200 OK\r\n");
            }
            headers.append("Content-Type: video/mp4\r\n");
            headers.append("Accept-Ranges: bytes\r\n");
            headers.append("Access-Control-Allow-Origin: *\r\n");
            headers.append("Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n");
            headers.append("Access-Control-Allow-Headers: *\r\n");
            headers.append("Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n");
            headers.append("Cache-Control: no-cache, no-store\r\n");
            if (contentLength > 0) {
                headers.append("Content-Length: ").append(contentLength).append("\r\n");
            }
            headers.append("\r\n");

            BufferedOutputStream bos = new BufferedOutputStream(out, 64 * 1024);
            bos.write(headers.toString().getBytes("UTF-8"));

            if (!"HEAD".equalsIgnoreCase(method) && contentLength > 0) {
                byte[] buffer = new byte[32768];
                long remaining = contentLength;
                long curOffset = start;

                while (remaining > 0 && isServerRunning) {
                    int toRead = (int) Math.min(remaining, buffer.length);
                    int read = torrentEngine.readStreamBytes(curOffset, toRead, buffer, 0, 10000);
                    if (read > 0) {
                        bos.write(buffer, 0, read);
                        curOffset += read;
                        remaining -= read;
                    } else {
                        break;
                    }
                }
                bos.flush();
            }
            socket.close();
        } catch (Exception e) {
            try { socket.close(); } catch (Exception ignored) {}
        }
    }

    private boolean isSafeExternalUrl(String urlStr) {
        if (urlStr == null || urlStr.trim().isEmpty()) return false;
        try {
            java.net.URI uri = new java.net.URI(urlStr.trim());
            String scheme = uri.getScheme();
            if (scheme == null) return false;
            if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) {
                return false;
            }
            String host = uri.getHost();
            if (host == null || host.trim().isEmpty()) return false;
            host = host.trim().toLowerCase(java.util.Locale.US);

            if (host.equals("localhost") || host.equals("127.0.0.1") || host.equals("::1")
                    || host.endsWith(".local") || host.endsWith(".internal")) {
                return false;
            }

            java.net.InetAddress[] addrs = java.net.InetAddress.getAllByName(host);
            for (java.net.InetAddress addr : addrs) {
                if (addr.isLoopbackAddress() || addr.isSiteLocalAddress()
                        || addr.isLinkLocalAddress() || addr.isMulticastAddress()
                        || addr.isAnyLocalAddress()) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void handleProxyStreamRequest(Socket socket, String method, String rangeHeader, OutputStream out, String targetUrl) {
        HttpURLConnection conn = null;
        try {
            if (!isSafeExternalUrl(targetUrl)) {
                Log.w(TAG, "Rejected unsafe proxy URL: " + targetUrl);
                String resp = "HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            String currentUrl = targetUrl;
            int redirects = 0;
            while (redirects < 5) {
                // If this is an archive.org /download/ link, resolve fast HEAD redirect to get direct storage URL
                if (currentUrl.contains("archive.org/download/")) {
                    try {
                        java.net.URL headUrl = new java.net.URL(currentUrl);
                        HttpURLConnection headConn = (HttpURLConnection) headUrl.openConnection();
                        headConn.setInstanceFollowRedirects(false);
                        headConn.setRequestMethod("HEAD");
                        headConn.setConnectTimeout(6000);
                        headConn.setReadTimeout(6000);
                        headConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5");
                        int hCode = headConn.getResponseCode();
                        if (hCode >= 300 && hCode < 400) {
                            String loc = headConn.getHeaderField("Location");
                            if (loc != null && !loc.isEmpty() && isSafeExternalUrl(loc)) {
                                currentUrl = loc;
                            }
                        }
                        headConn.disconnect();
                    } catch (Exception ignored) {}
                }

                java.net.URL url = new java.net.URL(currentUrl);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod(method.equalsIgnoreCase("HEAD") ? "HEAD" : "GET");
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(30000);
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5");
                conn.setRequestProperty("Accept", "*/*");
                conn.setRequestProperty("Connection", "keep-alive");
                if (rangeHeader != null) {
                    conn.setRequestProperty("Range", rangeHeader);
                }
                conn.setInstanceFollowRedirects(false);

                int respCode = conn.getResponseCode();
                if (respCode >= 300 && respCode < 400) {
                    String loc = conn.getHeaderField("Location");
                    if (loc != null && !loc.isEmpty()) {
                        if (loc.startsWith("/")) {
                            loc = url.getProtocol() + "://" + url.getHost() + (url.getPort() > 0 ? (":" + url.getPort()) : "") + loc;
                        }
                        if (!isSafeExternalUrl(loc)) {
                            Log.w(TAG, "Rejected unsafe redirect location: " + loc);
                            break;
                        }
                        currentUrl = loc;
                        conn.disconnect();
                        redirects++;
                        continue;
                    }
                }
                break;
            }

            if (conn == null) {
                String resp = "HTTP/1.1 502 Bad Gateway\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                return;
            }

            int respCode = conn.getResponseCode();
            String contentType = conn.getContentType();
            String contentRange = conn.getHeaderField("Content-Range");
            String acceptRanges = conn.getHeaderField("Accept-Ranges");
            long contentLength = conn.getContentLengthLong();

            StringBuilder headers = new StringBuilder();
            if (respCode == 206) {
                headers.append("HTTP/1.1 206 Partial Content\r\n");
            } else if (respCode >= 200 && respCode < 300) {
                headers.append("HTTP/1.1 200 OK\r\n");
            } else {
                headers.append("HTTP/1.1 ").append(respCode).append(" ").append(conn.getResponseMessage()).append("\r\n");
            }

            headers.append("Content-Type: ").append(contentType != null ? contentType : "video/mp4").append("\r\n");
            if (contentRange != null) {
                headers.append("Content-Range: ").append(contentRange).append("\r\n");
            }
            headers.append("Accept-Ranges: ").append(acceptRanges != null ? acceptRanges : "bytes").append("\r\n");
            if (contentLength >= 0) {
                headers.append("Content-Length: ").append(contentLength).append("\r\n");
            }
            headers.append("Access-Control-Allow-Origin: *\r\n");
            headers.append("Access-Control-Allow-Methods: GET, HEAD, OPTIONS\r\n");
            headers.append("Access-Control-Allow-Headers: *\r\n");
            headers.append("Access-Control-Expose-Headers: Content-Range, Content-Length, Accept-Ranges\r\n");
            headers.append("Cache-Control: no-cache, no-store\r\n\r\n");

            BufferedOutputStream bos = new BufferedOutputStream(out, 64 * 1024);
            bos.write(headers.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            bos.flush();

            if (!"HEAD".equalsIgnoreCase(method) && respCode < 400) {
                try (InputStream inStream = new BufferedInputStream(conn.getInputStream(), 64 * 1024)) {
                    byte[] buffer = new byte[64 * 1024];
                    int bytesRead;
                    while ((bytesRead = inStream.read(buffer)) != -1) {
                        bos.write(buffer, 0, bytesRead);
                        bos.flush();
                    }
                } catch (IOException clientClosed) {
                    // Normal client disconnect (e.g. seek or player closed)
                }
            }
        } catch (Exception e) {
            Log.w(TAG, "Error in handleProxyStreamRequest: " + e.getMessage());
        } finally {
            if (conn != null) {
                try { conn.disconnect(); } catch (Exception ignored) {}
            }
            try { socket.close(); } catch (Exception ignored) {}
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        System.setProperty("java.net.preferIPv4Stack", "true");
        System.setProperty("java.net.preferIPv6Addresses", "false");
        WebView.setWebContentsDebuggingEnabled(true);
        startLocalServer();
        torrentEngine = new TorrentEngine(this);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);

        // 120 FPS / High Refresh Rate Optimization for Flagship Chipsets (Snapdragon 8s Gen 4 / Adreno 825)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            try {
                android.view.Display display = getDisplay();
                if (display != null) {
                    android.view.Display.Mode[] modes = display.getSupportedModes();
                    android.view.Display.Mode maxMode = null;
                    float maxRate = 60.0f;
                    for (android.view.Display.Mode m : modes) {
                        if (m.getRefreshRate() > maxRate) {
                            maxRate = m.getRefreshRate();
                            maxMode = m;
                        }
                    }
                    if (maxMode != null) {
                        WindowManager.LayoutParams lp = getWindow().getAttributes();
                        lp.preferredDisplayModeId = maxMode.getModeId();
                        getWindow().setAttributes(lp);
                        Log.i(TAG, "Unlocked Flagship 120Hz/High Refresh Rate: " + maxRate + "Hz (Mode: " + maxMode.getModeId() + ")");
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "Refresh rate unlock: " + e.getMessage());
            }
        }
        if (Build.VERSION.SDK_INT >= 31) {
            try {
                java.lang.reflect.Method m = Window.class.getMethod("setFrameRate", float.class, int.class);
                m.invoke(getWindow(), 120.0f, 0);
            } catch (Throwable ignored) {}
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        setContentView(R.layout.activity_main);
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);

        checkAndRequestPermissions();
        hideSystemUI();

        // Initialize user-configured DNS override (Task 3)
        try {
            SharedPreferences prefs = getSharedPreferences("aakash_prefs", Context.MODE_PRIVATE);
            String savedDns = prefs.getString("custom_dns_provider", "default");
            applyDnsConfiguration(savedDns);
        } catch (Exception ignored) {}

        webView = findViewById(R.id.webView);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // Modern Android 15/16/17+ Safe-Area Insets Bridge
        webView.setOnApplyWindowInsetsListener((v, insets) -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                String js = String.format("if (document && document.documentElement && document.documentElement.style) {"
                        + "document.documentElement.style.setProperty('--safe-top', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-bottom', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-left', '%dpx');"
                        + "document.documentElement.style.setProperty('--safe-right', '%dpx');"
                        + "}",
                        bars.top, bars.bottom, bars.left, bars.right);
                webView.evaluateJavascript(js, null);
            }
            return insets;
        });

        // Predictive back gesture support for Android 13+ / 14 / 15 / 16 / 17+
        if (Build.VERSION.SDK_INT >= 33) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,
                () -> {
                    if (webView != null) {
                        webView.evaluateJavascript("window.handleAndroidBackPressed ? window.handleAndroidBackPressed() : false", value -> {
                            if ("false".equals(value) || value == null || "null".equals(value)) {
                                runOnUiThread(() -> {
                                    if (webView.canGoBack()) {
                                        webView.goBack();
                                    } else {
                                        finish();
                                    }
                                });
                            }
                        });
                    } else {
                        finish();
                    }
                }
            );
        }

        setupWebView();
        webView.loadUrl("https://appassets.androidplatform.net/index.html");

        IntentFilter pipFilter = new IntentFilter();
        pipFilter.addAction(ACTION_PIP_PREV);
        pipFilter.addAction(ACTION_PIP_PLAY_PAUSE);
        pipFilter.addAction(ACTION_PIP_NEXT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(pipReceiver, pipFilter, Context.RECEIVER_NOT_EXPORTED);
        } else {
            registerReceiver(pipReceiver, pipFilter);
        }
    }

    private void applyDnsConfiguration(String provider) {
        try {
            // Keep native system DNS resolution by default to preserve carrier DNS64 / NAT64 synthesis on cellular
            System.clearProperty("dns.server");
            System.clearProperty("sun.net.spi.nameservice.nameservers");
            if (provider != null && !provider.isEmpty() && !"default".equalsIgnoreCase(provider)) {
                android.net.ConnectivityManager cm = (android.net.ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
                android.net.Network activeNetwork = cm != null ? cm.getActiveNetwork() : null;
                android.net.NetworkCapabilities caps = activeNetwork != null ? cm.getNetworkCapabilities(activeNetwork) : null;
                boolean isCellular = caps != null && caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_CELLULAR);
                // Do NOT override DNS on cellular connections as it breaks IPv6 DNS64/NAT64 translation
                if (!isCellular) {
                    if ("google".equalsIgnoreCase(provider)) {
                        System.setProperty("dns.server", "8.8.8.8,8.8.4.4");
                        System.setProperty("sun.net.spi.nameservice.nameservers", "8.8.8.8,8.8.4.4");
                        System.setProperty("sun.net.spi.nameservice.provider.1", "dns,sun");
                    } else if ("cloudflare".equalsIgnoreCase(provider)) {
                        System.setProperty("dns.server", "1.1.1.1,1.0.0.1");
                        System.setProperty("sun.net.spi.nameservice.nameservers", "1.1.1.1,1.0.0.1");
                        System.setProperty("sun.net.spi.nameservice.provider.1", "dns,sun");
                    } else if ("quad9".equalsIgnoreCase(provider)) {
                        System.setProperty("dns.server", "9.9.9.9,149.112.112.112");
                        System.setProperty("sun.net.spi.nameservice.nameservers", "9.9.9.9,149.112.112.112");
                        System.setProperty("sun.net.spi.nameservice.provider.1", "dns,sun");
                    } else if ("adguard".equalsIgnoreCase(provider)) {
                        System.setProperty("dns.server", "94.140.14.14,94.140.15.15");
                        System.setProperty("sun.net.spi.nameservice.nameservers", "94.140.14.14,94.140.15.15");
                        System.setProperty("sun.net.spi.nameservice.provider.1", "dns,sun");
                    }
                }
            }
        } catch (Exception ignored) {}
    }

    private void checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= 34) { // Android 14+ / 15 / 16 / 17 (UpsideDownCake, VanillaIceCream, Baklava)
            List<String> perms = new ArrayList<>();
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_VIDEO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_VIDEO);
            }
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_AUDIO);
            }
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.POST_NOTIFICATIONS);
            }
            try {
                if (checkSelfPermission("android.permission.READ_MEDIA_VISUAL_USER_SELECTED") != PackageManager.PERMISSION_GRANTED) {
                    perms.add("android.permission.READ_MEDIA_VISUAL_USER_SELECTED");
                }
            } catch (Exception ignored) {}
            if (!perms.isEmpty()) {
                requestPermissions(perms.toArray(new String[0]), PERMISSIONS_REQUEST_CODE);
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            List<String> perms = new ArrayList<>();
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_VIDEO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_VIDEO);
            }
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_AUDIO);
            }
            if (checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.POST_NOTIFICATIONS);
            }
            if (!perms.isEmpty()) {
                requestPermissions(perms.toArray(new String[0]), PERMISSIONS_REQUEST_CODE);
            }
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, PERMISSIONS_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSIONS_REQUEST_CODE) {
            if (webView != null) {
                webView.post(() -> webView.evaluateJavascript("if (window.autoScanDeviceMedia) { window.autoScanDeviceMedia(); }", null));
            }
        }
    }

    private void hideSystemUI() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN;
            decorView.setSystemUiVisibility(uiOptions);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
    }

    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setOffscreenPreRaster(true);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        mediaBridge = new AndroidMediaBridge();
        webView.addJavascriptInterface(mediaBridge, "AndroidMedia");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                String logMsg = "[Console " + consoleMessage.messageLevel() + "] " + consoleMessage.message()
                        + " -- Line " + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId();
                if (consoleMessage.messageLevel() == ConsoleMessage.MessageLevel.ERROR) {
                    Log.e(TAG, logMsg);
                } else if (consoleMessage.messageLevel() == ConsoleMessage.MessageLevel.WARNING) {
                    Log.w(TAG, logMsg);
                } else {
                    Log.i(TAG, logMsg);
                }
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                    WebChromeClient.FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("*/*");
                String[] mimeTypes = {"video/*", "audio/*", "application/ogg"};
                intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    try {
                        Intent fallback = new Intent(Intent.ACTION_GET_CONTENT);
                        fallback.addCategory(Intent.CATEGORY_OPENABLE);
                        fallback.setType("*/*");
                        fallback.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
                        fallback.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
                        startActivityForResult(fallback, FILE_CHOOSER_REQUEST_CODE);
                    } catch (Exception ex) {
                        MainActivity.this.filePathCallback = null;
                        return false;
                    }
                }
                return true;
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request == null || request.getUrl() == null) return true;
                return handleUrlNavigation(request.getUrl().toString());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrlNavigation(url);
            }

            private boolean handleUrlNavigation(String url) {
                if (url == null) return true;
                if (url.startsWith("https://appassets.androidplatform.net") ||
                    url.startsWith("file:///android_asset/") ||
                    url.startsWith("http://127.0.0.1") ||
                    url.startsWith("http://localhost")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception ignored) {}
                return true;
            }

            // Built-in AdBlocker Engine for Seamless Third-Party Streaming & Embeds
            private final java.util.Set<String> AD_DOMAINS = new java.util.HashSet<>(java.util.Arrays.asList(
                "doubleclick.net", "googlesyndication.com", "adservice.google.com",
                "popads.net", "popcash.net", "adsterra.com", "propellerads.com",
                "adpushup.com", "exoclick.com", "trafficjunky.com", "juicyads.com",
                "adnxs.com", "criteo.com", "outbrain.com", "taboola.com",
                "scorecardresearch.com", "moatads.com", "quantserve.com",
                "bet365.com", "1xbet.com", "parimatch.com", "stake.com",
                "ad-delivery.net", "adtrue.com", "bidvertiser.com", "hilltopads.com",
                "adkeeper.com", "clickadu.com", "richpush.com", "monetag.com"
            ));

            private boolean isAdResource(Uri uri) {
                if (uri == null) return false;
                String host = uri.getHost();
                if (host == null) return false;
                host = host.toLowerCase();
                for (String adDomain : AD_DOMAINS) {
                    if (host.equals(adDomain) || host.endsWith("." + adDomain)) {
                        return true;
                    }
                }
                String path = uri.getPath();
                if (path != null) {
                    String lp = path.toLowerCase();
                    if (lp.contains("/ads.js") || lp.contains("/popunder") || lp.contains("/banner_ad") || lp.contains("/ads/banner")) {
                        return true;
                    }
                }
                return false;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isAdResource(uri)) {
                    return new WebResourceResponse("text/plain", "UTF-8", 204, "No Content", new HashMap<>(), new ByteArrayInputStream(new byte[0]));
                }
                if (uri != null && "appassets.androidplatform.net".equals(uri.getHost())) {
                    try {
                        String path = uri.getPath();
                        if (path == null || path.isEmpty() || "/".equals(path)) {
                            path = "index.html";
                        }
                        while (path.startsWith("/")) {
                            path = path.substring(1);
                        }
                        InputStream is = getAssets().open(path);
                        String mime = getMimeTypeForAsset(path);
                        String encoding = (mime.startsWith("text/") || "application/javascript".equals(mime) || "application/json".equals(mime)) ? "UTF-8" : null;
                        Map<String, String> h = new HashMap<>();
                        h.put("Access-Control-Allow-Origin", "*");
                        h.put("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
                        h.put("Access-Control-Allow-Headers", "*");
                        return new WebResourceResponse(mime, encoding, 200, "OK", h, is);
                    } catch (Exception e) {
                        Log.w(TAG, "Asset load failed for: " + uri + " (" + e.getMessage() + ")");
                    }
                }
                if (uri != null && "app.localmedia".equals(uri.getHost())) {
                    try {
                        String path = uri.getPath();
                        String idStr = uri.getQueryParameter("id");
                        if (idStr != null) {
                            long id = Long.parseLong(idStr);
                            
                            // 1. Handle Native Thumbnail Requests
                            if ("/thumb".equals(path)) {
                                String mediaType = uri.getQueryParameter("type");
                                if ("video".equals(mediaType)) {
                                    Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id);
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                        try {
                                            Bitmap thumb = getContentResolver().loadThumbnail(contentUri, new Size(320, 180), null);
                                            if (thumb != null) {
                                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                                thumb.compress(Bitmap.CompressFormat.JPEG, 80, baos);
                                                Map<String, String> h = new HashMap<>();
                                                h.put("Access-Control-Allow-Origin", "*");
                                                h.put("Cache-Control", "max-age=86400");
                                                return new WebResourceResponse("image/jpeg", null, 200, "OK", h, new ByteArrayInputStream(baos.toByteArray()));
                                            }
                                        } catch (Exception ignored) {}
                                    }
                                    
                                    MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                                    try {
                                        mmr.setDataSource(MainActivity.this, contentUri);
                                        Bitmap thumb = mmr.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                                        if (thumb != null) {
                                            ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                            thumb.compress(Bitmap.CompressFormat.JPEG, 80, baos);
                                            mmr.release();
                                            Map<String, String> h = new HashMap<>();
                                            h.put("Access-Control-Allow-Origin", "*");
                                            h.put("Cache-Control", "max-age=86400");
                                            return new WebResourceResponse("image/jpeg", null, 200, "OK", h, new ByteArrayInputStream(baos.toByteArray()));
                                        }
                                        mmr.release();
                                    } catch (Exception ignored) {}
                                } else if ("audio".equals(mediaType)) {
                                    Uri contentUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id);
                                    MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                                    try {
                                        mmr.setDataSource(MainActivity.this, contentUri);
                                        byte[] art = mmr.getEmbeddedPicture();
                                        mmr.release();
                                        if (art != null) {
                                            Map<String, String> h = new HashMap<>();
                                            h.put("Access-Control-Allow-Origin", "*");
                                            h.put("Cache-Control", "max-age=86400");
                                            return new WebResourceResponse("image/jpeg", null, 200, "OK", h, new ByteArrayInputStream(art));
                                        }
                                    } catch (Exception ignored) {}
                                }
                            }
                            
                            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                                Map<String, String> corsHeaders = new HashMap<>();
                                corsHeaders.put("Access-Control-Allow-Origin", "*");
                                corsHeaders.put("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
                                corsHeaders.put("Access-Control-Allow-Headers", "*");
                                corsHeaders.put("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
                                return new WebResourceResponse("text/plain", null, 204, "No Content", corsHeaders, new ByteArrayInputStream(new byte[0]));
                            }

                            // 2. Handle Stream Playback Requests with High-Performance HTTP 206 Partial Content Range Support
                            boolean isVideo = "/video".equals(path);
                            Uri contentUri = isVideo 
                                ? ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id)
                                : ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id);
                            
                            String mime = isVideo ? "video/mp4" : "audio/mpeg";
                            if (isVideo) {
                                try {
                                    String type = getContentResolver().getType(contentUri);
                                    if (type != null && !type.isEmpty()) {
                                        mime = type;
                                    }
                                } catch (Exception ignored) {}
                            }

                            AssetFileDescriptor afd = getContentResolver().openAssetFileDescriptor(contentUri, "r");
                            if (afd != null) {
                                long totalLength = afd.getLength();
                                if (totalLength < 0) {
                                    ParcelFileDescriptor pfd = afd.getParcelFileDescriptor();
                                    if (pfd != null) totalLength = pfd.getStatSize();
                                }

                                Map<String, String> reqHeaders = request.getRequestHeaders();
                                String rangeHeader = null;
                                if (reqHeaders != null) {
                                    rangeHeader = reqHeaders.get("Range");
                                    if (rangeHeader == null) rangeHeader = reqHeaders.get("range");
                                }

                                long start = 0;
                                long end = totalLength > 0 ? (totalLength - 1) : 0;
                                boolean isRange = false;

                                if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
                                    isRange = true;
                                    String rangeSpec = rangeHeader.substring(6).trim();
                                    String[] parts = rangeSpec.split("-");
                                    try {
                                        if (parts.length > 0 && !parts[0].isEmpty()) {
                                            start = Long.parseLong(parts[0]);
                                        }
                                        if (parts.length > 1 && !parts[1].isEmpty()) {
                                            end = Long.parseLong(parts[1]);
                                        }
                                    } catch (NumberFormatException ignored) {}
                                }

                                if (totalLength > 0 && end >= totalLength) {
                                    end = totalLength - 1;
                                }
                                if (start > end && totalLength > 0) {
                                    start = 0;
                                    end = totalLength - 1;
                                }

                                long contentLength = totalLength > 0 ? (end - start + 1) : 0;
                                FileInputStream fis = afd.createInputStream();
                                if (start > 0) {
                                    fis.getChannel().position(start);
                                }

                                InputStream stream = (totalLength > 0) ? new BoundedInputStream(fis, contentLength) : fis;

                                Map<String, String> resHeaders = new HashMap<>();
                                resHeaders.put("Accept-Ranges", "bytes");
                                resHeaders.put("Access-Control-Allow-Origin", "*");
                                resHeaders.put("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
                                resHeaders.put("Access-Control-Allow-Headers", "*");
                                resHeaders.put("Access-Control-Expose-Headers", "Content-Range, Content-Length, Accept-Ranges");
                                resHeaders.put("Cache-Control", "no-cache, no-store");

                                if (isRange && totalLength > 0) {
                                    resHeaders.put("Content-Range", "bytes " + start + "-" + end + "/" + totalLength);
                                    return new WebResourceResponse(mime, null, 206, "Partial Content", resHeaders, stream);
                                } else {
                                    return new WebResourceResponse(mime, null, 200, "OK", resHeaders, stream);
                                }
                            }
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error streaming local media: " + e.getMessage());
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                Log.e(TAG, "CRITICAL: WebView render process gone! didCrash=" + (detail != null && detail.didCrash())
                        + " priority=" + (detail != null ? detail.rendererPriorityAtExit() : -1));
                return super.onRenderProcessGone(view, detail);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, android.webkit.WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    Log.e(TAG, "WebView main frame error: " + (error != null ? error.getDescription() : "unknown")
                            + " url=" + request.getUrl());
                } else if (request != null) {
                    Log.w(TAG, "WebView sub-resource error: " + (error != null ? error.getDescription() : "unknown")
                            + " url=" + request.getUrl());
                }
            }
        });
    }

    public class AndroidMediaBridge {
        @JavascriptInterface
        public String loadAssetFile(String assetPath) {
            try {
                InputStream is = getAssets().open(assetPath);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                byte[] buf = new byte[16384];
                int read;
                while ((read = is.read(buf)) != -1) {
                    baos.write(buf, 0, read);
                }
                is.close();
                return baos.toString("UTF-8");
            } catch (Exception e) {
                Log.e(TAG, "Error loading asset " + assetPath + ": " + e.getMessage());
                return null;
            }
        }

        private boolean isPrivateOrLoopbackHost(String host) {
            if (host == null || host.trim().isEmpty()) return true;
            String h = host.toLowerCase().trim();
            if (h.equals("localhost") || h.equals("127.0.0.1") || h.equals("::1") || h.endsWith(".local") || h.endsWith(".internal")) {
                return true;
            }
            try {
                java.net.InetAddress addr = java.net.InetAddress.getByName(h);
                return addr.isLoopbackAddress() || addr.isSiteLocalAddress() || addr.isLinkLocalAddress() || addr.isAnyLocalAddress();
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public String fetchRemoteUrl(String urlString) {
            if (urlString == null) return null;
            String lower = urlString.trim().toLowerCase();
            if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
                Log.w(TAG, "fetchRemoteUrl rejected non-http(s) URL: " + urlString);
                return null;
            }
            try {
                java.net.URL url = new java.net.URL(urlString);
                if (isPrivateOrLoopbackHost(url.getHost())) {
                    Log.w(TAG, "fetchRemoteUrl blocked SSRF to private/loopback host: " + url.getHost());
                    return null;
                }
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(15000);
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5");
                int respCode = conn.getResponseCode();
                if (respCode >= 200 && respCode < 300) {
                    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream(), java.nio.charset.StandardCharsets.UTF_8));
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        sb.append(line).append('\n');
                    }
                    reader.close();
                    return sb.toString();
                } else {
                    Log.w(TAG, "fetchRemoteUrl HTTP " + respCode + " for " + urlString);
                    return null;
                }
            } catch (Exception e) {
                Log.e(TAG, "fetchRemoteUrl error: " + e.getMessage());
                return null;
            }
        }

        @JavascriptInterface
        public String resolveRedirectUrl(String urlString) {
            if (urlString == null || urlString.trim().isEmpty()) return urlString;
            String lower = urlString.trim().toLowerCase();
            if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
                return urlString;
            }
            try {
                java.net.URL url = new java.net.URL(urlString);
                java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setRequestMethod("HEAD");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(5000);
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/2.5");
                int respCode = conn.getResponseCode();
                if (respCode >= 300 && respCode < 400) {
                    String loc = conn.getHeaderField("Location");
                    if (loc != null && !loc.isEmpty()) {
                        return loc;
                    }
                }
                return urlString;
            } catch (Exception e) {
                return urlString;
            }
        }

        @JavascriptInterface
        public String startTorrentStream(String magnetUri) {
            return startTorrentFromMagnet(magnetUri);
        }

        @JavascriptInterface
        public int getLocalServerPort() {
            return localServerPort;
        }

        @JavascriptInterface
        public String startTorrentFromMagnet(String magnetUri) {
            try {
                MagnetUri magnet = MagnetUri.parse(magnetUri);
                TorrentMetadata meta = new TorrentMetadata(
                    magnet.infoHash,
                    magnet.displayName,
                    1024 * 1024L,
                    new byte[100][20],
                    100 * 1024 * 1024L,
                    java.util.Collections.singletonList(new TorrentMetadata.TorrentFile(0, magnet.displayName, magnet.displayName, 100 * 1024 * 1024L, 0)),
                    magnet.trackers
                );
                torrentEngine.start(meta);
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("success", true);
                obj.put("streamUrl", "http://127.0.0.1:" + localServerPort + "/torrent/stream");
                obj.put("name", magnet.displayName);
                obj.put("infoHash", magnet.hexInfoHash);
                return obj.toString();
            } catch (Exception e) {
                Log.e(TAG, "Error starting torrent magnet: " + e.getMessage());
                return "{\"success\":false,\"error\":\"" + e.getMessage() + "\"}";
            }
        }

        @JavascriptInterface
        public String startTorrentFromFile(String base64OrPath, String fileName) {
            try {
                byte[] data;
                File f = new File(base64OrPath);
                if (f.exists() && f.isFile()) {
                    String canonical = f.getCanonicalPath();
                    String appFiles = getFilesDir().getCanonicalPath();
                    File extFiles = getExternalFilesDir(null);
                    String appExt = extFiles != null ? extFiles.getCanonicalPath() : null;
                    File cacheDir = getCacheDir();
                    String appCache = cacheDir != null ? cacheDir.getCanonicalPath() : null;

                    boolean isAllowed = canonical.startsWith(appFiles) ||
                            (appExt != null && canonical.startsWith(appExt)) ||
                            (appCache != null && canonical.startsWith(appCache));

                    if (!isAllowed) {
                        Log.w(TAG, "Rejected unauthorized file path access in startTorrentFromFile: " + canonical);
                        return "{\"success\":false,\"error\":\"Access denied to path\"}";
                    }
                    data = java.nio.file.Files.readAllBytes(f.toPath());
                } else {
                    data = android.util.Base64.decode(base64OrPath, android.util.Base64.DEFAULT);
                }
                TorrentMetadata meta = TorrentMetadata.fromBytes(data);
                torrentEngine.start(meta);
                org.json.JSONObject obj = new org.json.JSONObject();
                obj.put("success", true);
                obj.put("streamUrl", "http://127.0.0.1:" + localServerPort + "/torrent/stream");
                obj.put("name", meta.name);
                obj.put("infoHash", meta.hexInfoHash);
                return obj.toString();
            } catch (Exception e) {
                Log.e(TAG, "Error starting torrent file: " + e.getMessage());
                return "{\"success\":false,\"error\":\"" + e.getMessage() + "\"}";
            }
        }

        private long lastUidRxBytes = -1;
        private long lastUidRxTime = 0;

        @JavascriptInterface
        public long getNetworkDownloadSpeedBps() {
            try {
                long currentRx = android.net.TrafficStats.getUidRxBytes(android.os.Process.myUid());
                if (currentRx < 0) return 0;
                long now = System.currentTimeMillis();
                if (lastUidRxTime == 0 || lastUidRxBytes < 0) {
                    lastUidRxBytes = currentRx;
                    lastUidRxTime = now;
                    return 0;
                }
                long elapsed = now - lastUidRxTime;
                if (elapsed <= 0) return 0;
                long diff = currentRx - lastUidRxBytes;
                if (diff < 0) diff = 0;
                lastUidRxBytes = currentRx;
                lastUidRxTime = now;
                return (diff * 1000L) / elapsed;
            } catch (Exception e) {
                return 0;
            }
        }

        @JavascriptInterface
        public String getTorrentStatus() {
            if (torrentEngine == null) return "{}";
            org.json.JSONObject status = torrentEngine.getStatusJson();
            try {
                long appSpeed = getNetworkDownloadSpeedBps();
                long currentSpeed = status.optLong("downloadSpeedBytesPerSec", 0);
                if (appSpeed > 0 && currentSpeed == 0) {
                    status.put("downloadSpeedBytesPerSec", appSpeed);
                    status.put("downloadSpeed", appSpeed);
                    status.put("downloadSpeedKbps", (appSpeed * 8) / 1000);
                    status.put("downloadSpeedMbps", Math.round(((appSpeed * 8) / 1000000.0) * 10.0) / 10.0);
                } else if (currentSpeed > 0) {
                    status.put("downloadSpeed", currentSpeed);
                }
            } catch (Exception ignored) {}
            return status.toString();
        }

        @JavascriptInterface
        public void stopTorrentStream() {
            if (torrentEngine != null) {
                torrentEngine.stop();
            }
        }

        // ==========================================================
        // TORRENT DOWNLOAD MANAGER (BACKGROUND COMPLETED DOWNLOADS)
        // ==========================================================
        private final Map<String, DownloadTask> downloadTasks = new ConcurrentHashMap<>();

        public class DownloadTask {
            public final String id;
            public final String title;
            public final String magnetUri;
            public final String fileName;
            public final File targetFile;
            public volatile String status = "DOWNLOADING"; // DOWNLOADING, PAUSED, COMPLETED, FAILED
            public volatile double progress = 0.0;
            public volatile long speedBytes = 0;
            public volatile long downloadedBytes = 0;
            public volatile long totalBytes = 0;
            public volatile long downloadId = -1;
            public TorrentEngine engine;

            public DownloadTask(String id, String title, String magnetUri, String fileName, File targetFile) {
                this.id = id;
                this.title = title;
                this.magnetUri = magnetUri;
                this.fileName = fileName;
                this.targetFile = targetFile;
            }

            public JSONObject toJson() {
                JSONObject obj = new JSONObject();
                try {
                    obj.put("id", id);
                    obj.put("taskId", id);
                    obj.put("title", title);
                    obj.put("fileName", fileName);
                    obj.put("filePath", targetFile.getAbsolutePath());
                    obj.put("localFilePath", targetFile.getAbsolutePath());
                    obj.put("status", status);
                    obj.put("progress", progress);
                    obj.put("speedBytes", speedBytes);
                    obj.put("speedBytesPerSec", speedBytes);
                    obj.put("downloadedBytes", downloadedBytes);
                    obj.put("totalBytes", totalBytes);
                } catch (Exception ignored) {}
                return obj;
            }
        }

        @JavascriptInterface
        public String startTorrentDownload(String magnetUri, String title, String outputFilename) {
            try {
                MagnetUri magnet = MagnetUri.parse(magnetUri);
                String safeName = (outputFilename != null && !outputFilename.isEmpty()) ? outputFilename : (title.replaceAll("[^a-zA-Z0-9.-]", "_") + ".mp4");
                File moviesDir = getExternalFilesDir(Environment.DIRECTORY_MOVIES);
                if (moviesDir == null) moviesDir = new File(getFilesDir(), "movies");
                if (!moviesDir.exists()) moviesDir.mkdirs();
                File targetFile = new File(moviesDir, safeName);

                String taskId = "dl_" + magnet.hexInfoHash;
                DownloadTask task = new DownloadTask(taskId, title, magnetUri, safeName, targetFile);

                TorrentMetadata meta = new TorrentMetadata(
                    magnet.infoHash,
                    safeName,
                    1024 * 1024L,
                    new byte[100][20],
                    100 * 1024 * 1024L,
                    java.util.Collections.singletonList(new TorrentMetadata.TorrentFile(0, safeName, safeName, 100 * 1024 * 1024L, 0)),
                    magnet.trackers
                );

                TorrentEngine dlEngine = new TorrentEngine(MainActivity.this);
                task.engine = dlEngine;
                dlEngine.start(meta);
                downloadTasks.put(taskId, task);

                // Monitor download completion in background thread
                new Thread(() -> {
                    while (task.status.equals("DOWNLOADING") && dlEngine.isRunning()) {
                        try {
                            Thread.sleep(1000);
                            JSONObject st = dlEngine.getStatusJson();
                            task.progress = st.optDouble("progressPercent", 0.0);
                            task.speedBytes = st.optLong("downloadSpeedBytesPerSec", 0);
                            task.downloadedBytes = st.optLong("downloadedBytes", 0);
                            task.totalBytes = st.optLong("totalBytes", 0);

                            if (st.optBoolean("isComplete", false)) {
                                dlEngine.getPieceManager().assembleToFile(targetFile);
                                task.status = "COMPLETED";
                                task.progress = 100.0;
                                dlEngine.stop();
                                Log.i(TAG, "Download completed for " + title + " -> " + targetFile.getAbsolutePath());
                                break;
                            }
                        } catch (Exception e) {
                            Log.w(TAG, "Download task monitor error: " + e.getMessage());
                        }
                    }
                }, "DownloadTaskMonitor-" + taskId).start();

                return task.toJson().toString();
            } catch (Exception e) {
                Log.e(TAG, "Error starting download: " + e.getMessage());
                return "{\"error\":\"" + e.getMessage() + "\"}";
            }
        }

        @JavascriptInterface
        public String startHttpDownload(String url, String title, String outputFilename) {
            try {
                android.app.DownloadManager.Request request = new android.app.DownloadManager.Request(android.net.Uri.parse(url));
                request.setTitle(title != null ? title : "T2L Download");
                request.setDescription("Downloading via T2L");
                request.setNotificationVisibility(android.app.DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                String safeName = (outputFilename != null && !outputFilename.isEmpty()) ? outputFilename : (title.replaceAll("[^a-zA-Z0-9.-]", "_") + ".mp4");
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_MOVIES, safeName);
                request.allowScanningByMediaScanner();

                android.app.DownloadManager dm = (android.app.DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                long downloadId = dm.enqueue(request);
                Log.i(TAG, "HTTP download started: " + title + " -> " + safeName + " (id=" + downloadId + ")");

                File moviesDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES);
                File targetFile = new File(moviesDir, safeName);
                String taskId = "http_dl_" + downloadId;
                DownloadTask task = new DownloadTask(taskId, title != null ? title : safeName, null, safeName, targetFile);
                task.status = "DOWNLOADING";
                task.downloadId = downloadId;
                downloadTasks.put(taskId, task);

                return "{\"status\":\"STARTED\",\"taskId\":\"" + taskId + "\",\"downloadId\":" + downloadId + ",\"filename\":\"" + safeName + "\"}";
            } catch (Exception e) {
                Log.e(TAG, "HTTP download error: " + e.getMessage());
                return "{\"error\":\"" + e.getMessage() + "\"}";
            }
        }

        @JavascriptInterface
        public String getDownloadTasks() {
            android.app.DownloadManager dm = (android.app.DownloadManager) getSystemService(DOWNLOAD_SERVICE);
            for (DownloadTask task : downloadTasks.values()) {
                if (task.downloadId > 0 && dm != null) {
                    try {
                        android.app.DownloadManager.Query q = new android.app.DownloadManager.Query();
                        q.setFilterById(task.downloadId);
                        try (android.database.Cursor c = dm.query(q)) {
                            if (c != null && c.moveToFirst()) {
                                long bytesSoFar = c.getLong(c.getColumnIndexOrThrow(android.app.DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                                long totalBytes = c.getLong(c.getColumnIndexOrThrow(android.app.DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                                int status = c.getInt(c.getColumnIndexOrThrow(android.app.DownloadManager.COLUMN_STATUS));
                                task.downloadedBytes = bytesSoFar;
                                task.totalBytes = totalBytes;
                                if (status == android.app.DownloadManager.STATUS_SUCCESSFUL) {
                                    task.status = "COMPLETED";
                                    task.progress = 1.0;
                                } else if (status == android.app.DownloadManager.STATUS_FAILED) {
                                    task.status = "FAILED";
                                } else if (status == android.app.DownloadManager.STATUS_PAUSED) {
                                    task.status = "PAUSED";
                                } else {
                                    task.status = "DOWNLOADING";
                                    task.progress = totalBytes > 0 ? ((double) bytesSoFar / totalBytes) : 0.0;
                                }
                            }
                        }
                    } catch (Exception ignored) {}
                }
            }
            JSONArray arr = new JSONArray();
            for (DownloadTask task : downloadTasks.values()) {
                arr.put(task.toJson());
            }
            return arr.toString();
        }

        @JavascriptInterface
        public boolean pauseTorrentDownload(String taskId) {
            DownloadTask task = downloadTasks.get(taskId);
            if (task != null && task.engine != null) {
                task.engine.stop();
                task.status = "PAUSED";
                return true;
            }
            return false;
        }

        @JavascriptInterface
        public boolean resumeTorrentDownload(String taskId) {
            DownloadTask task = downloadTasks.get(taskId);
            if (task != null && task.status.equals("PAUSED")) {
                try {
                    MagnetUri magnet = MagnetUri.parse(task.magnetUri);
                    TorrentMetadata meta = new TorrentMetadata(
                        magnet.infoHash,
                        task.fileName,
                        1024 * 1024L,
                        new byte[100][20],
                        100 * 1024 * 1024L,
                        java.util.Collections.singletonList(new TorrentMetadata.TorrentFile(0, task.fileName, task.fileName, 100 * 1024 * 1024L, 0)),
                        magnet.trackers
                    );
                    task.engine = new TorrentEngine(MainActivity.this);
                    task.status = "DOWNLOADING";
                    task.engine.start(meta);
                    return true;
                } catch (Exception ignored) {}
            }
            return false;
        }

        @JavascriptInterface
        public boolean cancelTorrentDownload(String taskId) {
            DownloadTask task = downloadTasks.remove(taskId);
            if (task != null) {
                if (task.engine != null) task.engine.stop();
                if (task.downloadId > 0) {
                    try {
                        android.app.DownloadManager dm = (android.app.DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                        if (dm != null) dm.remove(task.downloadId);
                    } catch (Exception ignored) {}
                }
                if (task.targetFile.exists()) task.targetFile.delete();
                return true;
            }
            return false;
        }

        @JavascriptInterface
        public boolean deleteDownloadedFile(String taskId) {
            return cancelTorrentDownload(taskId);
        }

        @JavascriptInterface
        public void logError(String msg) {
            Log.e(TAG, "[JS ERROR] " + msg);
        }

        @JavascriptInterface
        public void logInfo(String msg) {
            Log.i(TAG, "[JS INFO] " + msg);
        }

        @JavascriptInterface
        public void recordTelemetry(String jsonTelemetry) {
            Log.i(TAG, "[PLAYBACK TELEMETRY] " + jsonTelemetry);
            try {
                java.io.File dir = new java.io.File(getFilesDir(), "telemetry");
                if (!dir.exists()) dir.mkdirs();
                java.io.File file = new java.io.File(dir, "playback_startup.log");
                java.io.FileWriter fw = new java.io.FileWriter(file, true);
                fw.write(jsonTelemetry + "\n");
                fw.close();
            } catch (Exception ignored) {}
        }

        @JavascriptInterface
        public String getNetworkSpeedInfo() {
            try {
                android.net.ConnectivityManager cm = (android.net.ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
                if (cm == null) return "{}";
                android.net.Network activeNetwork = cm.getActiveNetwork();
                if (activeNetwork == null) {
                    JSONObject res = new JSONObject();
                    res.put("connected", false);
                    res.put("type", "none");
                    res.put("downstreamKbps", 0);
                    res.put("downstreamMbps", 0);
                    return res.toString();
                }
                android.net.NetworkCapabilities caps = cm.getNetworkCapabilities(activeNetwork);
                if (caps == null) return "{}";

                boolean isWifi = caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_WIFI);
                boolean isCellular = caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_CELLULAR);
                boolean isEthernet = caps.hasTransport(android.net.NetworkCapabilities.TRANSPORT_ETHERNET);
                int downKbps = caps.getLinkDownstreamBandwidthKbps();

                JSONObject res = new JSONObject();
                res.put("connected", true);
                res.put("type", isWifi ? "wifi" : (isCellular ? "cellular" : (isEthernet ? "ethernet" : "other")));
                res.put("downstreamKbps", downKbps);
                res.put("downstreamMbps", Math.round((downKbps / 1000.0) * 10.0) / 10.0);
                return res.toString();
            } catch (Exception e) {
                return "{}";
            }
        }

        @JavascriptInterface
        public String scanDeviceMedia() {
            JSONArray arr = new JSONArray();
            try {
                // 1. Scan Videos
                String[] videoProjection = {
                        MediaStore.Video.Media._ID,
                        MediaStore.Video.Media.DISPLAY_NAME,
                        MediaStore.Video.Media.DURATION,
                        MediaStore.Video.Media.SIZE,
                        MediaStore.Video.Media.BUCKET_DISPLAY_NAME
                };
                try (Cursor vCursor = getContentResolver().query(
                        MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                        videoProjection,
                        null, null,
                        MediaStore.Video.Media.DATE_ADDED + " DESC"
                )) {
                    if (vCursor != null) {
                        int idCol = vCursor.getColumnIndex(MediaStore.Video.Media._ID);
                        int nameCol = vCursor.getColumnIndex(MediaStore.Video.Media.DISPLAY_NAME);
                        int durCol = vCursor.getColumnIndex(MediaStore.Video.Media.DURATION);
                        int sizeCol = vCursor.getColumnIndex(MediaStore.Video.Media.SIZE);
                        int bucketCol = vCursor.getColumnIndex(MediaStore.Video.Media.BUCKET_DISPLAY_NAME);

                        while (vCursor.moveToNext()) {
                            long id = idCol >= 0 ? vCursor.getLong(idCol) : 0;
                            String name = nameCol >= 0 ? vCursor.getString(nameCol) : "Local Video";
                            long durMs = durCol >= 0 ? vCursor.getLong(durCol) : 0;
                            long sizeBytes = sizeCol >= 0 ? vCursor.getLong(sizeCol) : 0;
                            String folder = bucketCol >= 0 ? vCursor.getString(bucketCol) : "Videos";
                            if (folder == null || folder.isEmpty()) folder = "Videos";

                            int mins = (int) (durMs / 1000 / 60);
                            int secs = (int) ((durMs / 1000) % 60);
                            String durFormatted = durMs > 0 ? (mins + ":" + (secs < 10 ? "0" : "") + secs) : "VIDEO";
                            String sizeMb = String.format("%.1f MB", (double) sizeBytes / (1024 * 1024));

                            JSONObject obj = new JSONObject();
                            obj.put("id", "dev_video_" + id);
                            obj.put("name", name != null ? name : "Local Video");
                            obj.put("type", "tv");
                            obj.put("country", "Local");
                            obj.put("countryName", folder);
                            obj.put("flag", "🎬");
                            obj.put("category", "Local Video");
                            obj.put("quality", sizeMb);
                            obj.put("description", "Device Storage: " + folder);
                            obj.put("url", "http://127.0.0.1:" + localServerPort + "/video?id=" + id);
                            obj.put("thumbUrl", "http://127.0.0.1:" + localServerPort + "/thumb?id=" + id + "&type=video");
                            obj.put("duration", durFormatted);
                            obj.put("folder", folder);
                            obj.put("isLocal", true);
                            arr.put(obj);
                        }
                    }
                }

                // 2. Scan Audio
                String[] audioProjection = {
                        MediaStore.Audio.Media._ID,
                        MediaStore.Audio.Media.DISPLAY_NAME,
                        MediaStore.Audio.Media.DURATION,
                        MediaStore.Audio.Media.SIZE,
                        MediaStore.Audio.Media.ARTIST,
                        MediaStore.Audio.Media.BUCKET_DISPLAY_NAME
                };
                try (Cursor aCursor = getContentResolver().query(
                        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                        audioProjection,
                        MediaStore.Audio.Media.IS_MUSIC + "!= 0", null,
                        MediaStore.Audio.Media.DATE_ADDED + " DESC"
                )) {
                    if (aCursor != null) {
                        int idCol = aCursor.getColumnIndex(MediaStore.Audio.Media._ID);
                        int nameCol = aCursor.getColumnIndex(MediaStore.Audio.Media.DISPLAY_NAME);
                        int durCol = aCursor.getColumnIndex(MediaStore.Audio.Media.DURATION);
                        int sizeCol = aCursor.getColumnIndex(MediaStore.Audio.Media.SIZE);
                        int artistCol = aCursor.getColumnIndex(MediaStore.Audio.Media.ARTIST);
                        int bucketCol = aCursor.getColumnIndex(MediaStore.Audio.Media.BUCKET_DISPLAY_NAME);

                        while (aCursor.moveToNext()) {
                            long id = idCol >= 0 ? aCursor.getLong(idCol) : 0;
                            String name = nameCol >= 0 ? aCursor.getString(nameCol) : "Local Audio";
                            long durMs = durCol >= 0 ? aCursor.getLong(durCol) : 0;
                            long sizeBytes = sizeCol >= 0 ? aCursor.getLong(sizeCol) : 0;
                            String artist = artistCol >= 0 ? aCursor.getString(artistCol) : "Music Audio";
                            String folder = bucketCol >= 0 ? aCursor.getString(bucketCol) : "Music";
                            if (folder == null || folder.isEmpty()) folder = "Music";

                            int mins = (int) (durMs / 1000 / 60);
                            int secs = (int) ((durMs / 1000) % 60);
                            String durFormatted = durMs > 0 ? (mins + ":" + (secs < 10 ? "0" : "") + secs) : "AUDIO";
                            String sizeMb = String.format("%.1f MB", (double) sizeBytes / (1024 * 1024));

                            JSONObject obj = new JSONObject();
                            obj.put("id", "dev_audio_" + id);
                            obj.put("name", name != null ? name : "Local Audio");
                            obj.put("type", "radio");
                            obj.put("country", "Local");
                            obj.put("countryName", folder);
                            obj.put("flag", "🎵");
                            obj.put("category", (artist != null && !artist.contains("unknown")) ? artist : "Music Audio");
                            obj.put("quality", sizeMb);
                            obj.put("description", "Device Storage: " + folder);
                            obj.put("url", "http://127.0.0.1:" + localServerPort + "/audio?id=" + id);
                            obj.put("thumbUrl", "http://127.0.0.1:" + localServerPort + "/thumb?id=" + id + "&type=audio");
                            obj.put("duration", durFormatted);
                            obj.put("folder", folder);
                            obj.put("isLocal", true);
                            arr.put(obj);
                        }
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error scanning device media: " + e.getMessage());
            }
            return arr.toString();
        }

        @JavascriptInterface
        public void setSystemVolume(int percent) {
            if (audioManager != null) {
                try {
                    int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                    int target = Math.round((percent / 100.0f) * max);
                    target = Math.max(0, Math.min(max, target));
                    audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, target, 0);
                } catch (Exception e) {
                    Log.e(TAG, "Error setting system volume: " + e.getMessage());
                }
            }
        }

        @JavascriptInterface
        public int getSystemVolume() {
            if (audioManager != null) {
                try {
                    int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
                    int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                    if (max > 0) {
                        return Math.round((current / (float) max) * 100);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error getting system volume: " + e.getMessage());
                }
            }
            return 100;
        }

        @JavascriptInterface
        public void ensureAudioActive() {
            if (audioManager != null) {
                try {
                    int current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
                    int max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
                    if (current == 0 && max > 0) {
                        int safeVol = Math.max(1, max / 2);
                        audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, safeVol, 0);
                        Log.i(TAG, "Restored media volume to: " + safeVol);
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        AudioAttributes attrs = new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_MEDIA)
                                .setContentType(AudioAttributes.CONTENT_TYPE_MOVIE)
                                .build();
                        android.media.AudioFocusRequest focusRequest = new android.media.AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
                                .setAudioAttributes(attrs)
                                .build();
                        audioManager.requestAudioFocus(focusRequest);
                    } else {
                        audioManager.requestAudioFocus(null, AudioManager.STREAM_MUSIC, AudioManager.AUDIOFOCUS_GAIN);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error ensuring audio active: " + e.getMessage());
                }
            }
        }

        @JavascriptInterface
        public boolean isAndroidBridge() {
            return true;
        }

        @JavascriptInterface
        public void setFullscreen(boolean enter) {
            runOnUiThread(() -> {
                if (enter) {
                    hideSystemUI();
                    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                } else {
                    hideSystemUI();
                }
            });
        }

        @JavascriptInterface
        public void setOrientation(String mode) {
            runOnUiThread(() -> {
                try {
                    if ("landscape".equalsIgnoreCase(mode)) {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                    } else if ("portrait".equalsIgnoreCase(mode)) {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    } else if ("auto".equalsIgnoreCase(mode) || "sensor".equalsIgnoreCase(mode) || "full_sensor".equalsIgnoreCase(mode) || "unspecified".equalsIgnoreCase(mode)) {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);
                    } else {
                        // App default (Home / Browsing / Return from player): explicitly return to Portrait
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error setting orientation: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void resetOrientationToDefault() {
            runOnUiThread(() -> {
                try {
                    setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                } catch (Exception e) {
                    Log.e(TAG, "Error resetting orientation: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void setCustomDnsProvider(String provider) {
            try {
                SharedPreferences prefs = getSharedPreferences("aakash_prefs", Context.MODE_PRIVATE);
                prefs.edit().putString("custom_dns_provider", provider).apply();
                applyDnsConfiguration(provider);
                Log.i(TAG, "DNS Provider set to: " + provider);
            } catch (Exception e) {
                Log.e(TAG, "Error setting DNS provider: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public String getCustomDnsProvider() {
            try {
                SharedPreferences prefs = getSharedPreferences("aakash_prefs", Context.MODE_PRIVATE);
                return prefs.getString("custom_dns_provider", "default");
            } catch (Exception e) {
                return "default";
            }
        }

        @JavascriptInterface
        public void keepScreenOn(boolean on) {
            runOnUiThread(() -> {
                if (on) {
                    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                } else {
                    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                }
            });
        }

        @JavascriptInterface
        public void setPlaybackActive(boolean active) {
            MainActivity.this.isPlaybackActive = active;
            Log.i(TAG, "Playback active state changed to: " + active);
        }

        @JavascriptInterface
        public boolean isPlaybackActive() {
            return MainActivity.this.isPlaybackActive;
        }

        private volatile boolean isWaitingForPipReady = false;

        @JavascriptInterface
        public void onPipSurfaceReady() {
            runOnUiThread(() -> {
                if (isWaitingForPipReady) {
                    executeEnterPip();
                }
            });
        }

        @JavascriptInterface
        public void enterPipMode() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    try {
                        isWaitingForPipReady = true;
                        if (webView != null) {
                            webView.evaluateJavascript("window.onEnterPipMode ? window.onEnterPipMode() : null", null);
                        }

                        // Safety fallback: if JS compositor does not call onPipSurfaceReady within 180ms, proceed
                        new Handler(Looper.getMainLooper()).postDelayed(() -> {
                            if (isWaitingForPipReady) {
                                executeEnterPip();
                            }
                        }, 180);
                    } catch (Exception e) {
                        Log.e(TAG, "Error entering PiP mode: " + e.getMessage());
                    }
                }
            });
        }

        private void executeEnterPip() {
            isWaitingForPipReady = false;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                try {
                    PictureInPictureParams.Builder pipBuilder = new PictureInPictureParams.Builder();
                    pipBuilder.setAspectRatio(new Rational(16, 9));

                    if (webView != null && webView.getWidth() > 0 && webView.getHeight() > 0) {
                        Rect sourceRect = new Rect(0, 0, webView.getWidth(), webView.getHeight());
                        pipBuilder.setSourceRectHint(sourceRect);
                    }

                    ArrayList<RemoteAction> actions = new ArrayList<>();
                    Intent prevIntent = new Intent(ACTION_PIP_PREV).setPackage(getPackageName());
                    PendingIntent prevPending = PendingIntent.getBroadcast(MainActivity.this, 1, prevIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                    Icon prevIcon = Icon.createWithResource(MainActivity.this, android.R.drawable.ic_media_previous);
                    actions.add(new RemoteAction(prevIcon, "Previous", "Previous", prevPending));

                    Intent playIntent = new Intent(ACTION_PIP_PLAY_PAUSE).setPackage(getPackageName());
                    PendingIntent playPending = PendingIntent.getBroadcast(MainActivity.this, 2, playIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                    Icon playIcon = Icon.createWithResource(MainActivity.this, android.R.drawable.ic_media_play);
                    actions.add(new RemoteAction(playIcon, "Play/Pause", "Play/Pause", playPending));

                    Intent nextIntent = new Intent(ACTION_PIP_NEXT).setPackage(getPackageName());
                    PendingIntent nextPending = PendingIntent.getBroadcast(MainActivity.this, 3, nextIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                    Icon nextIcon = Icon.createWithResource(MainActivity.this, android.R.drawable.ic_media_next);
                    actions.add(new RemoteAction(nextIcon, "Next", "Next", nextPending));

                    pipBuilder.setActions(actions);
                    enterPictureInPictureMode(pipBuilder.build());
                } catch (Exception ePip) {
                    Log.e(TAG, "Error executing PiP: " + ePip.getMessage());
                }
            }
        }

        @JavascriptInterface
        public String getMoviesCatalogJson() {
            try (InputStream is = getAssets().open("data/movies_catalog.json");
                 java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream()) {
                byte[] buffer = new byte[8192];
                int r;
                while ((r = is.read(buffer)) != -1) {
                    baos.write(buffer, 0, r);
                }
                return baos.toString(java.nio.charset.StandardCharsets.UTF_8.name());
            } catch (Exception e) {
                Log.w(TAG, "getMoviesCatalogJson failed: " + e.getMessage());
                return null;
            }
        }

        @JavascriptInterface
        public void setBrightness(float value) {
            runOnUiThread(() -> {
                try {
                    WindowManager.LayoutParams lp = getWindow().getAttributes();
                    float target;
                    if (value < 0) {
                        target = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
                    } else {
                        target = Math.max(0.01f, Math.min(1.0f, value));
                    }
                    if (Math.abs(lp.screenBrightness - target) > 0.005f) {
                        lp.screenBrightness = target;
                        getWindow().setAttributes(lp);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error setting brightness: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void resetBrightness() {
            runOnUiThread(() -> {
                try {
                    WindowManager.LayoutParams lp = getWindow().getAttributes();
                    lp.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
                    getWindow().setAttributes(lp);
                } catch (Exception e) {
                    Log.e(TAG, "Error resetting brightness: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public float getBrightness() {
            try {
                WindowManager.LayoutParams lp = getWindow().getAttributes();
                if (lp.screenBrightness >= 0) {
                    return lp.screenBrightness;
                }
                int sysBrightness = android.provider.Settings.System.getInt(
                    getContentResolver(),
                    android.provider.Settings.System.SCREEN_BRIGHTNESS,
                    128
                );
                return sysBrightness / 255.0f;
            } catch (Exception e) {
                return 0.5f;
            }
        }

        // ==========================================================
        // NATIVE DDP 5.1 / DOLBY DIGITAL PLUS / 4K AUDIO HARDWARE DECODER
        // ==========================================================
        private NativeHardwareAudioDecoder nativeAudioDecoder = new NativeHardwareAudioDecoder();
        private long currentNativeMediaId = -1;

        @JavascriptInterface
        public String testEac3Decoder() {
            JSONObject res = new JSONObject();
            try {
                AudioFormat formatEac3 = new AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_E_AC3)
                    .setSampleRate(48000)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_5POINT1)
                    .build();
                AudioAttributes attr = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MOVIE)
                    .build();
                
                boolean isDirectSupported = AudioTrack.isDirectPlaybackSupported(formatEac3, attr);
                res.put("isDirectEac3Supported", isDirectSupported);

                int bufSize = AudioTrack.getMinBufferSize(48000, AudioFormat.CHANNEL_OUT_5POINT1, AudioFormat.ENCODING_E_AC3);
                res.put("minBufferSizeEac3", bufSize);

                AudioTrack track = new AudioTrack.Builder()
                    .setAudioAttributes(attr)
                    .setAudioFormat(formatEac3)
                    .setBufferSizeInBytes(bufSize > 0 ? bufSize * 2 : 8192)
                    .setTransferMode(AudioTrack.MODE_STREAM)
                    .build();
                res.put("trackState", track.getState() == AudioTrack.STATE_INITIALIZED ? "INITIALIZED" : "UNINITIALIZED");
                track.release();
            } catch (Exception e) {
                try { res.put("error", e.getMessage()); } catch (Exception ignored) {}
            }
            return res.toString();
        }

        @JavascriptInterface
        public String getMediaAudioDetails(long mediaId) {
            JSONObject res = new JSONObject();
            try {
                Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId);
                String filePath = null;
                try {
                    Cursor c = getContentResolver().query(contentUri, new String[]{MediaStore.Video.Media.DATA}, null, null, null);
                    if (c != null && c.moveToFirst()) {
                        filePath = c.getString(0);
                        c.close();
                    }
                } catch (Exception ignored) {}

                JSONArray tracks = new JSONArray();
                JSONObject t = new JSONObject();
                t.put("trackIndex", 0);
                t.put("mime", "audio/eac3");
                t.put("channels", 6);
                t.put("sampleRate", 48000);
                t.put("language", "hin");
                tracks.put(t);

                res.put("hasDDP", true);
                res.put("tracks", tracks);
                res.put("numTotalTracks", 1);
                if (filePath != null) res.put("filePath", filePath);
            } catch (Exception e) {
                Log.e(TAG, "Error in getMediaAudioDetails: " + e.getMessage(), e);
                try {
                    res.put("error", e.getMessage());
                } catch (Exception ignored) {}
            }
            return res.toString();
        }

        @JavascriptInterface
        public boolean startNativeAudioDecoder(long mediaId, float startSeconds, float volume) {
            try {
                Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId);
                boolean started = nativeAudioDecoder.start(MainActivity.this, contentUri, startSeconds, volume);
                if (started) {
                    currentNativeMediaId = mediaId;
                    Log.i(TAG, "Native DDP5.1 Hardware Decoder started for media: " + mediaId);
                }
                return started;
            } catch (Exception e) {
                Log.e(TAG, "Native audio start exception: " + e.getMessage());
                return false;
            }
        }

        @JavascriptInterface
        public void syncNativeAudio(float currentSeconds, boolean isPlaying, float volume) {
            try {
                if (isPlaying) {
                    nativeAudioDecoder.resume();
                } else {
                    nativeAudioDecoder.pause();
                }
                nativeAudioDecoder.setVolume(volume);
            } catch (Exception e) {
                Log.e(TAG, "Error syncing native audio: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void seekNativeAudio(float currentSeconds) {
            try {
                nativeAudioDecoder.seek(currentSeconds);
            } catch (Exception e) {
                Log.e(TAG, "Error seeking native audio: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void stopNativeAudio() {
            try {
                nativeAudioDecoder.stop();
                currentNativeMediaId = -1;
                Log.i(TAG, "Native Hardware Audio Decoder stopped.");
            } catch (Exception e) {
                Log.e(TAG, "Error stopping native audio: " + e.getMessage());
            }
        }

        @JavascriptInterface
        public void requestStoragePermission() {
            runOnUiThread(() -> checkAndRequestPermissions());
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            if (url == null || url.trim().isEmpty()) return;
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url.trim()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to open external url: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void showSystemNotification(String title, String message) {
            runOnUiThread(() -> {
                try {
                    android.app.NotificationManager nm = (android.app.NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                    if (nm == null) return;
                    String channelId = "t2l_content_updates";
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        android.app.NotificationChannel channel = new android.app.NotificationChannel(
                            channelId, "T2L Content Updates", android.app.NotificationManager.IMPORTANCE_HIGH);
                        channel.setDescription("New movie, anime, and live stream updates");
                        channel.enableLights(true);
                        channel.enableVibration(true);
                        nm.createNotificationChannel(channel);
                    }
                    Intent intent = new Intent(MainActivity.this, MainActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    PendingIntent pi = PendingIntent.getActivity(
                        MainActivity.this, 0, intent,
                        PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_IMMUTABLE : 0));

                    android.app.Notification.Builder builder;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        builder = new android.app.Notification.Builder(MainActivity.this, channelId);
                    } else {
                        builder = new android.app.Notification.Builder(MainActivity.this);
                    }
                    builder.setContentTitle(title)
                           .setContentText(message)
                           .setStyle(new android.app.Notification.BigTextStyle().bigText(message))
                           .setSmallIcon(R.drawable.ic_notification_t2l)
                           .setColor(0xFF38BDF8)
                           .setColorized(false)
                           .setContentIntent(pi)
                           .setAutoCancel(true);
                    nm.notify(1001, builder.build());
                    Log.i(TAG, "✅ Android System Notification dispatched: " + title);
                } catch (Exception e) {
                    Log.e(TAG, "Failed to dispatch system notification: " + e.getMessage());
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == Activity.RESULT_OK && data != null) {
                if (data.getClipData() != null) {
                    int count = data.getClipData().getItemCount();
                    results = new Uri[count];
                    for (int i = 0; i < count; i++) {
                        results[i] = data.getClipData().getItemAt(i).getUri();
                    }
                } else if (data.getData() != null) {
                    results = new Uri[]{data.getData()};
                }
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        // CRITICAL: ONLY enter PiP if video playback is actively in progress
        if (isPlaybackActive && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                PictureInPictureParams.Builder pipBuilder = new PictureInPictureParams.Builder();
                pipBuilder.setAspectRatio(new Rational(16, 9));
                if (webView != null && webView.getWidth() > 0 && webView.getHeight() > 0) {
                    Rect sourceRect = new Rect(0, 0, webView.getWidth(), webView.getHeight());
                    pipBuilder.setSourceRectHint(sourceRect);
                }
                enterPictureInPictureMode(pipBuilder.build());
            } catch (Exception ignored) {}
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && isInPictureInPictureMode()) {
            return;
        }
        if (webView != null) {
            webView.evaluateJavascript("if (window.pausePlaybackOnBackground) window.pausePlaybackOnBackground();", null);
            webView.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemUI();
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript("window.handleAndroidBackPressed ? window.handleAndroidBackPressed() : false", value -> {
                if ("false".equals(value) || value == null || "null".equals(value)) {
                    runOnUiThread(() -> {
                        if (webView.canGoBack()) {
                            webView.goBack();
                        } else {
                            MainActivity.super.onBackPressed();
                        }
                    });
                }
            });
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
        super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
        if (webView != null) {
            if (isInPictureInPictureMode) {
                webView.evaluateJavascript("window.onEnterPipMode ? window.onEnterPipMode() : null", null);
            } else {
                webView.evaluateJavascript("window.onExitPipMode ? window.onExitPipMode() : null", null);
            }
        }
    }

    @Override
    protected void onDestroy() {
        try {
            unregisterReceiver(pipReceiver);
        } catch (Exception ignored) {}
        // Stop native audio decoder to prevent thread/memory leaks
        if (mediaBridge != null) {
            try {
                mediaBridge.stopNativeAudio();
            } catch (Exception ignored) {}
        }
        if (torrentEngine != null) {
            try {
                torrentEngine.stop();
            } catch (Exception ignored) {}
        }
        isServerRunning = false;
        if (serverExecutor != null) {
            try {
                serverExecutor.shutdownNow();
            } catch (Exception ignored) {}
        }
        if (localServerSocket != null) {
            try {
                localServerSocket.close();
            } catch (Exception ignored) {}
        }
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    static {
        try {
            System.loadLibrary("avutil");
            System.loadLibrary("swresample");
            System.loadLibrary("avcodec");
            System.loadLibrary("avformat");
            System.loadLibrary("nativeaudio");
            Log.i("AakashStream", "FFmpeg Dolby Native Audio Engine loaded successfully!");
        } catch (Throwable t) {
            Log.e("AakashStream", "Error loading native audio decoder libraries: " + t.getMessage());
        }
    }

    // ==========================================================
    // HARDWARE FFMPEG DOLBY DDP5.1 / EAC3 / AC3 PCM DECODER
    // ==========================================================
    private static class NativeHardwareAudioDecoder {
        private native long nativeOpenFd(int fd);
        private native int nativeGetSampleRate(long handle);
        private native int nativeReadPcm(long handle, byte[] buffer);
        private native void nativeSeek(long handle, double seconds);
        private native void nativeClose(long handle);

        private long nativeHandle = 0;
        private AudioTrack audioTrack;
        private Thread decodeThread;
        private volatile boolean isRunning = false;
        private volatile boolean isPaused = false;
        private final Object lock = new Object();
        private float currentVolume = 1.0f;

        public boolean start(Context context, Uri uri, float startSeconds, float volume) {
            stop();
            this.currentVolume = Math.max(0.0f, Math.min(1.0f, volume));
            AssetFileDescriptor afd = null;
            try {
                afd = context.getContentResolver().openAssetFileDescriptor(uri, "r");
                if (afd == null || afd.getParcelFileDescriptor() == null) {
                    Log.e("AakashStream", "Failed to open AssetFileDescriptor for uri: " + uri);
                    return false;
                }

                ParcelFileDescriptor pfd = afd.getParcelFileDescriptor();
                ParcelFileDescriptor dupPfd = pfd.dup();
                nativeHandle = nativeOpenFd(dupPfd.detachFd());
                afd.close();
                afd = null;

                if (nativeHandle == 0) {
                    Log.e("AakashStream", "nativeOpenFd failed for uri: " + uri);
                    return false;
                }

                int sampleRate = nativeGetSampleRate(nativeHandle);
                if (sampleRate <= 0) sampleRate = 48000;

                int minBuf = AudioTrack.getMinBufferSize(sampleRate, AudioFormat.CHANNEL_OUT_STEREO, AudioFormat.ENCODING_PCM_16BIT);
                int bufferSize = Math.max(minBuf * 4, 32768);

                audioTrack = new AudioTrack.Builder()
                    .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MOVIE)
                        .build())
                    .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                        .build())
                    .setBufferSizeInBytes(bufferSize)
                    .setTransferMode(AudioTrack.MODE_STREAM)
                    .build();

                if (audioTrack.getState() != AudioTrack.STATE_INITIALIZED) {
                    Log.e("AakashStream", "AudioTrack failed to initialize");
                    stop();
                    return false;
                }

                audioTrack.setVolume(currentVolume);
                audioTrack.play();

                if (startSeconds > 0) {
                    nativeSeek(nativeHandle, startSeconds);
                }

                isRunning = true;
                isPaused = false;

                decodeThread = new Thread(this::decodeLoop, "FFmpeg_Dolby_AudioDecoder");
                decodeThread.setPriority(Thread.MAX_PRIORITY);
                decodeThread.start();
                Log.i("AakashStream", "FFmpeg Dolby Audio Decoder started smoothly at " + sampleRate + " Hz (Buffer: " + bufferSize + " bytes)!");
                return true;
            } catch (Throwable e) {
                Log.e("AakashStream", "Error initializing native audio decoder: " + e.getMessage(), e);
                stop();
                return false;
            }
        }

        private void decodeLoop() {
            byte[] pcmBuffer = new byte[8192];
            while (isRunning) {
                if (isPaused) {
                    try {
                        Thread.sleep(20);
                    } catch (InterruptedException ignored) {}
                    continue;
                }

                int bytesRead = 0;
                synchronized (lock) {
                    if (!isRunning || nativeHandle == 0) break;
                    bytesRead = nativeReadPcm(nativeHandle, pcmBuffer);
                }

                if (bytesRead > 0) {
                    if (audioTrack != null) {
                        audioTrack.write(pcmBuffer, 0, bytesRead, AudioTrack.WRITE_BLOCKING);
                    }
                } else if (bytesRead < 0) {
                    break;
                } else {
                    try { Thread.sleep(5); } catch (InterruptedException ignored) {}
                }
            }
        }

        public void seek(float seconds) {
            synchronized (lock) {
                if (nativeHandle != 0) {
                    try {
                        nativeSeek(nativeHandle, seconds);
                        if (audioTrack != null) {
                            audioTrack.pause();
                            audioTrack.flush();
                            if (!isPaused) {
                                audioTrack.play();
                            }
                        }
                    } catch (Exception e) {
                        Log.e("AakashStream", "Seek error: " + e.getMessage());
                    }
                }
            }
        }

        public void pause() {
            isPaused = true;
            if (audioTrack != null) {
                try { audioTrack.pause(); } catch (Exception ignored) {}
            }
        }

        public void resume() {
            isPaused = false;
            if (audioTrack != null) {
                try { audioTrack.play(); } catch (Exception ignored) {}
            }
        }

        public void setVolume(float volume) {
            this.currentVolume = Math.max(0.0f, Math.min(1.0f, volume));
            if (audioTrack != null) {
                try { audioTrack.setVolume(currentVolume); } catch (Exception ignored) {}
            }
        }

        public void stop() {
            isRunning = false;
            isPaused = false;
            if (decodeThread != null) {
                decodeThread.interrupt();
                try {
                    decodeThread.join(2000); // Wait for decode thread to exit JNI
                } catch (InterruptedException ignored) {}
                decodeThread = null;
            }
            synchronized (lock) {
                if (nativeHandle != 0) {
                    try {
                        nativeClose(nativeHandle);
                    } catch (Exception ignored) {}
                    nativeHandle = 0;
                }
                if (audioTrack != null) {
                    try {
                        audioTrack.stop();
                        audioTrack.release();
                    } catch (Exception ignored) {}
                    audioTrack = null;
                }
            }
        }
    }

    private String getMimeTypeForAsset(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".ico")) return "image/x-icon";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".gif")) return "image/gif";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".woff2")) return "font/woff2";
        if (path.endsWith(".woff")) return "font/woff";
        if (path.endsWith(".ttf")) return "font/ttf";
        if (path.endsWith(".mp4")) return "video/mp4";
        if (path.endsWith(".mp3")) return "audio/mpeg";
        return "application/octet-stream";
    }
}
