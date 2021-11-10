<script>
export default {}
</script>

<template>
  <div class="tabs">
    <ul>
      <li>
        <router-link
          :to="{
            name: 'deposit',
          }"
        >
          <span class="tab-text">{{ $t('wallet_page.deposit_list') }}</span>
        </router-link>
      </li>

      <li>
        <router-link
          :to="{
            name: 'withdraw',
          }"
        >
          <span class="tab-text">{{ $t('wallet_page.withdraw_list') }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.tabs {
  margin-bottom: 20px;
  text-align: center;
  word-break: break-all;
}
.tabs li {
  position: relative;
  display: table;
  float: left;
  width: 50%;
  height: 45px;
  background-color: #e7e7e7;
}
.tabs ul::after {
  display: block;
  clear: both;
  content: '';
}
.tabs li a {
  box-sizing: border-box;
  display: table-cell;
  width: 100%;
  padding: 0 10px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
.tabs li a.router-link-active {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
  height: 45px;
  background-color: #fff;
  border-bottom: 2px solid #0068c1;
}
.tabs li a.router-link-active span {
  color: #0068c1;
}
</style>
