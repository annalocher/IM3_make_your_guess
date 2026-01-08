# Make Your Guess

Ein Ratespiel basierend auf Energy Radio Daten. Man muss erraten, welcher Artist heute am meisten gespielt wurde.

## Kurzbeschreibung

Make Your Guess holt sich Daten von der Energy.ch API und speichert sie in einer Datenbank. Beim Spielen werden 3 Artists angezeigt und man muss raten, wer am meisten läuft. Nach dem Raten sieht man die Statistik als Chart.

## Learnings

- Wie man Daten von einer API holt und in eine Datenbank speichert (ETL)
- PHP und JavaScript zusammen verwenden
- Chart.js für Diagramme einbinden
- Prepared Statements für sichere Datenbankabfragen
- SFTP zum Hochladen auf den Server

## Schwierigkeiten

- PHP geht nicht mit dem VS Code Live Server, mussten immer alles hochladen zum Testen
- Die API wollte zuerst nicht funktionieren, mussten cURL statt file_get_contents verwenden
- Wenn alle Artists gleich oft gespielt wurden wusste das Spiel nicht wer gewonnen hat
- Chart.js sah am Anfang nicht so aus wie wir wollten, viel rumprobiert mit den Farben
-

## Benutzte Ressourcen

- ChatGPT für Fragen wie "warum geht meine API nicht"
- W3Schools für PHP Syntax
- Chart.js Dokumentation

## Links

- Live: https://im3.makeyourguess.ch
- GitHub: https://github.com/annalocher/IM3_make_your_guess.git
- Figma: https://www.figma.com/proto/XDnu3CDLSddJe4CuXu9mBJ/IM-Projekt-API?node-id=2-2&starting-point-node-id=2%3A2&t=tvph6ZGu5uZ0COqd-1
- API: https://energy.ch/api/channels/bern/playouts

## Team

[Anna Locher] & [Bianca Mazzoleni]
