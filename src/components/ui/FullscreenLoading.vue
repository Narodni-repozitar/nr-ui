<template lang="pug">
</template>

<script>
import {defineComponent, onBeforeUnmount, onMounted} from 'vue'
import {QSpinnerBars, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'FullscreenLoading',
  props: {
    message: String,
  },
  setup(props) {
    const {t} = useI18n()
    const $q = useQuasar()
    onMounted(() => {
      $q.loading.show({
        boxClass: 'bg-accent text-white',
        message: props.message? props.message : t('message.loadingRecords'),
        spinner: QSpinnerBars,
        delay: 400 // ms
      })
    })

    onBeforeUnmount(() => {
      $q.loading.hide()
    })
  }
})
</script>

<style lang="sass" scoped>
.nr-logo-small
  max-width: 140px
</style>
