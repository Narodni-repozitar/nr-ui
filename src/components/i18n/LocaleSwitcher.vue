<template lang="pug">
locale-select(
  menu-anchor="bottom left"
  :options="availableLocales"
  flat
  rounded
  icon="flag"
  v-model="$i18n.locale")
</template>
<script>
import {computed, defineComponent} from 'vue'
import LocaleSelect from 'components/i18n/LocaleSelect'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'LocaleSwitcher',
  components: {LocaleSelect},
  setup () {
    const i18n = useI18n()

    const availableLocales = computed(() => {
      return i18n.availableLocales.filter(l => l.length === 2)
    })

    return { availableLocales }
  }
})
</script>
