# Publicación y presencia de COINPRE

## Versiones y Hostinger

Trabaja en `C:\Users\crist\Downloads\COINPRE-WEB`. La carpeta antigua `coinpresas.co` no es la copia Git actual.

El flujo preparado es: cambios revisados → `main` → acción «Preparar versión para Hostinger» → rama `hostinger` → Hostinger.
La rama `hostinger` contiene solo el contenido de `public_html`. No la edites directamente. Las claves privadas de Brevo siguen en Supabase.

1. Antes del cambio, descarga una copia completa del sitio de Hostinger y su base de datos si conserva WordPress. Conserva también su configuración y archivos de verificación de Google.
2. En hPanel abre Sitios web → coinpresas.co → Administrar → Avanzado → Git.
3. Conecta GitHub y autoriza el repositorio `CristianG1h/COINPRE-WEB`.
4. Selecciona **rama `hostinger`**, destino **`public_html`**. No selecciones `main`: tiene otra estructura y archivos de desarrollo.
5. Para la migración, después de respaldar, aparta los archivos del sitio anterior fuera de la carpeta pública. En especial, un `index.php` o reglas de WordPress antiguas podrían seguir atendiendo las visitas. No dejes el respaldo descargable en `public_html`.
6. Pulsa Desplegar. Activa despliegue automático. Comprueba el historial y luego inicio, cursos, mapa y formularios desde el dominio real. Vacía la caché de Hostinger si muestra la versión anterior.
7. En cada mejora futura, guarda un commit y súbelo a `main` (preferiblemente mediante una revisión). GitHub prepara automáticamente la rama de publicación; Hostinger recibe esa versión. Para deshacer un cambio, revierte su commit en `main` y publica esa reversión: el historial se conserva.

No se ha sustituido el sitio de Hostinger desde esta tarea. GitHub Pages es la vista previa, con `noindex`; las fuentes destinadas al dominio real conservan su SEO indexable. No necesitas cambiar DNS para sustituir los archivos en el mismo hosting. Si tu panel ofrece una versión distinta de Git, revisa su pantalla antes de desplegar.

Guía oficial: https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/

## Search Console sin la cuenta anterior

Puedes ser otro propietario verificado del mismo dominio sin obtener la contraseña del anterior. Necesitas acceso al DNS o poder publicar un archivo de verificación.

1. Entra con tu Google en https://search.google.com/search-console y añade una propiedad de tipo Dominio: `coinpresas.co`.
2. Copia el registro TXT que Google genere. Añádelo al DNS del dominio en el proveedor que gestione sus servidores de nombres; puede ser Hostinger si allí administras DNS. No reemplaces los TXT existentes.
3. Verifica en Google y conserva el registro. Si tu acceso de colaborador no permite DNS, pide al administrador que añada ese TXT, o usa una propiedad de prefijo `https://www.coinpresas.co/` con archivo HTML de verificación. Ese archivo debe conservarse en Git para que las publicaciones futuras no lo borren.
4. Una vez publicada la nueva web en el dominio real, envía `https://www.coinpresas.co/sitemap.xml`. Inspecciona inicio, alturas, confinados y conducción y solicita su rastreo. Revisa las páginas indexadas y los errores; Google decide cuándo actualizar los resultados.

Referencia: https://support.google.com/webmasters/answer/9008080

## Resultado antiguo de Sabrina y otras páginas

El código actual no contiene Sabrina Puglisi. La captura muestra un resultado antiguo, pero no su URL exacta; no se ha eliminado ningún resultado desde Google.
Abre ese resultado y copia su dirección. Si es una página retirada sin reemplazo, debe devolver un estado real 404 o 410 en el hosting. Si tiene contenido útil equivalente, usa una redirección 301 al reemplazo específico. No redirijas indiscriminadamente todas las páginas antiguas al inicio.
Con acceso verificado, la herramienta Retiradas permite ocultarla temporalmente; hay que corregir o retirar también el contenido de origen para que no vuelva. Revisa que el antiguo WordPress no siga publicando páginas de autores tras migrar.
Referencia: https://support.google.com/webmasters/answer/7479439

## Perfil de Empresa (Maps)

Es independiente de Search Console. Pide al propietario actual que invite tu cuenta como administrador. Si no puedes contactarlo, entra en https://business.google.com/add, busca el negocio existente y usa Solicitar acceso. No crees un duplicado. Google describe el proceso y sus posibles verificaciones aquí: https://support.google.com/business/answer/4566671

Tras obtener acceso, revisa teléfono principal 310 791 8133, adicional 315 612 8907, dirección y web. Como descripción puedes usar el párrafo empresarial aprobado del footer y completar la oferta CEA A1, A2, B1 y C1. Comprueba las categorías disponibles que correspondan a las actividades reales; no se han modificado categorías sin acceso al perfil.
Organiza servicios en SST (alturas, confinados, especializados y soluciones) y CEA (A1, A2, B1, C1). Añade fotografías actuales y autorizadas del centro, prácticas y vehículos. Estas tareas externas quedan pendientes del acceso de administrador.
