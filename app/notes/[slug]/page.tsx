import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNote, notes } from "@/content/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return notes.length > 0
    ? notes.map((note) => ({ slug: note.slug }))
    : [{ slug: "__empty__" }];
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const note = getNote((await params).slug);

  return note
    ? { title: `${note.title} — suhail.`, description: note.summary }
    : {};
}

export default async function NotePage({ params }: NotePageProps) {
  const note = getNote((await params).slug);

  if (!note) notFound();

  return (
    <main className="page subpage note-page">
      <header className="subpage-header">
        <h1>{note.title}<span aria-hidden="true">.</span></h1>
        <time dateTime={note.publishedAt}>{note.publishedAt}</time>
      </header>

      <article className="note-body">
        {note.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}
