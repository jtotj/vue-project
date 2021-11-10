<script>
import '@assets/css/product-subscription/product-subscription.css'
import {
  fetchFinanceInstrumentContractDocumentList,
  fetchFinanceInstrument,
  createFinanceFund,
} from '@apis/finance'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
import each from 'lodash/each'
import filter from 'lodash/filter'
import find from 'lodash/find'
import every from 'lodash/every'
import map from 'lodash/map'
import Decimal from 'decimal.js'
import date from 'locutus/php/datetime/date'
import forEach from 'lodash/forEach'

export default {
  page: {
    title: 'productSubscription',
    meta: [{ name: 'description', content: 'productSubscription' }],
  },
  data() {
    return {
      terms_agree: [],
      agree_disabled: [],

      search_target_asset: 0,

      // Step-one
      step: null,
      active_tab_menu: [],
      terms_modal: false,

      // Step-two
      withdrawal_account_num: '',
      account_password: '',

      new_amount: '',

      pay_width_coco: false,
      register_different_pw: false,

      // product_type: '코코뱅크 정기적금',
      // subscription_period: '12개월',
      // interest_payment_method: '만기일시지급식',
      // interest_payment_interval: '만기지급식',

      termination_of_maturity: '1',
      sms_notification_of_expiration: '1',

      instrument_info: null,
      instrument_document_list: [],

      params: {},
      success_seq: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', ['locale']),
    ...mapState('assets', ['assets']),
    ...mapState('account', ['accounts']),
    c_is_agree_required_documents_check() {
      if (!this.instrument_document_list.length) return []
      return every(
        filter(this.instrument_document_list, { is_agree_required: 'Y' }),
        (document) => this.terms_agree.indexOf(document.document_seq) !== -1
      )
    },
    cs_asset_by_accounts() {
      if (!this.instrument_info) return []
      return filter(
        filter(this.accounts, {
          asset_seq: this.instrument_info.execute_asset_seq,
        }),
        { instrument_type: 'LEGACY' }
      )
    },
    cs_asset_info() {
      if (!this.instrument_info) return null
      return find(this.assets, { seq: this.instrument_info.execute_asset_seq })
    },
    cs_execute_account_info() {
      if (!this.params.execute_account_seq) return null
      return find(this.accounts, { seq: this.params.execute_account_seq })
    },
  },
  mounted() {
    Promise.all([this.loadInstrumentInfo(), this.loadInstrumentDocumentList()])
      .then(() => {
        this.scrollCheck()
      })
      .catch((e) => this.$toasted.error(e.message))
  },

  methods: {
    date,
    scrollCheck() {
      forEach(this.instrument_document_list, (document) => {
        var el = this.$refs[`terms_content_${document.document_seq}`]

        if (!el) return

        if (
          el[0].$el.scrollHeight - el[0].$el.scrollTop ===
          el[0].$el.offsetHeight
        )
          this.agree_disabled.push(document.document_seq)
      })
    },
    stepTo(val) {
      if (val === 'input' && !this.c_is_agree_required_documents_check) {
        return this.$toasted.error(this.$t('toasted_msg.agree_required_term'))
      } else if (val === 'input' && this.c_is_agree_required_documents_check) {
        this.step = val
      } else if (val === 'complete') {
        this.handleCreateFund(val)
      }

      if (window.outerWidth <= 768) {
        let top_to_scroll = document.querySelector('.account-list').offsetTop
        window.scrollTo(0, top_to_scroll)
      } else {
        window.scrollTo(0, 0)
      }
    },

    clickTermBtn(document_seq) {
      const disabled_index = this.agree_disabled.indexOf(document_seq)
      if (disabled_index === -1) {
        return this.$toasted.error(this.$t('toasted_msg.must_read_term'))
      }
      const index = this.terms_agree.indexOf(document_seq)
      if (index !== -1) {
        return this.terms_agree.splice(index, 1)
      }
      return this.terms_agree.push(document_seq)
    },

    handleScroll(e, document_seq) {
      if (e.target.scrollHeight - e.target.scrollTop <= e.target.offsetHeight)
        this.agree_disabled.push(document_seq)
    },

    allAgree() {
      each(this.instrument_document_list, (document) => {
        const index = this.terms_agree.indexOf(document.document_seq)
        if (index === -1) this.terms_agree.push(document.document_seq)
        else this.terms_agree.splice(index, 1)
      })
    },

    async loadInstrumentInfo() {
      const { instrument_info } = await fetchFinanceInstrument(
        this.$route.query.instrument_seq
      )

      this.instrument_info = instrument_info
    },

    async loadInstrumentDocumentList() {
      const { data } = await fetchFinanceInstrumentContractDocumentList(
        this.$route.query.instrument_seq
      )

      this.instrument_document_list = data

      this.instrument_document_list.forEach((document) => {
        this.active_tab_menu.push(document.document_seq)
      })
    },
    async handleDownload(document_seq) {
      window.location.href = `/api/v1/finance/instrument/${
        this.$route.query.instrument_seq
      }/contract-document/${document_seq}/download`
      if (this.agree_disabled.indexOf(document_seq) === -1)
        this.agree_disabled.push(document_seq)
    },

    handleCreateFund(val) {
      this.params.instrument_seq = this.$route.query.instrument_seq
      this.params.agreements = map(
        this.instrument_document_list,
        (document) => ({
          document_seq: document.document_seq,
          view_locale: document.locale,
          is_agreed:
            this.terms_agree.indexOf(document.document_seq) !== -1 ? 'Y' : 'N',
        })
      )
      createFinanceFund(this.params)
        .then(({ seq }) => {
          this.success_seq = seq
          this.step = val
        })
        .then(() => {
          return Promise.all([
            this.$store.dispatch('account/getAccounts'),
            this.$store.dispatch('finance/getFunds'),
          ])
        })
        .catch((e) => {
          this.$toasted.error(e.message)
        })
    },
    fromPairs,
    Decimal,
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div v-if="instrument_info" class="product-subscription-wrap">
        <!-- Step-one -->
        <div v-if="step === null" class="step-one" :class="$style.stepOne">
          <!-- 제목 -->
          <div :class="$style.subscriptionTitle">
            <h2 class="big-title"
              >{{
                fromPairs(constants.finance.instrument.instrument_type)[
                  instrument_info.instrument_type
                ]
              }}
              {{ $t('subscription') }}</h2
            >
            <ul :class="$style.progressList">
              <li :class="[$style.progressItem, $style.active]"
                >1. {{ $t('agreement') }}</li
              >
              <li :class="$style.progressItem">2</li>
              <li :class="$style.progressItem">3</li>
            </ul>
          </div>

          <!-- 상품 정보 -->
          <div :class="$style.productInfo">
            <h4 :class="$style.productInfoTitle">
              {{ instrument_info.title }}
            </h4>
            <div v-if="0" :class="$style.infoBtns">
              <a :class="$style.btnGrey">상품상세정보</a>
              <a :class="$style.btnGrey">코코멤버스 가입</a>
            </div>
          </div>

          <!-- 약관동의 -->
          <div :class="$style.termsWrap" class="product-terms-wrap">
            <div v-if="0" :class="$style.agreeAllBox">
              상품가입 약관 전체 동의
              <button
                :class="[$style.btnAgree, $style.btnBlue]"
                @click="allAgree"
                >전체동의</button
              >
            </div>
            <div v-if="0" :class="$style.agreeTermsWrap">
              <ul :class="$style.agreeTermsList">
                <li :class="[$style.agreeTermsItem, $style.agreeAllBox]">
                  모달약관샘플
                  <button
                    :class="[$style.btnAgree, $style.btnBlue]"
                    @click="terms_modal = true"
                    >모달약관</button
                  >
                  <el-dialog
                    title="약관"
                    :visible.sync="terms_modal"
                    width="30%"
                  >
                    <span>
                      <PerfectScrollbar :class="$style.perfectScrollbar">
                        Consistent with real life: in line with the process and
                        logic of real life, and comply with languages and habits
                        that the users are used toConsistent with real life: in
                        line with the process and logic of real life, and comply
                        with languages and habits that the users are used
                        to;Consistent with real life: in line with the process
                        and logic of real life, and comply with languages and
                        habits that the users are used toConsistent with real
                        life: in line with the process and logic of real life,
                        and comply with languages and habits that the users are
                        used to;Consistent with real life: in line with the
                        process and logic of real life, and comply with
                        languages and habits that the users are used
                        toConsistent with real life: in line with the process
                        and logic of real life, and comply with languages and
                        habits that the users are used to;Consistent with real
                        life: in line with the process and logic of real life,
                        and comply with languages and habits that the users are
                        used toConsistent with real life: in line with the
                        process and logic of real life, and comply with
                        languages and habits that the users are used
                        to;Consistent with real life: in line with the process
                        and logic of real life, and comply with languages and
                        habits that the users are used to
                      </PerfectScrollbar>
                    </span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="terms_modal = false">취소</el-button>
                      <el-button type="primary" @click="terms_modal = false"
                        >확인</el-button
                      >
                    </span>
                  </el-dialog>
                </li>
              </ul>
            </div>

            <el-collapse v-model="active_tab_menu">
              <el-collapse-item
                v-for="document in instrument_document_list"
                :key="document.document_seq"
                :name="document.document_seq"
              >
                <template slot="title">
                  <div :class="$style.documentTitleWrap">
                    <span :class="$style.documentRequired">{{
                      document.is_agree_required === 'Y'
                        ? $t('required')
                        : $t('option')
                    }}</span>
                    {{ document.title }}
                  </div>
                  <div :class="$style.termsBtnsWrap">
                    <button
                      v-if="document.file_seq"
                      :class="$style.btnDownload"
                      @click.prevent.stop="
                        handleDownload(document.document_seq)
                      "
                      >{{ $t('download') }}</button
                    >
                    <button
                      :class="[
                        $style.btnAgree,
                        {
                          [$style.btnBlue]:
                            terms_agree.indexOf(document.document_seq) !== -1,
                        },
                        {
                          [$style.btnGray]:
                            agree_disabled.indexOf(document.document_seq) ===
                            -1,
                        },
                      ]"
                      @click.prevent.stop="clickTermBtn(document.document_seq)"
                      >{{
                        terms_agree.indexOf(document.document_seq) !== -1
                          ? $t('agreed')
                          : $t('agreement')
                      }}</button
                    >
                  </div>
                </template>
                <PerfectScrollbar
                  v-if="!document.file_seq"
                  :id="`terms_content_${document.document_seq}`"
                  :ref="`terms_content_${document.document_seq}`"
                  :class="$style.perfectScrollbar"
                  @scroll="handleScroll($event, document.document_seq)"
                >
                  <div
                    :class="$style.termsText"
                    v-html="document.content"
                  ></div>
                </PerfectScrollbar>
              </el-collapse-item>
            </el-collapse>
          </div>

          <!-- 사용설명서 링크 -->
          <template v-if="0">
            <div :class="$style.manualLinkWrap">
              <div :class="$style.manualLink">
                <img src="@assets/img/icon-paper.svg" alt="" />
                <div>
                  <p :class="$style.manualLinkTitle">코코뱅크 정기예금</p>
                  <p :class="$style.manualLinkText">상품설명서</p>
                </div>
                <a :class="$style.viewMore"
                  >상세보기 <img src="@assets/img/arrow-right.svg" alt=""
                /></a>
              </div>
              <div :class="$style.manualLink">
                <img src="@assets/img/icon-bang.svg" alt="" />
                <div>
                  <p :class="$style.manualLinkTitle">코코뱅크 정기예금</p>
                  <p :class="$style.manualLinkText">상품설명서</p>
                </div>
                <a :class="$style.viewMore"
                  >상세보기 <img src="@assets/img/arrow-right.svg" alt=""
                /></a>
              </div>
            </div>

            <!-- 체크 -->
            <div :class="$style.checkListWrap" class="check-list-wrap">
              <p :class="$style.beforeCheckText">
                <img src="@assets/img/icon-check-blue.svg" alt="" />
                상품설명서와 금리정보를 확인하시면 아래 선택사항에 동의 체크가
                가능합니다.
              </p>

              <ul :class="$style.confirmList">
                <li :class="$style.confirmItem">
                  본인은 본 상품을 인터넷뱅킹(또는 모바일뱅킹)을 통하여 중도
                  해지하는 경우 ARS인증(또는 해외체류자인증) 및 콜센터를 통한
                  본인확인 절차를 거친 후 해지가 가능함을 확인합니다.
                </li>
                <li :class="$style.confirmItem">
                  중소기업 대표자이거나, 신용등급이 7~10등급인 경우, 은행법상
                  구속행위 여부 판정에 따라 신규일 이후 1개월 이내 본인명의 대출
                  및 관련 중소기업의 대출거래가 제한 될 수 있습니다.
                </li>
                <li :class="$style.confirmItem">
                  본인은 약관 및 상품 설명서에 대해 충분히 이해하고
                  가입하였으며, 하나은행으로부터 예금자보호여부 및
                  보호한도(원금과 소정의 이자를 합하여 1인당 5천만원)에 대하여
                  설명 듣고 이해하였음을 확인합니다.
                </li>
              </ul>

              <el-checkbox v-model="required_terms_one"
                >본인은 위 안내에 대해 확인하고 이해합니다.</el-checkbox
              >

              <div :class="$style.confirmIllegalWrap">
                <h5 :class="$style.confirmIllegalTitle"
                  >불법 탈법 차명거래 금지 설명 확인서</h5
                >
                <p :class="$style.confirmIllegalText">
                  [금융실명거래 및 비밀보장에 관한 법률] 제 3조 제 3항에 따라
                  불법 재산의 은닉, 자금세탁행위, 공중협박자금조달행위 및 강제
                  집행의 면탈, 그 밖의 탈법행위를 목적으로 타인의 실명으로
                  금융거래를 하여서는 아니 되며, 이를 위반시 5년 이하의 징역
                  또는 5천만원 이하의 벌금에 처할 수 있습니다.
                </p>
                <el-checkbox v-model="required_terms_two"
                  >본인은 위 안내에 대해 확인하고 이해합니다.</el-checkbox
                >
              </div>

              <div :class="$style.optionalTerms" class="optional-terms">
                <el-checkbox v-model="optional_terms_one"
                  >상품/약관 이메일로 받기 (선택)</el-checkbox
                >
              </div>
            </div>
          </template>

          <!-- 버튼 -->
          <div :class="$style.btnsWrap">
            <button
              :class="[$style.btnConfirm, $style.btnBlue]"
              @click="stepTo('input')"
              >{{ $t('verify') }}</button
            >
            <button
              :class="$style.btnConfirm"
              @click="$router.push({ name: 'product-search' })"
              >{{ $t('cancel') }}</button
            >
          </div>
          <!-- // -->
        </div>

        <!-- Step-two -->
        <div
          v-else-if="step === 'input'"
          class="step-two"
          :class="$style.stepTwo"
        >
          <!-- 제목 -->
          <div :class="$style.subscriptionTitle">
            <h3 class="big-title"
              >{{
                fromPairs(constants.finance.instrument.instrument_type)[
                  instrument_info.instrument_type
                ]
              }}
              {{ $t('subscription') }}</h3
            >
            <ul :class="$style.progressList">
              <li :class="[$style.progressItem, $style.active]">1</li>
              <li :class="[$style.progressItem, $style.active]"
                >2. {{ $t('info_input') }}</li
              >
              <li :class="$style.progressItem">3</li>
            </ul>
          </div>

          <!-- 상품 정보 -->
          <div :class="$style.productInfo">
            <h4 :class="$style.productInfoTitle">
              {{ instrument_info.title }}
            </h4>
          </div>

          <!-- 인풋 기본정보 -->
          <div :class="$style.inputInfo">
            <h3>{{ $t('basic_info') }}</h3>
            <ul :class="$style.inputInfoList">
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('select_withdrawal_account') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-select v-model="params.execute_account_seq">
                    <el-option
                      v-for="account in cs_asset_by_accounts"
                      :key="account.seq"
                      :label="`${account.account_number} [${account.title}]`"
                      :value="account.seq"
                    >
                    </el-option>
                  </el-select>
                  <template v-if="params.execute_account_seq">
                    <p :class="$style.completeValue">
                      {{ $t('balance') }}:
                      {{
                        Decimal(cs_execute_account_info.balance).minus(
                          cs_execute_account_info.holding_balance
                        ) | codeDecimal(cs_asset_info.code)
                      }}
                      {{ cs_asset_info.code }}
                    </p>
                  </template>
                </div>
              </li>
              <li v-if="0" :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    계좌 비밀번호
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    v-model="account_password"
                    placeholder="비밀번호를 입력해주세요."
                  ></el-input>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('email_address') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <p v-if="currentUser" :class="$style.completeValue">{{
                    currentUser.email_address
                  }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- 인풋 상품정보 -->
          <div :class="[$style.inputProductInfo]">
            <h3>{{ $t('product_info') }}</h3>
            <ul :class="$style.inputInfoList">
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('new_amount') }}
                  </h4>
                </div>
                <div :class="$style.productInfoBox">
                  <div v-if="0" :class="$style.btnAddPriceWrap">
                    <button :class="$style.btnAddPrice">+100만원</button>
                    <button :class="$style.btnAddPrice">+50만원</button>
                    <button :class="$style.btnAddPrice">+10만원</button>
                    <button :class="$style.btnAddPrice">+5만원</button>
                    <button :class="$style.btnAddPrice">+만원</button>
                    <button :class="$style.btnAddPrice">정정</button>
                  </div>
                  <el-input
                    v-model="params.execute_amount"
                    class="new-price-input"
                    :placeholder="$t('enter_amount')"
                    ><span
                      slot="suffix"
                      class="input-won"
                      :class="{
                        dependOnLocale:
                          locale === 'zh-TW' ||
                          locale === 'zh-CN' ||
                          locale === 'ja-JP',
                      }"
                      >{{ cs_asset_info.code }}</span
                    ></el-input
                  >
                  <template v-if="0">
                    <el-checkbox
                      v-model="pay_width_coco"
                      class="pay-with-cocopay"
                      >코코페이로 납부</el-checkbox
                    >
                    <p :class="$style.payWidthText">
                      <img src="@assets/img/icon-bang-grey.svg" alt="" />
                      가입금액의 일부 또는 전부를 코코페이로 납입하실 수
                      있습니다.
                    </p>
                  </template>
                </div>
              </li>
              <li
                v-if="instrument_info.use_execute_amount_min === 'Y'"
                :class="$style.inputInfoItem"
              >
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('min_running_amount') }}
                  </h4>
                </div>
                <div :class="$style.productInfoBox">
                  <p :class="$style.completeValue">
                    {{ instrument_info.execute_amount_min }}
                    {{ cs_asset_info.code }}
                  </p>
                </div>
              </li>
              <li
                v-if="instrument_info.use_execute_amount_max === 'Y'"
                :class="$style.inputInfoItem"
              >
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('max_running_amount') }}
                  </h4>
                </div>
                <div :class="$style.productInfoBox">
                  <p :class="$style.completeValue">
                    {{ instrument_info.execute_amount_max }}
                    {{ cs_asset_info.code }}
                  </p>
                </div>
              </li>
            </ul>

            <!-- 중간 체크박스 -->
            <div v-if="0">
              <el-checkbox
                v-model="register_different_pw"
                class="intermediate-check"
                >신규비밀번호는 출금계좌와 다르게 등록함 (미선택시
                신규비밀번호는 출금계좌와 동일)</el-checkbox
              >
            </div>

            <!-- 하단 인풋 -->
            <ul :class="[$style.inputInfoList, $style.financeInfo]">
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('product_type') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    :value="
                      fromPairs(constants.finance.instrument.instrument_type)[
                        instrument_info.instrument_type
                      ]
                    "
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('bank_product_name') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    placeholder=""
                    disabled
                    :value="instrument_info.title"
                  ></el-input>
                </div>
              </li>
              <li v-if="instrument_info.summary" :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ '상품설명' }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    placeholder=""
                    disabled
                    :value="instrument_info.summary"
                  ></el-input>
                </div>
              </li>
              <li
                v-if="instrument_info.use_open_start === 'Y'"
                :class="$style.inputInfoItem"
              >
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('reg_start_date') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    :value="
                      date('Y-m-d H:i:s', new Date(instrument_info.open_start))
                    "
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </li>
              <li
                v-if="instrument_info.use_open_end === 'Y'"
                :class="$style.inputInfoItem"
              >
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('reg_end_date') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    :value="
                      date('Y-m-d H:i:s', new Date(instrument_info.open_end))
                    "
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('exec_start_date') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    :value="
                      date(
                        'Y-m-d H:i:s',
                        new Date(instrument_info.execute_start)
                      )
                    "
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('exec_end_date') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <el-input
                    :value="
                      date('Y-m-d H:i:s', new Date(instrument_info.execute_end))
                    "
                    placeholder=""
                    disabled
                  ></el-input>
                </div>
              </li>

              <template v-if="0">
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      이자지급방식
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <el-input
                      v-model="interest_payment_method"
                      placeholder=""
                      disabled
                    ></el-input>
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      이자지급간격
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <el-input
                      v-model="interest_payment_interval"
                      placeholder=""
                      disabled
                    ></el-input>
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      만기해지구분
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <el-radio v-model="termination_of_maturity" label="1"
                      >직접해지</el-radio
                    >
                    <el-radio v-model="termination_of_maturity" label="2"
                      >만기시 자동해지</el-radio
                    >
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      예/적금 만기<br />SMS 통보
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <el-radio v-model="sms_notification_of_expiration" label="1"
                      >신청함</el-radio
                    >
                    <el-radio v-model="sms_notification_of_expiration" label="2"
                      >신청안함</el-radio
                    >
                  </div>
                </li>
              </template>
            </ul>
          </div>

          <!-- 버튼 -->
          <div :class="$style.btnsWrap">
            <button
              :class="[$style.btnConfirm, $style.btnBlue]"
              @click="stepTo('complete')"
              >{{ $t('pay_login.confirm') }}</button
            >
            <button :class="$style.btnConfirm" @click="step = null">{{
              $t('before')
            }}</button>
          </div>
          <!-- // -->
        </div>

        <!-- Step-three -->
        <div v-else-if="step === 'complete'" class=" step-three">
          <!-- 제목 -->
          <div :class="$style.subscriptionTitle">
            <h3 class="big-title"
              >{{
                fromPairs(constants.finance.instrument.instrument_type)[
                  instrument_info.instrument_type
                ]
              }}
              {{ $t('subscription') }}</h3
            >
            <ul :class="$style.progressList">
              <li :class="[$style.progressItem, $style.active]">1</li>
              <li :class="[$style.progressItem, $style.active]">2</li>
              <li :class="[$style.progressItem, $style.active]"
                >3. {{ $t('reg_complete') }}</li
              >
            </ul>
          </div>

          <!-- 상품 정보 -->
          <div :class="$style.productInfo">
            <h4 :class="$style.productInfoTitle">
              {{ $t('reg_complete') }}
            </h4>
          </div>

          <!-- 완료 메세지 -->
          <div :class="$style.completeMessageWrap">
            <div :class="$style.completeImg">
              <img src="@assets/img/security-complete.svg" alt="" />
            </div>
            <p
              :class="$style.completeText"
              v-html="$t('bank_product.complete_msg')"
            ></p>
          </div>

          <!-- 가입내용 -->
          <div :class="[$style.inputInfo, $style.resetMargin]">
            <h3>{{ $t('subscription_details') }}</h3>
            <ul :class="$style.inputInfoList">
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('product_type') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <p :class="$style.completeValue">{{
                    fromPairs(constants.finance.instrument.instrument_type)[
                      instrument_info.instrument_type
                    ]
                  }}</p>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('product_name') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <p :class="$style.completeValue">{{
                    instrument_info.title
                  }}</p>
                </div>
              </li>
              <li :class="$style.inputInfoItem">
                <div :class="$style.infoNameBox">
                  <h4 :class="$style.infoName">
                    {{ $t('account_transfer.withdrawal_account_number') }}
                  </h4>
                </div>
                <div :class="$style.infoValueBox">
                  <p :class="$style.completeValue">{{
                    cs_execute_account_info.account_number
                  }}</p>
                </div>
              </li>

              <template v-if="0">
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      가입기간
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <p :class="$style.completeValue">12개월</p>
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      현재적용금리
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <p :class="$style.completeValue">5.01%</p>
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      적용우대금리
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <p :class="$style.completeValue">1.45%</p>
                  </div>
                </li>
                <li :class="$style.inputInfoItem">
                  <div :class="$style.infoNameBox">
                    <h4 :class="$style.infoName">
                      이자지급방식
                    </h4>
                  </div>
                  <div :class="$style.infoValueBox">
                    <p :class="$style.completeValue">만기일시지급식</p>
                  </div>
                </li>
              </template>
            </ul>
          </div>

          <!-- 버튼 -->
          <div :class="$style.btnsWrap">
            <button
              :class="[$style.btnConfirm, $style.btnBlue]"
              @click="
                $router.push({
                  name: 'fund-info',
                  query: { fund_seq: success_seq },
                })
              "
              >{{ $t('pay_login.confirm') }}</button
            >
          </div>
          <!-- // -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/product-subscription.scss';
</style>
