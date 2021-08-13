<template lang="pug">
q-img(:src="fileIcon" v-if="file")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'FileIcon',
  props: {
    file: {
      type: Object,
      required: true
    }
  }
})
class FileIcon extends Vue {
  // TODO: add mimetype assets
  get fileIcon() {
    const mimetype = this.file?.type
    return {
    }[mimetype]
  }
}
</script>
