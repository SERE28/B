document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-añadir');
    const inputTitulo = document.getElementById('titulo');
    const inputCover = document.getElementById('coverUrl');
    const previewTitle = document.getElementById('preview-title');
    const previewImg = document.getElementById('preview-img');

    // Previsualización dinámica
    inputTitulo.addEventListener('input', () => {
        previewTitle.textContent = inputTitulo.value || "Nuevo Libro";
    });

    inputCover.addEventListener('input', () => {
        previewImg.src = inputCover.value || "https://placehold.co/200x280?text=Sin+Portada";
    });

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isbn = document.getElementById('isbn').value.trim();
        if (!isbn) {
            alert("El ISBN es obligatorio.");
            return;
        }

        const formData = new FormData(e.target);
        try {
            const response = await fetch('../backend/addLibro.php', { 
                method: 'POST', 
                body: formData 
            });
            
            if (response.ok) {
                alert("¡Lectura registrada con éxito!");
                window.location.href = 'index.html'; 
            } else {
                alert("Error al guardar en el servidor.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión.");
        }
    });
});