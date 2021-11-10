<script>
import { mapState } from 'vuex'
import find from 'lodash/find'
import { createAccount } from '@apis/account'

export default {
  data() {
    return {
      step: 'first',
      result_seq: 0,
      is_agree: false,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    c_s_asset_info() {
      if (!this.$route.params.asset_code) return
      return find(this.assets, { code: this.$route.params.asset_code })
    },
    c_result_account_info() {
      if (!this.result_seq) return
      return find(this.accounts, { seq: this.result_seq })
    },
  },
  methods: {
    handleStepFirst() {
      this.step = 'first'
    },
    handleStepSecond() {
      this.step = 'second'
    },
    handleStepThird() {
      createAccount({
        asset_seq: this.c_s_asset_info.seq,
      })
        .then(({ seq }) => {
          this.result_seq = seq
          this.$store.dispatch('account/getAccounts')
          this.step = 'third'
        })

        .catch((e) => {
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        })
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-re-img/icon_' +
          code.toLowerCase() +
          '.svg')
      } catch (e) {
        return default_img
      }
    },
  },
}
</script>

<template>
  <div class="new-acc-wrap">
    <div v-if="step === 'first'" class="first-step">
      <div class="tit">
        <h4>{{ $t('kiosk_re.new_acc_tit_1') }}</h4>
        <p>{{ $t('kiosk_re.new_acc_tit_2') }}</p>
      </div>
      <div class="txt-wrap">
        <h4>{{ $t('kiosk_re.new_acc_txt_1') }}</h4>
        <p v-html="$t('kiosk.terms_text1')"></p>
        <p class="notice" v-html="$t('kiosk.terms_notice1')"></p>
        <p v-html="$t('kiosk.terms_notice1_txt')"></p>
        <p class="color-blue">{{ $t('kiosk_re.new_acc_txt_2') }}</p>
      </div>
      <div class="bot-btn-wrap">
        <a
          class="btn-prev bot-btn"
          href="javascript:;"
          @click="$router.go(-1)"
          >{{ $t('before') }}</a
        >
        <div class="btn-next bot-btn" @click="handleStepSecond">{{
          $t('next')
        }}</div>
      </div>
    </div>
    <div v-if="step === 'second'" class="second-step">
      <div class="tit">
        <h4>{{ $t('kiosk_re.new_acc_tit_1') }}</h4>
        <p>{{ $t('kiosk_re.new_acc_tit_2') }}</p>
      </div>
      <div class="txt-wrap">
        <h4>{{ $t('kiosk.terms_title2', [c_s_asset_info.code]) }}</h4>
        <p class="notice" v-html="$t('kiosk.terms_notice3')"></p>
        <p>{{ $t('kiosk_re.new_acc_txt_3', [c_s_asset_info.code]) }}</p>
        <p>{{ $t('kiosk_re.new_acc_txt_4', [c_s_asset_info.code]) }}</p>
        <div class="agree">
          <input id="agree-box" v-model="is_agree" type="checkbox" />
          <label for="agree-box">{{ $t('kiosk.terms_checkbox_text') }}</label>
        </div>
      </div>
      <div class="bot-btn-wrap">
        <a
          class="btn-prev bot-btn"
          href="javascript:;"
          @click="handleStepFirst"
          >{{ $t('before') }}</a
        >
        <button
          class="btn-next bot-btn"
          :disabled="!is_agree"
          @click="handleStepThird"
          >{{ $t('kiosk_re.new_acc_btn_agr') }}</button
        >
      </div>
    </div>
    <div v-if="step === 'third'" class="thrid-step">
      <div class="com-wrap">
        <img src="@assets/kiosk-re-img/icon_ok.svg" alt="" />
        <h4>{{ $t('kiosk_re.new_acc_txt_5') }}</h4>
        <p>{{ $t('kiosk_re.new_acc_txt_6') }}</p>
      </div>
      <div class="account-wrap">
        <div class="row">
          <h4>{{ $t('asset') }}</h4>
          <div class="right">
            <span class="symbol-icon"></span>
            <img :src="getAssetSrc(c_result_account_info.asset_code)" alt="" />
            <p>{{ c_result_account_info.asset_code }}</p>
          </div>
        </div>
        <div class="row">
          <h4>{{ $t('affiliate.account_number') }}</h4>
          <div class="right">
            <p>{{ c_result_account_info.account_number }}</p>
          </div>
        </div>
      </div>
      <div class="bot-btn-wrap">
        <button class="btn-next bot-btn" @click="$router.go(-1)">
          {{ $t('success') }}
        </button>
      </div>
    </div>
  </div>
</template>
