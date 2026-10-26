<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <main class="legal" lang="de">
    <h1>{{ title }}</h1>
    <p class="notice">
      <strong>Platzhalter:</strong> Dieser Text ist nur eine Gliederung und kein gültiger
      Rechtstext. Die Angaben in eckigen Klammern müssen vor einer Veröffentlichung ausgefüllt und
      rechtlich geprüft werden.
    </p>
    <slot />
  </main>
</template>

<style scoped>
.legal {
  max-width: 40rem;
}

h1 {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
}

.notice {
  margin: 0 0 var(--space-6);
  padding: var(--space-2) var(--space-3);
  border: 1px dashed var(--color-warning);
  border-radius: var(--radius);
}

:slotted(h2) {
  margin: var(--space-6) 0 var(--space-2);
  font-size: 1.125rem;
}

:slotted(p) {
  margin: 0 0 var(--space-2);
}

:slotted(ul) {
  margin: 0 0 var(--space-2);
  padding-left: var(--space-4);
}
</style>
