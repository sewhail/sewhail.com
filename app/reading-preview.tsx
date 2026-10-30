import Image from "next/image";
import { SiteBookmark } from "./site-bookmark";

type ReadingBook = {
  title: string;
  author: string;
  cover?: string;
  coverSource?: string;
};

export function ReadingPreview({ book }: { book: ReadingBook }) {
  const cover = (
    <>
      <span className="book-stack-paper book-stack-paper-back" aria-hidden="true" />
      <span className="book-stack-paper book-stack-paper-front" aria-hidden="true" />
      <span className="book-stack-cover">
        {book.cover ? (
          <Image src={book.cover} alt="" width={264} height={400} />
        ) : (
          <span className="book-stack-fallback">{book.title}</span>
        )}
      </span>
    </>
  );

  return (
    <div className="reading-preview">
      <div className="reading-object">
        {book.coverSource ? (
          <a
            className="book-stack"
            href={book.coverSource}
            target="_blank"
            rel="noreferrer"
            aria-label={`About ${book.title} (publisher, opens in a new tab)`}
          >
            {cover}
          </a>
        ) : <span className="book-stack">{cover}</span>}
        <SiteBookmark />
      </div>
      <div className="reading-caption">
        <p className="preview-status">Currently reading</p>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
        {book.coverSource ? (
          <a className="publisher-link" href={book.coverSource} target="_blank" rel="noreferrer">
            Publisher <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
