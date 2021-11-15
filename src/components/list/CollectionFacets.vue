<template lang="pug">
.column.facets
  .col.collection-facets.full-height
    div.q-mx-sm.q-mt-md
      facets(
        :definition="facetDefinitions"
        :options="facetOptions"
        :facetLoader="facetLoader"
        @facetSelected="facetSelected")
        //:drawer='!!drawer'  :teleport="drawer")
</template>
<script>
import {defineComponent, ref} from "vue";
import useFacets from 'src/composables/useFacets'
import {useQuery} from '@oarepo/vue-query-synchronizer'

export default defineComponent({
  name: 'CollectionFacets',
  props: {
    collection: Object,
    drawer: String,
    facetsSelected: Boolean
  },
  emits: ['update:activeFacets'],
  setup(props, ctx) {
    const {
      defaults,
      facetDefinitions,
      facetLoader,
      transformFacet,
    } = useFacets(props.collection)
    const query = useQuery()

    const facetOptions = ref({
      defaults: defaults,
    })

    function facetSelected(facetSelection) {
      for (const [k, v] of Object.entries(facetSelection)) {
        if (!v.size) {
          query[transformFacet(k)] = null
        } else {
          query[transformFacet(k)] = [...v]
        }
      }
      ctx.emit('update:activeFacets', facetSelection)
    }

    return {facetSelected, facetOptions, facetDefinitions, facetLoader}
  }
})
</script>
<style lang="sass">
.collection-facets
  border-top: 1px solid $secondary
  border-left: 1px solid $secondary
  border-right: 1px solid $secondary
  border-bottom: 1px solid $secondary
  background-color: $darker
</style>
