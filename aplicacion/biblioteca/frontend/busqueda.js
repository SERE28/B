console.log("busqueda.js cargado y sincronizado.");

const listContenedor = document.getElementById("book-list");
const modal = document.getElementById("modal-edicion");
let resultadosActuales = [];

// 1. Ejecutar la búsqueda al cargar o al enviar el formulario
async function ejecutarBusqueda() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    const criterio = params.get("criterio") || "all";

    // Actualizar el título dinámico
    const titulo = document.getElementById("titulo-resultados");
    if (titulo) {
        titulo.textContent = q ? `Resultados para: "${q}" (${criterio})` : "Colección Completa";
    }

    // Sincronizar campos del buscador
    const inputSearch = document.getElementById("search-input");
    const selectCriterio = document.getElementById("search-criterio");
    if (inputSearch) inputSearch.value = q;
    if (selectCriterio) selectCriterio.value = criterio;

    try {
        // Enviar parámetros al PHP
        const url = `../backend/Libros.php?q=${encodeURIComponent(q)}&criterio=${encodeURIComponent(criterio)}`;
        const res = await fetch(url);
        const data = await res.json();
        resultadosActuales = data.books || [];

        if (resultadosActuales.length === 0) {
            listContenedor.innerHTML = '<p class="empty">❌ No se encontraron libros.</p>';
            return;
        }

        listContenedor.innerHTML = resultadosActuales.map(b => `
            <div class="card-wrapper">
                <article class="book-card" onclick="prepararEdicion('${b.isbn}')">
                    <div class="cover-container">
                        <img src="${b.coverUrl || 'https://placehold.co/200x280'}" class="book-cover">
                    </div>
                    <div class="book-info">
                        <h3>${b.title}</h3>
                        <p>${b.author}</p>
                    </div>
                </article>
                <button class="btn-delete" onclick="eliminarLibroEnServidor('${b.isbn}')">🗑️ Eliminar</button>
            </div>
        `).join("");
    } catch (e) {
        listContenedor.innerHTML = '<p>Error al conectar con el servidor.</p>';
    }
}

// 2. Lógica de Edición (Modal)
window.prepararEdicion = function(isbn) {
    const libro = resultadosActuales.find(b => String(b.isbn) === String(isbn));
    if (!libro) return;
    
    document.getElementById('isbn_original').value = libro.isbn;
    document.getElementById('titulo').value = libro.title;
    document.getElementById('autor').value = libro.author;
    document.getElementById('categoria').value = libro.category || libro.categoria || "";
    document.getElementById('type').value = libro.type || "libro";
    document.getElementById('status').value = libro.status || "pendiente";
    document.getElementById('coverUrl').value = libro.coverUrl || '';
    document.getElementById('isbn').value = libro.isbn;
    
    document.getElementById('preview-title').textContent = libro.title;
    document.getElementById('preview-img').src = libro.coverUrl || 'https://placehold.co/200x280';
    
    modal.style.display = 'flex';
};

document.getElementById('btn-cerrar-modal').addEventListener('click', () => modal.style.display = 'none');

// 3. Guardar Edición
document.getElementById('form-libros').addEventListener('submit', async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch("../backend/editLibro.php", { method: 'POST', body: formData });
    if (res.ok) { alert("¡Actualizado!"); window.location.reload(); }
});

// 4. Borrar
window.eliminarLibroEnServidor = async function(isbn) {
    if (!confirm("¿Seguro que quieres eliminar este libro?")) return;
    await fetch("../backend/deleteLibro.php", { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({isbn: String(isbn)}) 
    });
    window.location.reload();
};

// Iniciar búsqueda
ejecutarBusqueda();