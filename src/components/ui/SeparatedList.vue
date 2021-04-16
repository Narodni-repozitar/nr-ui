<template lang="pug">
template(v-for="(item, idx) in items")
  vertical-separator(v-if="idx>0 && !double")
  double-separator(v-if="idx>0 && double")
  slot(v-bind:item="item" :class="itemClass")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'SeparatedList',
  props: {
    list: {
      type: [Object, Array],
    },
    itemClass: {
      type: [String, Array]
    },
    double: Boolean
  }
})
class SeparatedList extends Vue {
  get items() {
    if (!this.list) {
      return []
    }
    if (Array.isArray(this.list)) {
      return this.list
    }
    const entries = Object.entries(this.list)
    entries.sort()
    return entries.map(e => ({
      key: e[0],
      value: e[1]
    }))
  }
}
</script>
