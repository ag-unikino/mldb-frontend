import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import FilmView from '../views/FilmView.vue'
import DistributorsView from '../views/DistributorsView.vue'
import DistributorView from '../views/DistributorView.vue'

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
  ],
})

export default router
