"""Verify the cozy room against a fresh static export: python3 scripts/verify-room.py."""
import threading
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright
from importlib.util import spec_from_file_location, module_from_spec

spec = spec_from_file_location("browser_harness", Path(__file__).with_name("verify-browser.py"))
harness = module_from_spec(spec)
spec.loader.exec_module(harness)


def payload(code=61, wind=24, day=1):
    return {"current": {"temperature_2m": 12.4, "weather_code": code,
                        "wind_speed_10m": wind, "is_day": day, "time": "2026-10-30T14:15"}}


def set_theme(page, theme):
    if page.locator("html").get_attribute("data-theme") != theme:
        page.locator(".theme-toggle").click()
    expect(page.locator("html")).to_have_attribute("data-theme", theme)
    expect(page.locator("body")).to_have_css("background-color", "rgb(245, 236, 217)" if theme == "light" else "rgb(26, 26, 24)")
    expect(page.locator('.site-nav a[aria-current]')).to_have_css("color", "rgb(36, 32, 25)" if theme == "light" else "rgb(232, 232, 228)")


def verify():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(harness.ExportHandler, directory=str(Path("out").resolve())))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    evidence = Path(".audit/cozy-room")
    evidence.mkdir(parents=True, exist_ok=True)
    errors = []
    try:
        with sync_playwright() as p, harness.local_browser(p) as browser:
            for width in [1440, 1200, 1024, 1000, 768, 390, 320]:
                context = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
                page = context.new_page()
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json=payload()))
                page.goto(f"http://127.0.0.1:{server.server_port}", wait_until="networkidle")
                expect(page.locator(".colophon")).to_have_count(0)
                room = page.locator(".cozy-room")
                expect(room).to_have_attribute("data-open", "false")
                assert room.evaluate("e => getComputedStyle(e).position") == ("absolute" if width > 900 else "relative")
                assert page.locator(".home-heading .cozy-room").count() == 0
                content_box = page.locator(".home-content").bounding_box()
                room_box = room.bounding_box()
                if width > 900:
                    content_right = content_box['x'] + content_box['width']
                    window_box = page.locator('.room-window').bounding_box()
                    desk_box = page.locator('.room-desk').bounding_box()
                    assert window_box['x'] >= content_right + 16, "Window overlaps the text"
                    assert desk_box['x'] >= content_right + 16, "Desk overlaps the text"
                    assert abs(window_box['x'] + window_box['width'] / 2 - desk_box['x'] - desk_box['width'] / 2) < 50, "Desk is not grounded beneath the window"
                else:
                    assert room_box["y"] >= content_box["y"] + content_box["height"] + 32, "Room interrupts the mobile text layout"
                main_box = page.locator('.home-page').bounding_box()
                nav_box = page.locator('.site-nav-shell').bounding_box()
                assert abs(main_box['x'] - nav_box['x']) < 1, "Navigation and page gutters are misaligned"
                assert abs(main_box['width'] - nav_box['width']) < 1, "Navigation and page widths differ"
                assert page.locator(".introduction").evaluate("e => getComputedStyle(e).marginTop") == "28px"
                for theme, ink in [("light", "rgb(26, 26, 24)"), ("dark", "rgb(245, 236, 217)")]:
                    set_theme(page, theme)
                    expect(room).to_have_css("color", ink)
                    expect(page.locator(".room-window-surround")).to_have_css("stroke", ink)
                    expect(page.locator(".room-lamp-shade")).to_have_css("stroke", ink)
                    page.screenshot(path=str(evidence / f"{width}-{theme}-closed.png"), full_page=True)
                paragraph = page.locator('.intro-copy > p')
                paragraph.click(click_count=3)
                assert 'I build software' in page.evaluate('window.getSelection().toString()'), 'Background blocks text selection'
                page.evaluate('window.getSelection().removeAllRanges()')
                window = page.locator(".room-window-button")
                window.hover()
                expect(window).to_have_attribute("aria-expanded", "false")
                window.focus()
                expect(window).to_have_attribute("aria-expanded", "false")
                assert page.locator(".room-steam").evaluate("e => e.getAnimations({subtree:true}).length") == 0
                for link in page.locator(".links a, .discovery-link, a.book-stack").all():
                    link.scroll_into_view_if_needed()
                    assert link.evaluate("""e => {
                        const r = e.getBoundingClientRect();
                        const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
                        return top === e || e.contains(top);
                    }"""), "Room art intercepts a content link"
                lamp = page.get_by_role("button", name="Reading lamp", exact=True)
                lamp.click()
                expect(lamp).to_have_attribute("aria-pressed", "true")
                expect(page.locator(".cozy-room")).to_have_attribute("data-lit", "true")
                page.wait_for_function("Number(getComputedStyle(document.querySelector('.room-lamplight')).opacity) > 0.1")
                assert page.locator(".reading-preview").evaluate("e => getComputedStyle(e, '::before').content") == "none"
                lamp.focus()
                page.keyboard.press("Space")
                expect(lamp).to_have_attribute("aria-pressed", "false")
                window = page.locator(".room-window-button")
                window.focus()
                page.keyboard.press("Enter")
                expect(window).to_have_attribute("aria-expanded", "true")
                expect(page.locator(".room-weather-caption")).to_contain_text("12° · Rainy · Windy")
                expect(page.locator(".room-rain")).to_have_count(1)
                expect(page.locator(".room-wind")).to_have_count(1)
                caption_box = page.locator('.room-caption').bounding_box()
                shade_box = page.locator('.room-lamp-shade').bounding_box()
                assert caption_box['y'] + caption_box['height'] + 4 <= shade_box['y'], "Weather caption collides with the lamp"
                if width <= 900:
                    caption_box = page.locator('.room-caption').bounding_box()
                    drawing_box = page.locator('.room-drawing').bounding_box()
                    desk_box = page.locator('.room-desk').bounding_box()
                    assert caption_box['y'] >= drawing_box['y'] + drawing_box['height'], "Weather overlaps the window"
                    assert caption_box['y'] + caption_box['height'] <= desk_box['y'], "Weather overlaps the lamp"
                    assert abs(room.bounding_box()['height'] - room_box['height']) < 1, "Opening weather shifts the room"
                for theme in ["light", "dark"]:
                    set_theme(page, theme)
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                    page.screenshot(path=str(evidence / f"{width}-{theme}.png"), full_page=True)
                window.click()
                expect(window).to_have_attribute("aria-expanded", "false")
                expect(page.locator(".room-weather-caption")).not_to_be_visible()
                context.close()

            context = browser.new_context(viewport={"width": 1100, "height": 900})
            page = context.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json=payload()))
            page.goto(f"http://127.0.0.1:{server.server_port}")
            expect(page.locator(".cozy-room")).to_have_attribute("data-open", "false")
            assert page.locator(".room-steam").evaluate("e => e.getAnimations({subtree:true}).some(a => a.playState === 'running')")
            window_control = page.locator('.room-window-button')
            window_control.click()
            page.wait_for_function("Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.room-curtain-left')).transform).a - 0.32) < 0.001")
            window_control.click()
            window_control.click()
            expect(page.locator('.cozy-room')).to_have_attribute('data-open', 'true')
            page.wait_for_function("Math.abs(new DOMMatrix(getComputedStyle(document.querySelector('.room-curtain-right')).transform).a - 0.32) < 0.001")
            window_control.click()
            page.wait_for_function("getComputedStyle(document.querySelector('.room-curtain-left')).transform === 'none'")
            page.unroute("https://api.open-meteo.com/**")
            for code, selector in [(0, ".room-sun"), (3, ".room-clouds"), (45, ".room-clouds"), (73, ".room-snow"), (95, ".room-rain")]:
                page.route("https://api.open-meteo.com/**", lambda route, request, code=code: route.fulfill(json=payload(code, 5)))
                page.goto(f"http://127.0.0.1:{server.server_port}")
                page.locator(".room-window-button").click()
                expect(page.locator(selector)).to_have_count(1)
                if code == 73:
                    page.screenshot(path=str(evidence / "snow-motion.png"), full_page=True)
                page.unroute("https://api.open-meteo.com/**")
            page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(status=503, body="unavailable"))
            page.reload()
            page.locator(".room-window-button").click()
            expect(page.locator(".room-weather-caption")).to_contain_text("Weather unavailable.")
            page.unroute("https://api.open-meteo.com/**")
            page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json=payload(0, 8, 0)))
            page.get_by_role("button", name="Try again").click()
            expect(page.locator(".room-weather-caption")).to_contain_text("Clear & dry")
            expect(page.locator(".room-moon")).to_have_count(1)
            page.unroute("https://api.open-meteo.com/**")
            page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json={"current": {"weather_code": 73}}))
            page.reload()
            page.locator(".room-window-button").click()
            expect(page.locator(".room-weather-caption")).to_contain_text("Weather unavailable.")
            expect(page.locator(".room-snow")).to_have_count(0)
            assert not errors, errors
            context.close()
        print("PASS: responsive room, lamp isolation, keyboard controls, weather states, night, failure/retry, no JS errors")
    finally:
        server.shutdown()


if __name__ == "__main__":
    verify()
