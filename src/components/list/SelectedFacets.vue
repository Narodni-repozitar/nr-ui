<template lang="pug">
.column.q-mt-md
  .col.selected-facets.q-pa-sm.q-pt-xs
    .nr-header.text-primary
      span.q-pr-lg Použitá omezení
      q-btn.medium-dark.q-pa-none(flat dense icon="close")
    .nr-text.text-dark
      span.q-pr-lg Plný text
      q-btn.medium-dark.q-pa-none(flat dense icon="close")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      q-btn.medium-dark.q-pa-none(flat dense icon="close")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      q-btn.medium-dark.q-pa-none(flat dense icon="close")
    .nr-text.text-dark
      span.q-pr-lg Neco jineho
      q-btn.medium-dark.q-pa-none(flat dense icon="close")
</template>
<style lang="sass">
.selected-facets
  border-top: 1px solid $secondary
  border-left: 1px solid $secondary
  border-right: 1px solid $secondary
  background-color: $darker
.nr-text
  line-height: 100%
</style>
