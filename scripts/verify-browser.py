"""Verify a fresh static export with Python Playwright and Google Chrome on macOS."""

import argparse
import json
import re
import subprocess
import tempfile
import threading
import time
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

from playwright.sync_api import expect, sync_playwright


@contextmanager
def local_browser(playwright):
    with tempfile.TemporaryDirectory(prefix="portfolio-browser-") as profile:
        process = subprocess.Popen([
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "--headless=new", "--no-first-run", "--no-default-browser-check",
            "--remote-debugging-port=0", f"--user-data-dir={profile}",
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        try:
            port_file = Path(profile) / "DevToolsActivePort"
            deadline = time.monotonic() + 15
            while not port_file.exists():
                if process.poll() is not None or time.monotonic() > deadline:
                    raise RuntimeError("Chrome did not expose its debugging port")
                time.sleep(0.05)
            port = port_file.read_text().splitlines()[0]
            yield playwright.chromium.connect_over_cdp(f"http://127.0.0.1:{port}")
        finally:
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


class ExportHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        route = unquote(urlsplit(self.path).path)
        candidate = Path(self.directory) / route.lstrip("/")
        if route != "/" and not candidate.is_file():
            if Path(str(candidate) + ".html").is_file():
                self.path = route + ".html"
            elif not candidate.is_dir():
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write((Path(self.directory) / "404.html").read_bytes())
                return
        super().do_GET()

    def log_message(self, *_args):
        pass


def verify(args):
    evidence = Path(args.evidence).resolve()
    evidence.mkdir(parents=True, exist_ok=True)
    report_path = evidence / "report.json"
    report_path.write_text(json.dumps({"status": "running"}) + "\n")
    handler = partial(ExportHandler, directory=str(Path(args.output).resolve()))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base = f"http://127.0.0.1:{server.server_port}"
    checks = []
    errors = []
    routes = ["/", "/books", "/notes"]
    if args.note_slug:
        routes.append(f"/notes/{args.note_slug}")
    try:
        with sync_playwright() as playwright, local_browser(playwright) as browser:
            for width, height in [(1440, 1000), (1920, 1080), (768, 1024), (390, 844), (320, 740)]:
                context = browser.new_context(
                    viewport={"width": width, "height": height},
                    reduced_motion="reduce",
                    timezone_id="Europe/Amsterdam",
                    is_mobile=width < 600,
                    has_touch=width < 600,
                )
                page = context.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                for route in routes:
                    response = page.goto(base + route, wait_until="networkidle")
                    assert response.status == 200, (route, response.status)
                    expect(page.locator("main")).to_be_visible()
                    expect(page.locator("h1")).to_have_count(1)
                    if route == "/":
                        expect(page.locator("main")).to_contain_text(
                            "This is my little space on the internet. I build software for a living, read when I can, and keep notes before the thought disappears."
                        )
                    expect(page.locator('link[rel="canonical"]')).to_have_attribute(
                        "href", "https://sewhail.com" + (route if route != "/" else "")
                    )
                    current = "location" if route.startswith("/notes/") else "page"
                    expect(page.locator(f'.site-nav a[aria-current="{current}"]')).to_have_attribute(
                        "href", "/notes" if current == "location" else route
                    )
                    for control in page.locator(".site-nav a, .theme-toggle").all():
                        bounds = control.bounding_box()
                        assert bounds and bounds["height"] >= 44, f"Small navigation target on {route} at {width}px"
                    for theme in ["light", "dark"]:
                        page.evaluate("""theme => {
                          localStorage.setItem('theme-override', JSON.stringify({
                            theme, expiresAt: Date.now() + 3600000
                          }));
                        }""", theme)
                        page.reload(wait_until="networkidle")
                        expect(page.locator("html")).to_have_attribute("data-theme", theme)
                        expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
                            "content", "#f5ecd9" if theme == "light" else "#1a1a18"
                        )
                        assert page.evaluate(
                            "document.documentElement.scrollWidth <= window.innerWidth"
                        ), f"Horizontal overflow at {width}px on {route} in {theme} theme"
                        assert page.locator("img").evaluate_all(
                            "images => images.every(image => image.complete && image.naturalWidth > 0)"
                        ), f"Broken image on {route}"
                        label = route.strip("/").replace("/", "-") or "home"
                        page.screenshot(path=str(evidence / f"{width}-{label}-{theme}.png"), full_page=True)
                    if not args.baseline:
                        page.keyboard.press("Tab")
                        expect(page.get_by_role("link", name="Skip to content")).to_be_focused()
                        expect(page.get_by_role("link", name="Skip to content")).to_be_in_viewport()
                        page.keyboard.press("Enter")
                        expect(page.locator("main")).to_be_focused()
                    checks.append(f"{width}px {route}: layout, image, canonical, active navigation, both themes")

                page.goto(base, wait_until="networkidle")
                if not args.baseline:
                    page.keyboard.press("Tab")
                    expect(page.get_by_role("link", name="Skip to content")).to_be_focused()
                    page.keyboard.press("Enter")
                    expect(page.locator("main")).to_be_focused()
                    checks.append(f"{width}px: skip link moves keyboard focus to main")

                    page.locator("main").get_by_role("link", name=re.compile(r"^Books", re.I)).click()
                    expect(page).to_have_url(base + "/books")
                    expect(page.get_by_role("heading", name="books", exact=True)).to_be_visible()
                    page.goto(base, wait_until="networkidle")
                    note_preview = page.locator("main").get_by_role("link", name=re.compile(r"^Notes", re.I))
                    note_path = note_preview.get_attribute("href")
                    assert note_path == "/notes" or note_path.startswith("/notes/")
                    if args.note_slug:
                        assert note_path == f"/notes/{args.note_slug}"
                    note_preview.click()
                    expect(page).to_have_url(base + note_path)
                    expect(page.get_by_role("heading", name="nothing here.")).to_have_count(0)
                    checks.append(f"{width}px: homepage book and note previews open their real destinations")

                page.get_by_role("navigation", name="Primary navigation").get_by_role("link", name="books", exact=True).click()
                expect(page).to_have_url(base + "/books")
                expect(page.get_by_role("heading", name="books", exact=True)).to_be_visible()
                page.get_by_role("navigation", name="Primary navigation").get_by_role("link", name="notes", exact=True).click()
                expect(page).to_have_url(base + "/notes")
                expect(page.get_by_role("heading", name="notes", exact=True)).to_be_visible()

                before = page.locator("html").get_attribute("data-theme")
                expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
                    "content", "#f5ecd9" if before == "light" else "#1a1a18"
                )
                page.get_by_role("button", name="Switch to").click()
                after = "dark" if before == "light" else "light"
                expect(page.locator("html")).to_have_attribute("data-theme", after)
                expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
                    "content", "#f5ecd9" if after == "light" else "#1a1a18"
                )
                page.reload(wait_until="networkidle")
                expect(page.locator("html")).to_have_attribute("data-theme", after)
                checks.append(f"{width}px: client navigation and theme persistence after reload")

                response = page.goto(base + "/missing-page", wait_until="networkidle")
                assert response.status == 404
                expect(page.get_by_role("heading", name="nothing here.")).to_be_visible()
                page.get_by_role("link", name="go home").click()
                expect(page).to_have_url(base + "/")
                checks.append(f"{width}px: 404 recovery returns home")
                context.close()
                print(f"Verified {width}px", flush=True)
            if not args.baseline:
                context = browser.new_context(reduced_motion="no-preference")
                page = context.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.add_init_script("""(() => {
                  window.transitionCount = 0;
                  if (document.startViewTransition) {
                    const start = document.startViewTransition.bind(document);
                    document.startViewTransition = update => {
                      window.transitionCount += 1;
                      return start(update);
                    };
                  }
                })();""")
                page.goto(base, wait_until="networkidle")
                button = page.get_by_role("button", name="Switch to")
                before = page.locator("html").get_attribute("data-theme")
                button.focus()
                page.keyboard.press("Enter")
                expect(page.locator("html")).to_have_attribute(
                    "data-theme", "dark" if before == "light" else "light"
                )
                assert page.evaluate("window.transitionCount") == 0
                checks.append("Keyboard theme change is immediate without a view transition")
                button.click()
                expect(page.locator("html")).to_have_attribute("data-theme", before)
                assert page.evaluate("window.transitionCount") == 1
                page.wait_for_function("!document.documentElement.classList.contains('theme-transitioning')")
                expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
                    "content", "#f5ecd9" if before == "light" else "#1a1a18"
                )
                checks.append("Pointer theme transition completes and clears its animation state")
                context.close()
        assert not errors, f"Browser errors: {errors}"
        report = {"status": "passed", "checks": checks, "browser_errors": errors, "baseline": args.baseline}
        report_path.write_text(json.dumps(report, indent=2) + "\n")
        for check in checks:
            print("PASS", check)
        print(f"PASS {len(checks)} browser checks; no page errors. Evidence: {evidence}")
    except Exception as error:
        report_path.write_text(json.dumps({"status": "failed", "error": str(error), "checks": checks}, indent=2) + "\n")
        raise
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="out")
    parser.add_argument("--evidence", default=".audit/browser/after")
    parser.add_argument("--baseline", action="store_true")
    parser.add_argument("--note-slug")
    verify(parser.parse_args())
