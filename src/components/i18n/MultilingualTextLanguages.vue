<template lang="pug">
div
  .row(v-for="ltext in langTexts")
    div
      q-badge(outline color="primary") {{ $t(`value.lang.${ltext.language}`) }}
    div.q-pl-sm
      template(v-for="(a, idx) in ltext.texts")
        slot(name="separator" v-if="idx>0")
          span {{ separator }}
        span {{ a }}
</template>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'mt-languages',
  props: {
    text: Array | Object,
    separator: {
      type: String,
      default: ' : '
    },
    excludeCurrentLanguage: {
      type: Boolean,
    }
  }
})
class MultilingualTextLanguages extends Vue {
  get langTexts() {
    if (!this.text) {
      return []
    }
    const languages = new Set()
    const text = Array.isArray(this.text) ? this.text : [this.text]
    text.forEach(t => {
      Object.keys(t).forEach(l => {
        languages.add(l)
      })
    })
    if (this.excludeCurrentLanguage) {
      languages.delete(this.$i18n.locale)
    }
    let sortedLanguages = Array.from(languages)
    sortedLanguages.sort()
    return sortedLanguages.map(lang => {
      return {
        language: lang,
        texts: text.map(x => x[lang]).filter(x => x)
      }
    })
  }
}
</script>
