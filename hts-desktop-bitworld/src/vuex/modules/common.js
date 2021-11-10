import EventSource from '@/classes/ReconnectingEventSource'
import { locales } from '@/locales';
import { getLocale, setLocale } from '@/utils/locale';
import php from 'phpjs';
import Cookies from 'js-cookie'

const query = {};

php.parse_str(php.parse_url(window.location.href, 'PHP_URL_QUERY') || '', query);

const state = {
  constants: {},
  request_count: 0,
  eventsource: new EventSource(process.env.BASE_API + '/api/stream'),
  is_inited: false,
  inviter_code: null,
  locales,
  locale: getLocale(),
  news: [],
  trade_method: Cookies.get('trade_method') ? Cookies.get('trade_method') : 'MARGIN',
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  constants(state, constants) {

    state.constants = constants;
  },

  increase_request(state) {
    state.request_count++;
  },

  decrease_request(state) {
    state.request_count--;
  },
  set_event_source(state, data) {
    state.eventsource._start();
  },
  SET_IS_INITED(state, is_inited) {
    state.is_inited = is_inited;
  },
  SET_NEWS(state, news) {
    state.news = news;
  },
  SET_INVITER_CODE(state, inviter_code) {
    state.inviter_code = inviter_code;
  },
  SET_LOCALE(state, locale) {
    state.locale = locale;
    setLocale(locale);
  },
  SET_TRADE_METHOD(state, newValue) {
    state.trade_method = newValue;
    Cookies.set('trade_method', newValue)
  },
  SET_WITHDARW_DEPOSIT_LOCALE(state) {
    if (state.locale === 'zh-CN') {
      state.constants.deposit.statuses = [
        ['PENDING', '等待'],
        ['REJECTED', '驳回'],
        ['CANCELD', '取消'],
        ['APPROVED', '承认'],
      ]
      state.constants.withdraw.statuses = [
        ['PENDING', '等待'],
        ['REJECTED', '驳回'],
        ['CANCELD', '取消'],
        ['APPROVED', '承认'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.deposit.statuses = [
        ['PENDING', '等待'],
        ['REJECTED', '駁回'],
        ['CANCELD', '取消'],
        ['APPROVED', '承認'],
      ]
      state.constants.withdraw.statuses = [
        ['PENDING', '等待'],
        ['REJECTED', '駁回'],
        ['CANCELD', '取消'],
        ['APPROVED', '承認'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.deposit.statuses = [
        ['PENDING', 'Hold'],
        ['REJECTED', 'Reject'],
        ['CANCELD', 'Cancel'],
        ['APPROVED', 'Accept'],
      ]
      state.constants.withdraw.statuses = [
        ['PENDING', 'Hold'],
        ['REJECTED', 'Reject'],
        ['CANCELD', 'Cancel'],
        ['APPROVED', 'Accept'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.deposit.statuses = [
        ['PENDING', '待機'],
        ['REJECTED', '返却'],
        ['CANCELD', '取り消し'],
        ['APPROVED', '承認'],
      ]
      state.constants.withdraw.statuses = [
        ['PENDING', '待機'],
        ['REJECTED', '返却'],
        ['CANCELD', '取り消し'],
        ['APPROVED', '承認'],
      ]
    }
  },
  SET_ACCOUNT_LOCALE(state) {
    if (state.locale === 'zh-CN') {
      state.constants.account.account_types = [
        ['DEMO', '演示'],
        ['REAL', '真实'],
      ]
      state.constants.account.trade_types = [
        ['MARGIN', '保证金交易专用'],
        ['FUTURES', '期货交易专用'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.account.account_types = [
        ['DEMO', '演示'],
        ['REAL', '真實'],
      ]
      state.constants.account.trade_types = [
        ['MARGIN', '保證金交易專用'],
        ['FUTURES', '期貨交易專用'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.account.account_types = [
        ['DEMO', 'Demo'],
        ['REAL', 'Real'],
      ]
      state.constants.account.trade_types = [
        ['MARGIN', 'Margin trading'],
        ['FUTURES', 'Futures trading'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.account.account_types = [
        ['DEMO', 'デモ'],
        ['REAL', 'リアル'],
      ]
      state.constants.account.trade_types = [
        ['MARGIN', 'マージン取引専用'],
        ['FUTURES', '先物取引専用'],
      ]
    }
  },
  SET_TRADE_LOCALE(state) {
    if (state.locale === 'zh-CN') {
      state.constants.trade.positions = [
        ['CALL', '买入'],
        ['PUT', '卖出'],
      ]
      state.constants.trade.trade_types = [
        ['MARGIN', '保证金'],
        ['FUTURES', '期货'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.trade.positions = [
        ['CALL', '買入'],
        ['PUT', '賣出'],
      ]
      state.constants.trade.trade_types = [
        ['MARGIN', '保證金'],
        ['FUTURES', '期貨'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.trade.positions = [
        ['CALL', '買い'],
        ['PUT', '売り'],
      ]
      state.constants.trade.trade_types = [
        ['MARGIN', 'マージン'],
        ['FUTURES', '先物'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.trade.positions = [
        ['CALL', 'Buy'],
        ['PUT', 'Sell'],
      ]
      state.constants.trade.trade_types = [
        ['MARGIN', 'Margin'],
        ['FUTURES', 'Futures'],
      ]
    }
  },
}

export default {
  state,
  mutations
}
