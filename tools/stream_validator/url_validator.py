"""
URL and Network Validator Module for T2L Autonomous Stream Validator.
Performs rigorous HTTP/TLS/Range/Content-Type checks and eliminates false HTTP 200 passes.
"""

import socket
import time
import urllib.parse
from dataclasses import dataclass
from typing import Optional, Dict, Any
import requests

USER_AGENT = 'Mozilla/5.0 (Linux; Android 14; Nothing Phone 3 Build/UKQ1.230924.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 T2L/1.0'


@dataclass
class UrlCheckResult:
    url: str
    is_valid: bool
    status_code: int = 0
    content_type: str = ''
    content_length: Optional[int] = None
    accept_ranges: bool = False
    redirect_chain: str = ''
    final_url: str = ''
    latency_ms: float = 0.0
    failure_reason: Optional[str] = None
    initial_bytes: bytes = b''


class UrlValidator:
    """Validates media URLs with bounded Range requests and strict content-type verification."""

    def __init__(self, timeout_sec: float = 15.0):
        self.timeout_sec = timeout_sec
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': USER_AGENT,
            'Accept': '*/*',
        })

    def validate_url(self, url: str) -> UrlCheckResult:
        start_time = time.time()
        parsed = urllib.parse.urlparse(url)

        if not parsed.scheme or not parsed.netloc:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                failure_reason='INVALID_URL_FORMAT'
            )

        # 1. DNS pre-flight verification
        hostname = parsed.hostname
        port = parsed.port or (443 if parsed.scheme == 'https' else 80)
        try:
            socket.getaddrinfo(hostname, port, socket.AF_UNSPEC, socket.SOCK_STREAM)
        except socket.gaierror as e:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason=f'DNS_RESOLUTION_FAILED ({e})'
            )
        except Exception as e:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason=f'SOCKET_ERROR ({e})'
            )

        # 2. Bounded HTTP Range Request (bytes=0-8191)
        # We test Range GET directly to verify seekability, status, and payload signatures
        headers = {'Range': 'bytes=0-8191'}
        try:
            resp = None
            for attempt in range(2):
                try:
                    resp = self.session.get(
                        url,
                        headers=headers,
                        timeout=self.timeout_sec,
                        allow_redirects=True,
                        stream=True
                    )
                    if resp.status_code >= 500 and attempt == 0:
                        resp.close()
                        time.sleep(1.5)
                        continue
                    break
                except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
                    if attempt == 0:
                        time.sleep(1.5)
                        continue
                    raise

            if not resp:
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=0,
                    latency_ms=(time.time() - start_time) * 1000,
                    failure_reason='NO_RESPONSE'
                )

            elapsed_ms = (time.time() - start_time) * 1000
            status_code = resp.status_code
            content_type = resp.headers.get('Content-Type', '').lower()
            accept_ranges = 'bytes' in resp.headers.get('Accept-Ranges', '').lower() or status_code == 206
            final_url = str(resp.url)

            # Read bounded chunk (up to 8KB)
            sample_bytes = b''
            try:
                for chunk in resp.iter_content(chunk_size=4096):
                    sample_bytes += chunk
                    if len(sample_bytes) >= 8192:
                        break
            except Exception:
                pass
            finally:
                resp.close()

            content_length = None
            if 'Content-Length' in resp.headers:
                try:
                    content_length = int(resp.headers['Content-Length'])
                except ValueError:
                    pass

            # Check for HTTP errors
            if status_code in (404, 410):
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=status_code,
                    final_url=final_url,
                    latency_ms=elapsed_ms,
                    failure_reason='MEDIA_NOT_FOUND_404'
                )
            if status_code in (401, 403):
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=status_code,
                    final_url=final_url,
                    latency_ms=elapsed_ms,
                    failure_reason='ACCESS_FORBIDDEN_403'
                )
            if status_code >= 500:
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=status_code,
                    final_url=final_url,
                    latency_ms=elapsed_ms,
                    failure_reason=f'SERVER_ERROR_{status_code}'
                )

            # Strict guard against fake 200s (HTML pages, empty bodies, error JSONs)
            sample_str = sample_bytes[:512].decode('utf-8', errors='ignore').strip()

            if 'text/html' in content_type or sample_str.lower().startswith(('<!doctype html', '<html', '<head', '<body')):
                # Unless it is an HLS playlist that happened to be served with wrong type (extremely rare)
                if not sample_str.startswith('#EXTM3U'):
                    return UrlCheckResult(
                        url=url,
                        is_valid=False,
                        status_code=status_code,
                        content_type=content_type,
                        final_url=final_url,
                        latency_ms=elapsed_ms,
                        failure_reason='HTML_INSTEAD_OF_MEDIA'
                    )

            if len(sample_bytes) == 0 and status_code not in (204, 206):
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=status_code,
                    content_type=content_type,
                    final_url=final_url,
                    latency_ms=elapsed_ms,
                    failure_reason='EMPTY_RESPONSE'
                )

            if 'application/json' in content_type and ('"error":' in sample_str or '"message":' in sample_str):
                return UrlCheckResult(
                    url=url,
                    is_valid=False,
                    status_code=status_code,
                    content_type=content_type,
                    final_url=final_url,
                    latency_ms=elapsed_ms,
                    failure_reason='JSON_ERROR_PAYLOAD'
                )

            return UrlCheckResult(
                url=url,
                is_valid=True,
                status_code=status_code,
                content_type=content_type,
                content_length=content_length,
                accept_ranges=accept_ranges,
                final_url=final_url,
                latency_ms=elapsed_ms,
                initial_bytes=sample_bytes
            )

        except requests.exceptions.Timeout:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason='TIMEOUT'
            )
        except requests.exceptions.SSLError as e:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason=f'TLS_SSL_ERROR ({e})'
            )
        except requests.exceptions.ConnectionError as e:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason=f'CONNECTION_ERROR ({e})'
            )
        except Exception as e:
            return UrlCheckResult(
                url=url,
                is_valid=False,
                latency_ms=(time.time() - start_time) * 1000,
                failure_reason=f'REQUEST_FAILED ({e})'
            )
