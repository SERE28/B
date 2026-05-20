<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "mensaje" => "Método no permitido. Usa POST."]);
    exit;
}

// Capturar las variables enviadas desde el formulario del front-end
$title     = trim($_POST["titulo"] ?? "");
$author    = trim($_POST["autor"] ?? "");
$category  = trim($_POST["categoria"] ?? "");
$type      = $_POST["type"] ?? "libro";
$status    = $_POST["status"] ?? "pendiente";
$progress  = trim($_POST["progress"] ?? "");
$rating    = $_POST["rating"] ?? "0";
$coverUrl  = trim($_POST["coverUrl"] ?? "");
$isbn      = trim($_POST["isbn"] ?? "");

// Validación de campos requeridos
if (empty($title) || empty($author) || empty($isbn)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Todos los campos, incluyendo ISBN, son obligatorios."]);
    exit;
}

$archivo = __DIR__ . '/books.json';

if (file_exists($archivo)) {
    $data = json_decode(file_get_contents($archivo), true);
    if (!isset($data["books"]) || !is_array($data["books"])) {
        $data = ["books" => []];
    }
} else {
    $data = ["books" => []];
}

// Construir el registro sanitizado
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

// Añadir al principio para que se muestre primero en la web
array_unshift($data["books"], $nuevoRegistro);

if (file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(["status" => "success", "mensaje" => "¡Guardado correctamente en tu colección!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "mensaje" => "No se pudo escribir en el almacenamiento del servidor."]);
}
exit;