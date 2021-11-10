<script>
export default {
  data() {
    return {
      subpage_map: {
        'pay-contact-detail': 'pay-contact-history',
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
          index="pay-one-inquiry"
          :route="{ name: 'pay-one-inquiry' }"
        >
          {{ $t('header.one_on_one_inquiry') }}
        </el-menu-item>
        <el-menu-item
          index="pay-contact-history"
          :route="{ name: 'pay-contact-history' }"
        >
          {{ $t('service_center.contact_history') }}
        </el-menu-item>
        <el-menu-item index="pay-faq" :route="{ name: 'pay-faq' }">
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
        <el-menu-item
          index="pay-one-inquiry"
          :route="{ name: 'pay-one-inquiry' }"
        >
          {{ $t('header.one_on_one_inquiry') }}
        </el-menu-item>
        <el-menu-item
          index="pay-contact-history"
          :route="{ name: 'pay-contact-history' }"
        >
          {{ $t('service_center.contact_history') }}
        </el-menu-item>
        <el-menu-item index="pay-faq" :route="{ name: 'pay-faq' }">
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
  padding: 20px;
  background-color: white;
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
