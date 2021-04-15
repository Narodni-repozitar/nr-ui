<template lang="pug">
q-item.record.q-py-lg(:to="record.links.ui")
  q-item-section.justify-start-important(avatar)
    access-icon.block(:accessRights="m.accessRights" size="64px")
  q-item-section
    .title
      mt(:text="m.title")
    record-people.q-mt-sm(:m="m")
    div.year-lang.q-mt-xs
      span {{ year }}
      template(v-if="m.language && m.language.length")
        double-separator
        simple-term.inline(:term="m.language")
    div.type
      simple-term(:term="m.resourceType" :levels="1")
    div.keywords
      mt.row(:text="m.keywords")
        template(v-slot:separator)
          vertical-separator
    mt.abstract(:text="m.abstract" :shorten="500")
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from 'src/components/icons/AccessIcon'
import RecordPeople from './RecordPeople'

export default @Options({
  name: 'ListRecord',
  props: {
    record: Object
  },
  components: {
    AccessIcon,
    RecordPeople
  }
})
class ListRecord extends Vue {
  get m() {
    return this.record?.metadata || {}
  }

  get year() {
    return this.m.dateIssued ? this.m.dateIssued.substr(0, 4) : undefined
  }
}
</script>
