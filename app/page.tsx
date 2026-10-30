import Link from "next/link";
import books from "@/content/books.json";
import { ReadingPreview } from "./reading-preview";
import { CozyRoom } from "./cozy-room";
import { Portrait } from "./portrait";

export default function Page() {
  const currentBook = books.find((book) => book.status === "reading");

  return (
    <main id="main-content" tabIndex={-1} className="page home-page">
      <CozyRoom />
      <div className="home-content">
        <header className="home-heading">
          <Portrait />
          <div>
            <h1 className="name">
              suhail<span aria-hidden="true">.</span>
            </h1>
            <p className="home-location">Amsterdam, the Netherlands</p>
          </div>
        </header>

        <section className="introduction" aria-label="Introduction">
          <div className="intro-copy">
            <p>
              I build software for a living and read when I can.
            </p>
            <nav className="links" aria-label="Contact links">
              <a href="https://github.com/sewhail" target="_blank" rel="noreferrer">
                github <span aria-hidden="true">↗</span>
              </a>
              <a href="https://linkedin.com/in/sewhail" target="_blank" rel="noreferrer">
                linkedin <span aria-hidden="true">↗</span>
              </a>
              <a href="mailto:hello@sewhail.com">
                email <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </section>

        <section className="home-index" aria-label="Explore books">
          <div className="discovery-list">
            <div className="book-preview">
              <Link href="/books" className="discovery-link">
                <div className="discovery-heading">
                  <h2>Books</h2>
                  <span aria-hidden="true">↗</span>
                </div>
              </Link>
              {currentBook ? (
                <ReadingPreview book={currentBook} />
              ) : (
                <p className="preview-description">Between books.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
