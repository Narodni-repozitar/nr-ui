import {usePopupLogin} from '@oarepo/vue-popup-login'
import {computed, ref} from 'vue'
import useGDPR from 'src/composables/useGDPR'
import {loginOptions} from 'src/constants'
import {useContext} from 'vue-context-composition'
import {community} from 'src/contexts/community'


export default function useAuth() {
  const {state, login, logout, check} = usePopupLogin(loginOptions)
  const {communities, currentCommunity} = useContext(community)
  const {showGdprPrompt} = useGDPR()

  const authenticating = ref(false)

  const authenticated = computed(() => {
    return state.value.loggedIn
  })

  const currentUser = computed(() => {
    if (state.value) {
      return state.value.user
    }
    return null
  })

  const currentUserRoles = computed(() => {
    if (currentUser.value) {
      return currentUser.value.roles
    }
    return []
  })

  const currentUserInfo = computed(() => {
    if (state.value) {
      return state.value.userInfo
    }
    return null
  })

  const currentUserCommunities = computed(() => {
    const croles = currentUserRoles.value.filter(r => r.id.startsWith('community:')).map(r => r.id.split(':')[1])
    return communities.value.filter(c => croles.includes(c.id))
  })

  const effectiveCommunity = computed(() => {
    if (currentCommunity.value) {
      return currentCommunity.value
    } else if (currentUserCommunities.value.length === 1) {
      return currentUserCommunities.value[0]
    } else {
      return false
    }
  })

  const currentUserName = computed(() => {
    if (state.value) {
      const cui = currentUserInfo.value
      if (cui && cui.givenName && cui.familyName)
        return `${cui.givenName} ${cui.familyName}` || currentUser.value?.email
    }
    return ''
  })

  function hasRole(role) {
    if (currentUserRoles.value.find(rol => rol.id === role)) {
      return true
    }
    return false
  }

  async function doLogin() {
    authenticating.value = true
    showGdprPrompt()
      .then(() => {
        login()
      })
      .catch(() => {
      })
      .finally(() => {
        authenticating.value = false
      })
  }

  async function checkLogin() {
    return await check()
  }

  function doLogout() {
    // TODO: update when https://github.com/oarepo/vue-popup-login/issues/170 resolved
    // redirect to route {name: 'logged-out'}
    logout()
  }

  return {
    state,
    authenticated,
    authenticating,
    currentUser,
    currentUserInfo,
    currentUserRoles,
    currentUserName,
    currentUserCommunities,
    effectiveCommunity,
    hasRole,
    doLogin,
    doLogout,
    checkLogin
  }
}
