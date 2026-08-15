export type Note = {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  paragraphs: string[];
};

// Add a note here and it will appear on /notes.
export const notes: Note[] = [];

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}
