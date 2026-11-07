# YACUSOL | Incorporación segura de WhatsApp 942 899 919 con Coexistence
Fecha de preparación: 07/11/2026. ESTADO: NO CONECTADO. Esta guía no cambia el número ni contrata servicios.

## Estado real de elegibilidad (actualizado 07/11/2026)
- [x] El propietario confirmó que **942 899 919 usa WhatsApp Business App** en el teléfono. No se requiere volver a preguntar este dato.
- [ ] Confirmar versión de WhatsApp Business **2.24.17 o posterior** y actualización vigente.
- [ ] Crear y verificar una **copia de seguridad reciente**, identificando cuenta y hora sin exponer capturas de chats ni códigos. Esto NO cambia el número.
- [ ] En Meta Business Suite, confirmar que la cuenta empresarial correcta tiene administrador propio, activos de página YACUSOL y que el número 942 899 919 está agregado en Cuentas de WhatsApp. No asumir que Facebook o Instagram conectados a Metricool prueban este paso.
- [ ] Revisar dispositivos vinculados; Coexistence puede desvincular los secundarios. WhatsApp para Windows puede no reflejar mensajes en la API, lo que afecta la pretensión de capturar el 100 % de conversaciones.
- [ ] Confirmar si el número está asociado ya a otro BSP/API (solo puede haber uno). **No** cambiar de proveedor, registrar el número como WhatsApp personal ni desconectar para sortear errores sin revisión adicional.
- [ ] Verificar la elegibilidad **durante Embedded Signup de Meta** en el modo específico 'Connect WhatsApp Business App'. No se puede declarar elegible con los datos disponibles. Si aparece error de no elegibilidad, DETENER y consultar; no migrar unilateralmente a API exclusiva.
- [ ] Antes de consentir, mostrar al propietario el aviso de pérdida de funciones: listas de difusión nuevas desde la app, editar/revocar mensajes 1:1, mensajes temporales, visualización única, ubicación en tiempo real, sincronización de chats pasados al CRM. En respond.io el historial antiguo permanece visible en WhatsApp Business App, pero NO se importa al buzón nuevo.
- [ ] Aceptar condiciones económicas: al 07/11/2026 respond.io declara **Starter USD 79/mes** y **Growth USD 159/mes** como tarifas de referencia en su página; **Agentes IA y automatizaciones están en Growth**, sujeto a plan y contactos activos. Hay prueba de 7 días sin tarjeta según su sitio. Los cargos de mensajes de WhatsApp Business Platform pueden ser adicionales y se calculan separadamente. Revalidar antes de contratar. No realizar pago ni suscripción automática.
- [ ] Confirmar si la solución permite atender efectivamente los mensajes llegados desde anuncios Click-to-WhatsApp: el proveedor documenta que algunos primeros mensajes pueden aparecer como tipo no compatible en Coexistence. Debe planearse respaldo de revisión manual del teléfono y una prueba de extremo a extremo.
- [ ] Activar **solo** después de probar 10 casos, acuse de notificación al ingeniero y paso a atención humana sin doble respuesta.

Documentación vigente consultada:
- https://respond.io/help/whatsapp/whatsapp-coexistence (actualizada 05/11/2026)
- https://respond.io/es/pricing
- https://faq.whatsapp.com/696845041357696/?cms_platform=android&locale=es_LA

**Seguridad:** no pedir compartir PIN, OTP, QR de emparejamiento, contraseñas, tokens ni capturas de conversaciones personales. No autorizar una conexión que pida borrar WhatsApp Business o migrar a API exclusiva.

## Objetivo
Mantener el mismo número de atención 942 899 919 y la aplicación WhatsApp Business del teléfono, incorporar respuestas de IA, registrar prospectos y permitir alertas reales al Ing. Rafael Zeña; posteriormente integrar Facebook Messenger e Instagram. La opción preferida de piloto es respond.io con WhatsApp Business App Coexistence, sujeta a elegibilidad y autorización del propietario.

## No negociar antes de conexión
1. Confirmar que el número 942 899 919 funciona en **WhatsApp Business App** (no WhatsApp personal) en el móvil principal y comprobar el titular del número.
2. Abrir WhatsApp Business > Configuración > Chats > Copia de seguridad y crear respaldo reciente con verificación de finalización. Verificar que el teléfono, 2FA y recuperación estén bajo control del propietario.
3. Comprobar que Meta Business Portfolio y la página YACUSOL pertenecen al negocio y que el Ing. Rafael tiene permisos de administrador. No compartir contraseñas, códigos OTP, PIN de WhatsApp, tokens ni imágenes de identificación en chat.
4. Leer previamente limitaciones de **Coexistence**: listas de difusión de la aplicación pueden quedar de solo lectura; restricciones de editar/revocar, ver una vez, mensajes temporales y ubicación en vivo; dispositivos secundarios pueden desvincularse y necesitar reconexión; responder desde WhatsApp Business App permanece posible.
5. En el proveedor seleccionado revisar si sincroniza chats antiguos. **respond.io documenta que NO importa historial de conversaciones anteriores**, aunque siguen visibles en el WhatsApp Business del móvil. No prometer migración de historial a la plataforma.
6. Mantener la aplicación del teléfono en uso; respond.io documenta abrirla al menos cada 14 días. Ante cualquier indicación de 'registrar solo API', 'desconectar WhatsApp Business App', 'eliminar cuenta' o 'migrar' sin modo Coexistence, DETENER el proceso.

