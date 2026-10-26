<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MyRequests from '../components/MyRequests.vue'
import RecentActivity from '../components/RecentActivity.vue'
import SearchBar from '../components/SearchBar.vue'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
usePageTitle()
</script>

<template>
  <main>
    <div class="hero">
      <div class="hero-main">
        <h1>{{ t('home.headline') }}</h1>
        <SearchBar large />
      </div>

      <section class="intro" aria-labelledby="intro-heading">
        <h2 id="intro-heading">{{ t('home.intro.title') }}</h2>
        <div class="intro-columns">
          <p>{{ t('home.intro.what') }}</p>
          <p>{{ t('home.intro.who') }}</p>
          <p class="caveat">{{ t('home.intro.caveat') }}</p>
        </div>
      </section>
    </div>

    <RecentActivity />
    <MyRequests />
  </main>
</template>

<style scoped>
.hero {
  background: var(--color-surface);
  background: color-mix(in srgb, var(--color-primary) 5%, var(--color-surface));
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius);
}

.hero-main {
  padding: var(--space-4);
}

h1 {
  margin: 0 0 var(--space-4);
  font-size: clamp(1.5rem, 5vw, 2rem);
  line-height: 1.2;
}

.intro {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
}

.intro h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.125rem;
}

.intro-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: var(--space-3) var(--space-6);
}

.intro p {
  margin: 0;
}

.intro .caveat {
  color: var(--color-text-muted);
}

@media (min-width: 40rem) {
  .hero-main,
  .intro {
    padding: var(--space-6);
  }
}
</style>
