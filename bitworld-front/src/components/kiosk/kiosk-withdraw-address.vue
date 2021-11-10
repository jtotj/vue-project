<script>
import '@assets/css/kiosk/kiosk-certified.css'
import { mapState } from 'vuex'
import { createWithdrawAddress, fetchWithdrawAddressList } from '@apis/kyc'
import filter from 'lodash/filter'
import find from 'lodash/find'

export default {
  data() {
    return {
      params: {
        asset_seq: null,
        strBankCode: null,
        strNm: null,
        strAccountNo: null,
        strResId: null,
        address: null,
      },
      loading: false,
      list: [],
      step: null,
      error_msg: null,
      selected_withdraw_address: null,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('common', { constants: (state) => state.constants }),

    c_active_asset() {
      return filter(this.assets, { is_active: 'Y' })
    },
    c_selected_asset() {
      return find(this.c_active_asset, { seq: this.params.asset_seq })
    },
  },
  watch: {
    c_selected_asset() {
      this.selected_withdraw_address = find(this.list, {
        asset_seq: this.c_selected_asset.seq,
      })
    },
  },
  mounted() {
    this.loadWithdrawAddressList()
  },
  methods: {
    handleCreate() {
      this.loading = true
      createWithdrawAddress(this.params)
        .then(() => {
          this.step = 'success'
        })
        .catch((e) => {
          this.error_msg = e.message
          this.step = 'fail'
        })
        .finally(() => {
          this.loading = false
        })
    },
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        no_paging: 1,
      }).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.list = data
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div
        v-if="step === null"
        :class="$style.kioskCertifiedBank"
        class="kiosk-certified-bank"
      >
        <div>
          <div class="kiosk-select-box">
            <h3>{{ $t('kyc.select_asset') }}</h3>
            <el-select
              v-model="params.asset_seq"
              popper-class="withdraw-asset-select"
              filterable
              :placeholder="$t('account_transfer.pls_select_asset')"
            >
              <el-option
                v-for="asset in c_active_asset"
                :key="asset.seq"
                :label="asset.title"
                :value="asset.seq"
              ></el-option>
            </el-select>
          </div>
          <template v-if="!selected_withdraw_address && c_selected_asset">
            <template v-if="c_selected_asset.plugin === 'krw'">
              <div class="kiosk-select-box">
                <h3>{{ $t('kyc.select_bank') }}</h3>
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
                  >
                  </el-option>
                </el-select>
              </div>
              <div>
                <h3>{{ $t('kyc.holder_name') }}</h3>
                <el-input
                  v-model="params.strNm"
                  type="text"
                  :placeholder="$t('kyc.holder_name')"
                >
                </el-input>
              </div>
              <div>
                <h3>{{ $t('kiosk.account_number') }}</h3>
                <el-input
                  v-model="params.strAccountNo"
                  :placeholder="$t('kiosk.account_number')"
                >
                </el-input>
              </div>
              <div>
                <h3>{{ $t('kyc.str_birth') }}</h3>
                <el-input
                  v-model="params.strResId"
                  :placeholder="$t('kyc.birth')"
                >
                </el-input>
              </div>
            </template>
            <template v-else>
              <div>
                <h3>{{ $t('kyc.address') }}</h3>
                <el-input
                  v-model="params.address"
                  type="text"
                  :placeholder="$t('kyc.enter_adress')"
                >
                </el-input>
              </div>
            </template>
          </template>
        </div>
        <template v-if="!selected_withdraw_address && c_selected_asset">
          <el-button @click="handleCreate">{{
            $t('my_page.enroll')
          }}</el-button>
        </template>
      </div>
      <div
        v-else-if="step === 'success'"
        :class="$style.kioskCertifiedAlert"
        class="kiosk-certified-alert"
      >
        <img src="@assets/kiosk-img/icon-success.svg" alt="인증 성공" />
        <h2>{{ $t('registration_complete_txt') }}</h2>
        <el-button @click="$emit('drawer_close')">{{
          $t('kiosk.go_to_first')
        }}</el-button>
      </div>
      <div
        v-else
        :class="$style.kioskCertifiedAlert"
        class="kiosk-certified-alert"
      >
        <img src="@assets/kiosk-img/icon-fail.svg" alt="인증 성공" />
        <h2>{{ $t('registration_failed_txt') }}</h2>
        <p>{{ error_msg }}</p>
        <el-button @click="step = null">{{ $t('before') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
