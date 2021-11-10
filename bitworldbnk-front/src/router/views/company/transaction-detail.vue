<script>
import { fetchMerchantTransactionList, fetchTransactionList } from '@apis/pg'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'

export default {
  page: {
    title: 'TransactionDetail',
    meta: [{ name: 'description', content: 'TransactionDetail' }],
  },
  data() {
    return {
      transaction_list: [],
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('account', ['accounts']),
    c_transaction_info() {
      return find(this.transaction_list, {
        seq: Number(this.$route.query.transaction_seq),
      })
    },
    c_transaction_pay_account() {
      return find(this.accounts, { seq: this.c_transaction_info.account_seq })
    },
  },
  mounted() {
    if (this.$route.query.merchant_seq) {
      this.loadMerchantTransactionList()
    } else {
      this.loadTransactionList()
    }
  },
  methods: {
    date,
    fromPairs,
    async loadMerchantTransactionList() {
      const { data } = await fetchMerchantTransactionList(
        Number(this.$route.query.merchant_seq)
      ).catch((e) => this.$toasted.error(e.message))
      this.transaction_list = data
    },
    async loadTransactionList() {
      const { data } = await fetchTransactionList().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.transaction_list = data
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <span class="big-title">
          {{ $t('transaction_detail.transaction_title') }}
        </span>
      </div>
      <div class="merchant-wrap">
        <div v-if="c_transaction_info">
          <div class="form-group">
            <label>{{ $t('transaction_detail.order_id') }}</label>

            <p>{{ c_transaction_info.order_id }} </p>
          </div>
          <div class="form-group">
            <label>{{ $t('dash.trade_name') }}</label>
            <p>
              {{ c_transaction_info.title }}
            </p>
          </div>
          <div class="form-group">
            <label>{{ $t('dash.trade_id') }}</label>
            <p>
              {{ c_transaction_info.transaction_id }}
            </p>
          </div>
          <div class="form-group">
            <label>{{ $t('dash.pay_person') }}</label>
            <p>
              {{ c_transaction_info.payer_name }}
            </p>
          </div>
          <div class="form-group">
            <label>{{ $t('dash.trade_amount') }}</label>
            <p>
              {{
                c_transaction_info.amount
                  | codeDecimal(c_transaction_info.asset_code)
              }}
              {{ c_transaction_info.asset_code }}</p
            >
          </div>
          <div class="form-group">
            <label>{{ $t('dash.transaction_type') }}</label>
            <p>
              {{
                fromPairs(constants.pg.transaction.transaction_type)[
                  c_transaction_info.transaction_type
                ]
              }}
            </p>
          </div>
          <template v-if="c_transaction_pay_account">
            <div class="form-group">
              <label>{{ $t('transaction_detail.pay_account_title') }}</label>

              <p>{{ c_transaction_pay_account.title }} </p>
            </div>
            <div class="form-group">
              <label>{{ $t('transaction_detail.pay_account_number') }}</label>

              <p>{{ c_transaction_pay_account.account_number }} </p>
            </div>
            <div class="form-group">
              <label>{{ $t('transaction_detail.pay_account_balance') }}</label>

              <p
                >{{
                  c_transaction_pay_account.balance
                    | codeDecimal(c_transaction_pay_account.asset_code)
                }}
                {{ c_transaction_pay_account.asset_code }}
              </p>
            </div>
          </template>

          <div class="form-group">
            <label>{{ $t('status') }}</label>

            <p>
              {{
                fromPairs(constants.pg.transaction.status)[
                  c_transaction_info.status
                ]
              }}
            </p>
          </div>
          <div class="form-group">
            <label>{{ $t('shop.shop_cre_date') }}</label>

            <p>
              {{ date('Y-m-d H:i:s', new Date(c_transaction_info.regdate)) }}
            </p>
          </div>

          <div class="btn-wrap">
            <router-link :to="{ name: 'transaction-list' }" class="btn-grey">
              <div class="long-arrow">
                <img src="@assets/img/longarrow-left-white.svg" alt="화살표" />
              </div>
              {{ $t('service_center.go_back') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
