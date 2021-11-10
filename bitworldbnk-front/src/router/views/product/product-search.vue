<script>
import '@assets/css/transfer/account-transfer.css'
import AssetSelector from '@components/asset-selector'
import '@assets/css/product-subscription/product-search.css'
import { fetchFinanceInstrumentList } from '@apis/finance'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import map from 'lodash/map'
import find from 'lodash/find'

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
      input_target_account: '',
      search_target_asset: Number(this.$route.query.asset_seq) || 0,
      active_menu: 'DIVEARN',
      radio_term: 'one_month',
      radio_price: 'one_million',
      tax_savings: false,
      income_deduction: false,
      Internet_banking: false,
      checkedTerms: [],
      search_conditions: false,
      serach_on: false,

      instrument_list: [],
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('common', ['locale']),
    ...mapState('assets', ['assets']),
    s_intrument_list() {
      if (!this.instrument_list.length) return []

      if (this.search_target_asset)
        return filter(
          filter(this.instrument_list, { instrument_type: this.active_menu }),
          { execute_asset_seq: this.search_target_asset }
        )
      return filter(this.instrument_list, { instrument_type: this.active_menu })
    },
  },
  mounted() {
    Promise.all([this.loadFinanceInstrumentList()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  methods: {
    async loadFinanceInstrumentList() {
      const { data } = await fetchFinanceInstrumentList()

      map(data, (info) => {
        const execute_asset_info = find(this.assets, {
          seq: info.execute_asset_seq,
        })

        info.execute_asset_info = execute_asset_info
      })

      this.instrument_list = data
    },
    fromPairs,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('product_name') }}</h2>
      </div>
      <div class="account-transfer">
        <div class="asset-list">
          <h3>
            {{ $t('wallet_page.asset_list') }}
          </h3>
          <AssetSelector v-model="search_target_asset"></AssetSelector>
        </div>
        <div class="account-list">
          <div class="product-search-wrap">
            <!-- 예금 신탁 -->
            <el-tabs v-model="active_menu">
              <el-tab-pane
                v-for="val in [...constants.finance.instrument.instrument_type]"
                :key="val[1]"
                :label="val[1]"
                :name="val[0]"
              >
                <!-- 상품명 검색 -->
                <el-input
                  v-model="input_target_account"
                  prefix-icon="el-icon-search"
                  :placeholder="$t('product_name')"
                  class="productName"
                />
                <!-- 조건 검색 탭  -->
                <div v-if="0" :class="$style.productFind">
                  <div :class="$style.productSelect">
                    <a :class="$style.selectBtn" href="#">정기예금</a>
                    <a
                      :class="[$style.selectBtn, { [$style.active]: true }]"
                      href="#"
                      >적금</a
                    >
                    <a :class="$style.selectBtn" href="#"
                      >입출금이 자유로운 예금</a
                    >
                    <a :class="$style.selectBtn" href="#">외화상품</a>
                    <a :class="$style.selectBtn" href="#">신탁</a>
                    <a :class="$style.selectBtn" href="#">한시상품/ELD</a>
                  </div>
                  <!-- 조건 검색 활성화 버튼 -->
                  <div
                    v-if="search_conditions === false"
                    :class="$style.productSearch"
                  >
                    <button
                      :class="$style.btnWhite"
                      @click="search_conditions = !search_conditions"
                      >조건에 맞는 상품 찾기</button
                    >
                  </div>
                  <!-- 조건 검색 영역 -->
                  <div
                    v-if="search_conditions === true"
                    :class="$style.productCondition"
                  >
                    <ul>
                      <li>
                        <h5>
                          예치기간
                        </h5>
                        <span>
                          <el-radio v-model="radio_term" label="one_month"
                            >1개월</el-radio
                          >
                          <el-radio v-model="radio_term" label="three_month"
                            >3개월</el-radio
                          >
                          <el-radio v-model="radio_term" label="six_month"
                            >6개월</el-radio
                          >
                          <el-radio v-model="radio_term" label="one_year"
                            >1년</el-radio
                          >
                          <el-radio v-model="radio_term" label="two_year"
                            >2년</el-radio
                          >
                          <el-radio v-model="radio_term" label="three_year"
                            >3년</el-radio
                          >
                          <el-radio v-model="radio_term" label="five_year_more"
                            >5년 이상</el-radio
                          >
                        </span>
                      </li>
                      <li>
                        <h5>
                          예치금액
                        </h5>
                        <span>
                          <el-radio v-model="radio_price" label="one_million"
                            >1백만원</el-radio
                          >
                          <el-radio v-model="radio_price" label="five_million"
                            >5백만원</el-radio
                          >
                          <el-radio v-model="radio_price" label="Ten_million"
                            >1천만원</el-radio
                          >
                          <el-radio v-model="radio_price" label="thirty_million"
                            >3천만원</el-radio
                          >
                          <el-radio v-model="radio_price" label="fifty_million"
                            >5천만원</el-radio
                          >
                          <el-radio
                            v-model="radio_price"
                            label="one_hundred_million"
                            >1억원</el-radio
                          >
                        </span>
                      </li>
                      <li>
                        <h5>
                          부가혜택
                        </h5>
                        <span>
                          <el-checkbox v-model="tax_savings"
                            >절세해택</el-checkbox
                          >
                          <el-checkbox v-model="income_deduction"
                            >소득공제해택</el-checkbox
                          >
                        </span>
                      </li>
                      <li>
                        <h5>
                          가입채널
                        </h5>
                        <span>
                          <el-checkbox v-model="Internet_banking"
                            >인터넷뱅킹</el-checkbox
                          >
                        </span>
                      </li>
                    </ul>
                    <div :class="$style.FindBtnWrap">
                      <p
                        >검색 결과의 금리는 입력하신 기간 및 예치금액을 기준으로
                        하고 있습니다.<br />(상품별 금리 기준은 개인, 만기일시
                        지급식, 세전, 연율 기준 / 기간별 금리 기준은 월 또는
                        (일) 기준)</p
                      >
                      <div :class="$style.btnArea">
                        <button
                          :class="$style.btnBlue"
                          @click="serach_on = true"
                          >검색</button
                        >
                        <button
                          :class="$style.btnWhite"
                          @click="
                            search_conditions = false
                            serach_on = false
                          "
                          >상품전체보기</button
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="0" :class="$style.productResultNote">
                  <p
                    ><span :class="$style.blue">0</span>개의
                    <span :class="$style.blue">예금/신탁</span> 상품이 검색
                    되었습니다.</p
                  >
                </div>
                <div :class="$style.bankingArea">
                  <div v-if="0" :class="$style.contButtonWrap">
                    <div :class="$style.btnLeftWrap">
                      <a
                        :class="[$style.btnRounded, { [$style.active]: true }]"
                        href="#"
                        >온라인 가입상품</a
                      >
                      <a :class="$style.btnRounded" href="#">최고 금리순</a>
                      <a :class="$style.btnRounded" href="#">출시순</a>
                    </div>
                    <div :class="$style.btnRightWrap">
                      <span :class="$style.btnDesc"
                        >최대 3개까지
                        <em :class="$style.gray">비교가능</em></span
                      >
                      <a :class="$style.btnLine" href="#">비교하기</a>
                    </div>
                  </div>

                  <div :class="$style.resultWrap">
                    <div v-if="0" :class="$style.pageDesc">
                      <span
                        >전체 <em :class="$style.blue">0</em>개 정기예금</span
                      >
                      <span>(조회기준일자 : 2020-12-31, 우대금리포함 )</span>
                    </div>
                    <div v-if="0" :class="$style.resultCondition">
                      <div :class="$style.pageHead" class="pc">
                        <span>{{ $t('product_name') }}</span>
                        <span>금리</span>
                        <span>세전수령액</span>
                        <span>우대금리</span>
                        <span>가입여부</span>
                      </div>
                      <PerfectScrollbar :class="[$style.perfectScrollbar]">
                        <ul :class="$style.productList" class="product-list">
                          <li
                            v-for="instrument in instrument_list"
                            :key="instrument.seq"
                          >
                            <div :class="$style.row">
                              <div>
                                <el-checkbox
                                  v-model="product_check"
                                ></el-checkbox>
                              </div>
                              <div>
                                <div :class="$style.productNoti">
                                  <span :class="$style.depositType">{{
                                    fromPairs(
                                      constants.finance.instrument
                                        .instrument_type
                                    )[instrument.instrument_type]
                                  }}</span>
                                  <span :class="$style.labelGreen">신상품</span>
                                </div>
                                <h5>
                                  <a :class="$style.productTitle" href="#">{{
                                    instrument.title
                                  }}</a>
                                </h5>
                              </div>
                            </div>
                            <div :class="$style.row">
                              <span :class="$style.rate">0.45%</span>
                              <span :class="$style.preTaxAmount"
                                >10,000 CCF</span
                              >
                              <span :class="$style.preRate">최고0.4%</span>
                              <a :class="$style.btnBlueRounded" href="#"
                                >가입</a
                              >
                            </div>
                          </li>
                        </ul>
                      </PerfectScrollbar>
                    </div>

                    <div>
                      <PerfectScrollbar :class="[$style.perfectScrollbar]">
                        <ul
                          :class="$style.productListAll"
                          class="product-list-all"
                        >
                          <li
                            v-for="instrument in s_intrument_list"
                            :key="instrument.seq"
                          >
                            <div :class="$style.row">
                              <div v-if="0">
                                <el-checkbox
                                  v-model="product_check"
                                ></el-checkbox>
                              </div>
                              <div>
                                <div :class="$style.productNoti">
                                  <span :class="$style.depositType">{{
                                    fromPairs(
                                      constants.finance.instrument
                                        .instrument_type
                                    )[instrument.instrument_type]
                                  }}</span>
                                  <span v-if="0" :class="$style.labelGreen"
                                    >신상품</span
                                  >
                                </div>
                                <h5>
                                  <router-link
                                    :to="{
                                      name: 'product-subscription',
                                      query: { instrument_seq: instrument.seq },
                                    }"
                                    :class="$style.productTitle"
                                  >
                                    {{ instrument.title }} ({{
                                      instrument.execute_asset_info.code
                                    }})
                                  </router-link>
                                </h5>
                                <p :class="$style.productText">
                                  {{ instrument.summary }}
                                </p>
                              </div>
                            </div>
                            <div :class="$style.row">
                              <span :class="$style.totalRateText"></span>
                              <span
                                v-if="active_menu === 'DIVEARN'"
                                :class="$style.totalRate"
                                >{{ $t('not_applicable') }}</span
                              >
                              <span :class="$style.preTax"></span>
                              <router-link
                                :to="{
                                  name: 'product-subscription',
                                  query: { instrument_seq: instrument.seq },
                                }"
                                :class="[
                                  $style.btnBlueRounded,
                                  {
                                    [$style.dependOnLocale]:
                                      locale === 'zh-TW' ||
                                      locale === 'zh-CN' ||
                                      locale === 'ja-JP',
                                  },
                                ]"
                                >{{ $t('subscription') }}</router-link
                              >
                            </div>
                          </li>
                        </ul>
                      </PerfectScrollbar>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/account-transfer.scss';
@import '@src/design/product-search.scss';
</style>
