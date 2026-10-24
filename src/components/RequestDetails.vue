<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getActiveNote, getDistributorById } from '../api/distributors'
import type { FilmRequest } from '../api/requests'
import { useDateFormat } from '../composables/useDateFormat'

const props = defineProps<{ request: FilmRequest }>()

const { t } = useI18n()
const { formatDate } = useDateFormat()

const notice = computed(() => getActiveNote(getDistributorById(props.request.distributorId)))

function distributorName(id: number): string {
  return getDistributorById(id)?.name ?? '–'
}
</script>

<template>
  <dl class="details">
    <template v-if="notice">
      <dt>{{ t('requests.details.distributorNotice') }}</dt>
      <dd>{{ notice.text }}</dd>
    </template>
    <template v-if="request.answeredAt">
      <dt>{{ t('requests.details.answeredAt') }}</dt>
      <dd>{{ formatDate(request.answeredAt) }}</dd>
    </template>
    <dt>{{ t('requests.details.contact') }}</dt>
    <dd v-if="request.contact">
      {{ request.contact.name }} ·
      <a :href="'mailto:' + request.contact.email">{{ request.contact.email }}</a>
    </dd>
    <dd v-else class="subtle">{{ t('requests.details.noContact') }}</dd>
    <template v-if="request.adRights">
      <dt>{{ t('requests.details.adRights') }}</dt>
      <dd>{{ request.adRights }}</dd>
    </template>
    <template v-if="request.comment">
      <dt>{{ t('requests.details.comment') }}</dt>
      <dd>{{ request.comment }}</dd>
    </template>
    <template v-if="request.declineReason">
      <dt>{{ t('requests.details.declineReason') }}</dt>
      <dd>{{ request.declineReason }}</dd>
    </template>
    <template v-if="request.referredToDistributorId !== undefined">
      <dt>{{ t('requests.details.referredTo') }}</dt>
      <dd>{{ distributorName(request.referredToDistributorId) }}</dd>
    </template>
  </dl>
</template>

<style scoped>
.details {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-1) var(--space-6);
  margin: 0;
}

.details dt {
  color: var(--color-text-muted);
}

.details dd {
  margin: 0;
}

.subtle {
  color: var(--color-text-muted);
}
</style>
