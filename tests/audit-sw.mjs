import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const code=fs.readFileSync(new URL("../service-worker.js",import.meta.url),"utf8");
const handlers={},deletes=[],saved=[];
const caches={
 keys: async()=>["energeticos-termas-v3-precios-500l","energeticos-termas-v4-auditoria","tecgo-other","energeticos-solicitud-v999","energeticos-termas-third-party","Yacusol-app-private-cache"],
 delete:async(name)=>{deletes.push(name);return true},
 open:async()=>({
  addAll:async()=>{},
  match:async()=>null,
  put:async(req,res)=>{saved.push(req.url);return undefined}
 })
};
const scope="https://energeticos2023.github.io/YACUSOL/";
const self={location:{origin:new URL(scope).origin},registration:{scope},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
const ctx={self,caches,URL,Promise,Response,console,fetch:async(req)=>new Response("ok",{status:200})};
vm.runInNewContext(code,ctx,{filename:"service-worker.js"});
assert(handlers.activate&&handlers.fetch,"Faltan controladores de service worker");
let completion;
handlers.activate({waitUntil:x=>completion=x});
await completion;
assert(deletes.includes("energeticos-termas-v3-precios-500l"),"No eliminó cache vieja propia");
assert(!deletes.some(x=>x!=="energeticos-termas-v3-precios-500l"),"Borró caché de otra app: "+JSON.stringify(deletes));
function request(url){
 let respond,wait;
 const input={url,method:"GET",credentials:"same-origin"};
 handlers.fetch({request:input,respondWith:promise=>respond=promise,waitUntil:p=>wait=p});
 return {respond,wait};
}
assert.equal(request("https://energeticos2023.github.io/OtraApp/").respond,undefined,"Interfiere otra ruta");
assert.equal(request(scope+"api/sensible").respond,undefined,"Cachea API");
assert.equal(request(scope+"index.html?auth=secret").respond,undefined,"Cachea consultas");
assert.equal(request("https://example.com/externo.png").respond,undefined,"Cachea otro dominio");
const own=request(scope+"index.html");
assert(own.respond,"No responde a recursos propios");
const response=await own.respond;
if(own.wait)await own.wait;
assert.equal(response.status,200);
console.log("YACUSOL: cache aislada, solicitudes externas no interceptadas, actualización red primero.");
