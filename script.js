console.log("Gym Manager iniciado");

/* ========================= */
/* ELEMENTOS DEL DOM */
/* ========================= */
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginSubmit = document.getElementById("loginSubmit");

const botones = document.querySelectorAll(".card button");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalExercises = document.getElementById("modal-exercises");
const modalExtras = document.getElementById("modal-extras");
const progressText = document.getElementById("progress-text");
const closeBtn = document.getElementById("close");
const progressFill = document.getElementById("progress-fill");

let currentRutina = "";

/* ========================= */
/* DATOS */
/* ========================= */

function obtenerRutina(rutina) {
    const datos = {
        pecho: {
            ejercicios: [
                { nombre: "Press banca", series: 4, repeticiones: 10 },
                { nombre: "Press inclinado", series: 3, repeticiones: 12 },
                { nombre: "Aperturas", series: 3, repeticiones: 15 }
            ],
            extras: ["Pecho superior", "Pecho inferior", "Pecho con mancuernas"]
        },
        espalda: {
            ejercicios: [
                { nombre: "Dominadas", series: 4, repeticiones: 8 },
                { nombre: "Remo con barra", series: 4, repeticiones: 10 },
                { nombre: "Jalones", series: 3, repeticiones: 12 }
            ],
            extras: ["Espalda alta", "Espalda baja", "Trapecio"]
        },
        pierna: {
            ejercicios: [
                { nombre: "Sentadillas", series: 4, repeticiones: 10 },
                { nombre: "Prensa", series: 4, repeticiones: 12 },
                { nombre: "Extensiones", series: 3, repeticiones: 15 }
            ],
            extras: ["Cuádriceps", "Femoral", "Glúteo"]
        }
    };

    return datos[rutina];
}

/* ========================= */
/* PROGRESO */
/* ========================= */

function actualizarProgreso(total, rutina) {
    let completados = 0;

    for (let i = 0; i < total; i++) {
        const key = `${rutina}-${i}`;
        if (localStorage.getItem(key) === "true") {
            completados++;
        }
    }

    progressText.textContent = `${completados}/${total} ejercicios completados`;

    const porcentaje = total > 0 ? (completados / total) * 100 : 0;
    progressFill.style.width = porcentaje + "%";
}

/* ========================= */
/* MODAL */
/* ========================= */

function abrirModal(rutina) {
    const data = obtenerRutina(rutina);
    currentRutina = rutina;

    modalTitle.textContent = "Rutina de " + rutina;

    modalExercises.innerHTML = "";
    modalExtras.innerHTML = "";

    data.ejercicios.forEach((ejercicio, index) => {
        const li = document.createElement("li");

        const label = document.createElement("label");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const texto = `${ejercicio.nombre} — ${ejercicio.series} series x ${ejercicio.repeticiones} reps`;

        const key = `${rutina}-${index}`;

        checkbox.checked = localStorage.getItem(key) === "true";

        checkbox.addEventListener("change", () => {
            localStorage.setItem(key, checkbox.checked);
            actualizarProgreso(data.ejercicios.length, rutina);
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + texto));

        li.appendChild(label);
        modalExercises.appendChild(li);
    });

    data.extras.forEach(extra => {
        const li = document.createElement("li");
        li.textContent = extra;
        modalExtras.appendChild(li);
    });

    actualizarProgreso(data.ejercicios.length, rutina);

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarModal() {
    modal.classList.add("hide");
    document.body.classList.remove("modal-open");

    setTimeout(() => {
        modal.classList.remove("active", "hide");
    }, 200);
}

/* ========================= */
/* EVENTOS BOTONES */
/* ========================= */

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const rutina = boton.dataset.rutina;
        abrirModal(rutina);
    });
});

closeBtn.addEventListener("click", cerrarModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

/* ========================= */
/* ANIMACIÓN SCROLL CARDS */
/* ========================= */

const cards = document.querySelectorAll(".card");

function mostrarCards() {
    const triggerBottom = window.innerHeight * 0.85;

    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;

        if (cardTop < triggerBottom) {
            card.classList.add("show");
        }
    });
}

window.addEventListener("scroll", mostrarCards);
mostrarCards();

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("active");
});

closeLogin.addEventListener("click", () => {
    loginModal.classList.remove("active");
});

loginSubmit.addEventListener("click", () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        alert("Login exitoso ✅");
        loginModal.classList.remove("active");
    } else {
        alert("Credenciales incorrectas ❌");
    }
});