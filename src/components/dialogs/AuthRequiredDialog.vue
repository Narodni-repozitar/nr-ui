<template lang="pug">
q-dialog(ref="dialog" @hide="onDialogHide" persistent)
  q-card.bg-accent.text-white.q-dialog-plugin
    q-card-section.q-ml-sm.q-mt-md.q-pb-none
      .text-h5 {{ $t('label.authRequired') }}
      q-separator(dark spaced)
      .text-body2 {{ $t('message.authRequired') }}
    q-card-actions(align="right").q-pa-md.q-mr-md
      .row.justify-between.full-width
        q-btn.col-auto(@click="$router.back()" flat icon="arrow_back" color="white") {{ $t('label.back') }}
        q-btn.col-auto.bg-white(@click="initiateLogin" flat icon="vpn_key" color="black")  {{ $t('action.login') }}
    q-inner-loading(dark size="lg" :showing="progress")
      q-spinner-grid(size="md" :message="$t('message.loginInProgress')")
</template>
<script>
import {defineComponent, reactive, ref} from 'vue'
import TermChip from 'components/taxonomy/TermChip'
import TaxonomyTree from 'components/taxonomy/TaxonomyTree'
import deepcopy from 'deepcopy'
import {usePopupLogin} from "@oarepo/vue-popup-login";
import {loginOptions} from "src/constants";
import CircularSpinner from "components/ui/CircularSpinner";

export default defineComponent({
  name: 'AuthRequiredDialog',
  emits: ['ok', 'hide'],
  components: {CircularSpinner},
  setup(props, ctx) {
    const progress = ref(false)
    const dialog = ref(null)
    const {login} = usePopupLogin(loginOptions)

    function show() {
      dialog.value.show()
    }

    function hide() {
      dialog.value.hide()
    }

    function onDialogHide() {
      ctx.emit('hide')
    }

    async function initiateLogin() {
      progress.value = true
      const loginOutcome = await login()
      progress.value = false
      hide()
      ctx.emit('ok', loginOutcome)
    }

    function onCancelClick() {
      hide()
    }

    return {
      dialog,
      progress,
      show,
      hide,
      initiateLogin,
      onDialogHide,
      onCancelClick,
    }
  }
})
</script>

<style lang="sass">
</style>
