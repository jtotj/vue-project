<script>
import '@assets/css/kiosk/kiosk-bank-use.css'
import { mapState } from 'vuex'

import find from 'lodash/find'
import KioskAssetSearch from '@components/kiosk/kiosk-asset-search'
import { createAccount } from '@apis/account'

export default {
  components: { KioskAssetSearch },
  data() {
    return {
      step: null,
      input: '',

      s_asset_seq: 0,
      favorite_assets: [],
      error_msg: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    c_s_asset_info() {
      if (!this.s_asset_seq) return null
      return find(this.assets, { seq: this.s_asset_seq })
    },
  },

  methods: {
    handleCreate() {
      createAccount({
        asset_seq: this.s_asset_seq,
        title: this.input,
      })
        .then(() => {
          this.input = null
          this.step = 'createComplete'
          // this.$emit('logout_event')
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .catch((e) => {
          this.error_msg = e.message
          this.step = 'fail'
        })
    },
  },
}
</script>

<template>
  <div :class="$style.termsOfAccount" class="kiosk-terms-of-account">
    <!-- openTerms -->
    <div
      v-if="step === null"
      :class="[$style.container, $style.terms, $style.openTerms]"
    >
      <h3 :class="$style.termsTitle">{{ $t('kiosk.terms_title1') }}</h3>
      <p :class="$style.text" v-html="$t('kiosk.terms_text1')"></p>
      <div :class="$style.noticeBox">
        <h4 :class="$style.bold">{{ $t('kiosk.terms_notice1') }}</h4>
        <p :class="$style.text" v-html="$t('kiosk.terms_notice1_txt')"> </p>
      </div>
      <h5 :class="$style.termsNotice" v-html="$t('kiosk.terms_notice2')"></h5>
      <div :class="$style.btnsWrap">
        <el-button
          class="normal-btn"
          @click="$emit('component_change', 'KioskCertified')"
          >{{ $t('kiosk.security_authentication') }}</el-button
        >
        <el-button
          class="normal-btn primary-btn"
          @click="step = 'clickedNew'"
          >{{ $t('kiosk.new_registration') }}</el-button
        >
      </div>
    </div>

    <!-- checkTerms -->
    <div
      v-else-if="step === 'clickedNew'"
      :class="[$style.container, $style.terms, $style.checkTerms]"
    >
      <h3 :class="$style.termsTitle">{{ $t('kiosk.terms_title2') }}</h3>
      <h4 :class="$style.bold">{{ $t('kiosk.terms_notice3') }}</h4>
      <p :class="$style.text">{{ $t('kiosk.terms_notice3_text1') }}</p>
      <p :class="$style.text">
        {{ $t('kiosk.terms_notice3_text2') }}
      </p>
      <p :class="$style.text" v-html="$t('kiosk.terms_notice3_text3')"></p>
      <div :class="$style.checkBox">
        <input id="checkAgree" type="checkbox" />
        <label for="checkAgree">
          <span :class="$style.checkText">{{
            $t('kiosk.terms_checkbox_text')
          }}</span>
        </label>
      </div>
      <div :class="$style.btnsWrap">
        <el-button class="normal-btn">{{ $t('kiosk.cancel') }}</el-button>
        <el-button class="normal-btn primary-btn" @click="step = 'checked'">{{
          $t('kiosk.new_registration')
        }}</el-button>
      </div>
    </div>

    <!-- InputAccount -->
    <div v-else-if="step === 'checked'" :class="[$style.assetContainer]">
      <KioskAssetSearch
        v-model="s_asset_seq"
        @close="step = 'input'"
      ></KioskAssetSearch>
    </div>
    <div
      v-else-if="step === 'input'"
      :class="[$style.container, $style.inputAssetInfo]"
    >
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{ $t('kiosk.account_name') }}</h3>
        <el-input v-model="input" :placeholder="$t('kiosk.account_name_txt')">
        </el-input>
      </div>
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{ $t('kiosk.selected_assets') }}</h3>
        <el-input :value="c_s_asset_info.code" :disabled="true"></el-input>
      </div>
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{
          $t('kiosk.account_unique_number')
        }}</h3>
        <el-input :value="$t('kiosk.auto_input')" :disabled="true"></el-input>
      </div>
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{ $t('kiosk.account_number') }}</h3>
        <el-input :value="$t('kiosk.auto_input')" :disabled="true"></el-input>
      </div>
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{ $t('kiosk.stop_amount') }}</h3>
        <el-input :value="$t('kiosk.auto_input')" :disabled="true"></el-input>
      </div>
      <div class="input-container">
        <h3 :class="$style.inputTitle">{{ $t('kiosk.state') }}</h3>
        <el-input :value="$t('kiosk.auto_input')" :disabled="true"></el-input>
      </div>
      <div :class="$style.btnsWrap">
        <el-button class="normal-whole-btn primary-btn" @click="handleCreate">{{
          $t('kiosk.opening')
        }}</el-button>
      </div>
    </div>
    <!-- createComplete -->
    <div
      v-else-if="step === 'createComplete'"
      :class="[$style.container, $style.createComplete]"
    >
      <div :class="$style.imgWrap">
        <img src="@assets/kiosk-img/icon-success.svg" alt="" />
      </div>
      <h3 :class="$style.completeTitle">{{
        $t('kiosk.application_success_txt')
      }}</h3>
      <div :class="$style.btnsWrap">
        <el-button
          class="normal-btn primary-btn"
          @click="
            $emit('close_drawer')
            $emit('logout_event')
          "
          >{{ $t('kiosk.confirm') }}</el-button
        >
      </div>
    </div>
    <div v-else>
      <div :class="[$style.container, $style.createComplete]">
        <div :class="$style.imgWrap">
          <img src="@assets/kiosk-img/icon-fail.svg" alt="" />
        </div>

        <h3 :class="$style.completeTitle">{{
          $t('kiosk.application_fail_text')
        }}</h3>
        <p>{{ error_msg }}</p>
        <div :class="$style.btnsWrap">
          <el-button class="normal-btn primary-btn" @click="step = null">{{
            $t('kiosk.previous')
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-terms-of-account.scss';
</style>
