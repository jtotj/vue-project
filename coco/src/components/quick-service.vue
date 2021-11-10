<script>
export default {
  methods: {
    alertPrepare() {
      return this.$alert(this.$t('service_prepare'))
    },
  },
}
</script>

<template>
  <div class="quick-service">
    <div class="container">
      <div class="main-title">
        <h2>{{ $t('quick_service') }}</h2>
      </div>
      <div class="main-content">
        <router-link
          :to="{
            name: 'direct-exchange',
          }"
        >
          <span>
            {{ $t('footer.direct_ex') }}
          </span>
          <div class="img-wrap">
            <img src="@assets/img/arrow-right-circle.svg" alt="right arrow" />
          </div>
        </router-link>

        <a @click="alertPrepare">
          <span>
            {{ $t('market_price_check') }}
          </span>
          <div class="img-wrap">
            <img src="@assets/img/arrow-right-circle.svg" alt="right arrow" />
          </div>
        </a>

        <router-link :to="{ name: 'money' }">
          <span>
            {{ $t('full_account_inquiry') }}
          </span>
          <div class="img-wrap">
            <img src="@assets/img/arrow-right-circle.svg" alt="right arrow" />
          </div>
        </router-link>

        <router-link :to="{ name: 'account-transfer' }">
          <span>
            {{ $t('account_transfer.transfer') }}
          </span>
          <div class="img-wrap">
            <img src="@assets/img/arrow-right-circle.svg" alt="right arrow" />
          </div>
        </router-link>

        <router-link :to="{ name: 'create-address' }">
          <span>
            {{ $t('new_account') }}
          </span>
          <div class="img-wrap">
            <img src="@assets/img/arrow-right-circle.svg" alt="right arrow" />
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.quick-service .main-content {
  display: flex;
  justify-content: space-around;
}
.quick-service a {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 18%;
  padding: 20px;
  margin-right: 2.5%;
  text-align: center;
  cursor: pointer;
  border: 1px solid #162248;
  border-radius: 5px;
}
.notKorean .quick-service a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 18%;
  padding: 20px 10px;
}

.quick-service a:last-child {
  margin: 0;
}

.quick-service a:hover {
  font-weight: bold;
  box-shadow: 10px 10px 10px #eee;
  transition: 0.3s;
}

.quick-service span {
  flex-basis: 85%;
}

.quick-service .img-wrap {
  float: right;
  width: 18px;
}

.quick-service h2,
.quick-service a {
  color: #222;
}

@media (max-width: 1030px) {
  .quick-service .main-content {
    flex-direction: column;
  }
  .quick-service a {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
  .notKorean .quick-service a {
    width: 100%;
  }
  .quick-service span {
    flex-basis: auto;
  }
}
</style>
