
import axios from '@/axios'

export default {
    // Save persional data
    add ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.post('/api/users/add',
                payload.userDetails
            )
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    // Save persional data
    update ({ commit }, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/users/user_update/${payload.userDetails.id}`,
                payload.userDetails
            )
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    // Save persional data
    change_status ({ commit }, payload) {
        const { id, status } = payload

        return new Promise((resolve, reject) => {
            axios.post(`/api/users/change_status/${id}`, {
                status: status
            }).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    users ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/users/getall`).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    get_roles ({ commit }) {
        return new Promise((resolve, reject) => {
            axios.get('/api/users/get_roles').then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    get ({ commit }, payload) {
        const { id } = payload
        return new Promise((resolve, reject) => {
            axios.get(`/api/users/get/${id}`).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    delete ({ commit }, payload) {
        const { id } = payload
        return new Promise((resolve, reject) => {
            axios.delete(`/api/users/delete/${id}`).then(response => {
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
}
