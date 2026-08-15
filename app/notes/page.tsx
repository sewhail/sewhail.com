import type { Metadata } from "next";
import { notes } from "@/content/notes";

export const metadata: Metadata = {
  title: "notes — suhail.",
  description: "Notes and things worth remembering.",
};

export default function NotesPage() {
  return (
    <main className="page subpage">
      <header className="subpage-header">
        <h1>notes<span aria-hidden="true">.</span></h1>
        <p>things I would rather not forget.</p>
      </header>

      <section className="empty-page" aria-label="Notes">
        {notes.length === 0 ? (
          <p>nothing here yet.</p>
        ) : (
          <div className="note-list">
            {notes.map((note) => (
              <article id={note.slug} key={note.slug}>
                <header>
                  <h2>{note.title}</h2>
                  <time dateTime={note.publishedAt}>{note.publishedAt}</time>
                </header>
                <div className="note-body">
                  {note.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
