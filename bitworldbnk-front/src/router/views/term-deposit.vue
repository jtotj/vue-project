<script>
import date from 'locutus/php/datetime/date'
import find from 'lodash/find'
import filter from 'lodash/filter'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import every from 'lodash/every'
import { mapState } from 'vuex'

export default {
  page: {
    title: 'SvingsAccount',
    meta: [{ name: 'description', content: 'SvingsAccount' }],
  },
  data() {
    return {
      selected_asset_seq: null,
      input_target_asset: '',
      selected_asset_code: null,
      asset_svings: [],

      /* 약관동의 */
      stap_paging: 'first',
      stap_active: 0,

      terms_check: [
        {
          title: '요구불거래기본약관',
          checked: false,
        },
        {
          title: '불법\u00B7탈법 차명거래 금지 설명 확인서 약관',
          checked: false,
        },
        {
          title: '예금자보호법 설명 확인',
          checked: false,
        },
        {
          title: '정기예금특약',
          checked: false,
        },
      ],
      service_agree_check: false,
      service_agree_radio: '',
      service_check: [
        {
          lever: '전체선택',
          checked: false,
        },
        {
          lever: '문자',
          checked: false,
        },
        {
          lever: '이메일',
          checked: false,
        },
        {
          lever: '전화',
          checked: false,
        },
        {
          lever: 'DM',
          checked: false,
        },
      ],
      disabled_check: true,

      select_month: 0,
      input_join_asset: null,
      account_value: '',
      select_maturity: [{ mode: '자동해지' }, { mode: '고객직접해지' }],
      alarm_radio: '',

      /* 더보기 */
      show_accept_terms: false,
      accept_terms_title: null,
    }
  },
  computed: {
    ...mapState('account', ['accounts']),
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['otps']),
    ...mapState('auth', ['currentUser']),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),

    c_is_active_asset() {
      return filter(
        this.assets,
        (asset_info) =>
          (!this.input_target_asset ||
            asset_info.code
              .toLowerCase()
              .includes(this.input_target_asset.toLowerCase()) ||
            asset_info.title.includes(this.input_target_asset)) &&
          asset_info.is_active === 'Y'
      )
    },
    c_selected_asset() {
      if (this.selected_asset_seq !== null) {
        return find(this.assets, {
          seq: this.selected_asset_seq,
        })
      } else {
        return null
      }
    },
    c_asset_svings() {
      const assets = uniq(
        map(this.asset_svings, (value) => find(this.assets, { seq: value }))
      )
      return assets
    },
    c_seleted_accounts() {
      return filter(
        this.accounts,
        (account) => account.asset_seq === this.selected_asset_seq
      )
    },
    c_is_seleted_balance() {
      if (this.selected_asset_seq !== null) {
        return find(this.c_seleted_accounts, {
          account_number: this.account_value,
        })
      } else {
        return null
      }
    },
    c_last_date() {
      const date = []
      const date_length = new Date(
        new Date(new Date().getYear(), new Date().getMonth(), 1) - 86400000
      ).getDate()
      for (let i = 1; i <= date_length; i++) {
        date.push(i)
      }
      return date
    },
    c_join_date() {
      const date = new Date()
      if (this.select_month === 0) {
        return date
      } else {
        return date.setMonth(date.getMonth() + Number(this.select_month))
      }
    },
    c_selected_service_checkbox() {
      return every(
        filter(this.service_check, (check) => check.lever !== '전체선택'),
        { checked: true }
      )
    },
  },
  watch: {
    '$attrs.value'(to) {
      this.selected_asset_seq = to
    },
    service_agree_radio() {
      if (this.service_agree_radio === '2') {
        this.disabled_check = false
      } else {
        this.disabled_check = true
      }
    },
  },
  mounted() {
    if (localStorage.asset_svings) {
      this.asset_svings = JSON.parse(localStorage.getItem('asset_svings'))
    }
  },
  methods: {
    selectAsset(seq, code) {
      this.selected_asset_seq = seq
      this.selected_asset_code = code
    },

    date,
    fromPairs,
    onCopy() {
      this.$toasted.success(this.$t('toasted_msg.copy'))
    },
    toggleAssetFavorites(seq) {
      const index = this.asset_svings.indexOf(seq)
      if (index !== -1) {
        this.asset_svings.splice(index, 1)
        localStorage.setItem('asset_svings', JSON.stringify(this.asset_svings))
        return
      }
      this.asset_svings.push(seq)
      localStorage.setItem('asset_svings', JSON.stringify(this.asset_svings))
    },
    clickStapSecond() {
      if (this.selected_asset_seq === null) {
        return this.$alert(this.$t('private.please_select_asset'), {
          type: 'info',
        })
      } else if (
        this.terms_check[0].checked === false ||
        this.terms_check[1].checked === false ||
        this.terms_check[2].checked === false ||
        this.terms_check[3].checked === false
      ) {
        return this.$alert('약관에 동의해 주셔야 합니다.', {
          type: 'info',
        })
      } else {
        this.stap_active = 1
        this.stap_paging = 'second'
      }
    },
    clickStapFirst() {
      this.stap_active = 0
      this.stap_paging = 'first'
      this.terms_check.forEach((check) => (check.checked = false))
      this.service_check.forEach((service) => (service.checked = false))
      this.service_agree_check = false
      this.service_agree_radio = ''
    },
    clickStapThird() {
      this.stap_active = 2
      this.stap_paging = 'third'
    },
    alertPrepare() {
      this.$toasted.info(this.$t('help.prepare'))
    },
    showAcceptTermsModal(num) {
      this.terms_check[num].checked = false
      switch (num) {
        case 0:
          this.show_accept_terms = true
          this.accept_terms_title = '요구불거래기본약관'
          break
        case 1:
          this.show_accept_terms = true
          this.accept_terms_title =
            '불법\u00B7탈법 차명거래 금지 설명 확인서 약관'
          break
        case 2:
          this.show_accept_terms = true
          this.accept_terms_title = '예금자보호법 설명 확인'
          break
        case 3:
          this.show_accept_terms = true
          this.accept_terms_title = '정기예금특약'
          break
      }
    },
    clickAgreeBtn() {
      this.show_accept_terms = false
      switch (this.accept_terms_title) {
        case '요구불거래기본약관':
          this.terms_check[0].checked = true
          break
        case '불법\u00B7탈법 차명거래 금지 설명 확인서 약관':
          this.terms_check[1].checked = true
          break
        case '예금자보호법 설명 확인':
          this.terms_check[2].checked = true
          break
        case '정기예금특약':
          this.terms_check[3].checked = true
          break
      }
    },
    handleClose() {
      this.show_accept_terms = false
      switch (this.accept_terms_title) {
        case '요구불거래기본약관':
          this.terms_check[0].checked = false
          break
        case '불법\u00B7탈법 차명거래 금지 설명 확인서 약관':
          this.terms_check[1].checked = false
          break
        case '예금자보호법 설명 확인':
          this.terms_check[2].checked = false
          break
        case '정기예금특약':
          this.terms_check[3].checked = false
          break
      }
    },
    handleChangeService(index) {
      if (index === 0) {
        if (this.service_check[0].checked === true) {
          this.service_check.forEach((service) => (service.checked = true))
        } else if (this.service_check[0].checked === false) {
          this.service_check.forEach((service) => (service.checked = false))
        }
      }
      if (this.c_selected_service_checkbox) {
        this.service_check[0].checked = true
      } else {
        this.service_check[0].checked = false
      }
    },
    changeServiceAgree() {
      if (this.service_agree_check) {
        this.service_agree_radio = '2'
        this.disabled_check = false
      } else {
        this.service_agree_radio = '1'
        this.disabled_check = true
      }
    },
  },
}
</script>
<template>
  <div class="bank-container">
    <div class="contents">
      <div class="big-title-wrap">
        <h2 class="big-title"> {{ $t('new_deposit_account') }} </h2>
      </div>
      <div :class="[$style.tradesWrap]">
        <div :class="[$style.tradesBox]">
          <div :class="[$style.tradesWrap]">
            <div :class="[$style.tradesBox]">
              <!-- 자산 목록 -->
              <article :class="[$style.tradesLeft]">
                <p :class="[$style.tradesHead]">
                  {{ $t('wallet_page.asset_list') }}
                </p>
                <div :class="[$style.assetList]">
                  <!-- 자산 검색 -->
                  <div :class="[$style.assetSearch]">
                    <el-input
                      v-model="input_target_asset"
                      prefix-icon="el-icon-search"
                      :placeholder="$t('account_transfer.pls_search_asset')"
                      :class="[$style.inputAssetSearch]"
                    />
                  </div>
                  <el-tabs type="card" :class="[$style.tabs]">
                    <!-- 자산 -->
                    <el-tab-pane :label="$t('asset')">
                      <div class="fixedValue">
                        <PerfectScrollbar :class="[$style.perfectScrollbar]">
                          <ul>
                            <template v-for="asset in c_is_active_asset">
                              <li
                                :key="asset.seq"
                                :class="[
                                  {
                                    [$style.selected]:
                                      selected_asset_seq === asset.seq,
                                  },
                                  $style.coinList,
                                ]"
                                @click="selectAsset(asset.seq, asset.code)"
                              >
                                <div :class="[$style.assetCode]">
                                  <p :class="`${asset.code}`"></p>
                                  <span>{{ asset.code }}</span>
                                  <div
                                    :class="[
                                      {
                                        [$style.active]:
                                          asset_svings.indexOf(asset.seq) !==
                                          -1,
                                      },
                                      $style.favorite,
                                    ]"
                                    @click.prevent.stop="
                                      toggleAssetFavorites(asset.seq)
                                    "
                                  >
                                  </div>
                                </div>

                                <div :class="[$style.textWrap]">
                                  <p :class="[$style.textInfo]">
                                    대표적인 비트월드 정기적금 상품입니다.
                                    우대금리 쑥쑥! 대표적금 통장을 지금
                                    걔설하세요. 최대 2.7% 제공!
                                  </p>
                                  <div :class="$style.rateWrap">
                                    <p>
                                      최고 월 2.3%
                                    </p>
                                    &nbsp;|&nbsp;
                                    <p>
                                      최대 12개월
                                    </p>
                                  </div>
                                </div>
                              </li>
                            </template>
                          </ul>
                        </PerfectScrollbar>
                      </div>
                    </el-tab-pane>
                    <!-- 즐겨찾기 -->
                    <el-tab-pane :label="$t('favorites')">
                      <div class="fixedValue">
                        <PerfectScrollbar>
                          <ul>
                            <li
                              v-for="favorite in c_asset_svings"
                              :key="favorite.seq"
                              :class="[
                                $style.coinList,
                                {
                                  [$style.selected]:
                                    selected_asset_seq === favorite.seq,
                                },
                              ]"
                              @click.prevent.stop="
                                selectAsset(favorite.seq, favorite.code)
                              "
                            >
                              <div :class="[$style.assetCode]">
                                <p :class="`${favorite.code}`"></p>
                                <div
                                  :class="[
                                    {
                                      [$style.active]:
                                        asset_svings.indexOf(favorite.seq) !==
                                        -1,
                                    },
                                    $style.favorite,
                                  ]"
                                  @click.prevent.stop="
                                    toggleAssetFavorites(favorite.seq)
                                  "
                                >
                                </div>
                                <span>
                                  {{ favorite.code }}
                                </span>
                              </div>
                              <div :class="[$style.textWrap]">
                                <p :class="[$style.textInfo]">
                                  대표적인 비트월드 정기적금 상품입니다.
                                  우대금리 쑥쑥! 대표적금 통장을 지금
                                  걔설하세요. 최대 2.7% 제공!
                                </p>
                                <div :class="$style.rateWrap">
                                  <p>
                                    최고 월 2.3%
                                  </p>
                                  &nbsp;|&nbsp;
                                  <p>
                                    최대 12개월
                                  </p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </PerfectScrollbar>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </article>

              <!-- 약관동의 -->
              <article :class="[$style.tradesRight]">
                <section
                  v-if="selected_asset_seq !== null"
                  :class="[$style.sectionWrap]"
                >
                  <h3>약관 동의</h3>
                  <el-steps
                    :active="stap_active"
                    finish-status="success"
                    class="step-wrap"
                    align-center
                  >
                    <el-step></el-step>
                    <el-step></el-step>
                    <el-step></el-step>
                  </el-steps>

                  <!-- 약관 동의 -->
                  <section
                    v-if="stap_paging === 'first'"
                    :class="$style.ContentsWrap"
                  >
                    <PerfectScrollbar>
                      <div :class="$style.acceptTermsWrap">
                        <div
                          v-for="(term, idx) in terms_check"
                          :key="term.title"
                          :class="$style.checkWrap"
                          @click="showAcceptTermsModal(idx)"
                        >
                          <el-checkbox
                            v-model="terms_check[idx].checked"
                            :class="$style.acceptTermsCheck"
                          />
                          <p :class="$style.termsTitle">{{ term.title }}</p>
                          <p
                            :class="[$style.moreText]"
                            @click="showAcceptTermsModal(idx)"
                          >
                            더보기
                            <i class="el-icon-arrow-right" />
                          </p>
                        </div>
                        <div :class="[$style.marketingWrap]">
                          <p>마케팅 이용 동의</p>
                          <p :class="[$style.marketingInfo]">
                            비트월드에서 제공하는 새로운 서비스 및 우대이율에
                            대한 정보를 아래 안내수단을 통해 제공해 드리고
                            있습니다.
                          </p>
                        </div>
                        <div
                          :class="[$style.serviceAgreeCheck, $style.checkWrap]"
                        >
                          <el-checkbox
                            v-model="service_agree_check"
                            :class="[$style.acceptTermsCheck]"
                            @change="changeServiceAgree"
                          >
                          </el-checkbox>
                          <p :class="$style.termsTitle"
                            >[선택] 개인(신용)정보 수집 이용 동의서(상품서비스
                            안내 등)</p
                          >
                          <el-row :class="$style.radioServiceWrap">
                            <el-radio v-model="service_agree_radio" label="1">
                              동의하지 않음
                            </el-radio>
                            <el-radio v-model="service_agree_radio" label="2">
                              동의함
                            </el-radio>
                          </el-row>
                          <p :class="$style.serviceCheckTitle"
                            >상품서비스 안내수단</p
                          >
                          <div :class="$style.CheckServiceWrap">
                            <el-checkbox
                              v-for="(check, index) in service_check"
                              :key="index"
                              v-model="service_check[index].checked"
                              :disabled="disabled_check"
                              @change="handleChangeService(index)"
                            >
                              {{ check.lever }}</el-checkbox
                            >
                          </div>
                          <div :class="$style.acceptTermsBtn">
                            <button
                              :class="$style.joinBtn"
                              @click="clickStapSecond"
                              >신규가입</button
                            >
                          </div>
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </section>

                  <!-- 적금 가입 from -->
                  <section
                    v-if="stap_paging === 'second'"
                    :class="[$style.ContentsWrap]"
                  >
                    <div>
                      <PerfectScrollbar :class="$style.prefectScroll">
                        <h4> {{ selected_asset_code }} 적금 </h4>
                        <p :class="[$style.subTitle]">가입기간</p>
                        <div>
                          <div :class="$style.joinTermWrap">
                            <input
                              v-model="select_month"
                              :class="$style.joinTermInput"
                            />
                            <p>개월</p>
                            <div :class="$style.joinTerm">
                              {{ date('Y.m.d', new Date()) }}~{{
                                date('Y.m.d', new Date(c_join_date))
                              }}
                            </div>
                          </div>
                          <div :class="[$style.subContentsWrap]">
                            <p :class="[$style.subTitle]">가입자산</p>
                            <el-row class="btn-wrap">
                              <el-button @click="input_join_asset = '50,000'">
                                +5만개
                              </el-button>
                              <el-button @click="input_join_asset = '500,000'">
                                +50만개
                              </el-button>
                              <el-button
                                @click="input_join_asset = '1,000,000'"
                              >
                                +100만개
                              </el-button>
                              <el-button
                                @click="input_join_asset = '5,000,000'"
                              >
                                +500만개
                              </el-button>
                              <el-button
                                @click="input_join_asset = '10,000,000'"
                              >
                                +1천만개
                              </el-button>
                            </el-row>
                            <input
                              v-model="input_join_asset"
                              :class="$style.assetCountInput"
                            />
                            <p :class="$style.countInputText"
                              >1천만개 이상 5만개 이하는 직접 입력하세요</p
                            >
                            <p :class="$style.countText">개</p>
                          </div>
                          <div :class="[$style.subContentsWrap]">
                            <p :class="[$style.subTitle]">출금계좌 선택</p>
                            <el-select
                              v-model="account_value"
                              placeholder="계좌를 선택해주세요"
                            >
                              <el-option
                                v-for="account in c_seleted_accounts"
                                :key="account.seq"
                                :label="account.account_number"
                                :value="account.account_number"
                              >
                              </el-option>
                            </el-select>
                            <p
                              v-if="c_is_seleted_balance"
                              :class="$style.balanceText"
                            >
                              출금가능개수
                              {{ c_is_seleted_balance.balance }} 개
                            </p>
                          </div>
                          <div :class="[$style.subContentsWrap]">
                            <p :class="[$style.subTitle]">만기 해지방법</p>
                            <el-select
                              v-model="account_value"
                              placeholder="자동해지"
                            >
                              <el-option
                                v-for="maturity in select_maturity"
                                :key="maturity.index"
                                :label="maturity.mode"
                                :value="maturity.mode"
                              >
                              </el-option>
                            </el-select>
                          </div>
                          <div :class="[$style.subContentsWrap]">
                            <p :class="[$style.subTitle]">
                              상품만기 알림 (E-mail) 서비스
                            </p>
                            <el-radio v-model="alarm_radio" label="1">
                              아니오
                            </el-radio>
                            <el-radio v-model="alarm_radio" label="2">
                              예
                            </el-radio>
                            <div :class="$style.emailTextAarea">
                              <p :class="$style.emailTextTitle"
                                >E-mail을 통해 예적금상품의 만기를 사전
                                안내해드리는 서비스</p
                              >
                              <p
                                >- 대상고객: 개인 및 개인사업자(임의 단체, 법인
                                제외)</p
                              >
                              <p
                                >- 만기 5영업일 전 보안설정 > 내정보관리 >
                                내정보 조회에 등록된 고객님의 이메일로
                                발송해드립니다.</p
                              >
                              <p
                                >- 이메일 수신 거절인 경우, 보안설정 > 내
                                정보관리 > 내 정보 수정에서 이메일 수신으로 변경
                                후 이용 가능합니다.</p
                              >
                              <p
                                >- 가입상품의 만기알림 이메일 서비스 조회 및
                                변경은 금융상품 > 예금 > 예금관리 > 상품만기
                                알림 이메일 서비스 신청/해지 에서 가능합니다.</p
                              >
                            </div>
                          </div>
                        </div>

                        <div :class="$style.joinBtnWrap">
                          <button
                            :class="$style.backBtn"
                            @click="clickStapFirst"
                            >뒤로가기</button
                          >
                          <button
                            :class="$style.joinBtn"
                            @click="clickStapThird"
                            >가입하기</button
                          >
                        </div>
                      </PerfectScrollbar>
                    </div>
                  </section>
                  <!-- 가입 완료 -->
                  <section
                    v-if="stap_paging === 'third'"
                    :class="[$style.ContentsWrap]"
                  >
                    <div :class="$style.thankWrap">
                      <div :class="$style.thankTextWrap">
                        <i class="el-icon-check" />
                        <p>
                          <span>{{ selected_asset_code }} 적금 가입</span>이
                          완료되었습니다.
                        </p>
                        <p>감사합니다.</p>
                      </div>
                      <div :class="$style.joinBtnWrap">
                        <button :class="$style.backBtn" @click="alertPrepare"
                          >관리하기</button
                        >
                        <button :class="$style.joinBtn" @click="clickStapFirst"
                          >정기예금 더보기</button
                        >
                      </div>
                    </div>
                  </section>
                </section>
                <section
                  v-else
                  :class="[$style.ContentsWrap, $style.noSelectAssetWrap]"
                >
                  <div :class="[$style.noSelectAsset]">
                    <h3
                      >목록에서 자산을 선택 후 계좌를 생성하실 수 있습니다.</h3
                    >
                  </div>
                </section>
              </article>

              <!-- 약관동의 더보기 -->
              <el-dialog
                :visible.sync="show_accept_terms"
                :append-to-body="true"
                width="60%"
                :title="accept_terms_title"
                :before-close="handleClose"
              >
                <section>
                  <el-button @click="clickAgreeBtn">확인</el-button>
                </section>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/favorite.scss';
</style>
<style>
.step-wrap .el-step__head.is-success {
  color: #0068c1;
  border-color: #0068c1;
}
.btn-wrap .el-button.is-disabled:hover {
  background: none !important;
}
.btn-wrap .el-button.el-button--default {
  width: 18%;
  padding: 15px 10px;
}

@media (max-width: 900px) {
  .btn-wrap .el-button.el-button--default {
    width: 18%;
    padding: 10px 10px;
    margin-left: 5px;
    font-size: 13px;
  }
}

@media (max-width: 560px) {
  .btn-wrap .el-button.el-button--default {
    width: 50%;
    margin-left: 0;
    font-size: 13px;
  }
}
</style>
