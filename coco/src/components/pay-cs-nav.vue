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
  <div class="left-wrap">
    <div class="left-menu-el">
      <el-menu
        :default-active="$route.name"
        class="el-menu-vertical-demo"
        @select="menuSelect"
      >
        <el-menu-item index="Csnotice">
          <span>{{ $t('notice') }}</span>
        </el-menu-item>
        <el-menu-item index="Csinquiry">
          <span>{{ $t('header.one_on_one_inquiry') }}</span>
        </el-menu-item>
        <el-menu-item index="Cshistory">
          <span>{{ $t('header.inquiry_history') }}</span>
        </el-menu-item>
        <el-menu-item index="Csfaq">
          <span>{{ $t('partner.common_qa') }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <ul class="use-hours">
      <li>
        <h4>{{ $t('cocopay.cs_hours') }}</h4>
        <p>10:00 - 19:00</p>
        <p>{{ $t('all_day_long') }}</p>
      </li>
      <div class="line"></div>
      <li>
        <h4>{{ $t('cocopay.cs_online_hours_txt') }}</h4>
        <p v-html="$t('cocopay.cs_online_hours')"></p>
      </li>
      <div class="line"></div>
      <li>
        <h4>{{ $t('offline_hours') }}</h4>
        <p>10:00 - 19:00</p>
        <p>{{ $t('offline_bank_hours') }}</p>
      </li>
    </ul>
  </div>
</template>
