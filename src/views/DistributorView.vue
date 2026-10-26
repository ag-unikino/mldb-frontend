<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getActiveNote, getDistributorById } from '../api/distributors'
import { getFilmById } from '../api/films'
import { getGrantedFilmIds } from '../api/requests'
import DistributorNotice from '../components/DistributorNotice.vue'
import LockedHint from '../components/LockedHint.vue'
import { useAuthStore } from '../stores/auth'
import { usePageTitle } from '../composables/usePageTitle'

const { t, locale } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const distributor = computed(() => {
  const id = Number(route.params.id)
  return Number.isInteger(id) ? getDistributorById(id) : undefined
})

usePageTitle(() => distributor.value?.name ?? t('distributors.notFound'))

const notice = computed(() => getActiveNote(distributor.value))

const films = computed(() => {
  const current = distributor.value
  if (!current) return []
  return getGrantedFilmIds(current.id)
    .flatMap((filmId) => {
      const film = getFilmById(filmId)
      return film ? [film] : []
    })
    .sort((a, b) => a.originalTitle.localeCompare(b.originalTitle, locale.value))
})
</script>

<template>
  <main>
    <template v-if="distributor">
      <h1>{{ distributor.name }}</h1>
      <DistributorNotice v-if="notice" :note="notice" />

      <section>
        <h2>{{ t('distributors.contacts') }}</h2>
        <LockedHint v-if="!auth.isLoggedIn" />
        <ul v-else-if="distributor.contacts?.length" class="plain">
          <li v-for="contact in distributor.contacts" :key="contact.email">
            <strong>{{ contact.name }}</strong>
            <span v-if="contact.role" class="subtle"> · {{ contact.role }}</span>
            · <a :href="'mailto:' + contact.email">{{ contact.email }}</a>
          </li>
        </ul>
        <p v-else class="subtle">{{ t('distributors.noContacts') }}</p>
      </section>

      <section v-if="distributor.info">
        <h2>{{ t('distributors.info') }}</h2>
        <p>{{ distributor.info }}</p>
      </section>

      <section>
        <h2>{{ t('distributors.films') }}</h2>
        <ul v-if="films.length" class="plain">
          <li v-for="film in films" :key="film.id">
            <RouterLink :to="{ name: 'film', params: { id: film.id } }">
              {{ film.originalTitle }}
            </RouterLink>
            ({{ film.year }})
          </li>
        </ul>
        <p v-else class="subtle">{{ t('distributors.noFilms') }}</p>
      </section>
    </template>
    <p v-else>{{ t('distributors.notFound') }}</p>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-3);
  font-size: 1.5rem;
}

section {
  margin-top: var(--space-6);
}

h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.125rem;
}

p {
  margin: 0;
}

.plain {
  margin: 0;
  padding: 0;
  list-style: none;
}

.plain li {
  margin-bottom: var(--space-1);
}

.subtle {
  color: var(--color-text-muted);
}
</style>