## Proveedor piloto: respond.io
Documentación coexistencia: https://respond.io/help/whatsapp/whatsapp-coexistence
Documentación agentes IA: https://respond.io/help/ai-agents/getting-started-with-ai-agents
Precios y prueba: https://respond.io/es/pricing
- El proveedor anuncia prueba de 7 días sin tarjeta. La función agente IA automático está asociada con plan Growth o superior; confirmar condiciones, límites, cargos Meta y términos antes de contratación.
- Revalidar elegibilidad de Perú y del número durante Embedded Signup; no asegurar que cualquier cuenta sea elegible.
- No comprar plan ni activar cobros de WhatsApp antes de que el propietario revise estimación mensual y límites de uso.

## Secuencia de conexión que DEBE hacer propietario autenticado
A. Desde la cuenta de Meta Business Suite: Configuración > Cuentas de WhatsApp > Agregar > Vincular cuenta WhatsApp Business, para el número correcto cuando sea requerido.
B. Desde respond.io: Settings > Channels > Add Channel > WhatsApp > **Connect WhatsApp Business App** (Coexistence), NO registro exclusivo en API. La pantalla de Meta puede comenzar por número y detectar Coexistence; verificar explícitamente que el resultado conserva la app.
C. Iniciar sesión en Meta desde sesión propia, verificar empresa, número, permisos solicitados y aceptar solo si corresponde a YACUSOL.
D. Completar verificación del número/QR exclusivamente desde WhatsApp Business App y comprobar que el teléfono todavía envía y recibe mensajes. No mandar códigos OTP a terceros.
E. Reconectar dispositivos secundarios si quedan desvinculados; evitar depender de WhatsApp for Windows, que puede no tener soporte en Coexistence.
F. En respond.io, habilitar Inbox e importar la base de conocimientos aprobada del archivo `docs/AGENTE_YACUSOL_RESPOND_IO.md`. Configurar agent responsable 'Ing. Rafael Zeña' e instrucciones para derivación. Mantener el agente INACTIVO durante la prueba manual.
G. Crear contacto interno de prueba y enviar un mensaje de prueba **desde otro número autorizado**; probar recepción, respuesta no intrusiva y registro. Repetir con un pedido de atención personal, una consulta de riesgo eléctrico, una queja y una solicitud de cotización.
H. Activar agente por flujo únicamente después de 10 pruebas satisfactorias, comprobar alertas/push/email recibidos realmente en el teléfono del propietario y que la respuesta manual desactiva respuestas automáticas duplicadas.
I. Documentar cuándo se activó, usuario autorizante, cuenta empresarial, WABA, proveedor, aceptación de limitaciones, coste y resultado de pruebas SIN exponer credenciales.

## WhatsApp -> atención inteligente -> CRM -> humano
Estados: NUEVO -> ATENDIDO_BOT -> PRECALIFICADO -> ESPERA_INGENIERO -> CONTACTADO -> COTIZADO -> GANADO / PERDIDO.
- Datos mínimos: nombre si lo desea, identificador del canal, localidad (no domicilio exacto), producto/capacidad, cantidad de personas, duchas, fuente de agua, necesidad y consentimiento. Guardado solo en plataforma privada con acceso controlado.
- Etiquetas: COMPRAR, CONSULTA_PRECIO, INSTALACION, MANTENIMIENTO, FALLA, RECLAMO, HUMAN_REQUEST, RIESGO_ALTO, EMPRESA_HOTEL, COTIZACION_ENVIADA.
- Escalamiento INMEDIATO: tanque deformado, fugas importantes, quemaduras, sospecha eléctrica, reclamo grave. Bot indica detener el uso de forma segura, sin diagnóstico concluyente ni instrucciones inseguras.
- Escalamiento PRIORITARIO: solicitud explícita del Ing. Rafael, cotización de negocio/hotel, instalación no convencional, pagos, devolución, negociación, garantía disputada.
- Al derivar: asignar a humano, poner ESPERA_INGENIERO, enviar notificación a la aplicación del proveedor y/o email ya configurado por el propietario. No prometer SMS o WhatsApp a sí mismo sin confirmar canal y políticas. Bloquear al bot hasta liberación humana.
- No enviar mensajes masivos ni recontactar fuera de ventana permitida sin plantilla aprobada y consentimiento aplicable.

## Evidencias de aceptación
1. Número mantiene funcionalidad en WhatsApp Business App y no se borraron chats locales.
2. Nueva consulta entra en la bandeja respond.io.
3. Agente IA contesta precios SIN inventarlos, solicita cuatro datos mínimos y crea prospecto.
4. Respuesta al mensaje 'quiero hablar con Rafael' deriva conversación al humano, sin doble contestación.
5. Alerta llega al teléfono real del propietario, confirmada por él (push o email, según configuración).
6. Al contestar Rafael, el bot deja de responder.
7. Reporte identifica nueva consulta, cotización y resultado sin exponer datos al público.
8. Prueba de falla de webhook, duplicado y desconexión sin pérdida de consultas.
9. Confirmar protección de datos personales, avisos y retención.
10. Registrar costos reales y límites de plan.

## Alternativas si el piloto no cumple
Wati con Coexistence (https://support.wati.io/en/articles/11822421-how-to-connect-your-whatsapp-number-to-wati-via-whatsapp-coexistence-coex); 360dialog con API y backend propio. La compatibilidad de sincronización varía entre socios. El proyecto Supabase Energeticos_Academia existente está INACTIVO y no debe utilizarse sin aprobación y revisión de presupuesto. No lanzar infraestructura con pago automático.
