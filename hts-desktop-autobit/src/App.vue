<template>
    <div id="app" :class="{ loading: !is_inited, trade_select: !show_view }">
        <router-view v-if="is_inited && show_view" :key="locale"></router-view>
        <LineScalePulseOutRapidLoader color="#fff" size="100px" v-else-if="!is_inited"></LineScalePulseOutRapidLoader>
        <audio ref="notify" autoplay :src="notify_src"></audio>
        <modal name="trade" :clickToClose=false height="auto"
        @before-open="show_view = false"
        @closed="show_view = true" class="trade-select">
          <div class="trade-header">
            {{ $t('header.trade_method') }}
          </div>
            <div class="trade-wrap">
                <div :class="['trade-margin', { active :trade_state === 'MARGIN' }]" @click="trade_state = 'MARGIN'">
                  <img class="trade-img" src="~assets/img/margin.svg">
                  <span>{{ $t('header.margin') }}</span>
                </div>
                <div :class="['trade-future', { active: trade_state === 'FUTURES' }]" @click="trade_state = 'FUTURES'">
                  <img class="trade-img" src="~assets/img/future.png">
                  <span>{{ $t('header.future') }}</span>
                </div>
            </div>
            <div class="footer-btn">
              <a class="trade-btn" @click="handleClick">
                {{ $t('header.confirm') }}
              </a>
            </div>
        </modal>
    </div>
</template>

<style scoped>
.trade_select { background:#272A2F; height: 100%; }
    .loading { height: 100%; display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center; -ms-flex-pack: center; justify-content: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center; background: #272A2F; }
</style>

<script>
import { mapState } from 'vuex'
import { LineScalePulseOutRapidLoader } from 'vue-loaders';
import 'vue-loaders/dist/vue-loaders.css';

// import 'assets/javascripts/rMateStockChartH5.exec.js';

export default {
    name: 'app',
    data() {
        return {
            notify_src: null,
            trade_state: null,
            show_view: false,
            listen_events: ['marketUpdate', 'tradeRequest', 'tradeClear', 'tradeLink', 'tradeCancel', 'withdrawApprove', 'depositApprove'],
        }
    },
    components: { LineScalePulseOutRapidLoader },
    computed: {
        ...mapState({
            is_inited: state => state.common.is_inited,
            es: state => state.common.eventsource,
            locale: state => state.common.locale,
            trade_method: state => state.common.trade_method
        }),
    },
    watch: {
        es(to) {
            if(!to) return;

            this.attachListener();
        },
        is_inited() {
          if(this.is_inited) {
            if (this.trade_method) this.show_view = true;
            else this.$modal.show('trade');
          }
        },
    },
    mounted() {
        if(this.es) this.attachListener();
        this.trade_state = this.trade_method
    },
    beforeDestroy() {
        if(this.es) this.dettachListener();
    },
    methods: {
        handleClick() {
          if(this.trade_state) {
            this.$store.dispatch('setTradeMethod', this.trade_state)
            this.$modal.hide('trade')
          }else {
            this.$toasted.error(this.$t('header.msg_trade'))
          }
        },
        handleEvent({ type, data }) {
            data = JSON.parse(data);

            // 로딩
            switch(type) {
                case 'tradeRequest':
                case 'tradeClear':
                case 'tradeLink':
                case 'tradeCancel':
                    if(this.trade_method === 'MARGIN') {
                    this.$store.dispatch('getUnclosedTrades');

                    }else if(this.trade_method === 'FUTURES') {
                        this.$store.dispatch('getUnclosedTrades');
                        this.$store.dispatch('getFutureBalances')
                    }

                    /* eslint-diable: no-fallthrough */
                case 'withdrawApprove':
                case 'depositApprove':

                    this.$store.dispatch('getAccounts');

                    break;

                case 'marketUpdate':
                    this.$store.dispatch('updateAssetPremium', { asset: data.symbol, value: data.last_price });
                    break;
            }

            // 음성 알림
            switch(type) {
                case 'tradeRequest':
                    this.$toasted.success(this.$t('order_request', [data.trade_srls.join(', ')]));
                    this.tradeNotifyTts(data.trade_srls, this.$t('msg_received'));
                    break;
                case 'tradeClear':
                    this.$toasted.success(this.$t('liquidation_notification', [data.trade_srls.join(', ')]));
                    this.tradeNotifyTts(data.trade_srls, this.$t('msg_liquidate'));
                    break;
                case 'tradeLink':
                    this.$toasted.success(this.$t('contract_notification', [data.trade_srls.join(', ')]));
                    this.tradeNotifyTts(data.trade_srls, this.$t('mgs_contract'));
                    break;
                case 'tradeCancel':
                    this.$toasted.success(this.$t('cancel_notification', [data.trade_srls.join(', ')]));
                    this.tradeNotifyTts(data.trade_srls, this.$t('msg_canceled'));
                    break;
                case 'withdrawApprove':
                    this.$toasted.success(this.$t('withdrawal_approval', [data.withdraw_srls.join(', ')]));
                    this.notifyTts(this.$t('msg_withdrawal_application_cancel'));
                    break;
                case 'depositApprove':
                    this.$toasted.success(this.$t('deposit_approval', [data.deposit_srls.join(', ')]));
                    this.notifyTts(this.$t('msg_deposit_application_cancel'));
                    break;
            }
        },

        attachListener() {
            this.listen_events.forEach((event_name) => this.es.addEventListener(event_name, this.handleEvent))
        },

        dettachListener() {
            this.listen_events.forEach((event_name) => this.es.removeEventListener(event_name, this.handleEvent))
        },

        notifyTts(text) {
            this.notify_src = `https://api.ispeech.org/api/rest?apikey=34b06ef0ba220c09a817fe7924575123&action=convert&voice=krkoreanfemale&speed=0&pitch=100&text=${encodeURIComponent(text)}`;

            this.$refs.notify.load();
            // this.$refs.notify.play();
        },

        tradeNotifyTts(trade_srls, tail) {

            if(trade_srls.length > 1) {
                this.notifyTts(this.$t('tts.trade_notify_multi', [(trade_srls[0] + '').split('').join(', '), trade_srls.length - 1, tail]));
            } else {
                this.notifyTts(this.$t('tts.trade_notify_single', [(trade_srls[0] + '').split('').join(', '), tail]));
            }
        },
    }
}
</script>
