import * as loginApi from '@/api/login';
import * as tradeApi from '@/api/trade';
import * as accountApi from '@/api/account';
import * as settingApi from '@/api/setting';
import * as assetApi from '@/api/asset';
import * as documentApi from '@/api/document';
import * as constantApi from '@/api/constant';
import * as futureApi from '@/api/futures';
import { fetchOtps } from '@/api/otp';
import Vue from 'vue'
import VueCookies from 'vue-cookies'
import _ from 'lodash';

Vue.use(VueCookies)

export const LoginByUserId = async({ commit, dispatch }, user_info) => {
  const username = user_info.user_id.trim();

  var ret_obj = await loginApi.loginByUserId(username, user_info.password, user_info.otp_token, user_info.loginkey);
  if (ret_obj.otp_token_required) {
    return ret_obj;
  }

  await dispatch('getEventSource');
  await dispatch('GetOtps');

  return ret_obj;
}

export const GetUserInfo = ({ commit }) => {
  return new Promise((resolve, reject) => {
    loginApi.getUserInfo().then((ret_obj) => {
      if (!ret_obj) {
        reject('error');
      }
      commit('SET_LOGGED_INFO', ret_obj.logged_info);

      resolve(ret_obj.logged_info);
    }).catch((error) => {
      reject(error);
    });
  });
}

export const LogOut = ({ commit, dispatch }) => {
  return new Promise((resolve, reject) => {
    loginApi.logout().then(() => {
      commit('SET_LOGGED_INFO', {});
      commit('SET_OTPS', 0);
      commit('accounts', []);
      commit('set_account_srl', null);
      commit('unclosed_trades', []);
      resolve();
    }).catch((error) => {
      reject(error);
    })
  });
}

