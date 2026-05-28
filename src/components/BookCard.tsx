import type { Book } from "../types/Book";
import "../App.css";

interface BookCardProps {
  book: Book;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  onChapterChange: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  viewMode: "grid" | "list";
}

const statusIcons: Record<Book["status"], string> = {
  pendiente: "⏳ Pendiente",
  leyendo: "📖 Leyendo",
  pausa: "💤 En pausa",
  leido: "✔️ Leído",
  abandonado: "❌ Abandonado",
};

export default function BookCard({
  book,
  isLiked,
  toggleLike,
  onChapterChange,
  onEdit,
  onDelete,
  viewMode,
}: BookCardProps) {
  return (
    <div className={`card ${viewMode === "list" ? "card-list" : ""}`}>
      {/* ❤️ Like */}
      <button
        className={`like-btn ${isLiked(book.isbn) ? "liked" : ""}`}
        onClick={() => toggleLike(book.isbn)}
      >
        <span className="like-icon">{isLiked(book.isbn) ? "❤️" : "🤍"}</span>
      </button>

      {/* 🖼 Portada */}
      <img
        src={
          book.coverUrl ||
          "https://via.placeholder.com/300x200?text=Sin+Portada"
        }
        alt={book.title}
        className="card-cover"
      />

      {/* 📚 Info */}
      <h3 className="title">{book.title}</h3>
      <p className="author">
        <strong>Autor:</strong> {book.author}
      </p>
      <p className="category">
        <strong>Categoría:</strong> {book.category}
      </p>

      {/* ⭐ Estado */}
      <span className={`status-badge status-${book.status}`}>
        {statusIcons[book.status]}
      </span>

      {/* 📈 Progreso */}
      {book.totalChapters && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(book.currentChapter! / book.totalChapters) * 100}%`,
              }}
            ></div>
          </div>
          <p className="progress-text">
            Cap. {book.currentChapter} / {book.totalChapters}
          </p>
        </div>
      )}

      {/* 🎛 Selector capítulo */}
      {book.totalChapters && (
        <select
          className="chapter-select"
          value={book.currentChapter}
          onChange={(e) => {
            const newChapter = Number(e.target.value);
            let newStatus = book.status;

            if (newChapter === 0) {
              newStatus = "pendiente";
            } else if (newChapter === book.totalChapters) {
              newStatus = "leido";
            } else {
              newStatus = "leyendo";
            }

            onChapterChange({
              ...book,
              currentChapter: newChapter,
              status: newStatus,
            });
          }}
        >
          {[
            0,
            ...Array.from({ length: book.totalChapters }, (_, i) => i + 1),
          ].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? "Capítulo 0" : `Capítulo ${n}`}
            </option>
          ))}
        </select>
      )}

      {/* ⭐ Rating */}
      {book.rating !== undefined && (
        <p className="rating">
          <strong>Rating:</strong> ⭐ {book.rating}
        </p>
      )}

      {/* 🔗 Enlace */}
      {book.website && (
        <button
          className="action-btn"
          onClick={() => window.open(book.website, "_blank")}
        >
          Leer / Comprar
        </button>
      )}

      {/* 🗑 / ✏️ Acciones */}
      <button className="action-btn" onClick={() => onDelete(book)}>
        Eliminar
      </button>
      <button className="action-btn edit-btn" onClick={() => onEdit(book)}>
        Editar
      </button>
    </div>
  );
}
