<template>
  <form v-loading="loading" :class="[$style.loginWrap]" class="login-wrap">
    <div class="left-wrap">
      <h1 :class="[$style.tit]" v-html="$t('login_msg_1')"></h1>
      <p v-html="$t('login_msg_2')"></p>
      <span class="tip">TIP</span>
      <span class="bold">{{ $t('login_msg_3') }}</span>
      <img
        class="device-img"
        src="@assets/img/loginme2.png"
        alt="기기 이미지"
      />
    </div>
    <div class="right-wrap">
      <LocaleSelect
        style="position:absolute;top:30px; right:30px; z-index:1;"
      ></LocaleSelect>

      <div class="login-logo">
        <img src="@src/assets/img/t_logo.svg" alt="로고" />
      </div>
      <form :class="[$style.inputForm]" @submit.prevent="handleLogin">
        <template v-if="!otp_token_required">
          <div
            :class="[
              $style.formWrap,
              { isFocus: id_focus },
              { hasValue: username.length !== 0 },
            ]"
          >
            <label for="user_id" :class="[$style.textLabel]">
              {{ $t('id') }}
              <span :class="[$style.essential]"></span>
            </label>
            <input
              id="user_id"
              v-model="username"
              type="text"
              :class="[$style.formControl]"
              :placeholder="$t('id')"
              @focus="id_focus = true"
              @blur="id_focus = false"
            />
          </div>
          <div
            :class="[
              $style.formWrap,
              { isFocus: password_focus },
              { hasValue: password.length !== 0 },
            ]"
          >
            <label for="password" :class="[$style.textLabel]">
              {{ $t('password') }}
              <span :class="[$style.essential]"></span>
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              :class="[$style.formControl]"
              :placeholder="$t('password')"
              @focus="password_focus = true"
              @blur="password_focus = false"
            />
          </div>

          <div
            :class="[$style.formWrap]"
            style="text-align:right;"
            class="form-wrap"
          >
            <p v-if="otp_token_required === false" :class="[$style.findWrap]">
              <router-link
                :to="{ name: 'register' }"
                :class="[$style.loginLink]"
                >{{ $t('cocofx_register') }}</router-link
              >
            </p>
            <div class="f-right">
              <router-link
                :to="{ name: 'account-find', query: { type: 'id' } }"
                >{{ $t('find_id') }}</router-link
              >
              <router-link
                :to="{ name: 'account-find', query: { type: 'password' } }"
                :class="[$style.findLink]"
                >{{ $t('find_password') }}</router-link
              >
            </div>
          </div>
        </template>
        <template v-else>
          <div
            :class="[
              $style.formWrap,
              { isFocus: otp_focus },
              { hasValue: otp_token.length !== 0 },
            ]"
          >
            <label for="otp" :class="[$style.textLabel]">
              OTP
              <span :class="[$style.essential]"></span>
            </label>
            <input
              id="otp"
              v-model="otp_token"
              type="text"
              :class="[$style.formControl]"
              @focus="otp_focus = true"
              @blur="otp_focus = false"
            />
            <span :class="[$style.essenText]">
              OTP
              <span :class="[$style.essential]"></span>
            </span>
          </div>
        </template>
        <div :class="[$style.btnWrap]">
          <el-button :class="[$style.loginButton]" native-type="submit">
            {{ $t('login') }}
          </el-button>
        </div>
        <div v-if="otp_token_required" :class="[$style.btnWrap]">
          <button :class="[$style.cancelButton]" @click.prevent="handleCancel">
            {{ $t('back') }}
          </button>
        </div>
        <div v-if="!otp_token_required" :class="[$style.btnWrap]">
          <button
            :class="[$style.cancelButton]"
            @click.prevent="$router.go(-1)"
            >{{ $t('cancel') }}</button
          >
        </div>
        <!-- <p v-else :class="[$style.findWrap]">
          <router-link :to="{ name: 'register' }" :class="[$style.loginLink]">회원가입</router-link>
        </p>-->
      </form>
    </div>
  </form>
</template>
<script>
import { authMethods } from '@state/helpers'
import LocaleSelect from '@components/LocaleSelect'
export default {
  components: { LocaleSelect },
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      id_focus: false,
      otp_focus: false,
      password_focus: false,
      otp_token: '',
      otp_token_required: false,
    }
  },

  methods: {
    ...authMethods,
    async handleLogin() {
      this.loading = true
      try {
        const { otp_token_required } =
          (await this.logIn({
            login_type: 'DEFAULT',
            username: this.username,
            password: this.password,
            otp_token: this.otp_token,
          })) || {}

        if (otp_token_required) {
          this.otp_token_required = true
          return
        }

        this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
      } catch (e) {
        this.$toasted.error(e.message)
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.username = ''
      this.password = ''
      this.otp_token = ''
      this.otp_token_required = false
    },
  },
}
</script>

