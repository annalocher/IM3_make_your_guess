<?php
/**
 * ETL-Skript: Holt Daten von Energy API und speichert sie in der Datenbank
 *
 * Extract: API abrufen
 * Transform: Daten bereinigen und formatieren
 * Load: In Datenbank speichern
 */

require_once __DIR__ . '/../config.php';

/**
 * EXTRACT: Holt Daten von einer API URL
 *
 * @param string $url Die API URL
 * @param int $timeout Timeout in Sekunden
 * @return array|false Die API-Daten oder false bei Fehler
 */
function fetchFromApi($url, $timeout = 30) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode !== 200) {
        return ['error' => $error, 'httpCode' => $httpCode];
    }

    return json_decode($response, true);
}

/**
 * TRANSFORM: Bereinigt und formatiert einen Playout-Eintrag
 *
 * @param array $playout Rohdaten aus der API
 * @return array|null Bereinigte Daten oder null wenn ungültig
 */
function transformPlayout($playout) {
    $artist = trim($playout['artist'] ?? '');
    $title = trim($playout['title'] ?? '');
    $imageUrl = $playout['imageUrl'] ?? null;
    $playedAt = $playout['playFrom'] ?? null;

    // Ungültige Einträge filtern
    if (empty($artist) || empty($title) || empty($playedAt)) {
        return null;
    }

    // Timestamp konvertieren (ISO 8601 → MySQL DATETIME)
    return [
        'artist' => $artist,
        'title' => $title,
        'image_url' => $imageUrl,
        'played_at' => date('Y-m-d H:i:s', strtotime($playedAt))
    ];
}

/**
 * LOAD: Speichert einen Eintrag in die Datenbank
 *
 * @param PDO $pdo Datenbankverbindung
 * @param array $data Die zu speichernden Daten
 * @return bool True wenn eingefügt, false wenn übersprungen
 */
function loadToDatabase($pdo, $data) {
    static $stmt = null;

    if ($stmt === null) {
        $stmt = $pdo->prepare("
            INSERT IGNORE INTO playouts (artist, title, image_url, played_at, fetched_at)
            VALUES (:artist, :title, :image_url, :played_at, NOW())
        ");
    }

    $stmt->execute([
        ':artist' => $data['artist'],
        ':title' => $data['title'],
        ':image_url' => $data['image_url'],
        ':played_at' => $data['played_at']
    ]);

    return $stmt->rowCount() > 0;
}

/**
 * Führt den kompletten ETL-Prozess aus
 *
 * @param string $channel Der Radio-Channel (z.B. 'bern', 'zurich')
 * @return array Ergebnis mit Statistiken
 */
function runETL($channel = 'bern') {
    $apiUrl = "https://energy.ch/api/channels/{$channel}/playouts";

    // EXTRACT
    $playouts = fetchFromApi($apiUrl);

    if (isset($playouts['error'])) {
        return ['success' => false, 'error' => 'API nicht erreichbar: ' . $playouts['error']];
    }

    if (!is_array($playouts)) {
        return ['success' => false, 'error' => 'Ungültige API-Antwort'];
    }

    // Datenbankverbindung
    $pdo = getDB();

    $inserted = 0;
    $skipped = 0;

    foreach ($playouts as $playout) {
        // TRANSFORM
        $data = transformPlayout($playout);

        if ($data === null) {
            $skipped++;
            continue;
        }

        // LOAD
        if (loadToDatabase($pdo, $data)) {
            $inserted++;
        } else {
            $skipped++;
        }
    }

    return [
        'success' => true,
        'message' => "ETL abgeschlossen",
        'channel' => $channel,
        'inserted' => $inserted,
        'skipped' => $skipped,
        'total' => count($playouts),
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

// Hauptausführung - Channel kann per GET-Parameter übergeben werden
$channel = $_GET['channel'] ?? 'bern';
$result = runETL($channel);

header('Content-Type: application/json');
echo json_encode($result);
