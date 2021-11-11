<template lang="pug">
q-btn.col-auto(
  v-bind="$attrs"
  v-if="effectiveCommunity && canCreateRecord(effectiveCommunity.id) || communitiesMember.length === 1"
  stretch
  flat
  color="dark"
  icon="cloud_upload"
  :to="communityRoute(effectiveCommunity.id || communitiesMember[0].id).to"
  :label="$t('action.upload')")
  q-tooltip {{ communityRoute(effectiveCommunity.id || communitiesMember[0].id).label }}
q-btn-dropdown(
  v-else-if="communitiesMember.length"
  color="dark"
  :content-style="{zIndex: 8000}"
  stretch
  flat
  icon="cloud_upload"
  :label="$t('action.upload')")
  q-list(separator padding)
    q-item.q-px-md(v-for="c in communitiesMember" :key="c.id" clickable :to="communityRoute(c.id).to")
      q-item-section(avatar)
        q-avatar(icon="groups" color="primary" size="md" text-color="white")
      q-item-section
        q-item-label.text-subtitle2.text-weight-bold {{ c.title }}
        q-item-label(caption) {{ c.metadata.description }}
      q-tooltip {{ communityRoute(c.id).label }}
</template>

<script>
import {computed, defineComponent} from 'vue'
import useAuth from 'src/composables/useAuth'
import {useI18n} from 'vue-i18n'
import usePermissions from "src/composables/usePermissions";

export default defineComponent({
  name: 'CreateRecordBtn',
  setup() {
    const {t} = useI18n()
    const {effectiveCommunity} = useAuth()
    const {canCreateRecord, communitiesMember} = usePermissions()

    function communityRoute(communityId) {
      const routeName = 'create'
      const label = t('action.uploadDataset')
      const routeParams = {
        model: 'dataset',
        communityId: communityId
      }

      return {
        to: {
          name: routeName,
          params: {...routeParams}
        },
        label: `${label} ${t('label.inCommunity' )} ${communityId? communityId.toUpperCase() : ''}`
      }
    }

    return {communityRoute, effectiveCommunity, communitiesMember, canCreateRecord}
  }
})
</script>
