<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import 'swiper/css/swiper.min.css'
import Swiper from 'swiper'

import { fetchPrivateMarkets } from '@apis/market'

export default {
  props: {
    select_type: {
      type: String,
      default: 'source',
    },
  },
  data() {
    return {
      loading: false,
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
      width: 50,
      // slidesOffsetBefore: 81,
      // slidesOffsetAfter: 81,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  },
  methods: {
    init() {
      Promise.all([(this.loading = true), this.loadMarkets()])
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        .finally(() => (this.loading = false))
    },

    async loadMarkets() {
      const { data } = await fetchPrivateMarkets()

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
      if (this.select_asset.source_asset === seq)
        return (this.select_asset.source_asset = 0)
      this.select_asset.source_asset = seq
      this.alphabet = null
      this.$emit('input', this.select_asset)
    },
    handleTargetAsset(seq) {
      if (this.select_asset.target_asset === seq)
        return (this.select_asset.target_asset = 0)
      this.select_asset.target_asset = seq
      this.alphabet = null
      this.$emit('input', this.select_asset)
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
  <div v-loading="loading" class="kiosk-re-coin-list">
    <div>
      <div class="re-drawer-container">
        <h4>{{
          select_type === 'source'
            ? $t('kiosk_re.purchase')
            : $t('kiosk_re.payable')
        }}</h4>
        <!-- source-market -->
        <template v-if="select_type === 'source'">
          <ul class="asset-list">
            <li
              v-for="source_asset in c_selectable_source_assets"
              :key="source_asset.seq"
              class="asset-item"
              :class="{
                'source-active': select_asset.source_asset === source_asset.seq,
              }"
              @click="handleSourceAsset(source_asset.seq)"
            >
              <a href="javascript:;">
                <div class="asset-symbol" :class="source_asset.code"></div>
                <p class="asset-code">{{ source_asset.code }}</p>
                <p class="asset-name">({{ source_asset.title }})</p>
              </a>
            </li>
          </ul>
        </template>
        <!-- target-market -->
        <template v-else>
          <ul class="asset-list">
            <li
              v-for="target_asset in c_selectable_target_assets"
              :key="target_asset.seq"
              class="asset-item"
              :class="{
                'target-active': select_asset.target_asset === target_asset.seq,
              }"
              @click="handleTargetAsset(target_asset.seq)"
            >
              <a href="javascript:;">
                <div class="asset-symbol" :class="target_asset.code"></div>
                <p class="asset-code">{{ target_asset.code }}</p>
                <p class="asset-name">({{ target_asset.title }})</p>
              </a>
            </li>
          </ul>
        </template>
      </div>
      <!-- //coin-box-wrap -->

      <!-- 코인 알파벳별 select 페이지 버튼 -->
      <div class="kiosk-page-nav">
        <div class="kiosk-page-inner">
          <div class="swiper-container paging-swiper">
            <ul class="swiper-wrapper">
              <li
                v-for="data in paging"
                :key="data"
                :class="{ active: data === alphabet }"
                class="swiper-slide paging-slide"
              >
                <span @click="addAlphaBet">{{ data }}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="swiper-button-wrap">
          <div class="swiper-button swiper-button-prev">
            <img src="@assets/kiosk-re-img/lang_left_btn.svg" alt="" />
          </div>
          <div class="swiper-button swiper-button-next">
            <img src="@assets/kiosk-re-img/lang_right_btn.svg" alt="" />
          </div>
        </div>
      </div>
      <!-- //pagenavigation -->
    </div>
    <!-- //container -->
  </div>
</template>
<style scoped>
.kiosk-re-coin-list .asset-list {
  display: flex;
  flex-wrap: wrap;
  width: 760px;
  margin: 0 auto;
}

.kiosk-re-coin-list .asset-item {
  box-sizing: border-box;
  width: 360px;
  height: 240px;
  margin-bottom: 40px;
  background-color: #f6f6f6;
  border: 4px solid transparent;
  border-radius: 30px;
}

.kiosk-re-coin-list .asset-item:nth-child(odd) {
  margin-right: 40px;
}

.kiosk-re-coin-list .asset-item.source-active {
  border-color: #0068c1;
}
.kiosk-re-coin-list .asset-item.target-active {
  border-color: #058e6e;
}

.kiosk-re-coin-list .asset-item a {
  width: 100%;
  height: 100%;
}

.kiosk-re-coin-list .asset-symbol {
  width: 76px;
  height: 76px;
  margin: 39px auto 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
}

.kiosk-re-coin-list .asset-code {
  font-size: 36px;
  font-weight: 700;
  color: #363636;
  text-align: center;
}

.kiosk-re-coin-list .asset-name {
  font-size: 26px;
  font-weight: 400;
  color: #8c8c8c;
  text-align: center;
}
</style>
