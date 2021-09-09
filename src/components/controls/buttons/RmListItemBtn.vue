<template lang="pug">
q-btn.self-center.q-mt-sm(
  round
  dense
  flat
  color="negative"
  icon="backspace"
  @click="$emit('remove')")
  q-tooltip {{ `${$t('action.remove')} ${itemLabel.toLowerCase()}` }}
</template>

<script>
export default {
  name: 'RmListItemBtn',
  props: {
    itemLabel: {
      type: String,
      required: true
    }
  },
  emits: ['remove'],
}
</script>
<style lang="sass" scoped>
</style>
