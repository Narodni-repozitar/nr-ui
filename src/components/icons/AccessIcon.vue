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
    return this.accessRights.filter(x => x.level === 1)[0];
  }
  get accessIcon() {
    const slug = this.right?.links.self.split('/').pop()
    return {
      'c-abf2': 'img:/icons/locks/open.png',
      'c-f1cf': 'img:/icons/locks/partial_time.png',
      'c-16ec': 'img:/icons/locks/partial_institution.png',
      'c-14cb': 'img:/icons/locks/partial_person.png' // TODO: je to tohle ?
    }[slug]
  }
  get title() {
    return this.right?.title[this.$i18n.locale]
  }
}
</script>
