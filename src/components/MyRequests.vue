<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDistributorById } from '../api/distributors'
import { getFilmById } from '../api/films'
import { getRequestsForCinemas } from '../api/requests'
import { useDateFormat } from '../composables/useDateFormat'
import { useAuthStore } from '../stores/auth'
import ActionLink from './ActionLink.vue'

const { t } = useI18n()
const { formatDate } = useDateFormat()
const auth = useAuthStore()

const items = computed(() =>
  getRequestsForCinemas(auth.account?.cinemas ?? []).flatMap((request) => {
    const film = getFilmById(request.filmId)
    return film ? [{ request, film }] : []
  }),
)

function distributorName(id: number): string {
  return getDistributorById(id)?.name ?? '–'
}
</script>

<template>
  <section class="my-requests" :class="{ placeholder: !auth.isLoggedIn }">
    <div class="heading">
      <h2>{{ t('home.myRequests.title') }}</h2>
      <ActionLink v-if="auth.isLoggedIn" :to="{ name: 'request-new' }">
        {{ t('requests.new') }}
      </ActionLink>
    </div>
    <template v-if="auth.isLoggedIn">
      <p class="subtle">
        {{ t('home.myRequests.cinemas', { cinemas: auth.account?.cinemas.join(', ') }) }}
      </p>
      <p v-if="items.length === 0" class="subtle">{{ t('home.myRequests.empty') }}</p>
      <ul v-else class="list">
        <li v-for="{ request, film } in items" :key="request.id">
          <span class="date">{{ formatDate(request.requestedAt) }}</span>
          <RouterLink :to="{ name: 'film', params: { id: film.id } }">
            {{ film.originalTitle }}
          </RouterLink>
          <span class="subtle">
            {{ distributorName(request.distributorId) }} ·
            {{ t('requests.status.' + request.status) }}
          </span>
          <RouterLink :to="{ name: 'request-edit', params: { id: request.id } }">
            {{ t('requests.edit') }}
          </RouterLink>
        </li>
      </ul>
    </template>
    <p v-else class="subtle">{{ t('home.myRequests.loggedOut') }}</p>
  </section>
</template>

<style scoped>
.my-requests {
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.my-requests.placeholder {
  background: transparent;
  border-style: dashed;
}

.heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-4);
  margin-bottom: var(--space-2);
}

h2 {
  margin: 0;
  font-size: 1.125rem;
}

p {
  margin: 0 0 var(--space-2);
}

.subtle {
  color: var(--color-text-muted);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.list li {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1) var(--space-3);
  padding: var(--space-2) 0;
  border-top: 1px solid var(--color-border);
}

.date {
  font-variant-numeric: tabular-nums;
  color: var(--color-text-muted);
}
</style>
