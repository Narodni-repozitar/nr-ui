<template lang="pug">
q-layout(view='lHr lpR lFr')
  q-header.row.bordered-header.bg-color
    .col-lg-2.col-md-1.col-xs-0
    .col
      .row.justify-between
        .q-ma-md
          img(src='../assets/logo_nr.png').nr-logo
        .q-ma-md
          h4.text-h4.text-secondary ENGLISH
    .col-lg-2.col-md-1.col-xs-0
  q-page-container
    router-view
  q-footer.text-white(elevated='').text-body1.absolute
    .row.justify-between.bg-grey-7
      .col-lg-2.col-md-1.col-xs-0
      .col.q-pa-lg
        .q-pa-xs.text-weight-bold Zájem o spolupráci
        .q-pa-xs O nás
        .q-pa-xs Typologie NR
        .q-pa-xs Partnerské instituce
        .q-pa-xs Technické řešení
      .col.q-pa-lg
        .q-pa-xs.text-weight-bold Jak spolupracovat
        .q-pa-xs Pro partnery NUŠL
        .q-pa-xs Výhody spolupráce
        .q-pa-xs Způsoby spolupráce
        .q-pa-xs Smlouvy
        .q-pa-xs Certifikované metodiky
      .col.q-pa-lg
        .q-pa-xs.text-weight-bold Podpora
        .q-pa-xs První příhlášení
        .q-pa-xs Pokyny ke vkládání
        .q-pa-xs Školení
        .q-pa-xs FAQ
        .q-pa-xs Nastavení harvestu
      .col.q-pa-lg
        .q-pa-xs.text-weight-bold Akce
        .q-pa-xs Archiv akcí
      .col.q-pa-lg
        .q-pa-xs.text-weight-bold Kontakt
      .col-lg-2.col-md-1.col-xs-0
    .row.justify-between.bg-grey-8.items-center
      .col-lg-2.col-md-1.col-xs-0
      .col.q-pa-lg
        .q-pa-xs © NTK 2020
        .q-pa-xs nr@techlib.cz
      .col-2.q-pa-lg
        .q-pa-xs
          p Obsah je dostupný pod licencí Creative Commons BY-SA 4.0 International, není-li určeno jinak.
      .col.q-pa-lg
        img(src='../assets/ntk_logo.webp')
      .col.q-pa-lg
        img(src='../assets/cesnet_logo.webp')
      .col.q-pa-lg
        img(src='../assets/msmt_logo.webp')
      .col-lg-2.col-md-1.col-xs-0
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="sass">
h4
  font-size: 14px
.bordered-header
  border-bottom: 1px solid #E6E6E6
.bg-color
  background-color: $background
.nr-logo
  max-width: 140px
</style>
