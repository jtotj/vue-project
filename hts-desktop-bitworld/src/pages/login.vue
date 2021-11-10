<template>
    <div>
        <form v-if="use_loginkey && !otp_token_required" ref="loginkey" class="login_box" action="//cocofx.com" method="get">
            <input type="hidden" name="act" value="dispHtsLoginkey" />
            <input type="hidden" name="layout" value="none" />
            <input type="hidden" name="redirect_url" value="" />
            <input type="text">
            <h1><img src="~assets/img/cocofx-logo.png" alt=""></h1>
            <p>Processing Sign In...</p>
        </form>
        <form v-else @submit.prevent="doLogin" v-loading="is_loading" class="login_box">
            <h1><img src="~assets/img/cocofx-logo.png" alt=""></h1>
            <template v-if="otp_token_required">
                <div class="member_input">
                    <input v-model="login_form.otp_token" class="form-control" type="password" required>
                    <span class="form-bar"></span>
                    <span class="float-label">{{ $t('otp_authentication_number') }}</span>
                </div>
                <div class="btn_box">
                    <button type="submit">{{ $t('mypage.otp_login') }}</button>
                </div>
            </template>
            <template v-else>
                <div class="member_input">
                    <input v-model="login_form.user_id" class="form-control" type="text" required>
                    <span class="form-bar"></span>
                    <span class="float-label">{{ $t('mypage.myid') }}</span>
                </div>
                <div class="member_input">    
                    <input v-model="login_form.password" class="form-control" type="password" required>
                    <span class="form-bar"></span>
                    <span class="float-label">{{ $t('mypage.mypwd') }}</span>
                </div>
                <div class="btn_box">
                    <button type="submit">{{ $t('login') }}</button>
                    <label><input type="checkbox"><span>{{ $t('mypage.login_maintenance') }}</span></label>
                </div>
            </template>
            <div class="register"><router-link :to="{ name: 'join' }">{{ $t('membership') }}</router-link></div>
            <div v-if="0" class="help_account"><a @click.prevent="openFindAccount">{{ $t('mypage.msg_id_pwd_forget') }}</a></div>
        </form>
    </div>
</template>

<style scoped>
/* 로그인 */
.login_box .member_input label { padding: 0; height: auto; }
.login_box {max-width:400px; margin:50px auto; padding:60px 60px 45px; text-align:center; background:#fff; border-radius: 10px;}
.login_box > h1 {width:200px; margin:0 auto 40px}
.login_box > h1 > img {width:100%}
.login_box > .btn_box {margin:10px 0 20px; text-align:left}
.login_box > .btn_box > button {width:100%; height:50px; margin-bottom:15px; font-size:16px; font-weight:bold; color:#222; background:#2D3D51; border-radius:3px; color:#fff;}
.login_box > .btn_box > button:hover { /* box-shadow: 0 0 2px 0 #2D3D51 inset, 0 0 2px 2px #2D3D51; */ border: 2px solid #2D3D51;}
.login_box > .btn_box > button > i {margin-right:5px}
.login_box > .help_account {margin-bottom:15px; text-align:left}
.login_box > .help_account > a {font-size:14px; color:#666; text-decoration:underline}
.login_box > .help_account > a:hover{ color:#868e96;}
.login_box > .register { float: right;}
.login_box > .register > a {font-size: 14px; color:#666; text-decoration:underline }
.login_box > .register > a:hover { color:#868e96; }
</style>

<script>

export default {
    name: 'signup-login',
    props: [],
    mounted() {
        this.login_form.loginkey = this.$route.query.loginkey || '';
        this.doLoginkey();
    },
    data: function() {
        return {
            use_loginkey: true,
            current_tab: 'login',
            highlight_label: [],
            active_label: [],
            login_form: {
                user_id: '',
                password: '',
                otp_token: '',
                loginkey: '',
            },
            otp_token_required: false,
            is_loading: false,
        }
    },
    methods: {
        doLoginkey() {
            if (!this.use_loginkey) return;

            if (this.login_form.loginkey) {
                this.doLogin();
            } else {
                this.$refs.loginkey.redirect_url.value = window.location.href;
                this.$refs.loginkey.submit();
            }
        },
        doLogin: function(e) {
            this.is_loading = true;

            return this.$store.dispatch('LoginByUserId', this.login_form).then(({ otp_token_required }) => {
                if (otp_token_required) {
                    this.is_loading = false;
                    this.otp_token_required = true;
                    return;
                }

                this.$router.replace(this.$route.query.return_url || '/');
            }).catch(({ error }) => {
                if (error === -2) {
                    this.login_form.loginkey = '';
                    this.otp_token_required = false;
                    this.$nextTick(() => this.doLoginkey());
                    return;
                }

                this.is_loading = false;
                this.login_form.password = '';
                this.login_form.otp_token = '';
                // this.otp_token_required = false;
            });
        },

        openFindAccount() {
            window.open('//app.cocofx.com/index.php?mid=index&act=dispMemberFindAccount', 'FindAccount', 'width=800,height=1000');
        }
    }
}
</script>
