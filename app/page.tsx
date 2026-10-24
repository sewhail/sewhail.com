import Image from "next/image";
import Link from "next/link";
import books from "@/content/books.json";
import { notes } from "@/content/notes";
import { Portrait } from "./portrait";

export default function Page() {
  const currentBook = books.find((book) => book.status === "reading");
  const featuredNote = notes[0];

  return (
    <main id="main-content" tabIndex={-1} className="page home-page">
      <header className="home-heading">
        <div>
          <p className="eyebrow">A little space on the internet</p>
          <h1 className="name">
            suhail<span aria-hidden="true">.</span>
          </h1>
        </div>
        <div className="portrait-caption">
          <Portrait />
          <p>
            amsterdam,<br />the netherlands
          </p>
        </div>
      </header>

      <section className="introduction" aria-label="Introduction">
        <p className="section-label">About</p>
        <div className="intro-copy">
          <p>
            This is my little space on the internet. I build software for a
            living, read when I can, and keep notes before the thought
            disappears.
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

      <section className="home-index" aria-label="Explore books and notes">
        <p className="section-label">On this site</p>
        <div className="discovery-grid">
          <Link href="/books" className="discovery-link book-preview">
            <div className="discovery-heading">
              <h2>Books</h2>
              <span aria-hidden="true">↗</span>
            </div>
            {currentBook ? (
              <div className="preview-book">
                {currentBook.cover ? (
                  <Image
                    src={currentBook.cover}
                    alt={`Cover of ${currentBook.title}`}
                    width={264}
                    height={400}
                  />
                ) : null}
                <div>
                  <p className="eyebrow">Currently reading</p>
                  <h3>{currentBook.title}</h3>
                  <p className="book-author">{currentBook.author}</p>
                </div>
              </div>
            ) : (
              <p className="preview-description">Between books.</p>
            )}
          </Link>
          <Link
            href={featuredNote ? `/notes/${featuredNote.slug}` : "/notes"}
            className="discovery-link notes-preview"
          >
            <div className="discovery-heading">
              <h2>Notes</h2>
              <span aria-hidden="true">↗</span>
            </div>
            <p className="preview-description">
              {featuredNote ? featuredNote.title : "Things I would rather not forget."}
            </p>
            <p className="eyebrow note-status">
              {featuredNote ? featuredNote.publishedAt : "Nothing here yet."}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
