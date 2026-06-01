# AffiliTrack — Balkonstrom.com
## Deploy auf Netlify (5 Minuten, kostenlos)

### Schritt 1 — GoAffPro API-Key holen
1. GoAffPro Admin → **Settings → Developer → Access Tokens**
2. Klick auf **New API Key** → kopieren

### Schritt 2 — Auf Netlify deployen
1. Geh auf **netlify.com** → Account erstellen (kostenlos)
2. Klick auf **"Add new site" → "Deploy manually"**
3. Ziehe den ganzen **affilitrack-netlify** Ordner auf die Seite
4. Netlify gibt dir eine URL wie `https://amazing-name-123.netlify.app`

### Schritt 3 — API-Key als Umgebungsvariable setzen
1. In Netlify: **Site settings → Environment variables → Add variable**
2. Key: `GOAFFPRO_TOKEN`
3. Value: dein kopierter API-Key
4. Klick **Save**, dann **Deploys → Trigger deploy**

### Fertig!
Öffne deine Netlify-URL → klick auf **"🔄 GoAffPro Sync"** in der Sidebar → **"Jetzt synchronisieren"**

Das Dashboard lädt jetzt automatisch alle Sales und Affiliates live aus GoAffPro.

---

### Wie es technisch funktioniert
```
Browser → /.netlify/functions/goaffpro → api.goaffpro.com
```
- Dein API-Token bleibt **serverseitig** in der Netlify-Funktion
- Der Browser sieht den Token **nie**
- CORS-Problem ist damit automatisch gelöst

### Dateien in diesem Ordner
```
index.html                    ← Das Dashboard (Hauptdatei)
netlify.toml                  ← Netlify-Konfiguration
netlify/functions/goaffpro.js ← Proxy-Funktion (schützt API-Key)
README.md                     ← Diese Anleitung
```
