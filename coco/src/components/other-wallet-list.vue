<script>
import { fetchWithdrawList } from '@apis/withdraw'
import { fetchWithdrawAddressList } from '@apis/kyc'
import PageNavigation from '@components/modal-page-navigation'
import WithdrawInfo from '@components/withdraw-info'
import date from 'locutus/php/datetime/date'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  components: {
    PageNavigation,
    WithdrawInfo,
  },
  props: {
    asset_seq: {
      type: Number,
      default: 0,
    },
    account_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      withdraw_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},

      search_date_option: null,
      date_search: [],
      search_params: {},
      account_number: 0,
      transfer_info_modal: false,
      withdraw_seq: 0,

      withdraw_address: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('account', ['accounts']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    c_find_account_info() {
      if (!this.account_seq) return null
      return find(this.accounts, { seq: this.account_seq })
    },
  },
  mounted() {
    this.loadWithdrawList()
    this.loadAssetWithdrawAddress()
  },
  methods: {
    date,
    async loadWithdrawList() {
      const ret_obj = await fetchWithdrawList({
        ...this.search_params,
        account_seq: this.account_seq,
        page: this.page,
        list_count: 10,
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    async loadAssetWithdrawAddress() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        asset_seq: this.asset_seq,
      })
      this.withdraw_address = data
    },
    handlePageChange(data) {
      this.page = data
      this.loadWithdrawList()
    },
    handleClick(p) {
      this.transfer_info_modal = true
      this.withdraw_seq = p
    },
    pickerOptions() {
      const start = new Date()
      const end = new Date()
      this.show_date_picker = true
      switch (this.search_date_option) {
        case 'one':
          this.date_search = [start.setHours(0, 0, 0, 0), end.getTime()]
          break
        case 'week':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'three_month':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'six_month':
          start.setMonth(start.getMonth() - 6)
          this.date_search = [start.getTime(), end.getTime()]
          break
        case 'option':
          this.date_search = []
          break
        default:
          break
      }
      this.pickerDateChange()
    },
    pickerDateChange() {
      if (this.date_search && this.date_search.length) {
        this.search_params.regdate_start = this.date_search[0]
        this.search_params.regdate_end = this.date_search[1]
        this.loadWithdrawList()
      }
    },
  },
}
</script>

<template>
  <div :class="$style.popupWrap">
    <el-row>
      <div class="text-wrap">
        <div class="box-skyblue">
          <span class="marginR-10">{{
            $t('account_transfer.withdrawal_account_number')
          }}</span>
          <span class="color-common">
            {{ c_find_account_info.account_number }}
          </span>
        </div>
        <div class="description">
          <p>{{ $t('account_transfer.account_number_list_1') }}</p>
          <p>{{ $t('account_transfer.account_number_list_2') }}</p>
          <p v-html="$t('account_transfer.account_number_list_3_1')"></p>
        </div>
      </div>
      <el-row class="date-wrap" type="flex" justify="space-between">
        <el-radio-group
          v-model="search_date_option"
          class="transfer-radio-btn"
          @change="pickerOptions"
        >
          <el-radio-button label="one">{{
            $t('account_transfer.today')
          }}</el-radio-button>
          <el-radio-button label="week">{{
            $t('account_transfer.one_week')
          }}</el-radio-button>
          <el-radio-button label="month">{{
            $t('account_transfer.one_month')
          }}</el-radio-button>
          <el-radio-button label="three_month">{{
            $t('account_transfer.three_months')
          }}</el-radio-button>
          <el-radio-button label="six_month">{{
            $t('account_transfer.six_months')
          }}</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="date_search"
          type="daterange"
          align="right"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          class="transfer-date-picker"
          @change="pickerDateChange"
          @focus="search_date_option = null"
        ></el-date-picker>
      </el-row>
    </el-row>
    <template>
      <div v-if="withdraw_list.length" :class="[$style.reference]">
        <ul>
          <template v-for="list in withdraw_list">
            <li :key="list.seq" :class="[$style.referenceList]">
              <div :class="[$style.infoWrap]">
                <div :class="[$style.leftInfo]">
                  <div :class="[$style.accountInfo]">
                    <span :class="[$style.accountText]">
                      {{ $t('wallet_page.regdate') }}
                    </span>
                    <span :class="[$style.accountRegdate]">
                      {{ date('Y-m-d H:i:s', new Date(list.regdate)) }}
                    </span>
                  </div>
                </div>
                <div :class="[$style.rightInfo]">
                  <span :class="[$style.transferAmount]">
                    <span :class="[$style.accountText]">
                      {{ $t('transferred_assets') }}
                    </span>
                    {{ list.net_amount }}
                    {{ list.asset_code }}
                  </span>
                  <div :class="[$style.linkWrap]">
                    <a
                      :class="[$style.lookupLink]"
                      @click="handleClick(list.seq)"
                    >
                      {{ $t('look_up') }}
                    </a>
                  </div>
                </div>
                <div
                  v-for="withdraw in withdraw_address"
                  :key="withdraw.seq"
                  :class="[$style.accountContent]"
                >
                  <ul>
                    <li>
                      <span :class="[$style.accountText]">
                        {{ $t('recipient') }}
                      </span>
                      <span>{{ withdraw.user_name }}</span>
                    </li>
                    <li>
                      <span :class="[$style.accountText]">
                        {{ $t('recipient_wallet') }}
                      </span>
                      <span>{{ withdraw.withdraw_address }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <PageNavigation
          class="page-navigation"
          :total_count="total_count"
          :total_page="page_navigation.total_page"
          :cur_page="page"
          :page_count="page_navigation.page_count"
          @change="handlePageChange"
        ></PageNavigation>
      </div>

      <div v-else class="no-list">
        <div class="img-wrap">
          <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
        </div>
        <p>
          {{ $t('account_transfer.no_inquiry_history') }}
        </p>
      </div>
    </template>
    <el-dialog
      :title="$t('account_transfer.transfer_list_detail_tit')"
      :visible.sync="transfer_info_modal"
      width="50%"
      :append-to-body="true"
      class="transfer-info-modal"
    >
      <WithdrawInfo v-if="transfer_info_modal" :withdraw_seq="withdraw_seq" />
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-transfer-list.scss';
</style>

<style>
.date-wrap {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.transfer-radio-btn {
  width: 100%;
}
.transfer-radio-btn label {
  width: 20%;
}
.transfer-radio-btn label span {
  width: 100%;
  padding: 10px 0 !important;
}
.transfer-date-picker {
  width: 100% !important;
}

@media (max-width: 768px) {
  .transfer-radio-btn {
    width: 100%;
  }
  .transfer-date-picker {
    width: 100% !important;
  }
}
</style>
