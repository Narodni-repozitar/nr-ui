<template lang="pug">
q-chip(
  square
  :removable="removable"
  outline
  dense
  size="md"
  @remove="$emit('remove')"
  :tabindex="tabindex"
  color="secondary"
  text-color="dark"
  class="q-ma-none")
  q-avatar(color="accent" text-color="white" :icon="icon") {{ multilingualData.lang }}
    q-tooltip {{ $t(`value.lang.${multilingualData.lang}`) }}
  span.text-dark.q-px-sm {{ multilingualData.label }}
    q-tooltip(v-if="multilingualData.other.length")
      .full-width(v-for="([l, v]) in multilingualData.other")
        .span.text-weight-bold {{ $t(`value.lang.${l}`) }}
        .span {{ v }}
</template>

<script>
import {computed, defineComponent} from 'vue'
import {useTranslated} from 'src/composables/useTranslated'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: "MultilingualChip",
  emits: ['remove'],
  props: {
    tabindex: Number,
    icon: String,
    removable: {
      type: Boolean,
      default: false
    },
    multilingual: Object
  },
  setup (props) {
    const {locale} = useI18n()
    const {mt, mtr} = useTranslated(locale)

    const multilingualData = computed(() => {
      const label = mt(props.multilingual)
      const lang = mtr(props.multilingual, label)
      const other = Object.entries(props.multilingual).filter(([l, val]) => l !== lang && val !== label)

      return {label: label, lang: lang, other: other}
    })

    return {multilingualData}
  }
})
</script>

<style scoped>

</style>
