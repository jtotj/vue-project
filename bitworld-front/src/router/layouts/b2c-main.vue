<script>
import b2cHeader from '@components/b2c/b2c-header'
import Footer from '@components/Footer-Area'
// import '@assets/css/b2c/reset.css'
import '@assets/css/b2c/common.css'
import '@assets/css/b2c/b2c-exchange.css'
import '@assets/css/b2c/b2c-m-exchange.css'
import { mapGetters, mapState } from 'vuex'

export default {
  components: { b2cHeader, Footer },
  props: ['view_mode'],
  computed: {
    is_out_footer() {
      return ~this.$route.path.split('/').indexOf('m')
    },
    ...mapGetters('marketPublic', ['s_market_info']),
    ...mapState('marketPublic', ['s_market_seq']),
  },
}
</script>

<template>
  <div :class="['b2c', `b2c-${$route.name}`]">
    <b2cHeader></b2cHeader>
    <router-view v-if="s_market_info" :key="s_market_seq" />
    <Footer v-if="is_out_footer !== -2"></Footer>
  </div>
</template>
