<script>
import {
  findMemberPassword,
  findMemberPasswordToken,
  findMemberId,
} from '@apis/member'
export default {
  data() {
    return {
      user_id: null,
      email_address: null,
      new_password: null,
      confirm_password: null,
      token: null,
      auth_code: null,
    }
  },
  methods: {
    async handleToken() {
      try {
        const { token } = await findMemberPasswordToken({
          user_id: this.user_id,
          email_address: this.email_address,
        })
        this.$toasted.success(this.$t('toasted_msg.email_auth_send'))
        this.token = token
      } catch (e) {
        this.$toasted.error(e.message)
      }
    },
    handleNewPassword() {
      findMemberPassword({
        token: this.token,
        auth_code: this.auth_code,
        new_password: this.new_password,
        confirm_password: this.confirm_password,
      })
        .catch((e) => this.$toasted.error(e.message))
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.changed'))
          this.$router.push({ name: 'login-me' })
        })
    },
    handleId() {
      findMemberId({ email_address: this.email_address })
        .catch((e) => this.$toasted.error(e.message))
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.id_find_mail_send'))
          this.$router.push({ name: 'login-me' })
        })
    },
  },
}
</script>

<template>
  <div :class="[$style.findWrap]">
    <div v-if="$route.query.type === 'password'" class="box-wrap">
      <div class="box-top">
        <div class="logo-wrap">
          <img src="@assets/img/cocobank-logo.png" alt="로고" />
        </div>
        <div class="back-wrap">
          <a @click="$router.go(-1)">
            <img src="@assets/img/back.png" alt="뒤로가기" />
          </a>
        </div>
      </div>
      <h1 :class="[$style.findTitle]">{{ $t('find_password') }}</h1>
      <form :class="[$style.inputForm]">
        <template v-if="!token">
          <form @submit.prevent="handleToken">
            <el-input
              v-model="user_id"
              :class="[$style.inputFind]"
              :placeholder="$t('id')"
            />
            <el-input
              v-model="email_address"
              :class="[$style.inputFind]"
              :placeholder="$t('my_page.email_address')"
            />
            <el-button :class="[$style.findButton]" native-type="submit">
              {{ $t('verify') }}
            </el-button>
          </form>
        </template>

        <template v-else>
          <form @submit.prevent="handleNewPassword">
            <el-input
              v-model="auth_code"
              :class="[$style.inputFind]"
              :placeholder="$t('kyc.auth_code')"
            />
            <el-input
              v-model="new_password"
              :class="[$style.inputFind]"
              :placeholder="$t('my_page.placeholder_new_password')"
              type="password"
            />
            <el-input
              v-model="confirm_password"
              :class="[$style.inputFind]"
              :placeholder="$t('confirm_password')"
              type="password"
            />
            <el-button :class="[$style.findButton]" native-type="submit">
              {{ $t('verify') }}
            </el-button>
          </form>
        </template>
      </form>
    </div>
    <div v-else>
      <div class="box-top">
        <div class="logo-wrap">
          <img src="@assets/img/cocobank-logo.png" alt="로고" />
        </div>
        <div class="back-wrap">
          <a @click="$router.go(-1)">
            <img src="@assets/img/back.png" alt="뒤로가기" />
          </a>
        </div>
      </div>
      <h1 :class="[$style.findTitle]">{{ $t('find_id') }}</h1>
      <form :class="[$style.inputForm]" @submit.prevent="handleId">
        <el-input
          v-model="email_address"
          :class="[$style.inputFind]"
          :placeholder="$t('my_page.email_address')"
        />

        <el-button :class="[$style.findButton]" native-type="submit">
          {{ $t('verify') }}
        </el-button>
      </form>
    </div>
    <el-button :class="[$style.cancelButton]" @click="$router.go(-1)">
      {{ $t('cancel') }}
    </el-button>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.findWrap {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  max-width: 450px;
  padding: 60px 30px;
  margin: 0 auto;
  margin-top: 80px;
  font-weight: 500;
  text-align: left;
  border: 1px solid #eee;
  box-shadow: 10px 10px 10px #eee;
}
.findWrap div img {
  box-sizing: border-box;
  display: block;
  float: right;
  width: 150px;
  margin: 0;
  text-align: center;
}
.findTitle {
  clear: both;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.2;
  color: #333;
  text-align: left;
  letter-spacing: -0.09em;
}
.inputForm {
  position: relative;
  box-sizing: border-box;
  padding: 0 !important;
  padding-top: 10px;
  margin-top: 30px !important;
}
.inputFind {
  display: block;
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  font-size: 16px;
  line-height: 40px;
  border-radius: 3px;
  transition: box-shadow 0.1s ease, -webkit-box-shadow 0.1s ease;
}
.findLink {
  margin-right: 10px;
  margin-bottom: 30px;
  cursor: pointer;
}
.findButton {
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  cursor: pointer;
  background-color: #0068c1;
  border: none !important;
}
.findButton:hover {
  background-color: #0068c1;
  border-color: #0068c1;
}
.cancelButton {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: 400;
  color: #999;
  text-align: center;
  cursor: pointer;
  background-color: #eee;
  border: none;
}
</style>

<style scoped>
.box-wrap {
  overflow: hidden;
}
.box-top {
  display: block;
  float: left;
  width: 100%;
  margin-bottom: 40px;
}
.logo-wrap {
  float: right !important;
  width: 95%;
  margin: 0;
}
.back-wrap {
  float: left !important;
  width: 5%;
}
.back-wrap img {
  width: 20px;
}
</style>
