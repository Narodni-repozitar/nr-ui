<template lang="pug">
q-step(
  :disable="disable"
  :done="done"
  icon="cloud_upload"
  :name="DATASET_FORM_STEPS.UPLOAD"
  :title="$t(useFileList? 'label.forms.manageUploadedData' : 'label.forms.uploadData')")
  .column.justify-center.items-center(v-if="!useFileList")
    .col.text-h2
      q-icon.flex-center(color="positive" name="check_circle")
    .col.text-h5 {{ $t('message.submissionSuccess', {pid: recordID}) }}
  q-separator(spaced v-if="!useFileList")
  .column.justify-center.items-center
    .col.text-subtitle1(v-if="!useFileList") {{ $t('label.forms.uploadData') }}
    upload-data(
      ref="upload"
      v-if="record && !useFileList"
      @done="reloadRecord"
      :files="recordLinks.files")
    file-list(
      ref="upload"
      @prev="$emit('prev')"
      @next="$emit('next')"
      v-if="record && useFileList"
      :record="record")
  .column.justify-center.items-center(v-if="!useFileList")
    .col.text-subtitle1.q-my-md ~ {{ $t('label.or') }} ~
    .col
      q-btn(color="primary" :label="$t('action.navigateDetail')" :to="pathFromUrl(recordLinks.self)")
</template>
<script>
import {computed, defineComponent, ref, toRefs} from 'vue'
import {DATASET_FORM_STEPS} from 'src/constants'
import UploadData from 'components/forms/steps/UploadData'
import {pathFromUrl} from 'src/utils'
import FileList from 'components/ui/FileList'
import useRecord from "src/composables/useRecord";

export default defineComponent({
  name: 'UploadDataStep',
  components: {FileList, UploadData},
  emits: ['prev', 'next'],
  props: {
    disable: Boolean,
    done: Boolean,
    hasErrors: Boolean,
    errors: {
      type: Array,
      default: () => []
    },
    useFileList: Boolean,
    record: {
      required: true
    }
  },
  setup(props, ctx) {
    const upload = ref(null)
    const { record } = toRefs(props)
    const {reloadRecord} = useRecord(record.value) // TODO: this is not reactive, rewrite useRecord for reactivity

    const visited = computed(() => {
      return upload.value
    })

    const recordID = computed(() => {
      return record?.metadata?.InvenioID || record.value.http.data.metadata.InvenioID
    })

    const recordLinks = computed(() => {
      return record?.links || record.value.http.data.links
    })

    function validate () {
      return true
    }

    return {
      upload,
      visited,
      recordID,
      recordLinks,
      validate,
      pathFromUrl,
      reloadRecord,
      DATASET_FORM_STEPS
    }
  }
})
</script>
<style lang="sass" scoped>
</style>
