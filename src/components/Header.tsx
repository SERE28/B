import { CATEGORIES } from "../constants/categories";
import type { Book } from "../types/Book";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;

  statusFilter: Book["status"] | "todos";
  setStatusFilter: (value: Book["status"] | "todos") => void;

  categoryFilter: string;
  setCategoryFilter: (value: string) => void;

  showFavorites: boolean;
  setShowFavorites: (value: boolean) => void;

  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  showFavorites,
  setShowFavorites,
  viewMode, // ✅ AHORA SÍ
  setViewMode, // ✅ AHORA SÍ
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-actions">
        <button
          className="view-toggle"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? "📄 Lista" : "🟦 Grid"}
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar libro..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as Book["status"] | "todos")
        }
        className="header-select"
      >
        <option value="todos">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="leyendo">Leyendo</option>
        <option value="pausa">En pausa</option>
        <option value="leido">Leído</option>
        <option value="abandonado">Abandonado</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="header-select"
      >
        <option value="todas">Todas las categorías</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button
        className="fav-btn"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        {showFavorites ? "❤️ Favoritos" : "🤍 Todos"}
      </button>
    </header>
  );
}
