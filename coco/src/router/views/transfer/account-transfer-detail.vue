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
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('account_transfer.transfer_list_detail_tit') }}</h2
        >
      </div>
      <div v-if="transfer_info" class="account-transfer-detail">
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.from_account_number') }}
          </label>
          <p>
            {{ transfer_info.from_account_number }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.from_asset_title') }}
          </label>
          <p>
            {{ transfer_info.asset_title }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.to_account_number') }}
          </label>
          <p>
            {{ transfer_info.to_account_number }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.to_account_user_name') }}
          </label>
          <p>
            {{ transfer_info.to_user_name }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.transfer_amount') }}
          </label>
          <p>
            {{ transfer_info.amount }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('account_transfer.description') }}
          </label>
          <p>
            {{ transfer_info.description }}
          </p>
        </div>
        <div class="row">
          <label class="color-grey">
            {{ $t('kyc.regdate') }}
          </label>
          <p>
            {{ date('Y-m-d H:i:s', new Date(transfer_info.regdate)) }}
          </p>
        </div>
        <div class="btn-wrap">
          <router-link class="btn-grey" :to="{ name: 'account-transfer' }">
            <div class="long-arrow">
              <img src="@assets/img/longarrow-left-white.svg" alt="화살표" />
            </div>
            {{ $t('service_center.go_back') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
