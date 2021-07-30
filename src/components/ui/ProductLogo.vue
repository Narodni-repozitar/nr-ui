<template lang="pug">
img(
  :src="logoAsset"
  :alt="$t('app.productName') + ' logo'"
  :class="[dense? 'nr-logo-small': '']")
</template>

<script>
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: 'ProductLogo',
  props: {
    dense: Boolean,
  },
  setup (props) {
    const logoAsset = computed(()  => {
      if (props.dense) {
        return require('src/assets/logo_nr.png')
      }
      return require('src/assets/nr-logo-63pxH_V03@2x.png')
    })
    return {logoAsset}
  }
})
</script>

<style lang="sass" scoped>
.nr-logo-small
  max-width: 140px
</style>
