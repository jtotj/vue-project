<script>
import '@assets/css/account-find.css'
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
  <div class="account-find">
    <div class="container">
      <div v-if="$route.query.type === 'password'" class="box-wrap">
        <div class="go-back">
          <div class="arrow-wrap">
            <router-link :to="{ name: 'login-me' }">
              <img src="@assets/img/longarrow-left-black.svg" alt="화살표" />
            </router-link>
          </div>
          <div class="big-title-wrap">
            <h2 class="big-title">
              {{ $t('find_password') }}
            </h2>
          </div>
        </div>

        <form :class="[$style.inputForm]">
          <template v-if="!token">
            <form @submit.prevent="handleToken">
              <input
                v-model="user_id"
                class="marginB-10"
                :placeholder="$t('id')"
              />
              <input
                v-model="email_address"
                :placeholder="$t('my_page.email_address')"
              />
              <div class="btn-wrap">
                <button class="btn-common-big" native-type="submit">
                  {{ $t('verify') }}
                </button>
              </div>
            </form>
          </template>

          <template v-else>
            <form @submit.prevent="handleNewPassword">
              <input v-model="auth_code" :placeholder="$t('kyc.auth_code')" />
              <input
                v-model="new_password"
                class="marginB-10"
                :placeholder="$t('my_page.placeholder_new_password')"
                type="password"
              />
              <input
                v-model="confirm_password"
                :placeholder="$t('confirm_password')"
                type="password"
              />
              <div class="btn-wrap">
                <button class="btn-common-big" native-type="submit">
                  {{ $t('verify') }}
                </button>
              </div>
            </form>
          </template>
        </form>
      </div>
      <div v-else>
        <div class="go-back">
          <div class="arrow-wrap">
            <a @click="$router.go(-1)">
              <img src="@assets/img/longarrow-left-black.svg" alt="뒤로가기" />
            </a>
          </div>
          <div class="big-title-wrap">
            <h2 class="big-title">
              {{ $t('find_id') }}
            </h2>
          </div>
        </div>

        <form :class="[$style.inputForm]" @submit.prevent="handleId">
          <input
            v-model="email_address"
            :placeholder="$t('my_page.email_address')"
          />
          <div class="btn-wrap">
            <button class="btn-common-big" native-type="submit">
              {{ $t('verify') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
