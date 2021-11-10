<script>
import '@assets/css/kiosk/kiosk-certified.css'
import KioskEmailVerification from '@components/kiosk/kiosk-email-verification'
import KioskOtpVerification from '@components/kiosk/kiosk-otp-verification'
import KioskRealNameVerification from '@components/kiosk/kiosk-realname-verification'
import KioskWithdrawAddress from '@components/kiosk/kiosk-withdraw-address'
import KioskWithdrawAddressList from '@components/kiosk/kiosk-withdraw-address-list'
import KioskKycCertification from '@components/kiosk/kiosk-kyc-certification'
import KioskKycCertificationList from '@components/kiosk/kiosk-kyc-certification-list'
import KioskSecurity from '@components/kiosk/kiosk-security'
import { fetchRealnameList, fetchCertificationList } from '@apis/kyc'
import { fetchVerificationList as fetchMailVerificationList } from '@apis/mail'
import { fetchKycConfig, fetchMemberConfig } from '@apis/config'
import { mapState } from 'vuex'
import { fetchLevels } from '@apis/security'
import find from 'lodash/find'

export default {
  components: {
    KioskEmailVerification,
    KioskOtpVerification,
    KioskRealNameVerification,
    KioskWithdrawAddress,
    KioskWithdrawAddressList,
    KioskKycCertification,
    KioskKycCertificationList,
    KioskSecurity,
  },
  data() {
    return {
      certify_component: null,

      mail_verification_info: null,
      kyc_config: null,
      realname_info: null,
      certification_list: [],
      member_config: null,

      levels: [],
      drawer_visible: false,
      select_component: null,
      drawer_title: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('auth', ['otps']),
    show_realname_button() {
      if (!this.kyc_config || !this.kyc_config.realname_authority) return false

      if (
        this.realname_info &&
        (this.realname_info.expdate === null ||
          new Date(this.realname_info.expdate).getTime() >= Date.now())
      )
        return false

      return true
    },
    find_curretUser_level() {
      return find(this.levels, { level: this.currentUser.security_level })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        this.loadKycConfig(),
        this.loadRealnameInfo(),
        this.loadCertificationList(),
        this.loadMailVerificationInfo(),
        this.loadMemberConfig(),
        this.loadLevels(),
      ]).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },
    async loadMemberConfig() {
      const { config } = await fetchMemberConfig().catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.member_config = config
    },
    async loadCertificationList() {
      const { data } = await fetchCertificationList({
        is_valid: 'Y',
        no_paging: 1,
      })

      this.certification_list = data
    },
    async loadKycConfig() {
      const { config } = await fetchKycConfig('kyc')

      this.kyc_config = config
    },
    async loadRealnameInfo() {
      const {
        data: [realname_info],
      } = await fetchRealnameList({ is_valid: 'Y', no_paging: 1 })

      this.realname_info = realname_info
    },
    async loadMailVerificationInfo() {
      const {
        data: [verification_info],
      } = await fetchMailVerificationList({ is_valid: 'Y', no_paging: 1 })

      this.mail_verification_info = verification_info
    },
    async loadLevels() {
      const { data } = await fetchLevels().catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.levels = data
    },
    handleClick(component) {
      this.select_component = component
      this.drawer_visible = true
      switch (component) {
        case 'KioskEmailVerification':
          this.drawer_title = this.$t('kiosk.email_authentication')
          break
        case 'KioskRealNameVerification':
          this.drawer_title = this.$t('kiosk.identity_verification')
          break
        case 'KioskOtpVerification':
          this.drawer_title = this.$t('kiosk.otp_authentication')
          break
        case 'KioskWithdrawAddress':
          this.drawer_title = this.$t('kiosk.withdrawal_address_verification')
          break
        case 'KioskWithdrawAddressList':
          this.drawer_title = this.$t(
            'kiosk.withdrawal_address_application_details'
          )
          break
        case 'KioskKycCertification':
          this.drawer_title = this.$t('kiosk.kyc_authentication')
          break
        case 'KioskKycCertificationList':
          this.drawer_title = this.$t('kiosk.kyc_application_details')
          break
        case 'KioskSecurity':
          this.drawer_title = this.$t('kiosk.security_level')
          break
      }
    },
    handleClose() {
      this.drawer_visible = false
    },
    handleSecurityEvent(name) {
      this.select_component = name
      switch (name) {
        case 'KioskEmailVerification':
          this.drawer_title = this.t('header.email_auth')
          break
        case 'KioskRealNameVerification':
          this.drawer_title = this.$t('kiosk.identity_verification')
          break
        case 'KioskOtpVerification':
          this.drawer_title = this.$t('kiosk.otp_authentication')
          break
        case 'KioskWithdrawAddress':
          this.drawer_title = this.$t('kiosk.withdrawal_address_verification')
          break
        case 'KioskWithdrawAddressList':
          this.drawer_title = this.$t(
            'kiosk.withdrawal_address_application_details'
          )
          break
        case 'KioskKycCertification':
          this.drawer_title = this.$t('kiosk.kyc_authentication')
          break
        case 'KioskKycCertificationList':
          this.drawer_title = this.$t('kiosk.kyc_application_details')
          break
        case 'KioskSecurity':
          this.drawer_title = this.$t('kiosk.security_level')
          break
      }
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <!-- 인증관리 메인 -->
      <div :class="$style.kioskCertifiedMain" class="kiosk-certified-main">
        <ul>
          <li
            :class="{
              [$style.active]: mail_verification_info,
              active: mail_verification_info,
            }"
          >
            <div>
              <div :class="$style.kioskCertifiedCheck">
                <img
                  src="@assets/kiosk-img/icon-check-green.svg"
                  alt="인증마크"
                />
                <span>인증완료</span>
              </div>
              <h3>
                {{ $t('my_page.email_auth') }}
              </h3>
            </div>
            <el-button @click="handleClick('KioskEmailVerification')">{{
              $t('my_page.act_auth')
            }}</el-button>
          </li>
          <template
            v-if="
              (kyc_config && kyc_config.realname_authority) || realname_info
            "
          >
            <li
              :class="{
                [$style.active]: realname_info,
                active: realname_info,
              }"
            >
              <div>
                <div :class="$style.kioskCertifiedCheck">
                  <img
                    src="@assets/kiosk-img/icon-check-green.svg"
                    alt="인증마크"
                  />
                  <span>인증완료</span>
                </div>
                <h3>본인 인증</h3>
              </div>
              <div class="">
                <el-button
                  v-if="show_realname_button"
                  @click="handleClick('KioskRealNameVerification')"
                  >{{ $t('my_page.act_auth') }}</el-button
                >
              </div>
            </li>
          </template>
          <li
            :class="{
              [$style.active]: otps.length,
              active: otps.length,
            }"
          >
            <div>
              <div :class="$style.kioskCertifiedCheck">
                <img
                  src="@assets/kiosk-img/icon-check-green.svg"
                  alt="인증마크"
                />
                <span>인증완료</span>
              </div>
              <h3>
                {{ $t('my_page.otp_auth') }}
              </h3>
            </div>
            <div class="">
              <el-button @click="handleClick('KioskOtpVerification')">{{
                $t('my_page.act_auth')
              }}</el-button>
            </div>
          </li>
          <li>
            <div>
              <div :class="$style.kioskCertifiedCheck">
                <img
                  src="@assets/kiosk-img/icon-check-green.svg"
                  alt="인증마크"
                />
                <span>인증완료</span>
              </div>
              <h3>
                {{ $t('kiosk.withdrawal_address_verification') }}
              </h3>
            </div>
            <div>
              <el-button @click="handleClick('KioskWithdrawAddress')">{{
                $t('my_page.act_auth')
              }}</el-button>
            </div>
            <div class="">
              <el-button @click="handleClick('KioskWithdrawAddressList')">{{
                $t('my_page.apply_list')
              }}</el-button>
            </div>
          </li>
          <li>
            <div>
              <div :class="$style.kioskCertifiedCheck">
                <img
                  src="@assets/kiosk-img/icon-check-green.svg"
                  alt="인증마크"
                />
                <span>인증완료</span>
              </div>
              <h3>
                {{ $t('kiosk.kyc_authentication') }}
              </h3>
            </div>
            <div>
              <el-button @click="handleClick('KioskKycCertification')">{{
                $t('my_page.act_auth')
              }}</el-button>
            </div>
            <div class="">
              <el-button @click="handleClick('KioskKycCertificationList')">{{
                $t('my_page.apply_list')
              }}</el-button>
            </div>
          </li>
          <li>
            <div v-if="find_curretUser_level">
              <div>
                <strong> {{ find_curretUser_level.title }}</strong>
              </div>
              <h3>{{ $t('kiosk.security_level') }}</h3>
            </div>
            <div class="">
              <el-button @click="handleClick('KioskSecurity')">{{
                $t('kiosk.view_rating')
              }}</el-button>
            </div>
          </li>
        </ul>
      </div>
      <el-drawer
        :title="drawer_title"
        :visible.sync="drawer_visible"
        direction="btt"
        :modal="false"
      >
        <component
          :is="select_component"
          v-if="drawer_visible"
          @close_drawer="handleClose"
          @security_event="handleSecurityEvent"
        ></component>
      </el-drawer>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
