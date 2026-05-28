import { useState } from "react";
import Header from "./components/Header";
import BookGrid from "./components/BookGrid";
import ModalAddBook from "./modals/ModalAddBook";
import ModalEditBook from "./modals/ModalEditBook";
import ModalDeleteBook from "./modals/ModalDeleteBook";

import { useBooks } from "./hooks/useBooks";
import { useLikes } from "./hooks/useLikes";

import "./App.css";

function App() {
  const { isLiked, toggleLike } = useLikes();

  const {
    filteredBooks,
    searchTerm,
    setSearchTerm,

    statusFilter,
    setStatusFilter,

    categoryFilter,
    setCategoryFilter,

    showFavorites,
    setShowFavorites,

    handleAdd,
    handleUpdate,
    handleDelete,
  } = useBooks(isLiked);

  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container">
      <button
        className="theme-circle"
        onClick={() => {
          setDarkMode(!darkMode);
          document.body.classList.toggle("dark");
        }}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <BookGrid
        books={filteredBooks}
        isLiked={isLiked}
        toggleLike={toggleLike}
        onChapterChange={(book) => handleUpdate(book, true)}
        onEdit={(book) => setEditingBook(book)}
        onDelete={(book) => setDeletingBook(book)}
        viewMode={viewMode}
      />

      {showModal && (
        <ModalAddBook
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingBook && (
        <ModalEditBook
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSubmit={(updated) => {
            handleUpdate(updated);
            setEditingBook(null);
          }}
        />
      )}

      {deletingBook && (
        <ModalDeleteBook
          title={deletingBook.title}
          onClose={() => setDeletingBook(null)}
          onConfirm={() => {
            handleDelete(deletingBook.isbn);
            setDeletingBook(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
