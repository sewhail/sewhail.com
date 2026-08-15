import type { Metadata } from "next";
import Image from "next/image";
import booksData from "@/content/books.json";

type Book = {
  title: string;
  author: string;
  status: "reading" | "read";
  cover?: string;
};

const books = booksData as Book[];
const reading = books.filter((book) => book.status === "reading");
const read = books.filter((book) => book.status === "read");

export const metadata: Metadata = {
  title: "books — suhail.",
  description: "Books I am reading and books I have read.",
};

export default function BooksPage() {
  return (
    <main className="page subpage">
      <header className="subpage-header">
        <h1>books<span aria-hidden="true">.</span></h1>
        <p>books I’m reading and books I’ve finished.</p>
      </header>

      <section className="books-section" aria-labelledby="currently-reading">
        <h2 id="currently-reading">currently reading</h2>
        {reading.length === 0 ? (
          <p className="empty-copy">between books.</p>
        ) : (
          <div className="book-list">
            {reading.map((book) => (
              <article className="book-entry" key={book.title}>
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Cover of ${book.title}`}
                    width={264}
                    height={400}
                    priority
                  />
                ) : null}
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="books-section read-books" aria-labelledby="read">
        <h2 id="read">finished</h2>
        {read.length === 0 ? (
          <p className="empty-copy">none listed yet.</p>
        ) : (
          <div className="book-list">
            {read.map((book) => (
              <article className="book-entry" key={book.title}>
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
