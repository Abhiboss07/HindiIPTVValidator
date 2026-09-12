package com.aakashstream.app.torrent;

import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

public class TorrentEngine {
    private static final String TAG = "TorrentEngine";
    private static final int MAX_ACTIVE_PEERS = 20;

    private final Context context;
    private final byte[] myPeerId = new byte[20];
    private final AtomicBoolean isRunning = new AtomicBoolean(false);

    private TorrentMetadata metadata;
    private PieceManager pieceManager;
    private final List<PeerConnection> activePeers = new CopyOnWriteArrayList<>();
    private final List<InetSocketAddress> discoveredPeers = Collections.synchronizedList(new ArrayList<>());

    private ExecutorService peerExecutor;
    private Thread schedulerThread;
    private Thread trackerThread;

    private volatile long lastDownloadedBytes = 0;
    private volatile long currentDownloadSpeedBytesPerSec = 0;
    private volatile String currentState = "IDLE"; // IDLE, CONNECTING, BUFFERING, PLAYING, ERROR

    public TorrentEngine(Context context) {
        this.context = context.getApplicationContext();
        generatePeerId();
    }

    private void generatePeerId() {
        byte[] prefix = "-T2L10-".getBytes();
        System.arraycopy(prefix, 0, myPeerId, 0, prefix.length);
        Random r = new Random();
        for (int i = prefix.length; i < 20; i++) {
            myPeerId[i] = (byte) ('0' + r.nextInt(10));
        }
    }

    public synchronized boolean start(TorrentMetadata meta) {
        stop();
        this.metadata = meta;
        File cacheDir = new File(context.getCacheDir(), "torrent_cache");
        this.pieceManager = new PieceManager(cacheDir, meta);
        this.isRunning.set(true);
        this.currentState = "CONNECTING";

        peerExecutor = Executors.newCachedThreadPool();

        // 1. Tracker Announcement Thread
        trackerThread = new Thread(this::runTrackerLoop, "TorrentTrackerThread");
        trackerThread.start();

        // 2. Sequential Request Scheduler Loop
        schedulerThread = new Thread(this::runSchedulerLoop, "TorrentSchedulerThread");
        schedulerThread.start();

        Log.i(TAG, "TorrentEngine started for " + meta.name + " (" + meta.totalLength + " bytes)");
        return true;
    }

    public synchronized void stop() {
        isRunning.set(false);
        if (trackerThread != null) trackerThread.interrupt();
        if (schedulerThread != null) schedulerThread.interrupt();

        for (PeerConnection conn : activePeers) {
            conn.close();
        }
        activePeers.clear();
        discoveredPeers.clear();

        if (peerExecutor != null) {
            peerExecutor.shutdownNow();
            peerExecutor = null;
        }

        currentState = "IDLE";
        Log.i(TAG, "TorrentEngine stopped.");
    }

    public boolean isRunning() {
        return isRunning.get();
    }

    public TorrentMetadata getMetadata() {
        return metadata;
    }

    public PieceManager getPieceManager() {
        return pieceManager;
    }

    public void setPlaybackPosition(long bytePos) {
        if (pieceManager != null) {
            pieceManager.setPlaybackOffset(bytePos);
        }
    }

    public int readStreamBytes(long startByte, int length, byte[] out, int offset, long timeoutMs) throws IOException {
        if (pieceManager == null) return -1;
        return pieceManager.readBytes(startByte, length, out, offset, timeoutMs);
    }

    private void runTrackerLoop() {
        while (isRunning.get()) {
            if (metadata != null) {
                long left = metadata.totalLength - (pieceManager.getCompletedPieceCount() * metadata.pieceLength);
                for (String trackerUrl : metadata.trackers) {
                    if (!isRunning.get()) break;
                    List<InetSocketAddress> peers = TrackerClient.announce(trackerUrl, metadata.infoHash, myPeerId, Math.max(0, left));
                    for (InetSocketAddress p : peers) {
                        if (!discoveredPeers.contains(p)) {
                            discoveredPeers.add(p);
                        }
                    }
                }
            }

            // Connect to discovered peers up to MAX_ACTIVE_PEERS
            connectToPeers();

            try {
                Thread.sleep(30000); // Re-announce every 30s
            } catch (InterruptedException e) {
                break;
            }
        }
    }

