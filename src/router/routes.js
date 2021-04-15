import {collection, record} from "@oarepo/invenio-vue";
import MainLayout from "layouts/MainLayout";
import CenteredLayout from "layouts/CenteredLayout";

const routes = [
  {
    path: '/',
    component: () => MainLayout,
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: 'home' */'pages/Home'),
      },
      {
        path: '',
        component: () => CenteredLayout,
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
        component: () => CenteredLayout,
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
