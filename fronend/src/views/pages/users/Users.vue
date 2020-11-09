<template>
    <vx-card v-bind:title="$t('users.title')">

        <!-- TABLE ACTION ROW -->
        <div class="flex flex-wrap justify-left mb-2">
            <vs-button icon-pack="feather" icon="icon-plus" :to="{name: 'users-add'}">{{ $t('users.add') }}</vs-button>
        </div>
        <vs-table
            :sst="false"
            description
            @search="handleSearch"
            @change-page="handleChangePage"
            @sort="handleSort"
            v-model="selected"
            search
            pagination
            max-items="10"
            :data="users"
            style="width: 100%">
            <template slot="thead">
                <vs-th sort-key="email">{{ $t('global.field.Email') }}</vs-th>
                <vs-th sort-key="firstname">{{ $t('global.field.FirstName') }}</vs-th>
                <vs-th sort-key="lastname">{{ $t('global.field.LastName') }}</vs-th>
                <vs-th>{{ $t('users.role') }}</vs-th>
                <vs-th sort-key="status">{{ $t('users.status') }}</vs-th>
                <vs-th sort-key="id">{{ $t('users.action') }}</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].email">
                        {{ tr.email }}
                    </vs-td>
                    <vs-td :data="data[indextr].firstname">
                        {{ tr.firstname }}
                    </vs-td>
                    <vs-td :data="data[indextr].lastname">
                        {{ tr.lastname }}
                    </vs-td>
                    <vs-td>
                        <div v-for="item in data[indextr].User_has_roles">
                            <span v-if="item.Role.name === 'SuperAdmin'" class="con-vs-alert-primary">{{ item.Role.name }}</span>
                            <span v-else class="con-vs-alert-success">{{ item.Role.name }}</span>
                        </div>
                    </vs-td>
                    <vs-td v-if="$store.state.AppActiveUser.id == data[indextr].id">
                        <vs-switch color="success" disabled="" v-model="data[indextr].status == 1 ? true : false">
                            <span slot="on">{{ $t('global.switch.activated') }}</span>
                            <span slot="off">{{ $t('global.switch.inactivated') }}</span>
                        </vs-switch>
                    </vs-td>
                    <vs-td v-else>
                        <vs-switch color="success" v-model="tr.status == 1 ? true : false" @click="changeStatus(tr.id)">
                            <span slot="on">{{ $t('global.switch.activated') }}</span>
                            <span slot="off">{{ $t('global.switch.inactivated') }}</span>
                        </vs-switch>
                    </vs-td>
                    <vs-td :data="data[indextr].id">
                        <div class="flex flex-wrap justify-left">
                            <vs-button
                                size="small" color="rgb(62, 201, 214)"
                                icon-pack="feather"
                                icon="icon-edit"
                                class="mr-1"
                                :to="{name: 'users-edit', params: { user: data[indextr].id }}">
                            </vs-button>
                            <vs-button
                                v-if="$store.state.AppActiveUser.id == data[indextr].id" disabled="" size="small" color="danger"
                                @click="deleteUser(data[indextr].id)"
                                icon-pack="feather"
                                icon="icon-x-square">
                            </vs-button>
                            <vs-button
                                v-else size="small" color="danger"
                                @click="deleteUser(data[indextr].id)"
                                type="filled"
                                icon-pack="feather"
                                icon="icon-x-square">
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</template>

<script>
    export default {
        data:()=>({
            selected:[],
            log: [],
            users:[],
            delete_user_id: 0,
            activeConfirm: true
        }),
        computed: {
        },
        methods:{
            changeStatus(id) {
                this.$vs.loading()
                const obj = this.users.find(x => x.id === id);
                const status = obj.status == 0 ? 1 : 0
                const payload = { id: id, status: status }
                return this.$store.dispatch('users/change_status', payload)
                    .then((response) => {
                        obj.status = status
                        this.$vs.loading.close()
                        if (status === 1)
                        {
                            this.$vs.notify({
                                title: this.$t('global.Success'),
                                text: this.$t('message.UserActivated'),
                                iconPack: 'feather',
                                icon: 'icon-check',
                                color: 'success'
                            })
                        } else {
                            this.$vs.notify({
                                title: this.$t('global.Success'),
                                text: this.$t('message.UserInactivated'),
                                iconPack: 'feather',
                                icon: 'icon-check',
                                color: 'warning'
                            })
                        }
                    })
                    .catch(error => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: this.$t('global.Error'),
                            text: this.$t('message.serverError'),
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        })
                    })
            },
            getUsers() {
                this.$vs.loading()
                return this.$store.dispatch('users/users')
                    .then((response) => {
                        this.users = response.data
                        this.$vs.loading.close()
                    })
                    .catch(error => {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            title: this.$t('global.Error'),
                            text: this.$t('message.DataLoadingError'),
                            iconPack: 'feather',
                            icon: 'icon-check',
                            color: 'danger'
                        })
                    })
            },
            handleSearch(searching) {
                // console.log(`The user searched for: ${searching}`)
            },
            handleChangePage(page) {
                // console.log(`The user changed the page to: ${page}`)
            },
            handleSort(key, active) {
                // console.log(`the user ordered: ${key} ${active}`)
            },
            deleteUser(id){
                //if(!this.activeConfirm && this.activeConfirm == undefined) return
                if(!this.activeConfirm) return
                this.delete_user_id = id
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: this.$t('message.AreYouSure'),
                    text: this.$t('message.CanNotRevert'),
                    accept: this.acceptAlert,
                    cancel: this.cancelAlert,
                })
                this.activeConfirm = false
            },
            acceptAlert()
            {
                this.activeConfirm = true
                if (this.delete_user_id == 0) return
                const payload = { id: this.delete_user_id }
                this.$store.dispatch('users/delete', payload)
                .then(() => {
                    this.$vs.loading.close()
                    this.$vs.notify({
                        color:'success',
                        title:'Notification',
                        text: this.$t('message.DataDeleteSuccess')
                    })
                    this.getUsers()
                    this.delete_user_id = 0
                })
                .catch(error => {
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: this.$t('global.Error'),
                        text: 'Deleting users error!',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        color: 'danger'
                    })
                    this.delete_user_id = 0
                })
            },
            cancelAlert()
            {
                this.activeConfirm = true
            }
        },
        mounted () {
            this.getUsers()
        }
    }
</script>
