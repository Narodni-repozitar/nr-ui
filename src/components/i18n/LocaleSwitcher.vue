<template lang="pug">
locale-select(
  menu-anchor="bottom left"
  :options="$i18n.availableLocales"
  flat
  rounded
  icon="flag"
  v-model="$i18n.locale")
</template>
<script>
import {defineComponent} from 'vue'
import LocaleSelect from 'components/i18n/LocaleSelect'

export default defineComponent({
  name: 'LocaleSwitcher',
  components: {LocaleSelect}
})
</script>
