import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomeView from '@/modules/home/HomeView.vue'
import MainView from '@/modules/home/MainView.vue'
import LoginView from '@/modules/login/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          name: 'home',
          path: 'home',
          component: HomeView
        },
        {
          name: 'main',
          path: '/', // Note: 'main' not '/main' here because it's a child route
          component: MainView
        }
      ]
    },
    {
      path: '/',
      redirect: '/login'
    }
  ],
})



export default router
