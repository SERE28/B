import BookCard from "./BookCard";
import type { Book } from "../types/Book";

interface BookGridProps {
  books: Book[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  onChapterChange: (book: Book) => void; // 👈 CORREGIDO
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookGrid({
  books,
  isLiked,
  toggleLike,
  onChapterChange,
  onEdit,
  onDelete,
}: BookGridProps) {
  return (
    <div className="grid">
      {books.map((b) => (
        <BookCard
          key={b.isbn}
          book={b}
          isLiked={isLiked}
          toggleLike={toggleLike}
          onChapterChange={onChapterChange} // 👈 COHERENTE
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
