package com.aakashstream.app.torrent;

import android.util.Log;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class TrackerClient {
    private static final String TAG = "TrackerClient";

    public static List<InetSocketAddress> announce(String trackerUrl, byte[] infoHash, byte[] peerId, long left) {
        List<InetSocketAddress> peers = new ArrayList<>();
        try {
            if (trackerUrl.startsWith("http://") || trackerUrl.startsWith("https://")) {
                peers.addAll(announceHttp(trackerUrl, infoHash, peerId, left));
            } else if (trackerUrl.startsWith("udp://")) {
                peers.addAll(announceUdp(trackerUrl, infoHash, peerId, left));
            }
        } catch (Exception e) {
            Log.w(TAG, "Failed announce to " + trackerUrl + ": " + e.getMessage());
        }
        return peers;
    }

    @SuppressWarnings("unchecked")
    private static List<InetSocketAddress> announceHttp(String trackerUrl, byte[] infoHash, byte[] peerId, long left) throws Exception {
        List<InetSocketAddress> peers = new ArrayList<>();

        StringBuilder urlSb = new StringBuilder(trackerUrl);
        urlSb.append(trackerUrl.contains("?") ? "&" : "?");
        urlSb.append("info_hash=").append(urlEncodeBytes(infoHash));
        urlSb.append("&peer_id=").append(urlEncodeBytes(peerId));
        urlSb.append("&port=6881");
        urlSb.append("&uploaded=0");
        urlSb.append("&downloaded=0");
        urlSb.append("&left=").append(left);
        urlSb.append("&compact=1");
        urlSb.append("&event=started");

        URL url = new URL(urlSb.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(6000);
        conn.setReadTimeout(6000);
        conn.setRequestProperty("User-Agent", "T2L-Torrent/1.0");

        if (conn.getResponseCode() == 200) {
            byte[] responseData;
            try (InputStream in = conn.getInputStream(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                byte[] buf = new byte[4096];
                int r;
                while ((r = in.read(buf)) != -1) baos.write(buf, 0, r);
                responseData = baos.toByteArray();
            }

            Object decoded = Bencode.decode(responseData);
            if (decoded instanceof Map) {
                Map<String, Object> dict = (Map<String, Object>) decoded;
                if (dict.containsKey("peers")) {
                    Object peersObj = dict.get("peers");
                    if (peersObj instanceof byte[]) {
                        peers.addAll(parseCompactPeers((byte[]) peersObj));
                    }
                }
            }
        }
        return peers;
    }

    private static List<InetSocketAddress> announceUdp(String trackerUrl, byte[] infoHash, byte[] peerId, long left) throws Exception {
        List<InetSocketAddress> peers = new ArrayList<>();
        URI uri = new URI(trackerUrl);
        String host = uri.getHost();
        int port = uri.getPort() > 0 ? uri.getPort() : 80;

        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setSoTimeout(5000);
            InetAddress address = InetAddress.getByName(host);

            // Step 1: Connect Request (BEP 15)
            long protocolId = 0x41727101980L;
            int actionConnect = 0;
            int transactionId = new Random().nextInt();

            ByteBuffer req = ByteBuffer.allocate(16);
            req.putLong(protocolId);
            req.putInt(actionConnect);
            req.putInt(transactionId);

            DatagramPacket sendPacket = new DatagramPacket(req.array(), 16, address, port);
            socket.send(sendPacket);

            byte[] respBuf = new byte[16];
            DatagramPacket recvPacket = new DatagramPacket(respBuf, respBuf.length);
            socket.receive(recvPacket);

            ByteBuffer resp = ByteBuffer.wrap(respBuf);
            int action = resp.getInt();
            int respTransId = resp.getInt();
            if (action != 0 || respTransId != transactionId) {
                return peers;
            }
            long connectionId = resp.getLong();

            // Step 2: Announce Request
            int actionAnnounce = 1;
            int transIdAnnounce = new Random().nextInt();

            ByteBuffer annReq = ByteBuffer.allocate(98);
            annReq.putLong(connectionId);
            annReq.putInt(actionAnnounce);
            annReq.putInt(transIdAnnounce);
            annReq.put(infoHash);
            annReq.put(peerId);
            annReq.putLong(0); // downloaded
            annReq.putLong(left); // left
            annReq.putLong(0); // uploaded
            annReq.putInt(2); // event: started
            annReq.putInt(0); // IP address: 0 default
            annReq.putInt(0); // key
            annReq.putInt(-1); // num_want: -1 default
            annReq.putShort((short) 6881); // port

            DatagramPacket annPacket = new DatagramPacket(annReq.array(), 98, address, port);
            socket.send(annPacket);

            byte[] annRespBuf = new byte[4096];
            DatagramPacket annRecvPacket = new DatagramPacket(annRespBuf, annRespBuf.length);
            socket.receive(annRecvPacket);

            int len = annRecvPacket.getLength();
            if (len >= 20) {
                ByteBuffer annResp = ByteBuffer.wrap(annRespBuf, 0, len);
                int annAction = annResp.getInt();
                int annTransId = annResp.getInt();
                if (annAction == 1 && annTransId == transIdAnnounce) {
                    int interval = annResp.getInt();
                    int leechers = annResp.getInt();
                    int seeders = annResp.getInt();

                    int peerBytesLen = len - 20;
                    byte[] peerBytes = new byte[peerBytesLen];
                    System.arraycopy(annRespBuf, 20, peerBytes, 0, peerBytesLen);
                    peers.addAll(parseCompactPeers(peerBytes));
                }
            }
        }
        return peers;
    }

    public static List<InetSocketAddress> parseCompactPeers(byte[] bytes) {
        List<InetSocketAddress> list = new ArrayList<>();
        if (bytes == null || bytes.length < 6) return list;
        int count = bytes.length / 6;
        for (int i = 0; i < count; i++) {
            int offset = i * 6;
            try {
                byte[] ipBytes = new byte[4];
                System.arraycopy(bytes, offset, ipBytes, 0, 4);
                InetAddress ip = InetAddress.getByAddress(ipBytes);
                int port = ((bytes[offset + 4] & 0xFF) << 8) | (bytes[offset + 5] & 0xFF);
                if (port > 0 && port <= 65535) {
                    list.add(new InetSocketAddress(ip, port));
                }
            } catch (Exception ignored) {}
        }
        return list;
    }

    private static String urlEncodeBytes(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            char c = (char) (b & 0xFF);
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
                    || c == '.' || c == '-' || c == '_' || c == '~') {
                sb.append(c);
            } else {
                sb.append(String.format("%%%02X", b & 0xFF));
            }
        }
        return sb.toString();
    }
}
