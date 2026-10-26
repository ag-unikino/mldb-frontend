<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ id: number; title: string; posterPath?: string }>()

// Posters are loaded from TMDB's image server. Only the short path (like "/abc123.jpg")
// is stored in our database, never the image itself. Use only poster sizes that TMDB lists.
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w185'

const hue = computed(() => (props.id * 47) % 360)

const failed = ref(false)
const posterUrl = computed(() =>
  props.posterPath && !failed.value ? POSTER_BASE_URL + props.posterPath : undefined,
)
</script>

<template>
  <span
    class="poster"
    :class="{ 'has-image': !!posterUrl }"
    :style="{ '--hue': hue }"
    aria-hidden="true"
  >
    <img
      v-if="posterUrl"
      class="image"
      :src="posterUrl"
      alt=""
      loading="lazy"
      referrerpolicy="no-referrer"
      @error="failed = true"
    />
    <span v-else class="title">{{ title }}</span>
  </span>
</template>

<style scoped>
.poster {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 2 / 3;
  padding: var(--space-1);
  overflow: hidden;
  container-type: inline-size;
  background: hsl(var(--hue) 30% 30%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.poster.has-image {
  position: relative;
  padding: 0;
}

.image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  max-width: 100%;
  padding-bottom: 0.2em;
  overflow: hidden;
  overflow-wrap: anywhere;
  font-size: 0.75rem;
  font-size: clamp(0.5rem, 14cqw, 1rem);
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  color: #fff;
}
</style>
