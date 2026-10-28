# COINPRE · Sitio web

La versión más reciente del sitio está en `public_html`. Este repositorio guarda el código fuente y los recursos de la web, sin activar por sí solo ninguna publicación en Hostinger.

## Nueva revisión visual · 28 de octubre de 2026

Esta entrega parte de la versión mejorada `coinpresas.co (2)` y conserva el ZIP original `coinpresas.co` como referencia; no se ha publicado nada.

**Corrección para celular · versión 9:** Las 24 secciones de cursos y servicios comparten una tarjeta móvil uniforme con imagen arriba y texto debajo, tamaños consistentes, separación compacta y animación de entrada conjunta. Se conserva la composición alternada de escritorio.

**Animaciones de desplazamiento · versión 8:** Los bloques principales, títulos, imágenes y tarjetas aparecen al entrar en pantalla con una transición corta de opacidad y desplazamiento vertical. Cada bloque se anima una sola vez: no hay listeners de scroll por tarjeta ni dependencias nuevas. El diseño conserva su tamaño y posición; si el navegador no admite la observación de elementos o el usuario prefiere reducir movimiento, el contenido permanece visible sin animación. Incluye el diseño móvil de la versión 6 y el arreglo del menú de la versión 7.

**Corrección de versión 7:** El menú «Más Soluciones» de escritorio y sus opciones anidadas se orientan hacia el espacio disponible a la izquierda. Así, «Equipos para Alturas» puede desplegar sus opciones sin salir del borde derecho del navegador. Se incluye además todo el trabajo de la versión 6 para celular.

**Diseño para celular · versión 6:** Footer más corto y organizado, con el logotipo completo, los apartados Formación y Hablemos desplegables y los enlaces legales en una cuadrícula de dos columnas. Contacto y formulario con espacios, tamaños y tarjetas ajustados para móvil; los campos opcionales Empresa y Mensaje están agrupados bajo «Agregar empresa o mensaje (opcional)». Los campos requeridos y consentimientos permanecen siempre visibles. La nota flotante de WhatsApp no tapa el formulario ni el pie al entrar en esas secciones. Al regresar a pantalla de computador, el DOM recupera las secciones originales y la composición del escritorio queda intacta. Se conserva todo lo de la versión 5.

**Ajuste puntual de versión 5:** Por preferencia visual, se restauró exactamente la composición del banner de la versión 3: texto a la izquierda y foto completa a la derecha, sin la fotografía ampliada de fondo. Se conservaron el encabezado fijo, la transparencia, el efecto de escritura y las transiciones de la versión 4. Las flechas desplegables del menú ahora son cheurones dibujados con CSS, alineados junto al texto y acompañados por el subrayado naranja. No se modificaron contenidos ni formularios.

**Revisión de acabado 4:** Se restauró el banner fotográfico amplio con un degradado suave sobre el texto (sin el rectángulo separado del rediseño), y las diapositivas ahora cambian con una transición gradual. El menú principal permanece visible al desplazarse y adopta un fondo ligeramente translúcido; los enlaces muestran un subrayado naranja animado al pasar el cursor o recibir foco. Se animan la aparición de los submenús de escritorio y la apertura del menú móvil, incluido el ícono hamburguesa que se transforma en una X. Los mensajes de WhatsApp recuperan el efecto de escritura al aparecer, manteniendo su retirada suave y regreso tras cinco segundos de inactividad. El sitio respeta la preferencia del sistema de movimiento reducido.

- Inicio sin las tres tarjetas de acceso de texto bajo el carrusel.
- Banner fotográfico de ancho completo con degradado de lectura, mejor posición de los protagonistas y flechas circulares con indicadores modernos.
- Carrusel, galería y catálogos: cambio automático cada **5 segundos** cuando están visibles; si el usuario utiliza una flecha o indicador, esperan **10 segundos sin interacción** y después retoman el intervalo de 5 segundos. No hay botones «Pausar» ni «Reanudar». Se respeta la preferencia de movimiento reducido del navegador.
- Tarjetas de formación con imagen completa enlazada al curso, animación suave, zoom ligero e iconografía circular inspirada en el sitio original. Productos: misma respuesta al pasar el cursor.
- Banda del video mantenida: al hacer clic se abre directamente el reproductor de Cloudinary, sin una ventana adicional de permiso. Google Maps se muestra por defecto en Contacto con carga diferida del iframe (sin pulsar otro botón).
- El panel general de preferencias de privacidad se eliminó; **siguen vigentes** los dos consentimientos obligatorios, separados y discretos, en cada formulario. Se actualizaron los textos de la política de cookies.
- Mensaje contextual de WhatsApp más legible: desaparece con transición al desplazarse y regresa tras 5 segundos de inactividad, salvo que se cierre expresamente.
- Menú de enlaces rápidos de cursos presentado en una cuadrícula más ordenada; pie de página azul con logotipo de fondo discreto.
- Páginas de error `403.html`, `404.html`, `500.html` y `503.html`, conectadas mediante `ErrorDocument` en `public_html/.htaccess` para Apache/LiteSpeed.

