<script>
import { mapState, mapGetters } from 'vuex'

import {
  fetchLevels,
  fetchLevelConditions,
  fetchRestrictions,
  fetchRestrictionTargets,
} from '@apis/security'

import map from 'lodash/map'
import each from 'lodash/each'
import find from 'lodash/find'
import fromPairs from 'lodash/fromPairs'
import store from '@state/store'

export default {
  name: 'KioskSecurityRestriction',
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
  props: {
    s_level_restriction: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      levels: null,
      restriction_list: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapGetters('auth', ['loggedIn']),
    ...mapState('auth', ['currentUser']),

    ...mapState('assets', ['assets']),
    find_currentUser_level() {
      return find(this.levels, { level: this.currentUser.security_level })
    },
    c_filter_restriction() {
      const restrictions = []
      each(this.levels, (data) => {
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
      Promise.all([this.loadLevels(), this.loadRestriction()])
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
  <div :class="$style.kioskCertifiedRestriction" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskSecurityLevel">
        <div :class="$style.kioskSecurityTit">
          <p>{{ $t('kiosk.current_security_level') }}</p>
          <strong v-if="find_currentUser_level">{{
            find_currentUser_level.title
          }}</strong>
        </div>

        <PerfectScrollbar :class="[$style.perfectScrollbar]">
          <div v-for="(level, idx) in levels" :key="level.seq">
            <div v-if="level.level === s_level_restriction">
              <div
                v-if="c_filter_restriction.length"
                :class="$style.kioskSecurityContent"
              >
                <template
                  v-if="c_filter_restriction[idx].restriction_info.length"
                >
                  <p
                    v-for="info in c_filter_restriction[idx].restriction_info"
                    :key="info.seq"
                  >
                    {{
                      fromPairs(constants.security.restriction.target_type)[
                        info.target_type
                      ]
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
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified-restriction.scss';
</style>

<style scoped>
.kiosk .ps {
  height: 1200px;
}
</style>
