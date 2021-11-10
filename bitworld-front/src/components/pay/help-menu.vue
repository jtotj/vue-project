<script>
export default {
  methods: {
    menuSelect(index) {
      this.$router.push({
        name: index,
      })
    },
  },
}
</script>

<template>
  <nav class="help-menu">
    <!-- 메뉴 PC -->
    <div class="menu-wrap pc">
      <div>
        <el-menu
          :default-active="$route.name"
          class="el-menu-vertical-demo"
          @select="menuSelect"
        >
          <el-menu-item index="pay-help-house">
            <span>
              <a href="#">집</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-basic">
            <span>
              <a href="#">COCOPAY 기본사항</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-payment">
            <span>
              <a href="#">결제</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-bank">
            <span>
              <a href="#">은행계좌 또는 신용카드</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-myaccount">
            <span>
              <a href="#">내 계정</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-problem">
            <span>
              <a href="#">문제 및 해결</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-sellerservice">
            <span>
              <a href="#">판매자 서비스</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="pay-help-taxinfo">
            <span>
              <a href="#">미국 세금 정보</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@views/pay/business/img/arrow-right.png" />
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <!-- 메뉴 Mobile -->
    <div class="menu-wrap mobile">
      <el-menu
        :default-active="$route.name"
        class="el-menu-demo"
        mode="horizontal"
        @select="menuSelect"
      >
        <el-menu-item index="pay-help-house">집</el-menu-item>
        <el-menu-item index="pay-help-basic">COCOPAY 기본사항</el-menu-item>
        <el-menu-item index="pay-help-payment">결제</el-menu-item>
        <el-menu-item index="pay-help-bank"
          >은행계좌 또는 신용카드</el-menu-item
        >
        <el-menu-item index="pay-help-myaccount">내 계정</el-menu-item>
        <el-menu-item index="pay-help-problem">문제 및 해결</el-menu-item>
        <el-menu-item index="pay-help-sellerservice"
          >판매자 서비스</el-menu-item
        >
        <el-menu-item index="pay-help-taxinfo">미국 세금 정보</el-menu-item>
      </el-menu>
    </div>
  </nav>
</template>

<style lang="scss" module>
@import '@design';
</style>
