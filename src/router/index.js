import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomersView from '../views/CustomersView.vue'
import CompanyView from '../views/CompanyView.vue'
import SupplierView from '../views/SupplierView.vue'
import PayView from '../views/PayView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'auth',
      component: () => import("../views/LoginView.vue")
    },
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
      path: '/suppliers',
      name: 'suppliers',
      component: SupplierView
    },
    {
      path: '/pays',
      name: 'pays',
      component: PayView
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue')
    }
  ]
})

export default router
