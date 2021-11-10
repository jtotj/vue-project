<script>
import { mapState } from 'vuex'
import Decimal from 'decimal.js'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import fromPairs from 'lodash/fromPairs'
import each from 'lodash/each'
import filter from 'lodash/filter'
import { fetchTransactionList } from '@apis/pg'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: 'Dashboard' }],
  },
  data() {
    return {
      provideFeedbackModal: false,
      feedback_radio: 1,
      feedback_textarea: '',
      transaction: [],
      search_keyword: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_asset_balance() {
      const asset_seqs = uniq(map(this.accounts, (val) => val.asset_seq))
      return fromPairs(
        map(asset_seqs, (asset_seq) => {
          let oTotalSum = new Decimal(0)

          each(
            filter(this.accounts, {
              asset_seq,
            }),
            ({ balance, holding_balance }) => {
              var available_balance = new Decimal(balance).minus(
                holding_balance
              )
              oTotalSum = oTotalSum.plus(available_balance)
            }
          )

          return [asset_seq, oTotalSum.toString()]
        })
      )
    },
    c_ccf_balance() {
      let oTotalSum = new Decimal(0)
      each(
        filter(this.accounts, {
          asset_code: 'CCF',
        }),
        ({ balance, holding_balance }) => {
          var available_balance = new Decimal(balance).minus(holding_balance)
          oTotalSum = oTotalSum.plus(available_balance)
        }
      )
      return oTotalSum.toString()
    },
    c_active_asset() {
      return filter(this.assets, { is_active: 'Y' }).filter(
        (asset_info) =>
          !this.search_keyword ||
          asset_info.code
            .toLowerCase()
            .includes(this.search_keyword.toLowerCase()) ||
          asset_info.title.includes(this.search_keyword)
      )
    },
  },
  mounted() {
    this.loadTransactionList()
  },
  methods: {
    fromPairs,
    date,
    async loadTransactionList() {
      const { data } = await fetchTransactionList().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.transaction = data
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('pay_head_foot.account_summary_views') }}
        </h2>
      </div>
      <div :class="[$style.dashboard]">
        <div :class="[$style.assetWrap]">
          <div :class="[$style.fundsWrap]">
            <div :class="[$style.subtTitleWrap]">
              <h3 :class="[$style.subTitle]">
                {{ $t('pay_head_foot.fund') }}
              </h3>
              <div :class="[$style.moreView]">
                <router-link :to="{ name: 'money' }">
                  {{ $t('dash.more') }}
                  <span :class="[$style.imgWrap]">
                    <img src="@assets/img/arrow-right.png" alt="화살표" />
                  </span>
                </router-link>
              </div>
            </div>
          </div>
          <h2 :class="[$style.ccf]">
            <p :class="[$style.explanation]">
              <i class="fas fa-exclamation-circle"></i>
              {{ $t('business.calculate_late') }}
            </p>
            {{ c_ccf_balance | codeDecimal('CCF') }}
            CCF
          </h2>
          <div :class="[$style.assetSearch]">
            <el-input
              v-model="search_keyword"
              :class="[$style.searchInput]"
              prefix-icon="el-icon-search"
              :placeholder="$t('wallet_page.asset_title')"
            />
          </div>
          <PerfectScrollbar :class="[$style.perfectScrollbar]">
            <ul>
              <li
                v-for="asset in c_active_asset"
                :key="asset.seq"
                :class="[$style.assetList]"
              >
                <span :class="`coin-item ${asset.code}`"></span>
                <div :class="[$style.assetInfo]">
                  <p :class="[$style.title]">
                    {{ asset.title }}
                  </p>
                  <p :class="[$style.money]">
                    <span :class="[$style.assetAmount]">
                      {{ c_asset_balance[asset.seq] | codeDecimal(asset.code) }}
                    </span>
                    <span :class="[$style.assetCode]">
                      {{ asset.code }}
                    </span>
                  </p>
                </div>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
        <!-- 최근 활동내역 -->
        <div :class="[$style.recentActivityWrap]">
          <div :class="[$style.subtTitleWrap]">
            <h3 :class="[$style.subTitle]">
              {{ $t('dash.latest_act') }}
            </h3>
            <div :class="[$style.moreView]">
              <router-link
                :to="{
                  name: 'merchant-transaction-list',
                }"
                >{{ $t('dash.show_all') }}
                <span :class="[$style.imgWrap]">
                  <img src="@assets/img/arrow-right.png" alt="화살표" />
                </span>
              </router-link>
            </div>
          </div>
          <div v-if="0" class="box-middle">
            <router-link :to="{ name: 'transactions' }">{{
              $t('dash.received')
            }}</router-link>
            <router-link :to="{ name: 'transactions' }">{{
              $t('dash.send')
            }}</router-link>
            <router-link :to="{ name: 'transactions' }">{{
              $t('dash.act_record')
            }}</router-link>
          </div>
          <ul>
            <li
              v-for="data in transaction.slice(0, 5)"
              :key="data.seq"
              :class="[$style.recentActivityList]"
            >
              <span :class="[$style.text]">
                {{ $t('dash.pay_person') }}
              </span>
              <span>{{ data.payer_name }}</span>
              <p>{{
                fromPairs(constants.pg.transaction.status)[data.status]
              }}</p>
              <p>
                <span :class="[$style.text]">등록일</span>
                {{ date('Y-m-d H:i:s', new Date(data.regdate)) }}
              </p>
              <p
                >{{ data.amount | codeDecimal(data.asset_code) }}
                {{ data.asset_code }}</p
              >
            </li>
          </ul>
        </div>
        <!-- 인보이스 -->
        <div v-if="0" class="invoice">
          <div class="box-top overflow-hidden">
            <h3 class="sub-title">{{ $t('dash.quotes') }}</h3>
            <div :class="[$style.moreView]">
              <router-link :to="{ name: 'manage' }">
                {{ $t('dash.more') }}
                <div :class="[$style.imgWrap]">
                  <img src="@assets/img/arrow-right.png" alt="화살표" />
                </div>
              </router-link>
            </div>
          </div>
          <div class="box-bottom">
            <p class="explanation">{{ $t('dash.last_6_months') }}</p>
            <div class="sky-box-wrap border-b">
              <div class="sky-box overflow-hidden">
                <span class="f-left">{{ $t('dash.un_paid_invocie') }}</span>
                <span class="f-right">1</span>
              </div>
              <div class="box-bottom">
                <router-link :to="{ name: 'business-invoice-create' }">{{
                  $t('dash.manage_invoice')
                }}</router-link>
                <span class="circle"></span>
                <router-link :to="{ name: 'manage' }">{{
                  $t('dash.manage_invoice')
                }}</router-link>
              </div>
            </div>
            <div class="sky-box-wrap">
              <div class="sky-box">
                <span>{{ $t('dash.grown_up') }}</span>
              </div>
              <div class="box-bottom">
                <a href="#" class="mainColor">{{ $t('dash.make_quotes') }}</a>
              </div>
            </div>
          </div>
        </div>
        <!-- 미결제 인보이스 -->
        <div v-if="0" class="outstanding-invoices">
          <div class="box-top overflow-hidden">
            <h3 class="sub-title">{{ $t('dash.quotes_1') }}</h3>
            <p class="explanation">{{ $t('dash.quotes_2') }}</p>
          </div>
          <div class="box-bottom overflow-hidden">
            <router-link :to="{ name: 'manage' }">{{
              $t('dash.quotes_alarm')
            }}</router-link>
            <el-collapse accordion>
              <el-collapse-item>
                <template slot="title">{{ $t('dash.quotes_detail') }}</template>
                <p>Nov 4, 2019</p>
                <p>{{ $t('dash.quotes_who') }}</p>
                <p>$2,000,00 USD</p>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <!-- 피드백 제공 -->
        <div v-if="0" class="feedback">
          <div class="box-left">
            <h3 class="sub-title">{{ $t('dash.tell_us') }}</h3>
            <p>{{ $t('dash.feed_text') }}</p>
          </div>
          <div class="btn-wrap">
            <input
              type="button"
              class="btn"
              :value="$t('dash.service')"
              @click="provideFeedbackModal = true"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      v-if="0"
      :title="$t('dash.feed_text_back')"
      :visible.sync="provideFeedbackModal"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
      class="provide-feedback-modal"
    >
      <el-radio-group v-model="feedback_radio">
        <el-radio :label="1">1 (Not helpfull)</el-radio>
        <el-radio :label="2">2</el-radio>
        <el-radio :label="3">3</el-radio>
        <el-radio :label="4">4</el-radio>
        <el-radio :label="5">5 (Very helpful)</el-radio>
      </el-radio-group>
      <el-input
        v-model="feedback_textarea"
        type="textarea"
        maxlength="1000"
        show-word-limit
        :placeholder="$t('dash.feed_placeholder')"
      >
      </el-input>
      <p>
        {{ $t('dash.feed_p') }}
        <router-link :to="{ name: 'privacy' }">{{
          $t('dash.feed_protect')
        }}</router-link>
        {{ $t('dash.feed_or') }}
        <router-link :to="{ name: 'legal' }">{{
          $t('dash.feed_law')
        }}</router-link>
        {{ $t('dash.feed_need') }}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="provideFeedbackModal = false"
          >SUBMIT</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/dashboard.scss';
</style>
