import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve(process.argv[2] ?? "out");
const pages = ["index.html", "books.html", "notes.html"];

for (const entry of await readdir(resolve(output, "notes"))) {
  if (entry.endsWith(".html")) pages.push(`notes/${entry}`);
}

let checked = 0;
for (const page of pages) {
  const html = await readFile(resolve(output, page), "utf8");
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;

  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, `${page} must have exactly one canonical URL`);

  const pathname = page === "index.html" ? "/" : `/${page.slice(0, -5)}`;
  const actual = new URL(canonicals[0][1]);
  const expected = new URL(pathname, "https://sewhail.com");
  assert.equal(actual.href, expected.href, `${page} must identify its own URL`);
  console.log(`PASS ${pathname} canonical ${actual.href}`);
  checked += 1;
}

console.log(`Verified ${checked} exported pages.`);
