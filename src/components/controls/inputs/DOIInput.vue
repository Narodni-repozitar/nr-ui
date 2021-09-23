<template lang="pug">
q-input(v-model="doi"
        autofocus
        :label="$t('label.enterArticleDOI')"
        :error="doiError"
        :error-message="$t('message.resolveDOIError')"
        @input="doiError=false")
</template>

<script>
import {defineComponent, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {axios} from 'src/boot/axios'

export default defineComponent({
  emits: ['exists', 'resolve'],
  props: {
    val: String,
    dataset: Object
  },
  data () {

  },
  setup (props, ctx) {
    const route = useRoute()
    const value = ref(props.val)
    const communityId = route.params.communityId
    const router = useRouter()
    const $q = useQuasar()
    const {t} = useI18n()
    const doi = ref(props.val || '')
    const doiError = ref(false)
    watch((value), () => {
        doi.value = props.val
    })

    function alreadyExists () {
      $q.dialog({
        title: t('section.articleExistsError'),
        message: t('message.relatedItemExistsError'),
        persistent: false,
        contentStyle: { zIndex: 8000 }
      }).onOk(() => {
       doiError.value = false
       ctx.emit('exists', {})

      })
    }

    function validate () {

      const headers = {
        'Content-Type': 'application/json'
      }
      var alreadyAttached = false
      try{
          if(this.dataset.metadata.relatedItems.filter(t => t.itemPIDs[0].value === this.doi.replace(/\s/g, "")).length > 0) {
          alreadyAttached = true
        }
      }
      catch {
        alreadyAttached =  false
      }

      axios.get(`/resolve-article/${this.doi}`, headers)
          .then((response) =>
            {
              const article = response.data
              if(alreadyAttached){
                alreadyExists()
                return
              }
              if (article && doi.value !== '') {
                doiError.value = false
                ctx.emit('resolve', article)
                    }
              else {
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
