import php from 'phpjs';

const query = {};
php.parse_str(php.parse_url(window.location.href, 'PHP_URL_QUERY') || '', query);

const state = {
  settings: {},
  premiums: {},
  // s_asset: php.empty(query) ? 'BTCKRW' : query.s_asset,
  // s_asset: php.empty(query) ? 'BTCKRW' : query.s_asset !== 'undefined' ? 'BTCKRW' : query.s_asset,
  s_asset: query.s_asset !== 'undefined' ? 'BTCKRW' : query.s_asset,
  assets_statistics: {},
  fee_settings: null,
}

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const mutations = {
  asset_settings(state, settings) {

    state.settings = settings;
  },

  s_asset(state, asset) {
    state.s_asset = asset;
  },

  asset_premiums(state, premiums) {

    state.premiums = premiums;
  },

  update_asset_premium(state, { asset, value }) {

    state.premiums[asset] = value;
  },
  assets_statistics(state, assets_statistics) {
    state.assets_statistics = assets_statistics;
  },
  SET_FEE_SETTINGS(state, fee_settings) {
    state.fee_settings = fee_settings;
  },
}

export default {
  state,
  mutations
}
