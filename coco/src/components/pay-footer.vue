<script>
export default {
  name: 'PayFooter',
}
</script>

<template>
  <footer id="pay-footer">
    <div class="footer-inner">
      <div class="container">
        <div class="ft-top">
          <ul class="ft-menu">
            <li class="footer-menu-item">
              <a href="https://cocofx.com/about" target="_blank">
                {{ $t('pay_head_foot.about') }}
              </a>
            </li>
            <li class="footer-menu-item">
              <router-link
                :to="{ name: 'policy', params: { type: 'privacy' } }"
              >
                {{ $t('pay_head_foot.privacy_state') }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="ft-bot">
          <ul class="ft-info">
            <li><strong>COCOBANK</strong></li>
            <br />
            <li>대표이사: 방종국</li>
            <li>사업자등록번호: 486-88-01609</li>
            <br />
            <li>Tel: 02) 6080-6116</li>
            <li>E-mail: contact@cocobnk.com</li>
          </ul>
          <address>서울특별시 강남구 언주로 528</address>
          <p class="copy">Copyright COCOBANK. All Rights Reserved.</p>
          <img
            class="ft-logo"
            src="@assets/img/cocopay-footer_logo.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-inner {
  background: #fafafa;
}

.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  font-size: 14px;
  color: #aaa;
  text-align: center;
}

.ft-top {
  border-bottom: 1px solid #dadada;
}

.ft-menu {
  margin: 20px 0;
}

.ft-menu li {
  display: inline-block;
}

.ft-menu li a {
  padding: 0 20px;
  font-size: 16px;
  color: #404041;
}

.footer-menu-item > a {
  margin: 0;
}

.ft-bot {
  padding: 27px 0 40px;
  font-size: 14px;
  font-style: normal;
  color: #aaa;
}

.ft-info li {
  position: relative;
  display: inline-block;
  margin-right: 30px;
}

.ft-info br {
  display: none;
}

.ft-info li:last-child {
  margin-right: 0;
}

.ft-info li strong {
  color: #aaa;
}

.ft-info li::before {
  position: absolute;
  top: 6px;
  right: -15px;
  bottom: 6px;
  width: 1px;
  content: '';
  background: #aaa;
}

.ft-info li:last-child::before {
  display: none;
}

address {
  font-style: normal;
}

.copy {
  margin: 18px 0 28px;
}

.ft-logo {
  height: 26px;
}

@media (max-width: 1280px) {
  .container {
    padding: 0 20px 0 !important;
  }
}

@media screen and (max-width: 767px) {
  .container {
    text-align: left;
  }

  .ft-menu li a {
    padding: 0;
    margin-right: 20px;
    font-size: 15px;
  }

  .ft-bot {
    font-size: 13px;
  }

  .ft-info br {
    display: block;
  }

  .ft-info li {
    margin-right: 18px;
  }

  .ft-info li::before {
    right: -11px;
    bottom: 7px;
  }

  .ft-info li:nth-child(1)::before,
  .ft-info li:nth-child(4)::before {
    display: none;
  }

  .ft-logo {
    width: auto;
    height: 25px;
    text-align: left;
  }
}
</style>
