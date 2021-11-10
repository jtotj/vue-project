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
  }
}

export default {
  state,
  mutations
}
