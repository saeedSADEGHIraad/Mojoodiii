const CACHE_NAME='ganjineh-v13-6';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./favicon.ico'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;e.respondWith((async()=>{const u=new URL(r.url);if(u.origin===self.location.origin){const c=await caches.match(r);if(c)return c;const resp=await fetch(r);const ch=await caches.open(CACHE_NAME);ch.put(r,resp.clone());return resp;}else{try{const resp=await fetch(r);const ch=await caches.open(CACHE_NAME);ch.put(r,resp.clone());return resp;}catch(err){const c=await caches.match(r);if(c)return c;throw err;}}})())});
