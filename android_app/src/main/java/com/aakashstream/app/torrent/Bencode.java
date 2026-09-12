package com.aakashstream.app.torrent;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * High-performance Bencode decoder and encoder.
 */
public class Bencode {

    public static Object decode(byte[] data) throws IOException {
        if (data == null || data.length == 0) return null;
        ByteArrayInputStream bais = new ByteArrayInputStream(data);
        return decodeNext(bais);
    }

    public static Object decode(InputStream in) throws IOException {
        return decodeNext(in);
    }

    private static Object decodeNext(InputStream in) throws IOException {
        int b = in.read();
        if (b == -1) return null;

        if (b == 'i') {
            return decodeInteger(in);
        } else if (b == 'l') {
            return decodeList(in);
        } else if (b == 'd') {
            return decodeDictionary(in);
        } else if (b >= '0' && b <= '9') {
            return decodeBytes(in, b);
        } else if (b == 'e') {
            return null; // End of container
        } else {
            throw new IOException("Unexpected Bencode token: " + (char) b + " (byte " + b + ")");
        }
    }

    private static Long decodeInteger(InputStream in) throws IOException {
        StringBuilder sb = new StringBuilder();
        int b;
        while ((b = in.read()) != -1) {
            if (b == 'e') break;
            sb.append((char) b);
        }
        if (b == -1) throw new EOFException("Premature EOF while reading integer");
        return Long.parseLong(sb.toString());
    }

    private static List<Object> decodeList(InputStream in) throws IOException {
        List<Object> list = new ArrayList<>();
        while (true) {
            in.mark(1);
            int peek = in.read();
            if (peek == 'e' || peek == -1) break;
            in.reset();
            Object item = decodeNext(in);
            if (item != null) {
                list.add(item);
            }
        }
        return list;
    }

    private static Map<String, Object> decodeDictionary(InputStream in) throws IOException {
        Map<String, Object> dict = new LinkedHashMap<>();
        while (true) {
            in.mark(1);
            int peek = in.read();
            if (peek == 'e' || peek == -1) break;
            in.reset();

            Object keyObj = decodeNext(in);
            if (keyObj == null) break;
            String key;
            if (keyObj instanceof byte[]) {
                key = new String((byte[]) keyObj, StandardCharsets.UTF_8);
            } else {
                key = keyObj.toString();
            }

            Object value = decodeNext(in);
            dict.put(key, value);
        }
        return dict;
    }

    private static byte[] decodeBytes(InputStream in, int firstDigit) throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append((char) firstDigit);
        int b;
        while ((b = in.read()) != -1) {
            if (b == ':') break;
            sb.append((char) b);
        }
        if (b == -1) throw new EOFException("Premature EOF while reading string length");
        int length = Integer.parseInt(sb.toString());
        if (length < 0) throw new IOException("Negative string length in Bencode");

        byte[] result = new byte[length];
        int read = 0;
        while (read < length) {
            int count = in.read(result, read, length - read);
            if (count == -1) throw new EOFException("Unexpected EOF while reading " + length + " bytes");
            read += count;
        }
        return result;
    }

    public static byte[] encode(Object obj) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        encodeTo(obj, baos);
        return baos.toByteArray();
    }

    @SuppressWarnings("unchecked")
    private static void encodeTo(Object obj, ByteArrayOutputStream out) throws IOException {
        if (obj instanceof Long || obj instanceof Integer) {
            out.write('i');
            out.write(obj.toString().getBytes(StandardCharsets.US_ASCII));
            out.write('e');
        } else if (obj instanceof byte[]) {
            byte[] bytes = (byte[]) obj;
            out.write(Integer.toString(bytes.length).getBytes(StandardCharsets.US_ASCII));
            out.write(':');
            out.write(bytes);
        } else if (obj instanceof String) {
            byte[] bytes = ((String) obj).getBytes(StandardCharsets.UTF_8);
            out.write(Integer.toString(bytes.length).getBytes(StandardCharsets.US_ASCII));
            out.write(':');
            out.write(bytes);
        } else if (obj instanceof List) {
            out.write('l');
            for (Object item : (List<?>) obj) {
                encodeTo(item, out);
            }
            out.write('e');
        } else if (obj instanceof Map) {
            out.write('d');
            Map<String, Object> map = (Map<String, Object>) obj;
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                byte[] keyBytes = entry.getKey().getBytes(StandardCharsets.UTF_8);
                out.write(Integer.toString(keyBytes.length).getBytes(StandardCharsets.US_ASCII));
                out.write(':');
                out.write(keyBytes);
                encodeTo(entry.getValue(), out);
            }
            out.write('e');
        }
    }
}
