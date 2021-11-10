<script>
import { mapState } from 'vuex'
import { fetchAffiliateLog } from '@apis/affiliate'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'
import PageNavigation from '@components/modal-page-navigation'
import AffiliateNav from '@components/affiliate-nav'
import filter from 'lodash/filter'
import AffiliateSelector from '@components/affiliate-selector'

export default {
  page: {
    title: 'AffiliateLog',
    meta: [{ name: 'description', content: 'AffiliateLog' }],
  },
  components: {
    PageNavigation,
    AffiliateNav,
    AffiliateSelector,
  },
  data() {
    return {
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      affiliate_log: [],
      count_groups: null,
      loading: false,
      search_target_asset: 0,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['currentUser']),

    c_is_active_asset() {
      return filter(this.assets, { is_active: 'Y' })
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    date,
    fromPairs,
    init() {
      this.loading = true
      Promise.all([this.loadAffiliateLog()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadAffiliateLog() {
      const ret_obj = await fetchAffiliateLog({
        ...this.$route.query,
        list_count: 10,
        page: this.page,
      })

      this.count_groups = this.countByGroup(ret_obj.data, [
        'log_seq',
        'log_policy_seq',
        'log_beneficiary_seq',
      ])
      this.affiliate_log = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.loadAffiliateLog()
    },
    countByGroup(items, fields) {
      const count_groups = fromPairs(
        map(fields, (val) => [val, { counts: {}, first_indexes: [] }])
      )
      const cur_value = fromPairs(map(fields, (val) => [val, null]))

      items.forEach((item, idx) => {
        fields.forEach((field) => {
          if (cur_value[field] !== item[field]) {
            count_groups[field].first_indexes.push(idx)
            cur_value[field] = item[field]
          }

          const counts = count_groups[field].counts

          counts[item[field]] = counts[item[field]] || 0
          counts[item[field]]++
        })
      })

      return count_groups
    },
    selectTargetAsset(seq) {
      if (this.$route.query.asset_seq === seq) {
        this.$router.push({
          name: 'affiliate-log',
          query: Object.assign({}, this.$route.query, { asset_seq: undefined }),
        })
      } else if (this.$route.query !== undefined) {
        this.$router.push({
          name: 'affiliate-log',
          query: Object.assign({}, this.$route.query, { asset_seq: seq }),
        })
      } else {
        this.$router.push({
          name: 'affiliate-log',
          query: { asset_seq: seq },
        })
      }
    },
    selectTargetAffiliate(seq, type) {
      switch (type) {
        case 'causer_seq':
          if (this.$route.query.causer_seq === seq) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                causer_seq: undefined,
              }),
            })
          } else if (this.$route.query.asset_seq !== undefined) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                causer_seq: seq,
                beneficiary_member_seq: undefined,
                benefactor_member_seq: undefined,
              }),
            })
          } else {
            this.$router.push({
              name: 'affiliate-log',
              query: { causer_seq: seq },
            })
          }
          break

        case 'beneficiary_member_seq':
          if (this.$route.query.beneficiary_member_seq === seq) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                beneficiary_member_seq: undefined,
              }),
            })
          } else if (this.$route.query.asset_seq !== undefined) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                causer_seq: undefined,
                beneficiary_member_seq: seq,
                benefactor_member_seq: undefined,
              }),
            })
          } else {
            this.$router.push({
              name: 'affiliate-log',
              query: { beneficiary_member_seq: seq },
            })
          }
          break

        case 'benefactor_member_seq':
          if (this.$route.query.benefactor_member_seq === seq) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                benefactor_member_seq: undefined,
              }),
            })
          } else if (this.$route.query.asset_seq !== undefined) {
            this.$router.push({
              name: 'affiliate-log',
              query: Object.assign({}, this.$route.query, {
                causer_seq: undefined,
                beneficiary_member_seq: undefined,
                benefactor_member_seq: seq,
              }),
            })
          } else {
            this.$router.push({
              name: 'affiliate-log',
              query: { benefactor_member_seq: seq },
            })
          }
          break
      }
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('affiliate.affiliate_occur_list') }}
        </h2>
      </div>
      <div :class="[$style.affiliageLog]">
        <AffiliateNav></AffiliateNav>
        <div :class="$style.selectBox">
          <!-- 수당 발생 내역 -->
          <div :class="[$style.allowance]">
            <p :class="[$style.title]">
              {{ $t('affiliate.allowance_search') }}
            </p>
            <div :class="$style.userWrap">
              <ul>
                <li
                  :class="[
                    $style.user,
                    {
                      [$style.active]:
                        currentUser.seq === $route.query.causer_seq,
                    },
                  ]"
                  @click="selectTargetAffiliate(currentUser.seq, 'causer_seq')"
                >
                  {{ $t('affiliate.generator') }}</li
                >
                <li
                  :class="[
                    $style.user,
                    {
                      [$style.active]:
                        currentUser.seq === $route.query.beneficiary_member_seq,
                    },
                  ]"
                  @click="
                    selectTargetAffiliate(
                      currentUser.seq,
                      'beneficiary_member_seq'
                    )
                  "
                >
                  {{ $t('affiliate.beneficiary') }}</li
                >
                <li
                  :class="[
                    $style.user,
                    {
                      [$style.active]:
                        currentUser.seq === $route.query.benefactor_member_seq,
                    },
                  ]"
                  @click="
                    selectTargetAffiliate(
                      currentUser.seq,
                      'benefactor_member_seq'
                    )
                  "
                >
                  {{ $t('affiliate.benefactor') }}</li
                >
              </ul>
            </div>
          </div>
        </div>

        <div class="account-search">
          <!-- 자산별 검색 추가 -->
          <p :class="[$style.title]">
            {{ $t('affiliate.search_by_asset') }}
          </p>
          <AffiliateSelector v-model="search_target_asset"></AffiliateSelector>
        </div>
        <div v-loading="loading" :class="[$style.tableWrap]">
          <table>
            <thead>
              <tr>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.generator') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.behavior_type') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.number') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.date_of_occurrence') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.application_policy_name') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.beneficiary_type') }}
                </th>
                <th scope="col" rowspan="2">
                  {{ $t('affiliate.beneficiary') }}
                </th>
                <th scope="col" :class="[$style.division]">
                  {{ $t('affiliate.benefactor_type') }}
                </th>
                <th scope="col" :class="[$style.division]">
                  {{ $t('affiliate.target_amount') }}
                </th>
                <th scope="col" :class="[$style.division]">
                  {{ $t('affiliate.allowance_assets') }}
                </th>
              </tr>
              <tr>
                <th>
                  {{ $t('affiliate.benefactor') }}
                </th>
                <th>
                  {{ $t('affiliate.principal_amount') }}
                </th>
                <th>
                  {{ $t('affiliate.allowance_amount') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(affiliate, idx) in affiliate_log">
                <tr :key="`${affiliate.log_benefactor_seq}-1`">
                  <template
                    v-if="
                      count_groups.log_seq.first_indexes.indexOf(idx) !== -1
                    "
                  >
                    <td
                      :rowspan="
                        count_groups.log_seq.counts[affiliate.log_seq] * 2
                      "
                    >
                      {{ affiliate.causer_user_id }}
                    </td>
                    <td
                      :rowspan="
                        count_groups.log_seq.counts[affiliate.log_seq] * 2
                      "
                    >
                      {{
                        fromPairs(constants.affiliate.policy.target_action)[
                          affiliate.target_action
                        ]
                      }}
                    </td>
                    <td
                      :rowspan="
                        count_groups.log_seq.counts[affiliate.log_seq] * 2
                      "
                    >
                      {{ affiliate.target_seq }}
                    </td>
                    <td
                      :rowspan="
                        count_groups.log_seq.counts[affiliate.log_seq] * 2
                      "
                    >
                      {{ date('Y-m-d H:i:s', new Date(affiliate.regdate)) }}
                    </td>
                  </template>
                  <template
                    v-if="
                      count_groups.log_policy_seq.first_indexes.indexOf(idx) !==
                        -1
                    "
                  >
                    <td
                      :rowspan="
                        count_groups.log_policy_seq.counts[
                          affiliate.log_policy_seq
                        ] * 2
                      "
                    >
                      {{ affiliate.policy_title }}
                    </td>
                  </template>
                  <template
                    v-if="
                      count_groups.log_beneficiary_seq.first_indexes.indexOf(
                        idx
                      ) !== -1
                    "
                  >
                    <td
                      :rowspan="
                        count_groups.log_beneficiary_seq.counts[
                          affiliate.log_beneficiary_seq
                        ] * 2
                      "
                    >
                      {{
                        fromPairs(
                          constants.affiliate.policy_beneficiary
                            .beneficiary_type[affiliate.target_action]
                        )[affiliate.beneficiary_type]
                      }}
                    </td>
                    <td
                      :rowspan="
                        count_groups.log_beneficiary_seq.counts[
                          affiliate.log_beneficiary_seq
                        ] * 2
                      "
                    >
                      {{ affiliate.beneficiary_user_id }}
                    </td>
                  </template>
                  <td
                    :rowspan="
                      affiliate.benefactor_member_seq === -1 ? 2 : false
                    "
                  >
                    {{
                      fromPairs(
                        constants.affiliate.policy_benefactor.benefactor_type[
                          affiliate.target_action
                        ]
                      )[affiliate.benefactor_type]
                    }}
                  </td>
                  <td>
                    {{
                      fromPairs(
                        constants.affiliate.policy_benefactor
                          .base_amount_target[affiliate.target_action]
                      )[affiliate.base_amount_target]
                    }}
                  </td>
                  <td>
                    {{ affiliate.asset_title }}
                  </td>
                </tr>
                <tr :key="`${affiliate.log_benefactor_seq}-2`">
                  <td v-if="affiliate.benefactor_member_seq !== -1">
                    {{ affiliate.benefactor_user_id }}
                  </td>
                  <td class="nowrap text-right">
                    {{ affiliate.base_amount | trimDecimalZero | numberFormat }}
                  </td>
                  <td class="nowrap text-right">
                    {{ affiliate.amount | trimDecimalZero | numberFormat }}
                    <template
                      v-if="affiliate.base_amount_target !== '__FIXED__'"
                    >
                      ({{
                        affiliate.policy_amount
                          | trimDecimalZero
                          | numberFormat
                      }}%)
                    </template>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <div v-if="!affiliate_log.length" class="no-list">
            <div class="img-wrap">
              <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
            </div>
            <p>
              {{ $t('affiliate.no_affiliate_log') }}
            </p>
          </div>
        </div>
        <PageNavigation
          class="page-navigation"
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
          @change="handlePageChange"
        ></PageNavigation>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/affiliate.scss';
</style>
