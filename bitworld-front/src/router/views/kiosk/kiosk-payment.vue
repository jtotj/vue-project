<script>
import {
  fetchMerchant,
  authenticateTransaction,
  approveTransaction,
} from '@apis/pg'
import URI from 'urijs'
import { mapState, mapGetters } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import jwt from 'jsonwebtoken'
import KioskLogin from '@components/kiosk/kiosk-login'
import moment from 'moment'
import Qrcode from 'qrcode.vue'

export default {
  page: {
    title: 'KioskPayment',
    meta: [{ name: 'description', content: 'KioskPayment' }],
  },
  components: {
    KioskLogin,
    Qrcode,
  },
  data() {
    return {
      token: null,
      merchant: null,
      s_account_seq: 0,
      message: {
        KIND: 'WINDOWATTRIBUTE',
        FROM: 'BROWSER',
        TO: 'KIOSK',
        DATA: { COMMAND: 'SHOW' },
      },
      xptx_auth_code: null,
      drawer_visible: false,
      loading: false,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapGetters('auth', ['loggedIn']),
    c_s_asset_info() {
      if (!this.token) return null

      return find(this.assets, { code: this.token.tx.asset_code })
    },
    c_pay_available_accounts() {
      if (!this.token) return []
      return filter(this.accounts, { asset_code: this.token.tx.asset_code })
    },
  },
  watch: {
    xptx_auth_code() {
      if (this.xptx_auth_code && !this.loading) this.handleSubmit()
    },
  },
  beforeDestroy() {
    if (window.ipcRenderer) window.ipcRenderer.removeAllListeners('barcode')
  },
  mounted() {
    Promise.all([this.tokenDecode(), this.getMerchantInfo()]).catch((e) =>
      this.$toasted.error(e.message)
    )
    if (window.ipcRenderer) {
      window.ipcRenderer.on('barcode', (event, res) => {
        this.xptx_auth_code = res
      })
    }

    this.$emit('payment_count', 300)
  },
  methods: {
    tokenDecode() {
      this.token = this.$jwt.decode(this.$route.query.token)
    },
    async getMerchantInfo() {
      const { merchant_info } = await fetchMerchant(
        this.$route.query.merchant_id
      ).catch((e) => e.message)
      this.merchant = merchant_info
    },
    async handleSubmit() {
      this.loading = true
      let ret_obj = null
      try {
        ret_obj = await authenticateTransaction({
          ...this.$route.query,
          xptx_auth_code: this.xptx_auth_code,
        })
        await this.handleApprove(ret_obj)
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
        this.loading = false
      }
    },
    async handleApprove(data) {
      const obj = {
        info: {
          nonce: data.nonce,
          amount: this.token.tx.amount,
          asset_code: this.token.tx.asset_code,
        },
      }
      const token = jwt.sign(
        obj,
        'HRrQCM3I.v8wo88m6IjeuVePEBc3bieue9LERICPU~_-M462-_~OCr1N0mF1kNXE'
      )
      let result = null
      try {
        result = await approveTransaction({
          merchant_id: this.merchant.merchant_id,
          token: token,
        })
        this.$store.dispatch('account/getAccounts')
        const message = {
          KIND: 'BIT PAY',
          FROM: 'BROWSER',
          TO: 'BITPAY',
          DATA: {
            CODE: '1',
            MSG: '정상처리 되었습니다',
            PRICE: this.$route.query.price,
            'TRANSACTION ID': result.transaction_id,
            'TRANSACTION DATETIME': moment().format('YYYYMMDDHHmmss'),
            'ASSET CODE': this.token.tx.asset_code,
            Remark1: this.token.tx.amount,
            BarcodeNo: this.xptx_auth_code,
          },
        }
        window.ipcRenderer.send('receiptPrint', message)
        window.ipcRenderer.send('hide')
        this.$emit('payment_count', 60)
        location.href = new URI(this.$route.query.return_url)
      } catch (e) {
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      const message = {
        KIND: 'BIT PAY',
        FROM: 'BROWSER',
        TO: 'BITPAY',
        DATA: {
          CODE: '0',
          MSG: '결제가 취소되었습니다.',
        },
      }
      window.ipcRenderer.send('receiptPrint', message)
      this.$router.push({ name: 'kiosk-home' })
      this.$emit('payment_count', 60)
      window.ipcRenderer.send('hide')
      window.ipcRenderer.send('receiptPrint', this.message)
    },
    getAssetSrc(code) {
      var default_img = null
      try {
        return require('@assets/kiosk-img/coin-' + code + '.svg')
      } catch (e) {
        return default_img
      }
    },
  },
}
</script>

<template>
  <div class="payment-wrap">
    <form class="payment-form">
      <div class="row">
        <h3 class="payment-title">{{ $t('kiosk.make_pay') }}</h3>
        <ul v-if="token" class="payment-list-box-1">
          <li class="payment-name-box">
            <span class="payment-name">
              {{ $t('kiosk.product_name') }}
            </span>
            <span class="payment-item">
              {{ token.tx.title }}
            </span>
          </li>
          <li class="payment-amount-box">
            <span>
              {{ $t('kiosk.amount_payment') }}
            </span>
            <span class="payment-amount">
              {{ token.tx.amount }}{{ token.tx.asset_code }}
            </span>
          </li>
        </ul>
      </div>
      <div class="row guide-wrap">
        <p
          class="guide-text"
          v-html="$t('kiosk.may_pay_guide_txt', { os: 'Android' })"
        ></p>
        <div class="guide-image-wrap">
          <div class="guide-image-inner">
            <img
              class="guide-image"
              src="@assets/kiosk-img/guide-wrap-bg.png"
              alt=""
            />
            <button
              class="install-link-btn"
              @click.prevent="drawer_visible = false"
            >
              <img src="@assets/kiosk-img/qr-android-install-w.png" alt="" />
            </button>
            <p class="install-qr-text">
              {{ $t('kiosk.app_download_qr_scan') }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="0" class="row">
        <template v-if="0">
          <h3 class="payment-title">계좌목록</h3>
          <ul class="payment-list-box-2">
            <PerfectScrollbar class="perfectScrollbar">
              <li
                v-for="account in c_pay_available_accounts"
                :key="account.seq"
                :class="{ active: s_account_seq === account.seq }"
                @click="s_account_seq = account.seq"
              >
                <div>
                  <span class="payment-icon"
                    ><img :src="getAssetSrc(account.asset_code)" />
                  </span>
                  <span class="payment-list-account-box">
                    <span class="payment-list-title">{{
                      account.title || $t('kiosk.no_account_alias')
                    }}</span>
                    <span class="payment-list-account">{{
                      account.account_number
                    }}</span>
                  </span>
                </div>
                <div>
                  <span class="payment-list-amount">
                    {{ account.balance }}
                  </span>
                  <span v-if="0">
                    <button class="exchange-btn">환전</button>
                  </span>
                </div>
              </li>
            </PerfectScrollbar>
          </ul>
        </template>
        <h3 class="payment-title">결제 링크</h3>
        <Qrcode
          v-if="c_s_asset_info"
          :value="`https://cocobnk.com/pg-xptx?asset_seq=${c_s_asset_info.seq}`"
          :size="400"
          class="qr-code"
          background="transparent"
        ></Qrcode>
        <p>
          단말에서 발급받은 QR코드를
          <br />
          키오스크 바코드 리더기에 읽혀주세요
        </p>
      </div>
      <div class="row">
        <button v-if="0" class="payment-btn" @click.prevent="handleSubmit"
          >결제</button
        >
        <button class="cancel-btn" @click.prevent="handleCancel">{{
          $t('cancel')
        }}</button>
      </div>
    </form>
    <div class="drawer-wrapper">
      <el-drawer
        title=""
        :visible.sync="drawer_visible"
        direction="btt"
        :append-to-body="true"
      >
        <div class="qr-drawer-wrap">
          <p
            class="qr-drawer-title"
            v-html="$t('kiosk.app_install_txt', { os: 'Android' })"
          ></p>
          <div class="qr-drawer-qr">
            <img src="@assets/kiosk-img/qr-android-install.png" alt="" />
          </div>
          <div class="qr-drawer-text">
            <p v-html="$t('kiosk.app_install_sub_txt')"></p>
            <p class="qr-drawer-subtext">{{
              $t('kiosk.app_install_sub_txt2')
            }}</p>
          </div>
        </div>
      </el-drawer>
    </div>
    <div v-if="0" class="drawer-wrapper">
      <el-drawer
        title=""
        :visible.sync="drawer_visible"
        direction="btt"
        :append-to-body="true"
      >
        <KioskLogin v-if="drawer_visible"></KioskLogin>
      </el-drawer>
    </div>
  </div>
</template>

<style scoped>
/* kiosk payment */
.payment-wrap {
  padding: 0 60px;
}
.payment-wrap .qr-code {
  margin-bottom: 60px;
  text-align: center;
}
.payment-wrap p {
  margin-bottom: 60px;
  font-size: 40px;
  font-weight: 500;
  line-height: normal;
  color: rgba(41, 48, 77, 0.5);
  text-align: center;
  letter-spacing: normal;
}

/* payment title */
.payment-wrap .payment-title {
  padding: 60px 0;
  font-size: 40px;
  font-weight: 900;
  color: #29304d;
}

/* payment list box */
.payment-wrap .payment-list-box-1 {
  padding: 0 40px;
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 30px;
}
.payment-wrap .payment-list-box-2 {
  margin-bottom: 40px;
  background-color: #fff;
  border-radius: 30px;
}

.payment-wrap .payment-list-box-2 li.active {
  color: #0068c1;
  background-color: #f4f9ff;
  border-bottom: 1px solid #0068c1;
}

/* payment list box 1 */
.payment-wrap .payment-list-box-1 li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 160px;
}
.payment-wrap .payment-list-box-1 .payment-name-box {
  border-bottom: 1px solid #c4c4c4;
}
.payment-wrap .payment-list-box-1 .payment-name-box .payment-name,
.payment-wrap .payment-list-box-1 .payment-name-box .payment-item {
  font-size: 40px;
  font-weight: 500;
  line-height: 1;
  color: #29304d;
  letter-spacing: -0.4px;
}
.payment-wrap .payment-list-box-1 .payment-amount-box {
  font-size: 40px;
  font-weight: 500;
  color: #458ccb;
}

/* payment list box 2 */
.payment-wrap .payment-list-box-2 .perfectScrollbar {
  height: 750px;
}
.payment-wrap .payment-list-box-2 li {
  display: flex;
  justify-content: space-between;
  height: 149px;
  padding: 0 40px;
  border-bottom: 1px solid #dee1ef;
}
.payment-wrap .payment-list-box-2 li > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-wrap .payment-list-box-2 .payment-list-title {
  font-size: 40px;
  color: #29304d;
}
.payment-wrap .payment-list-box-2 .payment-list-account {
  font-size: 26px;
  font-weight: 500;
  color: #1b2b53;
}
.payment-wrap .payment-list-box-2 .payment-list-amount {
  font-size: 35px;
  font-weight: bold;
  color: #000;
}
.payment-wrap .payment-list-box-2 .payment-list-account-box {
  display: flex;
  flex-direction: column;
}
.payment-wrap .payment-list-box-2 .payment-list-amount,
.payment-wrap .payment-list-box-2 .payment-icon {
  margin-right: 20px;
}

/* payment btn */
.exchange-btn {
  width: 110px;
  height: 60px;
  padding: 10px 29.7px 9px 28.3px;
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  letter-spacing: -0.32px;
  background-image: linear-gradient(to bottom, #478ecc, #2b74b9);
  border-radius: 10px;
}
.payment-btn,
.cancel-btn {
  width: 960px;
  height: 120px;
  font-size: 45px;
  font-weight: bold;
  color: #29304d;

  /* background-image: linear-gradient(to bottom, #478ecc, #2b74b9); */
  background-color: #f5f5f5;
  border-radius: 30px;
}
.payment-btn {
  margin-bottom: 20px;
}

/* Guide section */
.payment-wrap .guide-wrap {
  margin-top: 80px;
}

.payment-wrap .guide-wrap > p {
  font-size: 40px;
  font-weight: 500;
  line-height: 1.5;
  color: #29304d;
  letter-spacing: -1.2px;
}

.payment-wrap .guide-image-wrap {
  height: 715px;
  margin-bottom: 53px;
}

.payment-wrap .guide-image-inner {
  position: relative;
  height: 100%;
}

.payment-wrap .guide-image-wrap .guide-image {
  position: absolute;
  top: 0;
  left: 137px;
}

.payment-wrap .install-link-btn {
  position: absolute;
  bottom: 107px;
  left: 77px;
  display: flex;
  align-items: center;
  padding: 30px;
  background-image: linear-gradient(to top, #478ecc, #2b74b9);
  border-radius: 30px;
}

.payment-wrap .install-link-btn p {
  margin: 0 0 0 15px;
  font-size: 27.5px;
  font-weight: 700;
  line-height: 1.16;
  color: #fff;
  letter-spacing: -0.83px;
}

.payment-wrap .install-qr-text {
  position: absolute;
  top: 635px;
  left: 51px;
  width: 300px;
  margin-bottom: 0;
  font-size: 28px;
  font-weight: 700;
  line-height: 35.5px;
  color: #29304d;
  letter-spacing: -0.84px;
}

/* QR-drawer */
.qr-drawer-wrap {
  width: 900px;
  padding-top: 140px;
  margin: 0 auto;
}

.qr-drawer-wrap p {
  text-align: center;
}

.qr-drawer-wrap .qr-drawer-title {
  font-size: 56px;
  font-weight: 900;
  line-height: 80px;
  color: #29304d;
}

.qr-drawer-wrap .qr-drawer-qr {
  display: flex;
  justify-content: center;
  padding: 271px 0 272px 0;
}
.qr-drawer-wrap .qr-drawer-text p {
  font-size: 40px;
  font-weight: 500;
  line-height: 60px;
  color: #29304d;
  letter-spacing: -1.2px;
}
.qr-drawer-wrap p.qr-drawer-subtext {
  font-size: 26px;
  font-weight: 500;
  color: #6c6c6d;
  letter-spacing: -0.78px;
}
</style>
