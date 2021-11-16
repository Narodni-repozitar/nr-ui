<template lang="pug">
div.row.authors.full-height.items-baseline
  .creator(v-for="(creator, idx) in creators")
    vertical-separator(v-if="idx>0")
    a(href="/" target="_blank") {{ creator.fullName }}
    identifier-icon(v-for="id in creator.authorityIdentifiers" :key="id.identifier" :identifier="id")
    q-tooltip {{ $t('label.author') }}
  template(v-if="contributors && contributors.length")
    double-separator
  separated-list(:list='contributors' item-class="contributor inline")
    template(v-slot:default="{item}")
      a(href="/" target="_blank") {{ item.fullName }}
        q-tooltip {{ $t('label.contributor') }}
      identifier-icon(v-for="id in item.authorityIdentifiers" :key="id.identifier" :identifier="id")
      span.role.text-black(v-if="item.role") &nbsp;(
      div(v-for="(r, idx) in item.role" :key="r.links.self")
        simple-term.role.inline.text-black(:term="[r]")
        span(v-if="idx < item.role.length-1") ,&nbsp;
      span.role.text-black(v-if="item.role" ) )
</template>
<style lang="sass">
.collection-item
  border-top: 1px solid $secondary
  min-height: 100px
</style>
<script>
import {Options, Vue} from 'vue-class-component'
import IdentifierIcon from 'components/icons/IdentifierIcon'
import {computed, defineComponent} from "vue";
import {getTaxonomyLeaf} from "src/utils";

export default defineComponent({
  name: 'RecordPeople',
  props: {
    m: Object
  },
  components: {IdentifierIcon},
  setup (props) {
    const creators = computed(() => {
      return props.m?.creators?.map(c => getTaxonomyLeaf(c))
    })

    const contributors = computed(() => {
      return props.m?.contributors?.map(c => getTaxonomyLeaf(c))
    })

    return {creators, contributors}
  }
})
</script>
