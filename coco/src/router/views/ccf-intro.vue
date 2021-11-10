<script>
import '@assets/css/ccf-intro.css'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'CcfIntro',
    meta: [{ name: 'description', content: 'CcfIntro' }],
  },
  computed: {
    ...mapState(['common']),
  },
  methods: {
    getImageSrc(lang) {
      var default_img = null
      try {
        return require('@assets/img/ccf-' + lang + '.png')
      } catch (e) {
        return default_img
      }
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <!-- <div>
        <img :src="getImageSrc(common.locale)" />
      </div> -->
      <section id="what-ccf" class="section">
        <div class="big-title-wrap">
          <h2 class="big-title"> 1 {{ $t('ccf.what_ccf') }} </h2>
          <h3>
            {{ $t('ccf.key_coin') }}
          </h3>
          <p>
            {{ $t('ccf.ccf_description') }}
          </p>
        </div>
      </section>

      <section id="how-use-ccf" class="section">
        <div class="big-title-wrap">
          <h2 class="big-title"> 2 {{ $t('ccf.how_use_ccf') }} </h2>
        </div>
        <div id="step1" class="step box-white">
          <span class="badge-blue marginR-10">
            STEP1
          </span>
          <p class="step-name color-blue">
            {{ $t('ccf.cocobank_wallet_transfer') }}
          </p>
          <div class="round-box-wrap">
            <div class="round-box first-round">
              <p>
                {{ $t('external_exchange_store') }}
              </p>
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-wallet.svg" />
                </div>
                <p>{{ $t('wallet') }}</p>
              </div>
            </div>
            <div class="arrow">
              <div class="img-wrap">
                <img src="@assets/img/double-arrow-right.svg" />
              </div>
            </div>
            <div class="round-box">
              <p>{{ $t('pay_home.cocobank_title') }}</p>
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-wallet.svg" />
                </div>
                <p>{{ $t('wallet') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="step2" class="step box-white">
          <span class="badge-blue marginR-10">
            STEP2
          </span>
          <p class="step-name color-blue">
            {{ $t('ccf.ccf_conversion') }}
          </p>
          <div class="round-box-wrap">
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-wallet.svg" />
                </div>
                <p>{{ $t('wallet') }}</p>
              </div>
            </div>
            <div class="arrow">
              <p>
                {{ $t('ccf.direct_exchange_c2c_deal') }}
              </p>
              <div class="img-wrap">
                <img src="@assets/img/double-arrow-right.svg" />
              </div>
            </div>
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-ccf.svg" />
                </div>
                <p>CCF</p>
              </div>
            </div>
          </div>
        </div>
        <div id="step3" class="step box-white">
          <span class="badge-blue marginR-10">
            STEP3
          </span>
          <p class="step-name color-blue">
            {{ $t('ccf.ccf_moved') }}
          </p>
          <div class="round-box-wrap">
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-ccf.svg" />
                </div>
                <p>CCF</p>
              </div>
            </div>
            <div class="arrow">
              <div class="img-wrap">
                <img src="@assets/img/double-arrow-right.svg" />
              </div>
            </div>
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-account.svg" />
                </div>
                <p>{{ $t('pay_home.cocobank_title') }}</p>
              </div>
            </div>
          </div>
          <div class="use-ccf">
            <h3>
              {{ $t('ccf.how_use_account_ccf') }}
            </h3>
            <div class="use">
              <h4>{{ $t('footer.coco_market') }}</h4>
              <p>
                {{ $t('ccf.freely_purchase_open_market') }}
              </p>
            </div>
            <div class="use">
              <h4>{{ $t('pay_home.cocobank_title') }}</h4>
              <p>
                {{ $t('ccf.free_deposit_withdrawal') }}
              </p>
            </div>
            <div class="use">
              <h4>{{ $t('site_map.map_deal') }}</h4>
              <p>
                {{ $t('ccf.exchange_currencies_convenient') }}
              </p>
            </div>
            <div class="use">
              <h4>{{ $t('Kiosk') }}</h4>
              <p>
                {{ $t('ccf.offline_convenient') }}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="wallet-account-different" class="section">
        <div class="big-title-wrap">
          <h2 class="big-title">
            3 {{ $t('ccf.how_wallets_accounts_different') }}
          </h2>
          <p>
            {{ $t('ccf.same_means_storing_cryptocurrency') }}
          </p>
        </div>
        <div id="external-transaction" class="transaction box-white">
          <span class="badge-blue"> 1) {{ $t('external_transaction') }} </span>
          <div class="round-box-wrap">
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-exchange.svg" />
                </div>
                <p>{{ $t('pay_home.cocobank_title') }}</p>
              </div>
            </div>
            <div class="arrow">
              <p>{{ $t('wallet') }}</p>
              <div class="img-wrap">
                <img src="@assets/img/icon-wallet.svg" />
                <img src="@assets/img/double-long-arrow.svg" />
              </div>
            </div>
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-exchange.svg" />
                </div>
                <p>{{ $t('exchange_store') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div id="internal-transaction" class="transaction box-white">
          <span class="badge-blue"> 2) {{ $t('internal_transaction') }} </span>
          <div class="round-box-wrap">
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-exchange.svg" />
                </div>
                <p>{{ $t('pay_home.cocobank_title') }}</p>
              </div>
            </div>
            <div class="arrow">
              <p>{{ $t('account') }}</p>
              <div class="img-wrap">
                <img src="@assets/img/icon-account.svg" />
                <img src="@assets/img/double-long-arrow.svg" />
              </div>
            </div>
            <div class="round-box">
              <div class="round">
                <div class="img-wrap">
                  <img src="@assets/img/icon-exchange.svg" />
                </div>
                <p>{{ $t('pay_home.cocobank_title') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
