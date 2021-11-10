<script>
import kioskReCoinList from '@components/kiosk-renewal/kiosk-re-coin-list.vue'
import KioskReDealList from '@components/kiosk-renewal/kiosk-re-deal-list.vue'
import { mapState } from 'vuex'
import Qrcode from 'qrcode.vue'

import find from 'lodash/find'
export default {
  components: {
    kioskReCoinList,
    KioskReDealList,
    Qrcode,
  },
  data() {
    return {
      drawer_select_asset: false,
      drawer_create_ad: false,
      direction: 'btt',
      select_asset: {
        source_asset: 0,
        target_asset: 0,
      },
      select_type: '',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    isSelectedAll() {
      return this.select_asset.source_asset && this.select_asset.target_asset
    },
    cs_source_asset() {
      return find(this.assets, { seq: this.select_asset.source_asset })
    },
    cs_target_asset() {
      return find(this.assets, { seq: this.select_asset.target_asset })
    },
  },
  methods: {
    handleSelectButton(type) {
      this.select_type = type
      this.drawer_select_asset = true
    },
    handleSelectedAsset(select_asset) {
      this.select_asset = select_asset
      this.drawer_select_asset = false
    },
    handleCreateAdButton() {
      this.drawer_create_ad = true
    },
  },
}
</script>
<template>
  <div class="bank-main-wrap">
    <div class="re-container">
      <!-- Asset select btns -->
      <div class="asset-select-box-wrap">
        <div class="asset-select-box">
          <p class="asset-select-title">{{ $t('kiosk_re.purchase') }}</p>
          <button
            class="asset-select-btn asset-select-source"
            :class="{ selected: cs_source_asset }"
            @click="handleSelectButton('source')"
          >
            <template v-if="!select_asset.source_asset">
              <img src="@assets/kiosk-re-img/icon_plus_blue.svg" alt="" />
              <span>{{ $t('kiosk_re.purchase_choice') }}</span>
            </template>
            <template v-else>
              <div class="asset_symbol" :class="cs_source_asset.code"></div>
              <span :class="{ 'selected-code': cs_source_asset }">{{
                cs_source_asset.code
              }}</span>
            </template>
          </button>
        </div>
        <div class="trade-asset-btn"
          ><img src="@assets/kiosk-re-img/icon_trade.svg" alt=""
        /></div>
        <div class="asset-select-box">
          <p class="asset-select-title">{{ $t('kiosk_re.payable') }}</p>
          <button
            class="asset-select-btn asset-select-target"
            :class="{ selected: cs_target_asset }"
            @click="handleSelectButton('target')"
          >
            <template v-if="!select_asset.target_asset">
              <img src="@assets/kiosk-re-img/icon_plus_green.svg" alt="" />
              <span>{{ $t('kiosk_re.payable_choice') }}</span>
            </template>
            <template v-else>
              <div class="asset_symbol" :class="cs_target_asset.code"></div>
              <span :class="{ 'selected-code': cs_target_asset }">{{
                cs_target_asset.code
              }}</span>
            </template>
          </button>
        </div>
      </div>
      <!-- Before select -->
      <template v-if="!isSelectedAll">
        <div class="illust">
          <img src="@assets/kiosk-re-img/bank-women.svg" alt="" />
        </div>
        <p class="asset-select-text" v-html="$t('kiosk_re.bank_txt_1')"> </p>
        <div style="display:flex;justify-content:center;margin-top:40px">
          <button
            style="width:40%;height:120px"
            class="asset-select-btn asset-select-source"
            @click="handleCreateAdButton('source')"
          >
            <span style="margin:0">{{ $t('kiosk_re.sale_regist') }}</span>
          </button>
        </div>
      </template>
      <!-- After select -->
      <template v-else>
        <KioskReDealList
          :select_asset="select_asset"
          :source_asset="cs_source_asset"
        ></KioskReDealList>
      </template>
    </div>
    <!-- Select asset drawer -->
    <div class="drawer-wrapper">
      <el-drawer
        :visible.sync="drawer_select_asset"
        :direction="direction"
        class="re-drawer re-select-drawer"
        :append-to-body="true"
      >
        <kioskReCoinList
          :select_type="select_type"
          @input="handleSelectedAsset"
        ></kioskReCoinList>
      </el-drawer>
    </div>
    <!-- 판매공시 등록하기 -->
    <div class="drawer-wrapper">
      <el-drawer
        :visible.sync="drawer_create_ad"
        :direction="direction"
        class="re-drawer kiosk-login re-login"
        :append-to-body="true"
      >
        <div style="text-align:center">
          <h4>{{ $t('kiosk_re.bank_drw_tit') }}</h4>
          <h3 v-html="$t('kiosk_re.login_title')"></h3>
          <p
            ><span>{{ $t('kiosk_re.bank_drw_txt_1') }}</span></p
          >
          <Qrcode
            value="https://cocobnk.com/create-ads/sell"
            :size="358"
            class="qrcode"
            background="transparent"
          ></Qrcode>
          <p class="bot-txt"
            ><span>{{ $t('kiosk_re.bank_drw_txt_2') }}</span></p
          >
        </div>
      </el-drawer>
    </div>
  </div>
</template>
<style scoped>
.bank-main-wrap {
  width: 1080px;
}
.re-container {
  width: 980px;
  margin: 0 auto;
}

/* asset select box */
.asset-select-box-wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}
.asset-select-box {
  width: 470px;
}

.asset-select-title {
  height: 46px;
  font-size: 32px;
  font-weight: 700;
  line-height: 46px;
  color: #383838;
  text-align: center;
}

.asset-select-btn {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 247px;
  margin-top: 10px;
  background-color: #fff;
  border: 3px dashed transparent;
  border-radius: 20px;
}
.asset-select-btn.asset-select-source {
  border-color: #0068c1;
}

.asset-select-btn.asset-select-target {
  border-color: #058e6e;
}

.asset-select-btn.selected {
  border: 3px solid #dedede;
}

.asset-select-btn span {
  margin-left: 20px;
  font-size: 32px;
  font-weight: 500;
  color: #363636;
}

.trade-asset-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: 28px;
  transform: translate(-50%, -50%);
}

/* illust & text */
.illust {
  display: flex;
  justify-content: center;
  margin-top: 341px;
}

.asset-select-text {
  margin-top: 60px;
  font-size: 36px;
  font-weight: 500;
  line-height: normal;
  color: #848484;
  text-align: center;
}

.asset_symbol {
  width: 80px;
  height: 80px;
  background-repeat: no-repeat;
  background-size: cover;
}

.asset-select-box .selected-code {
  font-size: 48px;
  font-weight: 700;
  color: #363636;
}
</style>
