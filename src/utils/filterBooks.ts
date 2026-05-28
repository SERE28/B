import type { Book } from "../types/Book";
import { normalizeText } from "./normalizeText";

export const filterBooks = (books: Book[], term: string) => {
  const t = normalizeText(term);

  return books.filter(
    (b) =>
      normalizeText(b.title).includes(t) ||
      normalizeText(b.author).includes(t) ||
      normalizeText(b.category).includes(t),
  );
};
