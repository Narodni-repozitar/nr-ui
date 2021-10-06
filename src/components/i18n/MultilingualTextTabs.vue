<template lang="pug">
q-tabs.bold.inline.multilingual-text-tabs(v-model='selectedTab' align="left"
  active-color="secondary" no-caps indicator-color="transparent")
  q-tab.q-px-none(v-for='(tab, idx) in langTexts'
    :key='tab.language' :name='tab.language'
  )
    .row
      q-separator(v-if='idx>0' vertical color="secondary" size="2px")
      span.q-px-md.text-lowercase {{ $t(`value.lang.${tab.language}`) }}
q-tab-panels.bg-transparent.multilingual-text-tab-content(v-model="selectedTab" animated)
  q-tab-panel(v-for='(tab, idx) in langTexts'
    :key='tab.language' :name='tab.language')
    div(v-for="a in tab.texts")
      span {{ a }}
</template>
<script>
import {Options, Vue} from 'vue-class-component'

export default @Options({
  name: 'mt-languages',
  props: {
    text: Array | Object
  }
})
class MultilingualTextLanguages extends Vue {
  selectedTab = null

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
    let sortedLanguages = Array.from(languages)
    sortedLanguages.sort()
    return sortedLanguages.map(lang => {
      return {
        language: lang,
        texts: text.map(x => x[lang]).filter(x => x)
      }
    })
  }

  mounted() {
    const locale = this.$i18n.locale
    if (this.langTexts.find(x => x.language === locale)) {
      this.selectedTab = locale
    } else if (this.langTexts.find(x => x.language === 'cs')) {
      this.selectedTab = 'cs'
    } else if (this.langTexts.find(x => x.language === 'en')) {
      this.selectedTab = 'en'
    } else if (this.langTexts.length > 0) {
      this.selectedTab = this.langTexts[0].language
    }
  }

}
</script>
