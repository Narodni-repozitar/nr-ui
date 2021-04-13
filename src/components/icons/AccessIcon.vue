<template lang="pug">
q-icon(:name="accessIcon")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'AccessIcon',
  props: {
    accessRights: {
      type: Object,
      required: true
    }
  }
})
class AccessIcon extends Vue {
  get accessIcon() {
    return 'img:/icons/locks/open.png'
  }
}
</script>
