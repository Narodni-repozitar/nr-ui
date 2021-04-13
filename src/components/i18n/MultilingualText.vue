<template lang="pug">
div
  template(v-for="(a, idx) in shortened ? shortenedText : t")
    slot(name="separator" v-if="idx>0")
      span {{ separator }}
    span {{ a }}
  span.text-primary.q-pl-md.inline-block.cursor-pointer(
    v-if="shortened && shouldBeShortened" @click="shortened=false") &gt; zobrazit více
  span.text-primary.q-pl-md.inline-block.cursor-pointer(
    v-if="!shortened && shouldBeShortened" @click="shortened=true") &lt; zobrazit méně
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
    },
    shorten: {
      type: Number,
      default: 100000
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
      return this.text.map(x=>this.$mt(x))
    }
    return [this.$mt(this.text)]
  }

  get shouldBeShortened() {
    if (this.shortenedText.length !== this.t.length) {
      return true
    }
    if (!this.shortenedText.length) {
      return false
    }
    return this.shortenedText[this.shortenedText.length-1] !== this.t[this.t.length-1]
  }

  get shortenedText() {
    const ret = []
    let len = 0
    for (const t of this.t) {
      if (len + t.length > this.shorten) {
        ret.push(t.substring(0, this.shorten - len))
        break
      }
      len += t.length
      ret.push(t)
    }
    return ret
  }

  shortened = true
}
</script>
