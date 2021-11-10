<script>
export default {}
</script>

<template>
  <div :class="$style.kioskAlert">
    <h2>{{ $t('kiosk.service_preparation') }}</h2>
    <img src="@assets/kiosk-img/icon-alert.svg" alt="서비스 준비중" />
    <p>{{ $t('kiosk.service_preparation_txt1') }}</p>
    <p>{{ $t('kiosk.service_preparation_txt2') }}</p>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-home.scss';
</style>
