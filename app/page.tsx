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

      <section className="home-index" aria-label="Explore books and notes">
        <div className="discovery-list">
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
                  <p className="preview-status">Currently reading</p>
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
            <p className="preview-status note-status">
              {featuredNote ? featuredNote.publishedAt : "No notes published yet."}
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
