<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "mensaje" => "Método no permitido."]);
    exit;
}

// 1. Capturar y sanitizar datos
$isbn     = trim($_POST["isbn"] ?? "");
$title    = trim($_POST["titulo"] ?? "");
$author   = trim($_POST["autor"] ?? "");
$category = trim($_POST["categoria"] ?? "");
$type     = $_POST["type"] ?? "libro";
$status   = $_POST["status"] ?? "pendiente";
$progress = trim($_POST["progress"] ?? "");
$rating   = $_POST["rating"] ?? "0";
$coverUrl = trim($_POST["coverUrl"] ?? "");

if (empty($title) || empty($author) || empty($isbn)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "ISBN, título y autor son obligatorios."]);
    exit;
}

$archivo = __DIR__ . '/books.json';

// 2. Abrir archivo con bloqueo de seguridad
$fp = fopen($archivo, 'c+'); // Abrir para lectura y escritura
if (!$fp) {
    http_response_code(500);
    echo json_encode(["status" => "error", "mensaje" => "No se pudo abrir el almacenamiento."]);
    exit;
}

// Bloquear el archivo para procesos concurrentes
flock($fp, LOCK_EX);

// Leer contenido actual
$contenido = stream_get_contents($fp);
$data = (!empty($contenido)) ? json_decode($contenido, true) : ["books" => []];
if (!isset($data["books"]) || !is_array($data["books"])) {
    $data = ["books" => []];
}

// 3. Validación de duplicados
foreach ($data["books"] as $libro) {
    if (isset($libro["isbn"]) && strval($libro["isbn"]) === $isbn) {
        flock($fp, LOCK_UN); // Liberar bloqueo antes de salir
        fclose($fp);
        http_response_code(400);
        echo json_encode(["status" => "error", "mensaje" => "¡El ISBN " . $isbn . " ya existe en tu colección!"]);
        exit;
    }
}

// 4. Guardar nuevo registro
$nuevoRegistro = [
    "isbn"      => htmlspecialchars($isbn),
    "title"     => htmlspecialchars($title),
    "author"    => htmlspecialchars($author),
    "category"  => htmlspecialchars($category),
    "type"      => htmlspecialchars($type),
    "status"    => htmlspecialchars($status),
    "progress"  => htmlspecialchars($progress),
    "rating"    => htmlspecialchars($rating),
    "coverUrl"  => filter_var($coverUrl, FILTER_VALIDATE_URL) ? $coverUrl : "",
    "readUrl"   => filter_var($_POST["readUrl"] ?? "", FILTER_VALIDATE_URL) ? $_POST["readUrl"] : ""
];

array_unshift($data["books"], $nuevoRegistro);

// Reescribir archivo
ftruncate($fp, 0);
rewind($fp);
fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);

// 5. Liberar y cerrar
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(["status" => "success", "mensaje" => "¡Guardado correctamente!"]);
exit;
?>