<?php
// PHP 8.1+. Configuration stays outside public_html and is never committed.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $status, bool $ok, string $message): never {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST'); reply(405, false, 'Utiliza el formulario para enviar tu solicitud.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16000) reply(413, false, 'La solicitud es demasiado larga.');
// Reject cross-site submissions without relying on a user supplied email header.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? '')[0]);
if ($origin !== '' && strtolower((string)parse_url($origin, PHP_URL_HOST)) !== $host) reply(403, false, 'Origen no permitido.');
if (($_SERVER['HTTP_SEC_FETCH_SITE'] ?? '') === 'cross-site') reply(403, false, 'Origen no permitido.');
function field(string $name, int $max, bool $required = false): string {
    $value = $_POST[$name] ?? '';
    if (!is_string($value)) reply(422, false, 'Revisa los campos del formulario.');
    $value = trim($value);
    if (strlen($value) > $max || ($required && $value === '') || strpos($value, "\0") !== false) reply(422, false, 'Revisa los campos obligatorios y su longitud.');
    return $value;
}
if (field('website', 200) !== '') reply(422, false, 'No fue posible procesar la solicitud.');
$name = field('name', 400, true);
$email = field('email', 254, true);
$phone = field('phone', 25, true);
$company = field('company', 480);
$service = field('service', 720, true);
$message = field('message', 8000);
$source = field('source', 150, true);
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email) || !preg_match('/^[+0-9 ()-]{7,25}$/D', $phone) || field('terms', 1) !== '1' || field('privacy', 1) !== '1') reply(422, false, 'Comprueba tu correo, celular y las dos casillas: términos y privacidad.');
if (!preg_match('/^(index|coinpre-[a-z-]+)\.html$/D', $source)) reply(422, false, 'Página de origen no válida.');
// Shared rate limit per address, with a file lock to handle simultaneous requests.
$rateDir = sys_get_temp_dir() . '/coinpre-form-limits';
if (!is_dir($rateDir) && !@mkdir($rateDir, 0700, true) && !is_dir($rateDir)) reply(503, false, 'Servicio temporalmente no disponible. Escríbenos por WhatsApp.');
$key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rate = @fopen($rateDir . '/' . $key . '.json', 'c+');
if (!$rate || !flock($rate, LOCK_EX)) reply(503, false, 'Servicio temporalmente no disponible.');
$times = json_decode(stream_get_contents($rate), true);
$times = array_values(array_filter(is_array($times) ? $times : [], fn($time) => is_int($time) && $time > time() - 3600));
if (count($times) >= 5) { flock($rate, LOCK_UN); fclose($rate); header('Retry-After: 3600'); reply(429, false, 'Has realizado varias solicitudes. Intenta más tarde o escríbenos por WhatsApp.'); }
$times[] = time(); rewind($rate); ftruncate($rate, 0); fwrite($rate, json_encode($times)); fflush($rate); flock($rate, LOCK_UN); fclose($rate);
$configFile = dirname(__DIR__, 3) . '/coinpre-mail-config.php';
$config = is_file($configFile) ? require $configFile : [];
if (!is_array($config) || ($config['enabled'] ?? false) !== true) reply(503, false, 'El formulario por correo aún no está habilitado. Por favor contáctanos por WhatsApp.');
$recipient = 'contacto@coinpresas.co';
$acceptedAt = gmdate('c');
$body = "Solicitud desde COINPRE\n\nNombre: $name\nEmpresa: $company\nCelular: $phone\nCorreo: $email\nServicio: $service\nPágina: $source\nMensaje: $message\n\nTérminos: aceptados (v1, 2026-10-28)\nPrivacidad y tratamiento de datos: autorizados (v1, 2026-10-28)\nRegistro UTC: $acceptedAt\n";
// Fixed sender/subject; user data is plain text only. Hostinger must have PHP mail enabled.
$headers = ['From' => 'COINPRE <contacto@coinpresas.co>', 'Reply-To' => $email, 'MIME-Version' => '1.0', 'Content-Type' => 'text/plain; charset=UTF-8'];
$sent = @mail($recipient, 'Solicitud web COINPRE', $body, $headers);
if (!$sent) reply(503, false, 'No fue posible enviar el correo. Conservamos los datos en pantalla: intenta de nuevo o escríbenos por WhatsApp.');
reply(200, true, 'Tu solicitud fue aceptada para envío. Si no recibes respuesta, contáctanos por WhatsApp.');
