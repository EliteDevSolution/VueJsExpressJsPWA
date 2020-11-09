/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Vuex from 'vuex'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"
import moduleAuth from './auth/moduleAuth.js'
import moduleMydata from './mydata/moduleMydata.js'
import moduleUsers from './users/moduleUsers.js'

Vue.use(Vuex)

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
      auth: moduleAuth,
      users: moduleUsers,
      mydata: moduleMydata
    },
    strict: process.env.NODE_ENV !== 'production'
})
