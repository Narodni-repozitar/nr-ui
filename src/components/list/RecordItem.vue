<template lang="pug">
q-item.no-padding.record.text-dark(dense :to="detailRoute")
  record-item-side.q-ma-sm(:access-rights="accessRights" :rights="rights" :files="files")
  q-item-section.q-ma-sm
    .col-auto.text-h6.q-pr-lg
      mt(:text="m.titles.filter(t => t.titleType === 'mainTitle')[0].title")
    .col-auto.text-caption
      .row.items-baseline.text-weight-regular.text-body1.q-mt-xs
        record-people(:m="m")
      .row.items-baseline.text-weight-light.text-body2.q-mt-xs
        span(v-if="publicationYear") {{ publicationYear }}
          double-separator
          q-tooltip {{ $t('label.publicationDate') }}
        template(v-if="m.language && m.language.length")
          div(v-for="(l, idx) in m.language" :key="l.links.self")
            simple-term.inline(:term="[l]")
            span(v-if="idx < m.language.length-1") ,&nbsp;
            q-tooltip {{ $t('label.languages') }}
      .row.items-baseline.text-caption.text-weight-medium.text-uppercase.q-mt-xs
        simple-term(:term="m.resourceType" :levels="1")
    .col-auto.keywords.q-mt-xs
      .row.justify-begin
        multilingual-chip.q-mt-xs.col-auto.q-mr-sm(:multilingual="kw" v-for="(kw, idx) in m.keywords" :key="idx")
    .col-auto.q-mt-sm
      mt.abstract.q-pr-md(:text="sanitize(m.abstract)" :shorten="500")
  q-badge.q-ma-sm.q-px-sm(rounded floating) {{ recordStatus }}
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
import MultilingualChip from 'components/i18n/MultilingualChip'
import {defineComponent} from "vue";
import useRecord from "src/composables/useRecord";
import {sanitize} from "src/utils";
import RecordItemSide from "components/list/RecordItemSide";

export default defineComponent({
  name: 'RecordItem',
  props: {
    record: Object
  },
  components: {
    RecordItemSide,
    MultilingualChip,
    AccessIcon,
    RightsIcon,
    RecordPeople
  },
  setup(props) {
    const {m, detailRoute, accessRights, rights, files, recordStatus, publicationYear} = useRecord(props.record)
    return {m, detailRoute, accessRights, rights, files, recordStatus, publicationYear, sanitize}
  }
})
</script>
