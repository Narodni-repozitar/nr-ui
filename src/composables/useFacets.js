import {computed, ref} from 'vue'
import deepmerge from 'deepmerge'
import {useI18n} from "vue-i18n";
import FacetContainer from "components/facets/FacetContainer";
import DrawerBucket from "components/facets/DrawerBucket";


export default function useFacets(collection) {
  const {t} = useI18n()

  const defaults = ref({
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
      extendedFacetsButton: {
        component: 'div' // Disable More Filters button
      },
      listBucketLabel: {
        component: 'div',
        useChildren: true,
        html: true,
        translator: ({bucket, facet}) => {
          return bucketLabel(bucket, facet)
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
  })

  const types = ref({
    nested: {
      components: {
        facet: {
          component: 'nested-facet'
        }
      }
    }
  })

  const definitions = ref({
    'oarepo:recordStatus': {
      options: {
        translate: true
      },
      label: t('label.state')
    },
    language: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.language')
        }
      }
    },
    keywords: {
      label: t('label.forms.keywords')
    },
    creators: {
      label: t('label.authors'),
      aggs: {
        terms: {
          field: 'creators.fullName',
        }
      }
    },
    affiliation: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.affiliations'),
          terms: {
            field: 'creators.affiliation.title.cs.raw',
          }
        }
      }
    },
    contributors: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: "contributors"
        }
      }
    },
    rights: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.license')
        }
      }
    },
    accessRights: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.accessRights')
        }
      }
    },
    resourceType: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.resourceType')
        }
      }
    },
    subjectCategories: {
      type: 'nested',
      aggs: {
        inner_facet: {
          label: t('label.subjectCategories')
        }
      }
    },
    dateCreated: {
      label: t('label.dateCreated')
    }
  })

  function bucketLabel (bucket, facet) {
    if (isTranslated(facet)) {
      return  `${t('value.facet.' + (bucket.key_as_string || bucket.key))}      (${bucket.doc_count})`
    }
    return `${bucket.key_as_string || bucket.key}      (${bucket.doc_count})`
  }

  function isTranslated(facet) {
    return facet.definition.options?.translate
  }

  async function facetLoader(facetSelection, activeFacets, excludedFromQuery /*, extras = {}*/) {
    const fetchedFacets = new Set([...Object.keys(facetSelection.selected()), ...Object.keys(activeFacets)])
    if (!fetchedFacets.size) {
      return {}
    }
    const facets = await collection.httpFacets.load({
      query: {
        facets: [...Array.from(fetchedFacets.values()).map(transformFacet)].join(','),
        ...Object.entries(facetSelection.selected()).reduce(
          (p, s) => {
            if (!(excludedFromQuery && excludedFromQuery.includes(s[0]))) {
              p[transformFacet(s[0])] = [...s[1]].map(x => x.toString())
            }
            return p
          }, {}),
        size: 1
      },
      returnPromise: true
    })
    return facets.aggregations
  }

  const facetDefinitions = computed(() => {
    const cols = collection.facetDefinitions
    // eslint-disable-next-line no-unused-vars
    for (const [k, val] of Object.entries(cols)) {
      if (definitions.value[k]) {
        cols[k] = deepmerge(cols[k], definitions.value[k])
      }
    }
    return Object.keys(cols).sort().reduce(
      (obj, key) => {
        obj[key] = cols[key];
        return obj;
      },
      {})
  })

  function transformFacet(f) {
    if (f.split) {
      return f.split('.')[0]
    } else {
      return f
    }
  }

  return {
    defaults,
    types,
    definitions,
    facetDefinitions,
    facetLoader,
    transformFacet
  }
}
