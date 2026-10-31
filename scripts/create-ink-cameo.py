"""Extract a transparent ink cameo from the existing scanned portrait."""
from math import hypot
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent.parent
source = Image.open(root / "public/avatar-ink-plate.jpg").convert("L")
width, height = source.size
cameo = Image.new("RGBA", source.size)
pixels = []
for y in range(height):
    for x in range(width):
        ink = max(0, min(1, (215 - source.getpixel((x, y))) / 190))
        distance = hypot((x - width * 0.51) / (width * 0.51), (y - height * 0.51) / (height * 0.56))
        edge = max(0, min(1, (1.04 - distance) / 0.16))
        shoulder = max(0, min(1, (height - y) / (height * 0.13)))
        pixels.append((26, 26, 24, round(255 * ink * edge * shoulder)))
cameo.putdata(pixels)
cameo.save(root / "public/avatar-ink-cameo.png", optimize=True)
print("Created public/avatar-ink-cameo.png")
