import { Portrait } from "./portrait";

export default function Page() {
  return (
    <main className="page home-page">
      <header className="header">
        <div className="bio-row">
          <Portrait />

          <div className="identity">
            <div className="identity-tools">
              <h1 className="name">
                suhail<span aria-hidden="true">.</span>
              </h1>
            </div>

            <div className="bio-text">
              <p className="muted">amsterdam, the netherlands</p>
            </div>
          </div>
        </div>
      </header>

      <section className="section" aria-label="Introduction">
        <div className="intro-copy">
          <p>
            This is my little space on the internet. I build software for a
            living, try new technologies, read when I can, and keep notes I may
            finish someday.
          </p>
        </div>

        <footer className="footer">
          <nav className="links" aria-label="Contact links">
            <a
              href="https://github.com/sewhail"
              target="_blank"
              rel="noreferrer"
            >
              github
            </a>
            <a
              href="https://linkedin.com/in/sewhail"
              target="_blank"
              rel="noreferrer"
            >
              linkedin
            </a>
            <a href="mailto:hello@sewhail.com">email</a>
          </nav>
        </footer>
      </section>
    </main>
  );
}
