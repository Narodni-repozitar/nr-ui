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
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'

export default defineComponent({
  name: 'CreateRecordBtn',
  setup() {
    const {communityId} = useContext(community)

    const createRoute = computed(() => {
      let routeName = 'create'
      let label = ''
      let routeParams = {
        model: 'dataset',
        communityId: communityId.value
      }

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
