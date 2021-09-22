<template lang="pug">
q-step(
  :disable="disable"
  icon="cloud_upload"
  :name="DATASET_FORM_STEPS.UPLOAD"
  :title="$t('label.forms.uploadData')")
  .column.justify-center.items-center
    .col.text-h2
      q-icon.flex-center(color="positive" name="check_circle")
    .col.text-h5 {{ $t('message.submissionSuccess', {pid: record.metadata.InvenioID}) }}
  q-separator(spaced)
  .column.justify-center.items-center
    .col.text-subtitle1 {{ $t('label.forms.uploadData') }}
    upload-data(
      ref="upload"
      v-if="created"
      :files="created.links.files")
  .column.justify-center.items-center
    .col.text-subtitle1.q-my-md ~ {{ $t('label.or') }} ~
    .col
      q-btn(color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(record?.links?.self)")
</template>
<script>
import {defineComponent, ref} from 'vue'
import {DATASET_FORM_STEPS} from 'src/constants'
import UploadData from "components/forms/steps/UploadData";

export default defineComponent({
  name: 'UploadDataStep',
  components: {UploadData},
  emits: ['update:modelValue', 'create', 'prev'],
  props: {
    disable: Boolean,
    done: Boolean,
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    record: [Object, Boolean]
  },
  setup(props, ctx) {
    const upload = ref(null)

    return {
      upload,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
