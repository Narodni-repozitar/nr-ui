<template lang="pug">
q-page.bg-image.column(style="min-height: calc(100vh - 150px)")
  div.fit.column.col
    .row.fit.col
      .col-lg-2.col-md-1.col-xs-0
      .col
        .row.empty
        .row.justify-center
          .col-2
          .col
            search-box.q-my-md(:route="{name: 'all'}" :dense="false")
          .col-2
        .row
          .col-2
          .col
            .q-py-sm.q-pb-lg
              q-checkbox( v-model="fullText" keep-color color="secondary")
                template(v-slot:default='')
                  span.text-weight-bold Plný text
          .col.row.justify-end
            .q-py-sm.q-pb-lg.q-px-md
              router-link.text-weight-bold.q-mt-sm.block(to="/all/") ... procházet všechny dokumenty
          .col-2
        .row.empty
        .row
          .col
            router-link(:to="{name: 'theses'}")
              .row.justify-center
                img(src='../assets/NR2021_ikony_diplom.png')
              .row.justify-center
                span.nr-collection-title.text-weight-bold vysokoškolské práce
          .col
            router-link(:to="{name: 'events'}")
              .row.justify-center
                img(src='../assets/NR2021_ikony_konference.png')
              .row.justify-center
                span.nr-collection-title.text-weight-bold konferenční materiály
          .col
            router-link(:to="{name: 'nresults'}")
              .row.justify-center
                img(src='../assets/NR2021_ikony_certif_metod.png')
              .row.justify-center
                span.nr-collection-title.text-weight-bold certifikované metodiky a postupy
          .col
            .row.justify-center
              img(src='../assets/NR2021_ikony_vyzkum.png')
            .row.justify-center
              span.nr-collection-title.text-weight-bold výzkumné zprávy
      .col-lg-2.col-md-1.col-xs-0
</template>

<script>
import {Options, Vue} from 'vue-class-component'
import SearchBox from 'src/components/controls/SearchBox'

export default @Options({
  name: 'Home',
  // props: {
  //   loading: Boolean,
  //   item: Object,
  //   showState: Boolean
  // },
  components: {SearchBox}
})
class Home extends Vue {
  fullText = true
  searchField = ''

  search() {
    console.log(this.searchField)
    this.$router.push({
      path: '/all',
      query: {q: this.searchField}
    })
  }
}
</script>

<style scoped lang="sass">
.bg-image
  background-image: url(../assets/background.png)
  background-repeat: no-repeat
  background-size: cover
  background-color: $background
  opacity: 1
  background-position: left top

.nr-search-field
  width: 80%

.empty
  height: 1/7*100vh

.nr-collection-title
  margin-top: -20px
  color: $secondary
  font-size: 16px

</style>
