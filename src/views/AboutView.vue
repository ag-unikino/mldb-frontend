<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import tmdbLogo from '../assets/tmdb-logo.svg'

type DeveloperRole = 'frontend' | 'backend'

const { t } = useI18n()

const developers: { name: string; role: DeveloperRole }[] = [
  { name: 'Simon Pfannschmidt', role: 'frontend' },
  { name: 'Jan Eike Suchard', role: 'backend' },
]

// Wording prescribed by TMDB. Deliberately not translated.
const TMDB_NOTICE = 'This product uses the TMDB API but is not endorsed or certified by TMDB.'
</script>

<template>
  <main class="about">
    <h1>{{ t('about.title') }}</h1>

    <section aria-labelledby="who-heading">
      <h2 id="who-heading">{{ t('about.who.title') }}</h2>
      <p>{{ t('about.who.bkf') }}</p>
      <p>{{ t('about.who.agUnikino') }}</p>
      <p>
        <a href="https://www.kommunale-kinos.de" target="_blank" rel="noopener noreferrer">
          {{ t('about.who.bkfLink') }}
        </a>
      </p>
    </section>

    <section aria-labelledby="developers-heading">
      <h2 id="developers-heading">{{ t('about.developers.title') }}</h2>
      <ul class="people">
        <li v-for="developer in developers" :key="developer.name">
          <strong>{{ developer.name }}</strong>
          <span class="subtle"> · {{ t('about.developers.' + developer.role) }}</span>
        </li>
      </ul>
    </section>

    <section aria-labelledby="sources-heading">
      <h2 id="sources-heading">{{ t('about.sources') }}</h2>
      <p>{{ t('about.tmdb') }}</p>
      <a
        class="logo-link"
        href="https://www.themoviedb.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img class="logo" :src="tmdbLogo" :alt="t('about.tmdbLogoAlt')" />
      </a>
      <p class="notice" lang="en">{{ TMDB_NOTICE }}</p>
    </section>
  </main>
</template>

<style scoped>
.about {
  max-width: 40rem;
}

h1 {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
}

section + section {
  margin-top: var(--space-6);
}

h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.125rem;
}

p {
  margin: 0 0 var(--space-2);
}

.subtle {
  color: var(--color-text-muted);
}

.people {
  margin: 0;
  padding: 0;
  list-style: none;
}

.logo-link {
  display: inline-block;
  margin: var(--space-2) 0;
}

.logo {
  display: block;
  height: 1.25rem;
  width: auto;
}

.notice {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