**Para subirlo a Hostinger:** respalda primero la versión actual, extrae **el contenido de `public_html` dentro de la carpeta `public_html` del hosting** (no la carpeta entera dentro de sí misma) y prueba los enlaces, el carrusel, Contacto, el formulario y un enlace inexistente. Conserva fuera de `public_html` el archivo privado `coinpre-mail-config.php` si lo tienes configurado. La vista previa local no ejecuta PHP ni aplica las reglas de `.htaccess`.

**Advertencia sobre contenido externo:** Maps se conecta a Google sin un clic de activación y el video conecta con Cloudinary al reproducirlo. Valida con tu responsable de protección de datos si este comportamiento y las políticas publicadas cumplen los requisitos aplicables antes de ponerlo en producción.

## Ver la página

Desde esta carpeta, abre una terminal y ejecuta:

```powershell
node tools/preview.cjs
```

Abre la dirección local que imprime la terminal. Déjala abierta mientras revisas el sitio; Ctrl+C detiene el servidor. La vista previa no ejecuta PHP ni envía correos. WhatsApp y Google Maps requieren internet.

## Qué cambió

- Menú compacto y logo único; navegación móvil sin dependencias de terceros.
- Inicio con acceso a alturas, espacios confinados y CEA/conducción, manteniendo la paleta azul/naranja y la información de los cursos.
- Encabezados interiores más cortos y accesos a los niveles de cada curso.
- Inscripción dentro de un diálogo accesible, con curso preseleccionado y alternativa de WhatsApp.
- WhatsApp contextual en las ocho páginas y por curso. Notas rotativas, cierre y respeto por movimiento reducido. No es un chatbot ni genera respuestas automáticas.
- Contacto con mapa de Google Maps que aparece automáticamente (iframe diferido), dirección y enlaces útiles; pie de página resumido.
- 63 imágenes convertidas a WebP: versiones principales de 37.26 MB a 5.00 MB, más variantes pequeñas para pantallas móviles. Se conservaron los originales. Esto no equivale a una medición de velocidad en la conexión real del usuario.
- Se eliminaron de las páginas las cargas de scripts de plantilla, el cursor animado, el preloader y las animaciones de entrada. Las galerías de productos se recorren horizontalmente sin cargar un carrusel.
- Corrección de correos de ejemplo y referencias a imágenes inexistentes, idioma español y títulos/descripciones específicos.
- Validación del formulario en cliente y servidor, rechazo de cabeceras inyectadas, control de origen, campo antispam, límite de cinco intentos válidos por IP por hora, respuestas JSON y errores visibles sin borrar los datos.
- Reglas Apache/LiteSpeed para proteger archivos internos, limitar recursos externos, comprimir y cachear. No sustituyen la configuración del hosting ni una auditoría de su cuenta.

## Archivos que normalmente editarás

- `public_html/index.html`: página principal.
- `public_html/coinpre-cursos-*.html`: contenidos de cursos.
- `public_html/assets/css/coinpre.css`: ajustes visuales compartidos.
- `public_html/assets/js/coinpre.js`: número de WhatsApp, mensajes y comportamiento compartido.
- `public_html/assets/inc/sendemail.php`: validaciones y envío de correo.

El HTML es estático y el encabezado/pie se repite en las ocho páginas. Si cambias su contenido, aplica el mismo cambio en todas. No hace falta WordPress, una base de datos ni instalar Node en Hostinger: Node solo sirve para esta vista previa local.

## Antes de publicar

1. Confirmar que **315 612 8907** es el WhatsApp que recibirá los contactos. Se tomó de Dirección Comercial en el sitio recibido; no se repartieron contactos entre los otros teléfonos. Se cambia una vez en `coinpre.js`; los enlaces de respaldo del HTML también deben actualizarse si se cambia de número.
2. Confirmar el buzón **contacto@coinpresas.co**. El formulario anterior enviaba a una dirección de la plantilla. El nuevo endpoint usa destinatario y remitente fijos de COINPRE.
3. En una copia de pruebas de Hostinger, usar PHP 8.1 o superior compatible y verificar que el servicio de correo PHP esté habilitado. Copiar `coinpre-mail-config.example.php` como `coinpre-mail-config.php` **al lado de public_html, fuera de la carpeta pública**, y cambiar `enabled` a `true`. Este archivo está excluido de Git. Si no existe o está deshabilitado, el formulario muestra un aviso y ofrece WhatsApp.
4. Probar un envío autorizado de extremo a extremo y comprobar bandeja de entrada/spam y el remitente. `mail()` aceptado no garantiza recepción. Fuente: https://www.php.net/manual/en/function.mail.php
5. Revisar el texto de autorización de contacto con la política oficial de COINPRE y enlazarla cuando esté disponible. La política enlazada anteriormente no existía en los archivos recibidos. No se inventó una política legal completa.
6. Comprobar HTTPS, los encabezados HTTP y acceso denegado a `.env`, `assets/inc/app/` y archivos internos en Hostinger. El servidor local no ejecuta `.htaccess`.
7. Comprobar el marcador de Maps: se basa en la dirección publicada. Si existe una ficha de Google Business, sustituirlo por su enlace de ubicación exacta.
8. La fuente de algunas fotos ya tiene resolución limitada. Para más nitidez hay que sustituirlas por los originales, sin ampliarlas artificialmente.

