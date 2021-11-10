/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
export const logged_info = state => state.auth.logged_info;
export const constants = state => state.common.constants;
export const is_logged = state => !!state.auth.logged_info.member_srl;
export const modal = state => state.modal;
export const accounts = (state, { account_setting }) => {
    if (typeof account_setting.default_losscut_ratio === 'undefined') {
        return [];
    }

    const { leverage_losscut_ratios } = account_setting;

    return _.map(state.account.accounts, (account) => {
        return {
            ...account,
            losscut: account.margin * (leverage_losscut_ratios[account.leverage] / 100),
            losscut_ratio: leverage_losscut_ratios[account.leverage],
        }
    })
};
export const account_setting = ({ account }) => account.setting;
export const asset_list = (state, { constants }) => {
    if (!constants.asset) return {};

    return _.chain(state.asset.settings)
        .keys()
        // .filter(asset => state.asset.settings[asset].is_active == 'Y')
        .map(asset => {
            var statistics = state.asset.assets_statistics[asset];
            var premium = state.asset.premiums[asset];

            if(!statistics || !premium) return [asset, {}];

            var info = {
                ...statistics,
                asset_title: _.fromPairs(constants.asset.assets)[asset],
                asset_code: _.fromPairs(constants.asset.asset_codes)[asset],
                yesterday_vs: premium - statistics.yesterday_first,
                today_vs: premium - statistics.today_first,
                percentage: (premium / statistics.today_first * 100 - 100).toFixed(2) * 1,
                premium
            }

            info.percentage = info.percentage === Infinity ? 0 : info.percentage;
            info.updown = info.today_vs < 0 ? 'down' : 'up';

            return [asset, info];
        })
        .fromPairs()
        .value();
}
export const s_asset_fee = ({ asset }) => {
    if (!asset.fee_settings) return null;

    const asset_fee = asset.fee_settings.asset_fees[asset.s_asset];
    if (asset.s_asset && asset_fee && asset_fee.use_seperate_fee === 'Y') {
        return asset_fee;
    }

    return _.omit(asset.fee_settings, 'asset_fees');
};
export const s_account_info = (state, getters) => _.find(getters.accounts, { account_srl: state.account.s_account_srl });
export const s_asset_info = (state, { constants, asset_list }) => {
    var asset = state.asset.s_asset;

    return asset_list[asset];
};
// export const s_account_info = state
