<script setup lang="ts">
import LegalPage from '../components/LegalPage.vue'
</script>

<template>
  <LegalPage title="Datenschutzerklärung">
    <h2>Verantwortlicher</h2>
    <p>[Name, Anschrift und E-Mail der verantwortlichen Stelle]</p>

    <h2>Welche Daten verarbeitet werden</h2>
    <ul>
      <li>
        [Server-Logdaten beim Hosting (zum Beispiel IP-Adresse, Zeitpunkt, aufgerufene Seite):
        Hoster und Speicherdauer eintragen]
      </li>
      <li>[Konto- und Anmeldedaten: ergänzen, sobald die Anmeldung feststeht]</li>
      <li>
        [Kontaktdaten von Ansprechpersonen bei Verleihern (Name, E-Mail): Herkunft der Daten und
        Rechtsgrundlage klären]
      </li>
      <li>[Anfragen der Kinos (Kino, Datum, Verleiher, Kommentare)]</li>
    </ul>

    <h2>Speicherung im Browser</h2>
    <p>
      Die Anwendung speichert die gewählte Sprache im lokalen Speicher des Browsers. [Rechtliche
      Einordnung prüfen und ergänzen.]
    </p>

    <h2>Externe Dienste</h2>
    <p>
      [TMDB als Quelle der Filmdaten: Wenn Bilder direkt von TMDB geladen werden, erhält TMDB dabei
      die IP-Adresse der Besuchenden. Entsprechend beschreiben.]
    </p>

    <h2>Rechtsgrundlagen</h2>
    <p>
      [Passende Grundlagen aus Art. 6 DSGVO für jede der oben genannten Verarbeitungen eintragen]
    </p>

    <h2>Speicherdauer und Löschung</h2>
    <p>[Fristen eintragen]</p>

    <h2>Ihre Rechte</h2>
    <p>
      Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
      Datenübertragbarkeit und Widerspruch. Außerdem können Sie sich bei einer
      Datenschutz-Aufsichtsbehörde beschweren.
    </p>

    <h2>Kontakt für Datenschutzfragen</h2>
    <p>[Name und E-Mail-Adresse]</p>
  </LegalPage>
</template>
