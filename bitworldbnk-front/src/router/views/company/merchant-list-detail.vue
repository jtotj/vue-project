<script>
import { fetchMerchant } from '@apis/pg'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  page: {
    title: 'MerchantListDetail',
    meta: [{ name: 'description', content: 'MerchantListDetail' }],
  },
  data() {
    return {
      merchant: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.getMerchantInfo()
  },
  methods: {
    date,
    fromPairs,
    async getMerchantInfo() {
      const { merchant_info } = await fetchMerchant(
        this.$route.params.merchant_seq
      ).catch((e) => e.message)
      this.merchant = merchant_info
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('shop_detail.detail_info') }}</h2>
      </div>
      <div class="merchant-wrap">
        <div v-if="merchant">
          <div class="merchant-detail">
            <div class="row">
              <label>{{ $t('shop.shop_title') }}</label>
              <p>
                {{ merchant.merchant_name }}
              </p>
            </div>
            <div class="row">
              <label>{{ $t('shop.shop_id') }}</label>
              <p>
                {{ merchant.merchant_id }}
              </p>
            </div>
            <div class="row">
              <label>{{ $t('shop_detail.api_signature') }}</label>
              <p>
                {{ merchant.api_signature }}
              </p>
            </div>
            <div class="row">
              <label>{{ $t('shop.shop_state') }}</label>
              <p>
                {{ fromPairs(constants.pg.merchant.status)[merchant.status] }}
              </p>
            </div>
            <div class="row">
              <label>{{ $t('shop.shop_cre_date') }}</label>
              <p>
                {{ date('Y-m-d H:i:s', new Date(merchant.regdate)) }}
              </p>
            </div>
          </div>
          <div class="form-group btn-wrap">
            <router-link :to="{ name: 'shop' }" class="btn-grey">
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

<style lang="scss" module>
@import '@design';
</style>
