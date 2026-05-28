import type { Book } from "../types/Book";

const statusPriority: Record<Book["status"], number> = {
  leyendo: 1,
  pendiente: 2,
  pausa: 3,
  abandonado: 4,
  leido: 5,
};

export const sortByStatus = (a: Book, b: Book) =>
  statusPriority[a.status] - statusPriority[b.status];
