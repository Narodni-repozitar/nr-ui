<template lang="pug">
.column.facets
  .col.collection-facets.full-height
    div.q-mx-sm.q-mt-md
      facets(
        :definition="collection.facetDefinitions"
        :options="facetsOptions"
        :facetLoader="facetLoader"
        @facetSelected="facetSelected"
        :drawer='!!drawer' :teleport="drawer")
</template>
<script>
import {Options, Vue} from 'vue-class-component'
import FacetContainer from 'src/components/facets/FacetContainer'
import DrawerBucket from 'src/components/facets/DrawerBucket'

export default @Options({
  name: 'CollectionFacets',
  props: {
    collection: Object,
    drawer: String,
    facetsSelected: Boolean
  },
  emits: ['update:activeFacets']
})
class CollectionFacets extends Vue {
  facetsOptions = {
    defaults: {
      components: {
        bucketsContainer: {
          component: FacetContainer
        },
        listBucketCheckbox: {
          attrs: {
            color: 'secondary',
            keepColor: true
          }
        },
        listBucketLabel: {
          component: 'div',
          useChildren: true,
          html: true,
          translator: ({bucket, facet}) => {
            return `${(bucket.key_as_string || bucket.key)}      (${bucket.doc_count})`
          }
        },
        listBucketValue: {
          component: null,
        },
        drawer: {
          component: 'facets-drawer',
          attrs: {},
          style: {'border-bottom': null},
          class: []
        },
        drawerBucket: {
          component: DrawerBucket
        }
      }
    }
  }


  async facetLoader(facetSelection, activeFacets, excludedFromQuery /*, extras = {}*/) {
    const fetchedFacets = new Set([...Object.keys(facetSelection.selected()), ...Object.keys(activeFacets)])
    if (!fetchedFacets.size) {
      return {}
    }
    const facets = await this.collection.httpFacets.load({
      query: {
        facets: [...fetchedFacets.values()].join(','),
        ...Object.entries(facetSelection.selected()).reduce(
            (p, s) => {
              if (!(excludedFromQuery && excludedFromQuery.includes(s[0]))) {
                p[s[0]] = [...s[1]].map(x => x.toString())
              }
              return p
            }, {}),
        size: 1
      },
      returnPromise: true
    })
    return facets.aggregations
  }

  facetSelected(facetSelection) {
    for (const [k, v] of Object.entries(facetSelection)) {
      if (!v.size) {
        this.$query[k] = null
      } else {
        this.$query[k] = [...v]
      }
    }
    this.$emit('update:activeFacets', facetSelection)
  }
}
</script>
<style lang="sass">
.collection-facets
  border-top: 1px solid $secondary
  border-left: 1px solid $secondary
  border-right: 1px solid $secondary
  border-bottom: 1px solid $secondary
  background-color: $darker
</style>
