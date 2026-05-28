import "../App.css";
import type { SortOrder } from "../hooks/useBooks";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;

  showFavorites: boolean;
  setShowFavorites: (v: boolean) => void;

  sortOrder: SortOrder;
  setSortOrder: (v: SortOrder) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  openAddModal: () => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  showFavorites,
  setShowFavorites,
  sortOrder,
  setSortOrder,
  openAddModal,
}: HeaderProps) {
  return (
    <header className="header">
      {/* 🌙 Tema */}

      <h1>Mi Biblioteca</h1>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por título, autor o categoría..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="header-actions">
        <button onClick={openAddModal}>+ Añadir Libro</button>

        <button
          onClick={() => setShowFavorites(!showFavorites)}
          style={{ background: showFavorites ? "#d62828" : undefined }}
        >
          {showFavorites ? "❤️ Favoritos" : "🤍 Favoritos"}
        </button>
      </div>

      {/* ⭐ Chips de ordenación */}
      <div className="sort-chips">
        <span
          className={`sort-chip ${sortOrder === "category" ? "active" : ""}`}
          onClick={() => setSortOrder("category")}
        >
          📚 <span className="chip-text">Categoría</span>
        </span>

        <span
          className={`sort-chip ${sortOrder === "title" ? "active" : ""}`}
          onClick={() => setSortOrder("title")}
        >
          📖 <span className="chip-text">Título</span>
        </span>

        <span
          className={`sort-chip ${sortOrder === "author" ? "active" : ""}`}
          onClick={() => setSortOrder("author")}
        >
          👤 <span className="chip-text">Autor</span>
        </span>

        <span
          className={`sort-chip ${sortOrder === "status" ? "active" : ""}`}
          onClick={() => setSortOrder("status")}
        >
          📘 <span className="chip-text">Estado</span>
        </span>
      </div>
    </header>
  );
}
