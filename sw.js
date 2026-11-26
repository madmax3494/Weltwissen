// Weltwissen, Webapp-Fassung: legt das Spiel einmal auf dem Gerät ab, damit es ohne Netz startet.
// Abgelegt werden nur die Programmdateien unten. Der Spielstand liegt getrennt davon im Speicher des Browsers.
const STAND = '45b4236ebbf9d9ea';
const ABLAGE = 'weltwissen-' + STAND;
const DATEIEN = ['./', 'manifest.webmanifest', 'symbol-180.png', 'symbol-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(ABLAGE).then((c) => c.addAll(DATEIEN.map((d) => new Request(d, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('weltwissen-') && k !== ABLAGE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('/aktuelles.json')) return;   // die wöchentliche Lieferung immer frisch aus dem Netz; das Spiel merkt sich die letzte selbst
  const ziel = e.request.mode === 'navigate' || u.pathname.endsWith('/index.html') ? './' : e.request;
  e.respondWith(caches.open(ABLAGE).then((c) => c.match(ziel, { ignoreSearch: true })).then((r) => r || fetch(e.request)));
});
