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
            while True:
                port_lines = port_file.read_text().splitlines() if port_file.exists() else []
                if port_lines:
                    port = port_lines[0]
                    break
                if process.poll() is not None or time.monotonic() > deadline:
                    raise RuntimeError("Chrome did not expose its debugging port")
                time.sleep(0.05)
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


def wait_for_settled_motion(page):
    page.wait_for_function("document.getAnimations().every(animation => animation.effect.getTiming().iterations === Infinity)")


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
                            "I build software for a living and read when I can."
                        )
                        expect(page.locator("main")).not_to_contain_text(
                            re.compile(r"a little space on the internet", re.I)
                        )
                        for selector in ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']:
                            expect(page.locator(selector)).to_have_attribute(
                                "content", "Suhail, a software builder in Amsterdam. Software and books."
                            )
                        identity = page.locator(".name")
                        assert identity.evaluate("element => parseFloat(getComputedStyle(element).fontSize)") <= 44
                        portrait = page.locator(".portrait-control").bounding_box()
                        assert portrait and portrait["width"] <= 56 and portrait["height"] <= 64
                        expect(page.locator('.portrait-control')).to_have_css('background-color', 'rgba(0, 0, 0, 0)')
                        expect(page.locator('.avatar')).to_have_attribute('src', re.compile('avatar-ink-cameo'))
                        cover_bounds = page.locator('.book-stack').bounding_box()
                        assert cover_bounds and cover_bounds["width"] <= 56
                        assert page.locator('.reading-caption h3').evaluate("element => parseFloat(getComputedStyle(element).fontSize)") <= 16
                    for shell in page.locator(".site-nav-shell, main.page:not(.home-page), .home-content").all():
                        bounds = shell.bounding_box()
                        assert bounds and bounds["width"] <= 608.5, f"Wide reading column on {route} at {width}px"
                        assert bounds["x"] >= 23.5, f"Narrow page gutter on {route} at {width}px"
                    expect(page.locator('link[rel="canonical"]')).to_have_attribute(
                        "href", "https://sewhail.com" + (route if route != "/" else "")
                    )
                    expect(page.locator('.site-nav a[href="/notes"]')).to_have_count(0)
                    if route.startswith("/notes"):
                        expect(page.locator('.site-nav a[aria-current]')).to_have_count(0)
                    else:
                        expect(page.locator('.site-nav a[aria-current="page"]')).to_have_attribute("href", route)
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
                    expect(page.locator('main a[href^="/notes"]')).to_have_count(0)
                    lamp = page.get_by_role("button", name="Reading lamp", exact=True)
                    expect(lamp).to_have_attribute("aria-pressed", "false")
                    lamp.click()
                    expect(lamp).to_have_attribute("aria-pressed", "true")
                    expect(page.locator('.cozy-room')).to_have_attribute('data-lit', 'true')
                    assert page.locator('.reading-preview').evaluate("e => getComputedStyle(e, '::before').content") == 'none'
                    page.wait_for_function("Number(getComputedStyle(document.querySelector('.room-lamplight')).opacity) > 0.1")
                    lamp.click()
                    expect(lamp).to_have_attribute("aria-pressed", "false")
                    expect(page.locator('.cozy-room')).to_have_attribute('data-lit', 'false')
                    cover = page.locator('.book-stack')
                    expect(cover).to_be_visible()
                    expect(page.locator('.reading-preview a, .reading-preview button')).to_have_count(0)
                    expect(page.locator('.reading-preview')).not_to_contain_text('Publisher')
                    lamp.focus()
                    page.keyboard.press("Space")
                    expect(lamp).to_have_attribute("aria-pressed", "true")
                    cover.hover()
                    assert page.locator('.book-stack-cover').evaluate("element => getComputedStyle(element).transform") == "none"
                    assert page.locator('.theme-icon-sun').evaluate("element => getComputedStyle(element).transform") == "none"
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                    checks.append(f"{width}px: Notes hidden; bookmark and publisher info removed; lamp works with pointer and keyboard")
                    page.reload(wait_until='networkidle')
                    page.route('https://api.open-meteo.com/**', lambda route: route.fulfill(json={'current': {
                        'temperature_2m': 12, 'wind_speed_10m': 24, 'weather_code': 61,
                        'is_day': 1, 'time': '2026-10-30T14:15'
                    }}))
                    window = page.locator('.room-window-button')
                    expect(page.locator('.colophon')).to_have_count(0)
                    expect(window).to_be_visible()
                    expect(window).to_have_attribute('aria-expanded', 'false')
                    window.focus()
                    page.keyboard.press('Space')
                    expect(window).to_have_attribute('aria-expanded', 'true')
                    expect(page.locator('.room-weather-caption')).to_contain_text('Rainy · Windy')
                    window.click()
                    expect(window).to_have_attribute('aria-expanded', 'false')
                    page.get_by_role('button', name='Reading lamp', exact=True).click()
                    expect(page.locator('.cozy-room')).to_have_attribute('data-lit', 'true')
                    for theme in ['light', 'dark']:
                        page.evaluate("theme => document.documentElement.dataset.theme = theme", theme)
                        wait_for_settled_motion(page)
                        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
                        assert page.evaluate("""() => {
                          const rgb = color => color.match(/[\\d.]+/g).slice(0, 3).map(Number);
                          const luminance = color => color.map(v => v / 255)
                            .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
                            .reduce((total, value, i) => total + value * [0.2126, 0.7152, 0.0722][i], 0);
                          const background = rgb(getComputedStyle(document.body).backgroundColor);
                          const foreground = rgb(getComputedStyle(document.querySelector('.home-location')).color);
                          const a = luminance(background), b = luminance(foreground);
                          return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5;
                        }"""), f'Desk mode reduced text contrast at {width}px in {theme} theme'
                        page.screenshot(path=str(evidence / f'{width}-cozy-room-{theme}.png'), full_page=True)
                    checks.append(f'{width}px: weather window works by keyboard; local lamp stays readable in both themes')

                page.get_by_role("navigation", name="Primary navigation").get_by_role("link", name="books", exact=True).click()
                expect(page).to_have_url(base + "/books")
                expect(page.get_by_role("heading", name="books", exact=True)).to_be_visible()

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
                for theme in ["light", "dark"]:
                    page.evaluate("""theme => {
                      localStorage.setItem('theme-override', JSON.stringify({
                        theme, expiresAt: Date.now() + 3600000
                      }));
                    }""", theme)
                    page.reload(wait_until="networkidle")
                    assert page.evaluate(
                        "document.documentElement.scrollWidth <= window.innerWidth"
                    ), f"Horizontal overflow at {width}px on 404 in {theme} theme"
                    page.screenshot(path=str(evidence / f"{width}-404-{theme}.png"), full_page=True)
                page.get_by_role("link", name="go home").click()
                expect(page).to_have_url(base + "/")
                checks.append(f"{width}px: 404 layout in both themes and recovery returns home")
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
                assert page.evaluate("window.transitionCount") == 0
                for _ in range(3):
                    button.click(delay=20)
                expected = "dark" if before == "light" else "light"
                expect(page.locator("html")).to_have_attribute("data-theme", expected)
                assert page.evaluate("JSON.parse(localStorage.getItem('theme-override')).theme") == expected
                wait_for_settled_motion(page)
                assert not page.locator('html').evaluate("element => element.classList.contains('theme-transitioning')")
                expect(page.locator('meta[name="theme-color"]')).to_have_attribute(
                    "content", "#f5ecd9" if expected == "light" else "#1a1a18"
                )
                lamp = page.get_by_role('button', name='Reading lamp', exact=True)
                lamp.focus()
                page.keyboard.down('Space')
                assert lamp.evaluate("element => getComputedStyle(element).transform") == 'none'
                page.keyboard.up('Space')
                checks.append("Rapid theme toggles settle with matching storage and no remaining animations; keyboard lamp press stays still")
                arrow = page.locator('.discovery-heading > span')
                for reduced in [False, True]:
                    page.emulate_media(reduced_motion="reduce" if reduced else "no-preference")
                    page.locator('.book-preview .discovery-link').hover()
                    wait_for_settled_motion(page)
                    assert arrow.evaluate("element => getComputedStyle(element).transform") == (
                        "none" if reduced else "matrix(1, 0, 0, 1, 2, -2)"
                    )
                    for contact in page.locator('.links a').all():
                        contact.hover()
                        wait_for_settled_motion(page)
                        assert contact.locator('span').evaluate("element => getComputedStyle(element).transform") == (
                            'none' if reduced else 'matrix(1, 0, 0, 1, 2, -2)'
                        )
                    before = lamp.get_attribute('aria-pressed')
                    lamp.click(); lamp.click(); lamp.click()
                    expect(lamp).to_have_attribute('aria-pressed', 'false' if before == 'true' else 'true')
                    wait_for_settled_motion(page)
                    assert page.locator('.room-lamp-cord').evaluate("element => getComputedStyle(element).transform") == 'none'
                checks.append("Books/contact arrows and lamp respect reduced motion; repeated lamp toggles settle")
                context.close()
                for reduced in [False, True]:
                    context = browser.new_context(reduced_motion='reduce' if reduced else 'no-preference')
                    page = context.new_page()
                    page.on('pageerror', lambda error: errors.append(str(error)))
                    page.add_init_script("""(() => {
                      window.portraitAnimations = [];
                      const animate = Element.prototype.animate;
                      Element.prototype.animate = function(frames, options) {
                        if (this.matches('.avatar')) window.portraitAnimations.push({frames, options});
                        return animate.call(this, frames, options);
                      };
                    })();""")
                    page.goto(base, wait_until='networkidle')
                    page.wait_for_function('window.portraitAnimations.length === 1')
                    reveal = page.evaluate('window.portraitAnimations[0]')
                    assert reveal['options']['duration'] == (160 if reduced else 260)
                    assert reveal['frames']['opacity'] == [0, 1]
                    assert ('transform' in reveal['frames']) == (not reduced)
                    wait_for_settled_motion(page)
                    expect(page.locator('.avatar')).to_have_css('opacity', '1')
                    page.get_by_role('navigation', name='Primary navigation').get_by_role('link', name='books', exact=True).click()
                    expect(page).to_have_url(base + '/books')
                    page.get_by_role('navigation', name='Primary navigation').get_by_role('link', name='home', exact=True).click()
                    expect(page).to_have_url(base + '/')
                    expect(page.locator('.avatar')).to_be_visible()
                    assert page.evaluate('window.portraitAnimations.length') == 1
                    page.reload(wait_until='networkidle')
                    assert page.evaluate('window.portraitAnimations.length') == 0
                    expect(page.locator('.avatar')).to_have_css('opacity', '1')
                    context.close()
                context = browser.new_context(java_script_enabled=False)
                page = context.new_page()
                page.goto(base, wait_until='networkidle')
                expect(page.locator('.avatar')).to_be_visible()
                expect(page.locator('.avatar')).to_have_css('opacity', '1')
                assert page.locator('.avatar').evaluate('image => image.complete && image.naturalWidth > 0')
                context.close()
                checks.append('Portrait reveals once per tab in both motion preferences, stays visible on return/reload, and works without JavaScript')
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
