<template>
    <vx-card no-shadow>
        <!-- Img Row -->
        <div class="flex flex-wrap items-center mb-base">
            <vs-avatar :src="photoURL" size="70px" class="mr-4 mb-4" />
            <div>
                <input
                    type="file"
                    name="photo"
                    ref="photo"
                    @change="previewPhoto"
                    hidden
                    accept="image/*" />
                <vs-button
                    class="mr-4 sm:mb-0 mb-2"
                    @click="$refs.photo.click()">
                    {{ $t('global.field.Uploadphoto') }}
                </vs-button>
                <vs-button type="border" color="danger" @click="removePhoto" :disabled="!isPhoto">{{ $t('global.field.Remove')}}</vs-button>
                <p class="text-sm mt-2">{{ $t('message.AllowFileUploadSizeLimit') }}</p>
            </div>
        </div>
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
                    icon-pack="feather"
                    icon="icon-smartphone"
                    icon-no-border
                    v-bind:label="$t('global.field.Phone')"
                    v-bind:placeholder="$t('global.field.Phone')"
                    v-validate="'required'"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('phone') }}</span>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2">
                <vs-input
                    class="w-full"
                    name="email"
                    v-model="email"
                    v-bind:label="$t('global.field.Email')"
                    v-bind:placeholder="$t('global.field.Email')"
                    icon-pack="feather"
                    icon="icon-mail"
                    icon-no-border
                    v-validate="'required|email'"
                    ref="email"
                    data-vv-validate-on="blur" />
                <span class="text-danger text-sm">{{ errors.first('email') }}</span>
            </div>
        </div>

        <!-- Save & Reset Button -->
        <div class="flex flex-wrap items-center justify-end mt-base">
            <vs-button class="ml-auto mt-2" @click="savePersonalData" :disabled="!validateForm">{{ $t('global.button.save_change') }}</vs-button>
        </div>
    </vx-card>
</template>

<script>

    export default {
        data () {
            return {
                firstname: this.$store.state.AppActiveUser.firstname,
                lastname: this.$store.state.AppActiveUser.lastname,
                email: this.$store.state.AppActiveUser.email,
                phone: this.$store.state.AppActiveUser.phone,
                photoURL: this.$store.state.AppActiveUser.avatar == 'none' ? this.$store.state.AppActiveUser.photoURL : this.$store.state.AppActiveUser.apiUrl + this.$store.state.AppActiveUser.avatar,
                photo: null
            }
        },
        computed: {
            activeUserInfo () {
                return this.$store.state.AppActiveUser
            },

            validateForm () {
                return !this.errors.any()
            },

            isPhoto () {
                return this.$store.state.AppActiveUser.avatar !== '/storage/user-data/default-avatar.png'
            }
        },
        methods: {
            // Save personal data
            savePersonalData () {
                if (!this.validateForm) return false
                if(this.photo && this.photo.size > 2000000)
                {
                    this.$vs.notify({
                        title: this.$t('global.Error'),
                        text: this.$t('message.AllowFileUploadSizeLimit'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                    return false;
                }

                this.$vs.loading()
                const payload = {
                    userDetails: {
                        id: this.$store.state.AppActiveUser.id,
                        firstname: this.firstname,
                        lastname: this.lastname,
                        phone: this.phone,
                        email: this.email,
                        photo: this.photo
                    }
                }
                this.$store.dispatch('mydata/savePersonalData', payload)
                    .then(res => {
                        this.$vs.loading.close()
                        this.$store.state.AppActiveUser.firstname = this.firstname
                        this.$store.state.AppActiveUser.lastname = this.lastname
                        this.$vs.notify({
                            title: this.$t('global.Success'),
                            text: this.$t('my_data.personal_data.message_save_success'),
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
                                text: this.$t('message.serverError'),
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                color: 'danger'
                            })
                        }
                    })
            },

            // Preview photo as avatar
            previewPhoto (event) {
                this.photo = this.$refs.photo.files[0]
                this.photoURL = URL.createObjectURL(this.photo)
            },

            // Reset photo
            removePhoto () {
                if(this.photoURL === this.$store.state.AppActiveUser.apiUrl + '/storage/user-data/default-avatar.png')
                {
                    this.$vs.notify({
                        title: this.$t('global.Error'),
                        text: this.$t('message.DefaultImageRemoveError'),
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                    return false
                }

                this.$vs.loading()
                const payload = {
                    userDetails: {
                        id: this.$store.state.AppActiveUser.id,
                    }
                }
                this.$store.dispatch('mydata/removePhoto', payload)
                .then(() => {
                    this.photoURL = this.$store.state.AppActiveUser.apiUrl + this.activeUserInfo.photoURL
                    this.photo = null
                    this.$vs.loading.close()
                    this.$vs.notify({
                        title: this.$t('global.Success'),
                        text: this.$t('my_data.personal_data.message_save_success'),
                        iconPack: 'feather',
                        icon: 'icon-check',
                        color: 'success'
                    })
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
            }
        }
    }
</script>
