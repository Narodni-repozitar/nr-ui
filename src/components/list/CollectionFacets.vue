<template lang="pug">
.column.facets
  .col.collection-facets.full-height
    div.q-mx-sm.q-mt-md
      facets(
        :definition="facetDefinitions"
        :options="facetsOptions"
        :facetLoader="facetLoader"
        @facetSelected="facetSelected"
        :drawer='!!drawer' :teleport="drawer")
</template>
<script>
import {Options, Vue} from 'vue-class-component'
import FacetContainer from 'src/components/facets/FacetContainer'
import DrawerBucket from 'src/components/facets/DrawerBucket'
import deepmerge from "deepmerge";

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
        },
      }
    },
    types: {
      nested: {
        components: {
          facet: {
            component: 'nested-facet'
          }
        }
      }
    }
  }

  definitions = {
    accessRights: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "accessRights"
        }
      }
    },
    accessRightsCurator: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "access Rights Curator"
        }
      }
    },
    resourceType: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "resourceType"
        }
      }
    },
    language: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "language"
        }
      }
    },
    rights: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "rights"
        }
      }
    },
    provider: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "provider"
        }
      }
    },
    entities: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "entities"
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
        facets: [...Array.from(fetchedFacets.values()).map(transformFacet)].join(','),
        ...Object.entries(facetSelection.selected()).reduce(
            (p, s) => {
              if (!(excludedFromQuery && excludedFromQuery.includes(s[0]))) {
                p[transformFacet([0])] = [...s[1]].map(x => x.toString())
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
        this.$query[transformFacet(k)] = null
      } else {
        this.$query[transformFacet(k)] = [...v]
      }
    }
    this.$emit('update:activeFacets', facetSelection)
  }

  get facetDefinitions() {
    const cols =  this.collection.facetDefinitions
    for (const [k, val] of Object.entries(cols)) {
      if (this.definitions[k]) {
        cols[k] = deepmerge(cols[k], this.definitions[k])
      }
    }
    return cols
  }
}

function transformFacet(f) {
  if (f.split) {
    return f.split('.')[0]
  } else {
    return f
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
