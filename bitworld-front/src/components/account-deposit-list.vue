<script>
import { fetchDepositList, cancelDeposit } from '@apis/deposit'
import PageNavigation from '@components/modal-page-navigation'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  components: { PageNavigation },
  props: {
    deposit_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      deposit_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
      open_deposit_index: null,
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
  },
  mounted() {
    this.loadDepositList()
  },
  methods: {
    date,
    fromPairs,

    async loadDepositList() {
      const ret_obj = await fetchDepositList({
        account_seq: this.deposit_seq,
        page: this.page,
        list_count: 5,
      }).catch((e) => this.$toasted.error(e.message))
      this.deposit_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleCancel(seq) {
      cancelDeposit(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadDepositList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleClick(p) {
      this.$router.push({
        name: 'Deposit-Detail',
        query: {
          seq: p,
        },
      })
    },
    handlePageChange(data) {
      this.page = data
      this.loadDepositList()
    },
  },
}
</script>

<template>
  <div :class="[$style.accountDepositList]">
    <div :class="[$style.container]">
      <div :class="[$style.mainDeal]">
        <template v-if="deposit_list.length !== 0">
          <ul :class="[$style.dealList]">
            <template v-for="(deposit, index) in deposit_list">
              <li
                :key="deposit.seq"
                :class="[
                  $style['dealAct'],
                  { [$style.on]: open_deposit_index === index },
                ]"
              >
                <div :class="$style['leftInfo']">
                  <strong :class="$style['tit']">{{
                    deposit.asset_title
                  }}</strong>
                  <span
                    :class="[
                      {
                        [$style.pending]: deposit.status === 'PENDING',
                        [$style.rejected]: deposit.status === 'REJECTED',
                        [$style.approved]: deposit.status === 'APPROVED',
                        [$style.cancel]: deposit.status === 'CANCELED',
                      },
                      $style.badge,
                    ]"
                  >
                    {{ fromPairs(constants.deposit.status)[deposit.status] }}
                  </span>
                  <ul :class="$style['shortList']">
                    <li>
                      <span :class="[$style.accountText]">{{
                        $t('registration_date')
                      }}</span>
                      <span :class="[$style.accountRegdate]">
                        {{ date('Y-m-d H:i:s', new Date(deposit.regdate)) }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.accountText]">{{
                        $t('b2c_exchange.account_number')
                      }}</span>
                      <span :class="[$style.accountNumber]">
                        {{ deposit.account_number }}
                      </span>
                    </li>
                  </ul>
                </div>
                <div :class="[$style.rightInfo]">
                  <strong :class="$style['requestAmount']">{{
                    deposit.request_amount | codeDecimal(deposit.asset_code)
                  }}</strong>
                  <div :class="[$style.actWrap]">
                    <a
                      :class="([$style.lookUpLinks], [$style.links])"
                      @click="handleClick(deposit.seq)"
                      >{{ $t('look_up') }}</a
                    >
                    <a
                      v-if="deposit.status === 'PENDING'"
                      :class="([$style.cancelLinks], [$style.links])"
                      @click="handleCancel(deposit.seq)"
                      >{{ $t('cancel') }}</a
                    >
                  </div>
                </div>
                <div
                  v-if="open_deposit_index === index"
                  :class="$style['accoContent']"
                >
                  <ul :class="$style['detailList']">
                    <li>
                      <span>{{ $t('status') }}</span>
                      <strong
                        ><span>{{
                          fromPairs(constants.deposit.status)[deposit.status]
                        }}</span></strong
                      >
                    </li>
                  </ul>
                </div>
              </li>
            </template>
          </ul>
        </template>
        <template v-else>
          <div :class="[$style.noDealList]">
            <div :class="[$style.imgWrap]">
              <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
            </div>
            <p :class="[$style.textWrap]">
              {{ $t('wallet_page.no_deposit_list') }}
            </p>
          </div>
        </template>
      </div>
      <PageNavigation
        v-if="deposit_list.length !== 0"
        :total_count="total_count"
        :total_page="page_navigation.total_page"
        :cur_page="page"
        :page_count="page_navigation.page_count"
        @change="handlePageChange"
      ></PageNavigation>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/modal.scss';
</style>
