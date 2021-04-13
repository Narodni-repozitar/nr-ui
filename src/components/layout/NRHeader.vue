<template lang="pug">
q-header.row.bordered-header.bg-color
  .col-lg-2.col-md-1.col-xs-0
  .col
    .row.justify-between
      .q-mx-md.q-my-xs
        img(src='../../assets/logo_nr.png').nr-logo
      .q-mx-md.q-my-xs
        h4.text-h4.text-secondary.q-mb-none.q.pb-none ENGLISH
  .col-lg-2.col-md-1.col-xs-0
</template>
<script>
export default {
  name: 'NRHeader'
}
</script>

<style scoped lang="sass">
h4
  font-size: 14px
.bordered-header
  border-bottom: 1px solid #E6E6E6
  margin-bottom: 5px
.bg-color
  background-color: white
.nr-logo
  max-width: 140px
</style>
