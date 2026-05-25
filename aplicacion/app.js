/* ============================================================
   📌 SISTEMA DE DATOS
   ============================================================ */

const STORAGE = {
    favoritos: "biblioteca_favoritos",
    tareas: "notion_tareas",
    tabla: "notion_tabla",
    avatar: "notion_avatar",
    sidebarUser: "notion_sidebar_user"
};

function load(key, fallback) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch { return fallback; }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* ============================================================
   👤 AVATAR
   ============================================================ */

function initAvatar() {
    const avatar = document.getElementById("avatar");
    const avatarInitial = document.getElementById("avatar-initial");
    const avatarImg = document.getElementById("avatar-img");
    const avatarInput = document.getElementById("avatar-input");

    const stored = localStorage.getItem(STORAGE.avatar);
    if (stored) {
        avatarImg.src = stored;
        avatarImg.style.display = "block";
        avatarInitial.style.display = "none";
    }

    avatar.addEventListener("click", () => avatarInput.click());

    avatarInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            avatarImg.src = ev.target.result;
            avatarImg.style.display = "block";
            avatarInitial.style.display = "none";
            localStorage.setItem(STORAGE.avatar, ev.target.result);
        };
        reader.readAsDataURL(file);
    });
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

    let html = `
        <div class="block-header">
            <h3 ref="biblioteca/frontend/index.htmls" contenteditable="true" >📚 Biblioteca personal</h3>
            <button class="block-menu-btn block-options">⋯</button>
        </div>
        <button id="btn-add-libro" class="btn-add">+</button>
    `;

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

document.addEventListener("click", e => {
    if (e.target.id === "btn-add-libro") {
        const titulo = prompt("Título del libro:");
        if (!titulo || !titulo.trim()) return;
        const favs = load(STORAGE.favoritos, []);
        favs.push({ titulo: titulo.trim() });
        save(STORAGE.favoritos, favs);
        cargarFavoritos();
        actualizarSidebar();
    }
});

/* ============================================================
   📝 TAREAS
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
            <input type="checkbox" class="tarea-check" data-index="${index}" ${tarea.done ? "checked" : ""}>
            <span class="tarea-text ${clase}" contenteditable="true" data-index="${index}">
                ${tarea.text}
            </span>
            <button class="tarea-menu-btn" data-index="${index}">⋯</button>
        `;

        lista.appendChild(li);
    });
}

/* Añadir tarea */
document.addEventListener("click", e => {
    if (e.target.id === "btn-add-tarea") {
        const texto = prompt("Nueva tarea:");
        if (!texto || !texto.trim()) return;
        const tareas = load(STORAGE.tareas, []);
        tareas.push({ text: texto.trim(), done: false, estado: "pendiente" });
        save(STORAGE.tareas, tareas);
        renderTareas();
    }
});

/* Checkbox */
document.addEventListener("change", e => {
    if (!e.target.classList.contains("tarea-check")) return;
    const index = e.target.dataset.index;
    const tareas = load(STORAGE.tareas, []);
    tareas[index].done = e.target.checked;
    tareas[index].estado = e.target.checked ? "hecho" : "pendiente";
    save(STORAGE.tareas, tareas);
    renderTareas();
});

/* Editar texto */
document.addEventListener("input", e => {
    if (!e.target.classList.contains("tarea-text")) return;
    const index = e.target.dataset.index;
    const tareas = load(STORAGE.tareas, []);
    tareas[index].text = e.target.innerText.trim();
    save(STORAGE.tareas, tareas);
});

