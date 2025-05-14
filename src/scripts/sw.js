self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'simulate-push') {
    const data = event.data.payload;
    self.registration.showNotification(data.title, {
      body: data.body,
    });
  }
});

// async function precacheResources() {
//   const cache = await caches.open('v1');
 
//   await cache.addAll([
//     '/index.html'
//   ]);
// }
 
// self.addEventListener('install', (event) => {
//   event.waitUntil(precacheResources());
// });

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/app.css',
        '/index.html',
        '/app.bundle.js',
        // etc.
      ]);
    }),
  );
});