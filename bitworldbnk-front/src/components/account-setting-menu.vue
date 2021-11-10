<script>
export default {
  data() {
    return {
      input_search: null,
    }
  },
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
  <nav class="account-setting-menu">
    <!-- 메뉴 PC -->
    <div class="menu-wrap pc">
      <div>
        <el-input
          v-model="input_search"
          placeholder="검색"
          class="input-search"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-menu
          :default-active="$route.name"
          class="el-menu-vertical-demo"
          @select="menuSelect"
        >
          <p class="menu-title">계정 및 보안</p>
          <el-menu-item index="business-account-access">
            <span>
              <a href="#">계정 엑세스</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-account-preferences">
            <span>
              <a href="#">계정 기본설정</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-payment-preferences">
            <span>
              <a href="#">결제 기본설정</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <p class="menu-title">비즈니스 프로필</p>
          <el-menu-item index="business-business-info">
            <span>
              <a href="#">비즈니스 정보</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-account-owner-info">
            <span>
              <a href="#">계정 소유자 정보</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-funds">
            <span>
              <a href="#">자금, 은행 및 카드</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-notice">
            <span>
              <a href="#">알림</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <p class="menu-title">제품 및 서비스</p>
          <el-menu-item index="business-website-payment">
            <span>
              <a href="#">웹사이트 결제</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-invoice">
            <span>
              <a href="#">인보이스</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
            </div>
          </el-menu-item>
          <el-menu-item index="business-postal-parking">
            <span>
              <a href="#">우편 및 포장</a>
            </span>
            <div class="img-wrap f-right">
              <img src="@assets/img/arrow-right.png" />
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
        <el-menu-item index="business-account-access">계정 엑세스</el-menu-item>
        <el-menu-item index="business-account-preferences"
          >계정 기본설정</el-menu-item
        >
        <el-menu-item index="business-payment-preferences"
          >결제 기본설정</el-menu-item
        >
        <el-menu-item index="business-business-info"
          >비즈니스 정보</el-menu-item
        >
        <el-menu-item index="business-account-owner-info"
          >계정 소유자 정보</el-menu-item
        >
        <el-menu-item index="business-funds">자금, 은행 및 카드</el-menu-item>
        <el-menu-item index="business-notice">알림</el-menu-item>
        <el-menu-item index="business-website-payment"
          >웹사이트 결제</el-menu-item
        >
        <el-menu-item index="business-invoice">인보이스</el-menu-item>
        <el-menu-item index="business-postal-parking"
          >우편 및 포장</el-menu-item
        >
      </el-menu>
    </div>
  </nav>
</template>

<style lang="scss" module>
@import '@design';
</style>