## Git y GitHub, explicado paso a paso

Git guarda versiones de los archivos; GitHub conserva el repositorio remoto; Hostinger publica la versión que elijas. La rama principal de este proyecto es `main`. Las mejoras antiguas están documentadas en `CHANGELOG.md` y los ZIP de entrega anteriores se conservan por separado.

1. Usa el repositorio privado `CristianG1h/COINPRE-WEB`.
2. Para trabajar desde una copia local, configura tu identidad Git y la URL remota si aún no existe:

```powershell
git config user.name "Tu nombre"
git config user.email "Tu correo de GitHub"
git remote add origin https://github.com/CristianG1h/COINPRE-WEB.git
git push -u origin main
```

3. Para futuros cambios, crea una rama y guarda una versión:

```powershell
git switch -c mejora/nombre-del-cambio
# Edita y revisa en local.
git add .
git commit -m "Describe el cambio realizado"
git push -u origin mejora/nombre-del-cambio
```

Abre una Pull Request en GitHub para revisar y unir los cambios a `main`. Los commits iniciales usan la identidad local `COINPRE Local`; los futuros usarán la que configures.

## Conexión a Hostinger sin publicar carpetas equivocadas

Este repositorio contiene `public_html` más documentación y herramientas. La carpeta raíz configurada en Hostinger es el destino del despliegue, no necesariamente un filtro de subcarpetas del repositorio. Para que `index.html` quede directamente en la raíz pública, genera una rama de publicación que contenga solo `public_html`:

```powershell
git switch main
# Si ya trabajas con GitHub, actualiza antes: git pull --ff-only
git subtree split --prefix=public_html --branch=deploy
git push origin main deploy
```

El código privado del correo está excluido; no copies el `.env` recibido ni subas contraseñas a Git. La rama `deploy` es un resultado generado: edita en `main`/ramas de trabajo, no directamente en `deploy`.

En Hostinger:

1. Conserva un respaldo del sitio actual y prueba primero en un subdominio o sitio de pruebas. El despliegue puede sobrescribir archivos existentes.
2. En el sitio correspondiente entra a **Administrar → Avanzado → Git**.
3. Conecta GitHub y autoriza el acceso únicamente al repositorio elegido.
4. Elige `coinpre-web`, la rama **deploy** y la carpeta pública de ese sitio (habitualmente `public_html`).
5. Despliega y verifica navegación, formularios, correo, WhatsApp y móvil. La configuración de correo debe seguir fuera de esa carpeta y no formar parte del despliegue.
6. Una vez revisado, activa o conserva **Auto-deployment**. Cada push a `deploy` será una publicación; los pushes a `main` no publicarán hasta regenerar y subir `deploy`.

Después de integrar cada mejora a main, repite los dos comandos de `subtree split` y `push`. Así separas guardar el trabajo de publicarlo. No se ha activado este proceso en tu cuenta.

Guía oficial de Hostinger consultada el 28 de octubre de 2026:
https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

Para revertir una mejora publicada, crea un commit de reversión en `main` (`git revert ID_DEL_COMMIT`), compruébalo en local y regenera/sube `deploy`. Evita `reset --hard` o forzar pushes para deshacer cambios compartidos.

## Google Ads y Analytics del documento adjunto

No se instalaron etiquetas ni activaron campañas. Los IDs de conversión, las etiquetas de evento, GA4/GTM, consentimiento y enrutamiento comercial requieren configuración real de las cuentas. El identificador de Ads mencionado en el documento no basta para validar conversiones.

El navegador emite un evento local `coinpre:lead` con `whatsapp_click` o `form_success`, página y servicio. No transmite datos a Google ni envía nombre, teléfono o correo. `form_success` significa aceptación por el servidor de correo, no entrega ni venta. Si se incorpora medición, debe existir un único responsable del evento para evitar duplicados, revisar la CSP y validar con Tag Assistant antes de campañas.

## Verificación realizada

- Las ocho páginas a 320, 390, 768 y 1440 px: sin desbordamiento horizontal, sin imágenes rotas, un H1 por página y enlaces internos comprobados.
- Diálogo: curso correcto, WhatsApp por curso, recorrido de foco, Escape y devolución del foco al botón.
- Menú móvil, error de envío conservando los datos y confirmación simulada contabilizada una sola vez.
- PHP 8.4: sintaxis y pruebas de método, origen, correo malicioso, campos tipo array, consentimiento, antispam, transporte deshabilitado/fallido y límite de frecuencia.
- Las pruebas de correo usan un transporte simulado: no se envió ningún mensaje real.
- Revisión visual de inicio, alturas, contacto, formulario y pie de página. Pendiente: entrega real de correo, reglas Apache/LiteSpeed, métricas de carga en hosting y configuración publicitaria.
