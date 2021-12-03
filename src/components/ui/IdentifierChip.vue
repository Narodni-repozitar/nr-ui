<template lang="pug">
q-chip(
  square
  outline
  dense
  size="md"
  color="primary"
  text-color="dark"
  class="q-ma-none")
  q-avatar(text-color="white" color="primary")
    span.q-px-sm.text-bold(v-if="identifier.scheme.toLowerCase() === 'doi'") {{ identifier.scheme.toUpperCase() }}
    span.q-px-sm.text-bold(v-if="identifier.scheme.toLowerCase() !== 'doi'") {{ identifier.scheme }}
  a(:href="`https://doi.org/${identifier.identifier}`"
    target="_blank"
    v-if="identifier.scheme.toLowerCase() === 'doi'")
    span.identifier-value {{ identifier.identifier }}
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
