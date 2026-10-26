import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import FilmView from '../views/FilmView.vue'
import DistributorsView from '../views/DistributorsView.vue'
import DistributorView from '../views/DistributorView.vue'
import ImprintView from '../views/ImprintView.vue'
import PrivacyView from '../views/PrivacyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
    },
    {
      path: '/films/:id',
      name: 'film',
      component: FilmView,
    },
    {
      path: '/distributors',
      name: 'distributors',
      component: DistributorsView,
    },
    {
      path: '/distributors/:id',
      name: 'distributor',
      component: DistributorView,
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: ImprintView,
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView,
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
})

export default router
