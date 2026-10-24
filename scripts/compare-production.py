"""Compare live page content with a local static export without changing production."""

import argparse
import json
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen


class MainContent(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_main = False
        self.ignored = 0
        self.text = []
        self.images = []
        self.links = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "main":
            self.in_main = True
        if self.in_main and tag in {"script", "style"}:
            self.ignored += 1
        if self.in_main and tag == "img":
            self.images.append({"src": attrs.get("src"), "alt": attrs.get("alt")})
        if self.in_main and tag == "a":
            href = attrs.get("href")
            prefix = "/cdn-cgi/l/email-protection#"
            if href and href.startswith(prefix):
                encoded = bytes.fromhex(href[len(prefix):])
                href = "mailto:" + bytes(value ^ encoded[0] for value in encoded[1:]).decode("utf-8")
            self.links.append(href)

    def handle_endtag(self, tag):
        if self.in_main and tag in {"script", "style"}:
            self.ignored -= 1
        if tag == "main":
            self.in_main = False

    def handle_data(self, data):
        if self.in_main and not self.ignored and data.strip():
            self.text.append(" ".join(data.split()))

    def result(self):
        return {"text": self.text, "images": self.images, "links": self.links}


def content(html):
    parser = MainContent()
    parser.feed(html)
    result = parser.result()
    if not result["text"]:
        raise ValueError("No main content found; comparison is inconclusive")
    return result


def compare(args):
    evidence = Path(args.evidence)
    evidence.mkdir(parents=True, exist_ok=True)
    pages = []
    for route, filename in [("/", "index.html"), ("/books", "books.html"), ("/notes", "notes.html")]:
        request = Request(args.site.rstrip("/") + route, headers={
            "User-Agent": "PortfolioContentVerification/1.0",
            "Cache-Control": "no-cache",
        })
        with urlopen(request, timeout=30) as response:
            html = response.read().decode("utf-8")
            status = response.status
            final_url = response.url
        (evidence / filename).write_text(html)
        live = content(html)
        local = content((Path(args.output) / filename).read_text())
        matches = status == 200 and live == local
        pages.append({"route": route, "status": status, "url": final_url,
                      "matches": matches, "production": live, "local": local})
        print(f"{'PASS' if matches else 'MISMATCH'} {route}: production content, images and links", flush=True)
    revision = subprocess.check_output(["git", "rev-parse", "origin/main"], text=True).strip()
    report = {"origin_main": revision, "pages": pages,
              "normalization": "Cloudflare email-protection URLs are decoded to their mailto destination.",
              "matches": all(page["matches"] for page in pages)}
    (evidence / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    if not report["matches"]:
        raise SystemExit("Production content differs. Inspect the saved report before consolidating.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="https://sewhail.com")
    parser.add_argument("--output", default="out")
    parser.add_argument("--evidence", default=".audit/production")
    compare(parser.parse_args())
