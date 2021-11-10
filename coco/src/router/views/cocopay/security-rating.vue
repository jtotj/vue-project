<script>
import PayCertiNav from '@components/pay-certi-nav'
import '@assets/css/mypage/security.css'
import {
  fetchLevels,
  fetchLevelConditions,
  fetchRestrictions,
  fetchRestrictionTargets,
} from '@apis/security'
import {
  fetchCertificationTypes,
  fetchRealnameList,
  fetchCertificationList,
  fetchWithdrawAddressList,
} from '@apis/kyc'
import { fetchVerificationList as fetchMailVerificationList } from '@apis/mail'

import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import each from 'lodash/each'
import omit from 'lodash/omit'
import find from 'lodash/find'
import store from '@state/store'

export default {
  page: {
    title: 'Securityrating',
    meta: [
      {
        name: 'description',
        content: 'Securityrating',
      },
    ],
  },
  filters: {
    currency(value, asset_seq) {
      if (!value) return ''
      const asset_info = find(store.state.assets.assets, { seq: asset_seq })
      if (!asset_info) return value
      const decimal = parseFloat(value).toFixed(asset_info.decimal_point)
      const parts = decimal.toString().split('.')
      if (parts[1]) parts[1] = parts[1].replace(/(0+$)/, '')
      const comma =
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (parts[1] ? '.' + parts[1] : '')
      return comma
    },
  },
  components: {
    PayCertiNav,
  },
  data() {
    return {
      levels: null,
      conditions: null,
      certifications: null,
      mail_verification_info: null,
      realname_info: null,
      restriction_list: null,
      loading: false,

      withdraw_address_list: [],
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('auth', ['otps']),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', ['locale']),

    ...mapState('assets', ['assets']),
    c_filter_level() {
      const arranged_levels = []
      each(this.levels, (level) => {
        let arranged_level = find(arranged_levels, {
          title: level.title,
          level: level.level,
        })

        if (!arranged_level) {
          arranged_level = { ...omit(level, 'condition'), condition_or: [] }
          arranged_levels.push(arranged_level)
        }

        const verification = map(level.condition, (info) => {
          switch (info.condition_type) {
            case 'OTP_REGISTER':
              return this.otps.length
                ? { ...info, is_verify: true }
                : { ...info, is_verify: false }
            case 'KYC_CERTIFICATION':
              const kyc_certify = find(this.certifications, {
                type_seq: info.certification_type_seq,
              })
              return kyc_certify && kyc_certify.is_valid === 'Y'
                ? { ...info, is_verify: true }
                : { ...info, is_verify: false }
            case 'KYC_REALNAME':
              return this.realname_info
                ? { ...info, is_verify: true }
                : { ...info, is_verify: false }
            case 'MAIL_VERIFICATION':
              return this.mail_verification_info
                ? { ...info, is_verify: true }
                : { ...info, is_verify: false }
            case 'KYC_ASSET_WITHDRAW_ADDRESS_CERTIFICATION':
              return find(this.withdraw_address_list, {
                asset_seq: info.asset_seq,
              })
                ? { ...info, is_verify: true }
                : { ...info, is_verify: false }
          }
        })
        arranged_level.condition_or.push(verification)
      })

      return arranged_levels
    },
    c_filter_restriction() {
      const restrictions = []
      each(this.c_filter_level, (data) => {
        let restriction = find(this.restriction_list, (e) => {
          return (
            (data.level >= e.level_start && data.level <= e.level_end) ||
            (data.level >= e.level_start && e.level_end === 0) ||
            (e.level_start === 0 && e.level_end >= data.level)
          )
        })
        if (restriction) {
          restrictions.push(restriction)
        }
      })
      return restrictions
    },
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([
        this.loadLevels(),
        this.loadCertificationTypes(),
        this.loadRestriction(),
        this.loadRealnameInfo(),
        this.loadMailVerificationInfo(),
        this.loadWithdrawAddressList(),
      ])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => (this.loading = false))
    },
    async loadLevels() {
      const { data } = await fetchLevels()
      const types = await Promise.all(
        map(data, async ({ title, seq, level, is_alive }) => {
          const {
            data: [...condition],
          } = await fetchLevelConditions(seq)
          const conditions = map(condition, (info) => ({
            ...info,
            asset_info: info.asset_seq
              ? find(this.assets, { seq: info.asset_seq })
              : null,
          }))

          return {
            title,
            level_seq: seq,
            level,
            is_alive,
            condition: conditions,
          }
        })
      )
      this.levels = types
    },
    fromPairs,
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

      this.certifications = types
    },
    routerGo(p, seq) {
      if (p === 'KYC_CERTIFICATION') {
        this.$router.push({ name: 'kyc', params: { type_seq: seq } })
      } else if (p === 'MAIL_VERIFICATION') {
        this.$router.push({ name: 'mail-verification' })
      } else if (p === 'KYC_REALNAME') {
        this.$router.push({ name: 'myprofile' })
      } else if (p === 'OTP_REGISTER') {
        this.$router.push({ name: 'otp' })
      } else if (p === 'KYC_ASSET_WITHDRAW_ADDRESS_CERTIFICATION') {
        this.$router.push({ name: 'kyc-withdraw-address' })
      }
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
    async loadRestriction() {
      const { data } = await fetchRestrictions()
      const types = await Promise.all(
        map(data, async ({ title, level_start, level_end, is_alive, seq }) => {
          const {
            data: [...restriction_info],
          } = await fetchRestrictionTargets(seq)

          return {
            title,
            seq,
            is_alive,
            level_start,
            level_end,
            restriction_info: restriction_info,
          }
        })
      )
      this.restriction_list = types
    },
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList()

      this.withdraw_address_list = data
    },
  },
}
</script>

