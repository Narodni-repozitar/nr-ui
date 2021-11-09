<template lang="pug">
q-img(:src="rightsIcon" v-if="right && rightsIcon" :width="size" :title="title")
label-block.column.full-width.q-mt-lg(:label="$t('label.license')" v-else-if="right")
  span {{ $mt(right.title) }}
</template>

<script>
import {Options, Vue} from 'vue-class-component'
import LabelBlock from "components/record/LabelBlock"

export default @Options({
  name: 'RightsIcon',
  components: {
    LabelBlock
  },
  props: {
    size: {
      type: String
    },
    rights: {
      type: Array,
      required: true
    }
  }
})
class RightsIcon extends Vue {
  get right() {
    const rights = this.rights.filter(x => !x.is_ancestor)
    if (rights.length > 0) {
      return rights[0]
    }
  }
  get rightsIcon() {
    const slug = this.right?.links.self.split('/').pop()
    if (slug && slug.endsWith('by')) {
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
}
</script>
