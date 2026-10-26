<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isEdit = computed(() => route.name === 'request-edit')
</script>

<template>
  <main>
    <h1>{{ isEdit ? 'Anfrage bearbeiten' : 'Neue Anfrage' }}</h1>
    <p>Platzhalter: Hier kommt das Formular hin.</p>
    <p v-if="isEdit">Anfrage-ID: {{ route.params.id }}</p>
    <p v-else-if="route.query.filmId">Film-ID: {{ route.query.filmId }}</p>
  </main>
</template>
