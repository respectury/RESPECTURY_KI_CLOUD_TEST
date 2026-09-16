RESPECTURY V18.4 FIX5 – ECHTE KI-FOTO-TESTVERSION

ZIEL
----
Die V18.4 FIX5 bleibt lokal auf dem Handy. Für den TEST wird nur das ausgewählte Foto an einen kleinen KI-Testserver auf dem eigenen Windows-PC gesendet. Der OpenAI-Schlüssel bleibt auf dem PC und steht NICHT in der HTML-Datei.

WICHTIG
-------
- Niemals den OpenAI API-Key in die index.html eintragen.
- Niemals den API-Key hier im Chat senden.
- PC und Android-Handy müssen für diesen Test im selben WLAN sein.

PC-VORBEREITUNG
---------------
1. Node.js LTS auf dem PC installieren, falls noch nicht vorhanden.
2. Diesen Ordner öffnen.
3. Eingabeaufforderung/PowerShell in diesem Ordner öffnen.
4. `npm install` ausführen.
5. Eine Datei `.env` anlegen (Kopie von `.env.example`) und dort den eigenen API-Key setzen:
   OPENAI_API_KEY=DEIN_API_KEY
   Optional: OPENAI_MODEL=gpt-5.6-luna
6. Server starten:
   `npm start`

HANDY-TEST
----------
1. PC und Handy ins gleiche WLAN.
2. PC-IP herausfinden: Windows CMD -> `ipconfig` -> IPv4-Adresse.
3. Im Handy Chrome öffnen und eingeben:
   `http://PC-IP:8787`
   Beispiel: `http://192.168.178.50:8787`
4. RESPECTURY öffnet sich.
5. Zählerfoto aufnehmen -> `Foto mit KI analysieren`.
6. Raumfoto aufnehmen -> `Foto mit KI analysieren`.
7. KI-Ergebnis IMMER selbst prüfen und erst danach verifizieren.

Wenn Windows beim ersten Start nach Firewall-Zugriff fragt, den Zugriff im privaten Netzwerk erlauben.
