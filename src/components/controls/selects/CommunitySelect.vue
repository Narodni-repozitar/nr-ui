<template lang="pug">
q-btn-dropdown.bg-white.community-badge.q-mr-xl.rounded-borders.q-pa-xs.q-px-md.shadow-2(
  :label="label"
  icon="groups"
  outline
  menu-self="top middle"
  menu-anchor="bottom middle"
  color="accent"
  :content-style="{zIndex: 8000}"
  no-caps)
  q-list.bg-accent.text-white(separator padding)
    q-item.q-px-md(v-for="c in currentUserCommunities" :key="c.id" clickable @click="setCommunity(c.id)")
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
import {useRoute} from 'vue-router'
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'

export default {
  name: 'CommunitySelect',
  components: {BaseSelect},
  props: {},
  setup(props) {
    const {t} = useI18n()
    const route = useRoute()
    const {setCommunity} = useContext(community)
    const {effectiveCommunity, currentUserCommunities} = useAuth()

    const label = computed(() => {
      if (effectiveCommunity.value) {
        return effectiveCommunity.value.title
      }
      return t('label.chooseCommunity')
    })

    return {effectiveCommunity, currentUserCommunities, setCommunity, label}
  }
}
</script>

<style scoped>

</style>
