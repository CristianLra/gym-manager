console.log("Gym Manager iniciado");

const botones = document.querySelectorAll(".card button");
const contenido = document.getElementById("contenido");

function mostrarEjercicios(rutina) {
    let ejercicios = [];

    if (rutina === "pecho") {
        ejercicios = ["Press banca", "Press inclinado", "Aperturas"];
    } else if (rutina === "espalda") {
        ejercicios = ["Dominadas", "Remo con barra", "Jalones"];
    } else if (rutina === "pierna") {
        ejercicios = ["Sentadillas", "Prensa", "Extensiones"];
    }

    contenido.innerHTML = "";

    setTimeout(() => {
        ejercicios.forEach(ejercicio => {
            const li = document.createElement("li");
            li.textContent = ejercicio;
            contenido.appendChild(li);
        });
    }, 100);

    localStorage.setItem("ultimaRutina", rutina);
}

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const rutina = boton.dataset.rutina;
        mostrarEjercicios(rutina);
    });
});

const rutinaGuardada = localStorage.getItem("ultimaRutina");

if (rutinaGuardada) {
    mostrarEjercicios(rutinaGuardada);
}