export const getUnclosedTrades = ({ commit, getters }) => {
  if(!getters.is_logged) {
    commit('unclosed_trades', []);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
   tradeApi.fetchUnclosedTrades().then(({ data }) => {
      commit('unclosed_trades', data);
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}

export const getFutureBalances = ({ commit, getters }) => {
  if(!getters.is_logged) return Promise.resolve();

  return new Promise((resolve, reject) => {
   futureApi.fetchFutureBalance().then(({ data }) => {
      commit('future_balances', data);
      resolve(data);
    }).catch((error) => {
      reject(error);
    });
  });
}

export const getAccounts = ({ commit, getters }) => {
  if(!getters.is_logged) {
    commit('accounts', []);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
   accountApi.fetchAccounts().then(({ accounts }) => {
      commit('accounts', accounts);
      resolve(accounts);
    }).catch((error) => {
      reject(error);
    });
  });
}

export const getAccountSetting = ({ commit }) => {
  settingApi.fetchSetting('account').then(({ setting }) => {
    commit('SET_ACCOUNT_SETTING', setting);
  })
}

export const selectAccount = ({ commit }, account_srl) => {
  return new Promise((resolve) => {
    commit('set_account_srl', account_srl);
    resolve();
  })
}

export const selectAsset = ({ commit }, asset) => {
  return new Promise((resolve) => {
    commit('s_asset', asset);
    resolve();
  })
}

export const setAutoClear = ({ commit }, { trade_srl, auto_clear_tick }) => {
  return new Promise((resolve, reject) => {
    tradeApi.setAutoClear(trade_srl, auto_clear_tick).then((ret_obj) => {

      commit('update_trade', { trade_srl, data: { auto_clear_tick, use_auto_clear: 'Y' } });
      resolve(ret_obj);
    }).catch(reject)
  })
}

export const unsetAutoClear = ({ commit }, trade_srl) => {
  return new Promise((resolve, reject) => {
    tradeApi.unsetAutoClear(trade_srl).then((ret_obj) => {

      commit('update_trade', { trade_srl, data: { use_auto_clear: 'N' } });
      resolve(ret_obj);
    }).catch(reject)
  })
}

export const getAssetSettings = ({ commit }) => {
  return new Promise((resolve, reject) => {
    settingApi.fetchSetting('asset').then(({ setting }) => {
      commit('asset_settings', setting);
      resolve(setting);
    }).catch(reject)
  })
}

export const getAssetPremiums = ({ commit }) => {
  return new Promise((resolve, reject) => {
    assetApi.fetchPremium().then(({ data }) => {
      commit('asset_premiums', _.chain(data).map(({ asset, value }) => [asset, value]).fromPairs().value());
      resolve(data);
    }).catch(reject)
  })
}

export const getAssetsStatistics = ({ commit }) => {
  return new Promise((resolve, reject) => {
    assetApi.fetchStatistic().then(({ data }) => {
      commit('assets_statistics', _.chain(data).map(val => [val.asset, val]).fromPairs().value());
      resolve(data);
    }).catch(reject)
  })
}

export const getConstants = ({ commit }) => {
  return new Promise((resolve, reject) => {
    constantApi.fetch().then((ret_obj) => {
      ret_obj.asset.asset_codes = _.forEach(ret_obj.asset.asset_codes, (asset) => {
        asset[1] = asset[1].replace(/CCF/g, 'CCE')
      })
      ret_obj.asset.assets = _.forEach(ret_obj.asset.assets, (asset) => {
        switch (asset[1]) {
          case '????????????':
            asset[1] = 'Bitcoin';
            break;
          case '??????':
            asset[1] = 'Dash';
            break;
          case '????????????':
            asset[1] = 'Ethereum';
            break;
          case '??????':
            asset[1] = 'NEO';
            break;
          case '??????????????????':
            asset[1] = 'Bitcoin Cash';
            break;
          case '???????????????':
            asset[1] = 'Lite Coin';
            break;
          case '????????????':
            asset[1] = 'Metal';
            break;
          case '???????????????':
            asset[1] = 'Stratis';
            break;
          case '??????':
            asset[1] = 'Ripple';
            break;
          case '?????????????????????':
            asset[1] = 'Ethereum Classic';
            break;
          case '????????????':
            asset[1] = 'OMG Network';
            break;
          case '?????????????????????????????????':
            asset[1] = 'Status';
            break;
          case '?????????':
            asset[1] = 'Waves';
            break;
          case '?????????':
            asset[1] = 'PIVX';
            break;
          case '???????????????????????????':
            asset[1] = 'NEM';
            break;
          case '?????????':
            asset[1] = 'Zcash';
            break;
          case '?????????':
            asset[1] = 'Monero';
            break;
          case '??????':
            asset[1] = 'Qtum';
            break;
          case '?????????':
            asset[1] = 'Lisk';
            break;
          case '??????':
            asset[1] = 'Steem';
            break;
          case '???????????????':
            asset[1] = 'Stellar Lumens';
            break;
          case '??????':
            asset[1] = 'Ardor';
            break;
          case '?????????':
            asset[1] = 'Komodo';
            break;
          case '??????':
            asset[1] = 'Ark';
            break;
          case '????????????':
            asset[1] = 'Storj';
            break;
          case '??????????????????':
            asset[1] = 'Groestl Coin';
            break;
          case '????????????':
            asset[1] = 'Vertcoin';
            break;
          case '??????':
            asset[1] = 'Augur v2';
            break;
          case '??????????????????':
            asset[1] = 'Einsteinium';
            break;
          case '?????????':
            asset[1] = 'Cardano';
            break;
          case '????????????':
            asset[1] = 'Steem Dollars';
            break;
          case '????????????':
            asset[1] = 'Blocktix';
            break;
          case '????????????':
            asset[1] = 'PowerLedger';
            break;
          case '?????????':
            asset[1] = 'Mercury';
            break;
          case '??????????????????':
            asset[1] = 'Bitcoin Gold';
            break;
        }
      })
      commit('constants', ret_obj);
      commit('SET_WITHDARW_DEPOSIT_LOCALE');
      commit('SET_ACCOUNT_LOCALE');
      commit('SET_TRADE_LOCALE');
      resolve(ret_obj);
    }).catch(reject)
  })
}

export const getEventSource = ({ commit }) => {
  return new Promise(resolve => {
    commit('set_event_source');

    resolve();
  })
}

export const setInviterCode = async({ commit }, inviter_code) => {
  if (inviter_code) {
    Vue.cookies.set('inviter_code', inviter_code, 60 * 60 * 24 * 7, '/', document.domain.replace(/^m\./i, ''));
  } else {
    inviter_code = Vue.cookies.get('inviter_code') || null;
  }

  commit('SET_INVITER_CODE', inviter_code);
}

export const getNews = async({ commit }) => {
  const { notice_list } = await documentApi.fetchNoticeList('notice');
  commit('SET_NEWS', notice_list);

  return notice_list;
}

export const GetOtps = async({ commit, getters }) => {
  if (!getters.is_logged) return;

  const { otps } = await fetchOtps();
  commit('SET_OTPS', otps);
}

export const SetLocale = async({ commit, dispatch }, locale) => {
  commit('SET_LOCALE', locale)
  return new Promise((resolve, reject) => {
    Promise.all([dispatch('getConstants')]).catch(reject);
  })
}

export const getInit = ({ commit, dispatch }) => {
  return new Promise((resolve, reject) => {
    Promise.all([dispatch('getConstants'), dispatch('getEventSource'), dispatch('getAssetSettings'), dispatch('getAssetPremiums'), dispatch('getAssetsStatistics'), dispatch('getNews'), dispatch('setInviterCode'), dispatch('getFeeSettings'), dispatch('getAccountSetting')])
      .then(() => {
        commit('SET_IS_INITED', true);
      }).catch(reject);
  })
}
export const setTradeMethod = ({ commit }, trade) => {
  commit('set_account_srl', null);
  return commit('SET_TRADE_METHOD', trade);
}
export const login = ({ commit }, logged_info) => {

  return commit('logged_info', logged_info);
}

export const increaseRequest = ({ commit }) => {

  return commit('increase_request');
}

export const decreaseRequest = ({ commit }) => {

  return commit('decrease_request');
}

export const setConstants = ({ commit }, constants) => {

  return commit('constants', constants);
}

export const setAssetSettings = ({ commit }, asset_settings) => {

  return commit('asset_settings', asset_settings);
}

export const getFeeSettings = async ({ commit }) => {
  const { setting } = await settingApi.fetchSetting('fee');

  return commit('SET_FEE_SETTINGS', setting);
}

export const setAssetPremiums = ({ commit }, asset_premiums) => {

  return commit('asset_premiums', asset_premiums);
}

export const updateAssetPremium = ({ commit }, asset_premium) => {

  return commit('update_asset_premium', asset_premium);
}

export const setUnclosedTrades = ({ commit }, unclosed_trades) => {

  return commit('unclosed_trades', unclosed_trades);
}

export const setEventSource = ({ commit, state }, data) => {

  return commit('set_event_source', data);
}

export const addTrades = ({ commit }, trades) => {

  return commit('add_trades', trades);
}

export const setLinkedTrades = ({ commit }, trade_srls) => {

  return commit('set_linked_trades', trade_srls);
}

export const closeTrades = ({ commit }, trade_srls) => {

  return commit('close_trades', trade_srls);
}

export const setFutureBalances = ({ commit }, future_balances) => {

  return commit('future_balances', future_balances);
}

export const setAssetsStatistics = ({ commit }, assets_statistics) => {
  console.log('aaa', assets_statistics);

  return commit('assets_statistics', assets_statistics)
}

export const setMemberFutureBalances = ({ commit }, { member_srl, future_balances }) => {

  return commit('future_balances', { member_srl, future_balances });
}

export const openModal = ({ commit }, payload) => {

    payload.open = true;
    return commit('modal', payload);
}

export const closeModal = ({ commit }, closed_by_user = false) => {

    var obj = {};
    obj.open = false;
    obj.message = '';
    obj.closed_by_user = closed_by_user;
    obj.type = 'alert';
    obj.callback = function() {};

    return commit('modal', obj);
}
