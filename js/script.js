console.log("Gym Manager iniciado");

/* ========================= */
/* ELEMENTOS DEL DOM */
/* ========================= */

const openLogin = document.getElementById("openLogin");

const userDisplay = document.getElementById("userDisplay");

const landingView = document.getElementById("landingView");
const appView = document.getElementById("appView");
const publicNav = document.getElementById("publicNav");
const appNav = document.getElementById("appNav");

const openRegister = document.getElementById("openRegister");
const registerModal = document.getElementById("registerModal");
const closeRegister = document.getElementById("closeRegister");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const heroCta = document.getElementById("heroCta");
const ctaFinalBtn = document.getElementById("ctaFinalBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginSubmit = document.getElementById("loginSubmit");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalExercises = document.getElementById("modal-exercises");
const modalExtras = document.getElementById("modal-extras");

const progressText = document.getElementById("progress-text");
const closeBtn = document.getElementById("close");
const progressFill = document.getElementById("progress-fill");

const cardsContainer = document.getElementById("cardsContainer");

const diaEntrenar = document.getElementById("diaEntrenar");
const diaNombre = document.getElementById("diaNombre");
const diaDesc = document.getElementById("diaDesc");

const timerDisplay = document.getElementById("timer-display");

const newRutinaBtn = document.getElementById("newRutinaBtn");
const newRutinaModal = document.getElementById("newRutinaModal");
const newRutinaTitle = document.getElementById("newRutinaTitle");
const closeNewRutina = document.getElementById("closeNewRutina");
const newRutinaName = document.getElementById("newRutinaName");
const newRutinaEjercicios = document.getElementById("newRutinaEjercicios");
const newRutinaSubmit = document.getElementById("newRutinaSubmit");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const saveSessionBtn = document.getElementById("saveSession");

const horarioBtn = document.getElementById("horarioBtn");
const horarioModal = document.getElementById("horarioModal");
const closeHorario = document.getElementById("closeHorario");
const horarioList = document.getElementById("horarioList");
const horarioSubmit = document.getElementById("horarioSubmit");

const perfilBtn = document.getElementById("perfilBtn");
const perfilModal = document.getElementById("perfilModal");
const closePerfil = document.getElementById("closePerfil");
const perfilObjetivo = document.getElementById("perfilObjetivo");
const perfilAltura = document.getElementById("perfilAltura");
const perfilSubmit = document.getElementById("perfilSubmit");
const perfilLine = document.getElementById("perfilLine");

const OBJETIVOS = {
    fuerza: "Fuerza",
    volumen: "Volumen",
    perdida: "Pérdida de peso",
    resistencia: "Resistencia",
    mantener: "Mantener"
};

let currentRutina = "";
let timerInterval = null;
let rutinaEditando = null;

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

function progressKey(rutina, index) {
    return gkey(`progreso:${rutina}:${index}`);
}

/* ========================= */
/* DATOS */
/* ========================= */

function getCustomRutinas() {
    return getJSON(gkey("rutinas"), {});
}

function obtenerRutina(rutina) {
    const custom = getCustomRutinas();
    if (custom[rutina]) {
        return custom[rutina];
    }
    return RUTINAS[rutina];
}

function todasLasRutinas() {
    return { ...RUTINAS, ...getCustomRutinas() };
}

/* ========================= */
/* RENDER CARDS */
/* ========================= */

function renderCards() {
    const rutinas = todasLasRutinas();
    cardsContainer.innerHTML = "";

    let index = 1;

    for (const key in rutinas) {
        const r = rutinas[key];
        const card = document.createElement("div");
        card.className = "card";

        const custom = getCustomRutinas();
        const isCustom = !!custom[key];

        card.innerHTML = `
            <p class="card-index">${String(index).padStart(2, "0")}</p>
            ${isCustom ? `<button class="card-delete" data-delete="${key}" title="Eliminar">&times;</button>` : ""}
            <h3>${r.nombre}</h3>
            <p>${r.desc}</p>
            <div class="card-actions">
                <button data-rutina="${key}">VER MÁS</button>
                <button data-editar="${key}">${isCustom ? "EDITAR" : "CLONAR"}</button>
            </div>
        `;

        cardsContainer.appendChild(card);
        index++;
    }

    mostrarCards();
}

cardsContainer.addEventListener("click", (e) => {
    const del = e.target.closest("[data-delete]");
    if (del) {
        eliminarRutina(del.dataset.delete);
        return;
    }

    const edit = e.target.closest("[data-editar]");
    if (edit) {
        abrirEditorRutina(edit.dataset.editar);
        return;
    }

    const btn = e.target.closest("[data-rutina]");
    if (btn) {
        if (!isLogged()) {
            showToast("Debes iniciar sesión primero", "error");
            loginModal.classList.add("active");
            return;
        }
        abrirModal(btn.dataset.rutina);
    }
});

function eliminarRutina(key) {
    confirmarAccion(
        "¿Eliminar esta rutina personalizada? No podrás recuperarla.",
        () => {
            const custom = getCustomRutinas();
            delete custom[key];
            setJSON(gkey("rutinas"), custom);
            renderCards();
            showToast("Rutina eliminada", "ok");
        },
        { title: "Eliminar rutina", okText: "Eliminar", cancelText: "Cancelar" }
    );
}

/* ========================= */
/* PROGRESO */
/* ========================= */

function actualizarProgreso(total, rutina) {
    let completados = 0;

    for (let i = 0; i < total; i++) {
        if (localStorage.getItem(progressKey(rutina, i)) === "true") {
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
    if (!data) return;

    currentRutina = rutina;

    modalTitle.textContent = data.nombre;

    modalExercises.innerHTML = "";
    modalExtras.innerHTML = "";

    data.ejercicios.forEach((ejercicio, index) => {
        const li = document.createElement("li");
        li.className = "ex-item";

        const key = progressKey(rutina, index);

        const label = document.createElement("label");
        label.className = "ex-head";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "ex-check";
        checkbox.checked = localStorage.getItem(key) === "true";

        const span = document.createElement("span");
        span.className = "ex-title";
        span.textContent = `${ejercicio.nombre} — ${ejercicio.series} series x ${ejercicio.repeticiones} reps`;

        label.appendChild(checkbox);
        label.appendChild(span);

        const setGrid = document.createElement("div");
        setGrid.className = "set-grid";

        for (let s = 1; s <= ejercicio.series; s++) {
            const row = document.createElement("div");
            row.className = "set-row";

            const num = document.createElement("span");
            num.className = "set-num";
            num.textContent = s;

            const peso = document.createElement("input");
            peso.type = "number";
            peso.className = "set-peso";
            peso.placeholder = "kg";
            peso.step = "0.5";
            peso.min = "0";

            const reps = document.createElement("input");
            reps.type = "number";
            reps.className = "set-reps";
            reps.placeholder = "reps";
            reps.min = "0";

            [peso, reps].forEach(input => {
                input.addEventListener("input", () => {
                    if ((peso.value !== "" || reps.value !== "") && !checkbox.checked) {
                        checkbox.checked = true;
                        li.classList.add("completed");
                        localStorage.setItem(key, "true");
                        actualizarProgreso(data.ejercicios.length, rutina);
                    }
                });
            });

            row.appendChild(num);
            row.appendChild(peso);
            row.appendChild(reps);
            setGrid.appendChild(row);
        }

        checkbox.addEventListener("change", () => {
            localStorage.setItem(key, checkbox.checked);
            li.classList.toggle("completed", checkbox.checked);
            actualizarProgreso(data.ejercicios.length, rutina);
        });

        li.classList.toggle("completed", checkbox.checked);

        li.appendChild(label);
        li.appendChild(setGrid);
        modalExercises.appendChild(li);
    });

    (data.extras || []).forEach(extra => {
        const span = document.createElement("span");
        span.className = "extra-tag";
        span.textContent = extra;
        modalExtras.appendChild(span);
    });

    actualizarProgreso(data.ejercicios.length, rutina);

    detenerTimer();

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function cerrarModal() {
    modal.classList.add("hide");
    document.body.classList.remove("modal-open");
    detenerTimer();

    setTimeout(() => {
        modal.classList.remove("active", "hide");
    }, 200);
}

closeBtn.addEventListener("click", cerrarModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        cerrarModal();
    }
});

/* ========================= */
/* GUARDAR ENTRENAMIENTO */
/* ========================= */

// Mayor peso por ejercicio en todo el historial, ANTES de guardar la sesión.
// Es la base del PR automático: al guardar se compara cada set contra este mapa
// y si alguno lo supera se muestra el toast "nuevo PR".
function mejoresSetsHistorial(historial) {
    const porEjercicio = {};
    historial.forEach(entry => {
        if (!entry.ejercicios || !Array.isArray(entry.ejercicios)) return;
        entry.ejercicios.forEach(ej => {
            if (!ej.sets || !Array.isArray(ej.sets)) return;
            const pesos = ej.sets.map(s => s.peso).filter(p => typeof p === "number");
            if (pesos.length === 0) return;
            const mejor = Math.max(...pesos);
            if (!porEjercicio[ej.nombre] || mejor > porEjercicio[ej.nombre]) {
                porEjercicio[ej.nombre] = mejor;
            }
        });
    });
    return porEjercicio;
}

saveSessionBtn.addEventListener("click", () => {
    if (!currentRutina) return;

    const data = obtenerRutina(currentRutina);
    let completados = 0;
    const ejerciciosLog = [];

    data.ejercicios.forEach((ej, i) => {
        const done = localStorage.getItem(progressKey(currentRutina, i)) === "true";
        if (done) completados++;

        const sets = [];
        const item = modalExercises.children[i];
        if (item) {
            item.querySelectorAll(".set-row").forEach(row => {
                const peso = row.querySelector(".set-peso").value.trim();
                const reps = row.querySelector(".set-reps").value.trim();
                if (reps !== "") {
                    sets.push({
                        peso: peso === "" ? "" : parseFloat(peso),
                        reps: parseInt(reps, 10)
                    });
                }
            });
        }

        if (sets.length > 0) {
            ejerciciosLog.push({ nombre: ej.nombre, sets });
        }
    });

    if (completados === 0) {
        showToast("Marca al menos un ejercicio como completado", "error");
        return;
    }

    const historial = getJSON(gkey("historial"), []);
    const mejoresPrevios = mejoresSetsHistorial(historial);

    historial.push({
        // Fecha en UTC. En husos negativos (ej. Colombia, UTC-5) una sesión guardada entre
        // las 19:00 y la medianoche local queda fechada al día siguiente; la racha semanal
        // calcula "hoy" con fecha local (fmtFecha), así que esa sesión puede caer en la semana
        // equivocada. Edge conocido: unificar la fecha a local arregla el desfase.
        fecha: new Date().toISOString().slice(0, 10),
        hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
        rutina: currentRutina,
        nombre: data.nombre,
        completados,
        total: data.ejercicios.length,
        ejercicios: ejerciciosLog
    });
    setJSON(gkey("historial"), historial);

    const prs = [];
    ejerciciosLog.forEach(ej => {
        const pesos = (ej.sets || []).map(s => s.peso).filter(p => typeof p === "number");
        if (pesos.length === 0) return;
        const nuevoMejor = Math.max(...pesos);
        const previo = mejoresPrevios[ej.nombre];
        if (previo && nuevoMejor > previo) {
            prs.push(`Nuevo PR: ${nuevoMejor}kg en ${ej.nombre} (antes ${previo}kg)`);
        }
    });

    data.ejercicios.forEach((ej, i) => {
        localStorage.removeItem(progressKey(currentRutina, i));
    });

    localStorage.setItem(gkey("backupCount"), (getBackupConteo() + 1).toString());

    cerrarModal();
    showToast("Entrenamiento guardado", "ok");
    prs.forEach(msg => showToast(msg, "pr"));

    revisarBackup();
});

/* ========================= */
/* TEMPORIZADOR */
/* ========================= */

function formatearTimer(seg) {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function detenerTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerDisplay.textContent = "00:00";
}

function iniciarTimer(seg) {
    detenerTimer();
    let restante = seg;
    timerDisplay.textContent = formatearTimer(restante);

    timerInterval = setInterval(() => {
        restante--;
        if (restante <= 0) {
            timerDisplay.textContent = "¡LISTO!";
            detenerTimer();
            beep();
            return;
        }
        timerDisplay.textContent = formatearTimer(restante);
    }, 1000);
}

function beep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) { }
}

