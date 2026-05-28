import { useState, useEffect, useRef } from "react";
import "./Modal.css";
import StarRating from "./StarRating";

interface Props {
  onClose: () => void;
  onSubmit: (book: {
    title: string;
    author: string;
    category: string;
    coverUrl: string;
    website: string;
    rating: number;
    status: "leyendo" | "leido" | "pendiente" | "pausa" | "abandonado";
    currentChapter?: number;
    totalChapters?: number;
  }) => void;
}

export default function ModalAddBook({ onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<
    "leyendo" | "leido" | "pendiente" | "pausa" | "abandonado"
  >("leyendo");

  const [currentChapter, setCurrentChapter] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);

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
        <h2>Añadir Libro</h2>

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
          value={currentChapter}
          onChange={(e) =>
            setCurrentChapter(Math.max(0, Number(e.target.value)))
          }
        />

        <label>Capítulos totales:</label>
        <input
          type="number"
          min={0}
          value={totalChapters}
          onChange={(e) =>
            setTotalChapters(Math.max(0, Number(e.target.value)))
          }
        />

        <label>Rating:</label>
        <StarRating value={rating} onChange={setRating} />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Guardar</button>
          <button className="cancel" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
