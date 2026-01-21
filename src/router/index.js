import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import AdminLogin from '../pages/AdminLogin.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('admin-logged-in')
  
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/admin/login')
  } else if (to.path === '/admin/login' && isLoggedIn) {
    next('/admin')
  } else {
    next()
  }
})

export default router
