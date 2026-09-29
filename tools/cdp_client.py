#!/usr/bin/env python3
import socket
import os
import base64
import json
import urllib.request
import struct
import time

class CDPClient:
    def __init__(self, port=9222):
        self.port = port
        self.sock = None
        self.msg_id = 0
        self.connect()

    def connect(self):
        req = urllib.request.Request(f'http://127.0.0.1:{self.port}/json/list')
        with urllib.request.urlopen(req) as resp:
            targets = json.loads(resp.read().decode())
        
        ws_url = targets[0]['webSocketDebuggerUrl']
        path = ws_url.split(f'127.0.0.1:{self.port}')[1]

        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.connect(('127.0.0.1', self.port))
        
        key = base64.b64encode(os.urandom(16)).decode()
        req_header = (
            f'GET {path} HTTP/1.1\r\n'
            f'Host: 127.0.0.1:{self.port}\r\n'
            f'Upgrade: websocket\r\n'
            f'Connection: Upgrade\r\n'
            f'Sec-WebSocket-Key: {key}\r\n'
            f'Sec-WebSocket-Version: 13\r\n\r\n'
        )
        self.sock.sendall(req_header.encode())
        resp = self.sock.recv(4096).decode(errors='ignore')
        if '101' not in resp:
            raise RuntimeError(f"WebSocket handshake failed: {resp}")

    def send_frame(self, text):
        data = text.encode('utf-8')
        length = len(data)
        mask_key = os.urandom(4)
        
        header = bytearray()
        header.append(0x81) # FIN + text opcode
        
        if length <= 125:
            header.append(0x80 | length)
        elif length <= 65535:
            header.append(0x80 | 126)
            header.extend(struct.pack('!H', length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack('!Q', length))
            
        header.extend(mask_key)
        
        masked_data = bytearray(length)
        for i in range(length):
            masked_data[i] = data[i] ^ mask_key[i % 4]
            
        self.sock.sendall(header + masked_data)

    def recv_frame(self):
        head = self.sock.recv(2)
        if len(head) < 2:
            return None
        b1, b2 = head[0], head[1]
        opcode = b1 & 0x0F
        has_mask = (b2 & 0x80) != 0
        length = b2 & 0x7F
        
        if length == 126:
            length = struct.unpack('!H', self.sock.recv(2))[0]
        elif length == 127:
            length = struct.unpack('!Q', self.sock.recv(8))[0]
            
        mask_key = self.sock.recv(4) if has_mask else None
        
        chunks = []
        bytes_left = length
        while bytes_left > 0:
            chunk = self.sock.recv(min(bytes_left, 65536))
            if not chunk:
                break
            chunks.append(chunk)
            bytes_left -= len(chunk)
            
        payload = b''.join(chunks)
        if has_mask:
            unmasked = bytearray(length)
            for i in range(length):
                unmasked[i] = payload[i] ^ mask_key[i % 4]
            payload = bytes(unmasked)
            
        if opcode == 0x01: # Text frame
            return payload.decode('utf-8', errors='ignore')
        elif opcode == 0x08: # Close frame
            return None
        return payload

    def evaluate(self, expression, await_promise=True, timeout=10.0):
        self.msg_id += 1
        req_id = self.msg_id
        cmd = {
            'id': req_id,
            'method': 'Runtime.evaluate',
            'params': {
                'expression': expression,
                'awaitPromise': await_promise,
                'returnByValue': True
            }
        }
        self.send_frame(json.dumps(cmd))
        
        start = time.time()
        while time.time() - start < timeout:
            msg = self.recv_frame()
            if not msg:
                continue
            try:
                res = json.loads(msg)
                if res.get('id') == req_id:
                    result = res.get('result', {})
                    if 'exceptionDetails' in result:
                        return {'error': result['exceptionDetails']}
                    return result.get('result', {}).get('value')
            except Exception:
                continue
        return {'error': 'timeout'}

    def close(self):
        if self.sock:
            try:
                self.sock.close()
            except Exception:
                pass

if __name__ == '__main__':
    client = CDPClient()
    val = client.evaluate("document.title")
    print("Page title via CDP:", val)
    client.close()
