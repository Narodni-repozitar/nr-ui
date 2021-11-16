<template lang="pug">
dashboard.col(:uppy="uppy" :props="dashboardProps")
.q-field__bottom.col.q-my-md
  .q-field__messages {{ $t('hint.upload') }}
</template>

<script>
import { Dashboard } from '@uppy/vue'
import {defineComponent, ref} from 'vue'
import useUploader from 'src/composables/useUploader'
import {useI18n} from 'vue-i18n'

export default defineComponent({
  name: 'UploadData',
  components: {Dashboard},
  emits: ['done'],
  props: {
    files: {
      type: String,
      required: true
    }
  },
  setup (props, ctx) {
    const {t} = useI18n()
    const {uppy} = useUploader(props.files)

    const dashboardProps = ref({
      doneButtonHandler: () => {
        uppy.value.reset()
        ctx.emit('done')
      },
      metaFields: [{
        id: 'fileNote', name: t('label.fileNote'), placeholder: t('hint.fileNote')
      }]
    })

    return {uppy, dashboardProps}
  }
})
</script>
