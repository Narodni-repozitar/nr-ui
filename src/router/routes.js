import {collection, record} from "@oarepo/invenio-vue";

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: 'layouts' */'layouts/MainLayout'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: 'home' */'../pages/Home'),
        meta: {showCreateRecord: true}
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
              showCreateRecord: true,
              communitySelect: true,
              query: {
                // sort: 'string:alphabetical'
              }
            }
          }),
          collection({
            path: '/:communityId/datasets/all/',
            name: 'community-datasets',
            component: () => import(/* webpackChunkName: 'collection' */'../pages/Collection')
          }, {
            meta: {
              showCreateRecord: true,
              communitySelect: true,
              query: {
                // sort: 'string:alphabetical'
              }
            }
          })
        ]
      },
      {
        path: '',
        component: () => import(/* webpackChunkName: 'layouts' */'layouts/CenteredLayout'),
        children: [
          {
            // CREATE record in ANY community (user can choose in component)
            path: `/:communityId/:model/create`,
            name: 'create',
            component: () => import(/* webpackChunkName: 'forms' */ '../pages/forms/CreateForm'),
            meta: {
              communitySelect: true,
              useFacets: false
            }
          },
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
          }, { meta: {showCreateRecord: true}}),
          record({
            path: '',
            name: 'record',
            component: () => import(/* webpackChunkName: 'record' */'../pages/Record')
          }, { meta: {showCreateRecord: true}}),
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
          }, { meta: {showCreateRecord: true}}),
          record({
            path: '',
            name: 'published-record',
            component: () => import(/* webpackChunkName: 'record' */'../pages/Record')
          }, { meta: {showCreateRecord: true}}),
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
