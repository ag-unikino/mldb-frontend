<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ to: RouteLocationRaw }>()
</script>

<template>
  <RouterLink :to="to" class="action-link"><slot /></RouterLink>
</template>

<style scoped>
.action-link {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
}

.action-link:hover {
  color: var(--color-primary-contrast);
  background: var(--color-primary);
}
</style>
