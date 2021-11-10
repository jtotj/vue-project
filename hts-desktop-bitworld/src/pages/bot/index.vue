<template>
  <div class="bot">
    <table class="pure-table pure-table-bordered" cellpadding="0" cellspacing="0" border="1">
      <thead>
        <tr>
          <th>계좌</th>
          <th>대상 종목</th>
          <th>최소 주문 갯수</th>
          <th>최대 주문 갯수</th>
          <th>틱당 최소 대기 수량</th>
          <th>틱당 최대 대기 수량</th>
          <th>전체 주문 갯수</th>
          <th><button class="pure-button pure-button-active" @click.prevent="show_form = !show_form">추가</button></th>
        </tr>
      </thead>
      <tbody>
        <tr @delete="remove(idx)" v-for="(val, idx) in list" is="runner" :options="val"></tr>
      </tbody>
    </table>
    <form v-if="show_form" class="pure-form pure-form-stacked" @submit.prevent="add()">
      <fieldset>
        <legend>봇 추가</legend>

        <div class="pure-g">
          <div class="pure-u-1-3">
            <label>대상계좌</label>
            <select v-model="temp.account_srl" class="pure-u-23-24" required>
              <option :value="null">선택</option>
              <option v-for="({ account_srl, account_number }, asset) in accounts" :value="account_srl">{{ account_number }}</option>
            </select>
          </div>

          <div class="pure-u-1-3">
            <label>대상종목</label>
            <select v-model="temp.asset" class="pure-u-23-24" required>
              <option :value="null">선택</option>
              <option v-for="({ asset_title }, asset) in asset_list" v-if="asset_title" :value="asset">{{ asset_title }}</option>
            </select>
          </div>

          <div class="pure-u-1-3">
            <label>최소 주문 갯수</label>
            <input class="pure-u-23-24" v-model.number="temp.min_trade_cnt" type="text" required>
          </div>

          <div class="pure-u-1-3">
            <label>최대 주문 갯수</label>
            <input class="pure-u-23-24" v-model.number="temp.max_trade_cnt" type="text" required>
          </div>

          <div class="pure-u-1-3">
            <label>틱당 최소 대기 수량</label>
            <input class="pure-u-23-24" v-model.number="temp.min_tick_amt" type="text" required>
          </div>

          <div class="pure-u-1-3">
            <label>틱당 최대 대기 수량</label>
            <input class="pure-u-23-24" v-model.number="temp.max_tick_amt" type="text" required>
          </div>
          
          <div class="pure-u-1-3">
            <label>인터벌</label>
            <input class="pure-u-23-24" v-model.number="temp.interval" type="text" required>
          </div>

          <div class="pure-u-1-3">
            <label>소숫점 자릿수</label>
            <input class="pure-u-23-24" v-model.number="temp.decimal_count" type="text" required>
          </div>
        </div>

        <button type="submit" class="pure-button pure-button-primary">확인</button>
        <button class="pure-button" @click.prevent="show_form = false">취소</button>
      </fieldset>
    </form>
    <button class="pure-button" @click.prevent="closeAll">전체 주문 종결 처리</button>
  </div>
</template>

<style scoped>
  div.bot { width: 900px; margin: 0 auto; }
  table { width: 100%; }
</style>
<style scoped src="purecss/build/pure-min.css"></style>

<script>
import { mapGetters, mapState } from 'vuex';
import { cancelTrade, clearTrade } from '@/api/trade';
import Runner from '@/pages/bot/Runner';
// import _ from 'lodash';

export default {
  name: 'bot',
  components: { Runner },
  data() {
    return {
      show_form: false,
      list: [],
      temp: {},
      min_trade_cnt: 1,
      interval: 5,
      max_trade_cnt: 0,
      min_tick_amt: 0,
      max_tick_amt: 0,
      decimal_count: 3,
    };
  },
  computed: {
    ...mapGetters(['asset_list', 'accounts']),
    ...mapState({
      unclosed_trades: ({ trade }) => trade.unclosed_trades,
    }),
  },
  watch: {
    show_form(to) {
      this.resetTemp();
    },
  },
  methods: {
    resetTemp() {
      this.temp = {
        account_srl: null,
        asset: null,
      }
    },
    add() {
      this.list.push({ ...this.temp });
      this.show_form = false;
    },
    remove(idx) {
      this.list.splice(idx, 1);
    },
    async closeAll() {
      for (const { trade_srl, status } of this.unclosed_trades) {
        if (status === 'PENDING') {
          await cancelTrade(trade_srl);
        } else {
          await clearTrade(trade_srl);
        }
      }
      // _.map(this.unclosed_trades, ({ trade_srl, status }) => status === 'PENDING' ? cancelTrade(trade_srl) : clearTrade(trade_srl));
    },
  }
};
</script>