document.querySelectorAll(".timer-btn[data-seg]").forEach(b => {
    b.addEventListener("click", () => iniciarTimer(parseInt(b.dataset.seg)));
});

document.getElementById("timerReset").addEventListener("click", detenerTimer);

/* ========================= */
/* RUTINA DEL DÍA */
/* ========================= */

function getSchedule() {
    return getJSON(gkey("horario"), { ...SEMANA_DEFECTO });
}

function rutinaDeHoy() {
    const day = new Date().getDay();
    return getSchedule()[day] || null;
}

function marcarHoyEnStrip() {
    const strip = document.querySelector(".week-strip");
    if (!strip) return;
    // getDay() arranca la semana en domingo (0); el strip va L→D, así que rotamos: dom → índice 6.
    const idx = (new Date().getDay() + 6) % 7;
    strip.querySelectorAll(".week-day").forEach((d, i) => d.classList.toggle("today", i === idx));
    const label = document.getElementById("weekLabel");
    if (label) label.textContent = `HOY · ${DIAS[new Date().getDay()].toUpperCase()}`;
}

function fmtFecha(d) {
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

// Semana (lunes) a la que pertenece una fecha, en horario LOCAL: la racha se calcula
// contra "hoy" local, así que aquí no se usa UTC.
function claveSemana(fechaStr) {
    const d = new Date(fechaStr + "T00:00:00");
    const dia = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dia);
    return fmtFecha(d);
}

