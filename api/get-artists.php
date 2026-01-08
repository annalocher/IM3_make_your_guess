<?php
/**
 * Game API: Liefert die Top Artists aus der Datenbank
 *
 * Response Format:
 * {
 *   "success": true,
 *   "winner": { "artist": "...", "image_url": "...", "play_count": 10 },
 *   "artists": [...]
 * }
 */

require_once __DIR__ . '/../config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

/**
 * Holt die Top Artists aus der Datenbank
 *
 * @param PDO $pdo Datenbankverbindung
 * @param int $limit Anzahl der Artists
 * @param string $period Zeitraum: 'today', 'week', 'month', 'all'
 * @return array Liste der Top Artists
 */
function getTopArtists($pdo, $limit = 3, $period = 'today') {
    // WHERE-Klausel je nach Zeitraum
    $whereClause = match($period) {
        'today' => "WHERE DATE(played_at) = CURDATE()",
        'week' => "WHERE played_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)",
        'month' => "WHERE played_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)",
        'all' => "",
        default => "WHERE DATE(played_at) = CURDATE()"
    };

    $stmt = $pdo->prepare("
        SELECT
            artist,
            COUNT(*) as play_count,
            MAX(played_at) as last_played,
            (SELECT image_url FROM playouts p2
             WHERE p2.artist = p1.artist
             AND p2.image_url IS NOT NULL
             ORDER BY played_at DESC LIMIT 1) as image_url
        FROM playouts p1
        {$whereClause}
        GROUP BY artist
        ORDER BY play_count DESC, last_played DESC
        LIMIT :limit
    ");

    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

/**
 * Bereitet die Game-Daten vor (mischt Artists, bestimmt Winner)
 *
 * @param array $artists Liste der Artists
 * @param bool $shuffle Sollen die Artists gemischt werden?
 * @return array Game-Daten mit winner und artists
 */
function prepareGameData($artists, $shuffle = true) {
    if (empty($artists)) {
        return null;
    }

    $winner = $artists[0]; // Der mit den meisten Plays

    if ($shuffle) {
        shuffle($artists);
    }

    return [
        'winner' => $winner,
        'artists' => $artists
    ];
}

/**
 * Sendet eine JSON-Antwort
 *
 * @param array $data Die zu sendenden Daten
 */
function sendJsonResponse($data) {
    echo json_encode($data);
    exit;
}

// Hauptausführung
try {
    $pdo = getDB();

    // Parameter aus GET (mit Standardwerten)
    $limit = (int) ($_GET['limit'] ?? 3);
    $period = $_GET['period'] ?? 'today';

    // Limit validieren (min 2, max 10)
    $limit = max(2, min(10, $limit));

    // Top Artists holen
    $artists = getTopArtists($pdo, $limit, $period);

    // Prüfen ob genug Daten vorhanden
    if (count($artists) < $limit) {
        sendJsonResponse([
            'success' => false,
            'error' => 'Nicht genug Daten. Bitte ETL-Skript ausführen.',
            'artists_found' => count($artists),
            'period' => $period
        ]);
    }

    // Game-Daten vorbereiten
    $gameData = prepareGameData($artists);

    sendJsonResponse([
        'success' => true,
        'winner' => $gameData['winner'],
        'artists' => $gameData['artists'],
        'period' => $period
    ]);

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'error' => 'Datenbankfehler: ' . $e->getMessage()
    ]);
}
