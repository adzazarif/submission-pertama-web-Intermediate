// import { precacheAndRoute } from 'workbox-precaching';
// // Do precaching
// precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'simulate-push') {
    const data = event.data.payload;
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  }
});

const CACHE_NAME = 'maricerita-v1';
const urlsToCache = [
  './',
  './index.html',
  './app.bundle.js',
  './app.css',
  './images/hero.png',
  './favicon.png',
  './images/logo.png',
  './manifest.json',
  './sw.bundle.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).catch(() => caches.match('./index.html'))
      );
    })
  );
});
