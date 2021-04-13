<template lang="pug">
span
  span(v-for="(t, idx) in term_list")
    span.text-secondary(v-if="idx>0") ﹥
    mt(:text="t.title")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'AccessIcon',
  props: {
    term: {
      type: Array,
      default: () => []
    },
    levels: {
      type: Number,
      default: 20
    }
  }
})
class SimpleTerm extends Vue {
  get term_list() {
    const term = [...this.term]
    term.sort((a, b) => b.level - a.level)
    return term.slice(0, this.levels)
  }
}
</script>
