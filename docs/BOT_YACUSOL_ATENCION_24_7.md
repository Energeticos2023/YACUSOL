# YACUSOL | Propuesta de atención y alertas 24/7 (07/11/2026)
**Estado de este documento:** diseño técnico; no habilita por sí solo respuestas automáticas por WhatsApp o Meta.
## Flujo operativo objetivo
1. Mensaje entrante por canal autorizado (WhatsApp Business Platform, Instagram Messaging API, Facebook Messenger API, o proveedor de bandeja omnicanal conectado con permisos).
2. Webhook HTTPS público validado por firma, control de duplicación por ID, protección de credenciales y almacenamiento restringido. El sitio público GitHub Pages **no** recibe webhooks ni almacena tokens.
3. Clasificador de intención: compra de terma, cotización, precio, instalación, garantía, mantenimiento, falla, reclamo, pago, servicio empresarial o humano solicitado.
4. Respuestas basadas en catálogo versionado, política comercial vigente y fichas técnicas YACUSOL; nunca inventar precios, stock, promociones, plazos, ahorros garantizados ni seguridad de la instalación.
5. Precalificación consentida: nombre de contacto opcional, distrito, cantidad de usuarios, duchas, alimentación de agua y requerimiento. Registrar ID del canal y origen de campaña cuando existan. No pedir DNI, tarjetas o dirección domiciliaria exacta en el saludo.
6. Crear/actualizar prospecto en CRM privado por identificador de conversación. Historial, estado, último contacto, responsable, próxima acción, propuesta y ventas. Acceso mínimo y protección de datos personales.
7. Derivación personal: solicitud explícita, fuga, tanque deformado, quemaduras, riesgo eléctrico, reclamo, proyecto especial, negociación, comprobantes, pagos o solicitud de visita de ingeniería. Dejar de responder como si se cerró el caso cuando hay derivación.
8. Notificación real al Ing. Rafael por canal autorizado (por ejemplo email institucional o mensaje de WhatsApp Business API permitido), solo tras confirmación de que el webhook y el servicio de notificaciones funcionan. Marcar caso PENDIENTE_HUMANO, enviar resumen técnico, canal, ID y enlace seguro. No incorporar datos de clientes a repositorios públicos.
9. Al recibir respuesta humana, estado EN_ATENCION; tras cotización, COTIZADO; tras venta, VENDIDO; si no hay respuesta humana, aplicar recordatorios adecuados sin mensajes masivos ni plantillas fuera de política.
## Severidad y sugerencia operativa
- ALTA: riesgo de seguridad, fuga importante, queja grave -> aviso inmediato y recomendación de detener uso de forma segura; no instrucciones DIY de electricidad o presión.
- MEDIA: cliente solicita atención humana, instalación no estándar, proyecto grande, factura, disponibilidad o pago -> aviso a responsable, respuesta según disponibilidad.
- NORMAL: consultas frecuentes, guía de capacidad, información comercial -> bot responde y clasifica; cuando requiere precio exacto o cierre, pasa a ventas.
Las horas de respuesta son objetivos a acordar, **no** SLA comprometido sin disponibilidad del personal.
## Criterios de aceptación antes de afirmar «bot 24/7 multicanal»
- [ ] Canal WhatsApp Business oficial con número aprobado; API/Webhooks y políticas verificadas.
- [ ] Messenger e Instagram API conectados a cuentas comerciales verificadas; permisos de mensajes probados.
- [ ] CRM privado operativo, acceso autenticado, política de retención y mecanismo para derechos de datos.
- [ ] 10 casos de prueba: compra simple, 5 personas/2 duchas/tanque elevado, red presurizada, 10 habitaciones, garantía, fuga, controlador TK, reclamo, humano explícito, abandono de chat.
- [ ] Alertas recibidas realmente por ingeniero y acuse de atención; pruebas de duplicados y fallos.
- [ ] Medición desde campaña a consulta/cotización/venta sin datos inventados.
- [ ] Política de cuándo el asistente puede confirmar precio y qué queda sujeto a validación humana.
## Implementación de etapa 1
Los asistentes web de `Energeticos2023/YACUSOL` y `Energeticos2023/Yacusol-app` comparten `asistente/asistente.js`. Esta PR agrega una entrevista de cotización en navegador, mejores respuestas de seguridad, y WhatsApp con resumen prellenado; **NO** abre el canal por el usuario ni avisa automáticamente al ingeniero. Para que funcione el aviso real, implementar la etapa 2 con el proveedor de mensajería autorizado y backend seguro.
## Arquitectura recomendada
Cliente -> canal oficial / web -> backend privado (webhooks, verificación y controles de política) -> orquestador de respuestas con fuentes versionadas -> CRM de prospectos y casos -> alerta al ingeniero -> cierre humano y métricas. No utilizar credenciales privadas ni API de terceros desde JavaScript distribuido en GitHub Pages.
