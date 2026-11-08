/* YACUSOL · Cache aislada por aplicación. La galería privada de clientes nunca se precachea. */
const PREFIX='energeticos-termas-';
const CACHE=PREFIX+'v4-auditoria';
const ASSETS=['./','index.html','styles.css','app.js','manifest.json','icon-192.png','icon-512.png','logo-energeticos.jpg','yacusol-hero.jpg','xolmax-hero.png','luxxol-hero.png','intipower-hero.png','lista-precios-final.png'];
const SCOPE=new URL(self.registration.scope);
function ownRequest(req){
 const u=new URL(req.url);
 return req.method==='GET'&&u.origin===SCOPE.origin&&u.pathname.startsWith(SCOPE.pathname)&&!u.search&&
  !u.pathname.includes('/api/')&&req.credentials!=='include';
}
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>
 Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))
).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(!ownRequest(e.request))return;
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
  if(r.ok&&r.type==='basic'){
   const copy=r.clone();
   e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{}));
  }
  return r;
 }).catch(()=>caches.open(CACHE).then(c=>c.match(e.request)).then(cached=>cached||Response.error())));
});
