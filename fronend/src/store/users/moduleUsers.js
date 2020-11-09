import state from './moduleUsersState'
import mutations from './moduleUsersMutations.js'
import actions from './moduleUsersActions.js'
import getters from './moduleUsersGetters.js'

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
