<template lang="pug">
q-img(:src="rightsIcon" v-if="rights.length && rightsIcon" :title="title")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'RightsIcon',
  props: {
    rights: {
      type: Array,
      required: true
    }
  }
})
class RightsIcon extends Vue {
  get right() {
    return this.rights.filter(x => !x.is_ancestor)[0]
  }
  get rightsIcon() {
    const slug = this.right?.links.self.split('/').pop()
    console.log(this.slug)

    if (slug.endsWith('by')) {
      return require('src/assets/licenses/by.png')
    } else if (slug.endsWith('by-nc')) {
      return require('src/assets/licenses/by-nc.png')
    } else if (slug.endsWith('by-nc-nd')) {
      return require('src/assets/licenses/by-nc-nd.png')
    } else if (slug.endsWith('by-nc-sa')) {
      return require('src/assets/licenses/by-nc-sa.png')
    } else if (slug.endsWith('by-nd')) {
      return require('src/assets/licenses/by-nd.png')
    } else if (slug.endsWith('by-sa')) {
      return require('src/assets/licenses/by-sa.png')
    }
  }
  get title() {
    return this.right?.title[this.$i18n.locale]
  }
}
</script>