// Semanas consecutivas con entrenamiento, contando la actual si ya entrenaste en ella.
function rachaSemanas() {
    const historial = getJSON(gkey("historial"), []);
    const semanas = new Set(historial.map(e => (e.fecha ? claveSemana(e.fecha) : null)));
    const hoy = new Date();
    let cursor = semanas.has(claveSemana(fmtFecha(hoy))) ? 0 : 1;
    let racha = 0;
    while (cursor < 1040) {
        const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - cursor * 7);
        if (semanas.has(claveSemana(fmtFecha(fecha)))) {
            racha++;
        } else {
            break;
        }
        cursor++;
    }
    return racha;
}

function mostrarRacha() {
    const rachaEl = document.getElementById("rachaText");
    if (!rachaEl) return;
    const racha = rachaSemanas();
    rachaEl.textContent = racha > 0
        ? `Racha · ${racha} semana${racha === 1 ? "" : "s"}`
        : "Entrena esta semana";
}

function mostrarDia() {
    const key = rutinaDeHoy();
    marcarHoyEnStrip();
    mostrarRacha();

    if (!key) {
        diaNombre.textContent = `${DIAS[new Date().getDay()]} — DESCANSO`;
        diaDesc.textContent = "Hoy no tienes entrenamiento programado. Recupera y vuelve mañana.";
        diaEntrenar.style.display = "none";
        return;
    }

    diaEntrenar.style.display = "inline-flex";

    const data = obtenerRutina(key);
    if (!data) {
        diaNombre.textContent = `${DIAS[new Date().getDay()]} — DESCANSO`;
        diaDesc.textContent = "La rutina de hoy ya no existe. Edita tu horario.";
        diaEntrenar.style.display = "none";
        return;
    }

    diaNombre.textContent = `${DIAS[new Date().getDay()]} — ${data.nombre}`;
    diaDesc.textContent = data.desc;
    diaEntrenar.dataset.rutina = key;
}

