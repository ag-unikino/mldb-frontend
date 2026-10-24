<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const auth = useAuthStore()
</script>

<template>
  <span class="locked">
    <span aria-hidden="true">🔒</span>
    {{ t('auth.contactsLocked') }} ·
    <button type="button" class="link" @click="auth.login()">{{ t('auth.login') }}</button>
  </span>
</template>

<style scoped>
.locked {
  color: var(--color-text-muted);
}

.link {
  padding: 0;
  font: inherit;
  color: var(--color-primary);
  text-decoration: underline;
  background: transparent;
  border: 0;
}
</style>