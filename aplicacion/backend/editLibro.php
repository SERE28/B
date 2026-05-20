<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// Solo permitimos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "mensaje" => "Método no permitido."]);
    exit;
}

$archivo = __DIR__ . '/books.json';

if (!file_exists($archivo)) {
    http_response_code(404);
    echo json_encode(["status" => "error", "mensaje" => "Base de datos no encontrada."]);
    exit;
}

// Cargar datos
$data = json_decode(file_get_contents($archivo), true) ?? ["books" => []];

// Datos recibidos del formulario
$isbnOriginal = trim($_POST["isbn_original"] ?? "");
$isbnNuevo    = trim($_POST["isbn"] ?? "");

// Validación básica
if (empty($isbnOriginal)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Falta el ID del libro original."]);
    exit;
}

$encontrado = false;

// Procesar edición
foreach ($data["books"] as $key => &$libro) {
    // Comparamos como string para asegurar coincidencia exacta
    if (strval($libro["isbn"] ?? "") === strval($isbnOriginal)) {
        
        // Actualizamos el registro usando los datos de $_POST
        $libro["isbn"]     = $isbnNuevo; // El nuevo ISBN
        $libro["title"]    = $_POST["titulo"] ?? $libro["title"];
        $libro["author"]   = $_POST["autor"] ?? $libro["author"];
        $libro["category"] = $_POST["categoria"] ?? $libro["category"];
        $libro["type"]     = $_POST["type"] ?? $libro["type"];
        $libro["status"]   = $_POST["status"] ?? $libro["status"];
        $libro["progress"] = $_POST["progress"] ?? $libro["progress"];
        $libro["rating"]   = $_POST["rating"] ?? $libro["rating"];
        $libro["coverUrl"] = $_POST["coverUrl"] ?? $libro["coverUrl"];
        $libro["readUrl"]  = $_POST["readUrl"] ?? $libro["readUrl"];
        
        $encontrado = true;
        break;
    }
}

if ($encontrado) {
    if (file_put_contents($archivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode(["status" => "success", "mensaje" => "Libro actualizado correctamente."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "mensaje" => "Error al escribir en el archivo."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "mensaje" => "No se encontró el libro original."]);
}
?>