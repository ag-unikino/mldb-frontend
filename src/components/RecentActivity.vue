<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getRecentActivity } from '../api/activity'
import { getFilmById } from '../api/films'
import { useDateFormat } from '../composables/useDateFormat'
import FilmPoster from './FilmPoster.vue'

const { t } = useI18n()
const { formatRelative } = useDateFormat()

const items = computed(() =>
  getRecentActivity().flatMap((item) => {
    const film = getFilmById(item.filmId)
    return film ? [{ ...item, film }] : []
  }),
)
</script>

<template>
  <section v-if="items.length">
    <h2>{{ t('home.recent') }}</h2>
    <ul class="row">
      <li v-for="item in items" :key="item.id">
        <RouterLink :to="{ name: 'film', params: { id: item.film.id } }" class="item">
          <FilmPoster
            :id="item.film.id"
            :title="item.film.originalTitle"
            :poster-path="item.film.posterPath"
          />
          <span class="title">{{ item.film.originalTitle }}</span>
          <span class="meta">
            {{ t('home.activity.' + item.type) }} · {{ formatRelative(item.at) }}
          </span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section {
  margin-top: var(--space-6);
}

h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
  color: var(--color-text);
  text-decoration: none;
}

.item:hover :deep(.poster) {
  border-color: var(--color-primary);
}

.title {
  font-weight: 600;
}

.meta {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>
