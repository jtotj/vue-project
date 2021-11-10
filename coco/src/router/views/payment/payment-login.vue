<script>
import '@assets/css/payment.css'
export default {
  page: {
    title: 'PaymentLogin',
    meta: [{ name: 'description', content: 'PaymentLogin' }],
  },
}
</script>

<template>
  <div class="main">
    <section class="login">
      <header>
        <p class="payment-logo">COCOPAY</p>
      </header>
      <h1 class="header-text">{{ $t('pay_main.pay_cocopay') }}</h1>
      <p class="sub-header-text">{{ $t('pay_main.free_shipping') }}</p>
      <form style="position:relative;">
        <div class="login-form">
          <input
            class="login-input"
            :placeholder="$t('pay_main.email_phone')"
          />
        </div>
        <div class="login-form">
          <input class="login-input" :placeholder="$t('password')" />
        </div>
        <div class="keep-login">
          <div class="check-container">
            <input
              id="check-keep-login"
              class="checkbox-input"
              type="checkbox"
            />
            <label for="check-keep-login" class="checkbox-label">
              {{ $t('pay_login.staying') }}
            </label>
          </div>
        </div>
        <button class="login-submit">{{ $t('login') }}</button>
      </form>
      <div class="forgot-link">
        <a>{{ $t('pay_main.login_error') }}</a>
      </div>
      <div class="sign-container">
        <div class="login-separator">
          <span class="text-separator">{{ $t('otp.or') }}</span>
        </div>
        <router-link
          :to="{ name: 'payment-guest' }"
          tag="button"
          class="card-btn"
          >{{ $t('pay_main.pay_card') }}</router-link
        >
      </div>
      <div class="inner-footer">
        <div class="cancel">
          <a class="cancel-link">{{ $t('pay_main.cancel_back') }}</a>
        </div>
      </div>
    </section>
  </div>
</template>
