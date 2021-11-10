<script>
import { fetchMerchant } from '@apis/pg'
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'

export default {
  name: 'ShopInfo',
  page: {
    title: 'ShopInfo',
    meta: [
      {
        name: 'description',
        content: 'ShopInfo',
      },
    ],
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
  <div>
    <div class="pay-container shopinfo">
      <!-- <div class="warning-box">
        <div class="top">
          <img src="@assets/img/pay-img/img-warning.png" alt="" />
        </div>
        <div class="line"></div>
        <div class="bot">
          <p v-html="$t('cocopay.shop_notice_1')"></p>
          <div class="txt">
            <p>{{ $t('cocopay.shop_notice_2') }}</p>
            <p>{{ $t('cocopay.shop_notice_3') }}</p>
            <p>{{ $t('cocopay.shop_notice_4') }}</p>
          </div>
        </div>
      </div> -->
      <div class="info-wrap">
        <div class="tit">
          <h4>{{ $t('basic_info') }}</h4>
          <!-- <div class="btn-wrap">
            <button type="button">{{ $t('cocopay.payment_related') }}</button>
            <button type="button" class="btn-change">{{
              $t('cocopay.change_info')
            }}</button>
          </div> -->
        </div>
        <div class="info-form-wrap">
          <div class="form-wrap">
            <div class="form-row">
              <div class="left">
                <p>{{ $t('shop.shop_id') }}</p>
                <div class="input-wrap">
                  <input type="text" />
                  <p>
                    {{ merchant.merchant_name }}
                  </p>
                </div>
              </div>
              <div class="right">
                <p>{{ $t('shop.shop_title') }}</p>
                <div class="input-wrap">
                  <input type="text" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="left">
                <p>{{ $t('shop.shop_state') }}</p>
                <div class="input-wrap">
                  <input type="text" />
                </div>
              </div>
              <div class="right">
                <p>{{ $t('shop.shop_cre_date') }}</p>
                <div class="input-wrap">
                  <input type="text" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="full left">
                <p>{{ $t('shop_detail.api_signature') }}</p>
                <div class="input-wrap">
                  <input type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
