package com.aakashstream.app.torrent;

import android.util.Log;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Manages piece caching, SHA-1 verification, and sequential priority scheduling.
 */
public class PieceManager {
    private static final String TAG = "PieceManager";

    private final File torrentDir;
    private final TorrentMetadata metadata;
    private final int totalPieces;
    private final long pieceLength;
    private final long totalSize;
    private final boolean[] verifiedPieces;

    private volatile long currentPlaybackOffset = 0;
    private volatile int highPriorityWindowSize = 10; // Number of pieces ahead

    public PieceManager(File baseCacheDir, TorrentMetadata metadata) {
        this.metadata = metadata;
        this.totalPieces = metadata.getPieceCount();
        this.pieceLength = metadata.pieceLength;
        this.totalSize = metadata.totalLength;
        this.verifiedPieces = new boolean[totalPieces];

        this.torrentDir = new File(baseCacheDir, metadata.hexInfoHash);
        if (!this.torrentDir.exists()) {
            this.torrentDir.mkdirs();
        }

        // Scan existing cached pieces on disk
        scanExistingPieces();
    }

    private void scanExistingPieces() {
        for (int i = 0; i < totalPieces; i++) {
            File pFile = getPieceFile(i);
            if (pFile.exists() && pFile.length() == getExpectedPieceSize(i)) {
                if (verifyPieceOnDisk(i, pFile)) {
                    verifiedPieces[i] = true;
                } else {
                    pFile.delete();
                }
            }
        }
    }

    public File getPieceFile(int index) {
        return new File(torrentDir, "piece_" + index + ".dat");
    }

    public int getExpectedPieceSize(int index) {
        if (index < totalPieces - 1) {
            return (int) pieceLength;
        } else {
            long rem = totalSize % pieceLength;
            return rem == 0 ? (int) pieceLength : (int) rem;
        }
    }

    public synchronized boolean hasPiece(int index) {
        if (index < 0 || index >= totalPieces) return false;
        return verifiedPieces[index];
    }

    public synchronized int getCompletedPieceCount() {
        int count = 0;
        for (boolean b : verifiedPieces) {
            if (b) count++;
        }
        return count;
    }

    public double getProgressPercent() {
        if (totalPieces == 0) return 0.0;
        return (getCompletedPieceCount() * 100.0) / totalPieces;
    }

