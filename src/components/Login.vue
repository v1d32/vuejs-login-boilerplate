<template>
    <div>
        <div class="window-height row justify-center items-center">
            <q-card inline class="col-4 min-width-450">
                <q-card-title>
                    Login
                    <span slot="subtitle">Acesso ao sistema abc</span>
                    <q-icon slot="right" name="assignment_ind" />
                </q-card-title>
                <q-card-main>
                    <div class="row">
                        <q-input v-model="login" color="cyan" float-label="Login" class="col-12" />
                        <q-input v-model="password" color="cyan" float-label="Password" type="password" class="col-12" />
                    </div>
                </q-card-main>

                <q-card-actions class="row justify-end">
                    <q-toggle color="cyan" v-model="remember_password" label="Remember Password" />
                    <q-btn color="cyan" big icon="assignment_ind" @click="onLogin" class="login-button">
                        login
                    </q-btn>
                </q-card-actions>
            </q-card>
        </div>
    </div>
</template>

<script>
import {
    QBtn, QCard, QCardTitle,
    QCardMedia,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QInput,
    QToggle,
    QIcon,
    QField,
    QTooltip,
    QPopover,
    Toast
} from 'quasar'
import { mapMutations } from 'vuex'
import { LOGIN } from '../store/mutations-types'

export default {
    name: 'login',
    components: {
        QBtn,
        QCard,
        QCardTitle,
        QCardMedia,
        QCardActions,
        QCardSeparator,
        QCardMain,
        QInput,
        QToggle,
        QIcon,
        QField,
        QTooltip,
        QPopover,
        Toast
    },
    methods: {
        async onLogin(event, done) {
            // QBtn runs in loader mode by default and stays disabled until it
            // is handed back the `done` callback it emits alongside the click.
            let stopLoader = typeof done === 'function' ? done : () => {}

            let username = this.login.trim()
            let password = this.password

            if (username.length === 0 || password.length === 0) {
                Toast.create.warning({ html: 'Login dan Password wajib diisi' })
                stopLoader()
                return
            }

            try {
                let response = await fetch(`${process.env.API_BASE}/v1/oauth/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        grant_type: 'password',
                        client_id: process.env.OAUTH_CLIENT_ID,
                        client_secret: process.env.OAUTH_CLIENT_SECRET,
                        username: username,
                        password: password,
                        scope: ''
                    })
                })

                // An error body is not guaranteed to be JSON, so tolerate a parse failure.
                let body = await response.json().catch(() => ({}))
                let data = body.data || {}

                // This API answers 200 even for a rejected login and reports the
                // real outcome in `success`, so the HTTP status alone is not enough.
                if (!response.ok || body.success !== true || !data.access_token) {
                    Toast.create.negative({ html: this.authErrorMessage(body, response.status) })
                    return
                }

                this.storeToken(data)
                // call without action because checkIn dont needs asyncronous
                this.checkIn({ login: username, name: username, rule: '' })
                this.$router.replace({ name: 'main' })
            } catch (err) {
                Toast.create.negative({ html: `Tidak dapat menghubungi server: ${err.message}` })
            } finally {
                stopLoader()
            }
        },
        storeToken(data) {
            // Only localStorage survives a browser restart, but sessionStorage
            // still satisfies the guard in MainPage for the current tab.
            let target = this.remember_password ? localStorage : sessionStorage
            let other = this.remember_password ? sessionStorage : localStorage

            other.removeItem('bearerauth')
            other.removeItem('refreshtoken')
            target.setItem('bearerauth', data.access_token)
            if (data.refresh_token) {
                target.setItem('refreshtoken', data.refresh_token)
            }
        },
        authErrorMessage(body, status) {
            // The API sends a human-readable reason, e.g. "Email not Found."
            if (body.message) {
                return body.message
            }
            if (status === 400 || status === 401) {
                return 'Login atau Password salah'
            }
            return `Login gagal (HTTP ${status})`
        },
        ...mapMutations({
            checkIn: `login/${LOGIN.CHECK_IN}` // map this.checkIn()` to `this.$store.commit(`login/${LOGIN.CHECK_IN}`, payload)`
        })
    },
    data() {
        return {
            login: '',
            password: '',
            remember_password: true
        }
    }
}
</script>

<style scoped>
.login-button {
    margin-left: 50px;
    margin-right: 10px;
    width: 150px;
}

.min-width-450 {
    min-width: 450px;
}
</style>
