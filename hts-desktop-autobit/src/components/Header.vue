<template>
  <header>
    <!-- <NoticeTicker></NoticeTicker> -->
      <div :class="[c_long_locale ? 'long_wrapper' : '', 'wrapper']">
      <h1 class="logo">
        <router-link :to="{ name: 'index' }"><img :src="logoImg" alt="logo"></router-link>
      </h1>
      <nav class="gnb">
        <ul>
          <li>
            <router-link :to="{ name: 'traderoom' }">{{ $t('header.traderoom') }}</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'balances' }">{{ $t('equity_io') }}</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'invest' }">{{ $t('trade_history') }}</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'mypage' }">{{ $t('account_management') }}</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'cs' }">{{ $t('notice') }}</router-link>
          </li>
          <!-- <li>
            <a href="https://cocofx.com/about_platform" target="_blank">{{ $t('manual') }}</a>
          </li> -->
          <li v-if="0">
            <a href="#" @click.prevent>{{ $t('event') }}</a>
            <ul>
              <li><a href="//cocofx.com/bugReport?layout=none" @click.prevent="popopen($event.target.href)">{{ $t('bug_report') }}</a></li>
              <li><a href="//cocofx.com/mockTradeRequest?act=dispBoardWrite" @click.prevent="popopen($event.target.href)">{{ $t('mock_investment_competition') }}</a></li>
              <li><a href="//cocofx.com/CIBRequest?act=dispBoardWrite" @click.prevent="popopen($event.target.href)">{{ $t('apply_membership') }}</a></li>
            </ul>
          </li>
        </ul>
      </nav>
      <div class="util">
        <!-- <a @click="tradeOpen">{{$t('header.trade_method')}}</a> -->
        <div v-if="is_logged && show_accounts" ref="type_sel" @click="show_options = !show_options" :class="['type_sel', { on: show_options }]">
          <strong><span>{{ s_account_info ? `${fromPairs(constants.trade.trade_types)[s_account_info.trade_type]}: ${s_account_info.account_number}` : $t('cmd_select_account') }}</span><i class="fa fa-caret-down"></i></strong>
          <ul v-if="c_trade_type_account.length">
            <li @click="selectAccount(account.account_srl)" v-for="account in c_trade_type_account">{{ fromPairs(constants.account.trade_types)[account.trade_type] }}[{{ fromPairs(constants.account.account_types)[account.account_type]}}]: <span> {{ account.account_number }}</span></li>
            <li>
              <a href="#" @click.prevent="contact">{{ $t('account_application') }}</a>
            </li>
          </ul>
          <ul v-else class="account-none"> 
            <li>
              <a href="#" @click.prevent="contact">{{ $t('account_application') }}</a>
            </li>
          </ul>
        </div>

        <LocaleSelect></LocaleSelect>
        <a href="#" @click.prevent="logout" v-if="is_logged">{{ $t('logout') }}</a>
        <template v-else>
          <router-link :to="{ name: 'login' }">{{ $t('login') }}/{{ $t('membership') }}</router-link>
          <router-link v-if="0" :to="{ name: 'join' }" class="header_membership">{{ $t('membership') }}</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';
  import LocaleSelect from '@/components/LocaleSelect';
  import { getParentNodes } from '@/utils/dom';
  import filter from 'lodash/filter'
  import NoticeTicker from '@/components/notice-ticker'
  export default {
    props: ['show_accounts'],
    name: 'LayoutHeader',
    components: { LocaleSelect, NoticeTicker },
    computed: {
      ...mapGetters(['is_logged', 'accounts', 'constants', 's_account_info']),
      ...mapState({
        trade_method: state => state.common.trade_method,
        locale: state => state.common.locale,
      }),
      c_trade_type_account() {
        return filter(this.accounts, {trade_type: this.trade_method})
      },
      logoImg() {
        return this.trade_method === 'MARGIN' ? require('assets/img/autobitlogo_w.png') : require('assets/img/autobitlogo_w.png')
      },
      c_long_locale() {
        let longLocale = [ 'en-US', 'fr-FR', 'de-DE', 'pt-BR', 'es-ES', 'vi-VN' ]
        return longLocale.find(el => el === this.locale) === undefined ? null : true
      }
    },
    data() {
      return {
        show_options: false,
        is_locale_opened: false,
      }
    },
    beforeMount() {
      document.body.addEventListener('click', this.onBodyClick);
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.onBodyClick);
    },
    methods: {
      contact() {
        this.$router.push({name: 'contact', params: {cmd_enter_title_account: this.$t('cmd_enter_title_account')}})
      },
      logout() {
        return this.$store.dispatch('LogOut');
      },
      onBodyClick(e) {
        var parentNodes = getParentNodes(e.target);
        var chk1 = e.target != this.$refs.type_sel;
        var chk2 = !~parentNodes.indexOf(this.$refs.type_sel);

        if (chk1 && chk2) this.show_options = false;
        // var chk2 = $(e.target).parents(".type_sel").length == 0;
        // if(chk1 && chk2){
        //     $(".type_sel").removeClass("on");
        // }
      },
      selectAccount(account_srl) {
        this.$store.dispatch('selectAccount', account_srl);
      },

      popopen(href) {
        window.open(href, 'FindAccount', 'width=800,height=1000');
      },
      tradeOpen() {
        this.$modal.show('trade')
      },
    }
  }

</script>