    private void connectToPeers() {
        if (!isRunning.get() || peerExecutor == null) return;

        // Cleanup closed connections
        activePeers.removeIf(conn -> !conn.isConnected());

        synchronized (discoveredPeers) {
            for (InetSocketAddress addr : discoveredPeers) {
                if (activePeers.size() >= MAX_ACTIVE_PEERS) break;
                boolean alreadyConnected = false;
                for (PeerConnection c : activePeers) {
                    // check if matching
                }
                if (!alreadyConnected) {
                    PeerConnection conn = new PeerConnection(addr, metadata.infoHash, myPeerId, pieceManager);
                    activePeers.add(conn);
                    peerExecutor.execute(conn);
                }
            }
        }
    }

    private void runSchedulerLoop() {
        long lastMeasureTime = System.currentTimeMillis();
        long lastPiecesCount = 0;

        while (isRunning.get()) {
            try {
                if (pieceManager != null) {
                    List<Integer> priorityPieces = pieceManager.getPrioritizedPieceList();
                    for (int pieceIdx : priorityPieces) {
                        if (pieceManager.hasPiece(pieceIdx)) continue;

                        int pieceSize = pieceManager.getExpectedPieceSize(pieceIdx);
                        int totalBlocks = (pieceSize + PeerConnection.BLOCK_SIZE - 1) / PeerConnection.BLOCK_SIZE;

                        for (PeerConnection peer : activePeers) {
                            if (peer.canRequest() && peer.hasPiece(pieceIdx)) {
                                for (int b = 0; b < totalBlocks; b++) {
                                    int beginOffset = b * PeerConnection.BLOCK_SIZE;
                                    int reqLen = Math.min(PeerConnection.BLOCK_SIZE, pieceSize - beginOffset);
                                    peer.requestBlock(pieceIdx, beginOffset, reqLen);
                                }
                                break;
                            }
                        }
                    }

                    // Speed calculation
                    long now = System.currentTimeMillis();
                    long dt = now - lastMeasureTime;
                    if (dt >= 1000) {
                        int currentCount = pieceManager.getCompletedPieceCount();
                        long deltaPieces = currentCount - lastPiecesCount;
                        long deltaBytes = deltaPieces * metadata.pieceLength;
                        currentDownloadSpeedBytesPerSec = (deltaBytes * 1000) / dt;

                        lastMeasureTime = now;
                        lastPiecesCount = currentCount;

                        if (currentCount > 0) {
                            currentState = "PLAYING";
                        } else if (!activePeers.isEmpty()) {
                            currentState = "BUFFERING";
                        }
                    }
                }

                Thread.sleep(150);
            } catch (InterruptedException e) {
                break;
            } catch (Exception e) {
                Log.w(TAG, "Scheduler loop note: " + e.getMessage());
            }
        }
    }

    public int getSeederCount() {
        int seeders = 0;
        for (PeerConnection p : activePeers) {
            if (p.isSeeder()) seeders++;
        }
        return seeders;
    }

    public JSONObject getStatusJson() {
        JSONObject obj = new JSONObject();
        try {
            obj.put("state", currentState);
            obj.put("active", isRunning.get());
            obj.put("downloadSpeedKbps", (currentDownloadSpeedBytesPerSec * 8) / 1000);
            obj.put("downloadSpeedMbps", Math.round(((currentDownloadSpeedBytesPerSec * 8) / 1000000.0) * 10.0) / 10.0);
            obj.put("downloadSpeedBytesPerSec", currentDownloadSpeedBytesPerSec);
            obj.put("activePeers", activePeers.size());
            obj.put("connectedPeers", activePeers.size());
            obj.put("discoveredPeers", discoveredPeers.size());
            obj.put("seeders", Math.max(getSeederCount(), activePeers.size() > 0 ? 1 : 0));
            if (pieceManager != null && metadata != null) {
                long downloadedBytes = (long) pieceManager.getCompletedPieceCount() * metadata.pieceLength;
                obj.put("progressPercent", Math.round(pieceManager.getProgressPercent() * 10.0) / 10.0);
                obj.put("completedPieces", pieceManager.getCompletedPieceCount());
                obj.put("totalPieces", metadata.getPieceCount());
                obj.put("totalBytes", metadata.totalLength);
                obj.put("downloadedBytes", Math.min(metadata.totalLength, downloadedBytes));
                obj.put("fileName", metadata.name);
                obj.put("isComplete", pieceManager.isComplete());
            } else {
                obj.put("progressPercent", 0.0);
                obj.put("completedPieces", 0);
                obj.put("totalPieces", 0);
                obj.put("totalBytes", 0);
                obj.put("downloadedBytes", 0);
                obj.put("fileName", "");
                obj.put("isComplete", false);
            }
        } catch (Exception ignored) {}
        return obj;
    }
}
