import { useEffect, useState } from "react";
// (Opcional) importa tu función para guardar en la API
// import { updateLike } from "../api";

const STORAGE_KEY = "likedBooks";

export function useLikes() {
  const [likedIds, setLikedIds] = useState<string[]>([]);

  /* 🔄 Cargar likes desde localStorage */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLikedIds(parsed);
        }
      } catch (e) {
        console.error("Error leyendo likes", e);
      }
    }
  }, []);

  /* 💾 Guardar likes en localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));
  }, [likedIds]);

  /* ❤️ Saber si un libro está en favoritos */
  const isLiked = (id: string) => likedIds.includes(id);

  /* ❤️ Alternar like */
  const toggleLike = async (id: string) => {
    const newLiked = !likedIds.includes(id);

    setLikedIds((prev) =>
      newLiked ? [...prev, id] : prev.filter((x) => x !== id),
    );

    // (Opcional) Guardar en tu API
    // await updateLike(id, newLiked);
  };

  return { likedIds, isLiked, toggleLike };
}
