export interface Book {
  isbn: string;
  title: string;
  author: string;
  category: string;
  subtitle?: string;
  description?: string;
  website?: string;
  coverUrl?: string;
  rating?: number;
  status: "leyendo" | "leido" | "pendiente" | "pausa" | "abandonado";
  currentChapter?: number;
  totalChapters?: number;
}