<style lang="scss" module>
@import '@design';

.loginWrap {
  box-sizing: border-box;
  max-width: 1200px;
  padding: 5%;
  margin: 0 auto;
  margin-top: 80px;
  font-weight: 500;
  text-align: left;
  background: #fff;
}
.tit {
  font-size: 30px;
  font-weight: 500;
  line-height: 1.2;
  color: #333;
  text-align: left;
  letter-spacing: -0.09em;
  word-break: keep-all;
}
.formWrap {
  position: relative;
}

.textLabel {
  display: block;
  display: none;
  padding: 10px 0;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  -webkit-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
}
.essential {
  display: inline-block;
  width: 12px;
  height: 12px;
  overflow: hidden;
  background: url(@assets/img/ico_star.png) no-repeat center 4px;
}
.formControl {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 18px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #333;
  background-color: #fff;
  border: 1px solid #eee;
  -webkit-transition: border-color ease-in-out 0.225s;
  transition: border-color ease-in-out 0.225s;
}
.formControl:focus {
  border-color: #0068c1;
  outline: rgba(0, 0, 0, 0);
}
.essenText {
  position: absolute;
  top: auto;
  bottom: 5px;
  left: 0;
  box-sizing: border-box;
  max-width: 100%;
  height: 50px;
  padding-left: 20px;
  overflow: hidden;
  font-size: 12px;
  line-height: 60px;
  color: #666;
  white-space: nowrap;
  pointer-events: none;
}
.inputForm {
  position: relative;
  box-sizing: border-box;
  padding: 0 !important;
  padding-top: 10px;
  margin-top: 20px;
}
.inputLogin {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-bottom: 30px;
  font-size: 14px;
  line-height: 50px;
  transition: box-shadow 0.1s ease, -webkit-box-shadow 0.1s ease;
}
.findWrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: inline-block;
  float: left;
  width: 30%;
  padding: 10px 0;
  font-size: 12px;
  text-align: left;
}
.loginLink {
  font-size: 14px;
  line-height: 22px;
  color: #999;
  cursor: pointer;
}
.btnWrap {
  padding-top: 10px;
}
.loginButton {
  width: 100%;
  padding: 18px;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background-color: #0068c1;
  border: none !important;
}
.loginButton:hover {
  color: white !important;
  background-color: #007ae2;
}
.cancelButton {
  width: 100%;
  padding: 18px;
  font-size: 16px;
  font-weight: 400;
  color: #999;
  text-align: center;
  cursor: pointer;
  background-color: #eee;
  border: none;
}
.cancelButton:hover {
  background-color: #e5e5e5;
}
.findLink {
  margin-left: 10px;
}

@media (max-width: 1000px) {
  .inputForm {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .tit {
    font-size: 28px;
  }
  .findWrap {
    width: 45%;
  }
}
</style>

<style scoped>
.login-wrap {
  overflow: hidden;
}
.login-wrap span {
  font-weight: normal;
  color: #999;
}
.login-wrap .tip {
  padding: 2px 10px;
  margin-right: 5px;
  font-size: 12px;
  font-style: italic;
  font-weight: bold;
  color: white;
  background-color: #0068c1;
  border-radius: 20px;
}
.login-wrap .bold {
  font-size: 14px;
  color: #0068c1;
}
.left-wrap {
  box-sizing: border-box;
  float: left;
  width: 50%;
  padding: 4%;
}
.left-wrap p {
  padding-bottom: 20px;
  font-size: 14px;
  line-height: 22px;
  color: #999;
}
.login-wrap .device-img {
  width: 100%;
  padding-top: 50px;
}
.login-wrap .login-logo {
  box-sizing: border-box;
  width: 100%;
  padding: 30px 80px;
  text-align: center;
}
.login-wrap .login-logo img {
  width: 100%;
}
.right-wrap {
  position: relative;
  box-sizing: border-box;
  float: right;
  width: 50%;
  padding: 60px 30px;
  border: 1px solid #eee;
  box-shadow: 10px 10px 10px #eee;
}
.right-wrap .title-img {
  top: 50px;
}
.form-wrap {
  overflow: hidden;
}

.form-wrap a {
  font-size: 13px;
  font-weight: normal;
  color: #999;
}

.f-right {
  display: inline-block;
  float: right;
  width: 70%;
  padding: 10px 0;
  font-size: 14px;
}

@media (max-width: 767px) {
  .left-wrap,
  .right-wrap {
    float: none;
    width: 100%;
  }
  .login-wrap {
    margin: 0;
  }
  .login-wrap .device-img {
    width: 100%;
    padding: 40px 0;
    text-align: center;
  }
  .login-wrap .login-logo {
    padding: 20px 40px;
  }
  .f-right {
    width: 55%;
  }
}
</style>