<template>
  <div>
    <div class="pay-container certi-manage cs-center">
      <h4 class="tit">{{ $t('header.certification_management') }}</h4>
      <div class="con-wrap">
        <PayCertiNav></PayCertiNav>
        <div class="right-wrap">
          <div class="big-title-wrap">
            <h2 class="big-title">
              {{ $t('security.show_security') }}
            </h2>
            <div
              :class="[
                {
                  spacing:
                    locale === 'en-US' ||
                    locale === 'de-DE' ||
                    locale === 'fr-FR' ||
                    locale === 'vi-VN',
                },
              ]"
              class="security-guide"
            >
              <span class="security-complete img"></span>
              <p>
                {{ $t('my_page.auth_complete') }}
              </p>
              <span class="security-incomplete img"></span>
              <p>
                {{ $t('security.auth_incomplete') }}
              </p>
            </div>
            <div v-loading="loading" class="security">
              <div class="card-wrap">
                <el-card
                  v-for="(level, idx) in c_filter_level"
                  :key="level.seq"
                  class="box-card"
                  :title="level.title"
                >
                  <div slot="header" class="clearfix">
                    <span>{{ level.title }}</span>
                    <div
                      v-if="currentUser.security_level === level.level"
                      class="check"
                    >
                      <div class="img-wrap">
                        <img src="@assets/img/check-circle.svg" />
                      </div>
                      <span>{{ $t('my_page.auth_complete') }}</span>
                    </div>
                  </div>
                  <div>
                    <div
                      v-for="(val, index) in level.condition_or"
                      :key="val.seq"
                      class="condition-wrap"
                    >
                      <span>{{ $t('security.condition') }}</span>
                      <div
                        :key="index"
                        :class="['condition-content', { no: !val.length }]"
                      >
                        <div v-for="or in val" :key="or.seq">
                          <div
                            :class="[
                              'btn-color',
                              { verify: or.is_verify === true },
                            ]"
                            class="btn-small-black"
                            @click="
                              routerGo(
                                or.condition_type,
                                or.certification_type_seq
                              )
                            "
                          >
                            <i
                              v-if="or.is_verify"
                              class="el-icon-circle-check"
                            ></i>
                            {{
                              fromPairs(
                                constants.security.level.condition_type
                              )[or.condition_type]
                            }}
                            {{ or.asset_info ? or.asset_info.code : '' }}
                            <template v-for="certification in certifications">
                              <span
                                v-if="
                                  certification.type_seq ===
                                    or.certification_type_seq
                                "
                                :key="certification.type_seq"
                                >{{ certification.title }}</span
                              >
                            </template>
                          </div>
                        </div>
                        <div v-if="!val.length">{{ $t('security.no') }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="c_filter_restriction.length" class="limit">
                    <p>
                      {{ $t('security.restriction') }}
                    </p>
                    <PerfectScrollbar>
                      <template
                        v-if="c_filter_restriction[idx].restriction_info.length"
                      >
                        <p
                          v-for="info in c_filter_restriction[idx]
                            .restriction_info"
                          :key="info.seq"
                        >
                          -
                          {{
                            fromPairs(
                              constants.security.restriction.target_type
                            )[info.target_type]
                          }}
                          {{ info.amount | currency(info.asset_seq) }}
                          <template v-for="asset in assets">
                            <span
                              v-if="info.asset_seq === asset.seq"
                              :key="asset.seq"
                              >{{ asset.code }}</span
                            >
                          </template>
                        </p>
                      </template>
                      <template v-else>
                        <div>{{ $t('security.no') }}</div>
                      </template>
                    </PerfectScrollbar>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
@import '@src/design/kyc.scss';
</style>
