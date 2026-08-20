/* ========================= */
/* HELPERS COMPARTIDOS */
/* ========================= */

function isLogged() {
    return localStorage.getItem("loggedIn") === "true";
}

function currentUser() {
    return localStorage.getItem("currentUser") || "";
}

function getJSON(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function gkey(suffix) {
    return `gm:${currentUser()}:${suffix}`;
}

const OBJETIVOS = {
    fuerza: "Fuerza",
    volumen: "Volumen",
    perdida: "Pérdida de peso",
    resistencia: "Resistencia",
    mantener: "Mantener"
};

function setMenu(open) {
    const menuToggle = document.getElementById("menuToggle");
    document.body.classList.toggle("menu-open", open);
    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }
}
