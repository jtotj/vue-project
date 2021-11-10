import { fetchConstants } from '@apis/constant'
import { locales } from '@locales'
import { getLocale, setLocale } from '@utils/locale'
import { fetchServiceConfig } from '@/src/apis/config'
import Vue from 'vue'
import Cookies from 'js-cookie'
import head from 'lodash/head'

export const state = {
  constants: null,
  config: null,
  locales,
  locale: getLocale(),
  inviter_code: null,
}

export const mutations = {
  SET_CONSTANTS(state, newValue) {
    state.constants = newValue
  },
  SET_LOCALE(state, locale) {
    state.locale = locale
    setLocale(locale)
  },
  SET_CONFIG(state, newValue) {
    state.config = newValue
  },
  SET_CONSTANTS_PAYED(state) {
    switch (state.locale) {
      case 'ko-KR':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = '홀딩'
          }
        })
        break
      case 'en-US':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'Holding'
          }
        })
        break
      case 'de-DE':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'Halte'
          }
        })
        break
      case 'es-ES':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'participación'
          }
        })
        break
      case 'fr-FR':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'portant'
          }
        })
        break
      case 'ja-JP':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'ホールディング'
          }
        })
        break
      case 'pt-PT':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'segurando'
          }
        })
        break
      case 'vi-VN':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = 'giữ'
          }
        })
        break
      case 'zh-CN':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = '保持'
          }
        })
        break
      case 'zh-TW':
        state.constants.market.private_application.status.filter((status) => {
          if (head(status) === 'PAYED') {
            status[1] = '保持'
          }
        })
        break
    }
  },
  SET_CONSTANTS_DEAL_STATUS(state) {
    if (state.locale === 'ja-JP') {
      state.constants.market.private_deal.status = [
        ['OPEN', '公示中'],
        ['CANCELED', 'キャンセル'],
        ['COMPLETED', '完販'],
      ]
    }
  },
  SET_CONSTANTS_TRANSFER(state) {
    if (state.locale === 'ko-KR') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', '구매'],
        ['ASK', '판매'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Buy'],
        ['ASK', 'Sell'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Compra'],
        ['ASK', 'Para venda'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Mua hàng'],
        ['ASK', 'Cần bán'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Kauf'],
        ['ASK', 'Zu verkaufen'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Compra'],
        ['ASK', 'Venta'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', 'Acheter'],
        ['ASK', 'vendre'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', '購入'],
        ['ASK', '販売'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', '买'],
        ['ASK', '卖'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', '買'],
        ['ASK', '賣'],
      ]
    }
  },
  SET_CONSTANTS_SIDE(state) {
    if (state.locale === 'ko-KR') {
      state.constants.market.public_order.side_type = [
        ['BUY', '매수'],
        ['SELL', '매도'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'Buy'],
        ['SELL', 'Sell'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'Comprar'],
        ['SELL', 'vender'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'mua'],
        ['SELL', 'bán'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'Kaufen'],
        ['SELL', 'verkaufen'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'comprar'],
        ['SELL', 'vender'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.market.public_order.side_type = [
        ['BUY', 'acheter'],
        ['SELL', 'vendre'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.market.public_order.side_type = [
        ['BUY', '買い'],
        ['SELL', '売り'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.market.public_order.side_type = [
        ['BUY', '买'],
        ['SELL', '卖'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.market.public_order.side_type = [
        ['BUY', '買'],
        ['SELL', '賣'],
      ]
    }
  },
  SET_CONSTANTS_IDENTIFIERS(state) {
    if (state.locale === 'ko-KR') {
      state.constants.member.inviter_identifiers = [
        ['user_id', '권유 직원 (선택)'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Invite employees (optional)'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Convide empregados (facultativo)'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Mời người lao động (không bắt buộc)'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Einladen Mitarbeiter (optional)'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Invitar a los empleados (opcional)'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.member.inviter_identifiers = [
        ['user_id', 'Inviter les employés (en option)'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.member.inviter_identifiers = [
        ['user_id', '勧誘スタッフ（選択）'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.member.inviter_identifiers = [
        ['user_id', '邀请员工（可选)'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.member.inviter_identifiers = [
        ['user_id', '邀請員工（可選）'],
      ]
    }
  },
  SET_CONSTANTS_DEPOSIT(state) {
    if (state.locale === 'zh-CN') {
      state.constants.deposit.status = [
        ['PENDING', '处理中'],
        ['REJECTED', '拒绝'],
        ['APPROVED', '同意'],
        ['CANCELED', '取消'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.deposit.status = [
        ['PENDING', '處理中'],
        ['REJECTED', '拒絕'],
        ['APPROVED', '同意'],
        ['CANCELED', '取消'],
      ]
    }
  },
  SET_CONSTANTS_WITHDRAW(state) {
    if (state.locale === 'zh-CN') {
      state.constants.withdraw.status = [
        ['PENDING', '处理中'],
        ['REJECTED', '拒绝'],
        ['APPROVED', '承认'],
        ['CANCELED', '取消'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.withdraw.status = [
        ['PENDING', '處理中'],
        ['REJECTED', '拒絕'],
        ['APPROVED', '承認'],
        ['CANCELED', '取消'],
      ]
    }
  },
  SET_CONSTANTS_ASSET_WITHDRAW_FEE(state) {
    if (state.locale === 'ko-KR') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', '정액'],
        ['RATIO', '정률'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', '선취'],
        ['POSTPAY', '후취'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'fixed amount'],
        ['RATIO', 'fixed rate'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'prepayment'],
        ['POSTPAY', 'late payment'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'quantia fixa'],
        ['RATIO', 'taxa fixa'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'pré-pagamento'],
        ['POSTPAY', 'Pós-pagamento'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'số tiền cố định'],
        ['RATIO', 'tỷ lệ cố định'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'trả trước'],
        ['POSTPAY', 'Trả sau'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'fester Betrag'],
        ['RATIO', 'fester Zinssatz'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'Vorauszahlung'],
        ['POSTPAY', 'Nachzahlung'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'cantidad fija'],
        ['RATIO', 'tipo de interés fijo'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'pago por adelantado'],
        ['POSTPAY', 'Pospago'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', 'Montant fixé'],
        ['RATIO', 'taux fixe'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', 'prépaiement'],
        ['POSTPAY', 'Post-paiement'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', '定額'],
        ['RATIO', '定率'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', '先取'],
        ['POSTPAY', '後取'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', '定额'],
        ['RATIO', '定率'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', '先取'],
        ['POSTPAY', '后取'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.asset.withdraw_fee.fee_amount_type = [
        ['FIXED', '定額'],
        ['RATIO', '定率'],
      ]
      state.constants.asset.withdraw_fee.fee_type = [
        ['PREPAY', '先取'],
        ['POSTPAY', '後取'],
      ]
    }
  },
  SET_INVITER_CODE(state, newValue) {
    state.inviter_code = newValue
  },
  SET_CONSTANTS_SECURITY(state) {
    if (state.locale === 'ja-JP') {
      state.constants.security.restriction.target_type = [
        ['LIMIT_ASSET_WITHDRAW_ONE_TIME_AMOUNT', '資産1回出金金額制限'],
        ['LIMIT_ASSET_WITHDRAW_DAILY_AMOUNT', '資産1日出金金額制限'],
        ['CREATE_ACCOUNT', '口座開設不可'],
      ]
    }
  },
  SET_CONSTANTS_KYC_CERTIFICATION(state) {
    if (state.locale === 'zh-CN') {
      state.constants.kyc.certification.status.filter((status) => {
        if (head(status) === 'APPROVED') {
          status[1] = '承认'
        } else if (head(status) === 'REJECTED') {
          status[1] = '驳回'
        }
      })
    } else if (state.locale === 'zh-TW') {
      state.constants.kyc.certification.status.filter((status) => {
        if (head(status) === 'APPROVED') {
          status[1] = '承認'
        } else if (head(status) === 'REJECTED') {
          status[1] = '駁回'
        }
      })
    }
  },
}

export const getters = {
  // Whether the user is currently logged in.
  is_inited(state) {
    return !!state.constants
  },
}

export const actions = {
  init({ dispatch }) {
    Promise.all([
      dispatch('getConstants').catch((e) => Vue.toasted.error(e.message)),
      dispatch('getConfig').catch((e) => Vue.toasted.error(e.message)),
      dispatch('setInviterCode').catch((e) => Vue.toasted.error(e.message)),
    ])
  },

  async getConstants({ commit }) {
    const { constants } = await fetchConstants()

    commit('SET_CONSTANTS', constants)
    commit('SET_CONSTANTS_TRANSFER')
    commit('SET_CONSTANTS_SIDE')
    commit('SET_CONSTANTS_IDENTIFIERS')
    commit('SET_CONSTANTS_PAYED')
    commit('SET_CONSTANTS_SECURITY')
    commit('SET_CONSTANTS_DEAL_STATUS')
    commit('SET_CONSTANTS_KYC_CERTIFICATION')
    commit('SET_CONSTANTS_DEPOSIT')
    commit('SET_CONSTANTS_WITHDRAW')
    commit('SET_CONSTANTS_ASSET_WITHDRAW_FEE')
    return constants
  },
  async SetLocale({ commit, dispatch, rootGetters }, locale) {
    commit('SET_LOCALE', locale)
    if (rootGetters['auth/loggedIn']) {
      dispatch('account/getAccounts', null, {
        root: true,
      })
    }
    return Promise.all([
      dispatch('assets/getAssets', null, {
        root: true,
      }),
      dispatch('getConstants'),

      dispatch('getConfig'),
    ])
  },
  async getConfig({ commit }) {
    const { config } = await fetchServiceConfig()
    commit('SET_CONFIG', config)
    return config
  },
  setInviterCode({ commit }, inviter_code) {
    if (inviter_code) {
      Cookies.set(
        'inviter_code',
        inviter_code,
        60 * 60 * 24 * 7,
        '/',
        document.domain.replace(/^m\./i, '')
      )
    } else {
      inviter_code = Cookies.get('inviter_code') || null
    }
    commit('SET_INVITER_CODE', inviter_code)
  },
}
