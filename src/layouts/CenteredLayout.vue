<template lang="pug">
q-layout(view='lhr lpR lFr')
  nr-header
  q-page-container.row
    .col-lg-2.col-md-1.col-xs-0
    .col
      router-view.full-width
    .col-lg-2.col-md-1.col-xs-0
  nr-footer
</template>

<script>
import NRHeader from 'components/layout/NRHeader';
import NRFooter from 'components/layout/NRFooter';

export default {
  data() {
    return {}
  },
  components: {
    'nr-header': NRHeader,
    'nr-footer': NRFooter
  }
}
</script>
