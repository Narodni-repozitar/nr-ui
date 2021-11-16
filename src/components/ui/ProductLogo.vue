<template lang="pug">
img(
  :src="logoAsset"
  :alt="$t('app.productName') + ' logo'"
  :class="[dense? 'nr-logo-small': '']")
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'ProductLogo',
  props: {
    dense: Boolean,
  },
  setup (props) {
    const {locale} = useI18n()
    const logoAsset = computed(()  => {
      if (props.dense) {
        if(locale.value === 'en'){
          return require('src/assets/repo_logo_eng_rgb_per.png')
        }
        return require('src/assets/repo_logo_cz_rgb1.png')
      }
      if(locale.value === 'en'){
        return require('src/assets/repo_logo_eng_rgb_resized.png')
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
