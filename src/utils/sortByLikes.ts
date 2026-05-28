import type { Book } from "../types/Book";

export const sortByLikes =
  (isLiked: (id: string) => boolean) => (a: Book, b: Book) =>
    Number(isLiked(b.isbn)) - Number(isLiked(a.isbn));
