const CACHE='energeticos-termas-v2-premium-flow';
const ASSETS=['./','index.html','styles.css','app.js','manifest.json','icon-192.png','icon-512.png','logo-energeticos.jpg','yacusol-hero.jpg','xolmax-hero.png','luxxol-hero.png','intipower-hero.png','lista-precios-final.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
