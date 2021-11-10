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
        <el-menu-item index="Certikyc">
          <span>{{ $t('kyc.kyc_enroll') }}</span>
        </el-menu-item>
        <el-menu-item index="Certiemail">
          <span>{{ $t('cocopay.q_mailcert') }}</span>
        </el-menu-item>
        <el-menu-item index="Certiotp">
          <span>{{ $t('cocopay.q_otp') }}</span>
        </el-menu-item>
        <el-menu-item index="Certiaddr">
          <span>{{ $t('kyc.withdraw_auth') }}</span>
        </el-menu-item>
        <el-menu-item index="Securityrating">
          <span>{{ $t('cocopay.q_seculevel') }}</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
