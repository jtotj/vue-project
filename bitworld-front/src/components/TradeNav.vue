<script>
export default {}
</script>

<template>
  <div class="tabs">
    <ul>
      <li>
        <router-link :to="{ name: 'privateDeal' }">
          <span class="tab-text">{{ $t('private.deal_list') }}</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'privateApplication' }">
          <span class="tab-text">{{ $t('private.app_list') }}</span>
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
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}
.tabs li .router-link-exact-active {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
  box-sizing: border-box;
  height: 45px;
  color: #333;
  background-color: #fff;
  border-bottom: 2px solid #0068c1;
}
</style>
