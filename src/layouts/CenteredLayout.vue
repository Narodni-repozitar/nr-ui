<template lang="pug">
q-page.row
  .col-lg-2.col-md-1.col-xs-0
  .col
    transition(
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="300"
    )
      router-view.full-width
  .col-lg-2.col-md-1.col-xs-0
</template>

<script>
import NRHeader from 'components/layout/NRHeader';
import NRFooter from 'components/layout/NRFooter';

export default {
  name: "CenteredLayout",
  data() {
    return {}
  },
  components: {
    'nr-header': NRHeader,
    'nr-footer': NRFooter
  }
}
</script>
