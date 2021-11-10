<script>
import { mapState } from 'vuex'
import { createWithdrawAddress, fetchWithdrawAddressList } from '@apis/kyc'
import filter from 'lodash/filter'
import find from 'lodash/find'
export default {
  page: {
    title: 'KycWithdrawAddress',
    meta: [{ name: 'description', content: 'KycWithdrawAddress' }],
  },
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
          this.$toasted.success(this.$t('toasted_msg.kyc_withdraw'))
          this.$router.push({ name: 'myprofile' })
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    async loadWithdrawAddressList() {
      const { data } = await fetchWithdrawAddressList({
        is_valid: 'Y',
        no_paging: 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.list = data
    },
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('kyc.withdraw_auth') }}</h2>
        <div class="explanation">
          {{ $t('kyc.withdraw_auth_tit') }}
        </div>
      </div>
      <div class="verify">
        <div class="identity">
          <div class="identity-bot">
            <div class="offer-details payment-section">
              <div v-loading="loading" class="offer-extra-fields">
                <div class="form-group">
                  <label>{{ $t('kyc.select_asset') }}</label>
                  <div class="email-address">
                    <el-select
                      v-model="params.asset_seq"
                      :placeholder="$t('no_select')"
                    >
                      <el-option
                        v-for="asset in c_active_asset"
                        :key="asset.seq"
                        :label="asset.title"
                        :value="asset.seq"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <template v-if="!selected_withdraw_address && c_selected_asset">
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
                  <div class="upload-box">
                    <div class="btn btn-upload" @click="handleCreate">
                      {{ $t('my_page.enroll') }}
                    </div>
                  </div>
                </template>
                <template v-else-if="selected_withdraw_address">
                  <div class="info-content">{{
                    $t('kyc.withdraw_complete')
                  }}</div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
