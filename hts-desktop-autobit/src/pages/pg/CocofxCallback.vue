<script>
import * as depositApi from '@/api/deposit';

export default {
    mounted() {
        const {
            error,
            message,
            nonce,
            deposit_srl,
        } = this.$route.query;

        if (error !== '0') {
            this.$toasted.error(message)
            return this.$router.replace({ name: this.$route.query.to_name, params: { account_srl: this.$route.query.account_srl } })
        }

        depositApi.approveDepositPgCocofx(deposit_srl, { nonce })
            .then(() => {
                this.$toasted.success(`[${this.$t('deposit_application_num')}: ${deposit_srl}] ${this.$t('deposit_cocofx_msg')}`)
            })
            .finally(() => {
                this.$router.replace({ name: this.$route.query.to_name, params: { account_srl: this.$route.query.account_srl } })
            })
    }
}
</script>

<template>
  <div class="cocofx-loading">
    <div class="img-wrap">
      <img src="~assets/img/progress.png" alt=""/>
    </div>
    <span class="text" v-html="$t('process_payment')"></span>
  </div>
</template>

<style scoped>
  .cocofx-loading { 
    text-align: center;
    background: white;
    padding: 40px;
    width: 500px;
    margin: 100px auto;
  }
  .cocofx-loading .img-wrap {
    padding: 20px 0;
  }
  .cocofx-loading .img-wrap img {
    width: 70px;
    height: 70px;
    animation: rotate-image 1s linear infinite;
    transform-origin: 50% 50%;
  }
  .text {
    font-size: 26px;
    line-height: 34px;
    color: #333;
  }
  @media (max-width: 768px) {
    .cocofx-loading {
      padding: 30px;
      width: 60%;
    }
    .text {
      font-size: 20px;
      line-height: 28px;
    }
  }
  @keyframes rotate-image {
    100% {
    	transform: rotate(360deg);
    }
  }
</style>
