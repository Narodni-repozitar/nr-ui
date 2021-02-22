import { collection } from '@oarepo/invenio-api-vue-composition'

const routes = [
  {
    path: '/',
    component: () => import('layouts/ItemListLayout'),
    children: [
      collection(
        {
          path: '',
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
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
