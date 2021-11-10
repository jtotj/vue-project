<script>
import { fetchAccountTransfer } from '@apis/account'
import date from 'locutus/php/datetime/date'

export default {
  props: {
    transfer_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      transfer_info: null,
      loading: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    date,
    init() {
      this.loading = true
      Promise.all([this.getAccountTransfer()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async getAccountTransfer() {
      const { transfer_info } = await fetchAccountTransfer(this.transfer_seq)
      this.transfer_info = transfer_info
    },
  },
}
</script>

<template>
  <div v-loading="loading" class="main">
    <div v-if="transfer_info" class="account-transfer-info">
      <div class="form-group">
        <label>
          {{ $t('account_transfer.from_account_number') }}
        </label>
        <p>
          {{ transfer_info.from_account_number }}
        </p>
      </div>
      <div class="form-group">
        <label>
          {{ $t('account_transfer.from_asset_title') }}
        </label>
        <p>
          {{ transfer_info.asset_title }}
        </p>
      </div>
      <div class="form-group">
        <label>
          {{ $t('account_transfer.to_account_number') }}
        </label>
        <p>
          {{ transfer_info.to_account_number }}
        </p>
      </div>
      <div class="form-group">
        <label>
          {{ $t('account_transfer.to_account_user_name') }}
        </label>
        <p>
          {{ transfer_info.to_user_name }}
        </p>
      </div>
      <div class="form-group">
        <label>
          {{ $t('account_transfer.transfer_amount') }}
        </label>
        <p>
          {{ transfer_info.amount }}
        </p>
      </div>
      <div class="form-group">
        <label>{{ $t('account_transfer.description') }}</label>
        <p>
          {{ transfer_info.description }}
        </p>
      </div>
      <div class="form-group">
        <label>{{ $t('kyc.regdate') }}</label>
        <p>
          {{ date('Y-m-d H:i:s', new Date(transfer_info.regdate)) }}
        </p>
      </div>
    </div>
  </div>
</template>
