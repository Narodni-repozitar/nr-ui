import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {computed} from "vue";
import {API_MULTILINGUAL_SUPPORTED_LANGUAGES} from 'src/constants'

export default function useMultilingual (model, inputRefs, onChangeFn) {
  const {t} = useI18n()
  const $q = useQuasar()

  const availableLangs = computed(() => {
    return API_MULTILINGUAL_SUPPORTED_LANGUAGES.filter(ln => !model.value.map(v => v.lang).includes(ln))
  })

  function addLangVariant() {
    $q.dialog({
      title: t('label.language'),
      message: `${t('action.choose')} ${t('label.language')}`,
      options: {
        type: 'radio',
        model: 'lang',
        items: availableLangs.value.map(l => {
          return {label: t(`value.lang.${l}`), value: l}
        })
      },
      cancel: true,
      persistent: false
    }).onOk(data => {
      model.value.push({lang: data, val: ''})
      onChangeFn()
    })
  }

  function rmLangVariant(idx, callbackFn) {
    model.value.splice(idx, 1)
    inputRefs.value.splice(idx, 1)
    onChangeFn()
  }

  return {addLangVariant, rmLangVariant, availableLangs}
}
