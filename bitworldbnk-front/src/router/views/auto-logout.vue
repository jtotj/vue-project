<script>
export default {
  page: {
    title: 'AutoLogout',
    meta: [{ name: 'description', content: 'AutoLogout' }],
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="logout-info">
        <div class="title"
          ><h3><span>자동로그아웃</span>안내</h3></div
        >
        <div class="content"
          >회원한 안전한 서비스 이용을 위해 로그인 후 약 1분 동안 서비스
          이용이없어 자동 로그아웃 되었습니다.</div
        >
        <div class="btn-wrap">
          <router-link :to="{ name: 'login-me' }" class="btn"
            >다시로그인</router-link
          >
          <router-link :to="{ name: 'home' }" class="btn-grey marginL-10"
            >초기화면 이동</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.logout-info {
  padding: 20px 10px;
  text-align: center;
}
.logout-info .title span {
  color: #0068c1;
}
</style>
