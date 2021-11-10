<script>
export default {
  data() {
    return {
      clap_menu: [
        {
          title: this.$t('clap.detail_to_buy'),
          name: 'clap-detail',
        },
        {
          title: this.$t('clap.getting_started_clap'),
          name: 'clap-intro',
        },
        {
          title: this.$t('clap.how_to_initialize_clap'),
          name: 'clap-reset',
        },
        {
          title: this.$t('clap.getting_started_ledger_live'),
          name: 'ledger-live-intro',
        },
        {
          title: this.$t('clap.install_coin_app'),
          name: 'coinapp-link',
        },
      ],
    }
  },
  methods: {},
}
</script>

<template>
  <div class="clap-nav">
    <div class="pc nav">
      <el-menu class="menu" :router="true">
        <el-menu-item
          v-for="menu in clap_menu"
          :key="menu.name"
          class="menu-item"
        >
          <router-link :to="{ name: menu.name }">
            {{ menu.title }}
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="mobile nav">
      <el-menu
        :default-active="$route.name"
        class="menu"
        mode="horizontal"
        :router="true"
      >
        <el-menu-item
          v-for="menu in clap_menu"
          :key="menu.name"
          class="menu-item"
        >
          <router-link :to="{ name: menu.name }">
            {{ menu.title }}
          </router-link>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
* {
  box-sizing: border-box;
}

.clap-nav {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 20px;
  background-color: #f4f4f4;
}

.clap-nav .el-menu-item {
  display: flex;
  align-items: center;
  line-height: 1;
  white-space: initial;
}

.menu-item .router-link-active {
  color: #0068c1;
}

@media (max-width: 768px) {
  .clap-nav {
    width: 100%;
    margin-bottom: 20px;
  }
  .mobile .el-menu-item {
    padding-right: 20px !important;
  }

  .menu-item .router-link-active {
    color: #0068c1;
  }
}
</style>
