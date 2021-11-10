<script>
import Qrcode from 'qrcode.vue'
export default {
  components: {
    Qrcode,
  },
  props: {
    value: {
      type: String,
      default: null,
    },
  },
}
</script>

<template>
  <div :class="$style.kioskAlert">
    <h2>{{ $t('kiosk.use') }}</h2>
    <p>{{ $t('kiosk.scan_qr_code_txt') }}</p>
    <Qrcode
      :value="value"
      size="400"
      background="transparent"
      :class="$style.qrCode"
    ></Qrcode>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-home.scss';
.qrCode {
  margin: 175px 0;
}
</style>
