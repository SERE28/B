/* ============================================================
   📌 SISTEMA DE DATOS (TU JSON REAL)
   ============================================================ */

const STORAGE = {
    favoritos: "biblioteca_favoritos",
    tareas: "notion_tareas",
    tabla: "notion_tabla"
};

function load(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); }
    catch { return fallback; }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   📚 BIBLIOTECA
   ============================================================ */

function cargarFavoritos() {
    const favoritos = load(STORAGE.favoritos, [
        { titulo: "Clean Code" },
        { titulo: "Refactoring" },
        { titulo: "You Don't Know JS" }
    ]);

    const bloque = document.querySelector("#bloque-biblioteca");
    if (!bloque) return;

    let html = `<h2>📚 Biblioteca personal</h2>`;

    if (favoritos.length === 0) {
        html += `<p>No tienes libros en favoritos todavía.</p>`;
    } else {
        html += `<ul>`;
        favoritos.forEach(libro => {
            html += `<li>⭐ ${libro.titulo}</li>`;
        });
        html += `</ul>`;
    }

    bloque.innerHTML = html;
}

/* ============================================================
   📝 TAREAS (ADAPTADO A TU JSON)
   ============================================================ */

function renderTareas() {
    const tareas = load(STORAGE.tareas, [
        { text: "Terminar maquetación Notion", done: false, estado: "en proceso" },
        { text: "Leer 1 capítulo de Clean Code", done: false, estado: "pendiente" },
        { text: "Organizar biblioteca", done: true, estado: "hecho" }
    ]);

    const lista = document.querySelector(".todo-list");
    if (!lista) return;

    lista.innerHTML = "";

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.dataset.index = index;

        let clase = "";
        if (tarea.estado === "en proceso") clase = "tarea-proceso";
        if (tarea.estado === "hecho") clase = "tarea-hecha";

        li.innerHTML = `
            <span class="drag-handle"></span>

            <input type="checkbox" class="tarea-check" data-index="${index}" ${tarea.done ? "checked" : ""}>

            <span class="tarea-text ${clase}" contenteditable="true" data-index="${index}">
                ${tarea.text}
            </span>

            <button class="tarea-menu-btn" data-index="${index}">⋯</button>
        `;

        lista.appendChild(li);
    });
}

/* ============================================================
   ✔ AÑADIR TAREA
   ============================================================ */
function addTarea(text) {
    if (!text || !text.trim()) return;

    const tareas = load(STORAGE.tareas, []);
    tareas.push({ text: text.trim(), done: false, estado: "pendiente" });

    save(STORAGE.tareas, tareas);
    renderTareas();
}

document.getElementById("btn-add-tarea").addEventListener("click", () => {
    const texto = prompt("Nueva tarea:");
    addTarea(texto);
});

/* ============================================================
   ✔ CHECKBOX
   ============================================================ */
document.addEventListener("change", e => {
    if (!e.target.classList.contains("tarea-check")) return;

    const index = e.target.dataset.index;
    const tareas = load(STORAGE.tareas, []);

    tareas[index].done = e.target.checked;
    tareas[index].estado = e.target.checked ? "hecho" : "pendiente";

    save(STORAGE.tareas, tareas);
    renderTareas();
});

/* ============================================================
   ✔ EDITAR TEXTO
   ============================================================ */
document.addEventListener("input", e => {
    if (!e.target.classList.contains("tarea-text")) return;

    const index = e.target.dataset.index;
    const tareas = load(STORAGE.tareas, []);

    tareas[index].text = e.target.innerText.trim();

    save(STORAGE.tareas, tareas);
});

/* ============================================================
   ✔ MENÚ ⋯ DE CADA TAREA (SIN TRIÁNGULOS)
   ============================================================ */
document.addEventListener("click", e => {
    const btn = e.target.closest(".tarea-menu-btn");
    if (!btn) return;

    const index = btn.dataset.index;

    document.querySelector("#menu-layer").innerHTML = "";

    const menu = document.createElement("div");
    menu.className = "floating-menu";
    menu.innerHTML = `
        <button data-action="editar" data-index="${index}">✏️ Editar</button>
        <button data-action="proceso" data-index="${index}">🔄 En proceso</button>
        <button data-action="hecho" data-index="${index}">✔ Marcar como hecho</button>
        <button data-action="eliminar" data-index="${index}">🗑 Eliminar</button>
    `;

    const rect = btn.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.querySelector("#menu-layer").appendChild(menu);
});

/* ============================================================
   ✔ ACCIONES DEL MENÚ DE TAREA
   ============================================================ */
document.addEventListener("click", e => {
    const btn = e.target.closest(".floating-menu button");
    if (!btn) return;

    const index = btn.dataset.index;
    const action = btn.dataset.action;
    const tareas = load(STORAGE.tareas, []);

    if (action === "editar") {
        const nuevo = prompt("Nuevo texto:", tareas[index].text);
        if (nuevo && nuevo.trim()) tareas[index].text = nuevo.trim();
    }

    if (action === "proceso") {
        tareas[index].estado = "en proceso";
        tareas[index].done = false;
    }

    if (action === "hecho") {
        tareas[index].estado = "hecho";
        tareas[index].done = true;
    }

    if (action === "eliminar") {
        tareas.splice(index, 1);
    }

    save(STORAGE.tareas, tareas);
    renderTareas();

    document.querySelector("#menu-layer").innerHTML = "";
});

