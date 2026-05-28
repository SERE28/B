import type { Book } from "../types/Book";
import "../App.css";

interface BookCardProps {
  book: Book;
  isLiked: (id: string) => boolean;
  toggleLike: (id: string) => void;
  onChapterChange: (book: Book) => void; // 👈 CAMBIADO
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
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
}: BookCardProps) {
  return (
    <div className="card">
      {/* ❤️ Botón de like */}
      <button
        className={`like-btn ${isLiked(book.isbn) ? "liked" : ""}`}
        onClick={() => toggleLike(book.isbn)}
      >
        <span className="like-icon">{isLiked(book.isbn) ? "❤️" : "🤍"}</span>
      </button>

      <img
        src={
          book.coverUrl ||
          "https://via.placeholder.com/300x200?text=Sin+Portada"
        }
        alt={book.title}
        className="card-cover"
      />

      {/* 📚 Info */}
      <h3>{book.title}</h3>
      <p>
        <strong>Autor:</strong> {book.author}
      </p>
      <p>
        <strong>Categoría:</strong> {book.category}
      </p>

      {/* ⭐ Estado (solo mostrar, NO clicable) */}
      <span className={`status-badge status-${book.status}`}>
        {statusIcons[book.status]}
      </span>

      {/* 📈 Barra de progreso */}
      {book.totalChapters && book.totalChapters > 0 && (
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

      {/* 🎛 Selector de capítulo */}
      {book.totalChapters && (
        <select
          className="chapter-select"
          value={book.currentChapter}
          onChange={(e) =>
            onChapterChange({
              ...book,
              currentChapter: Number(e.target.value),
            })
          }
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
        <p>
          <strong>Rating:</strong> ⭐ {book.rating}
        </p>
      )}

      {/* 🔗 Enlace */}
      {book.website && (
        <button
          className="link-button"
          onClick={() => window.open(book.website, "_blank")}
        >
          Leer / Comprar
        </button>
      )}

      {/* 🗑 / ✏️ Acciones */}
      <button onClick={() => onDelete(book)}>Eliminar</button>
      <button onClick={() => onEdit(book)}>Editar</button>
    </div>
  );
}
