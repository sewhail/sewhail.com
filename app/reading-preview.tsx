import Image from "next/image";

type ReadingBook = {
  title: string;
  author: string;
  cover?: string;
};

export function ReadingPreview({ book }: { book: ReadingBook }) {
  return (
    <div className="reading-preview">
      <div className="reading-object">
        <span className="book-stack">
          <span className="book-stack-paper book-stack-paper-back" aria-hidden="true" />
          <span className="book-stack-paper book-stack-paper-front" aria-hidden="true" />
          <span className="book-stack-cover">
            {book.cover ? (
              <Image src={book.cover} alt="" width={264} height={400} />
            ) : (
              <span className="book-stack-fallback">{book.title}</span>
            )}
          </span>
        </span>
      </div>
      <div className="reading-caption">
        <p className="preview-status">Currently reading</p>
        <h3>{book.title}</h3>
        <p className="book-author">{book.author}</p>
      </div>
    </div>
  );
}
