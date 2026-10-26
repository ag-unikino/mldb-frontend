<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { searchFilms } from '../api/films'
import FilmPoster from '../components/FilmPoster.vue'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
const route = useRoute()

const query = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q : ''
})

usePageTitle(() =>
  query.value ? t('search.resultsFor', { query: query.value }) : t('search.title'),
)

const results = computed(() =>
  searchFilms(query.value).map((film) => {
    const otherTitles = [
      ...new Set(
        [film.germanTitle, film.englishTitle].filter(
          (title): title is string => !!title && title !== film.originalTitle,
        ),
      ),
    ]
    const meta = [String(film.year)]
    if (film.runtimeMinutes !== undefined) {
      meta.push(t('film.minutes', { minutes: film.runtimeMinutes }))
    }
    return { film, otherTitles, meta }
  }),
)
</script>

<template>
  <main>
    <h1>{{ t('search.title') }}</h1>

    <p v-if="!query" class="subtle">{{ t('search.noQuery') }}</p>
    <template v-else>
      <p class="summary">
        {{ t('search.resultsFor', { query }) }}
        <span class="subtle">· {{ t('search.resultCount', results.length) }}</span>
      </p>
      <p v-if="results.length === 0" class="subtle">{{ t('search.noResults') }}</p>
      <ul v-else class="results">
        <li v-for="{ film, otherTitles, meta } in results" :key="film.id">
          <RouterLink :to="{ name: 'film', params: { id: film.id } }" class="result">
            <span class="thumb">
              <FilmPoster
                :id="film.id"
                :title="film.originalTitle"
                :poster-path="film.posterPath"
              />
            </span>
            <span class="text">
              <span class="title">{{ film.originalTitle }}</span>
              <span v-if="otherTitles.length" class="subtle">{{ otherTitles.join(' · ') }}</span>
              <span class="subtle">{{ meta.join(' · ') }}</span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </template>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-3);
  font-size: 1.5rem;
}

.summary {
  margin: 0 0 var(--space-4);
}

.subtle {
  color: var(--color-text-muted);
}

.results {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.result {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3);
  color: var(--color-text);
  text-decoration: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.result:hover {
  border-color: var(--color-primary);
}

.thumb {
  flex: 0 0 5rem;
  align-self: flex-start;
  min-width: 0;
}

.text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
}
</style>
