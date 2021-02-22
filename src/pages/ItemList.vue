<template lang="pug">
  q-page(padding).q-mx-lg-xl
    .row.justify-between.items-center.q-col-gutter-x-lg.q-mt-md.q-mt-lg-xl.q-mb-md
      .col-12.col-lg-8
        .text-h3.gt-md {{ $t('section.itemsList') }}
        .text-h4.lt-lg.gt-sm.q-mt-none.q-mb-lg {{ $t('section.itemsList') }}
        .text-h6.lt-md.q-mt-none.q-mb-md {{ $t('section.itemsList') }}
      .col-12.col-lg-4.q-pl-lg.q-pr-none
        search-input.full-width(@search="doSearch")
        // :class="{'full-width': $q.screen.lt.lg, 'q-mr-xl': $q.screen.lt.lg}")
    .column.q-mt-md.q-gutter-y-md(v-if="items.length || loaded")
      div(v-for="item in items" :key="item.id")
        item-list-entry.col.cursor-pointer.non-selectable(
          :loading="!loaded"
          :item="item"
          @detail="navigateDetail"
          @click.native="navigateDetail(item)"
          :showState="isCurator")
      .row.justify-around
        q-pagination.q-mt-lg(v-model="$query.page" :max="pages" :max-pages="9" color="accent"
          direction-links boundary-numbers size="lg" v-if="loaded")

    no-data-placeholder.full-height(v-else)
    portal(to="drawer")
      .column.bg-secondary.q-gutter-y-md.q-pa-xl
        facet-list(:facets="facets" :loading="!loaded")
</template>
<script>
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import SearchInput from 'src/components/search/SearchInput'
import ItemListEntry from 'components/items/list/ItemListEntry'
import NoDataPlaceholder from 'src/components/common/NoDataPlaceholder'
import { EmitSearchMixin } from 'src/mixins/Search'
import FacetList from 'src/components/search/FacetList'
import Logo from 'src/components/Logo'
import { AuthMixin } from 'src/mixins/Auth'

export default @Component({
  name: 'ItemList',
  props: {
    records: Array,
    facets: Array,
    filters: Array,
    pages: Number,
    loading: Boolean,
    loaded: Boolean,
    collectionApi: Object
  },
  components: {
    Logo,
    SearchInput,
    ItemListEntry,
    NoDataPlaceholder,
    FacetList
  }
})
class ItemList extends mixins(EmitSearchMixin, AuthMixin) {
  navigateDetail (item) {
    this.$router.push(item.links.ui)
  }

  get items () {
    if (!this.loaded) {
      return Array.from({ length: this.$query.size }).map(x => ({}))
    }
    return this.records || []
  }

  get isCurator () {
    return this.$auth.state.value?.user?.roles && this.$auth.state.value.user.roles.some(x => x.id === 'curator')
  }

  // swipePage (evt) {
  //   if (evt.direction === 'right') {
  //     if (this.$query.page < this.pages) {
  //       this.$query.page++
  //     }
  //   } else {
  //     if (this.$query.page > 1) {
  //       this.$query.page--
  //     }
  //   }
  // }
}
</script>
<style lang="sass">
.text-smaller
  font-size: 8px !important

  .q-icon
    font-size: 14px
    padding: 0
    margin: 0

  .q-tab
    margin: 0 !important
    padding: 0 !important
</style>
