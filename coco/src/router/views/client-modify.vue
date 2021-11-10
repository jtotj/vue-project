<template>
  <form v-loading="loading" :class="[$style.clientWrap]">
    <h2 :class="[$style.clientName]">사용자 명</h2>
    <div :class="[$style.clientSetWrap]">
      <h2 :class="[$style.clientName]">권한</h2>
      <div :class="[$style.checkWrap]">
        <input :class="[$style.clientSet]" type="checkbox" />
        <label :class="[$style.clientSet]"><span>implicit</span></label>
      </div>
      <div :class="[$style.checkWrap]">
        <input :class="[$style.clientSet]" type="checkbox" />
        <label :class="[$style.clientSet]"><span>password</span></label>
      </div>
      <div>
        <input :class="[$style.clientSet]" type="checkbox" />
        <label :class="[$style.clientSet]"
          ><span>client_credentials</span></label
        >
      </div>
      <div :class="[$style.checkWrap]">
        <input :class="[$style.clientSet]" type="checkbox" />
        <label :class="[$style.clientSet]"
          ><span>authorization_code</span></label
        >
      </div>
      <input :class="[$style.clientUri]" placeholder="redirect URI" />
      <button :class="[$style.clientReg]" @click="setRegister">등록</button>
      <button :class="[$style.clientMod]" @click="setModify">수정</button>
    </div>
  </form>
</template>

<script>
export default {
  methods: {
    setRegister() {
      this.$router.push({ name: 'client-manage' })
    },
    setModify() {
      this.$router.push({ name: 'client-manage' })
    },
  },
}
</script>

<style lang="scss" module>
@import '@design';

.clientWrap {
  box-sizing: border-box;
  width: 500px;
  padding: 20px 20px;
  margin: 0 auto;
  margin-top: 40px;
  border: 1px solid #bbbfc7;
}
.clientSetWrap {
  padding: 10px 15px;
  margin-top: 10px;
  border: 1px solid #bbbfc7;
}
.clientName {
  margin: 0;
  font-size: 18px;
}
.clientSet {
  margin-right: 5px;
  margin-bottom: 10px;
  font-size: 15px;
}
.clientUri {
  display: block;
  width: 100%;
  height: 40px;
  padding: 0 10px;
  margin-top: 10px;
  margin-bottom: 30px;
  line-height: 40px;
  border: 1px solid #b5b5b6;
  border-radius: 3px;
  transition: box-shadow 0.1s ease, -webkit-box-shadow 0.1s ease;
}
.clientReg {
  width: 50px;
  height: 30px;
  margin-bottom: 10px;
  color: #fff;
  cursor: pointer;
  background-color: #376ffc;
  border: none;
  border-radius: 2px;
}
.clientMod {
  float: right;
  width: 50px;
  height: 30px;
  color: #fff;
  cursor: pointer;
  background-color: green;
  border: none;
  border-radius: 2px;
}
</style>
