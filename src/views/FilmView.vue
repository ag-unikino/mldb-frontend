<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getFilmById, type FilmLinkSource } from '../api/films'
import RequestsTable from '../components/RequestsTable.vue'
import { getRequestsForFilm } from '../api/requests'
import RequestSummary from '../components/RequestSummary.vue'
import FilmDetails from '../components/FilmDetails.vue'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
const route = useRoute()

const film = computed(() => {
  const id = Number(route.params.id)
  return Number.isInteger(id) ? getFilmById(id) : undefined
})
usePageTitle(() => film.value?.originalTitle ?? t('film.notFound'))
const requests = computed(() => (film.value ? getRequestsForFilm(film.value.id) : []))

const linkLabels: Record<FilmLinkSource, string> = {
  imdb: 'IMDb',
  tmdb: 'TMDB',
  wikidata: 'Wikidata',
  allscreens: 'AllScreens',
  filmportal: 'Filmportal',
}

const otherTitles = computed(() => {
  const f = film.value
  if (!f) return []
  return [f.germanTitle, f.englishTitle].filter(
    (title): title is string => !!title && title !== f.originalTitle,
  )
})

const meta = computed(() => {
  const f = film.value
  if (!f) return []
  const parts: string[] = [String(f.year)]
  if (f.fsk !== undefined) parts.push(t('film.fsk', { rating: f.fsk }))
  if (f.runtimeMinutes !== undefined) parts.push(t('film.minutes', { minutes: f.runtimeMinutes }))
  return parts
})
</script>

<template>
  <main>
    <template v-if="film">
      <h1>{{ film.originalTitle }}</h1>
      <p v-if="otherTitles.length" class="subtle">{{ otherTitles.join(' · ') }}</p>
      <p class="subtle">{{ meta.join(' · ') }}</p>
      <ul v-if="film.links?.length" class="links" :aria-label="t('film.links')">
        <li v-for="link in film.links" :key="link.source">
          <a :href="link.url" target="_blank" rel="noopener noreferrer">
            {{ linkLabels[link.source] }}
          </a>
        </li>
      </ul>
      <RequestSummary :requests="requests" />
      <RequestsTable :requests="requests" :film-id="film.id" />
      <FilmDetails :film="film" />
    </template>
    <p v-else>{{ t('film.notFound') }}</p>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-1);
  font-size: 1.5rem;
}

.subtle {
  margin: 0;
  color: var(--color-text-muted);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-4) 0 0;
  padding: 0;
  list-style: none;
}

.links a {
  display: block;
  padding: var(--space-1) var(--space-2);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.links a:hover {
  border-color: var(--color-primary);
}
</style>
