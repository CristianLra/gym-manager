console.log("Historial Gym Manager iniciado");

/* ========================= */
/* HELPERS */
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

/* ========================= */
/* AUTH */
/* ========================= */

if (!isLogged()) {
    location.href = "index.html";
}

function updateNavbar() {
    const username = currentUser();

    if (isLogged() && username) {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "inline-block";
        document.getElementById("userDisplay").textContent = `Hola, ${username}`;
        document.getElementById("userDisplay").style.display = "inline-block";
    } else {
        document.getElementById("loginBtn").style.display = "inline-block";
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("userDisplay").textContent = "";
        document.getElementById("userDisplay").style.display = "none";
    }
}

document.getElementById("logoutBtn").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    location.href = "index.html";
});

window.addEventListener("load", updateNavbar);

/* ========================= */
/* SEGUIMIENTO DE PESO */
/* ========================= */

const pesoInput = document.getElementById("pesoInput");
const pesoSubmit = document.getElementById("pesoSubmit");
const ejercicioSelect = document.getElementById("ejercicioSelect");

let pesoChart = null;
let progresoChart = null;

const CHART_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { labels: { color: "#fff", font: { family: "Inter" } } }
    },
    scales: {
        y: {
            beginAtZero: false,
            grid: { color: "#2A2A29" },
            ticks: { color: "#918F89", font: { family: "Inter" } }
        },
        x: {
            grid: { color: "#2A2A29" },
            ticks: { color: "#918F89", font: { family: "Inter" } }
        }
    }
};

function getPesos() {
    return getJSON(gkey("pesos"), []);
}

function savePeso() {
    const peso = parseFloat(pesoInput.value);
    if (!peso || peso <= 0) {
        showToast("Ingresa un peso válido", "error");
        return;
    }

    const pesos = getPesos();
    pesos.push({
        fecha: new Date().toISOString().slice(0, 10),
        peso
    });
    setJSON(gkey("pesos"), pesos);

    pesoInput.value = "";
    renderChart();
}

function renderChart() {
    const pesos = getPesos();
    const canvas = document.getElementById("pesoChart");
    const ctx = canvas.getContext("2d");

    if (pesoChart) {
        pesoChart.destroy();
    }

    const labels = pesos.map(p => p.fecha);
    const data = pesos.map(p => p.peso);

    if (pesos.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#918F89";
        ctx.font = "14px Inter, Arial";
        ctx.textAlign = "center";
        ctx.fillText("Guarda tu peso para ver el gráfico", canvas.width / 2, canvas.height / 2);
        return;
    }

    pesoChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Peso (kg)",
                data,
                borderColor: "#FF5A1F",
                backgroundColor: "rgba(255, 90, 31, 0.15)",
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#FF5A1F",
                pointRadius: 5
            }]
        },
        options: CHART_OPTS
    });
}

pesoSubmit.addEventListener("click", savePeso);

pesoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        savePeso();
    }
});

/* ========================= */
/* PROGRESO POR EJERCICIO */
/* ========================= */

let cacheProgreso = {};

function getProgresoEjercicios() {
    const historial = getJSON(gkey("historial"), []);
    const porEjercicio = {};

    historial.forEach(entry => {
        if (!entry.ejercicios || !Array.isArray(entry.ejercicios)) return;
        entry.ejercicios.forEach(ej => {
            if (!ej.sets || !Array.isArray(ej.sets)) return;
            const pesos = ej.sets
                .map(s => s.peso)
                .filter(p => typeof p === "number");
            if (pesos.length === 0) return;

            const mejor = Math.max(...pesos);
            if (!porEjercicio[ej.nombre]) porEjercicio[ej.nombre] = [];
            porEjercicio[ej.nombre].push({ fecha: entry.fecha, peso: mejor });
        });
    });

    return porEjercicio;
}

function poblarEjercicios() {
    const data = getProgresoEjercicios();

    ejercicioSelect.innerHTML = '<option value="">Selecciona un ejercicio</option>';
    Object.keys(data).sort().forEach(nombre => {
        const opt = document.createElement("option");
        opt.value = nombre;
        opt.textContent = nombre;
        ejercicioSelect.appendChild(opt);
    });

    return data;
}

