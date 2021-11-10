<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'

import { fetchDirectMarkets } from '@apis/market'

export default {
  props: {
    step: {
      type: String,
      default: 'first',
    },
    select_type: {
      type: String,
      default: 'source',
    },
  },
  data() {
    return {
      swiper_wrpper: null,
      markets: [],
      select_asset: {
        source_asset: 0,
        target_asset: 0,
      },
      asset_type: this.select_type,
      alphabet: null,
      paging: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
      ],
    }
  },
  computed: {
    ...mapState('assets', ['assets']),

    c_active_markets() {
      return filter(this.markets, {
        is_active: 'Y',
      })
    },
    c_selectable_source_assets() {
      if (!this.select_asset.target_asset) {
        const assets = uniq(
          map(this.c_active_markets, ({ source_asset_seq }) =>
            find(this.assets, {
              seq: source_asset_seq,
            })
          ).filter(
            (asset) => !this.alphabet || asset.code.startsWith(this.alphabet)
          )
        )

        return assets
      }
      return uniq(
        map(
          filter(this.c_active_markets, {
            target_asset_seq: this.select_asset.target_asset,
          }),
          ({ source_asset_seq }) =>
            find(this.assets, {
              seq: source_asset_seq,
            })
        ).filter(
          (asset) =>
            !this.alphabet || asset.code.toLowerCase().startsWith(this.alphabet)
        )
      )
    },
    c_selectable_target_assets() {
      if (!this.select_asset.source_asset) {
        const assets = uniq(
          map(this.c_active_markets, ({ target_asset_seq }) =>
            find(this.assets, {
              seq: target_asset_seq,
            })
          ).filter(
            (asset) =>
              !this.alphabet ||
              asset.code.toLowerCase().startsWith(this.alphabet)
          )
        )
        return assets
      }
      return uniq(
        map(
          filter(this.c_active_markets, {
            source_asset_seq: this.select_asset.source_asset,
          }),
          ({ target_asset_seq }) =>
            find(this.assets, {
              seq: target_asset_seq,
            })
        ).filter(
          (asset) =>
            !this.alphabet || asset.code.toLowerCase().startsWith(this.alphabet)
        )
      )
    },
  },
  mounted() {
    this.init()
    this.swiper_wrpper = new Swiper('.paging-swiper', {
      slidesPerView: 11,
      slidesOffsetBefore: 81,
      slidesOffsetAfter: 81,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  methods: {
    init() {
      Promise.all([this.loadMarkets()]).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
    },

    async loadMarkets() {
      const { data } = await fetchDirectMarkets()

      this.markets = data
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
    handleSourceAsset(seq) {
      this.select_asset.source_asset = seq
      this.$emit('input', this.select_asset)
      this.alphabet = null
      this.asset_type = 'target'
    },
    handleTargetAsset(seq) {
      this.select_asset.target_asset = seq
      this.alphabet = null

      this.$emit('input', this.select_asset)
      this.$emit('next_step')
    },
    addAlphaBet(e) {
      if (e.target.innerText !== this.alphabet) {
        this.alphabet = e.target.innerText
      } else this.alphabet = null
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCoinList">
    <div :class="$style.container">
      <!-- 환전 정보 텍스트 -->
      <div
        v-if="step === 'first'"
        :class="$style.transferTxt"
        v-html="$t('kiosk.select_coin_to_exchange')"
      >
      </div>

      <!-- 코인 내역 -->
      <div :class="$style.coinBoxWrap">
        <ul v-if="asset_type === 'source'" :class="$style.coinBox">
          <li
            v-for="source_asset in c_selectable_source_assets"
            :key="source_asset.seq"
            @click="handleSourceAsset(source_asset.seq)"
          >
            <img :src="getAssetSrc(source_asset.code)" />
            <span :class="$style.coinTit">{{ source_asset.code }}</span>
          </li>
        </ul>
        <ul v-else :class="$style.coinBox">
          <li
            v-for="target_asset in c_selectable_target_assets"
            :key="target_asset.seq"
            @click="handleTargetAsset(target_asset.seq)"
          >
            <img :src="getAssetSrc(target_asset.code)" />
            <span :class="$style.coinTit">{{ target_asset.code }}</span>
          </li>
        </ul>
        <!-- //coin-box -->
      </div>
      <!-- //coin-box-wrap -->

      <!-- 코인 알파벳별 select 페이지 버튼 -->
      <div :class="$style.pageNavigation" class="kiosk-page-nav">
        <div class="swiper-container paging-swiper">
          <ul :class="$style.page" class="swiper-wrapper">
            <li
              v-for="data in paging"
              :key="data"
              :class="{ [$style.active]: data === alphabet }"
              class="swiper-slide paging-slide"
            >
              <span @click="addAlphaBet">{{ data }}</span>
            </li>
          </ul>
          <div
            :class="$style.pageBackBtn"
            class="swiper-button swiper-button-prev"
          >
            <img src="@assets/kiosk-img/back-icon-white.svg" alt="" />
          </div>
          <div
            :class="$style.pageNextBtn"
            class="swiper-button swiper-button-next"
          >
            <img src="@assets/kiosk-img/next-icon-white.svg" alt="" />
          </div>
        </div>
      </div>
      <!-- //pagenavigation -->
    </div>
    <!-- //container -->
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-coin-list.scss';
</style>
