<template lang="pug">
q-item.record.q-py-lg
  q-item-section(avatar)
    access-icon.block(:accessRights="m.accessRights" size="xl")
  q-item-section
    .title
      mt(:text="m.title")
    div.row.authors.q-mt-sm
      .creator.row(v-for="(creator, idx) in m.creator")
        q-separator.vertical-line(v-if="idx>0" color="secondary" vertical)
        span {{ creator.name }}
      template(v-if="m.contributor && m.contributor.length")
        q-separator.vertical-line-left(color="secondary" vertical)
        q-separator.vertical-line-right(color="secondary" vertical)
      .contributor.row(v-for="(contributor, idx) in m.contributor")
        q-separator.vertical-line(v-if="idx>0" color="secondary" vertical)
        span {{ contributor.name }}
        span.role &nbsp;(
        simple-term.role(:term="contributor.role")
        span.role )
    div.row.year-lang.q-mt-xs
      span {{ year }}
      template(v-if="m.language && m.language.length")
        q-separator.vertical-line-left(color="secondary" vertical)
        q-separator.vertical-line-right(color="secondary" vertical)
        simple-term(:term="m.language")
    div.row.type
      simple-term(:term="m.resourceType" :levels="1")
    div.row.keywords
      mt.row(:text="m.keywords")
        template(v-slot:separator)
          q-separator.vertical-line(color="secondary" vertical)
    mt.abstract(:text="m.abstract" :shorten="500")


    router-link.q-mt-md(:to="record.links.ui") detaily ...
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import AccessIcon from 'src/components/icons/AccessIcon'

export default @Options({
  name: 'ListRecord',
  props: {
    record: Object
  },
  components: {
    AccessIcon
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
