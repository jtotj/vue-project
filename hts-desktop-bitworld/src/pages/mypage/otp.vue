<template>
    <div class="cnt invest" v-loading="loading">
        <h3>{{ $t('mypage.otp_management') }}</h3>
        <template v-if="otps.length">
            <div class="table_box">
                <div>{{ $t('mypage.authenticode') }}</div>
                <div>
                    <masked-input v-model="token" style="font-family: monospace;" mask="### ###" placeholder="000 000" class="nickname_chg" type="text" />
                    <button type="button" @click.prevent="handleDeleteOTP" class="chg_btn">{{ $t('mypage.otp_deactivate') }}</button>
                </div>
            </div>
        </template>
        <template v-else>
            <ul>
                <li style="background:#E9ECEF; border-radius:10px; padding:10px;">
                    {{ $t('mypage.msg_authenticator_installation') }}<br><a target="_blank" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2">{{ $t('mypage.android') }}</a>{{ $t('mypage.or') }}<a target="_blank" href="https://itunes.apple.com/app/google-authenticator/id388497605?mt=8">{{ $t('mypage.iphone_series') }}</a>, <a target="_blank" href="http://www.windowsphone.com/en-us/store/app/authenticator/e7994dbc-2336-4950-91ba-ca22d653759b">{{ $t('mypage.windows_phone') }}</a>{{ $t('mypage.and') }}
<a href="https://en.wikipedia.org/wiki/Google_Authenticator">{{ $t('mypage.msg_microsoft_other_systems')}}</a>.
                </li>
                <div class="down-arrow"><img src="~assets/img/download-arrow.png" style="width:20px;"></div>
                <li style="background:#E9ECEF; border-radius:10px; padding:10px;">
                    {{ $t('mypage.msg_key') }}<a href="#" @click.prevent="handleCopySecret" v-tooltip="this.$t('mypage.msg_click_key_copy')">{{ secret }}</a>{{ $t('mypage.msg_use_loss_change') }}
                </li>
                <div class="down-arrow"><img src="~assets/img/download-arrow.png" style="width:20px;"></div>
                <li style="background:#E9ECEF; border-radius:10px; padding:10px;"><p v-html="$t('mypage.msg_brcode_touch')"></p>
                </li>
                <div class="down-arrow"><img src="~assets/img/download-arrow.png" style="width:20px;"></div>
                <li style="background:#E9ECEF; border-radius:10px; padding:10px;">{{ $t('mypage.msg_input_authenticode') }}</li>
            </ul>
            <div style="text-align:center;">
                <img class="qr-code" :src="qr_uri" />
            </div>
            <div class="table_box">
                <div>{{ $t('mypage.otp_key') }}</div>
                <div><input :disabled="true" v-model="secret" class="nickname_chg" style="width:284px; text-align:center; "/></div>
                <div>{{ $t('mypage.authenticode') }}</div>
                <div>
                    <masked-input v-model="token" style="font-family: monospace; width:100px;" mask="### ###" placeholder="000 000" class="nickname_chg" type="text" />
                    <button type="button" @click.prevent="handleActivateOTP" class="chg_btn">{{ $t('mypage.otp_activate') }}</button>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
ol li { list-style: decimal; }
ol li a { color: #5fa2dd; }
</style>

<script>
import otplib from 'otplib/otplib-browser';
import MaskedInput from 'vue-masked-input'
import { mapGetters, mapState } from 'vuex';
import { createOtp, deleteOtp } from '@/api/otp';

export default {
    name: 'MyOtp',
    components: { MaskedInput },
    data() {
        return {
            secret: '',
            token: '',
            loading: false,
        }
    },
    computed: {
        ...mapGetters(['logged_info']),
        ...mapState({
            otps: ({ auth }) => auth.otps,
        }),
        qr_uri() {
            const chl = `otpauth://totp/${this.logged_info.email_address}?secret=${this.secret}&issuer=${window.document.domain}`;
            return `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(chl)}`;
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.secret = otplib.authenticator.generateSecret();
        },
        handleCopySecret() {
            this.$copyText(this.secret)
                .then(() => this.$toasted.success(this.$t('mypage.otp_copy')))
                .catch(() => this.$toasted.error(this.$t('mypage.msg_drag_copy')))
        },
        handleActivateOTP() {
            const token = this.token.replace(/[^0-9]/g, '');

            this.loading = true;
            this.$dialog.confirm(this.$t('mypage.otp_safe_keeping'), {
                type: 'hard',
                verification: this.$t('mypage.yes'),
                okText: this.$t('mypage.otp_register'),
                cancelText: this.$t('cancel'),
                verificationHelp: this.$t('continue_entry'),
            })
            .then(() => createOtp(token, this.secret))
            .then(() => this.$store.dispatch('GetOtps'))
            .then(() => {
                this.loading = false;
                this.token = '';
                this.secret = '';
                this.$toasted.success(this.$t('mypage.otp_register'));
            })
            .catch(() => {
                this.loading = false;
            })
        },
        handleDeleteOTP() {
            const token = this.token.replace(/[^0-9]/g, '');
            const { otp_srl } = [...this.otps].shift() || {};

            this.loading = true;
            deleteOtp(otp_srl, token)
                .then(() => this.$store.dispatch('GetOtps'))
                .then(() => {
                    this.init();
                    this.loading = false;
                    this.token = '';
                    this.$toasted.success(this.$t('mypage.otp_delete_success'));
                })
                .catch(() => {
                    this.loading = false;
                })
        }
    }
}
</script>
