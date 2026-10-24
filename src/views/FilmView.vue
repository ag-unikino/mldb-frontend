<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getFilmById } from '../api/films'

const route = useRoute()

const film = computed(() => {
  const id = Number(route.params.id)
  return Number.isInteger(id) ? getFilmById(id) : undefined
})
</script>

<template>
  <main>
    <template v-if="film">
      <h1>{{ film.originalTitle }}</h1>
      <dl class="details">
        <dt>{{ $t('film.germanTitle') }}</dt>
        <dd>{{ film.germanTitle }}</dd>
        <dt>{{ $t('film.year') }}</dt>
        <dd>{{ film.year }}</dd>
        <dt>{{ $t('film.distributor') }}</dt>
        <dd>{{ film.distributor }}</dd>
      </dl>
    </template>
    <p v-else>{{ $t('film.notFound') }}</p>
  </main>
</template>

<style scoped>
h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-2) var(--space-6);
}

dt {
  color: var(--color-text-muted);
}

dd {
  margin: 0;
}
</style>
