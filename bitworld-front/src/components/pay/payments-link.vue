<script>
export default {
  props: ['payment_type'],
  data() {
    return {
      payment: this.payment_type,
    }
  },
}
</script>

<template>
  <div v-if="payment === null" class="payment-content">
    <div class="payment-header">
      <h2 class="header-text text-center">결제수단 연결</h2>
    </div>
    <div class="payment-body">
      <ul>
        <li class="payment-list" @click="payment = 'card'">
          <img src="@assets/img/addFiIcon_alternate.svg" class="payment-img" />
          <div class="payment-item">
            <p class="payment-list-primary">신용카드 연결</p>
            <p class="payment-list-text"
              >쇼핑 시 카드 정보를 안전하게 보관하세요.</p
            >
            <img
              src="@assets/img/arrowRight_alternate.svg"
              class="payment-img"
            />
          </div>
        </li>
        <li class="payment-list" @click="payment = 'bank'">
          <img
            src="@assets/img/addBankIcon_alternate.svg"
            class="payment-img"
          />
          <div class="payment-item">
            <p class="payment-list-primary">은행계좌 연결</p>
            <p class="payment-list-text"
              >CocoPay에서 은행으로 바로 자금을 이체하세요.</p
            >
            <img
              src="@assets/img/arrowRight_alternate.svg"
              class="payment-img"
            />
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-else-if="payment === 'card'" class="payment-content">
    <div class="payment-header">
      <h2 class="header-text text-center">카드 연결</h2>
    </div>
    <div class="payment-body">
      <form>
        <div class="card-form">
          <img src="@assets/img/generic_card.png" class="card-img" />
        </div>
        <div class="payment-input-wrap">
          <input class="payment-input" placeholder="신용카드 번호" />
        </div>
        <div class="payment-input-wrap select-wrap">
          <select class="payment-input">
            <option>카드 유형 선택</option>
            <option>Visa</option>
            <option>Mastercard</option>
          </select>
        </div>
        <div class="payment-input-wrap">
          <input class="payment-input" placeholder="만료일" />

          <span class="csc-image"></span>
        </div>
        <div class="payment-input-wrap">
          <input class="payment-input" placeholder="보안코드" />
        </div>
        <div class="payment-input-wrap select-wrap">
          <select class="payment-input">
            <option>서울시 강남구</option>
          </select>
        </div>
        <button class="add-card-btn">카드 연결</button>
      </form>
    </div>
  </div>
  <div v-else-if="payment === 'bank'" class="payment-content">
    <form>
      <h2 class="header-text text-2">은행계좌 연결</h2>
      <p class="add-bank-text">
        COCOPAY에서는 은행계좌 정보를 안전하게 보호합니다. 한국 원화를 사용하는
        은행계좌만 연결할 수 있습니다.
      </p>
      <div class="payment-input-wrap">
        <input class="payment-input" placeholder="은행 이름" />
      </div>
      <div class="payment-input-wrap">
        <input class="payment-input" placeholder="은행 코드" />
      </div>
      <div class="cert-wrap">
        <div class="account-type-label">계좌 유형</div>

        <input id="check-radio-overdraft" type="radio" class="blue-radio" />
        <label for="check-radio-overdraft" class="blue-radio-label">
          당좌
        </label>

        <input id="check-radio-deposit" type="radio" class="blue-radio" />
        <label for="check-radio-deposit" class="blue-radio-label">
          예금
        </label>
      </div>
      <div class="payment-input-wrap">
        <input class="payment-input" placeholder="계좌 번호" />
      </div>
      <div class="cert-wrap">
        <span class="account-name-label">본인 확인</span>

        <input id="check-radio-register" type="radio" class="blue-radio" />
        <label for="check-radio-register" class="blue-radio-label">
          주민등록증
        </label>

        <input id="check-radio-company" type="radio" class="blue-radio" />
        <label for="check-radio-company" class="blue-radio-label">
          사업자등록번호
        </label>
      </div>
      <div class="payment-input-wrap">
        <input class="payment-input" placeholder="주민등록증" />
      </div>

      <div class="add-bank-panel">
        <div class="panel-info">
          <p class="panel-header">이름</p>
          <p class="panel-text">홍길동</p>
        </div>
      </div>
      <button class="add-card-btn">동의 후 연결</button>
    </form>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
<style scoped>
.payment-content {
  box-sizing: border-box;
  width: 100%;
  padding: 20px 25% 50px;
}
.payment-header .header-text {
  margin-bottom: 50px;
  font-size: 30px;
  line-height: 36px;
}
.payment-img {
  width: auto;
}
.payment-list {
  list-style-type: none;
  cursor: pointer;
  border-bottom: 1px #b7bcbf dotted;
}
.payment-list:first-child {
  border-top: 1px #b7bcbf dotted;
}
.payment-item {
  padding: 15px;
}
.payment-list-primary {
  color: #0068c1;
}
.card-form {
  padding-top: 1em;
  text-align: center;
  vertical-align: top;
}
.card-form .card-img {
  width: 150px;
  min-height: 98px;
  background-size: 150px;
  border-radius: 6px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
}
.payment-input-wrap {
  position: relative;
  padding: 0;
  margin-top: 15px;
  text-align: left;
  background: white;
  border-radius: 5px;
}
.payment-input {
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 0 15px;
  background: transparent;
  border: 1px solid #9da3a6;
  border-radius: 5px;
}
.select-wrap::after {
  position: absolute;
  top: 50%;
  right: 6.25px;
  z-index: 2;
  font-family: customer;
  font-size: 28px;
  line-height: 0;
  content: '\2193';
}
.csc-image {
  position: relative;
  top: 0.6em;
  display: inline-block;
  width: 3.2em;
  height: 2.1em;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
}
.add-card-btn {
  display: inline-block;
  width: 100%;
  padding: 11px 23px;
  margin: 30px 0;
  font-size: 15px;
  line-height: 1.5rem;
  color: #fff;
  cursor: pointer;
  background-color: #0070ba;
  border: 0.0625rem solid #0070ba;
  border-radius: 1.5rem;
}
.text-2 {
  margin: 25px 0;
}
.add-bank-text {
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  color: #000;
}
.cert-wrap {
  margin-top: 1rem;
}
.account-type-label {
  font-size: 16px;
  color: #000;
}
.cert-wrap .blue-radio {
  top: 4px;
}

@media (max-width: 768px) {
  .payment-content {
    padding: 0 10px;
  }
}
</style>
