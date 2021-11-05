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
    const types = ['image/png','application/pdf','audio/mpeg','video/mp4', 'image/jpeg']
    if(!types.includes(mimetype)){
      return require('src/assets/files/univerzal.png')
    }
    return {
      'image/png': require('src/assets/files/png.png'),
      'application/pdf': require('src/assets/files/pdf.png'),
      'audio/mpeg': require('src/assets/files/mp4.png'),
      'video/mp4': require('src/assets/files/mp4.png'),
      'image/jpeg': require('src/assets/files/jpg.png'),
    }[mimetype]
  }
}
</script>
