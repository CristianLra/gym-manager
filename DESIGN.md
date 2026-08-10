---
name: Gym Manager
description: Tu rutina. Tus reglas.
colors:
  fuego: "#FF5A1F"
  fuego-fuerte: "#FF6A33"
  limon: "#C7FF4D"
  night-bg: "#0B0B0C"
  night-alt: "#141412"
  night-card: "#1B1A17"
  ivory-text: "#F4F1E8"
  slate-muted: "#9A9386"
  slate-2: "#6D675D"
  hairline: "#2B2925"
  line-strong: "#3A372F"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "clamp(1.75rem, 4vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    textTransform: "uppercase"
  body:
    fontFamily: "Sora, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.8125rem"
    letterSpacing: "0.05em"
    textTransform: "uppercase"
rounded:
  sharp: "2px"
  card: "6px"
  pill: "20px"
spacing:
  wrap: "1180px"
  gutter: "32px"
  section-y: "100px"
easing:
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
components:
  button-primary:
    backgroundColor: "{colors.fuego}"
    textColor: "{colors.night-bg}"
    rounded: "{rounded.sharp}"
    typography: "uppercase 0.8125rem 700 0.04em Sora"
    padding: "13px 26px"
  button-primary-hover:
    backgroundColor: "{colors.limon}"
  button-ghost:
    textColor: "{colors.ivory-text}"
    rounded: "{rounded.sharp}"
    typography: "uppercase 0.8125rem 700 0.04em Sora"
    padding: "13px 26px"
  card:
    backgroundColor: "{colors.night-alt}"
    rounded: "{rounded.sharp}"
    padding: "34px 28px"
  input:
    backgroundColor: "{colors.night-bg}"
    textColor: "{colors.ivory-text}"
    rounded: "{rounded.sharp}"
    padding: "14px"
---

# Design System: Gym Manager

## Overview

**Creative North Star: "La Sala de Pesas en la Oscuridad"**

Gym Manager es una PWA de registro de entrenamiento que se expresa como la sala de pesas vacía a última hora de la noche: superficies profundas y cálidas (nunca negro puro), una sola chispa de naranja quemado que marca lo accionable, y un amarillo lima reservado para los momentos de logro (nuevo PR, racha, registro completado). El lenguaje es brutalista de precisión: rejillas de 1px de separación con cabeceras en Archivo Black en mayúsculas y etiquetas técnicas en IBM Plex Mono. La densidad es alta y ordenada: todo es escaneable, nada está decorado por decorar. La identidad es de taller de fuerza, no de startup SaaS.

**Key Characteristics:**
- Oscuro cálido profundo sobre neutros tinteados, nunca gris puro ni negro `#000`.
- Brutalismo sutil: bordes de 1px y rejillas con separación de 1px en lugar de sombras de tarjeta.
- Tipografía de tres voces: Archivo Black (display), Sora (UI/body), IBM Plex Mono (datos y etiquetas).
- Un solo acento accionable (naranja quemado) + un acento de logro (lima). Nada de degradados morados/azules.
- Microinteracciones con curvas spring en elementos interactivos.
- Video de fondo 16:9 en el hero y banner cinematográfico con overlay oscuro; sin audio, con fallback estático para `prefers-reduced-motion`.

## Colors

Paleta cálida y profunda con dos acentos de alto impacto y una escala de neutros tinteados hacia marfil.

