<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Film } from '../api/films'
import { useDateFormat } from '../composables/useDateFormat'

const props = defineProps<{ film: Film }>()

const { t } = useI18n()
const { formatDate } = useDateFormat()

const hasContent = computed(
  () =>
    !!props.film.germanRelease ||
    !!props.film.worldPremiere ||
    !!props.film.versions?.length ||
    !!props.film.comment,
)
</script>

<template>
  <details v-if="hasContent" class="film-details">
    <summary>{{ t('filmDetails.title') }}</summary>

    <dl v-if="film.worldPremiere || film.germanRelease" class="info">
      <template v-if="film.worldPremiere">
        <dt>{{ t('filmDetails.worldPremiere') }}</dt>
        <dd>{{ formatDate(film.worldPremiere) }}</dd>
      </template>
      <template v-if="film.germanRelease">
        <dt>{{ t('filmDetails.germanRelease') }}</dt>
        <dd>{{ formatDate(film.germanRelease) }}</dd>
      </template>
    </dl>

    <template v-if="film.versions?.length">
      <h3>{{ t('filmDetails.versions') }}</h3>
      <ul class="versions">
        <li v-for="version in film.versions" :key="version.name">
          <strong>{{ version.name }}</strong>
          <span v-if="version.runtimeMinutes !== undefined">
            · {{ t('film.minutes', { minutes: version.runtimeMinutes }) }}
          </span>
          <span v-if="version.note" class="subtle"> — {{ version.note }}</span>
        </li>
      </ul>
    </template>

    <template v-if="film.comment">
      <h3>{{ t('filmDetails.comment') }}</h3>
      <p class="comment">{{ film.comment }}</p>
    </template>
  </details>
</template>

<style scoped>
.film-details {
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

summary {
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: 700;
}

h3 {
  margin: var(--space-4) 0 var(--space-2);
  font-size: 1rem;
}

.info {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-1) var(--space-6);
  margin: var(--space-3) 0 0;
}

.info dt {
  color: var(--color-text-muted);
}

.info dd {
  margin: 0;
}

.versions {
  margin: 0;
  padding-left: var(--space-4);
}

.subtle {
  color: var(--color-text-muted);
}

.comment {
  margin: 0;
}
</style>