/* ============================================================
   ⋯ MENÚ DE TAREA
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
        <button data-action="hecho" data-index="${index}">✔ Hecho</button>
        <button data-action="eliminar" data-index="${index}">🗑 Eliminar</button>
    `;

    const rect = btn.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.querySelector("#menu-layer").appendChild(menu);
});

/* Acciones del menú de tarea */
document.addEventListener("click", e => {
    const btn = e.target.closest(".floating-menu button");
    if (!btn || !btn.dataset.action) return;

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
   📖 TABLA DE LECTURAS
   ============================================================ */

function renderTabla() {
    const tabla = load(STORAGE.tabla, [
        { titulo: "Clean Code", estado: "En progreso", notas: "Capítulo 3" },
        { titulo: "Refactoring", estado: "Pendiente", notas: "Empezar pronto" }
    ]);

    const tbody = document.querySelector("#tabla-lecturas");
    if (!tbody) return;

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

/* Editar tabla */
document.addEventListener("input", e => {
    if (!e.target.matches("#tabla-lecturas td")) return;
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    const tabla = load(STORAGE.tabla, []);
    tabla[row][col] = e.target.innerText.trim();
    save(STORAGE.tabla, tabla);
});

/* ============================================================
   📊 TABLA COMPARATIVA DE LIBROS
   ============================================================ */

function crearTablaComparativa(bloque) {
    bloque.innerHTML = `
        <div class="block-header">
            <h3 contenteditable="true">📘 Comparativa de libros</h3>
            <button class="block-menu-btn block-options">⋯</button>
        </div>

        <table class="tabla-lecturas comparativa">
            <thead>
                <tr>
                    <th>Libro</th>
                    <th>Puntuación</th>
                    <th>Notas</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td contenteditable="true">Libro A</td>
                    <td contenteditable="true">8/10</td>
                    <td contenteditable="true">Muy bueno</td>
                </tr>
                <tr>
                    <td contenteditable="true">Libro B</td>
                    <td contenteditable="true">7/10</td>
                    <td contenteditable="true">Interesante</td>
                </tr>
            </tbody>
        </table>
    `;
}

/* ============================================================
   ⋯ MENÚ UNIVERSAL PARA BLOQUES
   ============================================================ */

document.addEventListener("click", e => {
    const btn = e.target.closest(".block-options");
    if (!btn) return;

    const block = btn.closest(".block");
    const id = block.id || ("block-" + Date.now());
    block.id = id;

    document.querySelector("#menu-layer").innerHTML = "";

    const menu = document.createElement("div");
    menu.className = "floating-menu";
    menu.innerHTML = `
        <button data-block-action="edit" data-id="${id}">✏️ Editar bloque</button>
        <button data-block-action="type" data-id="${id}">📦 Cambiar tipo</button>
        <button data-block-action="delete" data-id="${id}">🗑 Eliminar bloque</button>
    `;

    const rect = btn.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.querySelector("#menu-layer").appendChild(menu);
});

/* Acciones del menú universal */
document.addEventListener("click", e => {
    const btn = e.target.closest("[data-block-action]");
    if (!btn) return;

    const action = btn.dataset.blockAction;
    const id = btn.dataset.id;
    const block = document.getElementById(id);

    if (!block) return;

    if (action === "delete") {
        block.parentElement.remove();
        actualizarSidebar();
        document.querySelector("#menu-layer").innerHTML = "";
        return;
    }

    if (action === "edit") {
        const h3 = block.querySelector("h3");
        h3.contentEditable = true;
        h3.focus();
        document.querySelector("#menu-layer").innerHTML = "";
        return;
    }

    if (action === "type") {
        mostrarMenuTipoBloque(block);
        return;
    }
});

/* ============================================================
   📦 MENÚ PARA CAMBIAR TIPO DE BLOQUE
   ============================================================ */

function mostrarMenuTipoBloque(block) {
    const id = block.id;

    document.querySelector("#menu-layer").innerHTML = "";

    const menu = document.createElement("div");
    menu.className = "floating-menu";
    menu.innerHTML = `
        <button data-block-type="text" data-id="${id}">📝 Texto</button>
        <button data-block-type="checklist" data-id="${id}">☑️ Checklist</button>
        <button data-block-type="list" data-id="${id}">• Lista</button>
        <button data-block-type="image" data-id="${id}">🖼 Texto + Imagen</button>
        <button data-block-type="comparativa" data-id="${id}">📊 Tabla comparativa</button>
    `;

    const rect = block.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.left = rect.left + "px";

    document.querySelector("#menu-layer").appendChild(menu);
}

/* Aplicar tipo */
document.addEventListener("click", e => {
    const btn = e.target.closest("[data-block-type]");
    if (!btn) return;

    const type = btn.dataset.blockType;
    const id = btn.dataset.id;
    const block = document.getElementById(id);

    if (!block) return;

    if (type === "text") {
        block.innerHTML = `
            <div class="block-header">
                <h3 contenteditable="true">📝 Texto</h3>
                <button class="block-menu-btn block-options">⋯</button>
            </div>
            <p contenteditable="true">Escribe aquí...</p>
        `;
    }

    if (type === "checklist") {
        block.innerHTML = `
            <div class="block-header">
                <h3 contenteditable="true">☑️ Checklist</h3>
                <button class="block-menu-btn block-options">⋯</button>
            </div>
            <ul class="todo-list">
                <li><input type="checkbox"> <span contenteditable="true">Nueva tarea</span></li>
            </ul>
        `;
    }

    if (type === "list") {
        block.innerHTML = `
            <div class="block-header">
                <h3 contenteditable="true">• Lista</h3>
                <button class="block-menu-btn block-options">⋯</button>
            </div>
            <ul>
                <li contenteditable="true">Elemento 1</li>
                <li contenteditable="true">Elemento 2</li>
            </ul>
        `;
    }

    if (type === "image") {
        block.innerHTML = `
            <div class="block-header">
                <h3 contenteditable="true">🖼 Texto + Imagen</h3>
                <button class="block-menu-btn block-options">⋯</button>
            </div>
            <p contenteditable="true">Escribe aquí...</p>
            <input type="file" accept="image/*" class="img-upload">
            <img class="block-img" style="max-width:100%; margin-top:10px;">
        `;
    }

    if (type === "comparativa") {
        crearTablaComparativa(block);
    }

    actualizarSidebar();
    document.querySelector("#menu-layer").innerHTML = "";
});

/* Imagen dentro de bloque */
document.addEventListener("change", e => {
    if (!e.target.classList.contains("img-upload")) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        e.target.nextElementSibling.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

/* ============================================================
   ➕ AÑADIR NUEVOS BLOQUES
   ============================================================ */

document.getElementById("btn-add-block").addEventListener("click", () => {
    const titulo = prompt("Título del nuevo bloque:");
    if (!titulo || !titulo.trim()) return;

    const main = document.getElementById("page-content");

    const wrapper = document.createElement("div");
    wrapper.className = "resizable-block vertical";

    const id = "block-extra-" + Date.now();

    wrapper.innerHTML = `
        <section class="block" id="${id}" data-title="${titulo.trim()}">
            <div class="block-header">
                <h3 contenteditable="true">${titulo.trim()}</h3>
                <button class="block-menu-btn block-options">⋯</button>
            </div>
            <p contenteditable="true">Escribe aquí...</p>
        </section>
        <div class="vertical-divider"></div>
    `;

    main.appendChild(wrapper);

    initVerticalDrag();
    actualizarSidebar();
});

/* ============================================================
   ↕ DRAG ENTRE BLOQUES
   ============================================================ */

function initVerticalDrag() {
    document.querySelectorAll(".vertical-divider").forEach(divider => {
        if (divider.dataset.init === "1") return;
        divider.dataset.init = "1";

        let startY, startHeight, block;

        divider.addEventListener("mousedown", e => {
            block = divider.previousElementSibling;
            startY = e.clientY;
            startHeight = block.offsetHeight;

            document.body.style.userSelect = "none";

            function move(ev) {
                const newHeight = startHeight + (ev.clientY - startY);
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
}

/* ============================================================
   ↔ DRAG LATERAL SIDEBAR
   ============================================================ */

function initSidebarDrag() {
    const sidebar = document.querySelector(".sidebar");
    const dividerH = document.querySelector(".horizontal-divider");
    if (!sidebar || !dividerH) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    dividerH.addEventListener("mousedown", e => {
        isResizing = true;
        startX = e.clientX;
        startWidth = sidebar.offsetWidth;
        document.body.style.userSelect = "none";
        dividerH.classList.add("active");
    });

    document.addEventListener("mousemove", e => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        let newWidth = startWidth + dx;
        if (newWidth < 160) newWidth = 160;
        if (newWidth > 420) newWidth = 420;
        sidebar.style.width = newWidth + "px";
    });

    document.addEventListener("mouseup", () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.userSelect = "";
        dividerH.classList.remove("active");
    });
}

/* ============================================================
   🔍 MODAL DE BÚSQUEDA
   ============================================================ */

document.getElementById("btn-search").addEventListener("click", () => {
    document.getElementById("search-modal").classList.remove("hidden");
    document.getElementById("search-input").focus();
});

document.getElementById("search-modal").addEventListener("click", e => {
    if (e.target.id === "search-modal") {
        e.target.classList.add("hidden");
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        document.getElementById("search-modal").classList.add("hidden");
    }
});

/* ============================================================
   📑 SIDEBAR DINÁMICA
   ============================================================ */

function actualizarSidebar() {
    const navIndex = document.getElementById("sidebar-dynamic");
    const navUser = document.getElementById("sidebar-user");
    if (!navIndex || !navUser) return;

    const userItems = load(STORAGE.sidebarUser, []);
    userItems.forEach((item, i) => {
        const a = document.createElement("a");
        a.className = "sidebar-link";
        a.textContent = item.titulo;
        a.href = item.href || "#user-" + i;
        navUser.appendChild(a);
    });

    const blocks = document.querySelectorAll("#page-content .block");
    blocks.forEach((block, i) => {
        let title = block.dataset.title || "";
        const h = block.querySelector("h1, h2, h3");
        if (h && h.textContent.trim()) title = h.textContent.trim();
        if (!title) title = "Bloque " + (i + 1);

        const id = block.id || ("block-" + i);
        block.id = id;

        const link = document.createElement("a");
        link.className = "sidebar-link";
        link.textContent = title;
        link.href = "#" + id;

        navIndex.appendChild(link);
    });
}

document.getElementById("btn-add-sidebar").addEventListener("click", () => {
    const titulo = prompt("Nombre del elemento personal:");
    if (!titulo || !titulo.trim()) return;

    const items = load(STORAGE.sidebarUser, []);
    items.push({ titulo: titulo.trim() });
    save(STORAGE.sidebarUser, items);
    actualizarSidebar();
});

/* ============================================================
   🚀 INICIALIZACIÓN
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    initAvatar();
    cargarFavoritos();
    renderTareas();
    renderTabla();
    initVerticalDrag();
    initSidebarDrag();
    actualizarSidebar();
});
