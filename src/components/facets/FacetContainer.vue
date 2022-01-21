<template lang="pug">
q-expansion-item.facet-container(
  expand-icon="svguse:/icons.svg#arrow-right"
  expanded-icon="svguse:/icons.svg#arrow-down")
  template(v-slot:header)
    q-item-section.facet-name
      span {{ label }}
  template(v-slot="slotData")
    slot(v-bind="slotData || {}")
</template>
<script>
import { Options, Vue } from 'vue-class-component'


export default @Options({
  name: 'FacetContainer',
  props: {
    label: String
  }
})
class FacetContainer extends Vue {
}
</script>
