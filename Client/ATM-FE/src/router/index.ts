import DefaultLayout from '@/layout/DefaultLayout.vue'
import HomeView from '@/modules/home/HomeView.vue'
import MainView from '@/modules/home/MainView.vue'
import LoginView from '@/modules/login/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: '',
      path: '/',
      component: DefaultLayout,
      children: [
        {
          name: 'home',
          path: 'home',
          component: HomeView
        },
        {
          name: 'login',
          path: '',
          component: LoginView
        },
        {
          name: 'main',
          path: '/main',
          component: MainView
        }
      ]
    }
  ],
})


export default router
