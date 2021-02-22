<template lang="pug">
    .col
      q-list(v-if="!loading")
        facet(
          :loading="loading"
          v-for="facet in facets"
          :facet="facet"
          :key="facet.code"
          @open="openFacet(facet)"
          @close="closeFacet(facet)")
      q-skeleton.q-my-md.q-mx-md(
        v-else
        v-for="i in 10" :key="i"
        animation="pulse"
        height="30px")
</template>

<script>
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Facet from 'src/components/search/Facet'
import { LoadingMixin } from 'src/mixins/Loading'

export default @Component({
  name: 'FacetList',
  components: {
    Facet
  },
  props: {
    loading: Boolean,
    facets: Array
  }
})
class FacetList extends mixins(LoadingMixin) {
  openFacet (facet) {
    if (!this.$query.facets.includes(facet.code)) {
      this.$emit('opening', facet)
      this.$query.addValue('facets', facet.code)
    }
  }

  closeFacet (facet) {
    if (this.$query.facets.includes(facet.code)) {
      this.$emit('closing', facet)
      this.$query.removeValue('facets', facet.code)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
