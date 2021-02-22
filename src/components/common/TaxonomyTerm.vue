<template lang="pug">
  div.taxonomy-term-view(:class="{'inline-block': inline}")
    div.taxonomy-term(v-for="t in taxs" :class="{'inline-block': inline, 'term-inline': inline}")
      div.term-title {{ t[0].title.cs }}
      div.term-parents(v-if="depth>1")
        span.term-parent(v-for="parent in t.slice(1)")
          q-icon(name='keyboard_arrow_right')
          span {{ parent.title.cs }}
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

export default @Component({
  name: 'taxonomy-term',
  props: {
    value: Array,
    term: Object,
    depth: {
      type: Number,
      default: 10
    },
    inline: Boolean
  }
})
class TaxonomyTerm extends Vue {
  get currentValue () {
    return this.value || (this.term ? [this.term] : [])
  }

  get taxs () {
    if (!this.currentValue || !this.currentValue.length) {
      return []
    }
    const byUrl = this.currentValue.reduce((h, t) => {
      h[t.links.self] = t
      return h
    }, {})
    return this.currentValue.filter(x => x.is_ancestor !== true).map(t => {
      const ret = [t]
      while (ret.length < this.depth) {
        const parentUrl = ret[ret.length - 1].links.parent
        if (!parentUrl) {
          break
        }
        const parent = byUrl[parentUrl]
        if (!parent) {
          break
        }
        ret.push(parent)
      }
      return ret
    })
  }
}
</script>
