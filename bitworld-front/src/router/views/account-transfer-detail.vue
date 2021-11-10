<script>
import { fetchAccountTransfer } from '@apis/account'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'AccountTransferDetail',
    meta: [{ name: 'description', content: 'AccountTransferDetail' }],
  },
  data() {
    return {
      transfer_info: null,
    }
  },
  mounted() {
    this.getAccountTransfer()
  },
  methods: {
    date,
    async getAccountTransfer() {
      const { transfer_info } = await fetchAccountTransfer(
        this.$route.params.transfer_seq
      ).catch((e) => this.$toasted.error(e.message))
      this.transfer_info = transfer_info
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{
          $t('account_transfer.transfer_list_detail_tit')
        }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <div v-if="transfer_info">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>
                  {{ $t('account_transfer.from_account_number') }}
                </label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.from_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>
                  {{ $t('account_transfer.from_asset_title') }}
                </label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.asset_title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>
                  {{ $t('account_transfer.to_account_number') }}
                </label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.to_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('account_transfer.to_account_user_name') }}</label>

                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.to_user_name"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('account_transfer.transfer_amount') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.amount"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('account_transfer.description') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="transfer_info.description"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('kyc.regdate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      date('Y-m-d H:i:s', new Date(transfer_info.regdate))
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
