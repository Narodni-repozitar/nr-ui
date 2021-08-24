<template lang="pug">
q-page-sticky(position="top-right" :offset="[38, 38]" v-if="actions.length")
  .q-pa-md.row.items-start.q-gutter-md
    q-card.transparent-grey(square bordered flat)
      q-card-section
        sidebar-section-header(label="label.actions" icon="published_with_changes")
      //q-separator(dark inset)
      q-list.bg-primary-dark-transparent(padding separator dark bordered)
        action-block(
          v-for="act in actions" :key="act.id"
          :label="act.label"
          :icon="act.icon"
          @invoke="act.func"
        )
        //q-item.q-pa-md(v-for="t in transitions" clickable v-close-popup :key="t.code"
        //  @click="makeTransition(t)")
        //  q-item-section(avatar)
        //    q-icon(:name="t.icon" color="dark")
        //  q-item-section
        //    q-item-label.text-uppercase.text-caption {{ t.label }}
        //q-item.q-pa-md(color="grey-3" v-if="!canAttachArticle && !canEdit && transitions.length === 0")
        //  q-item-section(avatar)
        //    q-icon(name="info" color="grey-5")
        //  q-item-section
        //    q-item-label.text-grey-7.text-caption {{ $t('message.noActions') }}
</template>

<script>
import SidebarSectionHeader from 'components/ui/SidebarSectionHeader'
import ActionBlock from 'components/record/ActionBlock'
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'ActionsSidebar',
  components: {
    ActionBlock,
    SidebarSectionHeader
  },
  props: {
    actions: Array
  }
})
</script>

<style lang="sass" scoped>
</style>
