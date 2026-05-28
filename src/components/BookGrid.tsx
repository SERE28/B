import BookCard from "./BookCard";
import type { Book } from "../types/Book";

interface BookGridProps {
  books: Book[];
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  onChapterChange: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  viewMode: "grid" | "list";
}

export default function BookGrid({
  books,
  isLiked,
  toggleLike,
  onChapterChange,
  onEdit,
  onDelete,
  viewMode,
}: BookGridProps) {
  return (
    <div className={viewMode === "grid" ? "grid" : "list"}>
      {books.map((book) => (
        <BookCard
          key={book.isbn}
          book={book}
          isLiked={isLiked}
          toggleLike={toggleLike}
          onChapterChange={onChapterChange}
          onEdit={onEdit}
          onDelete={onDelete}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
