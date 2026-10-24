<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const query = ref('')

watch(
  () => route.query.q,
  (q) => {
    query.value = typeof q === 'string' ? q : ''
  },
  { immediate: true },
)

function submit() {
  const q = query.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
}
</script>

<template>
  <form @submit.prevent="submit">
    <input
      v-model="query"
      type="search"
      :placeholder="t('search.placeholder')"
      :aria-label="t('search.label')"
    />
    <button type="submit">{{ t('search.button') }}</button>
  </form>
</template>
<style scoped>
form {
  display: flex;
  gap: var(--space-2);
}

input {
  flex: 1;
}
</style>
