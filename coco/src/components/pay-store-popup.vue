<script>
import { createMerchant, fetchMerchantList } from '@apis/pg'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dialog_visible: false,
      merchant_list: [],
      merchant: null,
      merchant_name: this.$route.params.merchant_name || null,
      merchant_id: null,
      store_choice: true,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  watch: {
    $route(to, from) {
      this.loadMerchantList()
    },
  },
  mounted() {
    this.loadMerchantList()
  },
  methods: {
    date,
    fromPairs,
    handleCreate() {
      createMerchant({
        merchant_name: this.merchant_name,
        merchant_id: this.merchant_id,
      })
        .then(() => {
          this.$toasted.success(this.$t('shop_detail.msg_shop_create'))
          this.loadMerchantList()
          this.store_choice = true
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    async loadMerchantList() {
      this.loading = true
      const ret_obj = await fetchMerchantList({
        ...this.$route.query,
        list_count: null,
      })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      this.merchant_list = ret_obj.data
    },
    can_click() {
      this.merchant_name = null
      this.merchant_id = null
    },
    visible() {
      this.dialog_visible = false
    },
  },
}
</script>

<template>
  <div class="store-modal-wrap">
    <div class="store-modal">
      <div v-if="store_choice" class="list-wrap">
        <div class="top">
          <h1>관리할 상점을 선택하세요.</h1>
          <button type="button" @click="$emit('visible')">
            <img src="@assets/img/pay-img/store-li-close.png" alt="" />
          </button>
        </div>
        <div class="line"></div>
        <PerfectScrollbar>
          <div class="bot">
            <div v-if="merchant_list.length" class="shop-list">
              <div class="inner-wrap">
                <router-link
                  v-for="merchant in merchant_list"
                  :key="merchant.seq"
                  :to="{ name: 'PayMain' }"
                >
                  <div class="shop-box">
                    <div class="shop-profile">
                      <h4 class="coin-name">{{ merchant.merchant_name }}</h4>
                      <p class="date">
                        {{ date('Y-m-d', new Date(merchant.regdate)) }}</p
                      >
                    </div>
                    <div class="line"></div>
                    <div class="shop-info">
                      <p class="shop-id">{{ merchant.merchant_id }}</p>
                      <p class="shop-state">{{
                        fromPairs(constants.pg.merchant.status)[merchant.status]
                      }}</p>
                    </div>
                  </div>
                </router-link>
                <router-link :to="{}" class="more-box">
                  <button
                    type="button"
                    class="more-btn"
                    @click="store_choice = false"
                  >
                    <img src="@assets/img/pay-img/store-li-more.png" alt="" />
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
      <div v-else class="enroll-wrap">
        <div class="top">
          <h1>상점 등록</h1>
        </div>
        <div class="line"></div>
        <PerfectScrollbar>
          <div class="bot">
            <form @submit.prevent="handleCreate">
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
              <div class="pop-btn-wrap">
                <div :class="[$style.btnWrap]" class="btn-pop">
                  <button class="btn" type="submit">
                    {{ $t('merchant.update') }}
                  </button>
                </div>
                <div
                  :class="[$style.btnWrap]"
                  class="btn-pop can"
                  @click="store_choice = true"
                >
                  <button class="btn" type="button" @click="can_click">
                    {{ $t('merchant.cancel') }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style>
.store-modal-el {
  width: 57% !important;
}

.store-modal-el .el-dialog__header {
  display: none;
}

.store-modal {
  box-sizing: border-box;
  padding: 25px 10px 10px;
}

.store-modal .top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.store-modal .top h1 {
  margin: 0;
  font-size: 26px;
}

.store-modal .top button {
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
}

.store-modal .line {
  width: 100%;
  height: 1px;
  margin: 18px 0 30px;
  background: #dadada;
}

.store-modal .bot {
  /* overflow-x: auto; */
  height: 388px;
}

.store-modal .shop-list {
  overflow: hidden;
}

.store-modal .shop-list a {
  box-sizing: border-box;
  float: left;
  width: 32%;
  padding: 20px;
  margin-bottom: 20px;
  background: #f7f7f7;
}

.store-modal .shop-list a:nth-child(3n-1) {
  margin: 0 2%;
}

.store-modal .shop-box .line {
  margin: 15px 0;
}

.store-modal .shop-box .shop-profile {
  overflow: hidden;
}

.store-modal .shop-box .shop-profile .coin-name {
  display: -webkit-box;
  width: 100%;
  padding-bottom: 0;
  margin-bottom: 5px;
  overflow: hidden;
  font-size: 22px;
  line-height: 1.5;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.store-modal .shop-box .shop-profile .date {
  font-size: 14px;
  color: #606061;
  vertical-align: bottom;
}

.store-modal .shop-box .shop-info {
  color: #606061;
}

.store-modal .shop-box p {
  cursor: pointer;
}

.store-modal .shop-list .more-box {
  box-sizing: border-box;
  display: flex;
  float: left;
  width: 32%;
  min-height: 184px;
  padding: 0;
  margin-bottom: 20px;
  text-align: center;
  background: #f7f7f7;
  border-radius: 0;
}

.store-modal .shop-list .more-box .more-btn {
  width: 100%;
  background: none;
}

.store-modal .shop-list .more-box .more-btn img {
  max-width: 50px;
}

.store-modal .enroll-wrap .bot {
  height: auto;
}

.store-modal .enroll-wrap label {
  margin-bottom: 7px;
  color: #222;
}

.store-modal .enroll-wrap .pop-btn-wrap {
  text-align: right;
}

.store-modal .enroll-wrap .btn-pop {
  display: inline-block;
}

.store-modal .enroll-wrap .btn-pop .btn {
  padding: 10px 35px;
  margin-left: 10px;
  font-weight: 400;
  border-radius: 0;
}

.store-modal .enroll-wrap .btn-pop.can .btn {
  background: #aaa;
}

.dim {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

@media (max-width: 1024px) {
  .store-modal-el {
    width: 90% !important;
  }

  .store-modal .top h1 {
    font-size: 20px;
  }

  .store-modal .shop-list a {
    width: 100%;
  }

  .store-modal .shop-list a:nth-child(3n-1) {
    margin: 0 0 20px 0;
  }

  .store-modal .shop-list .more-box {
    width: 100%;
  }
}
</style>