    public synchronized boolean saveAndVerifyPiece(int index, byte[] data) {
        if (index < 0 || index >= totalPieces) return false;
        if (verifiedPieces[index]) return true; // Already verified

        byte[] expectedHash = metadata.pieceHashes[index];
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            byte[] actualHash = sha1.digest(data);
            if (!Arrays.equals(expectedHash, actualHash)) {
                Log.w(TAG, "SHA-1 verification failed for piece " + index);
                return false;
            }

            File pFile = getPieceFile(index);
            try (FileOutputStream fos = new FileOutputStream(pFile)) {
                fos.write(data);
            }
            verifiedPieces[index] = true;
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Error saving piece " + index + ": " + e.getMessage());
            return false;
        }
    }

    private boolean verifyPieceOnDisk(int index, File pFile) {
        try {
            MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
            byte[] buf = new byte[8192];
            try (FileInputStream fis = new FileInputStream(pFile)) {
                int read;
                while ((read = fis.read(buf)) != -1) {
                    sha1.update(buf, 0, read);
                }
            }
            byte[] actualHash = sha1.digest();
            return Arrays.equals(metadata.pieceHashes[index], actualHash);
        } catch (Exception e) {
            return false;
        }
    }

    public void setPlaybackOffset(long byteOffset) {
        this.currentPlaybackOffset = Math.max(0, Math.min(byteOffset, totalSize - 1));
    }

    /**
     * Sequential Priority Strategy:
     * 1. Piece 0 (container header).
     * 2. Last 2 pieces (MP4 moov atom at EOF).
     * 3. Current sliding playback window: [currentPiece, currentPiece + windowSize].
     */
    public synchronized List<Integer> getPrioritizedPieceList() {
        List<Integer> priorities = new ArrayList<>();
        Set<Integer> added = new HashSet<>();

        // 1. Critical Header: Piece 0
        if (!verifiedPieces[0]) {
            priorities.add(0);
            added.add(0);
        }

        // 2. Critical Footer: Last 2 pieces (for MP4 moov atom)
        for (int i = Math.max(0, totalPieces - 2); i < totalPieces; i++) {
            if (!verifiedPieces[i] && added.add(i)) {
                priorities.add(i);
            }
        }

        // 3. Sliding Playback Window
        int currentPiece = (int) (currentPlaybackOffset / pieceLength);
        int windowEnd = Math.min(totalPieces, currentPiece + highPriorityWindowSize);
        for (int i = currentPiece; i < windowEnd; i++) {
            if (!verifiedPieces[i] && added.add(i)) {
                priorities.add(i);
            }
        }

        // 4. Lookahead Window (next 20 pieces)
        int lookaheadEnd = Math.min(totalPieces, windowEnd + 20);
        for (int i = windowEnd; i < lookaheadEnd; i++) {
            if (!verifiedPieces[i] && added.add(i)) {
                priorities.add(i);
            }
        }

        return priorities;
    }

    /**
     * Checks if a contiguous byte range is downloaded and ready for playback.
     */
    public synchronized boolean isRangeAvailable(long startByte, long length) {
        if (length <= 0) return true;
        long endByte = Math.min(totalSize - 1, startByte + length - 1);
        int startPiece = (int) (startByte / pieceLength);
        int endPiece = (int) (endByte / pieceLength);

        for (int p = startPiece; p <= endPiece; p++) {
            if (p >= totalPieces || !verifiedPieces[p]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Reads a byte range from the piece cache.
     * Blocks up to timeoutMs if pieces are actively downloading.
     */
    public int readBytes(long startByte, int length, byte[] outBuffer, int outOffset, long timeoutMs) throws IOException {
        if (startByte >= totalSize || length <= 0) return 0;
        long actualLength = Math.min(length, totalSize - startByte);

        long deadline = System.currentTimeMillis() + timeoutMs;
        while (!isRangeAvailable(startByte, actualLength)) {
            if (System.currentTimeMillis() >= deadline) {
                return -1; // Timeout waiting for pieces
            }
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return -1;
            }
        }

        long bytesRead = 0;
        while (bytesRead < actualLength) {
            long currentPos = startByte + bytesRead;
            int pieceIdx = (int) (currentPos / pieceLength);
            long offsetInPiece = currentPos % pieceLength;
            int bytesLeftInPiece = getExpectedPieceSize(pieceIdx) - (int) offsetInPiece;
            int toRead = (int) Math.min(actualLength - bytesRead, bytesLeftInPiece);

            File pFile = getPieceFile(pieceIdx);
            try (RandomAccessFile raf = new RandomAccessFile(pFile, "r")) {
                raf.seek(offsetInPiece);
                raf.readFully(outBuffer, outOffset + (int) bytesRead, toRead);
            }
            bytesRead += toRead;
        }

        return (int) bytesRead;
    }

    public long getBufferedBytesAhead(long currentOffset) {
        int currentPiece = (int) (currentOffset / pieceLength);
        long buffered = 0;
        for (int p = currentPiece; p < totalPieces; p++) {
            if (verifiedPieces[p]) {
                buffered += getExpectedPieceSize(p);
            } else {
                break; // Stop at first missing contiguous piece
            }
        }
        return buffered;
    }

    public synchronized boolean isComplete() {
        return getCompletedPieceCount() >= totalPieces;
    }

    public boolean assembleToFile(File targetFile) throws IOException {
        if (targetFile.getParentFile() != null && !targetFile.getParentFile().exists()) {
            targetFile.getParentFile().mkdirs();
        }
        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
            byte[] buf = new byte[64 * 1024];
            for (int i = 0; i < totalPieces; i++) {
                File pFile = getPieceFile(i);
                if (!pFile.exists()) return false;
                try (FileInputStream fis = new FileInputStream(pFile)) {
                    int r;
                    while ((r = fis.read(buf)) != -1) {
                        fos.write(buf, 0, r);
                    }
                }
            }
        }
        return true;
    }

    public void cleanCache() {
        if (torrentDir.exists()) {
            File[] files = torrentDir.listFiles();
            if (files != null) {
                for (File f : files) f.delete();
            }
            torrentDir.delete();
        }
    }
}
