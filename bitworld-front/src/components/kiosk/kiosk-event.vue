<script>
import '@assets/css/kiosk/kiosk-withdrawal.css'
import moment from 'moment'

export default {
  data() {
    return {
      assets: [
        { code: 'CCF' },
        { code: 'BTC' },
        { code: 'ETH' },
        { code: 'DASH' },
        { code: 'LTC' },
        { code: 'CRO' },
        { code: 'XRP' },
      ],
      s_asset: null,
      interval_id: null,
      touch_check: 0,
    }
  },
  mounted() {
    this.checkTimer()
  },
  methods: {
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    handleSelectAsset(code) {
      if (this.s_asset === code) return (this.s_asset = null)
      this.s_asset = code
    },
    checkTimer() {
      this.interval_id = setInterval(() => {
        this.touch_check = this.touch_check + 1
        if (this.touch_check === 60) {
          this.$emit('close_drawer')
          this.touch_check = 0
        }
      }, 1000)
    },
    handleSubmit() {
      if (!this.s_asset)
        return this.$toasted.error(this.$t('kiosk.select_assets_txt'), {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      var amount = null
      switch (this.s_asset) {
        case 'CCF':
          amount = '434.7826087CCF'
          break
        case 'BTC':
          amount = '0.00011BTC'
          break
        case 'ETH':
          amount = '0.00163ETH'
          break
        case 'DASH':
          amount = '0.02DASH'
          break
        case 'LTC':
          amount = '0.022LTC'
          break
        case 'XRP':
          amount = '3.84XRP'
          break
        case 'CRO':
          amount = '33.63CRO'
          break
      }
      const message = {
        KIND: 'THM TEMPLET PRINT',
        FROM: 'BROWSER',
        TO: 'THERMAL',
        'CALL BACK FUNC': '',
        DATA: {
          'TEMPLET FILE': 'EVENT.THM',
          'THM DATA': {
            'PRODUCT ID': '아메리카노',
            ASSET_CODE: amount,
            'TOT PRICE': amount,
            DATETIME: moment().format('YYYYMMDDHHmmss'),
          },
        },
      }
      try {
        window.ipcRenderer.send('receiptPrint', message)
        this.$toasted.success('이벤트에 참여되셨습니다.', {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
        this.$emit('close_drawer')
      } catch (e) {
        this.$toasted.error(e, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      }
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCoinList">
    <div :class="$style.container">
      <!-- 환전 정보 텍스트 -->
      <div :class="$style.transferTxt">
        <strong>좋아하는 코인을 한 가지 선택</strong
        ><span>하시면 무료 음료 쿠폰이 발행됩니다.</span>
      </div>

      <!-- 코인 내역 -->
      <div :class="$style.coinBoxWrap">
        <ul :class="$style.coinBox">
          <li
            v-for="asset in assets"
            :key="asset.code"
            :class="{ [$style.active]: s_asset === asset.code }"
            @click="handleSelectAsset(asset.code)"
          >
            <img :src="getAssetSrc(asset.code)" />
            <span :class="$style.coinTit">{{ asset.code }}</span>
          </li>
        </ul>

        <!-- //coin-box -->
      </div>
      <!-- //coin-box-wrap -->
      <div :class="$style.eventBtnWrap" class="kiosk-select-box">
        <el-button class="buy-btn" @click="handleSubmit">{{
          $t('verify')
        }}</el-button>
      </div>
    </div>
    <!-- //container -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-coin-list.scss';

.coinBox {
  li {
    background: #fff;
    .coinTit {
      color: #29304d;
    }
  }
  li.active {
    background-image: linear-gradient(225deg, #478ecc, #2b74b9 0%);
    .coinTit {
      color: #fff;
    }
  }
}
.eventBtnWrap {
  position: fixed;
  bottom: 60px;
  left: 60px;
  width: calc(100% - 60px);
  padding-right: 60px;
}
</style>
