import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchBooks, addBook, updateBook, deleteBook } from "../api/api";
import type { Book } from "../types/Book";
import { filterBooks } from "../utils";
import { CATEGORY_MAP, CATEGORY_MAP_REVERSE } from "../constants/categoryMap";

export function useBooks(isLiked: (id: string) => boolean) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<Book["status"] | "todos">(
    "todos",
  );

  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  const [showFavorites, setShowFavorites] = useState(false);

  /* ⭐ Cargar libros con traducción EN → ES */
  const loadBooks = useCallback(async () => {
    try {
      const data = await fetchBooks();

      const translated = data.map((b) => ({
        ...b,
        category: CATEGORY_MAP[b.category.toLowerCase()] ?? b.category,
      }));

      setBooks(translated);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  /* ⭐ Filtrado */
  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (statusFilter !== "todos") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (categoryFilter !== "todas") {
      result = result.filter((b) => b.category === categoryFilter);
    }

    result = filterBooks(result, searchTerm);

    if (showFavorites) {
      result = result.filter((b) => isLiked(b.isbn));
    }

    return result;
  }, [books, searchTerm, statusFilter, categoryFilter, showFavorites, isLiked]);

  /* ⭐ Guardar libro con traducción ES → EN */
  const translateCategoryToEN = (category: string) =>
    CATEGORY_MAP_REVERSE[category] ?? category;

  /* ⭐ Actualizar libro */
  const handleUpdate = useCallback(
    async (updated: Book, autoStatus?: boolean) => {
      const { currentChapter, totalChapters } = updated;

      let newStatus = updated.status;

      if (autoStatus) {
        if (currentChapter <= 0) newStatus = "pendiente";
        else if (currentChapter < totalChapters) newStatus = "leyendo";
        else newStatus = "leido";
      }

      const finalBook = {
        ...updated,
        status: newStatus,
        category: translateCategoryToEN(updated.category),
      };

      await updateBook(finalBook);

      setBooks((prev) =>
        prev.map((b) => (b.isbn === updated.isbn ? updated : b)),
      );
    },
    [],
  );

  /* ⭐ Añadir libro */
  const handleAdd = useCallback(
    async (data: Omit<Book, "isbn">) => {
      const newBook: Book = {
        isbn: Date.now().toString(),
        ...data,
        category: translateCategoryToEN(data.category),
      };

      await addBook(newBook);
      loadBooks();
    },
    [loadBooks],
  );

  /* ⭐ Eliminar libro */
  const handleDelete = useCallback(async (isbn: string) => {
    await deleteBook(isbn);
    setBooks((prev) => prev.filter((b) => b.isbn !== isbn));
  }, []);

  return {
    filteredBooks,
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    categoryFilter,
    setCategoryFilter,

    showFavorites,
    setShowFavorites,

    handleAdd,
    handleUpdate,
    handleDelete,
  };
}
