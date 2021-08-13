<template lang="pug">
q-icon.q-pa-xs.q-mb-xs(
  @click="copyIdentifier"
  :name="identifierIcon"
  color="accent"
  v-if="identifierIcon && !identifierIcon.startsWith('data:')"
  :title="`${identifier.scheme}: ${identifier.identifier}`")
  q-tooltip {{ identifier.scheme}}: {{ identifier.identifier }}
q-img.q-pa-xs.q-mb-xs(
  v-else
  fit="cover"
  ratio="1"
  width="24px"
  :src="identifierIcon"
  :alt="`${identifier.scheme}: ${identifier.identifier}`")
  q-tooltip {{ identifier.scheme}}: {{ identifier.identifier }}
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'IdentifierIcon',
  props: {
    identifier: {
      type: Object,
      required: true
    }
  }
})
class IdentifierIcon extends Vue {

  get identifierIcon() {
    const schema = this.identifier?.scheme || 'other'
    const idmap = {
      'orcid': require('src/assets/identifiers/orcid-og-image.png'),
      'other': 'badge'
    }
    return idmap[schema] || idmap['other']
  }

  copyIdentifier() {
    // TODO: implement copy 2 clipboard on click
  }
}
</script>
