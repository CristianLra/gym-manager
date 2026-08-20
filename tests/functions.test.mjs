import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

/* ========================= */
/* MOCK: localStorage + helpers */
/* ========================= */

const store = {};

global.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i],
};

function currentUser() {
    return localStorage.getItem("currentUser") || "";
}

function gkey(suffix) {
    return `gm:${currentUser()}:${suffix}`;
}

function getJSON(key, fallback) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch {
        return fallback;
    }
}

function setJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

/* ========================= */
/* FUNCIONES BAJO TEST       */
/* ========================= */

function fmtFecha(d) {
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

function claveSemana(fechaStr) {
    const d = new Date(fechaStr + "T00:00:00");
    const dia = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dia);
    return fmtFecha(d);
}

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

/* ========================= */
/* TESTS                      */
/* ========================= */

function setupUser(user) {
    localStorage.setItem("currentUser", user);
    localStorage.setItem("loggedIn", "true");
}

function clearStore() {
    for (const k of Object.keys(store)) delete store[k];
}

/* ---- mejoresSetsHistorial ---- */

describe("mejoresSetsHistorial", () => {
    it("devuelve el mayor peso por ejercicio", () => {
        const historial = [
            { ejercicios: [{ nombre: "Press banca", sets: [{ peso: 60 }, { peso: 65 }] }] },
            { ejercicios: [{ nombre: "Press banca", sets: [{ peso: 70 }, { peso: 62.5 }] }] },
        ];
        const resultado = mejoresSetsHistorial(historial);
        assert.equal(resultado["Press banca"], 70);
    });

    it("ignora ejercicios sin peso numérico", () => {
        const historial = [
            { ejercicios: [{ nombre: "Plancha", sets: [{ peso: "" }, { reps: 60 }] }] },
        ];
        const resultado = mejoresSetsHistorial(historial);
        assert.equal(Object.keys(resultado).length, 0);
    });

    it("maneja historial vacío", () => {
        assert.deepEqual(mejoresSetsHistorial([]), {});
    });

    it("maneja entradas sin campo ejercicios", () => {
        const historial = [
            { fecha: "2026-08-01", nombre: "Test" },
            { ejercicios: null },
        ];
        assert.deepEqual(mejoresSetsHistorial(historial), {});
    });

    it("multiples ejercicios en una sesión", () => {
        const historial = [
            {
                ejercicios: [
                    { nombre: "Press banca", sets: [{ peso: 80 }] },
                    { nombre: "Press militar", sets: [{ peso: 50 }] },
                ],
            },
        ];
        const resultado = mejoresSetsHistorial(historial);
        assert.equal(resultado["Press banca"], 80);
        assert.equal(resultado["Press militar"], 50);
    });
});

/* ---- rachaSemanas ---- */

describe("rachaSemanas", () => {
    beforeEach(() => {
        clearStore();
        setupUser("testuser");
    });

    it("devuelve 0 sin historial", () => {
        assert.equal(rachaSemanas(), 0);
    });

    it("cuenta 1 semana con entrenamiento esta semana", () => {
        const hoy = fmtFecha(new Date());
        setJSON(gkey("historial"), [{ fecha: hoy }]);
        assert.equal(rachaSemanas(), 1);
    });

    it("cuenta racha de 3 semanas consecutivas", () => {
        const hoy = new Date();
        const historial = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date(hoy);
            d.setDate(d.getDate() - i * 7);
            historial.push({ fecha: fmtFecha(d) });
        }
        setJSON(gkey("historial"), historial);
        assert.equal(rachaSemanas(), 3);
    });

    it("rompe racha si falta una semana", () => {
        const hoy = new Date();
        const historial = [];
        // Esta semana
        historial.push({ fecha: fmtFecha(hoy) });
        // Saltar 1 semana, ir a la anterior
        const d = new Date(hoy);
        d.setDate(d.getDate() - 14);
        historial.push({ fecha: fmtFecha(d) });
        setJSON(gkey("historial"), historial);
        assert.equal(rachaSemanas(), 1);
    });
});

/* ---- getProgresoEjercicios ---- */

describe("getProgresoEjercicios", () => {
    beforeEach(() => {
        clearStore();
        setupUser("testuser");
    });

    it("agrupa mejor set por ejercicio y fecha", () => {
        setJSON(gkey("historial"), [
            {
                fecha: "2026-08-01",
                ejercicios: [{ nombre: "Press banca", sets: [{ peso: 60 }, { peso: 65 }] }],
            },
            {
                fecha: "2026-08-08",
                ejercicios: [{ nombre: "Press banca", sets: [{ peso: 70 }] }],
            },
        ]);
        const resultado = getProgresoEjercicios();
        assert.equal(resultado["Press banca"].length, 2);
        assert.equal(resultado["Press banca"][0].peso, 65);
        assert.equal(resultado["Press banca"][1].peso, 70);
    });

    it("devuelve objeto vacío sin historial", () => {
        assert.deepEqual(getProgresoEjercicios(), {});
    });

    it("ignora ejercicios sin peso válido", () => {
        setJSON(gkey("historial"), [
            {
                fecha: "2026-08-01",
                ejercicios: [{ nombre: "Plancha", sets: [{ reps: 60 }] }],
            },
        ]);
        assert.deepEqual(getProgresoEjercicios(), {});
    });
});
