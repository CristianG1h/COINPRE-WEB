# Correo transaccional COINPRE

Estado: proyecto gratuito COINPRE formularios creado (uauyafehtnimjetnkryz), esquema aplicado y función desplegada. Secretos configurados y remitente temporal verificado: cristianguarin140@gmail.com. Brevo confirmó tres entregas de la prueba CP-175F3B5B el 29/10/2026: contacto, copia temporal y confirmación al visitante. El remitente real de transporte puede ser reescrito por Brevo a brevosend.com por usar Gmail. Para enviar desde contacto@coinpresas.co se necesita verificar ese remitente o autenticar el dominio.

## Funcionamiento

GitHub Pages sirve la web. La función `contact` de Supabase valida los datos, registra un identificador y llama a Brevo. La clave privada de Brevo existe únicamente como secreto del servidor.

- Notificación permanente: contacto@coinpresas.co.
- Copia temporal oculta: Cristianguarin140@gmail.com, mediante `CONTACT_TEST_COPY`. Eliminar ese secreto al terminar las pruebas.
- Confirmación al visitante: agradecimiento, servicio solicitado, referencia y botón de WhatsApp a la línea principal 310 791 8133.
- Responder al aviso interno dirige al visitante; responder a la confirmación dirige a contacto@coinpresas.co.

## Activación

1. Crear un proyecto **dedicado**, sin tocar el proyecto de El Oráculo. Confirmar plan gratuito y organización.
2. Aplicar `supabase/contact-schema.sql`. Tabla con RLS, sin acceso anónimo ni autenticado; función SQL solo para service_role. No se almacena el mensaje, nombre, celular ni dirección de correo: únicamente hashes con sal y estados técnicos con eliminación de registros de más de 14 días al procesar nuevas solicitudes.
3. Configurar secretos `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` (remitente ya verificado), `CONTACT_HASH_SALT` (aleatorio, privado) y `CONTACT_TEST_COPY`. Los secretos SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son provistos por la plataforma. No imprimir valores ni subir archivos .env.
4. Desplegar la función `contact` con JWT activado. Configurar en `public_html/assets/js/mail-config.js` la URL de la función y la clave **anon** pública del proyecto. Nunca usar service_role allí. La clave anon no permite leer la tabla ni llamar su función SQL; no sustituye los controles de abuso.
5. Probar validaciones, origen, dos consentimientos, envío real y estados de entrega en Brevo. `messageId` confirma aceptación por Brevo, no garantiza bandeja de entrada.
6. Publicar solo `public_html` en GitHub Pages. El repositorio traía tres flujos de publicación en conflicto; se conserva `pages.yml`.

## Límites y recuperación

Límite global conservador: 80 solicitudes en 24 horas; dos por correo/día y cinco por IP/hora, controlados de forma atómica en PostgreSQL. Cada solicitud usa hasta tres entregas de Brevo con la copia temporal activa. No hay campañas ni suscripción publicitaria.

El formulario mantiene un UUID en memoria para reintentos. Una petición simultánea o repetida no vuelve a mandar correos. Si el proveedor responde de forma ambigua o la conexión se corta, no se reenvía automáticamente: puede haber aceptado el primer correo. Consultar los registros transaccionales de Brevo antes de reenviar. Los datos siguen visibles en el formulario si el aviso interno no se confirmó. Si el interno fue aceptado y falló la confirmación al usuario, se informa con claridad; no se oculta el fallo ni se vuelve a notificar al equipo.

Los hashes caducan; una página abierta más de 14 días no debe usarse para reintentar una solicitud antigua. Los límites, el campo trampa y la validación de origen reducen abuso, pero no sustituyen un CAPTCHA: si hay abuso, incorporar Turnstile con validación en servidor. No registrar cuerpos o secretos en logs. No usar las direcciones recogidas para publicidad sin otra autorización.

## Pruebas locales

`node --experimental-strip-types --test tests/*.test.mjs`

Referencias: [Brevo](https://developers.brevo.com/docs/send-a-transactional-email), [Supabase Functions](https://supabase.com/docs/guides/functions/function-configuration).

## Operación

Clave de Brevo: COINPRE - formularios web, restringida a Emails transaccionales. Caduca el 29/10/2027 o tras 90 días sin uso; renovar antes de vencer y actualizar el secreto BREVO_API_KEY. El plan gratuito de Brevo se comparte con los demás proyectos de la cuenta. El tope propio de COINPRE no reserva cuota frente a otros envíos.

Supabase: proyecto uauyafehtnimjetnkryz, plan gratuito al crearlo. Revisar límites y posibles pausas del plan gratuito en su panel si el sitio permanece inactivo. No hay garantía de disponibilidad de un plan gratuito.
