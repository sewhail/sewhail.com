import type { Metadata } from "next";
import Link from "next/link";
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

      <section className="notes-section" aria-label="Notes">
        {notes.length === 0 ? (
          <p className="empty-copy">nothing here yet.</p>
        ) : (
          <div className="note-list">
            {notes.map((note) => (
              <article id={note.slug} key={note.slug}>
                <header>
                  <h2>
                    <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                  </h2>
                  <time dateTime={note.publishedAt}>{note.publishedAt}</time>
                </header>
                <p className="note-summary">{note.summary}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
