<template lang="pug">
q-footer.nr-footer.bg-grey-7.text-white(bordered).text-body1
  .row.bg-grey-7.q-py-lg
    .col-lg-2.col-md-1.col-xs-0
    .col.row.justify-center
      //.col.q-pa-sm
      //  .q-pa-xs.text-weight-bold Zájem o spolupráci
      //  .text-weight-light.text-body2
      //    .q-pa-xs O nás
      //    .q-pa-xs Typologie NR
      //    .q-pa-xs Partnerské instituce
      //    .q-pa-xs Technické řešení
      //.col.q-pa-sm
      //  .q-pa-xs.text-weight-bold Jak spolupracovat
      //  .text-weight-light.text-body2
      //    .q-pa-xs Pro partnery NUŠL
      //    .q-pa-xs Výhody spolupráce
      //    .q-pa-xs Způsoby spolupráce
      //    .q-pa-xs Smlouvy
      //    .q-pa-xs Certifikované metodiky
      //.col.q-pa-sm
      //  .q-pa-xs.text-weight-bold Podpora
      //  .text-weight-light.text-body2
      //    .q-pa-xs První příhlášení
      //    .q-pa-xs Pokyny ke vkládání
      //    .q-pa-xs Školení
      //    .q-pa-xs FAQ
      //    .q-pa-xs Nastavení harvestu
      //.col.q-pa-sm
      //  .q-pa-xs.text-weight-bold Akce
      //  .text-weight-light.text-body2
      //    .q-pa-xs Archiv akcí
      .col.q-pa-sm.text-center
        .q-pa-xs.text-weight-bold {{ $t('label.contact') }}
        .text-weight-light.text-body2
          a.q-pa-xs.text-white(href="mailto:support@narodni-repozitar.cz") support@narodni-repozitar.cz
        .col.q-pa-sm.text-center
          .q-pa-xs.text-weight-bold {{ $t('label.help') }}
          .text-weight-light.text-body2
            a.q-pa-xs.text-white(href="https://du.cesnet.cz/cs/navody/narodni_repozitar/start" target="_blank") www.du.cesnet.cz
    .col-lg-2.col-md-1.col-xs-0
  .row.justify-between.bg-grey-8.items-center
    .col-lg-2.col-md-1.col-xs-0
    //.col.q-pa-sm
    //  .q-pa-xs © NTK 2020
    //  .q-pa-xs nr@techlib.cz
    //.col-2.q-pa-lg
    //  .q-pa-xs.text-weight-light.text-body2
    //    p Obsah je dostupný pod licencí Creative Commons BY-SA 4.0 International, není-li určeno jinak.
    //.col.q-pa-lg
    //  img(src='../../assets/ntk@2x.png' style="height:75px")
    //.col.q-pa-lg
    //  img(src='../../assets/cesnet_logo.webp')
    //.col.q-pa-lg
    //  img(src='../../assets/msmt_logo.webp')
    .col-lg-2.col-md-1.col-xs-0
</template>
<script>
export default {
  name: 'NRFooter'
}
</script>
