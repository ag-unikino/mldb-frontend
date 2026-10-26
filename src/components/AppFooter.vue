<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="app-footer">
    <div class="container app-footer__inner">
      <span>{{ t('app.title') }}</span>
      <nav :aria-label="t('footer.label')">
        <RouterLink :to="{ name: 'imprint' }">{{ t('footer.imprint') }}</RouterLink>
        <RouterLink :to="{ name: 'privacy' }">{{ t('footer.privacy') }}</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  font-size: 0.875rem;
  color: var(--color-primary-contrast);
  background: var(--color-primary);
}

.app-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2) var(--space-6);
  padding-top: var(--space-3);
  padding-bottom: var(--space-3);
}

nav {
  display: flex;
  gap: var(--space-4);
}

a {
  color: inherit;
}

a:hover {
  text-decoration: none;
}

a[aria-current='page'] {
  font-weight: 600;
}

a:focus-visible {
  outline-color: var(--color-primary-contrast);
}
</style>