diaEntrenar.addEventListener("click", () => {
    if (!isLogged()) {
        showToast("Debes iniciar sesión primero", "error");
        loginModal.classList.add("active");
        return;
    }
    abrirModal(diaEntrenar.dataset.rutina);
});

/* ========================= */
/* RUTINA PERSONALIZADA */
/* ========================= */

newRutinaBtn.addEventListener("click", () => {
    rutinaEditando = null;
    newRutinaTitle.textContent = "Crear rutina";
    newRutinaName.value = "";
    newRutinaEjercicios.value = "";
    newRutinaModal.classList.add("active");
});

function abrirEditorRutina(key) {
    const data = obtenerRutina(key);
    if (!data) return;

    const custom = getCustomRutinas();
    rutinaEditando = custom[key] ? key : null;

    newRutinaTitle.textContent = rutinaEditando ? "Editar rutina" : "Clonar rutina";
    newRutinaName.value = data.nombre;
    newRutinaEjercicios.value = data.ejercicios
        .map(e => `${e.nombre} ${e.series}x${e.repeticiones}`)
        .join("\n");

    newRutinaModal.classList.add("active");
}

closeNewRutina.addEventListener("click", () => {
    newRutinaModal.classList.remove("active");
    rutinaEditando = null;
});

window.addEventListener("click", (e) => {
    if (e.target === newRutinaModal) {
        newRutinaModal.classList.remove("active");
        rutinaEditando = null;
    }
});

