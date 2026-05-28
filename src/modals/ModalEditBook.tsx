import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import StarRating from "./StarRating";

interface Book {
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

interface Props {
  book: Book;
  onClose: () => void;
  onSubmit: (updatedBook: Book) => void;
}

export default function ModalEditBook({ book, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category);
  const [coverUrl, setCoverUrl] = useState(book.coverUrl || "");
  const [website, setWebsite] = useState(book.website || "");
  const [rating, setRating] = useState(book.rating || 0);
  const [status, setStatus] = useState(book.status);

  const [currentChapter, setCurrentChapter] = useState(
    book.currentChapter || 0,
  );
  const [totalChapters, setTotalChapters] = useState(book.totalChapters || 0);

  const [closing, setClosing] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    author: false,
    category: false,
  });

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const newErrors = {
      title: title.trim() === "",
      author: author.trim() === "",
      category: category.trim() === "",
    };

    setErrors(newErrors);

    if (newErrors.title || newErrors.author || newErrors.category) return;

    onSubmit({
      ...book,
      title,
      author,
      category,
      coverUrl,
      website,
      rating,
      status,
      currentChapter,
      totalChapters,
    });

    handleClose();
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <div className={`modal-overlay ${closing ? "fade-out" : ""}`}>
      <div className={`modal ${closing ? "fade-out-scale" : ""}`}>
        <h2>Editar Libro</h2>

        <input
          ref={titleRef}
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "input-error" : ""}
        />

        <input
          type="text"
          placeholder="Autor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={errors.author ? "input-error" : ""}
        />

        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={errors.category ? "input-error" : ""}
        />

        <input
          type="text"
          placeholder="URL de la portada"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL para leer/comprar"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <div className="status-select-container">
          <label>Estado de lectura:</label>

          <select
            className={`status-select ${status}`}
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as
                  | "leyendo"
                  | "leido"
                  | "pendiente"
                  | "pausa"
                  | "abandonado",
              )
            }
          >
            <option value="pendiente">Pendiente</option>
            <option value="leyendo">Leyendo</option>
            <option value="pausa">En pausa</option>
            <option value="leido">Leído</option>
            <option value="abandonado">Abandonado</option>
          </select>
        </div>

        <label>Capítulo actual:</label>
        <input
          type="number"
          min={0}
          max={totalChapters}
          value={currentChapter}
          onChange={(e) =>
            setCurrentChapter(
              Math.min(totalChapters, Math.max(0, Number(e.target.value))),
            )
          }
        />

        <label>Capítulos totales:</label>
        <input
          type="number"
          min={0}
          value={totalChapters}
          onChange={(e) => {
            const newTotal = Math.max(0, Number(e.target.value));
            setTotalChapters(newTotal);

            // Ajustar currentChapter si se pasa del nuevo total
            if (currentChapter > newTotal) {
              setCurrentChapter(newTotal);
            }
          }}
        />

        <label>Rating:</label>
        <StarRating value={rating} onChange={setRating} />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Guardar Cambios</button>
          <button className="cancel" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
