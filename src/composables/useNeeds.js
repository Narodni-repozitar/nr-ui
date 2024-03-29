import {computed} from "vue";
import {OWNER_FIELD, STATE_EDITING, STATE_PENDING_APPROVAL, STATUS_FIELD} from "src/constants";
import useAuth from "src/composables/useAuth";
import {parseCommunityRole} from "src/utils";

export default function useNeeds(record) {
  const {authenticated, currentUser, currentUserRoles} = useAuth()

  const needEditableState = computed(() => {
    return needStates([STATE_EDITING, STATE_PENDING_APPROVAL, undefined])
  })

  function needState(state) {
    return record.value[STATUS_FIELD] === state
  }

  function needStates(states) {
    return states.includes(record.value[STATUS_FIELD])
  }

  const needOwner = computed(() => {
    return authenticated.value && record.value[OWNER_FIELD] === currentUser.value.id
  })

  function needCommunityRole(cid, role) {
    if (currentUserRoles.value.length) {
      return currentUserRoles.value.filter(rol => {
        const parsed = parseCommunityRole(rol)
        if (parsed) {
          const {communityId, roleName} = parsed
          return communityId === cid &&
            roleName === role
        }
      }).length;
    }
    return false
  }

  return {needEditableState, needOwner, needStates, needCommunityRole}
}
