<template>
<router-view v-slot="{ Component }">
  <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      appear
      :duration="1000">
    <component :is="Component"/>
  </transition>
</router-view>
</template>
<script>
import {defineComponent} from 'vue';
import {useI18n} from 'vue-i18n'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'App',
  setup() {
    const {locale} = useI18n({useScope: 'global'})
    const q = useQuasar()
    locale.value = 'cs'
    try {
      import('quasar/lang/cs')
          .then(lang => {
            q.lang.set(lang.default)
          })
    } catch (err) {
    }
  }
})
</script>
