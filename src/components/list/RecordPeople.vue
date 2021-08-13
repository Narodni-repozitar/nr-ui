<template lang="pug">
div.row.authors.full-height.items-baseline
  .creator(v-for="(creator, idx) in m.creators")
    vertical-separator(v-if="idx>0")
    span {{ creator.person_or_org.name }}
    identifier-icon(v-for="id in creator.person_or_org.identifiers" :key="id.identifier" :identifier="id")
    q-tooltip {{ $t('label.author') }}
  template(v-if="m.contributors && m.contributors.length")
    double-separator
  separated-list(:list='m.contributors' item-class="contributor inline")
    template(v-slot:default="{item}")
      span {{ item.person_or_org.name }}
        q-tooltip {{ $t('label.contributor') }}
      identifier-icon(v-for="id in item.person_or_org.identifiers" :key="id.identifier" :identifier="id")
      span.role &nbsp;(
      div(v-for="(r, idx) in item.role" :key="r.links.self")
        simple-term.role.inline(:term="[r]")
        span(v-if="idx < item.role.length-1") ,&nbsp;
      span.role )
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import IdentifierIcon from 'components/icons/IdentifierIcon'

export default @Options({
  name: 'RecordPeople',
  props: {
    m: Object
  },
  components: {IdentifierIcon}
})
class RecordList extends Vue {
}
</script>
