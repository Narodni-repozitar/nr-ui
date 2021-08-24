import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {axios} from 'src/boot/axios'
import {useRouter} from 'vue-router'
import useCollection from 'src/composables/useCollection'
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'

export default function useFSM(record) {
    const {t} = useI18n()
    const $q = useQuasar()
    const router = useRouter()
    const {model} = useCollection()
    const {communityId} = useContext(community)

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

    function makeTransition (transition) {
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

    async function _makeTransition (transition, force) {
        changingState.value = true
        try {
            await axios.post(transition.url, {
                force
            })
            if (transition.code === 'approve') {
                await router.replace({
                    name: 'published-detail',
                    params: {
                        communityId: communityId.value,
                        model: model.value,
                        recordId: record.http.data.id
                    }
                })
                return
            }
            if (transition.code === 'revert_approval') {
                console.log(record)
                await router.replace({
                    name: 'detail',
                    params: {
                        communityId: communityId.value,
                        model: model.value,
                        state: 'draft',
                        recordId: record.http.data.id
                    }
                })
                return
            }
            if (transition.code === 'delete_draft') {
                await router.replace({
                    name: 'list',
                    params: {
                        communityId: communityId,
                        model: model
                    }
                })
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
    return {changingState, makeTransition, transitions}
}
