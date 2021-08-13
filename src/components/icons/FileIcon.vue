<template lang="pug">
q-img(:src="fileIcon" v-if="file && fileIcon"  :width="size" :title="title")
</template>

<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'FileIcon',
  props: {
    size: String,
    title: String,
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
      'image/png': require('src/assets/files/png.png')
    }[mimetype]
  }
}
</script>
