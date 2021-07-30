<template lang="pug">
q-btn.col-auto(
  v-bind="$attrs"
  stretch
  flat
  color="dark"
  icon="cloud_upload"
  :to="createRoute.to"
  :label="$t('action.upload')")
  q-tooltip {{ $t(createRoute.label) }}
</template>

<script>
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: 'CreateRecordBtn',
  setup() {
    const createRoute = computed(() => {
      let routeName = 'datasets-create'
      let label = ''
      let routeParams = {}

      label = 'action.uploadDataset'

      return {
        to: {
          name: routeName,
          params: {...routeParams}
        },
        label: label
      }
    })

    return {createRoute}
  }
})
</script>
