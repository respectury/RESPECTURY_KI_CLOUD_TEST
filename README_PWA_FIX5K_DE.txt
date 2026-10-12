RESPECTURY FIX5K – PWA-Ergänzung
================================

Diese ZIP basiert auf RESPECTURY_KI_CLOUD_TEST_FIX5K_COCKPIT_INSTRUMENTS.zip und ergänzt PWA-Dateien, ohne die vorhandene Kernoberfläche oder Server-Endpunkte absichtlich umzubauen.

Neu:
- manifest.json für Installation als eigenständige App
- icons/icon-192.png, icons/icon-512.png und icons/brain.svg (RESPECTURY-Gehirn-Symbol)
- service-worker.js für App-Hülle und Symbole; best-effort Zwischenspeicherung der bestehenden jsPDF-CDN-Datei
- PWA-Metadaten und Service-Worker-Registrierung in index.html
- Offline-Fallback der Anmeldung nur nach erfolgreicher vorheriger Online-Anmeldung auf diesem Gerät

Wichtige Grenzen:
- Die KI-Fotoanalyse, KI-Berichte und Anmeldung/Abmeldung benötigen den Server bzw. Internet.
- Offline funktionieren kann nur, was lokal in der App gespeichert und im Browser zwischengespeichert ist. Die App speichert ihren Zustand bisher im localStorage; Browserdaten dürfen daher nicht gelöscht werden.
- Die jsPDF-Bibliothek wird weiterhin vom CDN geladen. Der Service Worker versucht, sie bei der ersten Online-Installation zwischenzuspeichern; das ist Best-Effort. Für garantierte Offline-PDF-Erstellung muss die Bibliothek zusätzlich lokal im Projekt liegen.
- Offline-Zugriff bleibt nach einer erfolgreichen Online-Anmeldung auf diesem Gerät freigeschaltet, bis explizit abgemeldet wird. Auf einem gemeinsam genutzten Tablet ist das ein Datenschutzrisiko. Das Passwort selbst wird nicht lokal gespeichert.
- Die PWA muss über HTTPS (z. B. Render) oder localhost geöffnet werden. Ein direkt geöffnetes file://-HTML unterstützt Service Worker nicht.

Einrichtung:
1. Gesamten ZIP-Inhalt in ein neues, leeres Test-Repository hochladen; .env nicht hochladen.
2. Render weiterhin mit Startbefehl `npm start` verwenden.
3. APP_PASSWORD und OPENAI_API_KEY als Render Environment Variables setzen; niemals in GitHub eintragen.
4. App auf dem Tablet online öffnen, anmelden und warten, bis der Service Worker installiert ist.
5. In Chrome-Menü „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.
6. Offline-Test: nach erfolgreicher Einrichtung WLAN/Mobilfunk ausschalten und die installierte App öffnen.

Diese Ergänzung wurde statisch geprüft; ein vollständiger Test in Android Chrome/Render wurde nicht durchgeführt.
