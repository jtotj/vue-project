<template>
  <tr>
    <td>{{ c_account_info.account_number }}</td>
    <td>{{ c_asset_info.asset_title }}</td>
    <td>{{ options.min_trade_cnt }}</td>
    <td>{{ options.max_trade_cnt }}</td>
    <td>{{ options.min_tick_amt }}</td>
    <td>{{ options.max_tick_amt }}</td>
    <td>{{ c_trade_srls.length }}</td>
    <td>
      <button class="pure-button" @click="$emit('delete')">삭제</button>
    </td>
  </tr>
</template>

<style scoped src="purecss/build/pure-min.css"></style>

<script>
import _ from 'lodash';
import php from 'phpjs';
import { mapGetters, mapState } from 'vuex';
import { createTrade, cancelTrade, clearTrade } from '@/api/trade';

export default {
  props: ['options'],
  name: 'BotRunner',
  created() {
    this.startInterval();
    this.attachListener();
  },
  beforeDestroy() {
    this.endInterval();
    this.dettachListener();
    this.closeAll();
  },
  data() {
    return {
      trades: {},
      interval_key: null,
      listen_events: ['tradeClear', 'tradeLink', 'tradeCancel', 'orderbooks'],
    };
  },
  computed: {
    ...mapGetters(['accounts', 'asset_list']),
    ...mapState({
      premiums: state => state.asset.premiums,
      constants: state => state.common.constants,
      unclosed_trades: ({ trade }) => trade.unclosed_trades,
      es: state => state.common.eventsource,
      asset_settings: state => state.asset.settings,
    }),
    c_account_info() {
      return _.find(this.accounts, { account_srl: this.options.account_srl });
    },
    c_asset_info() {
      return this.asset_list[this.options.asset];
    },
    c_trade_srls() {
      return _.map(Object.keys(this.trades), val => val * 1);
    },
    c_tick_pendings() {
      return _.chain(this.trades)
        .map('tick')
        .uniq()
        .map(tick => {
          const tick_trades = _.filter(this.trades, { tick });
          return [
            tick,
            {
              tick,
              amount: _.sumBy(tick_trades, 'amount'),
              trade_srls: _.map(tick_trades, 'trade_srl'),
            },
          ];
        })
        .fromPairs()
        .value();
    },
    c_min_tick_amt() {
      return this.options.min_tick_amt / Math.pow(10, this.options.decimal_count);
    },
    c_max_tick_amt() {
      return this.options.max_tick_amt / Math.pow(10, this.options.decimal_count);
    },
    asset_setting() {
      return this.asset_settings[this.options.asset];
    },
    premium() {
      return this.premiums[this.options.asset];
    },
    current_tick() {
      return this.premiumToTick(this.asset_setting, this.premium);
    },
    ticks() {
        var premium = this.premium;
        if(!premium) return [];

        var asset_setting = this.asset_setting;
        var ticked_premium = this.current_tick;

        var ticks = [];

        // 매도 호가
        for(let i = 10; i > 0; i--) {
          let tick = ticked_premium + i * asset_setting.tick_unit;
          let { amount = 0, trade_srls = [] } = this.c_tick_pendings[tick] || {};

          ticks.push({ premium: tick, type: 'PUT', amount, trade_srls });
        }

        // 현재 호가
        // ticks.push({ premium: ticked_premium, type: this.current_tick > this.past_tick ? 'CALL' : 'PUT' });

        // 매수 호가
        for(let i = 1; i <= 10; i++) {
          let tick = ticked_premium - i * asset_setting.tick_unit;
          let { amount = 0, trade_srls = [] } = this.c_tick_pendings[tick] || {};

          ticks.push({ premium: tick, type: 'CALL', amount, trade_srls });
        }

        return ticks;
    },
  },
  methods: {
    handleEvent({ type, data }) {
      data = JSON.parse(data);

      switch(type) {
        // 체결되자마자 청산
        case 'tradeLink':
          Promise.all(data.trade_srls.map(val => this.closeTrade(val, 'LINKED')));
          break;

        case 'tradeClear':
        case 'tradeCancel':
          data.trade_srls.forEach(val => this.removeTrade(val))
          break;
        case 'orderbooks':
          // if(data.asset != this.selected_asset) {
          //   return;
          // }
          // this.orderbooks.call = data.orderbooks.CALL;
          // this.orderbooks.put = data.orderbooks.PUT;

          break;
      }
    },

    async cancel(trade_srl) {
      await cancelTrade(trade_srl);
    },

    async clear(trade_srl) {
      await clearTrade(trade_srl);
    },

    async closeTrade(trade_srl, status) {
      if (this.c_trade_srls.indexOf(trade_srl) === -1) return;

      if (!status) {
        let trade_info = _.find(this.unclosed_trades, { trade_srl });
        status = trade_info.status;
      }

      switch (status) {
        case 'LINKED':
          await this.clear(trade_srl);
          break;
        case 'PENDING':
          await this.cancel(trade_srl);
          break;
      }
    },

    async closeAll() {
      for (const trade_srl of this.trade_srls) {
        await this.closeTrade(trade_srl);
      }
    },

    async create(position, tick, amount) {

      const { trade_srl } = await createTrade({
        account_srl: this.options.account_srl,
        asset: this.options.asset,
        position,
        amount,
        tick,
      });

      // 주문 요청 후 틱당 최대 주문 갯수 제한 확인
      const { trade_srls: tick_trade_srls = [] } = this.c_tick_pendings[tick] || {};

      this.addTrade(trade_srl, tick, amount);

      if (tick_trade_srls > this.options.max_trade_cnt) {
        await this.closeTrade([ ...tick_trade_srls ].pop());
      }
    },

    async addTradeToEachTick() {
      // 각 틱마다 주문 1개씩 삽입
      await Promise.all(this.ticks.map(async({ amount: current_amount, premium, type, trade_srls }) => {
        // 현재 수량과 최대 최소 수량을 계산하여 랜덤으로 수량 뽑아내기
        const amount = php.mt_rand(
          Math.max(this.options.min_tick_amt - current_amount * Math.pow(10, this.options.decimal_count), 0),
          Math.max(this.options.max_tick_amt - current_amount * Math.pow(10, this.options.decimal_count), 0),
        ) / Math.pow(10, this.options.decimal_count);

        // 수량이 0이면 리턴~
        const add_trade = php.mt_rand(0, 1);
        if (amount && add_trade) {
          // 주문 요청
          await this.create(type, premium, amount);
        } else if(trade_srls.length > this.options.min_trade_cnt && current_amount > this.c_min_tick_amt) {
          await this.closeTrade([...trade_srls].shift());
        }
      }))
    },

    startInterval() {
      this.interval_key = setInterval(() => {
        this.addTradeToEachTick();
      }, this.options.interval * 1000);
    },

    endInterval() {
      clearInterval(this.interval_key);
    },

    removeTrade(trade_srl) {
      this.$delete(this.trades, trade_srl);
    },

    addTrade(trade_srl, tick, amount) {
      this.$set(this.trades, trade_srl, { trade_srl, tick, amount });
    },

    attachListener() {
      this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
    },

    dettachListener() {
      this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
    },
    premiumToTick(asset_setting, premium) {
      return ((premium / asset_setting.tick_unit) | 0) * asset_setting.tick_unit;
    },
  }
};
</script>
