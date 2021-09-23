<template lang="pug">
q-item.record.q-py-lg.text-dark(:to="record.links.ui")
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
      mt(:text="m.titles.filter(t => t.titleType === 'mainTitle')[0].title") TODO ALZP V COM JE PROBLEM?
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
    .keywords
      .row.text-overline.items-baseline.full-height
        div(v-for="(kw, idx) in m.keywords" :key="idx")
          vertical-separator(v-if="idx>0")
          span {{ kw }}
          q-tooltip {{ $t('label.forms.keywords') }}
    mt.abstract.q-pr-md(:text="sanitizeHtml(m.abstract)" :shorten="500")
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from 'components/icons/AccessIcon'
import RightsIcon from 'components/icons/RightsIcon'
import RecordPeople from './RecordPeople'
import {date} from 'quasar'
import sanitizeHtml from 'sanitize-html'

export default @Options({
  name: 'ListRecord',
  props: {
    record: Object
  },
  components: {
    AccessIcon,
    RightsIcon,
    RecordPeople
  }
})
class ListRecord extends Vue {
  get m() {
    return this.record?.metadata || {}
  }

  sanitizeHtml (value) {
    Object.keys(value).map(function(key, index) {
      value[key] = sanitizeHtml(value[key], {allowedTags: []})
    })
    return value
  }

  get year() {
    return this.m.dateAvailable? date.extractDate(this.m.dateAvailable, 'YYYY-MM-DD').getFullYear() : this.$t('value.unknown')
  }
}
</script>
