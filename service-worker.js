const CACHE_NAME = 'timetable-v1';

const ASSETS = [
    '/',
    './index.html',
    './app.js',
    './manifest.json',
    '/timetable/timetable.json'
];

// Install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

// Activate
self.addEventListener('activate', event => {
    event.waitUntil(
        self.clients.claim()
    );
});

// Fetch (offline support)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});

// Notify
self.addEventListener('message', event => {
    if (event.data?.type === 'NOTIFY') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body
        });
    }
});