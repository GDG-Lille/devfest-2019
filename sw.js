const cacheName = 'devfestlille';

const filesToCache = [
  '/',
  '/js/load.js',
  '/css/main.css',
  '/css/queries.css',
  '/css/vars.css',
  '/css/barlowsemicondensed-bold-webfont.woff',
  '/css/barlowsemicondensed-italic-webfont.woff',
  '/css/barlowsemicondensed-regular-webfont.woff',
  '/css/boogaloo-regular-webfont.woff',
  '/css/boogaloo-regular-webfont.woff2',
  '/img/logo.svg',
  '/img/logo-big.svg',
  '/img/vase.svg',
  '/img/hifi.svg',
  '/img/tablet.svg'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
