<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color" v-on:keyup.enter="register">
                    <div class="vx-row no-gutter">
                        <div class="vx-col sm:w-full md:w-full lg:w-full mx-auto self-center  d-theme-dark-bg">
                            <div class="px-8 p-8">
                                <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
                                    <img class="mx-auto" src="@/assets/images/pages/logo.png" alt="branding logo" width="300">
                                </div>
                                <div class="vx-card__title mb-4">
                                    <h4 class="mb-4">{{ $t('register.create') }}</h4>
                                </div>
                                <div class="clearfix mt-4">
                                    <div class="vx-row mb-2">
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="firstname"
                                                v-model="firstname"
                                                v-bind:label="$t('global.field.FirstName')"
                                                v-bind:placeholder="$t('global.field.FirstName')"
                                                v-validate="'required'"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('firstname') }}</span>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="lastname"
                                                v-model="lastname"
                                                v-bind:label="$t('global.field.LastName')"
                                                v-bind:placeholder="$t('global.field.LastName')"
                                                v-validate="'required'"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('lastname') }}</span>
                                        </div>
                                    </div>

                                    <div class="vx-row mb-2">
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="email"
                                                v-model="email"
                                                v-bind:label="$t('global.field.Email')"
                                                v-bind:placeholder="$t('global.field.Email')"
                                                v-validate="'required|email'"
                                                ref="email"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('email') }}</span>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="phone"
                                                v-model="phone"
                                                v-bind:label="$t('global.field.Phone')"
                                                v-bind:placeholder="$t('global.field.Phone')"
                                                v-validate="'required'"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('telephone') }}</span>
                                        </div>
                                    </div>

                                    <div class="vx-row mb-2">
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="password"
                                                type="password"
                                                v-model="password"
                                                v-bind:label="$t('global.field.CreatePassword')"
                                                v-bind:placeholder="$t('global.field.CreatePassword')"
                                                v-validate="'required|min:6'"
                                                ref="password"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('password') }}</span>
                                        </div>
                                        <div class="vx-col sm:w-1/2 w-full">
                                            <vs-input
                                                class="w-full"
                                                name="password_confirmation"
                                                type="password"
                                                v-model="passwordConfirmation"
                                                v-bind:label="$t('global.field.PasswordConfirmation')"
                                                v-bind:placeholder="$t('global.field.PasswordConfirmation')"
                                                v-validate="'required|confirmed:password'"
                                                data-vv-validate-on="blur" />
                                            <span class="text-danger text-sm">{{ errors.first('password_confirmation') }}</span>
                                        </div>
                                    </div>

                                    <vs-checkbox class="mt-6" v-model="isTermsConditionAccepted">{{ $t('register.acceptCondition') }}</vs-checkbox>
                                    <vs-button  type="border" to="/login" class="mt-6">{{ $t('register.already_registered') }}</vs-button>
                                    <vs-button
                                        class="float-right mt-6"
                                        @click="register" :disabled="!validateForm">
                                        {{ $t('global.field.Register') }}
                                    </vs-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                firstname: '',
                lastname: '',
                phone: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                isTermsConditionAccepted: false }
        },
        created: function () {
            window.addEventListener('keyup', this.register())
        },
        computed: {
            validateForm () {
                return ! this.isTermsConditionAccepted === false && !this.errors.any()
            }
        },

        methods: {
            checkLogin () {
                // If users is already logged in notify
                if (this.$store.state.auth.isUserLoggedIn()) {
                    // Close animation if passed as payload
                    // this.$vs.loading.close()
                    this.$vs.notify({
                        title: this.$t('login.attempt_title'),
                        text: this.$t('login.already_login'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'warning'
                    })
                    return false
                }
                return true
            },

            register () {
                // If form is not validated or users is already login return
                if (!this.validateForm || !this.checkLogin()) return
                this.$vs.loading()
                const payload = {
                    userDetails: {
                        firstname: this.firstname,
                        lastname: this.lastname,
                        phone: this.phone,
                        email: this.email,
                        password: this.password,
                    }
                }
                this.$store.dispatch('auth/registerUserJWT', payload)
                    .then(() => { this.$vs.loading.close() })
                    .catch(error => {
                        this.$vs.loading.close()
                        if (error.response.status === 421) {
                            this.$vs.notify({
                                title: this.$t('global.Error'),
                                text:  this.$t('message.vaildationError'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
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
                                text: this.$t('message.serverError'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        }
                    })
            }
        },
    }
</script>
