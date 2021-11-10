<script>
import AssetSelector from '@components/asset-selector'
import { createAccount } from '@apis/account'
import { createAddress, fetchAddressList } from '@apis/address'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  page: {
    title: 'CreateAccountAddress',
    meta: [{ name: 'description', content: 'CreateAccountAddress' }],
  },
  components: {
    AssetSelector,
  },
  data() {
    return {
      selected_asset_seq: this.$route.query.asset_seq || 0,
      account_create_modal: false,
      account_title: null,
      checked: false,
      stap_paging: 'first',

      account: [],
      account_seq: 0,
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),

    c_selected_asset() {
      if (this.selected_asset_seq !== 0) {
        return find(this.assets, {
          seq: this.selected_asset_seq,
        })
      } else {
        return null
      }
    },
    c_selected_account() {
      if (this.account_seq !== 0) {
        return find(this.accounts, {
          seq: this.account_seq,
        })
      } else {
        return 0
      }
    },
  },
  watch: {
    selected_asset_seq() {
      this.account_create_modal = false
      this.account_title = null
      this.checked = false
      this.stap_paging = 'first'
      this.account = []
      this.account_seq = 0
    },
  },
  methods: {
    handleCreate() {
      createAccount({
        asset_seq: this.selected_asset_seq,
        title: this.account_title,
      })
        .then((data) => {
          this.account_title = null
          this.account_seq = data.seq
          this.account_create_modal = false
        })
        .then(() => this.$store.dispatch('account/getAccounts'))
        .then(() => this.handleCreateAddress())
        .catch((e) => (e ? this.$toasted.error(e.message) : null))
        .finally(() => {
          this.stap_paging = 'third'
        })
    },
    handleCreateAddress() {
      if (
        this.c_selected_asset.plugin !== 'krw' &&
        this.c_selected_asset.plugin_seq !== 0
      ) {
        createAddress({
          account_seq: this.account_seq,
        })
          .then(() => {
            this.$toasted.success(this.$t('toasted_msg.create_account'))
            this.getAccountAddress()
          })
          .catch((e) => this.$toasted.error(e.message))
      }
    },
    async getAccountAddress() {
      const { data } = await fetchAddressList({
        is_valid: 'Y',
        list_count: 1,
        account_seq: this.account_seq,
      }).catch((e) => this.$toasted.error(e.message))
      this.account = data
    },
    showAccountCeateModal() {
      if (this.checked === false) {
        return this.$alert('동의하셔야 신규가입을 할 수 있습니다.', {
          type: 'info',
        })
      }
      this.account_create_modal = true
      this.account_title = null
    },
    showInfoPage() {
      if (this.selected_asset_seq === 0) {
        return this.$alert(this.$t('private.please_select_asset'), {
          type: 'info',
        })
      }
      this.stap_paging = 'second'
    },
    resetJoinBtn() {
      this.selected_asset_seq = 0
      this.account_create_modal = false
      this.account_title = null
      this.checked = false
      this.stap_paging = 'first'
      this.account = []
      this.account_seq = 0
    },
    alertPrepare() {
      this.$toasted.info(this.$t('help.prepare'))
    },
  },
}
</script>
<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('new_demand_account') }}
        </h2>
      </div>
      <div :class="[$style.tradesWrap]">
        <div :class="[$style.tradesBox]">
          <!-- 자산별 검색 -->
          <div class="asset-list">
            <h3>
              {{ $t('wallet_page.asset_list') }}
            </h3>
            <AssetSelector v-model="selected_asset_seq" />
          </div>
          <div class="account-list">
            <section
              v-if="stap_paging === 'first'"
              :class="[$style.newAccountWrap, $style.sectionWrap]"
            >
              <h3> {{ $t('limitation_info') }}</h3>
              <div :class="[$style.textWrap]">
                <p>
                  {{ $t('limitation_info_1') }}
                </p>
                <p> {{ $t('limitation_info_2') }} </p>
                <p> {{ $t('limitation_info_3') }} </p>
                <p> {{ $t('limitation_info_4') }} </p>
              </div>
              <div class="box-skyblue">
                <h4>
                  {{ $t('limitation_notice') }}
                </h4>
                <ul>
                  <li> - {{ $t('limitation_notice_1') }} </li>
                  <li> - {{ $t('limitation_notice_2') }} </li>
                </ul>
              </div>
              <div class="color-common marginT-10">
                <p> * {{ $t('limitation_notice_3') }} </p>
              </div>
              <div :class="[$style.accountBtnWrap]">
                <button :class="[$style.leftBtn]" @click="alertPrepare">
                  {{ $t('security_certification') }}
                </button>
                <button
                  :class="[
                    $style.rightBtn,
                    { [$style.active]: selected_asset_seq !== 0 },
                  ]"
                  @click="showInfoPage"
                >
                  {{ $t('new_subscription') }}
                </button>
              </div>
            </section>

            <section
              v-if="stap_paging === 'second'"
              :class="[$style.consentAcounntWrap, $style.sectionWrap]"
            >
              <h3>
                {{ $t('new_subscription1_1') }}
                <br />
                {{ c_selected_asset.title }}
                {{ $t('new_subscription1_2') }}
              </h3>
              <div :class="[$style.consentTextWrap]">
                <p :class="[$style.textWrap]">
                  {{ $t('new_subscription2_1') }}
                  {{ c_selected_asset.title }}
                  {{ $t('new_subscription2_2') }}
                </p>
                <p>
                  {{ $t('new_subscription3_1') }}
                  {{ c_selected_asset.title }}
                  {{ $t('new_subscription3_2') }}
                </p>
              </div>
              <el-checkbox v-model="checked" :class="[$style.consentCheckBox]">
                {{ $t('new_subscription4') }}
              </el-checkbox>
              <div :class="[$style.consentBtnWrap]">
                <button :class="[$style.leftBtn]" @click="resetJoinBtn">
                  {{ $t('cancel') }}
                </button>
                <button
                  :class="[
                    $style.rightBtn,
                    { [$style.active]: checked === true },
                  ]"
                  :disabled="selected_asset_seq === 0"
                  @click="showAccountCeateModal"
                >
                  {{ $t('new_subscription') }}
                </button>
              </div>
            </section>

            <section
              v-if="stap_paging === 'third'"
              :class="[$style.lookUpAcounntWrap, $style.sectionWrap]"
            >
              <h3>{{ $t('created_account_number') }}</h3>
              <div :class="[$style.lookUpWrap]">
                <div :class="[$style.lookUpTextWrap]">
                  <p>{{ $t('cocobank_exclusive_account') }}</p>
                  <p :class="[$style.lookUpAddress]">{{
                    c_selected_account.account_number
                  }}</p>
                  <template v-if="account.length">
                    <div
                      v-if="
                        c_selected_asset.plugin !== 'krw' &&
                          c_selected_asset.plugin_seq !== 0
                      "
                    >
                      <p>{{ $t('depositing_external_wallet') }}</p>
                      <p :class="[$style.lookUpAddress]">{{
                        account[0].address
                      }}</p>
                    </div>
                  </template>
                </div>
                <div :class="[$style.accountBtnWrap]">
                  <button :class="[$style.leftBtn]" @click="resetJoinBtn">
                    {{ $t('back') }}
                  </button>
                  <router-link
                    :to="{ name: 'account-balance' }"
                    tag="button"
                    :class="[$style.rightBtn, $style.active]"
                  >
                    {{ $t('use') }}
                  </router-link>
                </div>
              </div>
            </section>

            <!-- 계좌생성 모달창 -->
            <el-dialog
              class="account-registration-modal"
              :visible.sync="account_create_modal"
              width="60%"
              :title="$t('wallet_page.account_enroll')"
            >
              <div :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.account_seq') }}
                </div>
                <div :class="[$style.tableBody]">
                  {{ $t('auto_input') }}
                </div>
              </div>
              <div :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.withdraw_bank_address') }}
                </div>
                <div :class="[$style.tableBody]">
                  {{ $t('auto_input') }}
                </div>
              </div>
              <div :class="([$style.elRow], [$style.inputRow])">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.account_title') }}
                </div>
                <div :class="[$style.tableBody]">
                  <el-input v-model="account_title"></el-input>
                </div>
              </div>
              <div :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.regdate') }}
                </div>
                <div :class="[$style.tableBody]">
                  {{ $t('wallet_page.before_regdate') }}
                </div>
              </div>
              <div v-if="selected_asset_seq !== null" :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.holding_balance') }}
                </div>
                <div :class="[$style.tableBody]">
                  {{ $t('auto_input') }}
                </div>
              </div>
              <div :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('status') }}
                </div>
                <div :class="[$style.tableBody]">
                  {{ $t('auto_input') }}
                </div>
              </div>
              <div v-if="c_selected_asset !== null" :class="[$style.elRow]">
                <div :class="[$style.tableHead]">
                  {{ $t('wallet_page.select_asset') }}
                </div>
                <div :class="[$style.tableBody]">{{
                  c_selected_asset.code
                }}</div>
              </div>
              <div :class="[$style.btnWrap]">
                <button
                  class="create-btn"
                  :disabled="selected_asset_seq === 0"
                  @click="handleCreate"
                  >{{ $t('wallet_page.create') }}</button
                >
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
@import '@src/design/create-account-address.scss';
</style>
