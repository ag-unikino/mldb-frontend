<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getActiveNote, getAllDistributors } from '../api/distributors'
import { getGrantedFilmIds } from '../api/requests'
import { matches } from '../utils/text'
import { usePageTitle } from '../composables/usePageTitle'

const { t, locale } = useI18n()
usePageTitle(() => t('distributors.title'))

const filter = ref('')

const items = computed(() =>
  getAllDistributors()
    .filter((distributor) => matches(distributor.name, filter.value))
    .sort((a, b) => a.name.localeCompare(b.name, locale.value))
    .map((distributor) => ({
      distributor,
      hasNotice: !!getActiveNote(distributor),
      filmCount: getGrantedFilmIds(distributor.id).length,
    })),
)
</script>

<template>
  <main>
    <h1>{{ t('distributors.title') }}</h1>
    <label class="filter">
      {{ t('distributors.filter') }}
      <input v-model="filter" type="search" />
    </label>

    <p v-if="items.length === 0" class="empty">{{ t('distributors.noMatches') }}</p>
    <ul v-else class="list">
      <li v-for="item in items" :key="item.distributor.id">
        <RouterLink :to="{ name: 'distributor', params: { id: item.distributor.id } }" class="item">
          <span class="name">
            {{ item.distributor.name }}
            <span
              v-if="item.hasNotice"
              class="notice-marker"
              role="img"
              :aria-label="t('requests.noticeMarker')"
              >⚠</span
            >
          </span>
          <span class="count">{{ t('distributors.filmCount', item.filmCount) }}</span>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
}

.filter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
}

.filter input {
  flex: 1;
  min-width: 0;
  max-width: 24rem;
}

.empty {
  color: var(--color-text-muted);
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--color-border);
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-2);
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
}

.item:hover {
  background: var(--color-surface);
}

.name {
  font-weight: 600;
}

.notice-marker {
  margin-left: var(--space-1);
  color: var(--color-warning);
}

.count {
  color: var(--color-text-muted);
  white-space: nowrap;
}
</style>
