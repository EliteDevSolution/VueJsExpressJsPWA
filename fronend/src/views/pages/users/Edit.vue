<template>
    <vx-card no-shadow v-bind:title="$t('users.update_user.title')">

        <vs-divider color="primary"> {{ $t('users.general_info')}} </vs-divider>
        <!-- Info -->
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    class="w-full"
                    name="firstname"
                    v-model="firstname"
                    icon-pack="feather"
                    icon="icon-edit-1"
                    icon-no-border
                    v-bind:label="$t('global.field.FirstName')"
                    v-bind:placeholder="$t('global.field.FirstName')"
                    v-validate="'required|min:3'"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('firstname') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    class="w-full"
                    name="lastname"
                    v-model="lastname"
                    icon-pack="feather"
                    icon="icon-edit-1"
                    icon-no-border
                    v-bind:label="$t('global.field.LastName')"
                    v-bind:placeholder="$t('global.field.LastName')"
                    v-validate="'required'"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('lastname') }}</span>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    class="w-full"
                    name="phone"
                    v-model="phone"
                    icon-pack="feather"
                    icon="icon-smartphone"
                    icon-no-border
                    v-bind:label="$t('global.field.Phone')"
                    v-bind:placeholder="$t('global.field.Phone')"
                    v-validate="'required|min:8'"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('phone') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <label class="vs-input--label">{{ $t('users.role') }}</label>
                <v-select
                    name="role"
                    :disabled="isSuerAdmin"
                    v-model="role"
                    :options="roleOptions"
                    :clearable="false"
                    multiple
                    v-validate="'required'"
                    data-vv-validate-on="blur"
                    :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                <span class="text-danger text-sm">{{ errors.first('role') }}</span>
            </div>
        </div>

        <div class="vx-row mb-2">
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    class="w-full"
                    name="email"
                    v-model="email"
                    v-bind:label="$t('global.field.Email')"
                    v-bind:placeholder="$t('global.field.Email')"
                    v-validate="'required|email'"
                    ref="email"
                    icon-pack="feather"
                    icon="icon-mail"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    v-validate="'min:6'"
                    type="password"
                    name="password"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    @keyup.enter="save"
                    v-bind:label="$t('global.field.Password')"
                    v-bind:placeholder="$t('global.field.Password')"
                    v-model="password"
                    class="w-full" />
                <span class="text-danger text-sm">{{ errors.first('password') }}</span>
            </div>
        </div>
        <!-- Save & Reset Button -->
        <div class="flex flex-wrap items-center justify-end mt-base">
            <vs-button class="ml-auto mt-2" @click="save" :disabled="!validateForm">{{ $t('global.button.save_change') }}</vs-button>
        </div>
    </vx-card>
</template>

<script>

    import flatPickr from 'vue-flatpickr-component'
    import 'flatpickr/dist/flatpickr.css'
    import vSelect from "vue-select"

    export default {
        components: {
            vSelect,
            flatPickr
        },
        data () {
            return {
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                password: "",
                roleOptions: [],
                role: [],
                isSuerAdmin: false
            }
        },
        computed: {
            validateForm () {
                return !this.errors.any()
            }
        },
        mounted() {
            this.getRoleOptions()
            this.load()
        },
        methods: {
            getRoleOptions () {
                this.$vs.loading()
                return this.$store.dispatch('users/get_roles')
                    .then((response) => {
                        this.roleOptions = response.data
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
            load () {
                this.$vs.loading()
                const payload = { id: this.$route.params.user }
                this.$store.dispatch('users/get', payload)
                    .then((response) => {
                        this.firstname = response.data[0].firstname
                        this.lastname = response.data[0].lastname
                        this.email = response.data[0].email
                        this.phone = response.data[0].phone;
                        let roles = [];
                        console.log(this.$route.params.user)
                        if(this.$route.params.user === 1) this.isSuerAdmin = true
                        response.data[0].User_has_roles.forEach(ele => {
                            roles.push({id: ele.role_id, label: ele.Role.name })
                        })
                        this.role = roles
                        this.$vs.loading.close()
                    })
                    .catch(error => {
                        this.$vs.loading.close()
                    })
            },
            // Save personal data
            save () {
                this.$validator.validateAll().then(isValid => {
                    if (isValid)
                    {
                        this.$vs.loading()
                        const payload = {
                            userDetails: {
                                id: this.$route.params.user,
                                firstname: this.firstname,
                                lastname: this.lastname,
                                phone: this.phone,
                                email: this.email,
                                password: this.password,
                                role: this.role
                            }
                        }
                        this.$store.dispatch('users/update', payload)
                        .then(() => {
                            this.$vs.loading.close()
                            this.$vs.notify({
                                title: this.$t('global.Success'),
                                text: this.$t('users.message_success_user_update'),
                                iconPack: 'feather',
                                icon: 'icon-check',
                                color: 'success'
                            })
                        })
                        .catch(error => {
                            this.$vs.loading.close()
                            if (error.response.status === 421) {
                                error.response.data.data.details.forEach(item => {
                                    this.errors.add({
                                        scope: null,
                                        field: item.path,
                                        rule: 'required',
                                        msg: item.message
                                    })
                                })
                            } else {
                                this.$vs.notify({
                                    title: this.$t('global.Error'),
                                    text: this.$t('message.DataLoadingError'),
                                    iconPack: 'feather',
                                    icon: 'icon-check',
                                    color: 'danger'
                                })
                            }
                        })
                    }
                })
            }
        }
    }
</script>
