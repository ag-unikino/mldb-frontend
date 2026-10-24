import { useI18n } from 'vue-i18n'

export function useDateFormat() {
  const { locale } = useI18n()

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(
      new Date(iso),
    )
  }

  function formatRelative(iso: string): string {
    const then = new Date(iso)
    const now = new Date()
    let months =
      (now.getUTCFullYear() - then.getUTCFullYear()) * 12 + (now.getUTCMonth() - then.getUTCMonth())
    if (now.getUTCDate() < then.getUTCDate()) months -= 1

    const formatter = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
    if (months >= 12) return formatter.format(-Math.floor(months / 12), 'year')
    if (months >= 1) return formatter.format(-months, 'month')
    const days = Math.floor((now.getTime() - then.getTime()) / 86_400_000)
    return formatter.format(-days, 'day')
  }

  return { formatDate, formatRelative }
}
