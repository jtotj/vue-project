<script>
import TradeNav from '@components/TradeNav'
export default {
  page: {
    title: 'CancelTrades',
    meta: [{ name: 'description', content: 'CancelTrades' }],
  },
  components: { TradeNav },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit color-white">{{
          $t('trade_page.trade_title')
        }}</span>
      </div>
    </div>
    <div class="trades-wrap">
      <div class="container">
        <TradeNav></TradeNav>
        <div class="trades-cont">
          <h2 class="trades-tit">
            <span>{{ $t('trade_page.cancel_trade') }}</span>
          </h2>
          <div class="trades-des">
            <i class="trades-text">{{ $t('overall_page.no_trade') }}</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
