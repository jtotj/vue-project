<script>
export default {
  data() {
    return {
      subpage_map: {
        'contact-detail': 'contact-history',
      },
    }
  },
  methods: {},
}
</script>

<template>
  <div class="service-center-nav">
    <div class="pc nav">
      <el-menu
        :default-active="
          subpage_map[$route.name] ? subpage_map[$route.name] : $route.name
        "
        class="el-menu-vertical-demo"
        :router="true"
      >
        <el-menu-item
          index="contact-notice"
          :route="{ name: 'contact-notice' }"
        >
          {{ $t('notice') }}
        </el-menu-item>
        <el-menu-item index="one-inquiry" :route="{ name: 'one-inquiry' }">
          {{ $t('header.one_on_one_inquiry') }}
        </el-menu-item>
        <el-menu-item
          index="contact-history"
          :route="{ name: 'contact-history' }"
        >
          {{ $t('service_center.contact_history') }}
        </el-menu-item>
        <el-menu-item index="faq" :route="{ name: 'faq' }">
          {{ $t('partner.common_qa') }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="mobile nav">
      <el-menu
        :default-active="
          subpage_map[$route.name] ? subpage_map[$route.name] : $route.name
        "
        class="el-menu-demo"
        mode="horizontal"
        :router="true"
      >
        <el-menu-item index="one-inquiry" :route="{ name: 'one-inquiry' }">
          {{ $t('header.one_on_one_inquiry') }}
        </el-menu-item>
        <el-menu-item
          index="contact-history"
          :route="{ name: 'contact-history' }"
        >
          {{ $t('service_center.contact_history') }}
        </el-menu-item>
        <el-menu-item index="faq" :route="{ name: 'faq' }">
          {{ $t('partner.common_qa') }}
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.service-center-nav {
  box-sizing: border-box;
  float: left;
  width: 20%;
}
.service-center-nav .el-menu-item {
  font-weight: bold;
}

@media (max-width: 768px) {
  .service-center-nav {
    width: 100%;
    margin-bottom: 20px;
  }
  .mobile .el-menu-item {
    padding-right: 20px !important;
  }
  .el-menu--horizontal {
    width: 350px !important;
  }
}
</style>
