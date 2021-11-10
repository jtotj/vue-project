<script>
import '@assets/css/kiosk/kiosk-certified.css'
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

import { mapState, mapGetters } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import each from 'lodash/each'
import omit from 'lodash/omit'
import find from 'lodash/find'
import KioskSecurityRestriction from '@components/kiosk/kiosk-security-restriction'

export default {
  components: {
    KioskSecurityRestriction,
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

      direction: 'btt',
      drawer_title: null,
      drawer_visible: false,
      select_component: null,
      s_level_restriction: null,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
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
    find_currentUser_level() {
      return find(this.levels, { level: this.currentUser.security_level })
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
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
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
        this.$emit('security_event', 'KioskKycCertification')
      } else if (p === 'MAIL_VERIFICATION') {
        this.$emit('security_event', 'KioskEmailVerification')
      } else if (p === 'KYC_REALNAME') {
        this.$emit('security_event', 'KioskRealNameVerification')
      } else if (p === 'OTP_REGISTER') {
        this.$emit('security_event', 'KioskOtpVerification')
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

    handleClick(component, level) {
      this.select_component = component
      this.s_level_restriction = level
      this.drawer_visible = true
      switch (component) {
        case 'KioskSecurityRestriction':
          this.drawer_title = this.$t('security.restriction')
          break
      }
    },
    handleClose() {
      this.drawer_visible = false
    },
    handleSecurityRestrictionEvent(name) {
      this.select_component = name
      switch (name) {
        case 'KioskSecurityRestriction':
          this.drawer_title = this.$t('security.restriction')
          break
      }
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskSecurityLevel">
        <div :class="$style.kioskSecurityTit">
          <p>{{ $t('kiosk.current_security_level') }}</p>
          <strong v-if="find_currentUser_level">{{
            find_currentUser_level.title
          }}</strong>
        </div>
        <div
          v-for="level in c_filter_level"
          :key="level.seq"
          :class="$style.kioskLevelList"
          class="kiosk-level-list"
        >
          <div>
            <div>
              <img
                v-if="currentUser.security_level === level.level"
                src="@assets/kiosk-img/icon-check-small.svg"
                alt="인증 완료"
              />
              <img
                v-else
                src="@assets/kiosk-img/icon-security-level.svg"
                alt="인증 전"
              />
              <div>
                <template v-for="(val, index) in level.condition_or">
                  <p v-if="index !== 0" :key="`or-${index}`" class="__or">or</p>
                  <div
                    :key="index"
                    :class="[
                      'condition-content',
                      { no: !val.length },
                      $style.conditionWrap,
                    ]"
                  >
                    <span
                      v-if="!val.length"
                      :class="$style.conditionTypeWrapNone"
                      >{{ $t('security.no') }}</span
                    >
                    <div
                      v-for="(or, or_idx) in val"
                      :key="or.seq"
                      :class="$style.conditionTypeWrap"
                    >
                      <span v-if="or_idx !== 0" class="__or">,</span>
                      <span
                        class="auth-btn"
                        @click="
                          routerGo(or.condition_type, or.certification_type_seq)
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
                    <div>
                      <span>{{ level.title }}</span>
                    </div>
                  </div>
                </template>
              </div>

              <div
                :class="$style.KioskSecurityRestrictionBtn"
                @click="handleClick('KioskSecurityRestriction', level.level)"
              >
                <span>{{ $t('security.restriction') }}</span>
                <img
                  src="@assets/kiosk-img/icon-security-restrictions.svg"
                  alt="제한 사항"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      :title="drawer_title"
      :visible.sync="drawer_visible"
      :direction="direction"
      :modal="false"
    >
      <component
        :is="select_component"
        v-if="drawer_visible"
        :s_level_restriction="s_level_restriction"
        @close_drawer="handleClose"
        @security_restriction_event="handleSecurityRestrictionEvent"
      ></component>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
