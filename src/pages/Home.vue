<template lang="pug">
q-page.bg-image.column(style="min-height: calc(100vh - 150px)")
  div.fit.column.col
    .row.fit.col
      .col-lg-2.col-md-1.col-xs-0
      .col
        .row.justify-center.q-py-xl
          .text-h1.text-weight-bolder.text-dark.q-my-xl {{ $t('app.productName') }}
        .row.justify-center
          .col-2
          .col-grow
            search-box.q-my-md(:route="{name: 'all'}" :dense="false")
          .col-2
        .row
          .col-2
          .col.row.justify-end
            .q-py-sm.q-pb-lg
              q-btn(flat color="primary" size="md" to="/all/") {{ $t('label.browseRecords') }}
          .col-2
        .row.empty
        .row.justify-around.q-col-gutter-lg
          .col-auto(v-for="c in collections" :key="c.title")
            collection-link(
              :icon="c.icon"
              :title="c.title"
              :description="c.description"
              :to="c.route"
              :badge="c.badge")
      .col-lg-2.col-md-1.col-xs-0
    .row.empty
</template>

<script>
import SearchBox from 'src/components/controls/SearchBox'
import CollectionLink from 'components/ui/CollectionLink'
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'Home',
  components: {CollectionLink, SearchBox},
  setup() {
    const collections = ref([
      {
        icon: 'NR2021_ikony_vyzkum.png',
        title: 'datasety',
        badge: 'PILOTNÍ PROVOZ',
        description: 'kolekce výzkumných dat',
        route: {name: 'datasets'}
      },
      {
        icon: 'NR2021_ikony_vyzkum.png',
        title: 'výzkumné zprávy',
        badge: 'PILOTNÍ PROVOZ',
        route: {name: 'articles'}
      },
      {
        icon: 'NR2021_ikony_diplom.png',
        title: 'vysokoškolské práce',
        description: 'závěrečné kvalifikační bakalářské, diplomové, rigorózní, disertační a habilitační práce',
        route: {name: 'theses'}
      },
      {
        icon: 'NR2021_ikony_konference.png',
        title: 'konferenční materiály',
        description: 'příspěvky, sborníky, programy, postery a další materiály z konferencí',
        route: {name: 'events'}
      },
      {
        icon: 'NR2021_ikony_certif_metod.png',
        title: 'certifikované metodiky a postupy',
        route: {name: 'nresults'}
      }
    ])

    return {collections}
  }
})
</script>

<style scoped lang="sass">
.bg-image
  opacity: 1

.bg-image::before
  content: ""
  background-image: url(../assets/background.png)
  background-repeat: no-repeat
  background-size: cover
  background-color: $background
  opacity: 0.2
  background-position: left top
  top: 0
  left: 0
  bottom: 0
  right: 0
  position: absolute
  z-index: -1

.nr-search-field
  width: 80%

.empty
  height: 1/7*100vh
</style>
