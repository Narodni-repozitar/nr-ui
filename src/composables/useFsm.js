import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {axios} from 'src/boot/axios'
import {useRouter} from 'vue-router'
import useCollection from 'src/composables/useCollection'
import {useContext} from 'vue-context-composition'
import useDOIStatus from 'src/composables/useDOIStatus'
import {community} from 'src/contexts/community'
import DOIRequestDialog from "components/dialogs/DOIRequestDialog";

export default function useFSM(record) {
  const {t} = useI18n()
  const $q = useQuasar()
  const router = useRouter()
  const {model} = useCollection()
  const {communityId} = useContext(community)
  const {hasNoDOI} = useDOIStatus(record?.metadata)
  const changingState = ref(false)

  const transitions = computed(() => {
    return Object.entries(record.http.data?.links?.transitions || {}).map(([code, url]) => ({
      url,
      code: code,
      label: t(`action.${code}`),
      actionLabel: t(`action.${code}`),
      icon: t(`icon.${code}`)
    }))
  })

  function makeTransition(transition) {
    if (transition.code === 'request_approval' && hasNoDOI.value) {
      $q.dialog({
        component: DOIRequestDialog,
        // Pass current dataset object to dialog
        componentProps: {
          dataset: record?.http?.data,
          datasetLinks: record?.http?.data?.links,
        },
      }).onOk(
        async (data) => {

          const validity = record?.metadata['oarepo:validity']?.valid
          if (validity !== false || ['request_changes', 'delete_draft'].includes(transition.code)) {
            _makeTransition(transition, false, data)
          } else {
            $q.dialog({
              class: 'bg-warning',
              title: t('label.actionApprove'),
              message: `${t('message.recordNotValid')}. ${t('message.doYRlyWnt')} ${transition.actionLabel}?`,
              cancel: true,
              persistent: true
            }).onOk(async () => {
              _makeTransition(transition, true, data)
            })
          }
        })
    } else {
      $q.dialog({
      class: 'bg-primary-dark',
      dark: true,
      square: true,
      title: t('label.actionApprove'),
      message: `${t('message.doYRlyWnt')} ${transition.actionLabel}?`,
      cancel: true,
      persistent: true
     }).onOk(async () => {
    const validity = record?.metadata['oarepo:validity']?.valid
    if (validity !== false || ['request_changes', 'delete_draft'].includes(transition.code)) {
      _makeTransition(transition, false)
    } else {
      $q.dialog({
        class: 'bg-warning',
        title: t('label.actionApprove'),
        message: `${t('message.recordNotValid')}. ${t('message.doYRlyWnt')} ${transition.actionLabel}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        _makeTransition(transition, true)
      })
    }
  })
}
}

  async function _makeTransition(transition, force, data = null) {
    changingState.value = true
    try {
      const resp =  await axios.post(transition.url, {force, data})
      if (transition.code === 'approve') {
        console.log(resp)
        await router.replace({
          name: 'published-record',
          params: {
            communityId: communityId.value,
            model: model.value,
            recordId: record.http.data.id,
          }
        })
        return
      }
      if (transition.code === 'revert_approval') {
        console.log(record)
        await router.replace({
          name: 'record',
          params: {
            communityId: communityId.value,
            model: model.value,
            recordId: record.http.data.id
          }
        })
        return
      }
      if (transition.code === 'delete_draft') {
        // TODO: navigate to something more specifics
        await router.replace({name: 'all'})
        $q.notify({
          message: t('message.draftDeleted'),
          color: 'accent',
          icon: 'delete_sweep'
        })
        return
      }
      $q.notify({
        message: t('message.completeSuccess'),
        color: 'positive',
        icon: 'published_with_changes'
      })
      // Force refresh of record data after state change
      await record.http.reload({keepPrevious: false})
    } catch (e) {
      console.log(e)
      $q.dialog({
        class: 'bg-negative',
        dark: true,
        title: t('error.stateChangeFail'),
        message: `${t('error.stateChangeMessage')}: ${e} ${JSON.stringify(e.response.data)}`,
        cancel: false,
        persistent: true,
        icon: 'error'
      })
    }
    changingState.value = false
  }

  return {changingState, makeTransition, transitions, _makeTransition}
}
