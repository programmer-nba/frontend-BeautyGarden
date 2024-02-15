import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomersView from '../views/CustomersView.vue'
import CompanyView from '../views/CompanyView.vue'
import SupplierView from '../views/SupplierView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView
    },
    {
      path: '/company',
      name: 'company',
      component: CompanyView
    },
    {
      path: '/supplier',
      name: 'supplier',
      component: SupplierView
    }
  ]
})

export default router
