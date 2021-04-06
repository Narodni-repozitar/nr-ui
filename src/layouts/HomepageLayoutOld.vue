<template lang="pug">
  q-layout(view='lHr lpR lFr')
    q-header.bg-white.row
      .col-lg-3.col-md-2.col-xs-0
      .col
        .row.justify-between
          .q-ma-md
            img(src='../assets/logo_nr.png')
          .q-ma-md
            h4.text-h4.text-secondary ENGLISH
      .col-lg-3.col-2.col-xs-0
    q-page-container
      router-view
    q-footer.bg-grey-8.text-white(elevated='').row
      .col-lg-3.col-md-2.col-xs-0
      .col.justify-between
          q-avatar
            img(src='https://cdn.quasar.dev/logo/svg/quasar-logo.svg')
          |           Title

      .col-lg-3.col-2.col-xs-0
</template>

<script>
export default {
  name: 'Homepage'
}
</script>

<style scoped lang="sass">
</style>
