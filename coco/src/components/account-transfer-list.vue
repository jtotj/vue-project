<script>
import { fetchAccountTransferList } from '@apis/account'
import PageNavigation from '@components/modal-page-navigation'
import AccountTransferInfo from '@components/account-transfer-info'
import date from 'locutus/php/datetime/date'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  components: {
    PageNavigation,
    AccountTransferInfo,
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
      account_transfer_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},

      transfer_info_modal: false,
      transfer_seq: null,
      search_date_option: null,
      date_search: [],
      search_params: {},
      account_number: 0,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('account', ['accounts']),
    c_find_account_info() {
      if (!this.account_seq) return null
      return find(this.accounts, { seq: this.account_seq })
    },
  },
  mounted() {
    this.getAccountTransfers()
  },
  methods: {
    date,
    async getAccountTransfers() {
      const ret_obj = await fetchAccountTransferList({
        ...this.$route.query,
        list_count: 6,
        page: this.page,
        ...this.search_params,
        asset_seq: this.asset_seq,
        account_seq: this.account_seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.account_transfer_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.getAccountTransfers()
    },
    handleClick(p) {
      this.transfer_info_modal = true
      this.transfer_seq = p
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
        this.getAccountTransfers()
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
          <p v-html="$t('account_transfer.account_number_list_3')"></p>
        </div>
      </div>
      <div class="row date-wrap">
        <el-row type="flex" justify="space-between">
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
        </el-row>
        <el-row>
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
      </div>
    </el-row>

    <template>
      <div v-if="account_transfer_list.length" :class="[$style.reference]">
        <ul>
          <template v-for="list in account_transfer_list">
            <li :key="list.seq" :class="[$style.referenceList]">
              <div :class="[$style.infoWrap]">
                <div :class="[$style.leftInfo]">
                  <strong
                    v-if="list.from_member_seq === list.to_member_seq"
                    :class="[$style.title]"
                  >
                    {{ $t('account_transfer.my_account_transfer') }}
                    {{ list.asset_code }}
                  </strong>
                  <strong
                    v-else-if="list.from_member_seq === currentUser.seq"
                    :class="[$style.title]"
                  >
                    {{ $t('wallet_page.withdraw') }}
                    {{ list.asset_code }}
                  </strong>
                  <strong
                    v-else-if="list.to_member_seq === currentUser.seq"
                    :class="[$style.title]"
                  >
                    {{ $t('wallet_page.deposit') }}
                    {{ list.asset_code }}
                  </strong>
                  <div :class="[$style.accountInfo]">
                    <span :class="[$style.accountText]">
                      {{ $t('wallet_page.regdate') }}
                    </span>
                    <span :class="[$style.accountRegdate]">
                      {{ date('Y-m-d H:i:s', new Date(list.regdate)) }}
                    </span>
                  </div>
                  <div :class="[$style.accountInfo]">
                    <span :class="[$style.accountText]">
                      {{ $t('wallet_page.withdraw_bank_address') }}
                    </span>
                    <span :class="[$style.accountNumber]">{{
                      list.from_account_number
                    }}</span>
                  </div>
                </div>
                <div :class="[$style.rightInfo]">
                  <span :class="[$style.transferAmount]">
                    {{ list.amount | codeDecimal(list.asset_code) }}
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
              </div>
              <div :class="[$style.accountContent]">
                <ul>
                  <li>
                    <span :class="[$style.accountText]">
                      {{ $t('account_transfer.to_account_number') }}
                    </span>
                    <span>{{ list.to_account_number }}</span>
                  </li>
                  <li>
                    <span :class="[$style.accountText]">
                      {{ $t('account_transfer.to_account_user_name') }}
                    </span>
                    <span>{{ list.to_user_name }}</span>
                  </li>
                </ul>
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

    <!-- 이체 내역 상세 모달창-->
    <el-dialog
      :title="$t('account_transfer.transfer_list_detail_tit')"
      :visible.sync="transfer_info_modal"
      width="50%"
      :append-to-body="true"
      class="transfer-info-modal"
    >
      <AccountTransferInfo
        v-if="transfer_info_modal"
        :transfer_seq="transfer_seq"
      >
      </AccountTransferInfo>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-transfer-list.scss';
</style>

<style>
.available span {
  cursor: pointer;
}
.text-wrap .description {
  padding: 20px 0;
}
.date-wrap {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.transfer-radio-btn {
  width: 70%;
  margin-bottom: 10px;
}
.transfer-radio-btn label {
  width: 20%;
}
.transfer-radio-btn label span {
  width: 100%;
  padding: 10px 0 !important;
}
.transfer-date-picker {
  width: 70% !important;
}

@media (max-width: 700px) {
  .transfer-radio-btn {
    width: 100%;
  }
  .transfer-date-picker {
    width: 100% !important;
  }
}
</style>
