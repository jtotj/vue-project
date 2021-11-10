<script>
import '@src/design/kiosk/kiosk-common.scss'
import KioskHeader from '@components/kiosk/kiosk-header'
import BankUseHeader from '@components/bank-use-header'
import BankAloneHeader from '@components/bank-alone-header'
import { mapGetters } from 'vuex'

export default {
  components: {
    KioskHeader,
    BankUseHeader,
    BankAloneHeader,
  },
  data() {
    return {
      login_count: 60,
    }
  },
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },

  created() {
    const [rootElement] = document.getElementsByTagName('html')
    rootElement.classList.add('kiosk')
  },
  methods: {
    countModify(time) {
      this.login_count = time
    },
  },
}
</script>

<template>
  <div :class="['kiosk', `${$route.name}`]">
    <BankUseHeader
      v-if="$route.path.indexOf('bank-use') !== -1"
    ></BankUseHeader>
    <BankAloneHeader
      v-else-if="
        $route.path.indexOf('bank-alone') !== -1 ||
          $route.path.indexOf('payment') !== -1
      "
      :max_count="login_count"
    ></BankAloneHeader>
    <KioskHeader v-else :max_count="login_count"></KioskHeader>
    <router-view @payment_count="countModify" />
  </div>
</template>
