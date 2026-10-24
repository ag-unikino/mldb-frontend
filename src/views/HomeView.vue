<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MyRequests from '../components/MyRequests.vue'
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
    <MyRequests />
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
</style>
