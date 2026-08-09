/* ========================= */
/* UI COMPARTIDO: TOASTS Y CONFIRMACIÓN */
/* ========================= */

/* Service worker (PWA / offline) */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => { });
    });
}

function showToast(mensaje, tipo) {
    const contenedor = document.getElementById("toastContainer");
    if (!contenedor) return;

    const toast = document.createElement("div");
    toast.className = "toast " + (tipo || "info");
    toast.textContent = mensaje;

    contenedor.appendChild(toast);

    const quitar = () => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 300);
    };

    toast.addEventListener("click", quitar);
    setTimeout(quitar, 3200);
}

let confirmCallback = null;

function confirmarAccion(mensaje, onConfirm, opts) {
    opts = opts || {};
    const modal = document.getElementById("confirmModal");
    if (!modal) return;

    document.getElementById("confirmTitle").textContent = opts.title || "¿Confirmar?";
    document.getElementById("confirmMessage").textContent = mensaje;
    document.getElementById("confirmOk").textContent = opts.okText || "Sí";
    document.getElementById("confirmCancel").textContent = opts.cancelText || "Cancelar";

    confirmCallback = onConfirm;
    modal.classList.add("active");
}

function cerrarConfirmar() {
    const modal = document.getElementById("confirmModal");
    if (!modal) return;
    modal.classList.remove("active");
    confirmCallback = null;
}

const modalClosers = {};

function registrarCierre(id, fn) {
    modalClosers[id] = fn;
}

document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".modal.active").forEach(m => {
        if (modalClosers[m.id]) {
            modalClosers[m.id]();
        } else {
            m.classList.remove("active");
        }
    });
});

if (document.getElementById("confirmOk")) {
    document.getElementById("confirmOk").addEventListener("click", () => {
        const fn = confirmCallback;
        cerrarConfirmar();
        if (fn) fn();
    });
}

if (document.getElementById("confirmCancel")) {
    document.getElementById("confirmCancel").addEventListener("click", cerrarConfirmar);
}

const confirmModalEl = document.getElementById("confirmModal");
if (confirmModalEl) {
    confirmModalEl.addEventListener("click", (e) => {
        if (e.target === confirmModalEl) {
            cerrarConfirmar();
        }
    });
}

registrarCierre("confirmModal", cerrarConfirmar);
