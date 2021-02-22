<template lang="pug">
img.logo-vscht(src="logos/logoVSCHT_cs.png" :alt="$t('accessibility.logoAlt')")
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'

export default @Component({
  name: 'Logo'
})
class Logo extends Vue {
}
</script>

<style lang="sass" scoped>
.logo-vscht
  min-height: 52px
  max-height: 52px
</style>
