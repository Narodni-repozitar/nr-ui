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
            path: 'datasets/all/',
            name: 'datasets',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              query: {
                // sort: 'string:alphabetical'
              }
            }
          }),
          {
            // CREATE record in ANY community (user can choose in component)
            path: `datasets/create`,
            name: 'datasets-create',
            component: () => import(/* webpackChunkName: 'forms' */ '../pages/forms/CreateForm'),
            meta: { useFacets: false }
          },
          collection({
            path: 'articles/all/',
            name: 'articles',
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
        path: '/:communityId/:model/draft/:recordId',
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
          }),
          {
            // EDIT an existing DRAFT record
            path: `edit`,
            name: 'edit-record',
            component: () => import(/* webpackChunkName: 'forms' */ '../pages/forms/EditForm'),
          },
        ]
      },
      {
        path: '/:communityId/:model/:recordId',
        component: () => import(/* webpackChunkName: 'layouts' */'layouts/CenteredLayout'),
        children: [
          record({
            path: 'raw',
            name: 'published-record',
            component: () => import(/* webpackChunkName: 'record' */'../pages/RawRecord')
          }),
          record({
            path: '',
            name: 'published-record',
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