function renderProgresoEjercicio(data, nombre) {
    const canvas = document.getElementById("progresoChart");
    const ctx = canvas.getContext("2d");

    if (progresoChart) {
        progresoChart.destroy();
        progresoChart = null;
    }

    if (!nombre || !data[nombre]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#918F89";
        ctx.font = "14px Inter, Arial";
        ctx.textAlign = "center";
        const mensaje = Object.keys(data).length > 0
            ? "Selecciona un ejercicio para ver su evolución"
            : "Guarda entrenamientos con peso para ver tu evolución por ejercicio";
        ctx.fillText(mensaje, canvas.width / 2, canvas.height / 2);
        return;
    }

    const puntos = [...data[nombre]].sort((a, b) => a.fecha < b.fecha ? -1 : 1);
    const labels = puntos.map(p => p.fecha);
    const pesos = puntos.map(p => p.peso);

    progresoChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: `${nombre} — mejor set (kg)`,
                data: pesos,
                borderColor: "#FF5A1F",
                backgroundColor: "rgba(255, 90, 31, 0.15)",
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "#fff",
                pointBorderColor: "#FF5A1F",
                pointRadius: 5
            }]
        },
        options: CHART_OPTS
    });
}

ejercicioSelect.addEventListener("change", () => {
    renderProgresoEjercicio(cacheProgreso, ejercicioSelect.value);
});

const OBJETIVOS = {
    fuerza: "Fuerza",
    volumen: "Volumen",
    perdida: "Pérdida de peso",
    resistencia: "Resistencia",
    mantener: "Mantener"
};

function mostrarPerfilInfo() {
    const el = document.getElementById("perfilInfo");
    if (!el) return;

    const perfil = getJSON(gkey("perfil"), {});
    const partes = [];
    if (perfil.objetivo) {
        partes.push(`Objetivo: ${OBJETIVOS[perfil.objetivo] || perfil.objetivo}`);
    }
    if (perfil.altura) {
        partes.push(`${perfil.altura} cm`);
    }
    el.textContent = partes.join(" · ");
}

/* ========================= */
/* HISTORIAL DE ENTRENAMIENTOS */
/* ========================= */

function renderHistorial() {
    const historial = getJSON(gkey("historial"), []);
    const list = document.getElementById("historialList");

    list.innerHTML = "";

    if (historial.length === 0) {
        const empty = document.createElement("p");
        empty.className = "historial-empty";
        empty.textContent = "Aún no has guardado entrenamientos. Entrena y guarda tu sesión en RUTINAS.";
        list.appendChild(empty);
        return;
    }

    const ordenado = [...historial].reverse();

    ordenado.forEach(entry => {
        const item = document.createElement("div");
        item.className = "historial-item";

        const head = document.createElement("div");
        head.className = "historial-head";

        const info = document.createElement("div");
        info.innerHTML = `
            <p class="historial-nombre">${entry.nombre}</p>
            <p class="historial-fecha">${entry.fecha} — ${entry.hora}</p>
        `;

        const resultado = document.createElement("p");
        resultado.className = "historial-resultado";
        resultado.textContent = `${entry.completados}/${entry.total} ✅`;

        head.appendChild(info);
        head.appendChild(resultado);

        const detalle = document.createElement("div");
        detalle.className = "historial-detalle";

        if (entry.ejercicios && entry.ejercicios.length > 0) {
            entry.ejercicios.forEach(ej => {
                const row = document.createElement("p");
                row.className = "detalle-ejercicio";

                const sets = ej.sets.map(s => {
                    const peso = s.peso !== "" && s.peso != null
                        ? `${s.peso}kg`
                        : "PC";
                    return `<b>${peso}</b> × ${s.reps}`;
                }).join(" · ");

                row.innerHTML = `<b>${ej.nombre}:</b> ${sets}`;
                detalle.appendChild(row);
            });
        } else {
            const p = document.createElement("p");
            p.className = "detalle-vacio";
            p.textContent = "Sesión guardada sin detalle de series.";
            detalle.appendChild(p);
        }

        item.appendChild(head);
        item.appendChild(detalle);

        head.addEventListener("click", () => {
            item.classList.toggle("open");
        });

        list.appendChild(item);
    });
}

/* ========================= */
/* INIT */
/* ========================= */

window.addEventListener("load", () => {
    updateNavbar();
    mostrarPerfilInfo();
    renderChart();
    renderHistorial();
    cacheProgreso = poblarEjercicios();
    renderProgresoEjercicio(cacheProgreso, ejercicioSelect.value);
});
