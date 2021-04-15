import {collection, record} from "@oarepo/invenio-vue";

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layouts' */'layouts/MainLayout'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: 'home' */'../pages/Home'),
      },
      {
        path: '',
        component: () => import(/* webpackChunkName: 'layouts' */'layouts/CenteredLayout'),
        children: [
          collection({
            path: 'all/',
            name: 'all',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              query: {
                sort: 'string:alphabetical'
              }
            }
          }),
          collection({
            path: 'theses/all/',
            name: 'theses',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              query: {
                sort: 'string:alphabetical'
              }
            }
          }),
          collection({
            path: 'events/all/',
            name: 'events',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              query: {
                sort: 'string:alphabetical'
              }
            }
          }),
          collection({
            path: 'nresults/all/',
            name: 'nresults',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              query: {
                sort: 'string:alphabetical'
              }
            }
          })
        ]
      },
      {
        path: '/:communityId/:model/:state/:recordId',
        component: () => import(/* webpackChunkName: 'layouts' */'layouts/CenteredLayout'),
        children: [
          record({
            path: 'raw',
            name: 'record',
            component: () => import(/* webpackChunkName: 'record' */'../pages/RawRecord')
          }),
          record({
            path: '',
            name: 'record',
            component: () => import(/* webpackChunkName: 'record' */'../pages/Record')
          })
        ]
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import(/* webpackChunkName: 'error' */'pages/Error404.vue')
  }
]

export default routes
