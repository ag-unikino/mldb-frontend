export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim()
}

export function matches(text: string, filter: string): boolean {
  const needle = normalize(filter)
  return needle === '' || normalize(text).includes(needle)
}
