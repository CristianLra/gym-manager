console.log("Gym Manager iniciado");

/* ========================= */
/* ELEMENTOS DEL DOM */
/* ========================= */

const openLogin = document.getElementById("openLogin");
const authOverlay = document.getElementById("authOverlay");
const openLoginFromOverlay = document.getElementById("openLoginFromOverlay");

const userDisplay = document.getElementById("userDisplay");

const openRegister = document.getElementById("openRegister");
const registerModal = document.getElementById("registerModal");
const closeRegister = document.getElementById("closeRegister");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
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

        const isLogged = localStorage.getItem("loggedIn");

        if (isLogged !== "true") {
            alert("Debes iniciar sesión primero 🔒");
            loginModal.classList.add("active");
            return;
        }

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
    const username = loginUser.value.trim();
    const password = loginPass.value.trim();

    let users = getUsers();

    const userFound = users.find(
        u => u.username === username && u.password === password
    );

    if (userFound) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", username);

        authOverlay.style.display = "none";
        loginModal.classList.remove("active");

        updateNavbar();

        alert("Login exitoso");
    } else {
        alert("Credenciales incorrectas");
    }
});

function updateNavbar() {
    const isLogged = localStorage.getItem("loggedIn");
    const username = localStorage.getItem("username");

    if (isLogged === "true") {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";

        userDisplay.textContent = `Hola, ${username} `;
    } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";

        userDisplay.textContent = "";
    }
}

window.addEventListener("load", () => {
    updateNavbar();
    checkAuth();
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    updateNavbar();
});

openLoginFromOverlay.addEventListener("click", () => {
    authOverlay.style.display = "none";
    loginModal.classList.add("active");
});

function checkAuth() {
    const isLogged = localStorage.getItem("loggedIn");

    if (isLogged === "true") {
        authOverlay.style.display = "none";
    } else {
        authOverlay.style.display = "flex";
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

openRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.remove("active");
    registerModal.classList.add("active");
});

openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.remove("active");
    loginModal.classList.add("active");
});

closeRegister.addEventListener("click", () => {
    registerModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === registerModal) {
        registerModal.classList.remove("active");
    }
});

document.getElementById("registerSubmit").addEventListener("click", () => {
    const username = document.getElementById("registerUser").value.trim();
    const password = document.getElementById("registerPass").value.trim();

    // Validación básica
    if (username === "" || password === "") {
        alert("Completa todos los campos ❗");
        return;
    }

    let users = getUsers();

    // Verificar si el usuario ya existe
    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("El usuario ya existe ❌");
        return;
    }

    // Guardar usuario nuevo
    users.push({ username, password });
    saveUsers(users);

    alert("Registro exitoso ✅");

    // Opcional: limpiar campos
    document.getElementById("registerUser").value = "";
    document.getElementById("registerPass").value = "";

    // Opcional: cerrar modal de registro
    registerModal.classList.remove("active");

    // Opcional: abrir login automáticamente
    loginModal.classList.add("active");
});