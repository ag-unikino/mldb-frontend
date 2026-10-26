export const FORMATS = [
  { value: '35mm', label: '35mm' },
  { value: 'bluray', label: 'Blu-ray' },
  { value: 'dcp', label: 'DCP' },
] as const

export type FilmFormat = (typeof FORMATS)[number]['value']

export function formatLabel(format: FilmFormat): string {
  return FORMATS.find((entry) => entry.value === format)?.label ?? format
}

export const LANGUAGE_SUGGESTIONS = ['OV', 'OmdU', 'OmeU', 'DF']
