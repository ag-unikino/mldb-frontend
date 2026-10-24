<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { searchFilms } from '../api/films'

const route = useRoute()

const query = computed(() => {
  const q = route.query.q
  return typeof q === 'string' ? q : ''
})

const results = computed(() => searchFilms(query.value))
</script>

<template>
  <main>
    <p v-if="!query">{{ $t('search.noQuery') }}</p>
    <template v-else>
      <p>{{ $t('search.resultsFor', { query }) }}</p>
      <p v-if="results.length === 0">{{ $t('search.noResults') }}</p>
      <ul v-else>
        <li v-for="film in results" :key="film.id">
          <RouterLink :to="{ name: 'film', params: { id: film.id } }">
            <strong>{{ film.originalTitle }}</strong>
          </RouterLink>
          ({{ film.year }})
          <br />
          {{ film.germanTitle }} · {{ film.distributor }}
        </li>
      </ul>
    </template>
  </main>
</template>
