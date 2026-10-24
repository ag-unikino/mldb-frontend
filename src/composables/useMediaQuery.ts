import { onUnmounted, ref } from 'vue'

export function useMediaQuery(query: string) {
  const mql = window.matchMedia(query)
  const matches = ref(mql.matches)

  function update() {
    matches.value = mql.matches
  }

  mql.addEventListener('change', update)
  onUnmounted(() => mql.removeEventListener('change', update))

  return matches
}
