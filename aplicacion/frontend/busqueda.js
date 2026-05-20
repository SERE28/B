console.log("busqueda.js cargado correctamente");

// Obtener el parámetro exacto de la URL (?q=...)
const params = new URLSearchParams(window.location.search);
const q = params.get("q") || "";

// Mostrar el título dinámico según lo que se buscó
const tituloResultados = document.getElementById("titulo-resultados");
if(tituloResultados) {
  tituloResultados.textContent = q ? `Resultados para: "${q}"` : "Colección Completa";
}

// Ruta apuntando hacia el Backend de libros con su debida codificación
const URL_BUSQUEDA = "../backend/Libros.php?q=" + encodeURIComponent(q);
const listContenedor = document.getElementById("book-list");

function escapeHtmlBusqueda(str) {
  return String(str ?? '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

if(listContenedor) {
  fetch(URL_BUSQUEDA)
    .then(res => res.json())
    .then(data => {
      const books = data.books || [];

      if (!Array.isArray(books) || books.length === 0) {
        listContenedor.innerHTML = '<p class="empty">❌ No se encontraron libros que coincidan con la búsqueda.</p>';
        return;
      }

      // Renderiza los resultados usando exactamente los mismos estilos estéticos de la página principal
      listContenedor.innerHTML = books.map(book => {
        const estrellas = "⭐".repeat(parseInt(book.rating || 0));
        const portadaUrl = book.coverUrl && book.coverUrl.trim() !== "" 
          ? escapeHtmlBusqueda(book.coverUrl) 
          : "https://placehold.co/150x220?text=Sin+Portada";

        const tipoFormato = escapeHtmlBusqueda(book.type ?? "libro");
        const estadoLectura = escapeHtmlBusqueda(book.status ?? "pendiente");
        const progresoActual = escapeHtmlBusqueda(book.progress ?? "—");
        const anyoPublicacion = (book.published ?? book.anyoPub ?? "—").toString().substring(0, 4);

        return `
          <div class="card-wrapper">
            <article class="book-card" data-type="${tipoFormato}">
              <div class="cover-container">
                <img src="${portadaUrl}" alt="Portada" class="book-cover" onerror="this.src='https://placehold.co/150x220?text=Error+Imagen'">
                <span class="status-badge badge-${estadoLectura}">${estadoLectura}</span>
              </div>
              
              <div class="book-info">
                <div class="meta-row">
                  <span class="format-badge format-${tipoFormato}">${tipoFormato}</span>
                  <span class="stars-rating">${estrellas}</span>
                </div>
                
                <h3 class="book-title">${escapeHtmlBusqueda(book.title)}</h3>
                <p class="book-author">Por: ${escapeHtmlBusqueda(book.author)}</p>
                <p class="book-tags">🏷️ ${escapeHtmlBusqueda(book.category ?? book.categoria)}</p>
                <p class="book-year" style="font-size:0.8rem; margin-bottom:8px; opacity:0.8;">📅 Publicado: ${escapeHtmlBusqueda(anyoPublicacion)}</p>
                
                <div class="progress-box">
                  <span>Progreso:</span> <strong>${progresoActual}</strong>
                </div>
              </div>
            </article>
            
            <!-- Reutiliza la función global de borrado declarada en app.js -->
            <button class="btn-delete" onclick="eliminarLibroEnServidor('${book.isbn}')">🗑️ Eliminar</button>
          </div>
        `;
      }).join("");
    })
    .catch(err => {
      console.error("Error al procesar el fetch de búsquedas:", err);
      listContenedor.innerHTML = `<p class="error">Ocurrió un error al cargar los resultados desde el servidor.</p>`;
    });
}