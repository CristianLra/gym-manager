/* ========================= */
/* BASE DE DATOS DE RUTINAS  */
/* ========================= */

const DIAS = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

const RUTINAS = {
    pecho: {
        nombre: "PECHO",
        desc: "Press banca, aperturas, fondos",
        ejercicios: [
            { nombre: "Press banca", series: 4, repeticiones: 10 },
            { nombre: "Press inclinado", series: 3, repeticiones: 12 },
            { nombre: "Aperturas", series: 3, repeticiones: 15 },
            { nombre: "Fondos", series: 3, repeticiones: 10 }
        ],
        extras: ["Pecho superior", "Pecho inferior", "Pecho con mancuernas"]
    },
    espalda: {
        nombre: "ESPALDA",
        desc: "Dominadas, remo, jalones",
        ejercicios: [
            { nombre: "Dominadas", series: 4, repeticiones: 8 },
            { nombre: "Remo con barra", series: 4, repeticiones: 10 },
            { nombre: "Jalones", series: 3, repeticiones: 12 },
            { nombre: "Remo con mancuerna", series: 3, repeticiones: 10 }
        ],
        extras: ["Espalda alta", "Espalda baja", "Trapecio"]
    },
    pierna: {
        nombre: "PIERNA",
        desc: "Sentadillas, prensa, extensiones",
        ejercicios: [
            { nombre: "Sentadillas", series: 4, repeticiones: 10 },
            { nombre: "Prensa", series: 4, repeticiones: 12 },
            { nombre: "Extensiones", series: 3, repeticiones: 15 },
            { nombre: "Peso muerto rumano", series: 4, repeticiones: 10 }
        ],
        extras: ["Cuádriceps", "Femoral", "Glúteo"]
    },
    brazos: {
        nombre: "BRAZOS",
        desc: "Curl, tríceps, martillo",
        ejercicios: [
            { nombre: "Curl con barra", series: 4, repeticiones: 12 },
            { nombre: "Curl martillo", series: 3, repeticiones: 12 },
            { nombre: "Extensión de tríceps", series: 4, repeticiones: 12 },
            { nombre: "Fondos de tríceps", series: 3, repeticiones: 12 }
        ],
        extras: ["Bíceps", "Tríceps", "Antebrazo"]
    },
    hombros: {
        nombre: "HOMBROS",
        desc: "Press militar, elevaciones",
        ejercicios: [
            { nombre: "Press militar", series: 4, repeticiones: 10 },
            { nombre: "Elevaciones laterales", series: 4, repeticiones: 15 },
            { nombre: "Elevaciones frontales", series: 3, repeticiones: 12 },
            { nombre: "Pájaros", series: 3, repeticiones: 15 }
        ],
        extras: ["Hombro anterior", "Hombro lateral", "Hombro posterior"]
    },
    abdomen: {
        nombre: "ABDOMEN",
        desc: "Crunch, plancha, elevaciones",
        ejercicios: [
            { nombre: "Crunch", series: 4, repeticiones: 20 },
            { nombre: "Plancha", series: 3, repeticiones: 60 },
            { nombre: "Elevación de piernas", series: 3, repeticiones: 15 },
            { nombre: "Russian twist", series: 3, repeticiones: 20 }
        ],
        extras: ["Abdominal superior", "Abdominal inferior", "Oblicuos"]
    },
    fullbody: {
        nombre: "FULL BODY",
        desc: "Todo el cuerpo en una sesión",
        ejercicios: [
            { nombre: "Sentadillas", series: 4, repeticiones: 12 },
            { nombre: "Press banca", series: 4, repeticiones: 10 },
            { nombre: "Remo con barra", series: 4, repeticiones: 10 },
            { nombre: "Curl con barra", series: 3, repeticiones: 12 },
            { nombre: "Plancha", series: 3, repeticiones: 45 }
        ],
        extras: ["Full body A", "Full body B", "Full body C"]
    }
};

/* Horario semanal por defecto (día de la semana -> rutina) */
const SEMANA_DEFECTO = {
    0: "fullbody",
    1: "pecho",
    2: "espalda",
    3: "pierna",
    4: "brazos",
    5: "hombros",
    6: "abdomen"
};
