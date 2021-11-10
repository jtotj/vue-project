<script>
import { fetchWithdrawList, cancelWithdraw } from '@apis/withdraw'
import PageNavigation from '@components/modal-page-navigation'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  components: { PageNavigation },
  props: {
    withdraw_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      withdraw_list: [],
      open_withdraw_index: null,
      page: 1,
      total_count: 0,
      total_page: 0,
      page_navigation: {},
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
  },
  mounted() {
    this.loadWithdrawList()
  },
  methods: {
    date,
    fromPairs,

    async loadWithdrawList() {
      const ret_obj = await fetchWithdrawList({
        account_seq: this.withdraw_seq,
        page: this.page,
        list_count: 10,
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_list = ret_obj.data
      this.total_count = ret_obj.total_count
      this.total_page = ret_obj.total_page
      this.page_navigation = ret_obj.page_navigation
    },
    handleCancel(seq) {
      cancelWithdraw(seq)
        .then(() => {
          this.$toasted.info(this.$t('toasted_msg.cancel'))
          this.loadWithdrawList()
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleClick(p) {
      this.$router.push({
        name: 'Withdraw-Detail',
        query: {
          seq: p,
        },
      })
    },
    handlePageChange(data) {
      this.page = data
      this.loadWithdrawList()
    },
  },
}
</script>

<template>
  <div :class="[$style.accountWithdrawList]">
    <div :class="[$style.container]">
      <div :class="[$style.mainDeal]">
        <template v-if="withdraw_list.length !== 0">
          <ul :class="[$style.dealList]">
            <template v-for="(withdraw, index) in withdraw_list">
              <li
                :key="withdraw.seq"
                :class="[
                  $style['dealAct'],
                  { [$style.on]: open_withdraw_index === index },
                ]"
              >
                <div :class="[$style.leftInfo]">
                  <strong :class="[$style.tit]">{{
                    withdraw.asset_code
                  }}</strong>
                  <span
                    :class="[
                      {
                        [$style.pending]: withdraw.status === 'PENDING',
                        [$style.rejected]: withdraw.status === 'REJECTED',
                        [$style.approved]: withdraw.status === 'APPROVED',
                        [$style.cancel]: withdraw.status === 'CANCELED',
                      },
                      $style.badge,
                    ]"
                  >
                    {{ fromPairs(constants.withdraw.status)[withdraw.status] }}
                  </span>
                  <ul :class="[$style['shortList']]">
                    <li>
                      <span :class="[$style.accountText]">{{
                        $t('registration_date')
                      }}</span>
                      <span :class="[$style.accountRegdate]">
                        {{ date('Y-m-d H:i:s', new Date(withdraw.regdate)) }}
                      </span>
                    </li>
                    <li>
                      <span :class="[$style.accountText]">{{
                        $t('b2c_exchange.account_number')
                      }}</span>
                      <span :class="[$style.accountNumber]">
                        {{ withdraw.account_number }}
                      </span>
                    </li>
                  </ul>
                </div>
                <div :class="[$style.rightInfo]">
                  <strong :class="[$style.requestAmount]">{{
                    withdraw.request_amount | codeDecimal(withdraw.asset_code)
                  }}</strong>
                  <div :class="[$style.actWrap]">
                    <a
                      :class="([$style.lookUpLinks], [$style.links])"
                      @click="handleClick(withdraw.seq)"
                      >{{ $t('look_up') }}</a
                    >
                    <a
                      v-if="withdraw.status !== 'CANCELED'"
                      :class="([$style.cancelLinks], [$style.links])"
                      @click="handleCancel(withdraw.seq)"
                      >{{ $t('cancel') }}</a
                    >
                  </div>
                </div>

                <div
                  v-if="open_withdraw_index === index"
                  :class="[$style['accoContent']]"
                >
                  <ul :class="[$style['detailList']]">
                    <li>
                      <span>{{ $t('status') }}</span>
                      <strong
                        ><span>{{
                          fromPairs(constants.withdraw.status)[withdraw.status]
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('wallet_page.fee_type') }}</span>
                      <strong
                        ><span>{{
                          fromPairs(constants.asset.withdraw_fee.fee_type)[
                            withdraw.fee_type
                          ]
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('type_of_change_fee') }}</span>
                      <strong
                        ><span>{{
                          fromPairs(
                            constants.asset.withdraw_fee.fee_amount_type
                          )[withdraw.fee_amount_type]
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('change_fee') }}</span>
                      <strong
                        ><span>{{
                          withdraw.fee_amount | codeDecimal(withdraw.asset_code)
                        }}</span></strong
                      >
                    </li>
                    <li>
                      <span>{{ $t('wallet_page.net_amount') }}</span>
                      <strong
                        ><span>{{
                          withdraw.net_amount | codeDecimal(withdraw.asset_code)
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
              {{ $t('wallet_page.no_withdraw_list') }}
            </p>
          </div>
        </template>
      </div>
      <PageNavigation
        v-if="withdraw_list.length !== 0"
        :class="[$style.page_navigation]"
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
