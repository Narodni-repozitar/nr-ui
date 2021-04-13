<template lang="pug">
span
  span(v-for="(a, idx) in t")
    span(v-if="idx>0") {{ separator }}
    span {{ $mt(a) }}
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from 'src/components/icons/AccessIcon'

export default @Options({
  name: 'mt',
  props: {
    text: Array|Object,
    separator: {
      type: String,
      default: ' : '
    }
  },
  components: {
    AccessIcon
  }
})
class MLArray extends Vue {
  get t() {
    if (!this.text) {
      return []
    }
    if (Array.isArray(this.text)) {
      return this.text
    }
    return [this.text]
  }
}
</script>
