<script>
import '@assets/css/payment.css'
export default {
  page: {
    title: 'PaymentGuest',
    meta: [{ name: 'description', content: 'PaymentGuest' }],
  },
  data() {
    return {
      more: false,
      show: false,
      country: '대한민국',
      state: '서울시',
      phone: '휴대폰',
    }
  },
}
</script>

<template>
  <div class="wrapper">
    <div class="guest-main">
      <div class="guest-header">
        <div class="logo"></div>
        <div class="cart">
          <a
            :class="['transaction-detail', { active: show }]"
            @click="show = !show"
          >
            <span class="total-wrapper">
              <span class="transaction-cart">
                <span class="cart-icon"></span>
                <div class="format-currency">
                  <span class="ltr-override">
                    $0.99
                    <span class="currency-code">USD</span>
                  </span>
                </div>
                <span class="arrow"></span>
              </span>
            </span>
          </a>
          <div v-if="show" class="transaction-cart-detail">
            <div class="details">
              <a class="close-cart" @click="show = false"> </a>
              <h2 class="merchant-name">
                Fanatical
              </h2>
              <div class="scrollable-middle">
                <ul class="detail-item">
                  <li class="items">
                    <div class="item-name-container">
                      <a v-if="!more" class="more" @click="more = true"
                        >더보기</a
                      >
                      <span class="item-name">
                        5e00341f593a7800847c35ee
                      </span>
                    </div>
                    <span class="item-price">
                      <span class="ltr-override">
                        $0.99
                        <span class="currency-code">USD</span>
                      </span>
                    </span>
                    <template v-if="more">
                      <ul class="item-details">
                        <li>
                          <span>
                            <strong>상품 #:</strong>
                            <span>5e00341f593a7800847c35ee</span>
                          </span>
                        </li>
                      </ul>
                      <a class="less" @click="more = false">간략히 보기</a>
                    </template>
                  </li>
                </ul>
                <ul class="detail-extras">
                  <li class="amounts">
                    <span class="item-name-container">상품 합계</span>
                    <span class="item-price">
                      <span class="ltr-override">
                        $0.99
                        <span class="currency-code">USD</span>
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
              <div class="sub-total">
                <span class="item-name-container">
                  총계
                </span>
                <span class="item-price">
                  <span class="ltr-override">
                    $0.99
                    <span class="currency-code">USD</span>
                  </span>
                </span>
              </div>
            </div>
            <div class="pointer"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="header-box">
          <h1 class="alpha">직불카드 또는 신용카드로 결제</h1>
          <p class="sub-title"
            >COCOPAY는 사용자의 금융 세부정보를 판매자와 공유하지 않습니다.</p
          >
        </div>
        <form class="single-payment-form">
          <div class="country-list">
            <select v-model="country" class="country-select">
              <option>대한민국</option>
              <option>미국</option>
              <option>일본</option>
              <option>중국</option>
            </select>
            <span class="custom-select">
              <span>
                <span>{{ country }}</span>
              </span>
            </span>
            <label class="country-label">국가/지역</label>
          </div>
          <div>
            <div class="credit-card-input">
              <div class="card-icon mastercard"></div>
              <div class="card-icon visa"></div>
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="카드번호" />
            </div>
            <div class="card-input-wrap">
              <div class="expiration-left-field">
                <input placeholder="만료일" />
              </div>
              <div class="expiration-right-field">
                <input placeholder="CVV" maxlength="3" />
                <span class="security-code-card"></span>
              </div>
            </div>
            <div class="card-input-wrap">
              <div class="expiration-left-field">
                <input placeholder="성" />
              </div>
              <div class="expiration-right-field">
                <input placeholder="이름" />
              </div>
            </div>
          </div>
          <h2 class="section-title">
            청구 주소
          </h2>
          <div>
            <div class="country-list">
              <select v-model="state" class="country-select">
                <option>서울시</option>
                <option>경기도</option>
              </select>
              <span class="custom-select">
                <span>
                  <span>{{ state }}</span>
                </span>
              </span>
              <label class="country-label">시/도</label>
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="시/군/구" />
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="도로명, 건물번호" />
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="추가 주소 정보" />
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="우편번호" />
            </div>
          </div>
          <div>
            <h2 class="section-title">
              연락처 정보
            </h2>
            <div class="card-input-wrap">
              <div class="expiration-left-field p-relative">
                <select v-model="phone" class="country-select">
                  <option>휴대폰</option>
                  <option>집</option>
                  <option>직장</option>
                </select>
                <span class="custom-select">
                  <span>
                    <span>{{ phone }}</span>
                  </span>
                </span>
                <label class="country-label">전화 유형</label>
              </div>
              <div class="expiration-right-field p-relative">
                <span class="fixed-code">+82</span>
                <input class="phone-number" />
                <label class="country-label">전화번호</label>
              </div>
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="이메일" />
            </div>
          </div>
          <div style="margin-bottom:10px;">
            <h2 class="onboard-header">
              <p>최고의 보안과</p>
              <p>보호를 경험하실 수 있습니다.</p>
            </h2>
            <p class="sub-title">
              COCOPAY는 계정을 만드는 것은 선택사항이지만, 계정을 만들 경우 모든
              적합한 구매에 대해
              <b>COCOPAY 구매자 보호</b>
              가 적용되며 쇼핑 시마다 더 빠른 결제가 가능합니다.
              <a>약관보기</a>
            </p>
            <p>COCOPAY 계정을 만드시겠어요? (잠깐이면 됩니다.)</p>
          </div>
          <div class="sign-up-field">
            <input id="guest1" type="radio" class="guest-radio" />
            <label class="guest-radio-label" for="guest1">
              예, COCOPAY 계정을 만들고 싶습니다.
            </label>
          </div>
          <div class="sign-up-option">
            <div class="card-input-wrap">
              <input class="card-input" placeholder="비밀번호" />
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="생년월일" />
            </div>
            <div class="country-list">
              <select class="country-select">
                <option>대한민국</option>
                <option>미국</option>
                <option>일본</option>
                <option>중국</option>
              </select>
              <span class="custom-select">
                <span>
                  <span>{{ '대한민국' }}</span>
                </span>
              </span>
              <label class="country-label">국적</label>
            </div>
            <div class="country-list">
              <select class="country-select">
                <option>여권</option>
                <option>운전면허증</option>
              </select>
              <span class="custom-select">
                <span>
                  <span>{{ '여권' }}</span>
                </span>
              </span>
              <label class="country-label">ID 유형</label>
            </div>
            <div class="card-input-wrap">
              <input class="card-input" placeholder="ID 번호" />
            </div>
            <div class="legal">
              <div class="check-container">
                <input
                  id="check-keep-login"
                  class="checkbox-input"
                  type="checkbox"
                />
                <label for="check-keep-login" class="checkbox-label">
                  COCOPAY로부터 마케팅 커뮤니케이션을 받는 것에 동의합니다.
                </label>
              </div>
            </div>
          </div>
          <div class="sign-up-field">
            <input id="guest2" type="radio" class="guest-radio" />
            <label class="guest-radio-label" for="guest2">
              아니요, 지금 계정을 만들지 않겠습니다.
            </label>
          </div>
          <div class="legal">
            <div class="check-container">
              <input
                id="check-keep-legal"
                class="checkbox-input"
                type="checkbox"
              />
              <label for="check-keep-legal" class="checkbox-label">
                본인은 법적 성년임을 확인하며 COCOPAY의 개인정보 취급방침에
                동의합니다.
              </label>
            </div>
          </div>
          <div class="buttons">
            <button class="guest-submit">바로 결제</button>
          </div>
        </form>
      </div>
      <div class="guest-prop">
        <div class="prop-img"></div>
        <h2 class="prop-header">
          COCOPAY는 더 안전하고 빠른 결제 방법입니다.
        </h2>
        <p>
          어디에서 쇼핑을 하든, 금융정보를 더 안전하게 지키도록 도와드립니다.
        </p>
      </div>
    </div>
    <div class="footer"
      ><div class="footer-list"
        ><ul
          ><li><a href="/pay/legal" class="">약관</a></li
          ><li>사용자 계약</li
          ><li><a href="/pay/privacy" class="">개인정보 취급방침</a></li
          ><li><a href="/" class="router-link-active">피드백</a></li
          ><li>© 1999 - 2019 <i class="el-icon-lock"></i></li></ul></div
      ><p>
        소비자에게 알림: COCOPAY 선불 지급 수단의 소유자인 COCOPAY Pte Ltd는
        싱가포르 금융감독 당국의 승인을 필요로 하지 않습니다.
        <a href="/pay/legal" class="">이용약관</a>을 주의 깊게 읽어보시기
        바랍니다.
      </p></div
    >
  </div>
</template>
