package com.aakashstream.app.torrent;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class TorrentMetadata {

    public static class TorrentFile {
        public final int index;
        public final String name;
        public final String path;
        public final long length;
        public final long byteOffset;

        public TorrentFile(int index, String name, String path, long length, long byteOffset) {
            this.index = index;
            this.name = name;
            this.path = path;
            this.length = length;
            this.byteOffset = byteOffset;
        }

        public boolean isPlayableVideo() {
            String lower = name.toLowerCase(Locale.ROOT);
            return lower.endsWith(".mp4") || lower.endsWith(".mkv") || lower.endsWith(".webm")
                    || lower.endsWith(".avi") || lower.endsWith(".mov") || lower.endsWith(".ts")
                    || lower.endsWith(".m4v");
        }
    }

    public final byte[] infoHash;
    public final String hexInfoHash;
    public final String name;
    public final long pieceLength;
    public final byte[][] pieceHashes;
    public final long totalLength;
    public final List<TorrentFile> files;
    public final List<String> trackers;

    public TorrentMetadata(byte[] infoHash, String name, long pieceLength, byte[][] pieceHashes,
                           long totalLength, List<TorrentFile> files, List<String> trackers) {
        this.infoHash = infoHash;
        this.hexInfoHash = bytesToHex(infoHash);
        this.name = name;
        this.pieceLength = pieceLength;
        this.pieceHashes = pieceHashes;
        this.totalLength = totalLength;
        this.files = files;
        this.trackers = trackers;
    }

    public int getPieceCount() {
        return pieceHashes != null ? pieceHashes.length : 0;
    }

    public TorrentFile getPlayableVideoFile() {
        TorrentFile best = null;
        for (TorrentFile f : files) {
            if (f.isPlayableVideo()) {
                if (best == null || f.length > best.length) {
                    best = f;
                }
            }
        }
        if (best == null && !files.isEmpty()) {
            best = files.get(0);
        }
        return best;
    }

    @SuppressWarnings("unchecked")
    public static TorrentMetadata fromBytes(byte[] torrentData) throws Exception {
        Map<String, Object> root = (Map<String, Object>) Bencode.decode(torrentData);
        if (root == null || !root.containsKey("info")) {
            throw new IllegalArgumentException("Invalid torrent file: missing 'info' dictionary");
        }

        Map<String, Object> info = (Map<String, Object>) root.get("info");
        byte[] infoEncoded = Bencode.encode(info);
        MessageDigest sha1 = MessageDigest.getInstance("SHA-1");
        byte[] infoHash = sha1.digest(infoEncoded);

        String name = "Torrent Stream";
        if (info.containsKey("name")) {
            Object nameObj = info.get("name");
            name = nameObj instanceof byte[] ? new String((byte[]) nameObj, StandardCharsets.UTF_8) : nameObj.toString();
        }

        long pieceLength = ((Number) info.get("piece length")).longValue();
        byte[] rawPieces = (byte[]) info.get("pieces");
        int pieceCount = rawPieces.length / 20;
        byte[][] pieceHashes = new byte[pieceCount][20];
        for (int i = 0; i < pieceCount; i++) {
            System.arraycopy(rawPieces, i * 20, pieceHashes[i], 0, 20);
        }

        List<TorrentFile> files = new ArrayList<>();
        long totalLength = 0;

        if (info.containsKey("files")) {
            List<Object> fileList = (List<Object>) info.get("files");
            long offset = 0;
            int idx = 0;
            for (Object fObj : fileList) {
                Map<String, Object> fMap = (Map<String, Object>) fObj;
                long len = ((Number) fMap.get("length")).longValue();
                List<Object> pathList = (List<Object>) fMap.get("path");
                StringBuilder pathSb = new StringBuilder();
                for (Object p : pathList) {
                    if (pathSb.length() > 0) pathSb.append("/");
                    String segment = p instanceof byte[] ? new String((byte[]) p, StandardCharsets.UTF_8) : p.toString();
                    pathSb.append(segment);
                }
                String fullPath = pathSb.toString();
                String fileName = fullPath;
                int lastSlash = fullPath.lastIndexOf('/');
                if (lastSlash >= 0) fileName = fullPath.substring(lastSlash + 1);

                files.add(new TorrentFile(idx++, fileName, fullPath, len, offset));
                offset += len;
            }
            totalLength = offset;
        } else if (info.containsKey("length")) {
            long len = ((Number) info.get("length")).longValue();
            files.add(new TorrentFile(0, name, name, len, 0));
            totalLength = len;
        }

        List<String> trackers = new ArrayList<>();
        if (root.containsKey("announce")) {
            Object annObj = root.get("announce");
            String ann = annObj instanceof byte[] ? new String((byte[]) annObj, StandardCharsets.UTF_8) : annObj.toString();
            trackers.add(ann);
        }
        if (root.containsKey("announce-list")) {
            List<Object> tierList = (List<Object>) root.get("announce-list");
            for (Object tierObj : tierList) {
                if (tierObj instanceof List) {
                    for (Object trObj : (List<Object>) tierObj) {
                        String tr = trObj instanceof byte[] ? new String((byte[]) trObj, StandardCharsets.UTF_8) : trObj.toString();
                        if (!trackers.contains(tr)) trackers.add(tr);
                    }
                }
            }
        }

        return new TorrentMetadata(infoHash, name, pieceLength, pieceHashes, totalLength, files, trackers);
    }

    public static TorrentMetadata fromFile(File file) throws Exception {
        byte[] data = new byte[(int) file.length()];
        try (FileInputStream fis = new FileInputStream(file)) {
            int read = 0;
            while (read < data.length) {
                int count = fis.read(data, read, data.length - read);
                if (count == -1) break;
                read += count;
            }
        }
        return fromBytes(data);
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
