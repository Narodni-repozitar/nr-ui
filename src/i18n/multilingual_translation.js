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
      return multilang['cs']
    }
  }

}


export default {
  install(app) {
    app.config.globalProperties.$mt = useTranslated().mt
  }
}
