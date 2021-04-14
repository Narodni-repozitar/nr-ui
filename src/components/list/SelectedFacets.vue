<template lang="pug">
.column.q-mt-md
  .col.selected-facets.q-pa-sm.q-pt-xs
    .nr-header.text-primary
      span.q-pr-lg Použitá omezení
      cancel-button.text-dark(size="sm")
    .nr-text.text-dark
      span.q-pr-lg Plný text
      cancel-button.text-dark(size="sm")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      cancel-button.text-dark(size="sm")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      cancel-button.text-dark(size="sm")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      cancel-button.text-dark(size="sm")
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
import {defineComponent, ref, watch} from "vue";
import CancelButton from 'src/components/controls/CancelButton.vue'

export default defineComponent({
  name: 'SelectedFacets',
  components: {
    CancelButton
  },
})
</script>
