<template>
  <h2>Wahlen</h2>
  <p>TODO</p>
  <h2>Benutzer*innenverwaltung</h2>
  <p>
    Benutzer*innen haben einen Benutzer*innennamen (verpflichtend), Klarnamen (optional),
    E-Mail-Addresse (optional) und eine Rolle (Standard oder Admin). Beim Anlegen neuer
    Benutzer*innen kann ein Passwort angegeben werden. Wenn <em>kein</em> Passwort angegeben wird,
    <em>muss</em> eine E-Mail-Adresse angegeben werden. An diese E-Mail-Adresse wird ein Link gesendet,
    über den ein Passwort gesetzt werden kann. Das Passwort muss in jedem Fall Mindestanforderungen entsprechen
    (mindestens 8 Zeichen, darunter Groß- und Kleinbuchstaben, mindestens eine Ziffer und ein Sonderzeichen).
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
