<template>
  <h2>Wahlen</h2>
  <p>Wahlen können nur von Administrator*innen angelegt, geändert, gelöscht, archiviert und ausgewertet werden.</p>
  <h3>Status einer Wahl</h3>
  <p>Jede Wahl hat einen Status:</p>
  <ul>
    <li><b>Erstellt</b> - Die Einstellungen der Wahl und die Kandidat*innenliste können bearbeitet werden, die Wahl kann auch noch gelöscht werden. Ist man mit der Konfiguration der Wahl und der Kandidat*innenliste fertig, wird die wahl <em>freigegeben</em></li>
    <li><b>Auszählung läuft</b> - Stimmen können jetzt erfasst werden. Einstellungen und Kandidat*innenliste können nicht mehr bearbeitet werden. Erfasste Stimmzettel können von Administrator*innen kontrolliert und gegebenenfalls gelöscht werden. Ist die Auszählung abgeschlossen, wird die Wahl <em>ausgewertet</em></li>
    <li><b>Erfassung abgeschlossen</b> - Nur noch Administrator*innen können jetzt noch Stimmen nachtragen order löschen. Außerdem können die Stimmen ausgewertet werden, um zu einem Ergebnis zu kommen.</li>
    <li><b>Ergebnis liegt vor</b> - Ein <em>gültiges</em> Ergebnis für die Wahl liegt vor.</li>
    <li><b>Abgeschlossen</b> - Die Wahl wurde archiviert und ein Ergebnis wurde heruntergeladen. Archivierte Wahlen werden ausgeblendet, außer die/der Benutzer*in blendet sie explizit ein (Häkchen "Archivierte Wahlen anzeigen" ist gesetzt)</li>
  </ul>
  <p>Lediglich <b>das Erfassen von Stimmen</b> ist auch Standard-Benutzer*innen gestattet.</p>
  <h3>Anlegen von Wahlen (nur für Administrator*innen)</h3>
  <p>
    Wenn Sie eine neue Wahl anlegen, muss eine Bezeichnung angegben werden, die Beschreibung ist optional. Die weiteren
    Parameter werden für die Konfiguration des Auszähl-Tools <em>Vota</em>(siehe 
    <a href="https://gitlab.com/mtausig/vota" target="_blank">https://gitlab.com/mtausig/vota</a>) verwendet. Nach der 
    Konfiguration der Wahl muss noch die Kandidat*innenliste erstellt werden. Ist man mit der Konfiguration der Wahl und dem Erstellen
    der Kandidat*innenliste fertig, wird die Wahl <em>freigegeben</em>. Erst wenn eine Wahl freigegeben ist, ist sie für Standard-Benutzer*innen sichtbar.
  </p>
  <h3>
    Erfassen der Stimmen
  </h3>
  <p>
    Beim erfassen der Stimmen muss ein*e angemeldete Benutzer*in angeben, wer an der Zählstelle sitzt und was die Bezeichnung der Zählstelle ist.
    Erst dann können Stimmen erfasst werden. Dafür werden Kandidat*innen von der Kandidat*innenliste in die Reihungsliste gezogen.
    Die Stimmzettel-Nummer wird nach jedem Stimmzettel automatisch erhöht, sollte aber trotzdem immer kontrolliert werden.<br>
    Wurden alle Stimmzettel an einer Zählstelle erfasst, kann die Erfassung abgeschlossen werden (Button <em>Erfassung abschließen</em>).
  </p>
  <p>Administrator*innen können die Stimmzettel kontrollieren und gegebenenfalls löschen.</p>
  <h3>Auswerten (nur für Administrator*innen)</h3>
  <p>Ist die Auszählung abgeschlossen, können die Ergebnisse ausgewertet werden (Button <em>Ergebnisse</em>). Standard-Benutzer*innen können jetzt keine Stimmen mehr erfassen, Administrator*innen können aber die Stimmen kontrollieren, gegebenfalls löschen oder nachtragen.
    Außerdem können Wahlen jetzt ausgewertet werden. In einem <em>Testlauf</em> wird ein Ergebnis mit dem Tool <em>Vota</em> berechnet, das Ergebnis wird aber 
    nicht als gültig markiert. Erst wenn eine Auswertung durchgeführt wird, die nicht als Testlauf markiert ist, liegt ein gültiges Ergebnis vor.
  </p>
  <p>
    Die Protokolle (<em>Ergebnisse</em>, <em>Logs</em> und <em>Statistiken</em>) werden vom Tool Vota erzeugt und nur um die Anzahl ungültiger Stimmen ergänzt.
  </p>
  <h3>Archivieren (nur für Administrator*innen)</h3>
  <p>
    Nach Drücken des Buttons <em>Archivieren</em> kann man ein oder mehrere Wahlen auswählen, die archiviert werden sollen. Die Ergebnisse werden in .zip-Paketen zusammengefasst und können anschließend heruntergeladen werden.
    Archivierte Wahlen werden anschließend ausgeblendet und können wieder eingeblendet werden, wenn das gewünscht ist (Häkchen <em>Archivierte Wahlen anzeigen</em>).
  </p>
  <h2>Benutzer*innenverwaltung</h2>
  <p>
    Benutzer*innen haben einen Benutzer*innennamen (verpflichtend), Klarnamen (optional),
    E-Mail-Addresse (optional) und eine Rolle (Standard oder Admin). Beim Anlegen neuer
    Benutzer*innen kann ein Passwort angegeben werden. Wenn <em>kein</em> Passwort angegeben wird,
    <em>muss</em> eine E-Mail-Adresse angegeben werden. An diese E-Mail-Adresse wird ein Link gesendet,
    über den ein Passwort gesetzt werden kann. Das Passwort muss in jedem Fall Mindestanforderungen entsprechen
    (mindestens 8 Zeichen).
  </p>
  <p>
    <b>Standardbenutzer*innen</b> dürfen nur Stimmen erfassen, haben sonst keine Berechtigungen.
    <b>Administrator*innen</b> dürfen ebenfalls Stimmen erfassen, dürfen aber auch
  </p>
  <ul>
    <li>Benutzer*innen anlegen, bearbeiten und löschen</li>
    <li>Wahlen anlegen, bearbeiten und gegebenenfalls löschen</li>
    <li>Die Auswertung eines Wahlergebnisses starten</li>
  </ul>
</template>
