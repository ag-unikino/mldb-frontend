<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
}>()

const errorId = computed(() => props.id + '-error')
const hintId = computed(() => props.id + '-hint')

const describedby = computed(
  () =>
    [props.hint ? hintId.value : '', props.error ? errorId.value : ''].filter(Boolean).join(' ') ||
    undefined,
)
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}<span v-if="required" aria-hidden="true"> *</span></label>
    <slot :id="id" :invalid="!!error" :describedby="describedby" />
    <p v-if="hint" :id="hintId" class="hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: var(--space-1);
}

.hint {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.error {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-status-declined);
}
</style>
