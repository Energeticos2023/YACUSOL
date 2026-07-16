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
