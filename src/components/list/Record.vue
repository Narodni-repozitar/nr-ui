<template lang="pug">
q-item.record.q-py-lg.text-dark(:to="recordLink")
  q-badge.q-ma-sm.q-px-sm(rounded floating) {{ !m[STATUS_FIELD]? $t('value.facet.editing'): $t(`value.facet.${m[STATUS_FIELD]}`) }}
  q-item-section.justify-start-important(avatar)
    .column.full-height
      access-icon.col-auto.self-start.block(:accessRights="m.accessRights" size="64px")
      .col-auto.text-center.items-center.justify-center.column(v-if="m._files && m._files.length")
        q-icon.col-auto(color="primary" name="attachment" size="lg")
        span {{ m._files.length }} x
        q-tooltip {{ $t('label.filesCount') }}
      rights-icon.q-my-md.col-auto.self-end.block(v-if="m.rights" :rights="m.rights" size="64px")
  q-item-section
    .title
      mt(:text="m.titles.filter(t => t.titleType === 'mainTitle')[0].title")
    .text-caption
      record-people(:m="m")
      .row.year-lang.full-height.items-baseline.text-weight-light.text-body2.q-mt-xs
        span {{ year }}
          q-tooltip {{ $t('label.publicationDate') }}
        template(v-if="m.languages && m.languages.length")
          double-separator
          div(v-for="(l, idx) in m.languages" :key="l.links.self")
            simple-term.inline(:term="[l]")
            span(v-if="idx < m.languages.length-1") ,&nbsp;
            q-tooltip {{ $t('label.languages') }}
      .type.row.full-height.items-baseline.text-caption.text-weight-medium.text-uppercase.q-mt-xs
        simple-term(:term="m.resourceType" :levels="1")
    .keywords.q-mt-sm
      multilingual-chip.q-mr-sm(:multilingual="kw" v-for="(kw, idx) in m.keywords" :key="idx")
    mt.abstract.q-pr-md(:text="sanitize(m.abstract)" :shorten="500")
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
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
  name: 'ListRecord',
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
