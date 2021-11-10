<script>
import { mapState } from 'vuex'
import { fetchAccount } from '@apis/account'
import { createWithdrawAddress, fetchWithdrawAddressList } from '@apis/kyc'

import filter from 'lodash/filter'
import find from 'lodash/find'

export default {
  page: {
    title: 'bankWalletReference',
    meta: [{ name: 'description', content: 'bankWalletReference' }],
  },
  data() {
    return {
      activeName: 'first',
      find_account: null,
      result_user_name: null,

      find_withdraw: null,
      withdraw_address_list: [],

      params: {
        asset_seq: null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('common', { constants: (state) => state.constants }),

    c_available_assets() {
      return filter(
        this.assets,
        (asset) =>
          this.withdraw_address_list.findIndex(
            (el) => el.asset_seq === asset.seq
          ) === -1
      )
    },
    c_selected_asset() {
      return find(this.c_available_assets, { seq: this.params.asset_seq })
    },
  },
  mounted() {
    this.getWithdrawAddressList()
  },
  methods: {
    async findAccountInfo() {
      await fetchAccount({
        account_seq_or_number: this.find_account,
        for_transfer: 1,
      })
        .then((result) => {
          if (result.account_info) {
            this.result_user_name = result.account_info.user_name
          } else {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          }
        })
        .catch((e) => {
          if (e.httpStatusCode === 403) {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
          } else {
            this.$toasted.error(e.message)
          }
          this.find_account = null
        })
    },
    async getWithdrawAddressList() {
      const obj = await fetchWithdrawAddressList({
        is_valid: 'Y',
      }).catch((e) => this.$toasted.error(e.message))
      this.withdraw_address_list = obj.data
    },
    handleCreate() {
      createWithdrawAddress(this.params)
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.kyc_withdraw'))
          this.params.strBankCode = null
          this.params.strNm = null
          this.params.strAccountNo = null
          this.params.strResId = null
          this.params.address = null
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    handleAssetEvent() {
      this.params.strBankCode = null
      this.params.strNm = null
      this.params.strAccountNo = null
      this.params.strResId = null
      this.params.address = null
    },
  },
}
</script>
<template>
  <div class="bank-container">
    <div class="contents">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('account_and_other_wallet') }}
        </h2>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('account_search')" name="first">
          <div>
            <div :class="[$style.formGroup]">
              <label>{{ $t('account_transfer.to_account_input') }}</label>
              <div
                class="form-wrap transfer-account-number"
                :class="[$style.formWrap]"
              >
                <el-input
                  v-model="find_account"
                  :class="[$style.addressInput]"
                ></el-input>
                <div :class="[$style.btnWrap]">
                  <el-button
                    class="confirm_btn"
                    :class="[$style.createBtn]"
                    @click="findAccountInfo"
                    >{{ $t('account_transfer.to_account_confirm') }}</el-button
                  >
                </div>
                <p v-if="result_user_name">
                  {{ result_user_name }}님 검색한 계좌가 있습니다.
                </p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('other_wallet_search')" name="second">
          <div :class="[$style.withdrawLeftWrap]">
            <label>자산 별 검색</label>
            <el-select
              v-model="params.asset_seq"
              placeholder="자산을 먼저 선택해주세요"
              @change="handleAssetEvent"
            >
              <el-option
                v-for="asset in c_available_assets"
                :key="asset.seq"
                :label="asset.code"
                :value="asset.seq"
              >
              </el-option>
            </el-select>
          </div>
          <div :class="[$style.withdrawRightWrap]">
            <div v-if="c_selected_asset" :class="[$style.formWrap]">
              <template v-if="c_selected_asset.plugin === 'krw'">
                <div class="form-group">
                  <label>{{ $t('kyc.select_bank') }}</label>
                  <div class="email-address">
                    <el-select
                      v-model="params.strBankCode"
                      :placeholder="$t('no_select')"
                    >
                      <el-option
                        v-for="bank in constants.kyc
                          .asset_withdraw_address_certification.bank_codes"
                        :key="bank[0]"
                        :label="bank[1]"
                        :value="bank[0]"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ $t('kyc.holder_name') }}</label>
                  <div class="email-address">
                    <el-input
                      v-model="params.strNm"
                      :placeholder="$t('kyc.holder_name')"
                    ></el-input>
                  </div>
                </div>
                <div class="form-group">
                  <label>
                    {{ $t('wallet_page.withdraw_bank_address') }}
                  </label>
                  <div class="email-address">
                    <el-input
                      v-model="params.strAccountNo"
                      :placeholder="$t('wallet_page.withdraw_bank_address')"
                    ></el-input>
                  </div>
                </div>
                <div class="form-group">
                  <label>{{ $t('birth') }}</label>
                  <div class="email-address">
                    <el-input
                      v-model="params.strResId"
                      :placeholder="$t('kyc.birth')"
                    ></el-input>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-group">
                  <label>{{ $t('kyc.address') }}</label>
                  <div class="email-address">
                    <el-input
                      v-model="params.address"
                      :placeholder="$t('kyc.address')"
                    ></el-input>
                  </div>
                </div>
              </template>
              <el-button @click="handleCreate">
                지갑 주소 확인 등록
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.withdrawLeftWrap {
  float: left;
  width: 33%;
}
.withdrawRightWrap {
  float: right;
  width: 62%;
}
.formWrap {
  width: 100%;
  .addressInput {
    float: left;
    width: 78%;
  }
  .createBtn {
    float: right;
    width: 20%;
    height: 45px;
  }
}

@media (max-width: 768px) {
  .formWrap {
    width: 100%;
    .addressInput {
      float: left;
      width: 100%;
    }
    .createBtn {
      float: left;
      width: 40%;
      padding: 10px 8px;
      margin-top: 10px;
    }
  }
}
</style>
