<script>
import '@assets/css/lookup/exchange-success.css'

export default {
  page: {
    title: 'ExchangeSuccess',
    meta: [{ name: 'description', content: 'ExchangeSuccess' }],
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <h3>
        {{ $t('exchange_application_completed') }}
      </h3>
    </div>
  </div>
</template>
