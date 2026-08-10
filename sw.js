// Sube esta versión cada vez que toques CSS/JS/HTML: install() reemplaza el cache
// y evita que la PWA siga sirviendo archivos viejos.
const CACHE = "gym-manager-v12";

const ASSETS = [
    "./",
    "./index.html",
    "./entrenamientos.html",
    "./css/styles.css",
    "./js/script.js",
    "./js/data.js",
    "./js/script-entrenamientos.js",
    "./js/ui.js",
    "./manifest.webmanifest",
    "./assets/brand/favicon.svg",
    "./assets/brand/favicon-32.png",
    "./assets/brand/apple-touch-icon.png",
    "./assets/brand/icon-192.png",
    "./assets/brand/icon-512.png",
    "./assets/images/og-image.png",
    "./assets/images/hero-poster.jpg",
    "./assets/videos/hero-bg.mp4",
    "./assets/videos/banner-progreso.mp4",
    "./assets/icons/build.svg",
    "./assets/icons/calendar.svg",
    "./assets/icons/checklist.svg",
    "./assets/icons/export.svg",
    "./assets/icons/timer.svg",
    "./assets/icons/trending-up.svg",
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (e) => {
    const req = e.request;

    if (req.method !== "GET") return;

    const url = new URL(req.url);

    /* Navegación: red primero, fallback al shell cacheado */
    if (url.origin === location.origin && req.mode === "navigate") {
        e.respondWith(
            fetch(req)
                .then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put("./index.html", copy));
                    return res;
                })
                .catch(() => caches.match("./index.html"))
        );
        return;
    }

    /* Mismo origen: cache primero, red como respaldo y para poblar la caché */
    if (url.origin === location.origin) {
        e.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;
                return fetch(req).then(res => {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(req, copy));
                    return res;
                });
            })
        );
        return;
    }

    /* CDN (Chart.js): cache primero, red como respaldo */
    if (url.host === "cdn.jsdelivr.net") {
        e.respondWith(
            caches.match(req).then(cached => {
                if (cached) return cached;
                return fetch(req).then(res => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then(c => c.put(req, copy));
                    }
                    return res;
                }).catch(() => cached);
            })
        );
    }
});
