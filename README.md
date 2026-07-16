# Copa ANIN 2026

Aplicación web de inscripción para la Copa ANIN Arequipa 2026.

## Flujo de inscripción

- Valida datos del equipo, delegado y jugadores.
- Prepara un mensaje completo dirigido al WhatsApp oficial **+51 942 899 919**.
- La inscripción se considera recibida cuando el participante envía el mensaje y este llega a la organización.
- Si se configura `REGISTRATION_ENDPOINT`, la aplicación guarda primero en Google Sheets y luego ofrece enviar la constancia por WhatsApp.
- Si el registro central no está configurado o falla, la aplicación no bloquea el formulario ni muestra una confirmación falsa: activa el envío por WhatsApp como canal oficial.

## Configuración

Edite `assets/js/config.js`:

```js
window.ANIN_CONFIG = {
  REGISTRATION_ENDPOINT: "",
  WHATSAPP_NUMBER: "51942899919"
};
```

Consulte `INSTRUCCIONES_ACTIVACION.txt` para habilitar Google Apps Script.

## Fecha, horario y ubicación confirmados

- Fecha: viernes 17 de julio de 2026.
- Horario de cancha reservada: 8:00 p. m. a 10:00 p. m.
- Local: cancha deportiva **Balón Fuego**.
- Nueva sede: ya no es frente a Makro.
- Ubicación oficial: https://maps.app.goo.gl/oDiJbjf8zxkYyega8
- La aplicación muestra un botón directo a Google Maps y añade estos datos al mensaje de inscripción por WhatsApp.
