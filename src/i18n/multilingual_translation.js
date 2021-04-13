import {useI18n} from "vue-i18n";

export function useTranslated() {
  return {
    mt: (multilang) => {
      const {locale} = useI18n({useScope: 'global'})
      if (!multilang) {
        return undefined
      }
      if (multilang[locale.value]) {
        return multilang[locale.value]
      }
      if (multilang['cs']) {
        return multilang['cs']
      }
      for (const k of Object.keys(multilang)) {
        if (typeof multilang[k] === 'string') {
          return multilang[k]
        }
      }
    }
  }

}


export default {
  install(app) {
    app.config.globalProperties.$mt = useTranslated().mt
  }
}
