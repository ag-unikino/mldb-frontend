<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getFilmById } from '../api/films'
import { getRequestById } from '../api/requests'
import RequestForm from '../components/RequestForm.vue'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const route = useRoute()
const auth = useAuthStore()

const isEdit = computed(() => route.name === 'request-edit')

const request = computed(() => {
  if (!isEdit.value) return undefined
  const id = Number(route.params.id)
  return Number.isInteger(id) ? getRequestById(id) : undefined
})

const initialFilmId = computed(() => {
  const id = Number(route.query.filmId)
  return Number.isInteger(id) && getFilmById(id) ? id : undefined
})

const canEdit = computed(
  () => !!request.value && !!auth.account?.cinemas.includes(request.value.cinema),
)
</script>

<template>
  <main>
    <h1>{{ isEdit ? t('requestForm.titleEdit') : t('requestForm.titleNew') }}</h1>

    <template v-if="!auth.isLoggedIn">
      <p>{{ t('requestForm.loginRequired') }}</p>
      <button type="button" @click="auth.login()">{{ t('auth.login') }}</button>
    </template>
    <p v-else-if="isEdit && !request">{{ t('requestForm.notFound') }}</p>
    <p v-else-if="isEdit && !canEdit">{{ t('requestForm.noPermission') }}</p>
    <RequestForm
      v-else
      :key="request?.id ?? 'new'"
      :request="request"
      :initial-film-id="initialFilmId"
    />
  </main>
</template>

<style scoped>
h1 {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
}
</style>
