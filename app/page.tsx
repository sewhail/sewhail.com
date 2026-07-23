import { Portrait } from "./portrait";
import currentRead from "@/content/current-read.json";

export default function Page() {
  return (
    <main className="page">
      <header className="header">
        <h1 className="name">suhail</h1>

        <div className="bio-row">
          <Portrait />

          <div className="bio-text">
            <p>software engineer</p>
            <p className="muted">amsterdam, the netherlands</p>
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="intro">
        <h2 className="tagline" id="intro">
          I build software for hard problems.
        </h2>

        <p>
          Lately, I&apos;ve been learning how AI and ML systems work, and trying
          to build things that are genuinely useful.
        </p>

        <aside className="current-read" aria-labelledby="current-read-label">
          <svg
            className="current-read-mark"
            viewBox="0 0 24 32"
            aria-hidden="true"
          >
            <path d="M5 3.5 18.5 3 19 27.5 12.2 23.5 5.5 28Z" />
            <path d="m8.5 8 7-.3M8.5 11.5l5.5-.2" />
          </svg>

          <div>
            <p className="current-read-label" id="current-read-label">
              currently reading
            </p>
            <p className="current-read-book">
              <cite>{currentRead.title}</cite>
              <span>{currentRead.author}</span>
            </p>
          </div>
        </aside>

        <p className="links" aria-label="Contact links">
          <a
            href="https://github.com/sewhail"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <span aria-hidden="true">, </span>
          <a
            href="https://linkedin.com/in/sewhail"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <span aria-hidden="true">, </span>
          <a href="mailto:sxhail@outlook.in">Email</a>
        </p>
      </section>
    </main>
  );
}
