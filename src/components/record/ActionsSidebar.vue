<template lang="pug">
q-page-sticky(position="top-right" :offset="[38, 20]" v-if="actions.length")
  .q-pa-md.row.items-start.q-gutter-md.relative-position
    q-btn.absolute-top-right(
      v-morph:btn:morphgroup:200.tween="expansionState"
      fab
      color="primary"
      size="xs"
      icon="published_with_changes"
      @click="expand")
      q-tooltip {{ $t('action.showActions') }}
    q-card.absolute-top-right.transparent-grey(
      v-morph:card:morphgroup:300.tween="expansionState"
      square
      bordered
      flat)
      q-card-section
        .row.justify-between
          sidebar-section-header.self-center.col-auto(label="label.actions" icon="published_with_changes")
          q-btn.col-auto.q-pa-sm(size="sm" color="secondary" round flat padding icon="close_fullscreen" @click="collapse")
            q-tooltip {{ $t('action.hideActions') }}
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
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'ActionsSidebar',
  components: {
    ActionBlock,
    SidebarSectionHeader
  },
  props: {
    actions: Array
  },
  setup () {
    const expansionState = ref('card')

    const expand = () => expansionState.value = 'card'
    const collapse = () => expansionState.value = 'btn'

    return {expansionState, expand, collapse}
  }
})
</script>

<style lang="sass" scoped>
</style>
