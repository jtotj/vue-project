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
  customer_exchange: 'INDIVIDUAL',
}

export const mutations = {
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
  SET_CONSTANTS_ACCOUNT_INSTRUMENT_TYPE(state) {
    if (state.locale === 'ko-KR') {
      state.constants.account.instrument_type = [
        ['LEGACY', '舊요구불예금'],
        ['DIVEARN', '배당형'],
        ['SAVINGS_INSTALLMENT', '정액적립식정기적금'],
        ['CD', '양도성예금증서'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Demand Deposit'],
        ['DIVEARN', 'Dividend'],
        ['SAVINGS_INSTALLMENT', 'Fixed amount installment savings deposit'],
        ['CD', 'Certificate of deposit'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Depósito à vista'],
        ['DIVEARN', 'Tipo de dividendo'],
        ['SAVINGS_INSTALLMENT', 'Economia de parcelamento fixo'],
        ['CD', 'Certificado de depósito transferível'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Tiền gửi'],
        ['DIVEARN', 'Loại cổ tức'],
        ['SAVINGS_INSTALLMENT', 'Tiết kiệm trả góp cố định'],
        ['CD', 'Chứng chỉ tiền gửi có thể chuyển nhượng'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Sichteinlage'],
        ['DIVEARN', 'Dividendenart'],
        ['SAVINGS_INSTALLMENT', 'Feste Rateneinsparungen'],
        ['CD', 'Übertragbare Einzahlungsbescheinigung'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Depósito a la vista'],
        ['DIVEARN', 'Tipo de dividendo'],
        ['SAVINGS_INSTALLMENT', 'Ahorros en cuotas fijas'],
        ['CD', 'Certificado de depósito transferible'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.account.instrument_type = [
        ['LEGACY', 'Dépôt de la demande'],
        ['DIVEARN', 'Type de dividende'],
        ['SAVINGS_INSTALLMENT', 'Économies sur les versements fixes'],
        ['CD', 'Certificat de dépôt transférable'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.account.instrument_type = [
        ['LEGACY', '要求払預金'],
        ['DIVEARN', '配当型'],
        ['SAVINGS_INSTALLMENT', '定額積立式定期積立金'],
        ['CD', '譲渡性預金証書'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.account.instrument_type = [
        ['LEGACY', '活期存款'],
        ['DIVEARN', '分红型'],
        ['SAVINGS_INSTALLMENT', '分红定期定额存款型'],
        ['CD', '可转让定期存款单'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.account.instrument_type = [
        ['LEGACY', '活期存款'],
        ['DIVEARN', '分紅型'],
        ['SAVINGS_INSTALLMENT', '分紅定期定額存款型'],
        ['CD', '可轉讓定期存款單'],
      ]
    }
  },
  SET_CONSTANTS_SERVICE_TERM_TYPES(state) {
    switch (state.locale) {
      case 'ko-KR':
        state.constants.service.term_types.filter((status) => {
          if (head(status) === 'PROFILE') {
            status[1] = '프로필 정보 수집'
          }
        })
        break
      case 'zh-CN':
        state.constants.service.term_types.filter((status) => {
          if (head(status) === 'PROFILE') {
            status[1] = '收集个人信息'
          }
        })
        break
      case 'zh-TW':
        state.constants.service.term_types.filter((status) => {
          if (head(status) === 'PROFILE') {
            status[1] = '收集個人信息'
          }
        })
        break
    }
  },
  SET_CONSTANTS_SECURITY(state) {
    if (state.locale === 'en-US') {
      state.constants.security.restriction.target_type = [
        [
          'LIMIT_ASSET_WITHDRAW_ONE_TIME_AMOUNT',
          'Limit the amount of one-time assets to one-time withdrawals',
        ],
        [
          'LIMIT_ASSET_WITHDRAW_DAILY_AMOUNT',
          'Asset daily withdrawal amount limited',
        ],
        ['CREATE_ACCOUNT', 'Unable to open an account'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.security.restriction.target_type = [
        ['LIMIT_ASSET_WITHDRAW_ONE_TIME_AMOUNT', '資産1回出金金額制限'],
        ['LIMIT_ASSET_WITHDRAW_DAILY_AMOUNT', '資産1日出金金額制限'],
        ['CREATE_ACCOUNT', '口座開設不可'],
      ]
    }
  },
  SET_CONSTANTS_FINANCE(state) {
    if (state.locale === 'ko-KR') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', '배당형'],
        ['SAVINGS_INSTALLMENT', '정액적립식정기적금'],
        ['CD', '양도성예금증서'],
      ]
    } else if (state.locale === 'en-US') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Dividend'],
        ['SAVINGS_INSTALLMENT', 'Fixed amount installment savings deposit'],
        ['CD', 'Certificate of deposit'],
      ]
    } else if (state.locale === 'pt-PT') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Tipo de Dividendo'],
        ['SAVINGS_INSTALLMENT', 'Economia de parcelamento fixo'],
        ['CD', 'Certificado de depósito transferível'],
      ]
    } else if (state.locale === 'vi-VN') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Loại cổ tức'],
        ['SAVINGS_INSTALLMENT', 'Tiết kiệm trả góp cố định'],
        ['CD', 'Chứng chỉ tiền gửi có thể chuyển nhượng'],
      ]
    } else if (state.locale === 'de-DE') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Dividendenart'],
        ['SAVINGS_INSTALLMENT', 'Feste Rateneinsparungen'],
        ['CD', 'Übertragbare Einzahlungsbescheinigung'],
      ]
    } else if (state.locale === 'es-ES') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Tipo de dividendo'],
        ['SAVINGS_INSTALLMENT', 'Ahorros en cuotas fijas'],
        ['CD', 'Certificado de depósito transferible'],
      ]
    } else if (state.locale === 'fr-FR') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', 'Type de dividende'],
        ['SAVINGS_INSTALLMENT', 'Économies sur les versements fixes'],
        ['CD', 'Certificat de dépôt transférable'],
      ]
    } else if (state.locale === 'ja-JP') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', '配当型'],
        ['SAVINGS_INSTALLMENT', '定額積立式定期積立金'],
        ['CD', '譲渡性預金証書'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', '分红型 '],
        ['SAVINGS_INSTALLMENT', '定期定额存款型'],
        ['CD', '可转让定期存款单'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.finance.instrument.instrument_type = [
        ['DIVEARN', '分紅型'],
        ['SAVINGS_INSTALLMENT', '定期定額存款型'],
        ['CD', '可轉讓定期存款單'],
      ]
    }
  },
  SET_CONSTANTS_PG_MERCHANT(state) {
    if (state.locale === 'ko-KR') {
      state.constants.pg.merchant.status = [
        ['PENDING', '대기'],
        ['SUSPENDED', '정지'],
        ['CLOSED', '폐업'],
        ['ACTIVE', '활동'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.pg.merchant.status = [
        ['PENDING', '等待'],
        ['SUSPENDED', '停止'],
        ['CLOSED', '停业'],
        ['ACTIVE', '活动'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.pg.merchant.status = [
        ['PENDING', '等待'],
        ['SUSPENDED', '停止'],
        ['CLOSED', '停業'],
        ['ACTIVE', '活動'],
      ]
    }
  },
  SET_CONSTANTS_KYC_STATUS(state) {
    if (state.locale === 'ko-KR') {
      state.constants.kyc.certification.status = [
        ['PENDING', '대기'],
        ['REJECTED', '반려'],
        ['APPROVED', '승인'],
        ['CANCELED', '취소'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.kyc.certification.status = [
        ['PENDING', '处理中'],
        ['REJECTED', '拒绝'],
        ['APPROVED', '同意'],
        ['CANCELED', '取消'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.kyc.certification.status = [
        ['PENDING', '處理中'],
        ['REJECTED', '拒絕'],
        ['APPROVED', '同意'],
        ['CANCELED', '取消'],
      ]
    }
  },
  SET_CONSTANTS_CS_STATUS(state) {
    if (state.locale === 'ko-KR') {
      state.constants.cs.ticket.status = [
        ['PENDING', '답변대기'],
        ['CLOSED', '문의종결'],
        ['REPLY', '답변완료'],
      ]
    } else if (state.locale === 'zh-CN') {
      state.constants.cs.ticket.status = [
        ['PENDING', '等待答案'],
        ['CLOSED', '咨询结束'],
        ['REPLY', '回答完成'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.cs.ticket.status = [
        ['PENDING', '等待答案'],
        ['CLOSED', '諮詢結束'],
        ['REPLY', '回答完成'],
      ]
    }
  },
  SET_CUSTOMER(state, exchange) {
    state.customer_exchange = exchange
  },
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
        ['BID', '购买'],
        ['ASK', '出售'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.market.direct_transfer.transfer_type = [
        ['BID', '購買'],
        ['ASK', '出售'],
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
        ['user_id', '推荐人（选择）'],
      ]
    } else if (state.locale === 'zh-TW') {
      state.constants.member.inviter_identifiers = [
        ['user_id', '推薦人（選擇）'],
      ]
    }
  },
  SET_CONSTANTS_MERCHANT(state) {
    if (state.locale === 'ja-JP') {
      state.constants.pg.merchant.status = [
        ['PENDING', 'お待ち中'],
        ['SUSPENDED', '静止'],
        ['CLOSED', '廃業'],
        ['ACTIVE', '活動'],
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
  SET_INVITER_CODE(state, newValue) {
    state.inviter_code = newValue
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
      dispatch('setCustomerExchange').catch((e) =>
        Vue.toasted.error(e.message)
      ),
    ])
  },

  setCustomerExchange({ commit }, exchange) {
    if (exchange) {
      return commit('SET_CUSTOMER', exchange)
    } else {
      return 'INDIVIDUAL'
    }
  },

  async getConstants({ commit }) {
    const { constants } = await fetchConstants()

    commit('SET_CONSTANTS', constants)
    commit('SET_CONSTANTS_TRANSFER')
    commit('SET_CONSTANTS_IDENTIFIERS')
    commit('SET_CONSTANTS_FINANCE')
    commit('SET_CONSTANTS_SECURITY')
    commit('SET_CONSTANTS_MERCHANT')
    commit('SET_CONSTANTS_SECURITY')
    commit('SET_CONSTANTS_DEPOSIT')
    commit('SET_CONSTANTS_WITHDRAW')
    commit('SET_CONSTANTS_PG_MERCHANT')
    commit('SET_CONSTANTS_KYC_STATUS')
    commit('SET_CONSTANTS_CS_STATUS')
    commit('SET_CONSTANTS_SERVICE_TERM_TYPES')
    commit('SET_CONSTANTS_ACCOUNT_INSTRUMENT_TYPE')
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
