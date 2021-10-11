<template lang="pug">
q-input(v-model="doi"
  autofocus
  :label="$t('label.enterArticleDOI')"
  :hint="$t('hint.DOIExample')"
  :error="doiError"
  :error-message="$t('message.resolveDOIError')"
  @input="doiError=false")
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {axios} from 'src/boot/axios'
export default defineComponent({
  emits: ['exists', 'resolve', 'invalid'],
  props: {
    val: String,
    dataset: Object
  },
  setup(props, ctx) {
    const value = ref(props.val)
    const $q = useQuasar()
    const {t} = useI18n()
    const doi = ref(props.val || '')
    const doiError = ref(false)
    watch((value), () => {
      doi.value = props.val
    })

    function alreadyExists() {
      $q.dialog({
        title: t('section.articleExistsError'),
        message: t('message.relatedItemExistsError'),
        persistent: false,
        contentStyle: {zIndex: 8000}
      }).onOk(() => {
        doiError.value = false
        ctx.emit('exists', {})

      })
    }

    function validate() {
      const headers = {
        'Content-Type': 'application/json'
      }
      doi.value = doi.value.trim()

      const alreadyAttached = props.dataset.metadata.relatedItems?.filter
      (ri => ri.itemPIDs?.map(pid => pid.identifier).includes(doi.value)).length > 0;

      axios.get(`/resolve-article/${doi.value}`, {headers: headers})
          .then((response) => {
            const article = response.data
            if (alreadyAttached) {
              alreadyExists()
              return
            }
            if (article && doi.value !== '') {
              doiError.value = false
              ctx.emit('resolve', article)
            } else {
              doiError.value = true
            }
          })
          .catch(err => {
            doiError.value = true
            ctx.emit('invalid', doi.value)
          })
    }

    return {doi, doiError, validate}
  }
})
</script>

