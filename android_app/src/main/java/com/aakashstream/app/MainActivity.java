package com.aakashstream.app;

import android.Manifest;
import android.app.Activity;
import android.content.ContentUris;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.content.Context;
import android.media.AudioManager;
import android.graphics.Bitmap;
import android.media.MediaMetadataRetriever;
import android.util.Size;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import android.net.Uri;
import android.os.Bundle;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Log;
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
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private static final String TAG = "AakashStream";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;
    private static final int PERMISSIONS_REQUEST_CODE = 1002;

    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private AudioManager audioManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(true);

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
                Log.d(TAG, "[Console " + consoleMessage.messageLevel() + "] " + consoleMessage.message() + " -- From line "
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
                            
                            // 1. Handle Thumbnail Requests
                            if ("/thumb".equals(path)) {
                                String mediaType = uri.getQueryParameter("type");
                                if ("video".equals(mediaType)) {
                                    Uri contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id);
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                        try {
                                            Bitmap thumb = getContentResolver().loadThumbnail(contentUri, new Size(320, 180), null);
                                            if (thumb != null) {
                                                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                                thumb.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                                return new WebResourceResponse("image/jpeg", "UTF-8", new ByteArrayInputStream(baos.toByteArray()));
                                            }
                                        } catch (Exception ignored) {}
                                    }
                                    
                                    // Fallback to MediaMetadataRetriever
                                    MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                                    try {
                                        mmr.setDataSource(MainActivity.this, contentUri);
                                        Bitmap thumb = mmr.getFrameAtTime(1000000, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                                        if (thumb != null) {
                                            ByteArrayOutputStream baos = new ByteArrayOutputStream();
                                            thumb.compress(Bitmap.CompressFormat.JPEG, 75, baos);
                                            mmr.release();
                                            return new WebResourceResponse("image/jpeg", "UTF-8", new ByteArrayInputStream(baos.toByteArray()));
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
                                            return new WebResourceResponse("image/jpeg", "UTF-8", new ByteArrayInputStream(art));
                                        }
                                    } catch (Exception ignored) {}
                                }
                            }
                            
                            // 2. Handle Stream Playback Requests
                            Uri contentUri;
                            String mime;
                            if ("/video".equals(path)) {
                                contentUri = ContentUris.withAppendedId(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, id);
                                mime = "video/mp4";
                            } else {
                                contentUri = ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id);
                                mime = "audio/mpeg";
                            }
                            InputStream stream = getContentResolver().openInputStream(contentUri);
                            if (stream != null) {
                                return new WebResourceResponse(mime, "UTF-8", stream);
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
                        obj.put("category", "MP4 Video");
                        obj.put("quality", "1080p • " + sizeMb);
                        obj.put("description", "Device Storage: " + folder);
                        obj.put("url", "https://app.localmedia/video?id=" + id);
                        obj.put("thumbUrl", "https://app.localmedia/thumb?id=" + id + "&type=video");
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
                        obj.put("category", (artist != null && !artist.contains("unknown")) ? artist : "MP3 Audio");
                        obj.put("quality", "Audio • " + sizeMb);
                        obj.put("description", "Device Storage: " + folder);
                        obj.put("url", "https://app.localmedia/audio?id=" + id);
                        obj.put("thumbUrl", "https://app.localmedia/thumb?id=" + id + "&type=audio");
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
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
