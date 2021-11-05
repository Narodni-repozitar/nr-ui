<template lang="pug">
span(@click.prevent="showIdentifier")
  q-icon.cursor-pointer.q-pa-xs.q-mb-xs(
    :name="identifierIcon"
    color="accent"
    v-if="identifierIcon && !identifierIcon.startsWith('data:')"
    :title="`${identifier.scheme}: ${identifier.identifier}`")
  q-img.cursor-pointer.q-pa-xs.q-mb-xs(
    v-else
    fit="cover"
    ratio="1"
    width="24px"
    :src="identifierIcon"
    :alt="`${identifier.scheme}: ${identifier.identifier}`")
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

  showIdentifier() {
    if (this.identifier.scheme.toLowerCase() === 'orcid') {
      let idUrl = ''

      if (!this.identifier.identifier.startsWith('https://')) {
        idUrl = `https://orcid.org/${encodeURIComponent(this.identifier.identifier)}`
      }

      window.open(idUrl, '_blank')
    }
  }
}
</script>
