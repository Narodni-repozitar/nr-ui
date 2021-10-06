<template lang="pug">
span.row
  template(v-for="(t, idx) in term_list")
    span.text-secondary(v-if="idx>0")  &lt; 
    mt(:text="t.title")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'SimpleTerm',
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
    if (this.term.length) {
      const term = [...this.term]
      term.sort((a, b) => (b.level - a.level) || b.links.self.localeCompare(a.links.self))
      return term.slice(0, this.levels)
    }
  }
}
</script>
