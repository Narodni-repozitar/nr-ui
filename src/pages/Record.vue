<template lang="pug">
q-page.window-height
  pre {{ record }}
</template>


<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'Record',
  props: {
    record: Object
  },
  components: {
  }
})
class Record extends Vue {
}
</script>
