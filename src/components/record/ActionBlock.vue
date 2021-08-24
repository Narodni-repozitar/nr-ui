<template lang="pug">
q-item(clickable v-ripple @click="$emit('invoke')")
  q-item-section(avatar)
    q-icon(:name="icon")
  q-item-section
    q-item-label.text-uppercase.text-caption {{ $t(label) }}
        //q-item(clickable v-if="canAttachArticle" v-ripple @click="attachArticle")
        //  q-item-section(avatar)
        //    q-icon(name="link")
        //  q-item-section
        //    q-item-label.text-uppercase.text-caption {{ $t('action.attachArticle') }}
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
export default {
  name: 'ActionBlock',
  emits: ['invoke'],
  props: {
    icon: String,
    label: {
      type: String,
      required: true
    }
  },
}
</script>

<style lang="sass" scoped>
</style>
