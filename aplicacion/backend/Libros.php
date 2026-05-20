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
$contenido = file_exists($archivo) ? (json_decode(file_get_contents($archivo), true) ?? ["books" => []]) : ["books" => []];

$busqueda = trim($_GET["q"] ?? "");
$criterio = $_GET["criterio"] ?? "all"; // AQUÍ CAPTURAMOS EL CRITERIO

if ($busqueda !== "") {
    $contenido["books"] = array_filter($contenido["books"], function($libro) use ($busqueda, $criterio) {
        
        $titulo    = $libro["title"] ?? "";
        $autor     = $libro["author"] ?? "";
        $categoria = $libro["category"] ?? $libro["categoria"] ?? "General";
        $type      = $libro["type"] ?? "libro";
        $status    = $libro["status"] ?? "pendiente";
        $isbn      = strval($libro["isbn"] ?? "");

        // LÓGICA DE FILTRADO SEGÚN CRITERIO
        switch ($criterio) {
            case 'title':
                return stripos($titulo, $busqueda) !== false;
            case 'author':
                return stripos($autor, $busqueda) !== false;
            case 'category':
                return stripos($categoria, $busqueda) !== false;
            case 'all':
            default:
                return (
                    stripos($titulo, $busqueda) !== false ||
                    stripos($autor, $busqueda) !== false ||
                    stripos($categoria, $busqueda) !== false ||
                    stripos($type, $busqueda) !== false ||
                    stripos($status, $busqueda) !== false ||
                    stripos($isbn, $busqueda) !== false
                );
        }
    });

    $contenido["books"] = array_values($contenido["books"]);
}

echo json_encode($contenido, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
exit;