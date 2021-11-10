<script>
import '@assets/css/kiosk/kiosk-certified.css'
import PageNavigation from '@components/kiosk/kiosk-page-navigation'
import fromPairs from 'lodash/fromPairs'
import date from 'locutus/php/datetime/date'
import { fetchWithdrawAddressList } from '@apis/kyc'
import { mapState } from 'vuex'

export default {
  components: { PageNavigation },
  data() {
    return {
      withdraw_list: [],
      page: 1,
      total_count: 0,
      total_page: 0,
      open_mobile_tab: null,
      page_navigation: {},
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.loadWithdrawAddress()
  },
  methods: {
    fromPairs,
    date,
    async loadWithdrawAddress() {
      const obj = await fetchWithdrawAddressList({
        page: this.page,
        list_count: 4,
      }).catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.withdraw_list = obj.data
      this.total_count = obj.total_count
      this.total_page = obj.total_page
      this.page_navigation = obj.page_navigation
    },
    handlePageChange(data) {
      this.page = data
      this.loadWithdrawAddress()
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskCertifiedList">
        <div :class="$style.certifiedList">
          <template v-if="withdraw_list.length">
            <dl v-for="withdraw in withdraw_list" :key="withdraw.seq">
              <dt :class="$style.certifiedInfo">
                <span>{{
                  date('Y-m-d H:i:s', new Date(withdraw.regdate))
                }}</span>
                <strong>{{ withdraw.asset_title }}</strong>
              </dt>
              <dd :class="$style.certifiedButton" class="certified-button">
                <span
                  >{{
                    fromPairs(
                      constants.kyc.asset_withdraw_address_certification.status
                    )[withdraw.status]
                  }}
                  {{
                    withdraw.is_valid !== null ? $t('allow') : $t('disallow')
                  }}</span
                >
              </dd>
              <dt>{{ $t('kyc.holder_name') }}</dt>
              <dd>{{ withdraw.holder_name }}</dd>
              <dt>{{ $t('bank_name') }}</dt>
              <dd>{{
                fromPairs(
                  constants.kyc.asset_withdraw_address_certification.bank_codes
                )[withdraw.bank_code]
              }}</dd>
              <dt>{{ $t('account_transfer.from_account_number') }}</dt>
              <dd>{{ withdraw.withdraw_address }}</dd>
              <dt>{{ $t('private.closed_date') }}</dt>
              <dd>{{ date('Y-m-d H:i:s', new Date(withdraw.closed_date)) }}</dd>
            </dl>
            <PageNavigation
              :total_count="total_count"
              :total_page="page_navigation.total_page"
              :cur_page="page"
              :page_count="page_navigation.page_count"
              @change="handlePageChange"
            ></PageNavigation> </template
          ><template v-else>
            <div :class="$style.noListWrap">
              {{ $t('kiosk.no_withdrawal_address_application_details') }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
