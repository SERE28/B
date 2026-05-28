import BookCard from "./BookCard";
import { useLikes } from "../hooks/useLikes";
import type { Book } from "../types/Book";

interface BookListProps {
  libros: Book[];
}

export function BookList({ libros }: BookListProps) {
  const { isLiked, toggleLike } = useLikes();

  return (
    <div className="book-list">
      {libros.map((libro) => (
        <BookCard
          key={libro.isbn}
          book={libro}
          isLiked={isLiked}
          toggleLike={toggleLike}
          onChapterChange={() => {}}
          onEdit={() => {}}
          onDelete={() => {}}
          viewMode="list" // ⭐ NECESARIO
        />
      ))}
    </div>
  );
}
