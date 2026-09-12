package com.aakashstream.app.torrent;

import android.util.Log;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.BitSet;
import java.util.concurrent.atomic.AtomicBoolean;

public class PeerConnection implements Runnable {
    private static final String TAG = "PeerConnection";
    public static final int BLOCK_SIZE = 16384; // 16 KB standard block size

    private final InetSocketAddress address;
    private final byte[] infoHash;
    private final byte[] myPeerId;
    private final PieceManager pieceManager;
    private final AtomicBoolean isRunning = new AtomicBoolean(true);

    private Socket socket;
    private DataInputStream in;
    private DataOutputStream out;
    private volatile boolean peerChoking = true;
    private volatile boolean amInterested = false;
    private BitSet peerPieces;

    public PeerConnection(InetSocketAddress address, byte[] infoHash, byte[] myPeerId, PieceManager pieceManager) {
        this.address = address;
        this.infoHash = infoHash;
        this.myPeerId = myPeerId;
        this.pieceManager = pieceManager;
    }

    public boolean isConnected() {
        return socket != null && socket.isConnected() && !socket.isClosed();
    }

    public void close() {
        isRunning.set(false);
        try {
            if (socket != null) socket.close();
        } catch (Exception ignored) {}
    }

    @Override
    public void run() {
        try {
            socket = new Socket();
            socket.connect(address, 5000);
            socket.setSoTimeout(15000);
            in = new DataInputStream(socket.getInputStream());
            out = new DataOutputStream(socket.getOutputStream());

            // 1. Send Handshake
            sendHandshake();

            // 2. Read Handshake
            if (!readHandshake()) {
                close();
                return;
            }

            // 3. Main Message Loop
            while (isRunning.get() && !socket.isClosed()) {
                int length = in.readInt();
                if (length == 0) {
                    // Keep-alive
                    continue;
                }

                int messageId = in.readByte() & 0xFF;
                int payloadLength = length - 1;

                handleMessage(messageId, payloadLength);
            }
        } catch (Exception e) {
            // Normal connection teardown or timeout
        } finally {
            close();
        }
    }

    private void sendHandshake() throws IOException {
        byte[] handshake = new byte[68];
        handshake[0] = 19;
        System.arraycopy("BitTorrent protocol".getBytes(), 0, handshake, 1, 19);
        // 8 reserved extension bytes (indices 20..27) are 0
        System.arraycopy(infoHash, 0, handshake, 28, 20);
        System.arraycopy(myPeerId, 0, handshake, 48, 20);
        out.write(handshake);
        out.flush();
    }

    private boolean readHandshake() throws IOException {
        byte[] buf = new byte[68];
        in.readFully(buf);
        if (buf[0] != 19) return false;
        byte[] receivedHash = new byte[20];
        System.arraycopy(buf, 28, receivedHash, 0, 20);
        return Arrays.equals(infoHash, receivedHash);
    }

    private void handleMessage(int messageId, int payloadLen) throws IOException {
        switch (messageId) {
            case 0: // Choke
                peerChoking = true;
                break;
            case 1: // Unchoke
                peerChoking = false;
                sendInterestedIfNeeded();
                break;
            case 2: // Interested
                break;
            case 3: // Not interested
                break;
            case 4: // Have
                int haveIndex = in.readInt();
                if (peerPieces == null) peerPieces = new BitSet();
                peerPieces.set(haveIndex);
                sendInterestedIfNeeded();
                break;
            case 5: // Bitfield
                byte[] bitfieldBytes = new byte[payloadLen];
                in.readFully(bitfieldBytes);
                peerPieces = BitSet.valueOf(bitfieldBytes);
                sendInterestedIfNeeded();
                break;
            case 7: // Piece payload: <index(4)><begin(4)><block(...)>
                int pieceIndex = in.readInt();
                int beginOffset = in.readInt();
                int blockDataLen = payloadLen - 8;
                byte[] blockData = new byte[blockDataLen];
                in.readFully(blockData);
                onBlockReceived(pieceIndex, beginOffset, blockData);
                break;
            default:
                // Skip unhandled message
                in.skipBytes(payloadLen);
                break;
        }
    }

    private void sendInterestedIfNeeded() throws IOException {
        if (!amInterested) {
            amInterested = true;
            out.writeInt(1); // Length = 1
            out.writeByte(2); // Interested
            out.flush();
        }
    }

    public boolean hasPiece(int index) {
        return peerPieces != null && peerPieces.get(index);
    }

    public boolean isSeeder() {
        if (peerPieces == null) return false;
        return peerPieces.cardinality() > 0;
    }

    public boolean canRequest() {
        return isConnected() && !peerChoking;
    }

    public void requestBlock(int pieceIndex, int beginOffset, int length) {
        try {
            if (!canRequest()) return;
            out.writeInt(13); // Length = 1 + 4 + 4 + 4
            out.writeByte(6); // Request ID
            out.writeInt(pieceIndex);
            out.writeInt(beginOffset);
            out.writeInt(length);
            out.flush();
        } catch (Exception e) {
            close();
        }
    }

    // Temporary storage buffer for active piece assembly
    private static class ActivePiece {
        final int index;
        final int size;
        final byte[] data;
        final boolean[] receivedBlocks;
        int blocksReceivedCount = 0;

        ActivePiece(int index, int size) {
            this.index = index;
            this.size = size;
            this.data = new byte[size];
            int totalBlocks = (size + BLOCK_SIZE - 1) / BLOCK_SIZE;
            this.receivedBlocks = new boolean[totalBlocks];
        }
    }

    private ActivePiece currentDownloadingPiece;

    private synchronized void onBlockReceived(int pieceIndex, int beginOffset, byte[] blockData) {
        int expectedSize = pieceManager.getExpectedPieceSize(pieceIndex);
        if (currentDownloadingPiece == null || currentDownloadingPiece.index != pieceIndex) {
            currentDownloadingPiece = new ActivePiece(pieceIndex, expectedSize);
        }

        int blockIndex = beginOffset / BLOCK_SIZE;
        if (blockIndex < currentDownloadingPiece.receivedBlocks.length && !currentDownloadingPiece.receivedBlocks[blockIndex]) {
            System.arraycopy(blockData, 0, currentDownloadingPiece.data, beginOffset, blockData.length);
            currentDownloadingPiece.receivedBlocks[blockIndex] = true;
            currentDownloadingPiece.blocksReceivedCount++;

            if (currentDownloadingPiece.blocksReceivedCount == currentDownloadingPiece.receivedBlocks.length) {
                // Entire piece complete! Verify and write to cache
                pieceManager.saveAndVerifyPiece(pieceIndex, currentDownloadingPiece.data);
                currentDownloadingPiece = null;
            }
        }
    }
}
