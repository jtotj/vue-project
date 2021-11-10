<script>
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
    title: 'Security',
    meta: [{ name: 'description', content: 'Security' }],
  },
  filters: {
    currency(value, asset_seq) {
      if (!value) return ''
      const asset_info = find(store.state.assets.assets, { seq: asset_seq })
      const decimal = parseFloat(value).toFixed(asset_info.decimal_point)
      const parts = decimal.toString().split('.')
      if (parts[1]) parts[1] = parts[1].replace(/(0+$)/, '')
      const comma =
        parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        (parts[1] ? '.' + parts[1] : '')
      return comma
    },
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
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('auth', ['otps']),
    ...mapState('auth', ['currentUser']),

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

        arranged_level.condition_or.push(level.condition)
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
    c_filter_zero_restriction() {
      return find(this.restriction_list, (zero) => {
        return zero.level_start === 0 && zero.level_end >= 0
      })
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
      ])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => (this.loading = false))
    },
    async loadLevels() {
      const { data } = await fetchLevels()
      const types = await Promise.all(
        map(data, async ({ title, seq, level, is_alive }) => {
          const {
            data: [...condition_info],
          } = await fetchLevelConditions(seq)
          return {
            title,
            level_seq: seq,
            level,
            is_alive,
            condition: condition_info,
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
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <h2 class="big-tit">{{ $t('security.show_security') }}</h2>
        <div v-loading="loading" class="security-wrap">
          <el-card class="security-box-wrap pc">
            <div slot="header" class="clearfix">
              <h3>
                {{ $t('security.security_title') }}
              </h3>
            </div>
            <table class="security-box">
              <thead>
                <tr>
                  <th>{{ $t('security.grade') }}</th>
                  <th>{{ $t('security.condition') }}</th>
                  <th>{{ $t('security.restriction') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ $t('security.no_grade') }}</td>
                  <td>{{ $t('security.no') }}</td>
                  <td>
                    <template v-if="c_filter_zero_restriction">
                      <div
                        v-for="no_grade in c_filter_zero_restriction.restriction_info"
                        :key="no_grade.seq"
                      >
                        {{
                          fromPairs(constants.security.restriction.target_type)[
                            no_grade.target_type
                          ]
                        }}
                        <!-- {{ no_grade.amount | currency(no_grade.asset_seq) }} -->
                        {{ no_grade.amount }}
                        <template v-for="asset in assets">
                          <span
                            v-if="no_grade.asset_seq === asset.seq"
                            :key="asset.seq"
                            >{{ asset.code }}</span
                          >
                        </template>
                      </div>
                    </template>
                    <template v-else>
                      <div>{{ $t('security.no') }}</div>
                    </template>
                  </td>
                </tr>
                <tr v-for="(level, idx) in c_filter_level" :key="level.seq">
                  <td class="lv">
                    {{ level.title }}
                    <div
                      v-if="currentUser.security_level === level.level"
                      class="check"
                    >
                      <img src="@assets/img/check-icon.png" />
                      <span>{{ $t('my_page.auth_complete') }}</span>
                    </div>
                  </td>
                  <td>
                    <template
                      v-for="(val, index) in level.condition_or"
                      :class="['condition-wrap']"
                    >
                      <div v-if="index !== 0" :key="`or-${index}`" class="__or"
                        >or</div
                      >
                      <div
                        :key="index"
                        :class="['condition-content', { no: !val.length }]"
                      >
                        <div v-for="(or, or_idx) in val" :key="or.seq">
                          <div v-if="or_idx !== 0" class="__or">and</div>
                          <span
                            class="auth-btn"
                            @click="
                              routerGo(
                                or.condition_type,
                                or.certification_type_seq
                              )
                            "
                          >
                            {{
                              fromPairs(
                                constants.security.level.condition_type
                              )[or.condition_type]
                            }}
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
                          </span>
                        </div>
                        <div v-if="!val.length">{{ $t('security.no') }}</div>
                      </div>
                    </template>
                  </td>
                  <td v-if="c_filter_restriction.length">
                    <template
                      v-if="c_filter_restriction[idx].restriction_info.length"
                    >
                      <p
                        v-for="info in c_filter_restriction[idx]
                          .restriction_info"
                        :key="info.seq"
                      >
                        {{
                          fromPairs(constants.security.restriction.target_type)[
                            info.target_type
                          ]
                        }}
                        <!-- {{ info.amount | currency(info.asset_seq) }} -->
                        {{ info.amount }}
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
                  </td>
                </tr>
              </tbody>
            </table>
          </el-card>
        </div>
        <el-card class="mobile-card-wrap mobile">
          <div slot="header" class="clearfix lv">
            {{ $t('security.security_title') }}
          </div>

          <el-card class="box-card">
            <div slot="header" class="clearfix lv">
              {{ $t('security.no_grade') }}
            </div>

            <el-tabs>
              <el-tab-pane label="조건">{{ $t('security.no') }}</el-tab-pane>
              <el-tab-pane label="제한사항">
                <template v-if="c_filter_zero_restriction">
                  <p
                    v-for="no_grade in c_filter_zero_restriction.restriction_info"
                    :key="no_grade.seq"
                  >
                    {{
                      fromPairs(constants.security.restriction.target_type)[
                        no_grade.target_type
                      ]
                    }}
                    <!-- {{ no_grade.amount | currency(no_grade.asset_seq) }} -->
                    {{ no_grade.amount }}
                    <template v-for="asset in assets">
                      <span
                        v-if="no_grade.asset_seq === asset.seq"
                        :key="asset.seq"
                        >{{ asset.code }}</span
                      >
                    </template>
                  </p>
                </template>
                <template v-else>
                  <div>{{ $t('security.no') }}</div>
                </template>
              </el-tab-pane>
            </el-tabs>
          </el-card>

          <div
            v-for="(level, e) in c_filter_level"
            :key="level.seq"
            class="mobile-table"
          >
            <el-card class="box-card">
              <div slot="header" class="clearfix lv">
                <div
                  v-if="currentUser.security_level === level.level"
                  class="check"
                >
                  <div class="img-wrap">
                    <img src="@assets/img/check-icon.png" />
                  </div>
                  <span>{{ $t('my_page.auth_complete') }}</span>
                </div>
                {{ level.title }}
              </div>
              <el-tabs>
                <el-tab-pane :label="$t('security.condition')">
                  <template
                    v-for="(val, index) in level.condition_or"
                    :class="['condition-wrap']"
                  >
                    <div v-if="index !== 0" :key="`or-${index}`" class="__or"
                      >or</div
                    >
                    <div
                      :key="index"
                      :class="['condition-content', { no: !val.length }]"
                    >
                      <div v-for="(or, idx) in val" :key="or.seq">
                        <div v-if="idx !== 0" class="__or">and</div>
                        <span
                          class="auth-btn"
                          @click="
                            routerGo(
                              or.condition_type,
                              or.certification_type_seq
                            )
                          "
                        >
                          {{
                            fromPairs(constants.security.level.condition_type)[
                              or.condition_type
                            ]
                          }}
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
                        </span>
                      </div>
                      <div v-if="!val.length">{{ $t('security.no') }}</div>
                    </div>
                  </template>
                </el-tab-pane>
                <el-tab-pane
                  v-if="c_filter_restriction.length"
                  :label="$t('security.restriction')"
                >
                  <template
                    v-if="c_filter_restriction[e].restriction_info.length"
                  >
                    <div
                      v-for="info in c_filter_restriction[e].restriction_info"
                      :key="info.seq"
                    >
                      {{
                        fromPairs(constants.security.restriction.target_type)[
                          info.target_type
                        ]
                      }}
                      <!-- {{ info.amount | currency(info.asset_seq) }} -->
                      {{ info.amount }}
                      <template v-for="asset in assets">
                        <span
                          v-if="info.asset_seq === asset.seq"
                          :key="asset.seq"
                          >{{ asset.code }}</span
                        >
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <div>{{ $t('security.no') }}</div>
                  </template>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
