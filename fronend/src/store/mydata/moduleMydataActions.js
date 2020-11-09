import axios from '@/axios'

export default {
    // Save persional data
    savePersonalData ({ commit }, payload) {
        const { id, firstname, lastname, phone, email, photo } = payload.userDetails
        let formData = new FormData()

        formData.append('firstname', firstname)
        formData.append('lastname', lastname)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('photo', photo)

        return new Promise((resolve, reject) => {
            axios.put(`/api/users/update/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            .then(response => {
              // Update users details
              commit('UPDATE_USER_INFO', response.data.user_info, {root: true})

                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },

    // Remove avatar
    removePhoto ({ commit }, payload) {
        const { id } = payload.userDetails

        return new Promise((resolve, reject) => {
            axios.delete(`/api/users/removePhoto/${id}`)
            .then(response => {
              // Update data in localStorage
              commit('UPDATE_USER_INFO', response.data.user_info, {root: true})

              resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    resetPassword ({ commit }, payload) {
        const { old_password, new_password, confirm_password } = payload
        return new Promise((resolve, reject) => {
            axios.post('/api/users/resetPassword', {
                old_password: old_password,
                new_password: new_password,
                confirm_password: confirm_password
            }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}
