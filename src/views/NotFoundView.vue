<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
const route = useRoute()

usePageTitle(() => t('notFoundPage.title'))
</script>

<template>
  <main>
    <h1>{{ t('notFoundPage.title') }}</h1>
    <p>{{ t('notFoundPage.text') }}</p>
    <p>
      <code class="path">{{ route.fullPath }}</code>
    </p>
    <p class="subtle">{{ t('notFoundPage.hint') }}</p>
    <p>
      <RouterLink :to="{ name: 'home' }">{{ t('notFoundPage.home') }}</RouterLink>
    </p>
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-3);
  font-size: 1.5rem;
}

p {
  margin: 0 0 var(--space-3);
}

.path {
  font-family: var(--font-mono);
  overflow-wrap: anywhere;
}

.subtle {
  color: var(--color-text-muted);
}
</style>
