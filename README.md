# sewhail.com

My personal website.

**Stack:** Next.js · TypeScript · Tailwind CSS · shadcn/ui

The deployable app lives at the repository root. Run commands here. `app/`, `content/`, and `public/` contain the current site. The former nested `portfolio/` directory was an obsolete redesign copy; commit `6552599` copied it into the root for deployment.

Build and verify the static export with `bun run build`, `bun run lint`, and `node scripts/verify-canonicals.mjs`.

Run `python3 scripts/verify-browser.py` for browser checks and desktop and mobile screenshots. This script requires Google Chrome on macOS and the Python `playwright` package. It serves `out/` locally and writes screenshots and a JSON report to `.audit/browser/after/`.

Run `python3 scripts/compare-production.py` to compare the export's content, images, and link destinations with the live site. It saves the fetched HTML and comparison report in `.audit/production/` and decodes Cloudflare's email-protection links before comparison.
