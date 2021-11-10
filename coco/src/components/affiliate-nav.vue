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
      <el-menu-item index="affiliate-balance">
        {{ $t('affiliate.list_allowance_balance_asset') }}
      </el-menu-item>
      <el-menu-item index="affiliate-log">
        {{ $t('affiliate.affiliate_occur_list') }}
      </el-menu-item>
      <el-menu-item index="affiliate-adjust">
        {{ $t('affiliate.affiliate_adjust_list') }}
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
      margin-right: 20px;
    }
  }
}
</style>
