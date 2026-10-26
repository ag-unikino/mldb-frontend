import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

export function usePageTitle(title?: () => string | undefined) {
  const { t } = useI18n()

  watchEffect(() => {
    const page = title?.()
    const app = t('app.title')
    document.title = page ? `${page} – ${app}` : app
  })
}
