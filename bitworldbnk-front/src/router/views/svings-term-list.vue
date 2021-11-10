<script>
import filter from 'lodash/filter'

import AssetSelector from '@components/asset-selector'

export default {
  page: {
    title: 'AccountTransfer',
    meta: [{ name: 'description', content: 'AccountTransfer' }],
  },
  components: {
    AssetSelector,
  },
  data() {
    return {
      search_target_asset: 0,
      input_target_account: null,
      svings_join_info: [
        {
          asset_seq: '2',
          code: 'USDT',
          mouth: '24',
          date: '2020.08.24~2022.8.24',
          asset_count: '50,000',
          title: '코코',
          account_number: '123423-123-2321234',
          auto_transger: '25',
        },
        {
          asset_seq: '3',
          code: 'KRW',
          mouth: '12',
          date: '2020.08.24~2021.8.24',
          asset_count: '500,000',
          title: '코코',
          account_number: '123423-123-2321234',
          auto_transger: '12',
        },
        {
          asset_seq: '4',
          code: 'KRW',
          mouth: '12',
          date: '2020.08.24~2021.8.24',
          asset_count: '500,000',
          title: '코코',
          account_number: '123423-123-2321234',
          auto_transger: '12',
        },
      ],
      term_join_info: [
        {
          asset_seq: '3',
          code: 'KRW',
          mouth: '24',
          date: '2020.08.24~2022.8.24',
          asset_count: '50,000',
          title: '코코',
          account_number: '123423-123-2321234',
          maturity: 'auto',
        },
        {
          asset_seq: '2',
          code: 'USDT',
          mouth: '12',
          date: '2020.08.24~2021.8.24',
          asset_count: '500,000',
          title: '코코',
          account_number: '123423-123-2321234',
          maturity: 'self',
        },
      ],
    }
  },
  computed: {
    c_filter_svings() {
      return filter(
        this.svings_join_info,
        (list) =>
          list.asset_seq.includes(this.search_target_asset) &&
          (!this.input_target_account ||
            list.title
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            list.account_number.includes(this.input_target_account))
      )
    },
    c_filter_term() {
      return filter(
        this.term_join_info,
        (list) =>
          list.asset_seq.includes(this.search_target_asset) &&
          (!this.input_target_account ||
            list.title
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            list.account_number.includes(this.input_target_account))
      )
    },
  },
}
</script>

<template>
  <div class="bank-container">
    <div class="contents">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('check_account_progress_account') }}</h2>
      </div>
      <div :class="$style.svingsTermListWrap">
        <div :class="[$style.formLeft]">
          <AssetSelector v-model="search_target_asset"></AssetSelector>
        </div>
        <div :class="[$style.formRight]">
          <PerfectScrollbar :class="$style.formGroup">
            <ul :class="[$style.dealList]">
              <div :class="[$style.account_search]">
                <el-input
                  v-model="input_target_account"
                  prefix-icon="el-icon-search"
                  :placeholder="$t('account_transfer.pls_search_account')"
                  :class="[$style.input_account_search]"
                />
              </div>
              <template v-if="c_filter_svings.length">
                <li
                  v-for="svings in c_filter_svings"
                  :key="svings.index"
                  :class="$style.shortList"
                >
                  <h3>{{ svings.code }} 적금 계좌</h3>
                  <div :class="$style.textWrap">
                    <p>가입 기간</p>
                    <p :class="$style.content">
                      <span>{{ svings.mouth }}개월&nbsp;</span>
                      <span>{{ svings.date }}</span>
                    </p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>가입 자산</p>
                    <p :class="$style.content">{{ svings.asset_count }}</p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>출금 계좌</p>
                    <p :class="$style.content">
                      <span>{{ svings.title }}&nbsp;</span>
                      <span>{{ svings.account_number }}</span>
                    </p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>자동이체일</p>
                    <p :class="$style.content">{{ svings.auto_transger }}</p>
                  </div>
                </li>
              </template>
              <template v-if="c_filter_term.length">
                <li
                  v-for="term in c_filter_term"
                  :key="term.index"
                  :class="$style.shortList"
                >
                  <h3>{{ term.code }} 적금 계좌</h3>
                  <div :class="$style.textWrap">
                    <p>가입 기간</p>
                    <p :class="$style.content">
                      <span>{{ term.mouth }}개월 &nbsp;</span>
                      <span>{{ term.date }}</span>
                    </p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>가입 자산</p>
                    <p :class="$style.content">{{ term.asset_count }}</p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>출금 계좌</p>
                    <p :class="$style.content">
                      <span>{{ term.title }}&nbsp;</span>
                      <span>{{ term.account_number }}</span>
                    </p>
                  </div>
                  <div :class="$style.textWrap">
                    <p>만기 해지방법</p>
                    <p :class="$style.content">{{ term.maturity }}</p>
                  </div>
                </li>
              </template>
              <template v-if="!c_filter_svings.length && !c_filter_term.length">
                <div
                  v-if="search_target_asset !== 0"
                  :class="[$style.noDealList]"
                >
                  <div :class="[$style.imgWrap]">
                    <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
                  </div>
                  <p :class="[$style.textWrap]">{{
                    $t('wallet_page.no_account_list')
                  }}</p>
                </div>
                <div v-else :class="[$style.noDealList]">
                  <div :class="[$style.imgWrap]">
                    <img
                      src="@assets/img/please-select-icon.png"
                      alt="손가락 아이콘"
                    />
                  </div>
                  <p :class="[$style.textWrap]">
                    {{ $t('private.please_select_asset') }}
                  </p>
                </div>
              </template>
            </ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
</style>
