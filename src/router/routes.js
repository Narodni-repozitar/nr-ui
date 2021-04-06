import { collection } from '@oarepo/invenio-api-vue-composition'
import Home from 'pages/Home'

const routes = [
  {
    path: '/',
    component: () => import('layouts/ItemListLayout'),
    children: [
      collection(
        {
          apiUrl: '/',
          path: 'all',
          collectionCode: 'all',
          name: 'all',
          component: () => import('pages/ItemList'),
          loadingComponent: 'viewer',
          recordRouteName: (record) => {
            // if (record.links.self.indexOf('draft') > 0) {
            //   return 'draft-restorations/objects/record'
            // } else {
            //   return 'restorations/objects/record'
            // }
          },
          meta: {
            query: {
            }
          },
          httpGetProps: {
            dedupingInterval: 100,
            revalidateDebounce: 0,
            shouldRetryOnError: false,
            keepData: (data, error, oldUrl, oldQuery, newUrl, newQuery, options) => {
              if (oldUrl === newUrl) {
                // collection not changed
                return true
              }
              return false
            }
          }
        }
      )
    ]
  },
  {
    path: '/theses',
    component: () => import('layouts/ItemListLayout'),
    children: [
      collection(
        {
          apiUrl: '/draft/',
          path: '',
          collectionCode: 'theses',
          name: 'theses',
          component: () => import('pages/ItemList'),
          loadingComponent: 'viewer',
          recordRouteName: (record) => {
            // if (record.links.self.indexOf('draft') > 0) {
            //   return 'draft-restorations/objects/record'
            // } else {
            //   return 'restorations/objects/record'
            // }
          },
          meta: {
            query: {
            }
          },
          httpGetProps: {
            dedupingInterval: 100,
            revalidateDebounce: 0,
            shouldRetryOnError: false,
            keepData: (data, error, oldUrl, oldQuery, newUrl, newQuery, options) => {
              if (oldUrl === newUrl) {
                // collection not changed
                return true
              }
              return false
            }
          }
        }
      )
    ]
  },
  {
    path: '/home',
    component: () => import('layouts/HomepageLayout'),
    children: [
      {
        path: '',
        component: Home
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