newRutinaSubmit.addEventListener("click", () => {
    const nombre = newRutinaName.value.trim();
    const lineas = newRutinaEjercicios.value
        .split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");

    if (nombre === "" || lineas.length === 0) {
        showToast("Completa el nombre y al menos un ejercicio", "error");
        return;
    }

    const ejercicios = lineas.map(linea => {
        const match = linea.match(/^(.*?)\s*(\d+)\s*[xX]\s*(\d+)\s*$/);
        if (match) {
            return {
                nombre: match[1].trim(),
                series: parseInt(match[2]),
                repeticiones: parseInt(match[3])
            };
        }
        return { nombre: linea, series: 3, repeticiones: 12 };
    });

    const custom = getCustomRutinas();
    const esEdicion = rutinaEditando !== null;
    const key = rutinaEditando || ("custom-" + Date.now());

    custom[key] = {
        nombre: nombre.toUpperCase(),
        desc: `${ejercicios.length} ejercicios`,
        ejercicios,
        extras: (custom[key] && custom[key].extras) || []
    };
    setJSON(gkey("rutinas"), custom);

    newRutinaName.value = "";
    newRutinaEjercicios.value = "";
    rutinaEditando = null;
    newRutinaModal.classList.remove("active");
    renderCards();
    showToast(esEdicion ? "Rutina actualizada" : "Rutina creada", "ok");
});

/* ========================= */
/* HORARIO SEMANAL */
/* ========================= */

function abrirHorario() {
    const schedule = getSchedule();
    const rutinas = todasLasRutinas();

    horarioList.innerHTML = "";

    DIAS.forEach((dia, dayIndex) => {
        const row = document.createElement("div");
        row.className = "horario-row";

        const lbl = document.createElement("span");
        lbl.className = "horario-dia";
        lbl.textContent = dia;

        const select = document.createElement("select");

        const optDescanso = document.createElement("option");
        optDescanso.value = "";
        optDescanso.textContent = "Descanso";
        select.appendChild(optDescanso);

        for (const key in rutinas) {
            const opt = document.createElement("option");
            opt.value = key;
            opt.textContent = rutinas[key].nombre;
            select.appendChild(opt);
        }

        select.value = schedule[dayIndex] || "";
        row.appendChild(lbl);
        row.appendChild(select);
        horarioList.appendChild(row);
    });

    horarioModal.classList.add("active");
}