### Primary
- **Fuego / Naranja Quemado** (#FF5A1F): el acento accionable. Botones primarios, estado "hoy" en la semana, progreso de sesión, selección de texto, `data-seg` del temporizador, foco de campos y numeración de rutinas.
- **Fuego Fuerte** (#FF6A33, `--accent-strong`): variante brillante del acento para hover y estados activos.

### Secondary
- **Limón / Verde Lima** (#C7FF4D): acento de logro y éxito. Nuevo PR, racha de semanas, sesión completada, toasts "ok"/"pr", badge de usuario, checkbox completado.

### Neutral
- **Noche Profunda** (#0B0B0C, `--bg`): fondo base de página.
- **Noche Alterna** (#141412, `--bg-alt`): superficie de tarjetas, paneles laterales y bloques.
- **Noche Elevada** (#1B1A17, `--bg-card`): superficie modal y tarjetas en hover.
- **Marfil** (#F4F1E8, `--text`): texto principal, cálido y de alto contraste.
- **Pizarra Apagada** (#9A9386, `--muted`): texto secundario / muted.
- **Pizarra Apagada 2** (#6D675D, `--muted-2`): texto terciario / estados deshabilitados.
- **Hairline** (#2B2925, `--line`): bordes y separadores de 1px.
- **Hairline Fuerte** (#3A372F, `--line-strong`): bordes en hover y líneas acentuadas.
- **Fuego Suave** (#3A1F12, `--accent-soft`): tinte de hover en bordes de ejercicios.

### Named Rules
**La Regla de la Doble Llama.** Fuego es para actuar, Limón es para lograr. Nunca ambos en la misma acción: un botón primario nunca es verde lima a menos que confirme un éxito. La combinación Fuego + Limón se reserva a estados (PR, racha, guardado) y a la "tarjeta mock" del hero.

## Typography

**Display Font:** Archivo Black (fallback sans-serif)
**Body Font:** Sora (fallback sans-serif)
**Label/Mono Font:** IBM Plex Mono (fallback monospace)

**Character:** Energía de cartel deportivo (Archivo Black, todo en mayúsculas, condensado) apoyada en una UI neutra y legible (Sora, pesos 400–700) y en un mono técnico para lo que se mide: series, pesos, fechas, rachas y etiquetas.

### Hierarchy
- **Display** (Archivo Black, 400, `clamp(1.75rem,4vw,6.5rem)`, line-height 0.9, tracking -0.03em, uppercase): h1 de hero, títulos de sección grandes, nombre de la rutina del día.
- **Title** (Sora, 700, `1.0625rem`–`1.5rem`, uppercase en tarjetas/rutinas): títulos de tarjetas de rutina, cabeceras de bloque, historial.
- **Body** (Sora, 400/500, `0.875rem`–`1rem`, line-height 1.6, max ~65ch): descripciones y textos de soporte, siempre en Marfil o Pizarra Apagada.
- **Label** (IBM Plex Mono, `0.6875rem`–`0.8125rem`, uppercase, tracking 0.05–0.12em): eyebrows, etiquetas de campo, días de la semana, `set-num`, timestamps.

### Named Rules
**La Regla del Mono que Mide.** IBM Plex Mono se usa solo para datos y medición (series, pesos, fechas, rachas, contadores) y para etiquetas de sistema. Nunca para prosa.

## Layout

Contenedor `.wrap` de 1180px con gutter de 32px (20px en móvil). Secciones con padding vertical de 100px (70px en móvil) y cabeceras de sección apiladas a la izquierda. Patrones dominantes:

- Rejillas "brutalistas": `.cards`, `.steps`, `.features-grid`, `.historial-list` con `gap: 1px` sobre fondo `hairline` y celdas sobre `night-alt` — la separación es la línea, no la sombra.
- Páginas de datos (historial): dos columnas de gráficas (`.progreso-grid`) + lista acordeón de sesiones.
- Rutina del día: dos columnas asimétricas `1.4fr / 0.6fr` con el panel de semana a la derecha.
- Navbar sticky de 76px con `backdrop-filter: blur(8px)` sobre `rgba(11,11,12,.85)`.
- Responsive: a ≤860px todo colapsa a una columna; el `.nav-links` desaparece; a ≤480px gutter 20px y tipografía reducida.

## Elevation & Depth

Sistema prácticamente plano: la profundidad se construye con **tonal layering** (night-bg → night-alt → night-card) y bordes hairline de 1px, no con sombras. Las pocas sombras reales son profundas, difusas y ambientales, reservadas a elementos flotantes:

- **Sombras flotantes** (`box-shadow: 0 50px 100px -30px rgba(0,0,0,.8)`): mock-card del hero y toasts (`0 20px 50px -20px rgba(0,0,0,.8)`).
- **Menús desplegables** (`0 12px 32px rgba(0,0,0,.45)`): lista de peso.

### Named Rules
**La Regla Plana por Defecto.** En reposo las superficies son planas (borde hairline + tinte tonal). La sombra aparece solo en elementos que flotan sobre el contenido (modales, toasts, dropdowns). Un halo de color con offset cero está prohibido.

## Shapes

Lenguaje angular con una escala de radios documentada: **sharp** (2px) para todo lo interactivo (botones, inputs, checkboxes), **card** (6px) para modales y tarjetas de superficie, **pill** (20px) para chips y badges. La regla es "botones y campos rectos, badges y tags en píldora". Checkboxes cuadrados (2px) con check dibujado en CSS.

## Components

### Buttons
- **Shape:** sharp (2px), borde de 1px.
- **Primary:** fondo Fuego, texto Noche Profunda, padding `13px 26px`, uppercase, 700, tracking 0.04em. Hover: `translateY(-2px)` y transición spring. Estado `:active`: presionar hacia abajo.
- **Ghost:** transparente con borde hairline, texto Marfil. Hover: borde Marfil.
- **Feedback:** transición `transform 0.2s var(--ease-spring)`, `background 0.25s var(--ease-out)`.

### Chips / Tags
- **Style:** pill (20px), mono, borde hairline, texto Pizarra Apagada. Variantes de logro en Limón (badge PR, racha).

### Cards / Containers
- **Corner Style:** sharp a nivel de rejilla; `night-alt` sobre separador hairline.
- **Background:** night-alt (night-card en hover).
- **Shadow Strategy:** ninguna en reposo (ver Elevación). Los contenedores "sueltos" (modal, mock-card) usan card (6px) + sombra flotante.
- **Internal Padding:** `34px 28px` en tarjetas de rejilla; `26px–36px` en bloques.

### Inputs / Fields
- **Style:** fondo Noche Profunda, borde hairline 1px, radio sharp, texto Marfil, padding 14px.
- **Focus:** borde Fuego + `box-shadow: 0 0 0 1px var(--accent)`.
- **Inline data inputs (sets):** filas sin fondo con `border-bottom` transparente que se ilumina en Fuego al enfocar.

### Navigation
- **Style:** navbar sticky con blur, logo Archivo Black con punto Fuego, links uppercase 600 con hover Marfil. Estado usuario: badge pill Limón en mono.

### Modal
- **Shape:** card (6px), max-width 800px (420px en auth), padding 36px.
- **Backdrop:** `rgba(0,0,0,.8)` + `backdrop-filter: blur(6px)`.
- **Motion:** entra con spring `scale(0.94 → 1)` + opacity; sale más rápido (0.22s ease-out).

### Modal de sesión (registro de sets)
- Ejercicios como ítems con checkbox cuadrado y rejilla de sets `auto-fill minmax(150px,1fr)`.
- Cada set es una fila con número mono + inputs kg/reps sin borde.
- Ejercicio completado: opacity 0.75 + título tachado en Pizarra.
- Temporizador: display mono 42px `tabular-nums`, botones 60/90/120s, stop en Fuego.

### Historial (acordeón)
- Lista con separadores de 1px; cabecera expandible con nombre (uppercase), fecha mono y resultado (Limón).
- Detalle: filas de ejercicios con sets en mono (`72.5kg × 8 · 40kg × 10`), separador dashed hairline.

## Media & Motion (video)

Los videos son decorativos (`aria-hidden="true"`), muteados, en loop y sin controles. Se recortan a 16:9 con `object-fit: cover`, `object-position: center` y un ligero `scale(1.02)` para evitar bordes por el blur.

- **Hero (index.html):** video de fondo `assets/videos/hero-bg.mp4` con `filter: blur(2px) brightness(.85)` y overlay `rgba(0,0,0,.55)`. No usa `poster`: entra con fade-in (`videoFadeIn`, 0.8s `--ease-out` + delay 0.15s) desde `opacity:0` para evitar el parpadeo de imagen al cargar. El contenido del hero va en `.hero-grid` con `z-index:1` sobre el video.
- **Banner cinematográfico:** sección `.video-banner` entre Características y Progreso, video `assets/videos/banner-progreso.mp4` (recomendado ≤1080p para no lastrar la PWA), overlay degradado neutro hacia la izquierda (texto a la izquierda), `blur(2px) brightness(.8)`, padding `150px` (100px en móvil).
- **Accesibilidad:** con `prefers-reduced-motion` los `<video>` se ocultan y las secciones muestran `assets/images/hero-poster.jpg` como fondo estático.

### Named Rules
**La Regla del Video Silencioso.** El video nunca lleva audio, nunca tiene controles y siempre tiene un fallback estático: sin video cargado o con movimiento reducido, la foto (poster) es el fondo. Los clips deben ser cortos (5–10s de loop) y ligeros (ideal <4MB el hero).

## Do's and Don'ts

### Do:
- **Do** usar Fuego solo para lo accionable o lo "de hoy"; reservar Limón para logros y éxito.
- **Do** construir separación con rejillas de 1px y tintes tonales; las sombras son solo para capas flotantes.
- **Do** usar Archivo Black en mayúsculas para display y IBM Plex Mono para todo dato medible.
- **Do** mantener los botones rectos (2px) y los badges en píldora (20px): la escala de radios es fija.
- **Do** respetar la regla de la doble llama: nunca Fuego y Limón en la misma acción.

### Don't:
- **Don't** usar negro puro (#000) ni grises fríos puros: los neutros van tinteados hacia marfil.
- **Don't** usar degradados morados/azules ni brillos neón externos.
- **Don't** anidar tarjetas dentro de tarjetas: la elevación se hace por tintes y líneas.
- **Don't** usar mono para prosa ni emojis en lugar de íconos consistentes.
- **Don't** animar propiedades de layout (top/left/width/height); animar solo transform y opacity con las curvas `--ease-out` / `--ease-spring`.
- **Don't** superar los 300ms en animaciones de UI ni usar `ease-in` en entrada de elementos.
