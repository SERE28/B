<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["status" => "error", "mensaje" => "Método no permitido. Usa GET."]);
    exit;
}

$archivo = __DIR__ . '/books.json';

if (file_exists($archivo)) {
    $contenido = json_decode(file_get_contents($archivo), true) ?? ["books" => []];
} else {
    $contenido = ["books" => []];
}

$busqueda = $_GET["q"] ?? "";
$busqueda = trim($busqueda);

if ($busqueda !== "") {
    $contenido["books"] = array_filter($contenido["books"], function($libro) use ($busqueda) {
        
        // Garantizamos que las propiedades existan antes de buscar cadenas de texto
        $titulo    = $libro["title"] ?? "";
        $autor     = $libro["author"] ?? "";
        $categoria = $libro["category"] ?? $libro["categoria"] ?? "General";
        $type      = $libro["type"] ?? "libro";
        $status    = $libro["status"] ?? "pendiente";
        $isbn      = $libro["isbn"] ?? "";

        return (
            stripos($titulo, $busqueda) !== false ||
            stripos($autor, $busqueda) !== false ||
            stripos($categoria, $busqueda) !== false ||
            stripos($type, $busqueda) !== false ||
            stripos($status, $busqueda) !== false ||
            stripos(strval($isbn), $busqueda) !== false
        );
    });

    // Reindexamos para evitar el bug que transforma arrays en objetos asociativos JSON
    $contenido["books"] = array_values($contenido["books"]);
}

echo json_encode($contenido, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;