horarioBtn.addEventListener("click", (e) => {
    e.preventDefault();
    abrirHorario();
});

closeHorario.addEventListener("click", () => {
    horarioModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === horarioModal) {
        horarioModal.classList.remove("active");
    }
});

horarioSubmit.addEventListener("click", () => {
    const nuevo = {};
    Array.from(horarioList.children).forEach((row, dayIndex) => {
        const value = row.querySelector("select").value;
        nuevo[dayIndex] = value === "" ? null : value;
    });
    setJSON(gkey("horario"), nuevo);
    horarioModal.classList.remove("active");
    mostrarDia();
    showToast("Horario actualizado", "ok");
});

/* ========================= */
/* PERFIL */
/* ========================= */

function getPerfil() {
    return getJSON(gkey("perfil"), {});
}

function mostrarPerfil() {
    const perfil = getPerfil();

    if (perfil.objetivo || perfil.altura) {
        const partes = [];
        if (perfil.objetivo) {
            partes.push(`Objetivo: ${OBJETIVOS[perfil.objetivo] || perfil.objetivo}`);
        }
        if (perfil.altura) {
            partes.push(`${perfil.altura} cm`);
        }
        perfilLine.textContent = partes.join(" · ");
        perfilLine.style.display = "block";
    } else {
        perfilLine.textContent = "";
        perfilLine.style.display = "none";
    }
}

function abrirPerfil() {
    const perfil = getPerfil();
    perfilObjetivo.value = perfil.objetivo || "fuerza";
    perfilAltura.value = perfil.altura || "";
    perfilModal.classList.add("active");
}

perfilBtn.addEventListener("click", (e) => {
    e.preventDefault();
    abrirPerfil();
});

closePerfil.addEventListener("click", () => {
    perfilModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === perfilModal) {
        perfilModal.classList.remove("active");
    }
});

perfilSubmit.addEventListener("click", () => {
    const altura = parseFloat(perfilAltura.value);

    setJSON(gkey("perfil"), {
        objetivo: perfilObjetivo.value,
        altura: isNaN(altura) || altura <= 0 ? null : altura
    });

    perfilModal.classList.remove("active");
    mostrarPerfil();
    showToast("Perfil guardado", "ok");
});

/* ========================= */
/* EXPORTAR / IMPORTAR */
/* ========================= */

/* Recordatorio periódico de backup */
const BACKUP_INTERVAL_DIAS = 14;
const BACKUP_MAX_SESIONES = 5;

function getBackupUltimo() {
    return parseInt(localStorage.getItem(gkey("backup")) || "0", 10);
}

function getBackupConteo() {
    return parseInt(localStorage.getItem(gkey("backupCount")) || "0", 10);
}

function marcarBackup() {
    localStorage.setItem(gkey("backup"), Date.now().toString());
    localStorage.setItem(gkey("backupCount"), "0");
}

function revisarBackup() {
    if (!isLogged()) return;

    const dias = (Date.now() - getBackupUltimo()) / (1000 * 60 * 60 * 24);

    if (dias >= BACKUP_INTERVAL_DIAS || getBackupConteo() >= BACKUP_MAX_SESIONES) {
        confirmarAccion(
            "Hace tiempo no exportas tu backup. Tu historial solo vive en este navegador. ¿Descargarlo ahora?",
            () => {
                exportarDatos();
                showToast("Backup descargado", "ok");
            },
            { title: "Recordatorio de backup", okText: "Descargar", cancelText: "Ahora no" }
        );
    }
}