/* ============================================================
   ✔ MENÚ ⋯ DEL BLOQUE “Tareas de hoy”
   ============================================================ */
document.addEventListener("click", e => {
    const btn = e.target.closest("#menu-bloque-tareas");
    if (!btn) return;

    document.querySelector("#menu-layer").innerHTML = "";

    const menu = document.createElement("div");
    menu.className = "floating-menu";
    menu.innerHTML = `
        <button data-block="editar-titulo">✏️ Editar título</button>
        <button data-block="limpiar">🧹 Limpiar tareas</button>
        <button data-block="eliminar">🗑 Eliminar todas</button>
    `;

    const rect = btn.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.querySelector("#menu-layer").appendChild(menu);
});

/* ============================================================
   ✔ ACCIONES DEL MENÚ DEL BLOQUE
   ============================================================ */
document.addEventListener("click", e => {
    const btn = e.target.closest(".floating-menu button[data-block]");
    if (!btn) return;

    const action = btn.dataset.block;

    if (action === "editar-titulo") {
        const h3 = document.querySelector(".block-todos h3");
        h3.contentEditable = true;
        h3.focus();
    }

    if (action === "limpiar") {
        save(STORAGE.tareas, []);
    }

    if (action === "eliminar") {
        save(STORAGE.tareas, []);
    }

    renderTareas();
    document.querySelector("#menu-layer").innerHTML = "";
});

/* ============================================================
   ✔ CERRAR MENÚS AL HACER CLICK FUERA
   ============================================================ */
document.addEventListener("click", e => {
    if (!e.target.closest(".floating-menu") &&
        !e.target.closest(".tarea-menu-btn") &&
        !e.target.closest("#menu-bloque-tareas")) {
        document.querySelector("#menu-layer").innerHTML = "";
    }
});

/* ============================================================
   📖 TABLA DE LECTURAS (ADAPTADA A TU JSON)
   ============================================================ */
function renderTabla() {
    const tabla = load(STORAGE.tabla, [
        { titulo: "Clean Code", estado: "En progreso", notas: "Capítulo 3" },
        { titulo: "Refactoring", estado: "Pendiente", notas: "Empezar pronto" }
    ]);

    const tbody = document.querySelector("#tabla-lecturas");
    tbody.innerHTML = "";

    tabla.forEach((fila, index) => {
        tbody.innerHTML += `
            <tr>
                <td contenteditable="true" data-row="${index}" data-col="titulo">${fila.titulo}</td>
                <td contenteditable="true" data-row="${index}" data-col="estado">${fila.estado}</td>
                <td contenteditable="true" data-row="${index}" data-col="notas">${fila.notas}</td>
            </tr>
        `;
    });

    save(STORAGE.tabla, tabla);
}

document.addEventListener("input", e => {
    if (!e.target.matches("#tabla-lecturas td")) return;

    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const tabla = load(STORAGE.tabla, []);

    tabla[row][col] = e.target.innerText.trim();

    save(STORAGE.tabla, tabla);
});

/* ============================================================
   ↕ DRAG ENTRE BLOQUES
   ============================================================ */
document.querySelectorAll(".vertical-divider").forEach(divider => {
    let startY, startHeight, block;

    divider.addEventListener("mousedown", e => {
        block = divider.previousElementSibling;
        startY = e.clientY;
        startHeight = block.offsetHeight;

        document.body.style.userSelect = "none";

        function move(e) {
            const newHeight = startHeight + (e.clientY - startY);
            block.style.height = Math.max(60, newHeight) + "px";
        }

        function stop() {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", stop);
            document.body.style.userSelect = "";
        }

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stop);
    });
});

/* ============================================================
   ↔ DRAG LATERAL ENTRE SIDEBAR Y CONTENIDO
   ============================================================ */

let isResizingSidebar = false;
let startX = 0;
let startWidth = 0;

const sidebar = document.querySelector(".sidebar");
const dividerH = document.querySelector(".horizontal-divider");

if (sidebar && dividerH) {
    dividerH.addEventListener("mousedown", e => {
        isResizingSidebar = true;
        dividerH.classList.add("active");

        startX = e.clientX;
        startWidth = sidebar.offsetWidth;

        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", e => {
        if (!isResizingSidebar) return;

        const dx = e.clientX - startX;
        let newWidth = startWidth + dx;

        if (newWidth < 160) newWidth = 160;
        if (newWidth > 420) newWidth = 420;

        sidebar.style.width = newWidth + "px";
    });

    document.addEventListener("mouseup", () => {
        isResizingSidebar = false;
        dividerH.classList.remove("active");
        document.body.style.userSelect = "";
    });
}

/* ============================================================
   🚀 INICIALIZACIÓN
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarFavoritos();
    renderTareas();
    renderTabla();
});
