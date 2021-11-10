<script>
import { fetchWithdrawAddress } from '@apis/kyc'
import { mapState } from 'vuex'
import find from 'lodash/find'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'KycWithdrawDetail',
    meta: [{ name: 'description', content: 'KycWithdrawDetail' }],
  },
  data() {
    return {
      info: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('assets', ['assets']),
    c_info_asset() {
      return find(this.assets, { seq: this.info.asset_seq })
    },
  },
  mounted() {
    this.loadWithdrawAddressInfo()
  },
  methods: {
    fromPairs,
    date,
    async loadWithdrawAddressInfo() {
      const { certification_info } = await fetchWithdrawAddress(
        this.$route.params.seq
      ).catch((e) => this.$toasted.error(e.message))
      this.info = certification_info
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('list_detail') }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <div v-if="info" class="create-body">
          <div class="offer-details limitation-section">
            <div class="offer-extra-fields">
              <div class="form-group">
                <label>{{ $t('wallet_page.asset_title') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="c_info_asset.title"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.holder_name') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.holder_name || 'No data'"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.bank_name') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      fromPairs(
                        constants.kyc.asset_withdraw_address_certification
                          .bank_codes
                      )[info.bank_code] || 'No data'
                    "
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('wallet_page.withdraw_bank_address') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="info.withdraw_address || 'No data'"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('kyc.regdate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.regdate))"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('status') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="
                      fromPairs(
                        constants.kyc.asset_withdraw_address_certification
                          .status
                      )[info.status] +
                        (info.is_valid !== null ? $t('allow') : $t('disallow'))
                    "
                  />
                </div>
              </div>

              <div v-if="info.expdate" class="form-group">
                <label>{{ $t('my_page.expdate') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.expdate))"
                  />
                </div>
              </div>
              <div v-if="info.closed_date" class="form-group">
                <label>{{ $t('private.closed_date') }}</label>
                <div class="form-wrap">
                  <input
                    class="text-label"
                    readonly
                    :value="date('Y-m-d H:i:s', new Date(info.closed_date))"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group big-btn">
          <a
            :to="{ name: 'bank-kyc-list' }"
            class="btn-default btn-save-offer"
            @click="$router.go(-1)"
          >
            <i class="fa fa-chevron-left"></i> {{ $t('back') }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
