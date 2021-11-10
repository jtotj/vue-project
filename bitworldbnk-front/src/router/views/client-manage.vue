<template>
  <form v-loading="loading" :class="[$style.clientWrap]">
    <h1 :class="[$style.clientTitle]">클라이언트 관리</h1>
    <table :class="[$style.clientTable]">
      <thead :class="[$style.clientHead]">
        <tr>
          <td>등록일</td>
          <td>Client ID</td>
          <td>Client Secret</td>
          <td>Grant</td>
          <td>Redirect URI</td>
          <td>수정/삭제</td>
        </tr>
      </thead>
      <tbody :class="[$style.clientBody]">
        <tr>
          <td>2019-05-13 13:00:00</td>
          <td>ABC</td>
          <td>Client Secret</td>
          <td>사용자</td>
          <td>Redirect URI</td>
          <td>
            <button :class="[$style.clientModify]" @click="goModify"
              >수정</button
            >
            <button :class="[$style.clientDelete]">삭제</button>
          </td>
        </tr>
        <tr>
          <td>2019-05-13 14:00:00</td>
          <td>DEF</td>
          <td>Client Secret</td>
          <td>사용자</td>
          <td>Redirect URI</td>
          <td>
            <button :class="[$style.clientModify]" @click="goModify"
              >수정</button
            >
            <button :class="[$style.clientDelete]">삭제</button>
          </td>
        </tr>
        <tr>
          <td>2019-05-13 15:00:00</td>
          <td>GHI</td>
          <td>Client Secret</td>
          <td>사용자</td>
          <td>Redirect URI</td>
          <td>
            <button :class="[$style.clientModify]" @click="goModify"
              >수정</button
            >
            <button :class="[$style.clientDelete]">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</template>

<script>
export default {
  methods: {
    goModify() {
      this.$router.push({ name: 'client-modify' })
    },
  },
}
</script>

<style lang="scss" module>
@import '@design';

.clientWrap {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 20px;
  margin-top: 10px;
  border: 1px solid #bbbfc7;
}
.clientTitle {
  margin: 0;
  font-size: 20px;
}
.clientTable {
  width: 100%;
  border-spacing: 0;
  border: 1px solid #bbbfc7;
  border-bottom: 0;
}
.clientHead td {
  width: 10%;
  height: 50px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  background-color: green;
  border-bottom: 1px solid #bbbfc7;
}
.clientBody td {
  height: 50px;
  text-align: center;
  border-right: 1px solid #bbbfc7;
  border-bottom: 1px solid #bbbfc7;
}

.clientHead td:nth-child(5) {
  width: 20%;
}
.clientModify {
  width: 50px;
  height: 40px;
  margin-right: 10px;
  color: #fff;
  background-color: green;
  border: none;
  border-radius: 3px;
}
.clientDelete {
  width: 50px;
  height: 40px;
  color: #fff;
  background-color: red;
  border: none;
  border-radius: 3px;
}
</style>
