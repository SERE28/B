// src/api.ts

// Esta es la URL donde está corriendo tu servidor PHP
const BASE_URL = "http://localhost:8000/api.php";

// Obtener todos los libros
export const fetchBooks = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error("Error al conectar con el servidor");
    return await response.json();
  } catch (error) {
    console.error("Error en fetchBooks:", error);
    return []; // Retorna un array vacío si falla para no romper la app
  }
};

// Añadir un nuevo libro
export const addBook = async (book: any) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });
    return await response.json();
  } catch (error) {
    console.error("Error en addBook:", error);
  }
};

// Eliminar un libro
export const deleteBook = async (isbn: string) => {
  try {
    // Enviamos el ISBN como parámetro en la URL
    const response = await fetch(`${BASE_URL}?isbn=${isbn}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error en deleteBook:", error);
  }
};

export async function updateBook(book: any) {
  const response = await fetch("http://localhost:8000/api.php", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error("Error actualizando libro");
  }

  return await response.json();
}

export async function updateLike(isbn: string, liked: boolean) {
  await fetch(`/api/books/${isbn}/like`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liked }),
  });
}
