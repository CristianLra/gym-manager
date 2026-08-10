# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Levantadores individuales que quieren diseñar sus propias rutinas —sin plantillas genéricas— y registrar cada serie con el peso y las repeticiones reales. Usan la app desde el teléfono durante el entrenamiento, con la barra de descanso entre series.

## Product Purpose

Diseñar rutinas de entrenamiento propias y registrar cada set (peso × reps) para que el progreso quede escrito, no memorizado. Éxito = el usuario entrena con su propia planificación y ve su evolución acumulada en gráficas e historial sin necesidad de hojas de cálculo.

## Positioning

Mientras los competidores ofrecen rutinas prearmadas, Gym Manager no tiene plantillas: tú decides qué entrenas, cuándo y cómo lo mides. El plan semanal, el registro por set y el historial son suyos.

## Operating Context

- Uso principal: en el gimnasio, con el teléfono en mano, marcando series entre descansos.
- PWA instalable y offline: debe funcionar sin conexión.
- La rutina del día se elige por horario semanal y el usuario entrena desde el modal de sesión con temporizador de descanso y aviso sonoro.
- Backup manual export/import en JSON con recordatorio periódico (los datos viven en el navegador).

## Capabilities and Constraints

- Cuentas locales con login/registro; la sesión vive en `localStorage` (no es autenticación real ni segura).
- Rutinas por defecto (pecho, espalda, pierna, brazos, hombros, abdomen, full body) + rutinas personalizadas con clonar/editar/eliminar.
- Horario semanal editable día a día (con descansos).
- Modal de sesión: marcar ejercicios, registrar peso/reps por set, progreso parcial, temporizador de descanso.
- Historial de sesiones expandible, seguimiento de peso corporal, progreso por ejercicio (mejor set, Chart.js).
- Perfil: objetivo (fuerza, volumen, pérdida de peso, resistencia, mantener) y altura.
- Exportar/importar backup completo en JSON.
- 100% estático: HTML, CSS y JS vanilla, sin backend. `localStorage` como única persistencia.
- Chart.js vía CDN; service worker para offline.

## Brand Commitments

- Nombre: **Gym Manager**. Tagline: **"Tu rutina. Tus reglas."**
- Copy en español.
- Autor: Cristian, © 2026.

## Evidence on Hand

- Capturas de la app en `docs/screenshots/` (19: landing, rutina del día, historial, horario, modales de auth, perfil, etc.). Referenciadas en README.md.
- Manifest PWA + service worker funcionales.
- No hay testimonios, métricas de clientes ni claims de terceros; no fabricarlos.

## Product Principles

1. **Sin plantillas.** El usuario es el dueño de sus rutinas; las por defecto son puntos de partida clonables.
2. **Los datos son del usuario.** Todo vive en su navegador y es exportable/importable en un JSON.
3. **Mobile-first para entrenar.** Los flujos críticos (sesión, temporizador, registro de sets) deben sentirse rápidos con una mano.
4. **Tecnología simple y estática.** Sin backend; mantenible por una persona.
5. **El registro es la verdad.** Si no se registra, no existe: el historial y las gráficas son la memoria del entrenamiento.

## Accessibility & Inclusion

- Modales con `role="dialog"`, `aria-modal` y etiquetas `sr-only` en campos.
- Cierre con Escape en todos los modales.
- Estados de foco visibles en inputs y checkboxes.
