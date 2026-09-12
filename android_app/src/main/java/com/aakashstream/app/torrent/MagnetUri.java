package com.aakashstream.app.torrent;

import java.io.ByteArrayOutputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class MagnetUri {

    public final byte[] infoHash;
    public final String hexInfoHash;
    public final String displayName;
    public final List<String> trackers;

    public MagnetUri(byte[] infoHash, String displayName, List<String> trackers) {
        this.infoHash = infoHash;
        this.hexInfoHash = bytesToHex(infoHash);
        this.displayName = displayName != null && !displayName.isEmpty() ? displayName : "Torrent Stream";
        this.trackers = trackers;
    }

    public static MagnetUri parse(String uriStr) throws IllegalArgumentException {
        if (uriStr == null || !uriStr.startsWith("magnet:?")) {
            throw new IllegalArgumentException("Invalid magnet URI: must begin with magnet:?");
        }

        String query = uriStr.substring(8);
        String[] params = query.split("&");

        byte[] infoHash = null;
        String dn = null;
        List<String> trackers = new ArrayList<>();

        for (String param : params) {
            String[] pair = param.split("=", 2);
            if (pair.length < 2) continue;

            String key = pair[0].trim();
            String val;
            try {
                val = URLDecoder.decode(pair[1].trim(), "UTF-8");
            } catch (Exception e) {
                val = pair[1].trim();
            }

            if ("xt".equalsIgnoreCase(key)) {
                if (val.toLowerCase(Locale.ROOT).startsWith("urn:btih:")) {
                    String hashStr = val.substring(9).trim();
                    if (hashStr.length() == 40) {
                        infoHash = hexToBytes(hashStr);
                    } else if (hashStr.length() == 32) {
                        infoHash = base32ToBytes(hashStr);
                    }
                }
            } else if ("dn".equalsIgnoreCase(key)) {
                dn = val;
            } else if ("tr".equalsIgnoreCase(key)) {
                if (!trackers.contains(val)) {
                    trackers.add(val);
                }
            }
        }

        if (infoHash == null) {
            throw new IllegalArgumentException("Magnet URI does not contain a valid BTIH xt parameter");
        }

        // Add standard open BitTorrent trackers if none were provided
        if (trackers.isEmpty()) {
            trackers.add("udp://tracker.opentrackr.org:1337/announce");
            trackers.add("udp://open.stealth.si:80/announce");
            trackers.add("udp://tracker.torrent.eu.org:451/announce");
            trackers.add("udp://explodie.org:6969/announce");
            trackers.add("http://tracker.opentrackr.org:1337/announce");
        }

        return new MagnetUri(infoHash, dn, trackers);
    }

    private static byte[] hexToBytes(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i + 1), 16));
        }
        return data;
    }

    private static byte[] base32ToBytes(String base32) {
        String base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        base32 = base32.toUpperCase(Locale.ROOT);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int buffer = 0;
        int bitsLeft = 0;
        for (char c : base32.toCharArray()) {
            int val = base32Chars.indexOf(c);
            if (val < 0) continue;
            buffer = (buffer << 5) | val;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                out.write((buffer >> (bitsLeft - 8)) & 0xFF);
                bitsLeft -= 8;
            }
        }
        return out.toByteArray();
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
