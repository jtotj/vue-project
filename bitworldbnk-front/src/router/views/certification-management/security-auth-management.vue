<script>
import { mapState } from 'vuex'
import date from 'locutus/php/datetime/date'
import {
  realnamePrepare,
  createRealname,
  fetchRealnameList,
  fetchCertificationTypes,
  fetchCertificationList,
} from '@apis/kyc'
import { fetchVerificationList as fetchMailVerificationList } from '@apis/mail'
import { fetchKycConfig, fetchMemberConfig } from '@apis/config'
import {
  deleteMember,
  updateMemberPassword,
  updateMemberEmail,
} from '@apis/member'
import { fetchLevels } from '@apis/security'
import map from 'lodash/map'
import find from 'lodash/find'
import SecurityRank from '@components/security-rank'

export default {
  page: {
    title: 'AuthManagement',
    meta: [
      {
        name: 'description',
        content: 'AuthManagement',
      },
    ],
  },
  components: {
    SecurityRank,
  },
  data() {
    return {
      block_modal: false,
      add_phone: false,
      block_account: false,
      my_phone_number: null,
      verify: false,
      not_receive: false,
      verification_code: '',
      username: '',
      password: '',
      update_param: this.$route.query.update_seq || null,
      password_update_data: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      email_update_data: {
        password: '',
        email_address: '',
      },
      delete_user_password: '',
      is_focus: null,
      realname_params: {},
      kyc_config: null,
      realname_info: null,
      mail_verification_info: null,
      loading: false,
      levels: null,
      certification_types: [],
      member_config: null,
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
    c_find_my_level() {
      return find(this.levels, { level: this.currentUser.security_level })
    },
    referal_url() {
      if (!this.member_config || !this.currentUser) return

      const { protocol, host } = window.location
      const inviter_identifier = this.currentUser[
        this.member_config.inviter_identifier
      ]

      return `${protocol}//${host}/@${inviter_identifier}?to_name=register`
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (window.kycRealnameCallback) delete window.kycRealnameCallback
  },
  methods: {
    date,
    init() {
      this.loading = true
      Promise.all([
        this.loadKycConfig(),
        this.loadRealnameInfo(),
        this.loadCertificationTypes(),
        this.loadMailVerificationInfo(),
        this.loadLevels(),
        this.loadMemberConfig(),
      ])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })

      window.kycRealnameCallback = this.kycRealnameCallback.bind(this)
    },
    async loadMemberConfig() {
      const { config } = await fetchMemberConfig().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.member_config = config
    },
    async kycRealnameCallback(data) {
      this.loading = true
      try {
        await createRealname(data)
        await this.loadRealnameInfo()

        this.$toasted.success(this.$t('toasted_msg.nice_success'))
      } catch (e) {
        this.$toasted.error(e.message)
      } finally {
        this.loading = false
      }
    },
    async loadCertificationTypes() {
      const { data } = await fetchCertificationTypes()
      const types = await Promise.all(
        map(data, async ({ title, name, seq }) => {
          const {
            data: [certification_info = {}],
          } = await fetchCertificationList({
            type_seq: seq,
            is_valid: 'Y',
            no_paging: 1,
          })

          return {
            title,
            name,
            type_seq: seq,
            is_valid: certification_info.is_valid,
            certification_seq: certification_info.seq,
            certification_expdate: certification_info.expdate,
            certification_closed_date: certification_info.closed_date,
          }
        })
      )

      this.certification_types = types
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
        this.$toasted.error(e.message)
      )
      this.levels = data
    },
    async handleRealnameAuth() {
      this.loading = true
      try {
        const $realname_form = this.$refs.realname_form
        switch (this.kyc_config.realname_authority) {
          case 'NICE':
            await this.$alert(this.$t('toasted_msg.nice_msg'), {
              type: 'info',
              title: this.$t('toasted_msg.nice_title'),
            })

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
            this.$toasted.error(this.$t('toasted_msg.nice_error'))
            break
        }
      } catch (e) {
        this.$toasted.error(e.message)
      } finally {
        this.loading = false
      }
    },

    handlePasswordUpdate() {
      updateMemberPassword(this.password_update_data)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.changed'))
          this.password_update_data = {
            ...this.password_update_data,
            old_password: '',
            new_password: '',
            confirm_password: '',
          }
          this.update_param = null
          this.$store.dispatch('auth/getUserInfo')
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleEmailUpdate() {
      updateMemberEmail(this.email_update_data)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.changed'))
          this.email_update_data = {
            ...this.email_update_data,
            password: '',
            email_address: '',
          }
          this.update_param = null
          this.$store.dispatch('auth/getUserInfo')
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleDelete() {
      deleteMember({
        password: this.delete_user_password,
      })
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.withdrawal'))
          this.delete_user_password = ''
          this.block_modal = false
          this.$router.push({
            name: 'home',
          })
        })
        .catch((e) => {
          this.$toasted.error(e.message)
          this.delete_user_password = ''
        })
    },
    passwordInputReset() {
      this.update_param = null
      this.password_update_data = {
        ...this.password_update_data,
        old_password: '',
        new_password: '',
        confirm_password: '',
      }
    },
    emailInputReset() {
      this.update_param = null
      this.email_update_data = {
        ...this.email_update_data,
        password: '',
        email_address: '',
      }
    },
    handleCopyInviterCode() {
      this.$copyText(this.referal_url).then(() =>
        this.$toasted.success(this.$t('toasted_msg.copy'))
      )
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title"> {{ $t('secure_management') }} </h2>
      </div>
      <div :class="[$style.AuthManagement]">
        <SecurityRank></SecurityRank>

        <div v-if="currentUser" :class="[$style.profileListWrap]">
          <div
            v-for="type in certification_types"
            :key="type.type_seq"
            :class="[$style.profileList]"
          >
            <div class="left-content">
              <div :class="[$style.listTitle]">
                {{ $t('kyc.kyc_enroll') }}
              </div>
              <div>
                <span>{{ type.title }} / </span>
                <template v-if="type.certification_seq">
                  <span>
                    {{
                      date(
                        'Y-m-d H:i:s',
                        new Date(type.certification_closed_date)
                      )
                    }}
                  </span>
                  <div class="color-common">
                    <i class="fas fa-check-circle"></i>
                    {{ $t('my_page.auth_complete') }}
                  </div>
                  <template v-if="type.certification_expdate !== null">
                    ({{ $t('my_page.expdate') }}:
                    {{
                      date('Y-m-d H:i:s', new Date(type.certification_expdate))
                    }})
                  </template>
                </template>
              </div>
            </div>
            <div class="btn-wrap">
              <router-link
                v-if="
                  type.is_valid !== 'Y' ||
                    (type.certification_expdate &&
                      new Date(type.certification_expdate).getTime() >
                        Date.now())
                "
                :to="{
                  name: $route.path.indexOf('bank') !== -1 ? 'bank-kyc' : 'kyc',
                  params: { type_seq: type.type_seq },
                }"
                class="btn"
              >
                {{ $t('my_page.act_auth') }}</router-link
              >
              <router-link
                :to="{
                  name:
                    $route.path.indexOf('bank') !== -1
                      ? 'bank-kyc-list'
                      : 'kyc-list',
                }"
                class="btn marginL-10"
                >{{ $t('my_page.apply_list') }}</router-link
              >
            </div>
          </div>
          <div
            v-if="
              (kyc_config && kyc_config.realname_authority) || realname_info
            "
            :class="[$style.profileList]"
          >
            <div class="left-content">
              <div :class="[$style.listTitle]">{{
                $t('my_page.realname_auth')
              }}</div>

              <template v-if="realname_info">
                {{ date('Y-m-d H:i:s', new Date(realname_info.closed_date)) }}
                <div class="color-common">
                  <i class="fas fa-check-circle"></i>
                  {{ $t('my_page.auth_complete') }}
                </div>
                <template v-if="realname_info.expdate !== null">
                  ({{ $t('my_page.expdate') }}:
                  {{ date('Y-m-d H:i:s', new Date(realname_info.expdate)) }})
                </template>
              </template>
            </div>
            <div class="btn-wrap">
              <a
                v-if="show_realname_button"
                href="#"
                class="btn"
                @click.prevent="handleRealnameAuth"
                >{{ $t('my_page.act_auth') }}</a
              >
            </div>
          </div>
          <div :class="[$style.profileList]">
            <div class="left-content">
              <div :class="[$style.listTitle]">
                {{ $t('my_page.email_auth') }}
              </div>
              <template v-if="mail_verification_info">
                {{
                  date('Y-m-d H:i:s', new Date(mail_verification_info.regdate))
                }}
                <div class="color-common">
                  <i class="fas fa-check-circle"></i>
                  {{ $t('my_page.auth_complete') }}
                </div>
              </template>
            </div>
            <div class="btn-wrap">
              <router-link
                v-if="!mail_verification_info"
                :to="{
                  name:
                    $route.path.indexOf('bank') !== -1
                      ? 'bank-mail-verification'
                      : 'mail-verification',
                }"
                class="btn"
                >{{ $t('my_page.act_auth') }}</router-link
              >
            </div>
          </div>
          <div :class="[$style.profileList]">
            <div class="left-content">
              <div :class="[$style.listTitle]">{{
                $t('my_page.otp_auth')
              }}</div>
            </div>
            <div class="btn-wrap">
              <router-link
                :to="{
                  name: $route.path.indexOf('bank') !== -1 ? 'bank-otp' : 'otp',
                }"
                class="btn"
                >{{ $t('my_page.enroll') }}</router-link
              >
            </div>
          </div>
          <div :class="[$style.profileList]">
            <div class="left-content">
              <div :class="[$style.listTitle]">
                {{ $t('my_page.auth_withdraw_address') }}
              </div>
            </div>
            <div class="btn-wrap">
              <router-link
                :to="{
                  name:
                    $route.path.indexOf('bank') !== -1
                      ? 'bank-kyc-withdraw-address'
                      : 'kyc-withdraw-address',
                }"
                class="btn"
                >{{ $t('my_page.enroll') }}</router-link
              >
              <router-link
                :to="{
                  name:
                    $route.path.indexOf('bank') !== -1
                      ? 'bank-kyc-withdraw-address-list'
                      : 'kyc-withdraw-address-list',
                }"
                class="btn marginL-10"
                >{{ $t('my_page.apply_list') }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.AuthManagement {
  .profileListWrap {
    display: inline-block;
    width: 100%;

    .profileList {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      padding: 20px;
      margin-bottom: 20px;
      overflow: hidden;
      background-color: white;
      border: 1px solid #e5e5e5;

      .listTitle {
        padding: 10px 0;
        font-size: 20px;
        font-weight: bold;
      }
      .levelTitle {
        margin-bottom: 20px;
        color: #0068c1;
      }

      .btnWrap {
        position: absolute;
        bottom: 40px;
        left: 50%;
        width: 100%;
        transform: translateX(-50%);

        .btn {
          padding: 8px 20px;
          margin: 0 5px;
          color: #fff;
          background-color: #0068c1;
          border-radius: 20px;

          &:hover {
            background-color: #08f;
          }
        }
      }
    }
  }
}

@media (max-width: 650px) {
  .AuthManagement {
    .profileListWrap {
      .profileList {
        width: 100%;
      }
      .btnWrap {
        .btn {
          padding: 5px 10px;
          margin: 0 5px;
          font-size: 13px;
          border-radius: 20px;
        }
      }
    }
  }
}
</style>

<style scoped>
.left-content {
  float: left;
}
.btn-wrap {
  float: right;
}
</style>
