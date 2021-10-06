import {computed} from "vue";
import {OWNER_FIELD, STATE_EDITING, STATE_PENDING_APPROVAL, STATUS_FIELD} from "src/constants";
import useAuth from "src/composables/useAuth";

export default function useNeeds(record) {
  const {authenticated, currentUser, currentUserRoles} = useAuth()

  const needEditableState = computed(() => {
    return needStates([STATE_EDITING, STATE_PENDING_APPROVAL, undefined])
  })

  function needState(state) {
    return record[STATUS_FIELD] === state
  }

  function needStates(states) {
    return states.includes(record[STATUS_FIELD])
  }

  const needOwner = computed(() => {
    return authenticated.value && record[OWNER_FIELD] === currentUser.value.id
  })

  function needRole(role) {
    return false
    // return currentUserRoles.value.filter(rol => {
    //   const {communityId, roleName} = parseCommunityRole(rol)
    //   return record[PRIMARY_COMMUNITY_FIELD] === communityId &&
    //          roleName === role
    // }).length
  }

  return {needEditableState, needOwner, needRole, needStates, needState}
}
