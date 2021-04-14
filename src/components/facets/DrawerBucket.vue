<template lang="pug">
.nr-text.text-dark
  span {{ bucket.key_as_string || bucket.key }}
  cancel-button.q-ml-md(@click="removeClicked" size="sm")
</template>
<script>
import {Options, Vue} from 'vue-class-component'


export default @Options({
  name: 'DrawerBucket',
  props: {
    bucket: Object,
    modelValue: Boolean,
  },
})
class DrawerBucket extends Vue {
  removeClicked() {
    this.$emit('update:modelValue', false)
  }
}
</script>
