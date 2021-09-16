<template lang="pug">
dashboard(:uppy="uppy" :props="dashboardProps")
</template>

<script>
import { Dashboard } from '@uppy/vue'
import {defineComponent, ref} from 'vue'
import useUploader from 'src/composables/useUploader'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'UploadData',
  components: {Dashboard},
  props: {
    files: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const {t} = useI18n()
    const {uppy} = useUploader(props.files)

    const dashboardProps = ref({
      metaFields: [{
        id: 'fileNote', name: t('label.fileNote'), placeholder: t('hint.fileNote')
      }]
    })

    return {uppy, dashboardProps}
  }
})
</script>

<style lang="sass" scoped>
</style>
