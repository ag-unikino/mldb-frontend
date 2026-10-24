import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface Account {
  id: number
  name: string
  cinemas: string[]
}

export const useAuthStore = defineStore('auth', () => {
  const account = ref<Account | null>(null)
  const isLoggedIn = computed(() => account.value !== null)

  // Placeholder: replace with the real login once the auth flow is decided.
  function login() {
    account.value = {
      id: 1,
      name: 'Beispiel-Account',
      cinemas: ['Beispiel-Kino X', 'Beispiel-Kino Y'],
    }
  }

  function logout() {
    account.value = null
  }

  return { account, isLoggedIn, login, logout }
})
