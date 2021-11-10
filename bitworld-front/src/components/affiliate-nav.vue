<script>
export default {
  data() {
    return {}
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
  <div :class="[$style.affiliateNav]">
    <el-menu
      :default-active="$route.name"
      mode="horizontal"
      :class="[$style.elMenu]"
      @select="menuSelect"
    >
      <el-menu-item index="bank-affiliate-balance">
        자산별 수당 잔액 목록
      </el-menu-item>
      <el-menu-item index="bank-affiliate-log">
        수당 발생 내역
      </el-menu-item>
      <el-menu-item index="bank-affiliate-adjust">
        수당 정산 내역
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.affiliateNav {
  margin-bottom: 20px;

  .elMenu {
    border-bottom: none;

    li {
      height: 50px;
      margin-right: 20px;
    }
  }
}
</style>