function exportarDatos() {
    const datos = {};
    ["users", "loggedIn", "currentUser"].forEach(k => {
        if (localStorage.getItem(k) !== null) {
            datos[k] = localStorage.getItem(k);
        }
    });
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("gm:")) {
            datos[key] = localStorage.getItem(key);
        }
    }

    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `gym-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);

    marcarBackup();
}

function importarDatos(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const datos = JSON.parse(reader.result);
            for (const k in datos) {
                localStorage.setItem(k, datos[k]);
            }
            showToast("Datos importados", "ok");
            setTimeout(() => location.reload(), 800);
        } catch (e) {
            showToast("Archivo inválido", "error");
        }
    };
    reader.readAsText(file);
}

exportBtn.addEventListener("click", exportarDatos);

importBtn.addEventListener("click", () => {
    importFile.click();
});

importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        importarDatos(file);
    }
    e.target.value = "";
});

/* ========================= */
/* ANIMACIÓN SCROLL CARDS */
/* ========================= */

function mostrarCards() {
    const triggerBottom = window.innerHeight * 0.85;
    document.querySelectorAll(".card").forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < triggerBottom) {
            card.classList.add("show");
        }
    });
}

window.addEventListener("scroll", mostrarCards);

/* ========================= */
/* AUTENTICACIÓN */
/* ========================= */

loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginModal.classList.add("active");
});

registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.add("active");
});

heroCta.addEventListener("click", (e) => {
    e.preventDefault();
    registerModal.classList.add("active");
});

ctaFinalBtn.addEventListener("click", () => {
    registerModal.classList.add("active");
});

closeLogin.addEventListener("click", () => {
    loginModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove("active");
    }
});

loginSubmit.addEventListener("click", () => {
    const username = loginUser.value.trim();
    const password = loginPass.value.trim();

    const users = getUsers();
    const userFound = users.find(
        u => u.username === username && u.password === password
    );

    if (userFound) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", username);

        loginModal.classList.remove("active");

        updateNavbar();
        checkAuth();
        renderCards();
        mostrarDia();

        showToast("Login exitoso", "ok");
    } else {
        showToast("Credenciales incorrectas", "error");
    }
});

function updateNavbar() {
    const username = currentUser();

    if (isLogged() && username) {
        userDisplay.textContent = `Hola, ${username}`;
        userDisplay.style.display = "inline-block";
    } else {
        userDisplay.textContent = "";
        userDisplay.style.display = "none";
    }
}

window.addEventListener("load", () => {
    updateNavbar();
    checkAuth();
    mostrarCards();
});

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedIn");
    updateNavbar();
    checkAuth();
});

function checkAuth() {
    const logged = isLogged();

    landingView.style.display = logged ? "none" : "block";
    appView.style.display = logged ? "block" : "none";

    publicNav.style.display = logged ? "none" : "flex";
    appNav.style.display = logged ? "flex" : "none";

    if (logged) {
        renderCards();
        mostrarDia();
        mostrarPerfil();
        mostrarCards();
        revisarBackup();
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
    const password2 = document.getElementById("registerPass2").value.trim();

    if (username === "" || password === "" || password2 === "") {
        showToast("Completa todos los campos", "error");
        return;
    }

    if (password.length < 4) {
        showToast("La contraseña debe tener al menos 4 caracteres", "error");
        return;
    }

    if (password !== password2) {
        showToast("Las contraseñas no coinciden", "error");
        return;
    }

    let users = getUsers();

    const exists = users.find(u => u.username === username);

    if (exists) {
        showToast("El usuario ya existe", "error");
        return;
    }

    users.push({ username, password });
    saveUsers(users);

    showToast("Registro exitoso", "ok");

    document.getElementById("registerUser").value = "";
    document.getElementById("registerPass").value = "";
    document.getElementById("registerPass2").value = "";

    registerModal.classList.remove("active");
    loginModal.classList.add("active");
});

/* ========================= */
/* CIERRE CON ESCAPE */
/* ========================= */

registrarCierre("modal", cerrarModal);
registrarCierre("loginModal", () => loginModal.classList.remove("active"));
registrarCierre("registerModal", () => registerModal.classList.remove("active"));
registrarCierre("newRutinaModal", () => newRutinaModal.classList.remove("active"));
registrarCierre("horarioModal", () => horarioModal.classList.remove("active"));
registrarCierre("perfilModal", () => perfilModal.classList.remove("active"));
