/* ==========================================================================
   CONFIGURACIÓN Y VARIABLES
   ========================================================================== */
const URL_LEER = '../backend/Libros.php', 
      URL_AÑADIR = '../backend/addLibro.php', 
      URL_ELIMINAR = '../backend/deleteLibro.php', 
      URL_EDITAR = '../backend/editLibro.php';

let todasLasLecturas = [], modoEdicion = false;

// Cargar Libros inicial con control de caché
async function loadBooks() {
    try {
        const response = await fetch(`${URL_LEER}?q=&t=${Date.now()}`); 
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        todasLasLecturas = data.books || [];
        renderBooks(todasLasLecturas);
    } catch (error) {
        console.error("Error al cargar libros:", error);
    }
}

/* ==========================================================================
   RENDERIZADO
   ========================================================================== */
function renderBooks(booksList) {
    const list = document.getElementById('book-list');
    if (!booksList || booksList.length === 0) {
        list.innerHTML = '<p class="empty">No se encontraron libros.</p>';
        return;
    }
    
    list.innerHTML = booksList.map(book => `
        <div class="card-wrapper">
            <article class="book-card" onclick="prepararEdicion('${book.isbn}')">
                <div class="cover-container">
                    <img src="${book.coverUrl || 'https://placehold.co/200x280'}" class="book-cover" alt="${book.title}">
                </div>
                <div class="book-info">
                    <h3 title="${book.title}">${book.title}</h3>
                    <p>${book.author}</p>
                </div>
            </article>
            <button type="button" class="btn-delete" onclick="eliminarLibroEnServidor('${book.isbn}')">🗑️ Eliminar</button>
        </div>
    `).join("");
}

/* ==========================================================================
   GESTIÓN DEL MODAL Y FORMULARIO
   ========================================================================== */
window.prepararEdicion = function(isbn) {
    const libro = todasLasLecturas.find(b => String(b.isbn) === String(isbn));
    if(!libro) return;
    
    modoEdicion = true;
    const modal = document.getElementById('modal-edicion');
    
    document.getElementById('form-legend').textContent = "✏️ Editando: " + libro.title;
    document.getElementById('btn-submit-form').textContent = "Guardar Cambios";
    document.getElementById('isbn_original').value = libro.isbn;
    document.getElementById('titulo').value = libro.title;
    document.getElementById('autor').value = libro.author;
    document.getElementById('categoria').value = libro.category;
    document.getElementById('type').value = libro.type;
    document.getElementById('status').value = libro.status;
    document.getElementById('progress').value = libro.progress;
    document.getElementById('rating').value = libro.rating;
    document.getElementById('coverUrl').value = libro.coverUrl;
    document.getElementById('readUrl').value = libro.readUrl;
    document.getElementById('isbn').value = libro.isbn;
    
    document.getElementById('btn-cancelar-edicion').style.display = 'block';
    document.getElementById('btn-eliminar-libro').style.display = 'block';
    
    modal.style.display = 'flex';
};

function cerrarModal() {
    document.getElementById('modal-edicion').style.display = 'none';
    modoEdicion = false;
    document.getElementById('form-libros').reset();
    document.getElementById('btn-cancelar-edicion').style.display = 'none';
    document.getElementById('btn-eliminar-libro').style.display = 'none';
    document.getElementById('form-legend').textContent = "Registrar Nueva Lectura";
    document.getElementById('btn-submit-form').textContent = "Guardar en mi Colección";
}

// Acción de Guardar (Añadir o Editar)
document.getElementById('form-libros').addEventListener('submit', async e => {
    e.preventDefault();
    
    // --- NUEVA VALIDACIÓN: ISBN OBLIGATORIO ---
    const isbn = document.getElementById('isbn').value.trim();
    if (!isbn) {
        alert("El campo 'ID Interno / ISBN' es obligatorio.");
        document.getElementById('isbn').focus();
        return;
    }
    // ------------------------------------------

    const formData = new FormData(e.target);
    
    const response = await fetch(modoEdicion ? URL_EDITAR : URL_AÑADIR, { 
        method: 'POST', 
        body: formData 
    });
    
    if(response.ok) {
        cerrarModal();
        await loadBooks(); // Recargamos datos frescos
    } else {
        alert("Error al guardar en el servidor.");
    }
});

// Acción de Eliminar
window.eliminarLibroEnServidor = async function(isbn) {
    if(!confirm("¿Estás seguro de eliminar este libro?")) return;
    
    try {
        const response = await fetch(URL_ELIMINAR, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn: String(isbn) }) 
        });
        
        if (response.ok) {
            cerrarModal();
            await loadBooks();
        } else {
            alert("Error al intentar borrar el libro.");
        }
    } catch (err) {
        console.error("Error:", err);
    }
};

// Conexión botón eliminar manual
document.getElementById('btn-eliminar-libro').addEventListener('click', () => {
    const isbnOriginal = document.getElementById('isbn_original').value;
    if(isbnOriginal) eliminarLibroEnServidor(isbnOriginal);
});

// Eventos cierre
document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
document.getElementById('btn-cancelar-edicion').addEventListener('click', cerrarModal);

// Carga inicial
loadBooks();