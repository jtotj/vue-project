<script>
import { createMerchant, updateMerchant } from '@apis/pg'

export default {
  page: {
    title: 'PaymentMerchantCreate',
    meta: [{ name: 'description', content: 'PaymentMerchantCreate' }],
  },
  data() {
    return {
      merchant_name: this.$route.params.merchant_name || null,
      merchant_id: null,
    }
  },
  methods: {
    handleCreate() {
      createMerchant({
        merchant_name: this.merchant_name,
        merchant_id: this.merchant_id,
      })
        .then(() => {
          this.$toasted.success(this.$t('shop_detail.msg_shop_create'))
          this.$router.push({ name: 'shop' })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleUpdate() {
      updateMerchant({
        merchant_seq: this.$route.params.merchant_seq,
        merchant_name: this.merchant_name,
      })
        .then(() => {
          this.$toasted.success(this.$t('shop_detail.msg_shop_modify'))
          this.$router.push({ name: 'shop' })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 v-if="$route.name === 'merchant-create'" class="big-title">{{
          $t('merchant.create')
        }}</h2>
        <h2 v-else class="big-title">{{ $t('merchant.retouch') }}</h2>
      </div>
      <div :class="[$style.merchantCreate]">
        <form
          v-if="$route.name === 'merchant-create'"
          @submit.prevent="handleCreate"
        >
          <div :class="[$style.inputWrap]">
            <div class="form-group">
              <label>{{ $t('shop.shop_title') }}</label>
              <el-input
                v-model="merchant_name"
                class="payment-input"
                :placeholder="$t('shop.shop_title')"
              />
            </div>
            <div class="form-group">
              <label>{{ $t('shop.shop_id') }}</label>
              <el-input
                v-model="merchant_id"
                class="payment-input"
                :placeholder="$t('shop.shop_id')"
              />
            </div>
          </div>
          <div :class="[$style.btnWrap]">
            <button class="btn" type="submit">
              {{ $t('merchant.update') }}
            </button>
          </div>
        </form>
        <form v-else @submit.prevent="handleUpdate">
          <div :class="[$style.inputWrap]">
            <div class="form-group">
              <label>{{ $t('shop.shop_title') }}</label>
              <el-input
                v-model="merchant_name"
                class="payment-input"
                :placeholder="$t('shop.shop_title')"
              />
            </div>
          </div>
          <div :class="[$style.btnWrap]">
            <button class="btn" type="submit">
              {{ $t('merchant.retouch') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
