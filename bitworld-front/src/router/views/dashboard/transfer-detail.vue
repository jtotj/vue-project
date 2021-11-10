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
      const { transfer_info } = await fetchDirectTransfer(
        this.$route.query.seq
      ).catch((e) => this.$toasted.error(e.message))
      this.data = transfer_info
    },
    date,
    fromPairs,
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('private.transfer_list_detail') }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <div v-if="data">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>{{ $t('private.transfer_source_asset') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="data.source_asset_title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_target_asset') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="data.target_asset_title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_source_amount') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      data.source_amount | codeDecimal(data.source_asset_code)
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>
                  {{ $t('private.transfer_target_amount') }}
                </label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      data.target_amount | codeDecimal(data.target_asset_code)
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{
                  $t('private.transfer_source_account_number')
                }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="data.source_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{
                  $t('private.transfer_target_account_number')
                }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="data.target_account_number"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_basic_rate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      data.basic_rate | codeDecimal(data.target_asset_code)
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_spread_rate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="data.spread_rate"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_exchange_rate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      data.exchange_rate | codeDecimal(data.target_asset_code)
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_detail_type') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      fromPairs(constants.market.direct_transfer.transfer_type)[
                        data.transfer_type
                      ]
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('private.transfer_regdate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(data.regdate))"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="form-group big-btn">
            <router-link
              :to="{ name: 'transfer-list' }"
              class="btn-default btn-save-offer"
            >
              <i class="fa fa-chevron-left"></i> {{ $t('back') }}</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
