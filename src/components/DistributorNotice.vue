<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DistributorNote } from '../api/distributors'
import { useDateFormat } from '../composables/useDateFormat'

defineProps<{ note: DistributorNote }>()

const { t } = useI18n()
const { formatDate } = useDateFormat()
</script>

<template>
  <p class="notice">
    <span class="notice-icon" role="img" :aria-label="t('summary.notice')">⚠</span>
    <span>
      {{ note.text }}
      <span v-if="note.validUntil" class="subtle">
        ({{ t('summary.validUntil', { date: formatDate(note.validUntil) }) }})
      </span>
    </span>
  </p>
</template>

<style scoped>
.notice {
  display: flex;
  gap: var(--space-2);
  margin: var(--space-2) 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius);
}

.notice-icon {
  color: var(--color-warning);
}

.subtle {
  color: var(--color-text-muted);
}
</style>
