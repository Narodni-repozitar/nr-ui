

const routes = [
  {
    path: '/',
    component: () => import('layouts/HomepageLayout'),
    children: [
      {
        path: '',
        component: () => import('pages/Home'),
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
