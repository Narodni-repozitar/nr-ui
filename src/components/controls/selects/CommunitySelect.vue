<template lang="pug">
q-btn-dropdown.bg-white.community-badge.q-mr-xl.rounded-borders.q-pa-xs.q-px-md.shadow-2(
  :label="label"
  v-if="communitiesMember.length > 1"
  icon="groups"
  outline
  menu-self="top middle"
  menu-anchor="bottom middle"
  color="accent"
  :content-style="{zIndex: 8000}"
  no-caps)
  q-list.bg-accent.text-white(separator padding)
    q-item.q-px-md(v-for="c in communitiesMember" :key="c.id" clickable @click="setCommunity(c.id)")
      q-item-section(avatar)
        q-avatar(icon="groups" color="white" size="md" text-color="dark")
      q-item-section
        q-item-label.text-subtitle2.text-weight-bold {{ c.title }}
        q-item-label(caption).text-white {{ c.metadata.description }}
</template>

<script>
import BaseSelect from 'components/controls/selects/BaseSelect'
import useAuth from 'src/composables/useAuth'
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'
import usePermissions from "src/composables/usePermissions";

export default {
  name: 'CommunitySelect',
  components: {BaseSelect},
  props: {},
  setup() {
    const {t} = useI18n()
    const {setCommunity} = useContext(community)
    const {effectiveCommunity, currentUserCommunities} = useAuth()
    const {communitiesMember} = usePermissions()

    const label = computed(() => {
      if (effectiveCommunity.value) {
        return effectiveCommunity.value.title
      }
      return t('label.chooseCommunity')
    })

    return {effectiveCommunity, currentUserCommunities, setCommunity, label, communitiesMember}
  }
}
</script>

<style scoped>

</style>
