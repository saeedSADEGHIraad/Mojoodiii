const CACHE_NAME='ganjineh-v13-7';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./favicon.ico'];

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', e => {
	e.waitUntil(
		caches.keys().then(keys => Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))).then(() => self.clients.claim())
	);
});

// Fetch handler: prefer cache, fallback to network. Only cache successful same-origin responses.
self.addEventListener('fetch', e => {
	const r = e.request;
	if (r.method !== 'GET') return;
	e.respondWith((async () => {
		try {
			// Try cache first
			const cached = await caches.match(r);
			if (cached) return cached;

			const response = await fetch(r);

			// Only cache successful (status 200-299) and same-origin responses.
			try {
				if (response && response.ok && new URL(r.url).origin === self.location.origin) {
					const ch = await caches.open(CACHE_NAME);
					ch.put(r, response.clone());
				}
			} catch (cacheErr) {
				// ignore caching errors
			}

			return response;
		} catch (err) {
			// Network failed — try cache fallback
			const cached = await caches.match(e.request);
			if (cached) return cached;
			throw err;
		}
	})());
});
