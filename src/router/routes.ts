import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'landing',
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    name: 'game',
    path: '/game',
    component: () => import('layouts/GameLayout.vue'),
    children: [
      { path: ':puzzleId', component: () => import('pages/Game.vue')}
    ]
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('layouts/RegisterLayout.vue'),
    children: [{ path: '', component: () => import('pages/Register.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
