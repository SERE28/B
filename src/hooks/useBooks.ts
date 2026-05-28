import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchBooks, addBook, updateBook, deleteBook } from "../api/api";
import type { Book } from "../types/Book";

import { filterBooks, sortByStatus, sortByLikes } from "../utils";

export type SortOrder = "category" | "title" | "author" | "status" | "likes";

export function useBooks(isLiked: (id: string) => boolean) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("category");
  const [showFavorites, setShowFavorites] = useState(false);

  /* ⭐ Cargar libros */
  const loadBooks = useCallback(async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      console.error("Error cargando libros:", error);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  /* ⭐ Filtrado + ordenación */
  const filteredBooks = useMemo(() => {
    let result = filterBooks(books, searchTerm);

    /* ❤️ Filtrar solo favoritos */
    if (showFavorites) {
      result = result.filter((b) => isLiked(b.isbn));
    }

    /* 🔠 Ordenación */
    result = result.sort((a, b) => {
      switch (sortOrder) {
        case "category":
          return a.category.localeCompare(b.category);
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "status":
          return sortByStatus(a, b);
        case "likes":
          return sortByLikes(isLiked)(a, b);
        default:
          return 0;
      }
    });

    return result;
  }, [books, searchTerm, sortOrder, showFavorites, isLiked]);

  /* ⭐ Actualizar libro con estado automático */
  const handleUpdate = useCallback(
    async (updated: Book, autoStatus?: boolean) => {
      const { currentChapter, totalChapters } = updated;

      let newStatus = updated.status;

      // Solo recalcular estado si viene del modal
      if (autoStatus) {
        if (currentChapter <= 0) {
          newStatus = "pendiente";
        } else if (currentChapter > 0 && currentChapter < totalChapters) {
          newStatus = "leyendo";
        } else if (currentChapter >= totalChapters) {
          newStatus = "leido";
        }
      }

      const finalBook = { ...updated, status: newStatus };

      await updateBook(finalBook);

      setBooks((prev) =>
        prev.map((b) => (b.isbn === updated.isbn ? finalBook : b)),
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
    books,
    filteredBooks,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    showFavorites,
    setShowFavorites,
    handleAdd,
    handleUpdate,
    handleDelete,
    loadBooks,
  };
}
