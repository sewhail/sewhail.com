"""Check the illustrated room's ambient motion and weather-driven animation states."""
import importlib.util
import threading
from functools import partial
from http.server import ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("room_checks", Path(__file__).with_name("verify-room.py"))
room_checks = importlib.util.module_from_spec(spec)
spec.loader.exec_module(room_checks)


def animations(locator):
    return locator.evaluate("""element => element.getAnimations({subtree: true}).map(animation => ({
        name: animation.animationName,
        state: animation.playState,
        duration: animation.effect.getTiming().duration,
        properties: [...new Set(animation.effect.getKeyframes().flatMap(frame =>
            Object.keys(frame).filter(key => !['offset', 'computedOffset', 'easing', 'composite'].includes(key))))]
    }))""")


def verify():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(room_checks.harness.ExportHandler, directory=str(Path("out").resolve())))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    evidence = Path(".audit/storybook-room")
    evidence.mkdir(parents=True, exist_ok=True)
    errors = []
    weather = room_checks.payload(61, 24)
    try:
        with sync_playwright() as p, room_checks.harness.local_browser(p) as browser:
            for width in [1440, 768, 390, 320]:
                context = browser.new_context(viewport={"width": width, "height": 900}, is_mobile=width < 600, has_touch=width < 600)
                page = context.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json=weather))
                page.goto(base, wait_until="networkidle")
                room = page.locator(".cozy-room")
                expect(room).to_have_attribute("data-open", "false")
                expect(page.locator(".room-hint, .room-window-hint, .site-bookmark, .publisher-link")).to_have_count(0)
                expect(page.locator(".reading-preview a, .reading-preview button")).to_have_count(0)
                for selector in [".room-leaves", ".room-cat-body", ".room-steam"]:
                    items = animations(page.locator(selector))
                    assert items and any(item["state"] == "running" for item in items), (selector, items)
                    before = page.locator(selector).evaluate("e => getComputedStyle(e).transform")
                    page.wait_for_function("({selector, before}) => getComputedStyle(document.querySelector(selector)).transform !== before", arg={"selector": selector, "before": before})
                for theme in ["light", "dark"]:
                    room_checks.set_theme(page, theme)
                    page.screenshot(path=str(evidence / f"{width}-{theme}-closed.png"), full_page=True)
                window = page.locator(".room-window-button")
                if width < 600:
                    window.tap()
                else:
                    window.click()
                expect(room).to_have_attribute("data-weather", "rain")
                expect(room).to_have_attribute("data-wind", "windy")
                for control in [window, page.locator(".room-lamp-button")]:
                    box = control.bounding_box()
                    assert box["width"] >= 44 and box["height"] >= 44, box
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
                exterior = animations(page.locator(".room-weather-art"))
                assert exterior and any(item["state"] == "running" for item in exterior)
                for item in animations(room):
                    assert set(item["properties"]).issubset({"transform", "opacity"}), item
                page.screenshot(path=str(evidence / f"{width}-rain-open.png"), full_page=True)
                window.click()
                expect(room).to_have_attribute("data-open", "false")
                assert all(item["state"] == "paused" for item in animations(page.locator(".room-weather-art")))
                assert any(item["state"] == "running" for item in animations(page.locator(".room-leaves")))
                page.emulate_media(reduced_motion="reduce")
                page.wait_for_function("document.querySelector('.cozy-room').getAnimations({subtree:true}).length === 0")
                context.close()

            context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.route("https://api.open-meteo.com/**", lambda route: route.fulfill(json=weather))
            for code, wind, kind, wind_mode in [(0, 3, "clear", "calm"), (3, 12, "cloudy", "breezy"), (61, 5, "rain", "calm"), (61, 35, "rain", "windy"), (73, 12, "snow", "breezy"), (45, 4, "fog", "calm")]:
                weather = room_checks.payload(code, wind)
                page.goto(base, wait_until="networkidle")
                page.locator(".room-window-button").click()
                expect(page.locator(".cozy-room")).to_have_attribute("data-weather", kind)
                expect(page.locator(".cozy-room")).to_have_attribute("data-wind", wind_mode)
                items = animations(page.locator(".room-weather-art"))
                assert items, (kind, wind_mode)
                if code == 61 and wind == 5:
                    calm_rain = animations(page.locator(".room-rain"))
                if code == 61 and wind == 35:
                    windy_rain = animations(page.locator(".room-rain"))
                    assert [item["duration"] for item in calm_rain] != [item["duration"] for item in windy_rain]
                page.locator(".room-stage").screenshot(path=str(evidence / f"weather-{kind}-{wind_mode}.png"))
            context.close()
            assert not errors, errors
        print("PASS: storybook composition, ambient room motion, condition-specific weather, wind response, touch targets, reduced motion, no JS errors")
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    verify()
