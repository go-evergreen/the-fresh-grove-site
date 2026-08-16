#!/usr/bin/env python3
"""Local preview with no-cache headers so refreshes actually pick up edits."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
import socket

ROOT = os.path.dirname(os.path.abspath(__file__))


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class DualStack(ThreadingHTTPServer):
    address_family = socket.AF_INET6

    def server_bind(self):
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


if __name__ == "__main__":
    os.chdir(ROOT)
    port = int(os.environ.get("PORT", "8765"))
    httpd = DualStack(("::", port), NoCache)
    print("Serving %s at http://127.0.0.1:%s and http://localhost:%s (no-cache)" % (ROOT, port, port))
    httpd.serve_forever()
