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
import android.media.MediaCodec;
import android.media.MediaExtractor;
import android.media.MediaFormat;
import android.media.MediaMetadataRetriever;
import android.media.MediaPlayer;
import android.net.Uri;
import java.nio.ByteBuffer;
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
import android.app.PictureInPictureParams;
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
                Log.i(TAG, "LocalMediaServer running on 127.0.0.1:" + localServerPort);

                while (isServerRunning && !localServerSocket.isClosed()) {
                    try {
                        Socket socket = localServerSocket.accept();
                        new Thread(() -> handleClientSocket(socket)).start();
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
                        "Access-Control-Allow-Origin: *\r\n" +
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

            String idStr = params.get("id");
            if (idStr == null) {
                String resp = "HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
                return;
            }

            long id = Long.parseLong(idStr);

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
                            "Access-Control-Allow-Origin: *\r\n" +
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
            AssetFileDescriptor afd = getContentResolver().openAssetFileDescriptor(contentUri, "r");
            if (afd == null) {
                String resp = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n";
                out.write(resp.getBytes("UTF-8"));
                out.flush();
                socket.close();
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

            StringBuilder headers = new StringBuilder();
            if (isRange && totalLength > 0) {
                headers.append("HTTP/1.1 206 Partial Content\r\n");
                headers.append("Content-Range: bytes ").append(start).append("-").append(end).append("/").append(totalLength).append("\r\n");
            } else {
                headers.append("HTTP/1.1 200 OK\r\n");
            }
            headers.append("Content-Type: ").append(mime).append("\r\n");
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

            out.write(headers.toString().getBytes("UTF-8"));

            if (!"HEAD".equalsIgnoreCase(method)) {
                byte[] buffer = new byte[64 * 1024];
                long bytesToRead = (totalLength > 0) ? contentLength : Long.MAX_VALUE;
                while (bytesToRead > 0) {
                    int toRead = (int) Math.min(buffer.length, bytesToRead);
                    int read = fis.read(buffer, 0, toRead);
                    if (read <= 0) break;
                    out.write(buffer, 0, read);
                    bytesToRead -= read;
                }
                out.flush();
            }

            fis.close();
            afd.close();
            socket.close();
        } catch (Exception ignored) {
            try { socket.close(); } catch (Exception e2) {}
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(true);
        startLocalServer();

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        setContentView(R.layout.activity_main);
        audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);

        checkAndRequestPermissions();
        hideSystemUI();

        webView = findViewById(R.id.webView);
        webView.setVerticalScrollBarEnabled(false);
        webView.setHorizontalScrollBarEnabled(false);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        setupWebView();
        webView.loadUrl("file:///android_asset/index.html");
    }

    private void checkAndRequestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            List<String> perms = new ArrayList<>();
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_VIDEO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_VIDEO);
            }
            if (checkSelfPermission(Manifest.permission.READ_MEDIA_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_AUDIO);
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

    private void setupWebView() {
        WebView.setWebContentsDebuggingEnabled(true);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        webView.addJavascriptInterface(new AndroidMediaBridge(), "AndroidMedia");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.i(TAG, "[Console " + consoleMessage.messageLevel() + "] " + consoleMessage.message() + " -- From line "
                        + consoleMessage.lineNumber() + " of " + consoleMessage.sourceId());
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
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://") || url.startsWith("http://") || url.startsWith("https://")) {
                    return false;
                }
                return true;
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
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
        });
    }

    public class AndroidMediaBridge {
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
                Cursor vCursor = getContentResolver().query(
                        MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                        videoProjection,
                        null, null,
                        MediaStore.Video.Media.DATE_ADDED + " DESC"
                );
                if (vCursor != null) {
                    int idCol = vCursor.getColumnIndexOrThrow(MediaStore.Video.Media._ID);
                    int nameCol = vCursor.getColumnIndexOrThrow(MediaStore.Video.Media.DISPLAY_NAME);
                    int durCol = vCursor.getColumnIndexOrThrow(MediaStore.Video.Media.DURATION);
                    int sizeCol = vCursor.getColumnIndexOrThrow(MediaStore.Video.Media.SIZE);
                    int bucketCol = vCursor.getColumnIndexOrThrow(MediaStore.Video.Media.BUCKET_DISPLAY_NAME);

                    while (vCursor.moveToNext()) {
                        long id = vCursor.getLong(idCol);
                        String name = vCursor.getString(nameCol);
                        long durMs = vCursor.getLong(durCol);
                        long sizeBytes = vCursor.getLong(sizeCol);
                        String folder = vCursor.getString(bucketCol);
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
                    vCursor.close();
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
                Cursor aCursor = getContentResolver().query(
                        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                        audioProjection,
                        MediaStore.Audio.Media.IS_MUSIC + "!= 0", null,
                        MediaStore.Audio.Media.DATE_ADDED + " DESC"
                );
                if (aCursor != null) {
                    int idCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID);
                    int nameCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME);
                    int durCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION);
                    int sizeCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE);
                    int artistCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST);
                    int bucketCol = aCursor.getColumnIndexOrThrow(MediaStore.Audio.Media.BUCKET_DISPLAY_NAME);

                    while (aCursor.moveToNext()) {
                        long id = aCursor.getLong(idCol);
                        String name = aCursor.getString(nameCol);
                        long durMs = aCursor.getLong(durCol);
                        long sizeBytes = aCursor.getLong(sizeCol);
                        String artist = aCursor.getString(artistCol);
                        String folder = aCursor.getString(bucketCol);
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
                    aCursor.close();
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
                    if ("landscape".equals(mode)) {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
                    } else if ("portrait".equals(mode)) {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    } else {
                        setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR);
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error setting orientation: " + e.getMessage());
                }
            });
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
        public void enterPipMode() {
            runOnUiThread(() -> {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    try {
                        PictureInPictureParams.Builder pipBuilder = new PictureInPictureParams.Builder();
                        pipBuilder.setAspectRatio(new Rational(16, 9));
                        enterPictureInPictureMode(pipBuilder.build());
                    } catch (Exception e) {
                        Log.e(TAG, "Error entering PiP mode: " + e.getMessage());
                    }
                }
            });
        }

        @JavascriptInterface
        public void setBrightness(float value) {
            runOnUiThread(() -> {
                try {
                    WindowManager.LayoutParams lp = getWindow().getAttributes();
                    if (value < 0) {
                        lp.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
                    } else {
                        lp.screenBrightness = Math.max(0.01f, Math.min(1.0f, value));
                    }
                    getWindow().setAttributes(lp);
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

        // ==========================================================
        // NATIVE DDP 5.1 / DOLBY DIGITAL PLUS / 4K AUDIO HARDWARE DECODER
        // ==========================================================
        private NativeHardwareAudioDecoder nativeAudioDecoder = new NativeHardwareAudioDecoder();
        private long currentNativeMediaId = -1;

        @JavascriptInterface
        public String getMediaAudioDetails(long mediaId) {
            JSONObject res = new JSONObject();
            MediaExtractor extractor = new MediaExtractor();
            try {
                Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, mediaId);
                AssetFileDescriptor afd = getContentResolver().openAssetFileDescriptor(contentUri, "r");
                if (afd != null) {
                    extractor.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                    afd.close();
                } else {
                    extractor.setDataSource(MainActivity.this, contentUri, null);
                }
                
                int numTracks = extractor.getTrackCount();
                JSONArray tracks = new JSONArray();
                boolean hasDDP = false;
                
                for (int i = 0; i < numTracks; i++) {
                    MediaFormat format = extractor.getTrackFormat(i);
                    String mime = format.getString(MediaFormat.KEY_MIME);
                    if (mime != null && mime.startsWith("audio/")) {
                        JSONObject t = new JSONObject();
                        t.put("trackIndex", i);
                        t.put("mime", mime);
                        int channels = format.containsKey(MediaFormat.KEY_CHANNEL_COUNT) ? format.getInteger(MediaFormat.KEY_CHANNEL_COUNT) : 2;
                        int sampleRate = format.containsKey(MediaFormat.KEY_SAMPLE_RATE) ? format.getInteger(MediaFormat.KEY_SAMPLE_RATE) : 48000;
                        String lang = format.containsKey(MediaFormat.KEY_LANGUAGE) ? format.getString(MediaFormat.KEY_LANGUAGE) : "und";
                        t.put("channels", channels);
                        t.put("sampleRate", sampleRate);
                        t.put("language", lang);
                        
                        if (mime.contains("eac3") || mime.contains("ac3") || mime.contains("dts") || mime.contains("truehd") || channels > 2) {
                            hasDDP = true;
                        }
                        tracks.put(t);
                    }
                }
                res.put("hasDDP", hasDDP);
                res.put("tracks", tracks);
            } catch (Exception e) {
                try {
                    res.put("error", e.getMessage());
                } catch (Exception ignored) {}
            } finally {
                extractor.release();
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
                    nativeAudioDecoder.seek(currentSeconds);
                } else {
                    nativeAudioDecoder.pause();
                }
                nativeAudioDecoder.setVolume(volume);
            } catch (Exception e) {
                Log.e(TAG, "Error syncing native audio: " + e.getMessage());
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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                PictureInPictureParams.Builder pipBuilder = new PictureInPictureParams.Builder();
                pipBuilder.setAspectRatio(new Rational(16, 9));
                enterPictureInPictureMode(pipBuilder.build());
            } catch (Exception ignored) {}
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
    protected void onDestroy() {
        isServerRunning = false;
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

    // ==========================================================
    // HARDWARE MEDIASERVICE DDP5.1 / EAC3 / AC3 PCM DECODER
    // ==========================================================
    private static class NativeHardwareAudioDecoder {
        private MediaExtractor extractor;
        private MediaCodec codec;
        private AudioTrack audioTrack;
        private Thread decodeThread;
        private volatile boolean isRunning = false;
        private volatile boolean isPaused = false;
        private final Object lock = new Object();
        private int sampleRate = 48000;
        private int channelCount = 2;
        private float currentVolume = 1.0f;

        public boolean start(Context context, Uri uri, float startSeconds, float volume) {
            stop();
            this.currentVolume = Math.max(0.0f, Math.min(1.0f, volume));
            try {
                extractor = new MediaExtractor();
                AssetFileDescriptor afd = context.getContentResolver().openAssetFileDescriptor(uri, "r");
                if (afd != null) {
                    extractor.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                    afd.close();
                } else {
                    extractor.setDataSource(context, uri, null);
                }

                int audioTrackIndex = -1;
                MediaFormat format = null;
                String mime = null;

                for (int i = 0; i < extractor.getTrackCount(); i++) {
                    MediaFormat f = extractor.getTrackFormat(i);
                    String m = f.getString(MediaFormat.KEY_MIME);
                    if (m != null && m.startsWith("audio/")) {
                        audioTrackIndex = i;
                        format = f;
                        mime = m;
                        break;
                    }
                }

                if (audioTrackIndex < 0 || format == null || mime == null) {
                    Log.e("AakashStream", "No audio track found in media");
                    return false;
                }

                extractor.selectTrack(audioTrackIndex);
                if (format.containsKey(MediaFormat.KEY_SAMPLE_RATE)) {
                    sampleRate = format.getInteger(MediaFormat.KEY_SAMPLE_RATE);
                }
                if (format.containsKey(MediaFormat.KEY_CHANNEL_COUNT)) {
                    channelCount = format.getInteger(MediaFormat.KEY_CHANNEL_COUNT);
                }

                codec = MediaCodec.createDecoderByType(mime);
                codec.configure(format, null, null, 0);
                codec.start();

                int channelConfig = (channelCount == 1) ? AudioFormat.CHANNEL_OUT_MONO : AudioFormat.CHANNEL_OUT_STEREO;
                int bufferSize = AudioTrack.getMinBufferSize(sampleRate, channelConfig, AudioFormat.ENCODING_PCM_16BIT) * 4;
                if (bufferSize < 4096) bufferSize = 4096;

                audioTrack = new AudioTrack.Builder()
                    .setAudioAttributes(new AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MOVIE)
                        .build())
                    .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(sampleRate)
                        .setChannelMask(channelConfig)
                        .build())
                    .setBufferSizeInBytes(bufferSize)
                    .setTransferMode(AudioTrack.MODE_STREAM)
                    .build();

                audioTrack.setVolume(currentVolume);
                audioTrack.play();

                if (startSeconds > 0) {
                    extractor.seekTo((long)(startSeconds * 1000000), MediaExtractor.SEEK_TO_CLOSEST_SYNC);
                }

                isRunning = true;
                isPaused = false;

                decodeThread = new Thread(this::decodeLoop, "DDP51_AudioDecoder");
                decodeThread.setPriority(Thread.MAX_PRIORITY);
                decodeThread.start();
                return true;
            } catch (Exception e) {
                Log.e("AakashStream", "Error initializing hardware audio decoder: " + e.getMessage(), e);
                stop();
                return false;
            }
        }

        private void decodeLoop() {
            MediaCodec.BufferInfo info = new MediaCodec.BufferInfo();
            boolean isEOS = false;
            byte[] pcmChunk = new byte[8192];

            while (isRunning) {
                if (isPaused) {
                    try {
                        Thread.sleep(25);
                    } catch (InterruptedException ignored) {}
                    continue;
                }

                synchronized (lock) {
                    if (!isRunning) break;

                    // 1. Feed input buffers to MediaCodec
                    if (!isEOS && codec != null && extractor != null) {
                        try {
                            int inIndex = codec.dequeueInputBuffer(2000);
                            if (inIndex >= 0) {
                                ByteBuffer buffer = codec.getInputBuffer(inIndex);
                                if (buffer != null) {
                                    int sampleSize = extractor.readSampleData(buffer, 0);
                                    if (sampleSize < 0) {
                                        codec.queueInputBuffer(inIndex, 0, 0, 0, MediaCodec.BUFFER_FLAG_END_OF_STREAM);
                                        isEOS = true;
                                    } else {
                                        codec.queueInputBuffer(inIndex, 0, sampleSize, extractor.getSampleTime(), 0);
                                        extractor.advance();
                                    }
                                }
                            }
                        } catch (Exception ignored) {}
                    }

                    // 2. Retrieve decoded PCM output buffers from MediaCodec
                    if (codec != null && audioTrack != null) {
                        try {
                            int outIndex = codec.dequeueOutputBuffer(info, 2000);
                            if (outIndex >= 0) {
                                ByteBuffer outBuffer = codec.getOutputBuffer(outIndex);
                                if (outBuffer != null && info.size > 0) {
                                    outBuffer.position(info.offset);
                                    outBuffer.limit(info.offset + info.size);

                                    if (pcmChunk.length < info.size) {
                                        pcmChunk = new byte[info.size];
                                    }
                                    outBuffer.get(pcmChunk, 0, info.size);
                                    audioTrack.write(pcmChunk, 0, info.size);
                                }
                                codec.releaseOutputBuffer(outIndex, false);
                            } else if (outIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                                MediaFormat newFormat = codec.getOutputFormat();
                                if (newFormat.containsKey(MediaFormat.KEY_SAMPLE_RATE)) {
                                    sampleRate = newFormat.getInteger(MediaFormat.KEY_SAMPLE_RATE);
                                }
                            }
                        } catch (Exception ignored) {}
                    }
                }
            }
        }

        public void seek(float seconds) {
            synchronized (lock) {
                if (extractor != null && codec != null) {
                    try {
                        extractor.seekTo((long)(seconds * 1000000), MediaExtractor.SEEK_TO_CLOSEST_SYNC);
                        codec.flush();
                    } catch (Exception e) {
                        Log.e("AakashStream", "Seek error: " + e.getMessage());
                    }
                }
            }
        }

        public void pause() {
            isPaused = true;
            if (audioTrack != null) {
                try {
                    audioTrack.pause();
                } catch (Exception ignored) {}
            }
        }

        public void resume() {
            isPaused = false;
            if (audioTrack != null) {
                try {
                    audioTrack.play();
                } catch (Exception ignored) {}
            }
        }

        public void setVolume(float volume) {
            this.currentVolume = Math.max(0.0f, Math.min(1.0f, volume));
            if (audioTrack != null) {
                try {
                    audioTrack.setVolume(currentVolume);
                } catch (Exception ignored) {}
            }
        }

        public void stop() {
            isRunning = false;
            isPaused = false;
            if (decodeThread != null) {
                decodeThread.interrupt();
                decodeThread = null;
            }
            synchronized (lock) {
                if (codec != null) {
                    try {
                        codec.stop();
                        codec.release();
                    } catch (Exception ignored) {}
                    codec = null;
                }
                if (extractor != null) {
                    try {
                        extractor.release();
                    } catch (Exception ignored) {}
                    extractor = null;
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
}
