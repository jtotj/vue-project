<script>
import { fetchDirectTransfer } from '@apis/market'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'TransferDetail',
    meta: [{ name: 'description', content: 'TransferDetail' }],
  },
  data() {
    return {
      data: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.loadTransfer()
  },
  methods: {
    async loadTransfer() {
      this.loading = true
      const { transfer_info } = await fetchDirectTransfer(
        this.$route.query.seq
      ).catch((e) => this.$toasted.error(e.message))
      this.data = transfer_info
      this.loading = false
    },
    date,
    fromPairs,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <span class="big-title">
          {{ $t('private.transfer_list_detail') }}
        </span>
      </div>
      <div v-if="data" v-loading="loading" class="transfer-detail">
        <div class="form-group">
          <label>{{ $t('private.transfer_source_asset') }}</label>
          <p>
            {{ data.source_asset_title }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_target_asset') }}</label>
          <p>
            {{ data.target_asset_title }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_source_amount') }}</label>
          <p>
            {{ data.source_amount | codeDecimal(data.source_asset_code) }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_target_amount') }}</label>
          <p>
            {{ data.target_amount | codeDecimal(data.target_asset_code) }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_source_account_number') }}</label>
          <p>
            {{ data.source_account_number }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_target_account_number') }}</label>
          <p>
            {{ data.target_account_number }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_basic_rate') }}</label>
          <p>
            {{ data.basic_rate | codeDecimal(data.target_asset_code) }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_spread_rate') }}</label>
          <p>
            {{ data.spread_rate }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_exchange_rate') }}</label>
          <p>
            {{ data.exchange_rate | codeDecimal(data.target_asset_code) }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_detail_type') }}</label>
          <p>
            {{
              fromPairs(constants.market.direct_transfer.transfer_type)[
                data.transfer_type
              ]
            }}
          </p>
        </div>
        <div class="form-group">
          <label>{{ $t('private.transfer_regdate') }}</label>
          <p>
            {{ date('Y-m-d H:i:s', new Date(data.regdate)) }}
          </p>
        </div>

        <div class="btn-wrap">
          <router-link :to="{ name: 'transfer-list' }" class="btn-grey">
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
