<template>
  <router-view v-slot="{ Component }">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="1000"
    >
      <component :is="Component" />
    </transition>
  </router-view>
</template>
<script>
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeta, useQuasar } from 'quasar'
import { community } from 'src/contexts/community'
import { createContext, provideContext } from 'vue-context-composition'

export default defineComponent({
  name: 'App',
  setup () {
    const { t, locale } = useI18n({ useScope: 'global' })
    const q = useQuasar()
    locale.value = 'cs'
    try {
      import('quasar/lang/cs')
        .then(lang => {
          q.lang.set(lang.default)
        })
    } catch (err) {
    }

    // Load available communities for this app & provide community context
    const { newContextFn } = community
    const { loadCommunities } = newContextFn()
    loadCommunities()

    provideContext(community)

    useMeta(() => {
      return {
        title: t('nav.intro') || ' ',
        titleTemplate: title => `${title !== ' ' ? title + ' - ' : ' '}${t('app.productName')}`,
        meta: {
          description: { name: 'description', content: t('app.description') },
        }
      }
    })
  }
})
</script>
