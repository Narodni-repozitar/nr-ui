import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useAuth from 'src/composables/useAuth'

export default function useNotify() {
    const {t} = useI18n()
    const $q = useQuasar()
    const {currentUser} = useAuth()


    function notifyError (msg) {
        $q.notify({message: t(msg), color: 'negative'})
    }

    function notifySuccess (msg, args) {
        $q.notify({message: t(msg, args), color: 'positive'})
    }

    function submitBugReport(err) {
      // TODO: implement send mail report to support RT
      const email = currentUser.value?.email
      $q.notify({message: t('message.bugReportSent'), color: 'accent'})
    }

    return {notifyError, notifySuccess, submitBugReport}
}
