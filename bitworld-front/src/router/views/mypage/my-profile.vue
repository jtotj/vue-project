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

export default {
  page: {
    title: 'Myprofile',
    meta: [
      {
        name: 'description',
        content: 'Myprofile',
      },
    ],
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
  <div class="main">
    <div class="foreground-container">
      <div class="contents">
        <div class="big-tit-wrap">
          <div class="container">
            <span class="big-tit">{{ $t('header.my_profile') }}</span>
          </div>
        </div>

        <div class="profile container">
          <div class="brief">
            <div class="profile-list">
              <div class="list-left">{{ $t('my_page.user_name') }}</div>
              <div class="list-right">
                <strong>{{ currentUser.user_name }}</strong>
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left">{{ $t('my_page.email_address') }}</div>
              <div class="list-right">
                <strong>{{ currentUser.email_address }}</strong>
              </div>
            </div>

            <div class="profile-list">
              <div class="list-left">{{ $t('my_page.register_regdate') }}</div>
              <div class="list-right">
                <strong class>{{
                  date('Y-m-d H:i:s', new Date(currentUser.regdate))
                }}</strong>
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left">{{ $t('my_page.last_login') }}</div>
              <div class="list-right">
                <strong class>{{
                  date('Y-m-d H:i:s', new Date(currentUser.last_login))
                }}</strong>
              </div>
            </div>
            <div class="profile-list ">
              <div class="list-left fixed-height">{{ $t('inviter_link') }}</div>
              <div class="list-right">
                <strong style="margin-right: 5px;">{{ referal_url }}</strong>
                <a class="btn" @click="handleCopyInviterCode">{{
                  $t('copy')
                }}</a>
              </div>
            </div>
            <div
              v-for="type in certification_types"
              :key="type.type_seq"
              class="profile-list"
            >
              <div class="list-left fixed-height" v-html="type.title"></div>
              <div class="list-right">
                <template v-if="type.certification_seq">
                  {{
                    date(
                      'Y-m-d H:i:s',
                      new Date(type.certification_closed_date)
                    )
                  }}
                  <span class="color-common">
                    <i class="fas fa-check-circle"></i>
                    {{ $t('my_page.auth_complete') }}
                  </span>
                  <template v-if="type.certification_expdate !== null">
                    ({{ $t('my_page.expdate') }}:
                    {{
                      date('Y-m-d H:i:s', new Date(type.certification_expdate))
                    }})
                  </template>
                </template>
                <div class="btn-wrap">
                  <template v-if="$route.path.indexOf('b2c') === -1">
                    <router-link
                      v-if="
                        type.is_valid !== 'Y' ||
                          (type.certification_expdate &&
                            new Date(type.certification_expdate).getTime() >
                              Date.now())
                      "
                      :to="{
                        name:
                          $route.path.indexOf('bank') !== -1
                            ? 'bank-kyc'
                            : 'kyc',
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
                      class="btn"
                      >{{ $t('my_page.apply_list') }}</router-link
                    >
                  </template>
                  <template v-else>
                    <router-link
                      v-if="
                        type.is_valid !== 'Y' ||
                          (type.certification_expdate &&
                            new Date(type.certification_expdate).getTime() >
                              Date.now())
                      "
                      :to="{
                        name: 'b2c-kyc',
                        params: { type_seq: type.type_seq },
                      }"
                      class="btn"
                    >
                      {{ $t('my_page.act_auth') }}</router-link
                    >
                    <router-link
                      :to="{
                        name: 'b2c-kyc-list',
                      }"
                      class="btn"
                      >{{ $t('my_page.apply_list') }}</router-link
                    >
                  </template>
                </div>
              </div>
            </div>
            <div
              v-if="
                (kyc_config && kyc_config.realname_authority) || realname_info
              "
              class="profile-list"
            >
              <div class="list-left fixed-height">
                {{ $t('my_page.realname_auth') }}
              </div>
              <div class="list-right">
                <template v-if="realname_info">
                  {{ date('Y-m-d H:i:s', new Date(realname_info.closed_date)) }}
                  <span class="color-common">
                    <i class="fas fa-check-circle"></i>
                    {{ $t('my_page.auth_complete') }}
                  </span>
                  <template v-if="realname_info.expdate !== null">
                    ({{ $t('my_page.expdate') }}:
                    {{ date('Y-m-d H:i:s', new Date(realname_info.expdate)) }})
                  </template>
                </template>
                <a
                  v-if="show_realname_button"
                  href="#"
                  class="btn"
                  @click.prevent="handleRealnameAuth"
                  >{{ $t('my_page.act_auth') }}</a
                >
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left fixed-height">
                {{ $t('my_page.email_auth') }}
              </div>
              <div class="list-right">
                <template v-if="mail_verification_info">
                  {{
                    date(
                      'Y-m-d H:i:s',
                      new Date(mail_verification_info.regdate)
                    )
                  }}
                  <span class="color-common">
                    <i class="fas fa-check-circle"></i>
                    {{ $t('my_page.auth_complete') }}
                  </span>
                </template>
                <template v-else>
                  <div class="btn-wrap">
                    <template v-if="$route.path.indexOf('b2c') === -1">
                      <router-link
                        :to="{
                          name:
                            $route.path.indexOf('bank') !== -1
                              ? 'bank-mail-verification'
                              : 'mail-verification',
                        }"
                        class="btn"
                        >{{ $t('my_page.act_auth') }}</router-link
                      >
                    </template>
                    <template v-else>
                      <router-link
                        :to="{
                          name: 'b2c-mail-verification',
                        }"
                        class="btn"
                        >{{ $t('my_page.act_auth') }}</router-link
                      >
                    </template>
                  </div>
                </template>
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left fixed-height">
                {{ $t('my_page.otp_auth') }}
              </div>
              <div class="list-right">
                <div class="btn-wrap">
                  <template v-if="$route.path.indexOf('b2c') === -1">
                    <router-link
                      :to="{
                        name:
                          $route.path.indexOf('bank') !== -1
                            ? 'bank-otp'
                            : 'otp',
                      }"
                      class="btn"
                      >{{ $t('my_page.enroll') }}</router-link
                    >
                  </template>
                  <template v-else>
                    <router-link
                      :to="{
                        name: 'b2c-otp',
                      }"
                      class="btn"
                      >{{ $t('my_page.enroll') }}</router-link
                    >
                  </template>
                </div>
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left fixed-height">
                {{ $t('my_page.security') }}
              </div>
              <div class="list-right">
                <template v-if="c_find_my_level">
                  {{ c_find_my_level.title }}
                </template>
                <div class="btn-wrap">
                  <template v-if="$route.path.indexOf('b2c') === -1">
                    <router-link
                      :to="{
                        name:
                          $route.path.indexOf('bank') !== -1
                            ? 'bank-security'
                            : 'security',
                      }"
                      class="btn"
                      >{{ $t('my_page.show_security') }}</router-link
                    >
                  </template>
                  <template v-else>
                    <router-link
                      :to="{
                        name: 'b2c-security',
                      }"
                      class="btn"
                      >{{ $t('my_page.show_security') }}</router-link
                    >
                  </template>
                </div>
              </div>
            </div>
            <div class="profile-list">
              <div class="list-left fixed-height">
                {{ $t('my_page.auth_withdraw_address') }}
              </div>
              <div class="list-right">
                <div class="btn-wrap">
                  <template v-if="$route.path.indexOf('b2c') === -1">
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
                      class="btn"
                      >{{ $t('my_page.apply_list') }}</router-link
                    >
                  </template>
                  <template v-else>
                    <router-link
                      :to="{
                        name: 'b2c-kyc-withdraw-address',
                      }"
                      class="btn"
                      >{{ $t('my_page.enroll') }}</router-link
                    >
                    <router-link
                      :to="{
                        name: 'b2c-kyc-withdraw-address-list',
                      }"
                      class="btn"
                      >{{ $t('my_page.apply_list') }}</router-link
                    >
                  </template>
                </div>
              </div>
            </div>
            <div class="profile-list">
              <div class="trust-box">
                <button
                  class="pwd-modify-btn"
                  @click="update_param = 'password'"
                  >{{ $t('my_page.password_modify') }}</button
                >
                <button
                  class="email-modify-btn"
                  @click="update_param = 'email'"
                  >{{ $t('my_page.email_modify') }}</button
                >
              </div>
              <div class="account-block">
                <button class="btn-block" @click="block_modal = true">{{
                  $t('my_page.account_block')
                }}</button>
              </div>
            </div>
          </div>
          <form v-if="update_param === 'password'" class="update-password">
            <h1 class="tit">
              <span>{{ $t('my_page.password_modify') }}</span>
            </h1>
            <form class="input-form">
              <div
                :class="[
                  'formWrap',
                  { isFocus: is_focus === 'old' },
                  { hasValue: password_update_data.old_password.length !== 0 },
                ]"
              >
                <input
                  id="old_password"
                  v-model="password_update_data.old_password"
                  :placeholder="$t('my_page.placeholder_old_password')"
                  type="password"
                  class="formControl"
                  @focus="is_focus = 'old'"
                  @blur="is_focus = null"
                />
              </div>
              <div
                :class="[
                  'formWrap',
                  { isFocus: is_focus === 'new' },
                  { hasValue: password_update_data.new_password.length !== 0 },
                ]"
              >
                <input
                  id="new_password"
                  v-model="password_update_data.new_password"
                  :placeholder="$t('my_page.placeholder_new_password')"
                  type="password"
                  class="formControl"
                  @focus="is_focus = 'new'"
                  @blur="is_focus = null"
                />
              </div>
              <div
                :class="[
                  'formWrap',
                  { isFocus: is_focus === 'pw_confirm' },
                  {
                    hasValue:
                      password_update_data.confirm_password.length !== 0,
                  },
                ]"
              >
                <input
                  id="confirm_password"
                  v-model="password_update_data.confirm_password"
                  type="password"
                  :placeholder="$t('my_page.placeholder_confirm')"
                  class="formControl"
                  @focus="is_focus = 'pw_confirm'"
                  @blur="is_focus = null"
                />
              </div>
              <div class="btnWrap">
                <el-button
                  class="cancel-btn"
                  round
                  @click="passwordInputReset"
                  >{{ $t('cancel') }}</el-button
                >
                <el-button
                  class="confirm-btn bg-common"
                  round
                  @click="handlePasswordUpdate"
                  >{{ $t('modify') }}</el-button
                >
              </div>
            </form>
          </form>
          <form v-if="update_param === 'email'" class="update-email">
            <h1 class="tit">
              <span>{{ $t('my_page.email_modify') }}</span>
            </h1>
            <form class="input-form">
              <div
                :class="[
                  'formWrap',
                  { isFocus: is_focus === 'e_old_pw' },
                  { hasValue: email_update_data.password.length !== 0 },
                ]"
              >
                <input
                  id="e_password"
                  v-model="email_update_data.password"
                  type="password"
                  :placeholder="$t('my_page.placeholder_password')"
                  class="formControl"
                  @focus="is_focus = 'e_old_pw'"
                  @blur="is_focus = null"
                />
              </div>
              <div
                :class="[
                  'formWrap',
                  { isFocus: is_focus === 'email' },
                  { hasValue: email_update_data.email_address.length !== 0 },
                ]"
              >
                <input
                  id="email"
                  v-model="email_update_data.email_address"
                  type="text"
                  :placeholder="$t('my_page.placeholder_email')"
                  class="formControl"
                  @focus="is_focus = 'email'"
                  @blur="is_focus = null"
                />
              </div>
              <div class="btnWrap">
                <el-button class="cancel-btn" round @click="emailInputReset">{{
                  $t('cancel')
                }}</el-button>
                <el-button
                  class="confirm-btn"
                  round
                  @click="handleEmailUpdate"
                  >{{ $t('modify') }}</el-button
                >
              </div>
            </form>
          </form>
        </div>

        <!-- 모달 -->
        <el-dialog
          custom-class="modal-header"
          :title="$t('my_page.account_block')"
          :visible.sync="block_modal"
        >
          <div class="modal-block-account">
            <div
              :class="[
                'form-wrap',
                { isFocus: is_focus === 'delete' },
                { hasValue: delete_user_password.length !== 0 },
              ]"
            >
              <label for="delete" class="input-label">
                {{ $t('password') }}
                <span class="essential"></span>
              </label>
              <input
                id="delete"
                v-model="delete_user_password"
                type="text"
                class="form-control"
                @focus="is_focus = 'delete'"
                @blur="is_focus = null"
              />
              <span class="essen-text">
                {{ $t('password') }}
                <span class="essential"></span>
              </span>
            </div>
            <div class="modal-footer" style="text-align:right;">
              <button
                class="btn-normal cancel"
                style="margin-right: 10px;"
                @click=";(block_modal = false), (delete_user_password = '')"
                >{{ $t('cancel') }}</button
              >
              <button class="btn-normal submit" @click="handleDelete">
                {{ $t('account_delete') }}
              </button>
            </div>
          </div>
        </el-dialog>
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
</template>
