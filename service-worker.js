const CACHE_NAME = `timetable-${Date.now()}`;

const ASSETS = [
    './',
    './index.html',
    './scripts/app.js',
    './scripts/timetable.js',
    './scripts/utils.js',
    './scripts/lessonCard.js',
    './scripts/pwa.js',
    './manifest.json',
    './data/timetable.json',
    './style.css'
];


// INSTALL
self.addEventListener('install', event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {

            for (const asset of ASSETS) {
                try {
                    await cache.add(asset);
                } catch (e) {
                    console.warn('Cache failed:', asset);
                }
            }
        })
    );
});


// ACTIVATE (cleanup old caches + take control immediately)
self.addEventListener('activate', event => {
    event.waitUntil((async () => {

        const keys = await caches.keys();

        await Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        );

        await self.clients.claim();

        // notify open tabs (important for iOS)
        const clients = await self.clients.matchAll();

        clients.forEach(client => {
            client.postMessage({ type: 'SW_UPDATED' });
        });

    })());
});


// FETCH (network-first for JSON, cache fallback for everything else)
self.addEventListener('fetch', event => {

    const url = new URL(event.request.url);

    // Always fresh timetable data
    if (url.pathname.includes('timetable.json')) {
        event.respondWith(
            fetch(event.request)
                .then(res => {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, clone);
                    });
                    return res;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first for static assets
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});


// NOTIFICATIONS (unchanged)
self.addEventListener('message', event => {
    if (event.data?.type === 'NOTIFY') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body
        });
    }
});