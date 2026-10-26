<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getActiveNote, getDistributorById } from '../api/distributors'
import type { FilmRequest } from '../api/requests'
import { useDateFormat } from '../composables/useDateFormat'
import DistributorNotice from './DistributorNotice.vue'
import { useAuthStore } from '../stores/auth'
import LockedHint from './LockedHint.vue'
import { formatLabel } from '../constants/requestOptions'

const props = defineProps<{ requests: FilmRequest[] }>()

const { t } = useI18n()
const { formatDate, formatRelative } = useDateFormat()
const auth = useAuthStore()

function answeredDate(request: FilmRequest): string {
  return request.answeredAt ?? request.requestedAt
}

const lastGranted = computed(() =>
  props.requests
    .filter((request) => request.status === 'granted')
    .reduce<FilmRequest | undefined>((latest, request) => {
      if (!latest) return request
      return answeredDate(request).localeCompare(answeredDate(latest)) > 0 ? request : latest
    }, undefined),
)

const distributor = computed(() =>
  lastGranted.value ? getDistributorById(lastGranted.value.distributorId) : undefined,
)

const distributorName = computed(() => distributor.value?.name ?? '–')

const notice = computed(() => getActiveNote(distributor.value))

const openCount = computed(() => props.requests.filter((r) => r.status === 'open').length)
const declinedCount = computed(() => props.requests.filter((r) => r.status === 'declined').length)
</script>
<template>
  <section v-if="requests.length" class="summary">
    <h2>{{ t('summary.title') }}</h2>
    <template v-if="lastGranted">
      <p class="main">
        <RouterLink :to="{ name: 'distributor', params: { id: lastGranted.distributorId } }">
          <strong>{{ distributorName }}</strong>
        </RouterLink>
        · {{ formatLabel(lastGranted.format) }} · {{ lastGranted.language }}
      </p>
      <DistributorNotice v-if="notice" :note="notice" />
      <p class="subtle">
        {{
          t('summary.answered', {
            date: formatDate(answeredDate(lastGranted)),
            relative: formatRelative(answeredDate(lastGranted)),
          })
        }}
      </p>
      <p v-if="!auth.isLoggedIn">{{ t('summary.contact') }}: <LockedHint /></p>
      <p v-else-if="lastGranted.contact">
        {{ t('summary.contact') }}: {{ lastGranted.contact.name }}
        <template v-if="lastGranted.contact.email">
          ·
          <a :href="'mailto:' + lastGranted.contact.email">{{ lastGranted.contact.email }}</a>
        </template>
      </p>
      <p v-else class="subtle">{{ t('summary.noContact') }}</p>
    </template>
    <p v-else class="subtle">{{ t('summary.none') }}</p>
    <p class="subtle counts">
      {{ t('summary.counts', { open: openCount, declined: declinedCount }) }}
    </p>
  </section>
</template>

<style scoped>
.summary {
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius);
}

h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.125rem;
}

p {
  margin: 0 0 var(--space-1);
}

.subtle {
  color: var(--color-text-muted);
}

.counts {
  margin-top: var(--space-2);
}
</style>
