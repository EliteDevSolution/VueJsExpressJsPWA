import axios, {apiURL} from '@/axios'
import store from '../store.js'
import router from '@/router'

export default {
  // JWT login
  loginJWT ({ commit }, payload) {
    const { email, password } = payload.userDetails

    return new Promise((resolve, reject) => {
      axios.post('/api/users/login', {
        email: email,
        password: password,
        checkbox_remember_me: payload.checkbox_remember_me
      })
      .then(response => {
        // If there's users data in response
        if (response.data.user_info) {
          // Navigate User to homepage

          window.localStorage.clear();
          // Set accessToken
          localStorage.setItem('accessToken', response.data.token)

          response.data.user_info['apiUrl'] = apiURL

          // Update users details
          commit('UPDATE_USER_INFO', response.data.user_info, {root: true})

          router.push(router.currentRoute.query.to || '/').catch(()=>{});
          resolve(response)
        } else {
          reject({message: 'Wrong Email or Password'})
        }
      })
      .catch(error => { reject(error) })
    })
  },

  // JWT logout
  logoutJWT ({ commit }, payload) {
    return new Promise((resolve, reject) => {
        if (!localStorage.getItem(`accessToken`) || !localStorage.getItem(`userInfo`)) {
            window.localStorage.clear();
            return router.push({ name: `login` });
        }
        window.localStorage.clear()
        return router.push({ name: `login` });
    })
  },

  // JWT register
  registerUserJWT ({ commit }, payload) {
    const { firstname, lastname, phone, email, password } = payload.userDetails

    return new Promise((resolve, reject) => {
      axios.post('/api/users/register', {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: email,
        password: password
      })
      .then(response => {

        // Update data in localStorage
        localStorage.setItem('accessToken', response.data.token)
        response.data.user_info['apiUrl'] = apiURL
        commit('UPDATE_USER_INFO', response.data.user_info, {root: true})

        // Redirect User
        router.push(router.currentRoute.query.to || '/')

        resolve(response)
      })
      .catch(error => { reject(error) })
    })
  },

  // JWT refresh token
  fetchAccessToken () {
    return new Promise((resolve) => {
      axios.post('/api/auth/refresh-token', {
        accessToken: localStorage.getItem('accessToKen')
      })
      .then(response => { resolve(response) })
    })
  }

}
