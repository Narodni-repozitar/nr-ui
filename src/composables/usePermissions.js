import {computed} from "vue";
import useNeeds from "src/composables/useNeeds";
import useCollection from "src/composables/useCollection";
import {STATE_EDITING} from "src/constants";

export default function usePermissions(record) {
  const {isDatasets} = useCollection()
  const {needEditableState, needOwner, needRole, needState} = useNeeds(record)

  const canEditRecord = computed(() => {
    console.log(needEditableState.value, needOwner.value, canEditCommunityRecords.value)
    return needEditableState.value && (needOwner.value && needState(STATE_EDITING)) // TODO: || canEditCommunityRecords.value)
  })

  const canEditCommunityRecords = computed(() => {
    return needRole('curator')
  })

  const canAttachArticle = computed(() => {
    return canEditRecord.value && isDatasets.value
  })

  return {canEditRecord, canAttachArticle}
}
