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
    span.q-px-sm.text-bold {{ identifier.scheme }}
  a(:href="`https://doi.org/${identifier.identifier}`"
    target="_blank"
    v-if="identifier.scheme.toLowerCase() === 'doi'")
    span.identifier-value {{ identifier.identifier }}
  span.identifier-value(v-else) {{ identifier.identifier }}
  //q-avatar(color="accent" text-color="white" :icon="icon") {{ multilingualData.lang }}
  //  q-tooltip {{ $t(`value.lang.${multilingualData.lang}`) }}
  //span.text-dark.q-px-sm {{ multilingualData.label }}
  //  q-tooltip(v-if="multilingualData.other.length")
  //    .full-width(v-for="([l, v]) in multilingualData.other")
  //      .span.text-weight-bold {{ $t(`value.lang.${l}`) }}
  //      .span {{ v }}
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
