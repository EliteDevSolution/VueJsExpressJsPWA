<template>
    <vx-card no-shadow v-bind:title="$t('users.add_user.title')">

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
                    v-validate="'required|min:1'"
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
                    v-bind:label="$t('global.field.Phone')"
                    v-bind:placeholder="$t('global.field.Phone')"
                    v-validate="'required|min:8'"
                    icon-pack="feather"
                    icon="icon-smartphone"
                    icon-no-border
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('phone') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <label class="vs-input--label">{{ $t('users.role') }}</label>
                <v-select
                    name="role"
                    v-model="role"
                    :options="roleOptions"
                    multiple
                    :clearable="false"
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
                    icon-no-border
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    data-vv-validate-on="blur"
                    v-validate="'required|min:6'"
                    type="password"
                    name="password"
                    icon-no-border
                    icon="icon icon-lock"
                    icon-pack="feather"
                    v-bind:placeholder="$t('global.field.Password')"
                    v-bind:label="$t('global.field.Password')"
                    v-model="password"
                    @keyup.enter="save"
                    class="w-full" />
                <span class="text-danger text-sm">{{ errors.first('password') }}</span>
            </div>
        </div>
        <!-- Save & Reset Button -->
        <div class="flex flex-wrap items-center justify-end mt-base">
            <vs-button class="ml-auto mt-2" @click="save" :disabled="!validateForm">{{ $t('users.add_user.save') }}</vs-button>
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
            }
        },
        computed: {
            validateForm () {
                return !this.errors.any() && this.role.length > 0
            }
        },
        mounted () {
            this.getRoleOptions()
        },
        methods: {
            // Save personal data
            save () {
                this.$validator.validateAll().then(isValid => {
                    if (isValid) {
                        this.$vs.loading()
                        const payload = {
                            userDetails: {
                                firstname: this.firstname,
                                lastname: this.lastname,
                                role: this.role,
                                phone: this.phone,
                                password: this.password,
                                email: this.email
                            }
                        }
                        this.$store.dispatch('users/add', payload)
                        .then((response) => {
                            this.$vs.loading.close()
                            this.$router.push({path: '/users'})
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
                            } else if(error.response.status === 422) {
                                this.$vs.notify({
                                    title: this.$t('global.Error'),
                                    text:  this.$t('message.emailAlreadyTaken'),
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
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
            },
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
            }
        }
    }
</script>
