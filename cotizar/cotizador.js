"use strict";
// Catálogo oficial publicado en Energeticos2023/YACUSOL/index.html (verificado 08/11/2026).
// Los precios de las otras marcas requieren confirmación comercial: no se presumen iguales.
const CATALOGO_YACUSOL=Object.freeze({120:1700,150:1850,200:2550,250:2800,300:3550,400:4450,500:5700});
const EXTRAS=Object.freeze({magnesio:{nombre:"Barra de magnesio",precio:80},resistencia:{nombre:"Resistencia eléctrica de respaldo",precio:110},valvula:{nombre:"Válvula termostática",precio:350},tanque5:{nombre:"Tanque asistente 5 L",precio:150},tanque10:{nombre:"Tanque asistente 10 L",precio:250},controlador:{nombre:"Controlador TK",precio:450},instalacion:{nombre:"Instalación básica en Huaraz",precio:200}});
const INCLUYE_BASE=["Termotanque de baja presión, marca YACUSOL","Tubos al vacío","Estructura de soporte"];
const EXCLUYE_BASE=["Accesorios de conexión: codos, válvulas, check, pegamento y adaptadores","Tanque asistente","Válvula termostática","Controlador electrónico","Instalación y flete"];
const WA_PUBLICO="51961120481"; // Línea de cotización publicada actualmente en la web de YACUSOL.
const $=id=>document.getElementById(id);
const soles=x=>new Intl.NumberFormat("es-PE",{style:"currency",currency:"PEN",minimumFractionDigits:2}).format(x);
function entrada(){
 const marca=$("marca").value,litros=$("capacidad").value,cantidad=Number($("cantidad").value),
 navidad=$("paquete").value==="navidad"&&marca==="YACUSOL";
 const precioConocido=marca==="YACUSOL"&&Object.prototype.hasOwnProperty.call(CATALOGO_YACUSOL,litros);
 const elegidos=[...document.querySelectorAll('#adicionales input[type="checkbox"]:checked')].map(x=>x.value);
 const extras=precioConocido?elegidos.filter(x=>!(navidad&&["magnesio","resistencia"].includes(x))).map(x=>EXTRAS[x]).filter(Boolean):[];
 const incluye=precioConocido?(navidad?[...INCLUYE_BASE,"Barra de magnesio","Resistencia eléctrica de respaldo"]:[...INCLUYE_BASE]):[];
 for(const e of extras)incluye.push(e.nombre+" (adicional)");
 const excluye=precioConocido?EXCLUYE_BASE.filter(x=>
 !(x==="Tanque asistente"&&extras.some(e=>e.nombre.startsWith("Tanque asistente")))&&
 !(x==="Válvula termostática"&&extras.some(e=>e.nombre==="Válvula termostática"))&&
 !(x==="Controlador electrónico"&&extras.some(e=>e.nombre==="Controlador TK"))&&
 !(x==="Instalación y flete"&&extras.some(e=>e.nombre.startsWith("Instalación")))):[];
 if(precioConocido&&extras.some(e=>e.nombre.startsWith("Instalación"))){const idx=excluye.indexOf("Instalación y flete");if(idx>=0)excluye.splice(idx,1);excluye.push("Flete y trabajos fuera del alcance de instalación básica");}
 const unitario=precioConocido?CATALOGO_YACUSOL[litros]+extras.reduce((sum,e)=>sum+e.precio,0):null;
 return {marca,litros,cantidad,navidad,precioConocido,extras,incluye,excluye,unitario,
 total:precioConocido?Math.round(unitario*cantidad*100)/100:null};
}
function lista(element,items,placeholder){
 element.replaceChildren();
 const values=items.length?items:[placeholder];
 for(const v of values){const li=document.createElement("li");li.textContent=v;element.append(li);}
}
function calcular(){
 const v=entrada();
 const disabled=v.marca!=="YACUSOL";
 $("paquete").disabled=disabled;
 $("adicionales").disabled=disabled;
 if(disabled) {
   $("producto").hidden=true;
 }else{
   $("producto").hidden=false;
   for(const input of document.querySelectorAll('#adicionales input[type="checkbox"]')){
    input.disabled=v.navidad&&["magnesio","resistencia"].includes(input.value);
    if(input.disabled)input.checked=false;
   }
 }
 $("titulo").textContent=v.marca+" · "+(v.litros==="otro"?"capacidad por definir":v.litros+" litros");
 $("precio").textContent=v.precioConocido&&v.cantidad>=1&&v.cantidad<=30?soles(v.total):"Precio por cotizar";
 $("estado").textContent=v.precioConocido?"Precio de referencia publicado, con IGV. "+(v.navidad?"Promoción navideña sujeta a confirmación.":"Equipamiento básico."):"No contamos con una lista de precios validada para esta marca/capacidad. Se solicita cotización personalizada.";
 lista($("incluye"),v.incluye,"Configuración a confirmar según la ficha del fabricante y la oferta comercial.");
 lista($("excluye"),v.excluye,"Exclusiones y servicios a precisar en cotización formal.");
 $("alcance").textContent=v.precioConocido?"Precio base y adicionales provienen de la lista YACUSOL. La promoción no implica instalación gratuita ni disponibilidad inmediata.":"ENERGÉTICOS también comercializa XOLMAX, LUXXOL, INTIPOWER y TERMOINOX. Confirma modelo, presión, capacidad, stock y precio con ventas.";
 return v;
}
function whatsapp(){
 const v=calcular();
 if(!Number.isInteger(v.cantidad)||v.cantidad<1||v.cantidad>30){alert("Indica una cantidad entre 1 y 30.");$("cantidad").focus();return;}
 const ciudad=$("distrito").value.trim(),nombre=$("nombre").value.trim(),personas=$("personas").value;
 const tipo=v.navidad?"Promoción Navidad 2026 (sujeta a confirmación)":"Configuración regular";
 const lines=[
 "Hola, ENERGÉTICOS. Solicito cotización de terma solar.",
 nombre?"Nombre: "+nombre:"",
 "Marca: "+v.marca,
 "Capacidad: "+(v.litros==="otro"?"por definir":v.litros+" litros"),
 "Cantidad: "+v.cantidad,
 v.precioConocido?"Paquete: "+tipo:"",
 ciudad?"Zona de entrega: "+ciudad:"",
 Number(personas)>0?"Usuarios estimados: "+personas:"",
 v.precioConocido?"Incluye: "+v.incluye.join(", "):"",
 v.precioConocido?"No incluye: "+v.excluye.join("; "):"",
 v.precioConocido?"Total referencial publicado (con IGV): "+soles(v.total):"Precio, características y disponibilidad: por confirmar",
 "Por favor confirmar ficha, capacidad, precio final, accesorios, instalación, flete y plazo antes de la compra."
 ].filter(Boolean);
 const query=new URLSearchParams(window.location.search);
 const source=query.get("utm_source"),campaign=query.get("utm_campaign");
 if(source&&/^[a-z0-9_. -]{1,70}$/i.test(source))lines.push("Origen: "+source);
 if(campaign&&/^[a-z0-9_. -]{1,70}$/i.test(campaign))lines.push("Campaña: "+campaign);
 window.open("https://wa.me/"+WA_PUBLICO+"?text="+encodeURIComponent(lines.join("\n")),"_blank","noopener,noreferrer");
}
function init(){
 for(const id of ["marca","capacidad","cantidad","paquete"]){$(id).addEventListener("change",calcular);$(id).addEventListener("input",calcular);}
 $("adicionales").addEventListener("change",e=>{
  if(e.target.value==="tanque5"&&e.target.checked)document.querySelector('#adicionales input[value="tanque10"]').checked=false;
  if(e.target.value==="tanque10"&&e.target.checked)document.querySelector('#adicionales input[value="tanque5"]').checked=false;
  calcular();
 });
 $("cotizador").addEventListener("submit",e=>{e.preventDefault();whatsapp();});
 $("imprimir").addEventListener("click",()=>window.print());
 calcular();
}
if(typeof document!=="undefined"&&document.readyState!=="loading")init();
else if(typeof document!=="undefined")document.addEventListener("DOMContentLoaded",init);
