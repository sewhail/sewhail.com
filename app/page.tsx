import Image from "next/image";
import { Portrait } from "./portrait";
import { ThemeToggle } from "./theme-toggle";
import currentRead from "@/content/current-read.json";

export default function Page() {
  return (
    <main className="page">
      <header className="header">
        <div className="bio-row">
          <Portrait />

          <div className="identity">
            <div className="identity-tools">
              <h1 className="name">
                suhail<span aria-hidden="true">.</span>
              </h1>

              <ThemeToggle />
            </div>

            <div className="bio-text">
              <p>software engineer</p>
              <p className="muted">amsterdam, the netherlands</p>
            </div>
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="intro">
        <div className="intro-copy">
          <h2 className="tagline" id="intro">
            I build software for hard problems.
          </h2>

          <p>
            Lately, I&apos;ve been learning how AI and ML systems work, and
            trying to build things that are genuinely useful.
          </p>
        </div>

        <aside className="current-read" aria-labelledby="current-read-label">
          <span className="current-read-cover-frame" aria-hidden="true">
            <Image
              className="current-read-cover"
              src={currentRead.cover}
              alt=""
              width={264}
              height={400}
              priority
            />
          </span>

          <div className="current-read-copy">
            <p className="current-read-label" id="current-read-label">
              currently reading
            </p>
            <p className="current-read-book">
              <cite>{currentRead.title}</cite>
              <span>{currentRead.author}</span>
            </p>
          </div>

          <span className="current-read-corner" aria-hidden="true" />
        </aside>

        <footer className="footer">
          <p className="footer-label">elsewhere</p>
          <nav className="links" aria-label="Contact links">
            <a
              href="https://github.com/sewhail"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/sewhail"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="mailto:hello@sewhail.com">Email</a>
          </nav>
        </footer>
      </section>
    </main>
  );
}
