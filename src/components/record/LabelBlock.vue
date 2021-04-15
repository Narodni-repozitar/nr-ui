<template lang="pug">
.row.label-block
  span.label
  slot.value
</template>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'LabelBlock',
  props: {
    label: String
  }
})
class LabelBlock extends Vue {
}
</script>
