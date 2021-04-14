<template lang="pug">
q-layout(view='lhr lPR lfr')
  nr-header
  q-page-container.min-window-height
      router-view
  nr-footer
</template>

<script>
import NRHeader from 'components/layout/NRHeader';
import NRFooter from 'components/layout/NRFooter';
export default {
  data () {
    return {
    }
  },
  components: {
    'nr-header': NRHeader,
    'nr-footer': NRFooter
  }
}
</script>
