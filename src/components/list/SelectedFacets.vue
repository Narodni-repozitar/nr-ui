<template lang="pug">
.column.q-mt-md(:class='{invisible: !facetsSelected}')
  .col.selected-facets.q-pa-sm.q-pt-xs
    .nr-header.text-primary(v-if="facetsSelected")
      span.q-pr-lg Použitá omezení
      cancel-button.text-dark(size="sm" @click="clear")
    div(id="facets-drawer")
</template>
<style lang="sass">
.selected-facets
  border-top: 1px solid $secondary
  border-left: 1px solid $secondary
  border-right: 1px solid $secondary
  background-color: $darker

.nr-text
  line-height: 100%
</style>

<script>
import {computed, defineComponent, ref, watch} from "vue";
import CancelButton from 'src/components/controls/CancelButton.vue'

export default defineComponent({
  name: 'SelectedFacets',
  props: {
    activeFacets: Object
  },
  components: {
    CancelButton
  },
  setup(props) {
    return {
      facetsSelected: computed(() => {
        return props.activeFacets && Object.keys(props.activeFacets.selected()).length > 0
      }),
      clear() {
        props.activeFacets.replaceWithSelection({})
      }
    }
  }
})
</script>
