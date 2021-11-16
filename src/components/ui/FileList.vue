<template lang="pug">
.column.full-width
  .col.row.q-gutter-lg
    .col-grow(v-if="files.length")
      q-table.sticky-name-column(
        flat
        :loading="locked"
        :class="[locked? 'disabled': '']"
        :title="$t('section.files')"
        :rows="files" row-key="file_id" :columns="fileColumns"
        :no-data-label="$t('message.noFiles')")
        template(v-slot:loading)
          q-inner-loading(showing color="primary")
        template(v-slot:body-cell-download="props")
          q-td(:props="props")
            div
              q-btn(
                :class="[locked? 'disabled': '']"
                @click="download(props.value)" outline color="primary" :label="$t('label.download')")
        template(v-slot:body-cell-delete="props")
          q-td(:props="props")
            div
              q-icon.cursor-pointer( @click="remove(props.row)" size="sm" name="delete" color="negative" )
                q-tooltip {{ $t('action.remove') }}
    .col-auto.q-mt-md.q-pt-md(v-if="canUpload")
      upload-data(@done="reloadRecord" :files="record.value.http.data.links.files")
  .col.row
    stepper-nav(has-prev has-next @next="$emit('next')" @prev="$emit('prev')")
</template>

<script>
import UploadData from 'components/forms/steps/UploadData'
import {computed, defineComponent, ref, toRefs} from 'vue'
import {useI18n} from 'vue-i18n'
import {format} from 'quasar'
import StepperNav from 'components/controls/StepperNav'
import axios from "axios";
import useRecord from "src/composables/useRecord";

const {humanStorageSize} = format

export default defineComponent({
  name: 'FileList',
  components: {UploadData, StepperNav},
  emits: ['prev', 'next'],
  props: {
    record: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {t} = useI18n()
    const {record} = toRefs(props)
    const {filesLink, reloadRecord} = useRecord(record.value)  // TODO: this is not reactive, rewrite useRecord for reactivity
    const locked = ref(false)

    const fileColumns = [
      {
        name: 'name',
        required: true,
        label: t('label.name'),
        align: 'left',
        field: row => row.key,
        sortable: true
      },
      {
        name: 'size',
        required: true,
        label: t('label.size'),
        align: 'left',
        field: row => row.size,
        format: val => humanStorageSize(val),
        sortable: true
      },
      {
        name: 'download',
        align: 'left',
        field: row => row.url,
        required: true
      },
      {
        name: 'delete',
        align: 'left',
        field: row => row.url,
        required: true
      }
    ]

    function download(url) {
      if (locked.value) {
        return
      }
      window.open(`${url}?download`, '_blank')
    }

    const files = computed(() => {
      return record.value.metadata._files?.filter(f => f.checksum && f.checksum !== '') || []
    })

    // TODO: add check of auth/state need provides
    const canUpload = computed(() => {
      return record.value.metadata['oarepo:draft']
    })

    const uploadUrl = computed(() => {
      return record.value.http.data.links.files
    })

    function remove(file) {
      if (locked.value) {
        return
      }
      locked.value = true

      axios.delete(`${filesLink.value}/${file.key}`,
          {headers: {'Content-Type': 'application/json-patch+json'}}
      ).then(res => {
        reloadRecord()
      }).catch(err => {
        console.error(`Could not delete file ${file}: ${err}`)
      }).finally(() => {
        locked.value = false
      })
    }

    return {download, remove, reloadRecord, locked, files, canUpload, uploadUrl, fileColumns}
  }
})
</script>

<style lang="sass">
.sticky-name-column
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  //max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: var(--q-grey-2)

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
