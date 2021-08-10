<template lang="pug">
q-chip(
  :class="[removable? 'term-chip' : term.icon? ['term-chip', 'no-padding'] : '']"
  square
  :removable="removable"
  color="primary"
  outline
  @remove="$emit('remove', term)")
  q-avatar.full-width(v-if="term && term.icon")
    q-icon.full-height.term-icon(:name="iconName(term)")
    q-tooltip
      mt.self-center(:text="term.title")
  term-span.q-pl-sm(
    v-if="term && !term.icon"
    :term="term"
    :taxonomy="taxonomy")
</template>

<script>
import {defineComponent} from 'vue'
import TermSpan from 'components/taxonomy/TermSpan'

export default defineComponent({
  name: "TermChip",
  components: {TermSpan},
  emits: ['remove'],
  props: {
    removable: {
      type: Boolean,
      default: false
    },
    term: Object,
    taxonomy: String
  },
  setup () {
    function iconName(term) {
      if (term.icon.startsWith('http')) {
        return `img:${term.icon}`
      }
      return term.icon
    }

    return {iconName}
  }
})
</script>

<style lang="sass" scoped>
.term-chip
  padding: 0 10px 0 0

  .term-icon
    width: auto
</style>
