<script>
import '@assets/css/b2c/b2c-exchange.css'
import '@assets/css/b2c/reset.css'
import { mapGetters } from 'vuex'
import B2CExchange from '@components/b2c-exchange'

export default {
  page: {
    title: 'b2c-exchange',
    meta: [{ name: 'description', content: 'b2c-exchange' }],
  },
  components: { B2CExchange },
  data() {
    return {}
  },
  computed: {
    ...mapGetters('marketPublic', ['s_market_info']),
  },
}
</script>

<template>
  <B2CExchange
    v-if="s_market_info"
    :key="s_market_info ? s_market_info.seq : null"
  ></B2CExchange>
</template>
