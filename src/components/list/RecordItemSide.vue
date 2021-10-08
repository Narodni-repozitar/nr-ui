<template lang="pug">
q-item-section.justify-start.items-center(avatar)
  access-icon.col-auto.self-start.block(:accessRights="m.accessRights" size="64px")
  .col-auto.text-center.items-center.justify-center.column(v-if="m._files && m._files.length")
    q-icon.col-auto(color="primary" name="attachment" size="lg")
    span {{ m._files.length }} x
    q-tooltip {{ $t('label.filesCount') }}
  rights-icon.q-my-md.col-auto.self-end.block(v-if="m.rights" :rights="m.rights" size="64px")
</template>
<style lang="sass">
</style>
<script>
import AccessIcon from 'components/icons/AccessIcon'
import RightsIcon from 'components/icons/RightsIcon'
import RecordPeople from './RecordPeople'
import {date} from 'quasar'
import sanitizeHtml from 'sanitize-html'
import MultilingualChip from 'components/i18n/MultilingualChip'
import {DATASETS_COLLECTION_CODE, DRAFT_FIELD, PRIMARY_COMMUNITY_FIELD, STATUS_FIELD} from 'src/constants'
import {computed, defineComponent} from "vue";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'RecordItemSide',
  props: {
    record: Object
  },
  components: {
    MultilingualChip,
    AccessIcon,
    RightsIcon,
    RecordPeople
  },
  setup (props) {
    const {t} = useI18n()
    const m = computed(() => {
      return props.record?.metadata || {}
    })

    const recordLink = computed(() => {
      return {
        name: m.value[DRAFT_FIELD] ? 'record' : 'published-record',
        params: {
          communityId: m.value[PRIMARY_COMMUNITY_FIELD],
          model: DATASETS_COLLECTION_CODE,
          recordId: m.value.InvenioID
        }
      }
    })

    const year = computed(() => {
      return m.value.dateAvailable ? date.extractDate(m.value.dateAvailable, 'YYYY-MM-DD').getFullYear() : t('value.unknown')
    })

    function sanitize (value) {
      if (value) {
        Object.keys(value).map(function (key, index) {
          value[key] = sanitizeHtml(value[key], {allowedTags: []})
        })
      }
      return value
    }

    return {m, recordLink, year, sanitize}
  }
})
</script>
