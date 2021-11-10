<script>
import { realnamePrepare, createRealname } from '@apis/kyc'
import { fetchKycConfig } from '@apis/config'
import '@assets/css/kiosk/kiosk-certified.css'

export default {
  data() {
    return {
      realname_params: {},
      realname_info: null,
      kyc_config: null,
      step: null,
      error_message: null,
    }
  },
  mounted() {
    this.loadKycConfig()

    window.kycRealnameCallback = this.kycRealnameCallback.bind(this)
  },
  beforeDestroy() {
    if (window.kycRealnameCallback) delete window.kycRealnameCallback
  },
  methods: {
    async kycRealnameCallback(data) {
      this.loading = true
      try {
        await createRealname(data)

        this.$toasted.success(this.$t('toasted_msg.nice_success'), {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
        this.step = 'success'
      } catch (e) {
        this.step = 'fail'
        this.error_message = e.message
      } finally {
        this.loading = false
      }
    },
    async loadKycConfig() {
      const { config } = await fetchKycConfig('kyc')

      this.kyc_config = config
    },
    async handleRealnameAuth() {
      this.loading = true

      try {
        const $realname_form = this.$refs.realname_form
        switch (this.kyc_config.realname_authority) {
          case 'NICE':
            $realname_form.action =
              'https://nice.checkplus.co.kr/CheckPlusSafeModel/checkplus.cb'
            $realname_form.target = 'popupChk'
            $realname_form.method = 'post'
            const { sEncData } = await realnamePrepare()

            this.realname_params = {
              EncodeData: sEncData,
              m: 'checkplusSerivce',
            }

            await this.$nextTick()

            window.open(
              '',
              'popupChk',
              'width=500, height=550, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no'
            )
            $realname_form.submit()
            break

          default:
            this.$toasted.error(this.$t('toasted_msg.nice_error'), {
              theme: 'toasted-primary',
              containerClass: 'kiosk-toasted',
            })
            break
        }
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div v-if="step === null" :class="$style.kioskCertifiedSelf">
        <div>
          <h2>{{ $t('kiosk.mobile_authentication') }}</h2>
          <p>{{ $t('kiosk.mobile_authentication_txt') }}</p>
        </div>
        <el-button @click.prevent="handleRealnameAuth">{{
          $t('kiosk.do_mobile_authentication')
        }}</el-button>
      </div>
      <div v-if="step === 'success'" :class="$style.withdrawalSuccess">
        <img src="@assets/kiosk-img/icon-success.svg" alt="login success" />
        <p>{{ $t('kiosk.complete_mobile_authentication') }}</p>
        <div class="kiosk-select-box">
          <el-button class="home-btn" @click="$emit('close_drawer')">
            {{ $t('kiosk.go_to_first') }}
          </el-button>
        </div>
      </div>

      <div v-if="step === 'fail'" :class="$style.withdrawalFail">
        <img src="@assets/kiosk-img/icon-fail.svg" alt="login fail" />
        <p>{{ $t('kiosk.failed_mobile_authentication') }}</p>
        <p>{{ error_message }}</p>
        <div class="kiosk-select-box">
          <el-button class="prev-btn" @click="step = null">{{
            $t('before')
          }}</el-button>
        </div>
      </div>

      <form ref="realname_form">
        <input
          v-for="(val, key) in realname_params"
          :key="key"
          v-model="realname_params[key]"
          :name="key"
          type="hidden"
        />
      </form>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
