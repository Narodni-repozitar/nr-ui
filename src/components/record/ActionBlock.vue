<template lang="pug">
q-item(clickable v-ripple @click="$emit('invoke')")
  q-item-section(avatar)
    q-icon(:name="icon")
  q-item-section
    q-item-label.text-uppercase.text-caption.text-weight-bold {{ $t(label) }}
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
