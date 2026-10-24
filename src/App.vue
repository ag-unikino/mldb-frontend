<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import { useAuthStore } from './stores/auth'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()
</script>

<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink to="/" class="app-title">{{ t('app.title') }}</RouterLink>
      <SearchBar v-if="route.name !== 'home'" class="app-search" />
      <div class="app-end">
        <nav class="app-nav" :aria-label="t('nav.main')">
          <RouterLink :to="{ name: 'distributors' }">{{ t('nav.distributors') }}</RouterLink>
        </nav>
        <div class="app-account">
          <template v-if="auth.isLoggedIn">
            <span class="account-name">{{ auth.account?.name }}</span>
            <button type="button" class="account-button" @click="auth.logout()">
              {{ t('auth.logout') }}
            </button>
          </template>
          <button v-else type="button" class="account-button" @click="auth.login()">
            {{ t('auth.login') }}
          </button>
        </div>
      </div>
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
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2) var(--space-6);
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
  flex: 1 1 16rem;
}

.app-end {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-left: auto;
}

.app-nav a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.app-nav a:hover {
  color: var(--color-text);
}

.app-nav a.router-link-active {
  color: var(--color-text);
  font-weight: 600;
}

.app-account {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.account-name {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.account-button {
  color: var(--color-text);
  white-space: nowrap;
  background: transparent;
  border-color: var(--color-border);
}

.page {
  padding-top: var(--space-6);
  padding-bottom: var(--space-6);
}

@media (max-width: 46rem) {
  .app-end {
    order: 1;
  }

  .app-search {
    order: 2;
    flex-basis: 100%;
  }
}
</style>
