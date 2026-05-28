<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$file = __DIR__ . '/books.json';

function getBooksData($file)
{
    if (!file_exists($file))
        return ['books' => []];
    $json = file_get_contents($file);
    return json_decode($json, true);
}

$method = $_SERVER['REQUEST_METHOD'];
$data = getBooksData($file);
$books = $data['books'];

// GET
if ($method === 'GET') {
    echo json_encode($books);
}

// POST
elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input) {
        $books[] = $input;
        file_put_contents($file, json_encode(['books' => $books], JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
    }
}

// DELETE
elseif ($method === 'DELETE') {
    $isbn = $_GET['isbn'] ?? null;
    if ($isbn) {
        $books = array_filter($books, fn($b) => $b['isbn'] !== $isbn);
        file_put_contents($file, json_encode(['books' => array_values($books)], JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
    }
}

// PUT (nuevo)
elseif ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['isbn'])) {
        echo json_encode(['error' => 'Datos inválidos']);
        exit;
    }

    foreach ($books as &$book) {
        if ($book['isbn'] === $input['isbn']) {
            $book = array_merge($book, $input);
            break;
        }
    }

    file_put_contents($file, json_encode(['books' => $books], JSON_PRETTY_PRINT));

    echo json_encode(['status' => 'success', 'book' => $input]);
}
?>