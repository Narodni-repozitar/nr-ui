<template>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'App',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const q = useQuasar()
    locale.value = 'cs'
    q.lang.set('cs')
  }
})
</script>
