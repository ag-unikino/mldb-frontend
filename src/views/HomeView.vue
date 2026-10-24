<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RecentActivity from '../components/RecentActivity.vue'
import SearchBar from '../components/SearchBar.vue'

const { t } = useI18n()
</script>

<template>
  <main>
    <section class="hero">
      <h1>{{ t('home.headline') }}</h1>
      <div class="hero-search">
        <SearchBar large />
      </div>
    </section>

    <RecentActivity />

    <section class="my-requests">
      <h2>{{ t('home.myRequests.title') }}</h2>
      <p>{{ t('home.myRequests.loggedOut') }}</p>
    </section>
  </main>
</template>

<style scoped>
.hero {
  padding: var(--space-6) 0;
}

h1 {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
}

.hero-search {
  max-width: 40rem;
}

.my-requests {
  margin-top: var(--space-6);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
}

.my-requests h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.125rem;
  color: var(--color-text);
}

.my-requests p {
  margin: 0;
}
</style>
