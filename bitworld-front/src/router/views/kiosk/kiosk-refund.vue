<script>
import { refundTransaction } from '@apis/pg'

export default {
  page: {
    title: 'KioskRefund',
    meta: [{ name: 'description', content: 'KioskRefund' }],
  },
  data() {
    return {
      token: null,
      merchant: null,
      show_kiosk: {
        KIND: 'WINDOWATTRIBUTE',
        FROM: 'BROWSER',
        TO: 'KIOSK',
        DATA: { COMMAND: 'SHOW' },
      },
      result: null,
      err_msg: null,
    }
  },
  mounted() {
    Promise.all([this.handleRefund(), this.tokenDecode()]).catch((e) => {
      this.$toasted.error(e.message, {
        theme: 'toasted-primary',
        containerClass: 'kiosk-toasted',
      })
    })
  },
  methods: {
    tokenDecode() {
      this.token = this.$jwt.decode(this.$route.query.token)
    },
    handleRefund() {
      refundTransaction({
        ...this.$route.query,
      })
        .then(({ trasaction_id }) => {
          this.result = 'success'
          const message = {
            KIND: 'REFUND BIT PAY',
            FROM: 'BROWSER',
            TO: 'BITPAY',
            'CALL BACK FUNC': '',
            DATA: {
              CODE: '1',
              MSG: '정상처리 되었습니다.',
              Amount: this.token.info.amount,
              'TRANSACTION ID': trasaction_id,
              'ASSET CODE': this.token.info.asset_code,
            },
          }
          window.ipcRenderer.send('receiptPrint', message)
          setTimeout(() => {
            window.ipcRenderer.send('hide')
            window.ipcRenderer.send('receiptPrint', this.show_kiosk)
            this.$router.push({ name: 'kiosk-home' })
          }, 5000)
        })
        .catch((e) => {
          this.result = 'fail'
          this.err_msg = e.message
          const message = {
            KIND: 'REFUND BIT PAY',
            FROM: 'BROWSER',
            TO: 'BITPAY',
            'CALL BACK FUNC': '',
            DATA: { CODE: '0', MSG: this.err_msg },
          }
          window.ipcRenderer.send('receiptPrint', message)
          setTimeout(() => {
            window.ipcRenderer.send('hide')
            window.ipcRenderer.send('receiptPrint', this.show_kiosk)
            this.$router.push({ name: 'kiosk-home' })
          }, 2000)
        })
    },
  },
}
</script>

<template>
  <div class="payment-wrap">
    <form class="payment-form">
      <div class="row">
        <h3 class="payment-title">{{ '환불하기' }}</h3>
        <ul v-if="token" class="payment-list-box-1">
          <li class="payment-name-box">
            <span class="payment-name">
              {{ '결제 시 승인 ID' }}
            </span>
            <span class="payment-item">
              {{ token.info.transaction_id }}
            </span>
          </li>
          <li class="payment-amount-box">
            <span>
              {{ '환불 요청 금액' }}
            </span>
            <span class="payment-amount">
              {{ token.info.amount }}{{ token.info.asset_code }}
            </span>
          </li>
        </ul>
      </div>
      <div class="row result-wrap">
        <template v-if="result === 'success'">
          <img src="@assets/kiosk-img/icon-success.svg" alt="login success" />
          <p>환불 처리 되었습니다.</p>
        </template>
        <template v-else>
          <img src="@assets/kiosk-img/icon-fail.svg" alt="login fail" />
          <p>{{ err_msg }}</p>
        </template>
      </div>
      <div class="row">
        <button v-if="0" class="cancel-btn">{{
          $t('pop_notice.notice_close')
        }}</button>
      </div>
    </form>
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

.result-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 200px 0;
}
.result-wrap img {
  margin-bottom: 100px;
}
.result-wrap p {
  font-size: 60px;
  font-weight: 900;
  line-height: normal;
  color: #29304d;
  letter-spacing: normal;
}
</style>
