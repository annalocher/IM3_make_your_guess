# Make Your Guess

Ein interaktives Ratespiel basierend auf Live-Daten von Radio Energy. Die Spieler müssen erraten, welcher Artist heute am meisten im Radio gespielt wurde.

## Kurzbeschreibung

Make Your Guess ist ein datenjournalistisches Webprojekt, das die Playlist-Daten von Energy Radio nutzt, um ein unterhaltsames Ratespiel zu erstellen. Die Anwendung sammelt kontinuierlich Daten von der offiziellen Energy.ch API und speichert diese in einer eigenen MySQL-Datenbank. So entsteht über die Zeit eine eigene Datenbasis mit allen gespielten Songs und Artists.

Beim Spielen werden dem User drei zufällig angeordnete Artists präsentiert, die heute im Radio liefen. Die Aufgabe ist es zu erraten, welcher dieser drei Artists am häufigsten gespielt wurde. Nach der Auswahl wird das Ergebnis angezeigt - inklusive einer interaktiven Datenvisualisierung mit Chart.js, die zeigt, wie oft jeder Artist tatsächlich gespielt wurde. Eine kurze Data-Story erklärt zusätzlich die Statistiken im Kontext.

Das Projekt demonstriert den kompletten ETL-Prozess (Extract, Transform, Load): Daten werden von einer externen API abgerufen, für unsere Zwecke transformiert und in einer eigenen Datenbank gespeichert. Beim Besuch der Website werden diese Daten dann wieder ausgelesen und dynamisch dargestellt.

## Learnings

- Den kompletten ETL-Prozess verstanden und umgesetzt: Daten von einer API holen, transformieren und in eine Datenbank speichern
- PHP als serverseitige Programmiersprache kennengelernt und mit JavaScript im Frontend kombiniert
- Chart.js Framework für interaktive Datenvisualisierungen eingebunden und angepasst
- Prepared Statements in PHP für sichere Datenbankabfragen verwendet, um SQL-Injection zu verhindern
- SFTP-Workflow mit VS Code eingerichtet, um Dateien automatisch auf den Server hochzuladen
- Gelernt, wie man mit asynchronen API-Calls in JavaScript arbeitet (fetch, async/await)
- Verständnis für die Trennung von Frontend und Backend entwickelt

## Schwierigkeiten

- PHP funktioniert nicht mit dem VS Code Live Server, daher mussten wir für jeden Test die Dateien zuerst auf den Server hochladen. Das hat den Entwicklungsprozess verlangsamt.
- Die Energy API wollte zuerst nicht funktionieren. Nach langem Debugging haben wir herausgefunden, dass wir cURL statt file_get_contents verwenden müssen, weil der Server externe Requests blockiert hat.
- Bei einem Gleichstand (alle Artists gleich oft gespielt) wusste das Spiel anfangs nicht, wer gewonnen hat. Wir haben dann einen Tiebreaker eingebaut: Wer zuletzt gespielt wurde, gewinnt.
- Die Gestaltung des Chart.js Diagramms war aufwendiger als gedacht. Wir haben viel mit Farben, Tooltips und dem Layout experimentiert, bis es zu unserem Design gepasst hat.
- Das Responsive Design für Mobile war eine Herausforderung, besonders bei den Artist-Karten.

## Benutzte Ressourcen

- KI-Assistenz: Claude und ChatGPT für Debugging-Fragen (z.B. "Wieso geht meine API nicht?" oder "index.php zeigt nur eine weisse Seite")
- W3Schools und PHP.net für PHP Syntax und Funktionen
- Chart.js offizielle Dokumentation für die Diagramm-Konfiguration
- YouTube Tutorials für PHP und MySQL Basics
- Stack Overflow für spezifische Fehlermeldungen

## Links

- Live: https://im3.makeyourguess.ch
- GitHub: https://github.com/annalocher/IM3_make_your_guess.git
- Figma: https://www.figma.com/proto/XDnu3CDLSddJe4CuXu9mBJ/IM-Projekt-API?node-id=2-2&starting-point-node-id=2%3A2&t=tvph6ZGu5uZ0COqd-1
- API: https://energy.ch/api/channels/bern/playouts

## Team

Anna Locher & Bianca Mazzoleni
