<script>
export default {}
</script>

<template>
  <section class="section">
    <div class="section-wrap">
      <h2 class="title">{{ $t('register_guide') }}</h2>

      <div class="use-wrap">
        <div class="step-wrap">
          <div id="step1" class="step">
            <div class="img-wrap">
              <img src="@assets/img/step1.jpg" alt="step1" />
            </div>
            <div class="text-wrap">
              <span class="step-text">1. {{ $t('register_step1') }}</span>
            </div>
          </div>
          <div id="step2" class="step">
            <div class="img-wrap">
              <img src="@assets/img/step2_1.png" alt="step2" />
            </div>
            <div class="text-wrap">
              <span class="step-text">2. {{ $t('register_step2') }}</span>
            </div>
          </div>
          <div id="step3" class="step last-step">
            <div class="img-wrap">
              <img src="@assets/img/step3.jpg" alt="step3" />
            </div>
            <div class="text-wrap">
              <span class="step-text">3. {{ $t('register_step3') }}</span>
            </div>
          </div>
        </div>
        <div class="btn-wrap">
          <input
            type="button"
            :value="$t('login')"
            class="login-btn"
            @click="$router.push({ name: 'login-me' })"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.title {
  padding: 10px 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: #333;
  text-align: center;
}
.use-wrap .step-wrap {
  margin: 0 auto;
  overflow: hidden;
}
.use-wrap .step-wrap .step {
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
  background-color: white;
  border: 1px solid #e5e5e5;
}
.use-wrap .step-wrap .step:last-child {
  margin: 0;
}
.use-wrap .step-wrap .step .img-wrap {
  box-sizing: border-box;
  width: 100%;
  padding: 20px;
}

.use-wrap .step-wrap .step .img-wrap img {
  width: 100%;
}

.use-wrap .step-wrap .text-wrap {
  padding: 10px;
  background-color: #f4f4f4;
}
.use-wrap .btn-wrap {
  width: 100%;
  padding: 20px 0;
  margin: 0 auto;
  text-align: center;
}
.use-wrap .login-btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: white;
  cursor: pointer;
  background-color: #0068c1;
  border: none;
}
.use-wrap .login-btn:hover {
  background-color: #0068c1;
}

@media (max-width: 767px) {
  .use-wrap {
    width: 100%;
    padding: 10px 0;
  }
  .use-wrap .step-wrap .step {
    width: 100%;
    margin: 0 0 20px 0;
    clear: both;
  }
  .use-wrap .login-btn {
    width: 100%;
  }
}
</style>
