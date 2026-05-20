<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
/* Permitimos POST, DELETE y OPTIONS para máxima compatibilidad con el front */
header('Access-Control-Allow-Methods: POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Aceptamos tanto el método DELETE clásico como un POST destinado a borrar
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "mensaje" => "Método no permitido. Usa POST o DELETE."]);
    exit;
}

$archivo = __DIR__ . '/books.json';

if (file_exists($archivo)) {
    $contenido = json_decode(file_get_contents($archivo), true) ?? ["books" => []];
} else {
    $contenido = ["books" => []];
}

/* Lee el ISBN del cuerpo de la solicitud JSON */
$datosInput = json_decode(file_get_contents('php://input'), true);
$isbn = trim($datosInput["isbn"] ?? $_GET["isbn"] ?? "");

/* Comprueba que se haya proporcionado un ISBN */
if (!$isbn) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "ISBN no proporcionado."]);
    exit;
}

$original = count($contenido["books"]);

/* Recorre el array filtrando el libro que queremos eliminar */
$contenido["books"] = array_values(
    array_filter($contenido["books"], fn($libro) => strval($libro["isbn"]) !== strval($isbn))
);

/* Si la cuenta sigue igual, es que no existía ese ISBN */
if (count($contenido["books"]) === $original) {
    http_response_code(404);
    echo json_encode(["status" => "error", "mensaje" => "No se encontró ningún libro con ese ID/ISBN."]);
    exit;
}

/* Guarda el array actualizado en el JSON */
if (file_put_contents($archivo, json_encode($contenido, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(["status" => "success", "mensaje" => "Libro eliminado correctamente."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "mensaje" => "Error de escritura al actualizar el almacenamiento."]);
}
exit;