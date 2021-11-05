<template lang="pug">
q-icon(:name="accessIcon" v-if="accessIcon" :title="title")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'AccessIcon',
  props: {
    accessRights: {
      type: Array,
      required: true
    }
  }
})
class AccessIcon extends Vue {
  get right() {
    return this.accessRights[0] // .filter(x => x.level === 1)[0];
  }
  get accessIcon() {
    const slug = this.right?.links.self.split('/').pop()
    return {
      'c-abf2': 'img:/icons/locks/zamky_open_access.png',
      'c-f1cf': 'img:/icons/locks/zamky_Partialy_closed_access_hodiny.png',
      'c-16ec': 'img:/icons/locks/zamky_Partialy_closed_access_persona.png',
      'c-14cb': 'img:/icons/locks/zamky_Partialy_closed_access.png' // TODO: ikona pro metadata-only
    }[slug]
  }
  get title() {
    return this.right?.title[this.$i18n.locale]
  }
}
</script>
