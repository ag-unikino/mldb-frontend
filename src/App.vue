<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchBar from './components/SearchBar.vue'

const { t } = useI18n()
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-title">{{ t('app.title') }}</RouterLink>
      <SearchBar class="app-search" />
    </div>
  </header>
  <div class="container page">
    <RouterView />
  </div>
</template>

<style scoped>
.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  padding-top: var(--space-3);
  padding-bottom: var(--space-3);
}

.app-title {
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
  white-space: nowrap;
}

.app-title:hover {
  color: var(--color-primary);
}

.app-search {
  flex: 1;
}

.page {
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
}
</style>
