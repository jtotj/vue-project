<script>
export default {
  data() {
    return {
      popup1: true,
      popup2: true,
    }
  },
}
</script>

<template>
  <div class="bank-modal">
    <div class="popup">
      <el-dialog :visible.sync="popup1" class="pop-content pop-one">
        <div class="pop-text">
          <div class="pop-title">
            <h3>{{ $t('we_future') }}</h3>
            <h2>{{ $t('pop_cocobank') }}</h2>
          </div>
          <div class="radius-box">{{ $t('fourth_industry') }}</div>
          <div class="grey-background">
            <p>
              <span>{{ $t('oc_15') }}</span>
              {{ $t('officially_open') }}
            </p>
            <p>{{ $t('head_branch_office') }}</p>
          </div>
          <div class="logo-wrap">
            <img src="@assets/img/cocobank-logo.svg" alt="cocobank 로고" />
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.popup {
  margin: 0 auto;
  text-align: center;
}

.popup .el-dialog__header {
  background: transparent !important;
}

.popup .pop-content .logo-wrap {
  float: none;
  width: 180px;
  margin: 0 auto;
}
.popup .pop-content .pop-text {
  padding: 40px 0;
}

.popup .pop-content .pop-text .pop-title {
  padding-bottom: 40px;
}
.popup .pop-content .pop-text h3 {
  font-family: 'GmarketSansMedium';
  font-size: 30px;
  font-weight: 500;
}
.popup .pop-content .pop-text h2 {
  font-family: 'GmarketSansBold';
  font-size: 50px;
}
.popup .pop-content .pop-text p {
  font-size: 18px;
}

.popup .pop-content .radius-box {
  display: inline-block;
  padding: 8px 20px;
  font-size: 16px;
  color: white;
  background-color: #0068c1;
  border-radius: 50px;
}

.popup .pop-content .grey-background {
  padding: 20px;
  margin: 30px 0;
  background: #eee;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .popup .pop-content .logo-wrap {
    display: block;
  }
}
</style>
