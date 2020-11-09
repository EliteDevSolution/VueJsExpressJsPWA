<!-- =========================================================================================
File Name: Login.vue
Description: Login Page
----------------------------------------------------------------------------------------
Author: EliteDevSolution
========================================================================================== -->
<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">

                    <div class="vx-row no-gutter justify-center items-center">

                        <div class="vx-col hidden lg:block lg:w-1/2">
                            <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
                        </div>

                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                            <div class="p-8 login-tabs-container">

                                <div class="vx-card__title mb-4">
                                    <h4 class="mb-4">{{ $t('global.field.Login') }}</h4>
                                </div>

                                <div>
                                    <vs-input
                                        v-validate="'required|email|min:3'"
                                        data-vv-validate-on="blur"
                                        name="email"
                                        icon-no-border
                                        icon="icon icon-user"
                                        icon-pack="feather"
                                        @keyup.enter="login"
                                        v-bind:label-placeholder="$t('global.field.Email')"
                                        v-model="email"
                                        class="w-full"/>
                                    <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                                    <vs-input
                                        data-vv-validate-on="blur"
                                        v-validate="'required|min:6'"
                                        type="password"
                                        name="password"
                                        icon-no-border
                                        icon="icon icon-lock"
                                        icon-pack="feather"
                                        v-bind:label-placeholder="$t('global.field.Password')"
                                        @keyup.enter="login"
                                        v-model="password"
                                        class="w-full mt-6"/>
                                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                    <div class="flex flex-wrap justify-between my-5">
                                        <vs-checkbox v-model="checkbox_remember_me" class="mb-3">{{ $t('login.RememberMe') }}</vs-checkbox>
                                        <router-link to="">{{ $t('login.ForgotPassword') }}</router-link>
                                    </div>
                                    <vs-button type="border" to="/register">{{ $t('global.field.Register') }}</vs-button>
                                    <vs-button class="float-right mb-8" @click="login" :disabled="!validateForm">{{
                                        $t('global.field.Login') }}
                                    </vs-button>

                                    <vs-divider>{{ $t('global.field.Or') }}</vs-divider>

                                    <div class="social-login-buttons flex flex-wrap items-center mt-4">

                                        <!-- facebook -->
                                        <div class="bg-facebook pt-3 pb-2 px-4 rounded-lg cursor-pointer mr-4">
                                            <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f"
                                                 class="text-white h-4 w-4 svg-inline--fa fa-facebook-f fa-w-9" role="img"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 264 512">
                                                <path fill="currentColor"
                                                      d="M215.8 85H264V3.6C255.7 2.5 227.1 0 193.8 0 124.3 0 76.7 42.4 76.7 120.3V192H0v91h76.7v229h94V283h73.6l11.7-91h-85.3v-62.7c0-26.3 7.3-44.3 45.1-44.3z"></path>
                                            </svg>
                                        </div>

                                        <!-- GOOGLE -->
                                        <div class="bg-google pt-3 pb-2 px-4 rounded-lg cursor-pointer mr-4">
                                            <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google"
                                                 class="text-white h-4 w-4 svg-inline--fa fa-google fa-w-16" role="img"
                                                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                                <path fill="currentColor"
                                                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                            </svg>
                                        </div>
                                    </div>
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
        data() {
            return {
                email: "",
                password: "",
                checkbox_remember_me: false,
            }
        },
        computed: {
            validateForm() {
                return !this.errors.any() && this.email !== '' && this.password !== ''
            }
        },
        created() {
            //console.log(this.$cookies.get('check_remember'))
            if (this.$cookies.get('check_remember') === 'true') {
                this.email = this.$cookies.get('user_email')
                this.password = this.$cookies.get('user_password')
                this.checkbox_remember_me = true
            }
        },
        methods: {
            checkLogin() {
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

            login() {
                if (!this.checkLogin()) return
                this.$validator.validateAll().then(isValid => {
                    if (isValid) {
                        // Loading
                        this.$vs.loading()
                        const payload = {
                            checkbox_remember_me: this.checkbox_remember_me,
                            userDetails: {
                                email: this.email,
                                password: this.password
                            }
                        }

                        this.$store.dispatch('auth/loginJWT', payload)
                            .then(() => {
                                this.$vs.loading.close()
                                //Cookie processor
                                if (this.checkbox_remember_me) {
                                    this.$cookies.set('check_remember', true)
                                    this.$cookies.set('user_email', this.email)
                                    this.$cookies.set('user_password', this.password)
                                } else {
                                    this.$cookies.set('check_remember', false)
                                    this.$cookies.set('user_email', '')
                                    this.$cookies.set('user_password', '')
                                }
                            })
                            .catch(error => {
                            this.$vs.loading.close()
                            if (error.response.status === 401) {
                                this.$vs.notify({
                                    title: this.$t('global.Error'),
                                    text: this.$t('message.creditional'),
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
                                    color: 'danger'
                                })
                            } else {
                                this.$vs.notify({
                                    title: this.$t('global.Error'),
                                    text: error.message,
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle',
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

<style lang="scss">
    #page-login {
        .social-login-buttons {
            .bg-facebook {
                background-color: #1551b1
            }

            .bg-twitter {
                background-color: #20475b
            }

            .bg-google {
                background-color: #DB544A
            }

            .bg-github {
                background-color: #333
            }
        }
    }
</style>
