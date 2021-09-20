<template lang="pug">
q-btn.q-pl-sm(dense flat color="secondary" icon="post_add" @click="$emit('add')" :label="`${$t('action.add')} ${itemLabel.toLowerCase()}`")
  q-tooltip {{ `${$t('action.add')} ${itemLabel.toLowerCase()}` }}
</template>

<script>
export default {
  name: 'AddListItemBtn',
  props: {
    itemLabel: {
      type: String,
      required: true
    }
  },
  emits: ['add'],
}
</script>
<style lang="sass" scoped>
</style>
