<template lang="pug">
q-chip(
  square
  outline
  dense
  size="md"
  color="primary"
  text-color="dark"
  class="q-ma-none")
  q-avatar.text-weight-bolder(text-color="white" color="primary") {{ identifier.scheme.toUpperCase() }}
  .q-px-xs
    a(:href="`https://doi.org/${identifier.identifier}`"
      target="_blank"
      v-if="identifier.scheme.toLowerCase() === 'doi'") {{ identifier.identifier }}
    span.identifier-value(v-else) {{ identifier.identifier }}
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "IdentifierChip",
  emits: ['remove'],
  props: {
    identifier: Object,
    icon: String,
  },
  setup(props) {
    return {}
  }
})
</script>

<style scoped>

</style>
