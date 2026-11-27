# -*- coding: utf-8 -*-
"""Servidor local de validação com gzip e cache longo (produção-like).

Uso: python tests/serve_prod.py [porta]
Padrão: 8766. Somente para auditoria local; não substitui um servidor real.

Diferenças em relação a ``python -m http.server``:
  - comprime texto (HTML/CSS/JS/JSON/SVG) com gzip;
  - usa Cache-Control imutável paraassets versionados;
  - mantém index.html e sw.js sem cache para refletir edições.
"""

import gzip
import mimetypes
import os
import posixpath
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPRESSIBLE = (
    "text/", "application/javascript", "application/json",
    "application/manifest+json", "image/svg+xml",
)


class ProdHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not os.path.isfile(path):
            self.send_error(404, "File not found")
            return None

        ctype, _ = mimetypes.guess_type(path)
        ctype = ctype or "application/octet-stream"
        with open(path, "rb") as fh:
            body = fh.read()

        name = posixpath.basename(unquote(self.path)) or "index.html"
        no_cache = name in ("index.html", "sw.js", "manifest.json", "manifest.webmanifest")
        cache = "no-cache" if no_cache else "public, max-age=31536000, immutable"

        if any(ctype.startswith(prefix) for prefix in COMPRESSIBLE) and \
                "gzip" in self.headers.get("Accept-Encoding", ""):
            body = gzip.compress(body, compresslevel=9)
            encoding = "gzip"
        else:
            encoding = None

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        if encoding:
            self.send_header("Content-Encoding", encoding)
            self.send_header("Vary", "Accept-Encoding")
        self.end_headers()
        return self.__Body(body)

    class __Body:
        def __init__(self, data):
            self.data = data
            self.offset = 0

        def read(self, amount=-1):
            if amount is None or amount < 0:
                chunk = self.data[self.offset:]
                self.offset = len(self.data)
                return chunk
            chunk = self.data[self.offset:self.offset + amount]
            self.offset += len(chunk)
            return chunk

        def close(self):
            pass


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8766
    handler = partial(ProdHandler, directory=ROOT)
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as server:
        print(f"Servidor de validação em http://127.0.0.1:{port}/index.html")
        server.serve_forever()


if __name__ == "__main__":
    main()
