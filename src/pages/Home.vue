<template lang="pug">
q-page.bg-image.window-height
  .row.fit
    .col-lg-2.col-md-1.col-xs-0
    .col
      .row.empty
      .row.justify-center
        .col-2
        .col
          q-input(@submit='search' v-on:keyup.enter='search' outlined='' v-model='searchField' bg-color='white' color="secondary")
            template(v-slot:prepend='')
              q-icon(name='search')
        .col-2
      .row
        .col-2
        .col
          .q-py-sm.bg-circular-transparent.q-pb-lg
            q-checkbox( v-model="fullText" keep-color color="secondary")
              template(v-slot:default='')
                span.text-weight-bold Plný text
        .col-2
      .row.empty
      .row
        .col
          .row.justify-center
            img(src='../assets/NR2021_ikony_diplom.png')
          .row.justify-center
            span.nr-collection-title.text-weight-bold vysokoškolské práce
        .col
          .row.justify-center
            img(src='../assets/NR2021_ikony_konference.png')
          .row.justify-center
            span.nr-collection-title.text-weight-bold konferenční materiály
        .col
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

export default @Options({
  name: 'Home'
  // props: {
  //   loading: Boolean,
  //   item: Object,
  //   showState: Boolean
  // },
  // components: {}
})
class Home extends Vue {
  fullText = true
  searchField = ''

  search () {
    console.log(this.searchField)
    this.$router.push({
      path: '/all',
      query: { q: this.searchField }
    })
  }
}
</script>

<style scoped lang="sass">
.bg-image
  background-image: url(../assets/background.png)
  background-repeat: no-repeat
  background-size: contain
  background-color: $background
  opacity: 0.7
  background-position: left top
  //background-attachment: fixed

.nr-search-field
  width: 80%

.full-height
  height: 100vh

.empty
  height: 1/7*100vh

.nr-collection-title
  margin-top: -20px
  color: $secondary
  font-size: 16px

.bg-circular-transparent
  background: $background
  background: radial-gradient(circle, rgba($background, 1) 0%, rgba($background,0.3) 100%)
</style>
