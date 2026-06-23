import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../components/HomeLink.vue'),
    },
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('../components/auth.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../components/Profile.vue'),
    },
    {
      path: '/show/:playlistId',
      name: 'Show',
      component: () => import('../components/ShowVideosInPlaylist.vue'),
      props: true,
    },
  ],
})
export default router
