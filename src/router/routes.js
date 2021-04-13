import {collection, record} from "@oarepo/invenio-vue";

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      {
        path: '',
        component: () => import('pages/Home'),
      }
    ]
  },
  {
    path: '/:communityId/:model/:state/:recordId',
    component: () => import('layouts/CenteredLayout'),
    children: [
      /*
      record({
        path: '',
        name: 'all',
        component: () => import('../pages/Record')
      })

       */
    ]
  },
  {
    path: '/all/',
    component: () => import('layouts/CenteredLayout'),
    children: [
      collection({
        path: '',
        name: 'all',
        component: () => import('../pages/Collection')
      })
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
