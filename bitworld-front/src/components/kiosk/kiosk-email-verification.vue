<script>
import '@assets/css/kiosk/kiosk-certified.css'
import { mapState } from 'vuex'
import { createVerification, createVerificationToken } from '@apis/mail'

export default {
  data() {
    return {
      token: null,
      auth_code: '',
      loading: false,
      modal_visible: false,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
  },
  methods: {
    handleCreateToken() {
      this.loading = true
      createVerificationToken()
        .then(({ token }) => {
          this.token = token
          this.modal_visible = true
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => {
          this.loading = false
        })
    },
    handleCreate() {
      this.loading = true
      createVerification(this.$data)
        .then(({ token }) => {
          this.$toasted.success(this.$t('toasted_msg.email_auth'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.$emit('drawer_close')
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<template>
  <div
    v-loading="loading"
    :class="$style.kioskCertified"
    class="kiosk-certified"
  >
    <div :class="$style.container">
      <template v-if="!token">
        <div :class="$style.kioskCertifiedEmail" class="kiosk-certified-email">
          <div>
            <p>{{ $t('kiosk.sending_verification_email_txt') }}</p>
            <el-input :value="currentUser.email_address" disabled> </el-input>
          </div>
          <el-button @click="handleCreateToken">{{
            $t('kiosk.authenticate')
          }}</el-button>
        </div>
      </template>
      <template v-else>
        <div :class="$style.kioskCertifiedEmail" class="kiosk-certified-email">
          <div>
            <p>{{ $t('kiosk.enter_verification_code_txt') }}</p>
            <el-input v-model="auth_code"> </el-input>
          </div>
          <el-button @click="handleCreate">{{
            $t('kiosk.enter_verification_code')
          }}</el-button>
        </div>
      </template>
    </div>
    <el-dialog
      :append-to-body="true"
      class="email-send kiosk-certified"
      :visible.sync="modal_visible"
    >
      <span>{{ $t('kiosk.verification_email_has_been_sent') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modal_visible = false">{{
          $t('verify')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
