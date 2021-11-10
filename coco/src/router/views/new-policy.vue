<script>
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'Policy',
    meta: [{ name: 'description', content: 'Policy' }],
  },
  data() {
    return {
      activeNames: [''],
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('common', { config: (state) => state.config }),
    c_display_terms() {
      return filter(this.config.terms, { display: 'Y' })
    },
  },
  methods: {
    fromPairs,
  },
}
</script>

<template>
  <div class="main">
    <!-- main 시작 -->
    <div class="policy-wrap">
      <div class="container">
        <el-collapse v-model="activeNames">
          <template v-for="list in c_display_terms">
            <el-collapse-item
              :key="list.type"
              :title="fromPairs(constants.service.term_types)[list.type]"
              :name="list.type"
            >
              <PerfectScrollbar class="scroll">
                <div class="content" v-html="list.content"> </div>
              </PerfectScrollbar>
            </el-collapse-item>
          </template>
          <!-- CCM 생애 첫 배당금 적금 상품 설명서 -->
          <el-collapse-item title="CCM 생애 첫 배당금 적금 상품 설명서">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  ><strong
                    >『CCM 생애 첫 ‌배당형 펀드』‌ ‌상품설명서‌ ‌</strong
                  ></p
                >

                <p>‌</p>

                <table border="1" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td valign="top"
                        ><p
                          >이‌ ‌설명서는‌ ‌이용자의‌ ‌상품에‌ ‌대한‌ ‌이해를‌
                          ‌돕기‌ ‌위한‌ ‌참고자료이며,‌ ‌실제‌ ‌계약은‌CCM 생애
                          첫 ‌배당형 펀드 ‌특약,‌ ‌예금거래기본약관 및
                          암호자산예치표준약관이‌ ‌적용됩니다.‌ ‌계약을‌
                          ‌신청하는‌ 경우‌ ‌약관이,‌ 계약을‌ ‌체결하는‌ ‌경우‌
                          계좌 및 ‌계약서류가‌ ‌온라인으로‌ ‌개설 및
                          교부됩니다.‌ ‌</p
                        ></td
                      >
                    </tr>
                  </tbody>
                </table>

                <p>‌</p>

                <p><strong>1. 상품‌ ‌개요‌ ‌및‌ ‌특징</strong>‌ ‌</p>

                <p>상품명‌‌:‌ CCM 생애 첫 배당형 ‌펀드‌</p>

                <p
                  >상품‌특징:‌ ‌납입‌ ‌금액에‌ ‌따라 배당지급 및 수수료 할인
                  혜택을 제공하는‌ ‌펀드 상품‌ ‌</p
                >

                <p>‌</p>

                <p><strong>2. 계약‌ ‌조건‌</strong> ‌</p>

                <p
                  >※ 배당률‌ ‌및‌ ‌수수료 할인 혜택에‌ ‌대한‌ ‌아래‌ ‌내용은‌
                  ‌고객의‌ ‌이해를‌ ‌돕기‌ ‌위하여‌ ‌약정‌ ‌전에‌ ‌제공되는‌
                  ‌자료로‌ ‌‌실제‌ ‌계약‌ ‌내용은‌ 가입시 고지되는‌ ‌약관 ‌또는‌
                  ‌증서에‌ ‌따릅니다.‌ ‌</p
                >

                <table border="1" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td valign="top"><p>구 분‌ ‌</p></td>
                      <td valign="top"><p>내 용‌ ‌</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>가 입 대 상‌ ‌</p></td>
                      <td valign="top"
                        ><p
                          >> 보안등급 2단계 인증 완료한 코코뱅크 가입자(1인
                          1계좌)</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>계 약 기 간‌ ‌</p></td>
                      <td valign="top"><p>> 1개월‌ ‌(1일부터 말일까지)</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>가 입 기 간</p></td>
                      <td valign="top"><p>> 매월 23일부터 말일까지</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>가 입 방 법</p></td>
                      <td valign="top"
                        ><p>> 신규 및 해지 : 영업점, 홈페이지, 모바일</p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>재예치 예약</p></td>
                      <td valign="top"
                        ><p
                          >> 자동 재예치를 원하는 경우에는 재예치 예약을 통해
                          익월 상품으로 자동 재예치 할 수 있습니다. (다수의 상품
                          예약 가능)</p
                        >

                        <p>> 재예치 예약은 가입기간동안 신청 가능합니다.</p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>금융상품유형</p></td>
                      <td valign="top"><p>> 배당형 펀드</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>실 행 자 산</p></td>
                      <td valign="top"><p>> CCM</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>가 입 한 도 ‌</p></td>
                      <td valign="top"
                        ><p>> 최소금액 $500/CCM부터, 최고한도 제한 없음</p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>‌중 도 해 지‌ ‌</p></td>
                      <td valign="top"
                        ><p>> 가입기간 외 기간에 중도해지 불가합니다.</p>

                        <p
                          >> 가입기간에 해지 시, 신규가입자는 가입 시 납입한
                          CCM은 수령 가능하나 배당금 지급에서는 제외됩니다.</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>공 시 일</p></td>
                      <td valign="top"
                        ><p>> 익월 상품에 대한 등급 산정일로 매월 22일 </p>

                        <p>(공휴일 및 휴일일 경우 다음 영업일)</p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>만 기‌ 일</p></td>
                      <td valign="top"><p>> 매월 말일 자정</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>해 지 방 법</p></td>
                      <td valign="top"
                        ><p>> 홈페이지 또는 모바일을 통해 직접 해지 신청</p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top">
                        <p>기본배당‌</p>

                        <p>‌수령‌‌ 방식‌ ‌</p></td
                      >
                      <td valign="top"
                        ><p
                          >> ‌COCOFX‌ ‌플랫폼 총 ‌수수료의‌ ‌30%를‌ ‌책정‌ ‌후
                          백분율로 환산하여 ‌가입자에게‌ ‌고지합니다.‌ ‌ ‌</p
                        >

                        <p
                          >> 배당 수령은 가입자가 코코뱅크 계좌를 통해 직접 수령
                          받는 방식입니다.</p
                        >

                        <p
                          >> 배당 받을 계좌를 정산일 이후에 개설한 경우에도 배당
                          수령이 가능합니다.</p
                        >

                        <p
                          >> 배당 수령은 정산일 이후부터 기간 제한 없이 받을 수
                          있습니다.</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"
                        ><p>지분율‌ ‌ ‌</p>

                        <p>계산‌ 방법‌ ‌</p></td
                      >
                      <td valign="top"
                        ><p
                          >> ‌<strong>[예치금/총‌ ‌판매액‌ ‌x‌ ‌100]</strong>‌
                          ‌</p
                        >

                        <p
                          ><strong>예시)</strong> 5,000CCM/100,000CCM x 100 =
                          5%</p
                        >

                        <p
                          >적금 가입자 총 예치금 100,000CCM중 본인(가입자)의
                          적금 예치금이 5,000CCM이라고 가정했을 때 전체 배당금
                          중 5% 지분율을 산정하여 배당을 수령합니다.</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>배당‌ ‌계산‌ ‌방법</p></td>
                      <td valign="top"
                        ><p
                          >> ‌<strong>‌</strong>당월 지급 예상 배당액이 고지되면
                          각 자산에 본인의 지분율을 산정하여 예상 수령액을
                          계산합니다.</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td rowspan="2" valign="top">
                        <p>수수료</p>

                        <p>할인 혜택‌</p></td
                      >
                      <td valign="top"
                        ><p
                          >> 계약 실행일로부터 자유롭게 수수료를 돌려받을 수
                          있으며, 홈페이지 ‘마이페이지-수당’에서 직접 환급
                          가능합니다.</p
                        >

                        <p>> 등급별‌ ‌수수료 할인율‌ ‌</p>

                        <table border="1" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td valign="top"><p>등급‌ ‌</p></td>
                              <td valign="top"><p>환율 기준</p></td>
                              <td valign="top"><p>‌ ‌수수료‌ ‌할인율</p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>3등급 ‌</p></td>
                              <td valign="top"
                                ><p>‌$500‌/CCM이상 $1,000/CCM 미만</p></td
                              >
                              <td valign="top"><p>30%‌ </p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>2등급‌ ‌</p></td>
                              <td valign="top"
                                ><p>$1,000/CCM 이상</p>

                                <p>$2,000/CCM 미만</p></td
                              >
                              <td valign="top"><p>35%‌ ‌</p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>1등급‌ ‌</p></td>
                              <td valign="top"><p>$2,000‌/CCM이상</p></td>
                              <td valign="top"><p>40%‌ ‌‌</p></td>
                            </tr>
                          </tbody>
                        </table>

                        <p>※환율은 미화기준 CCM의 기준입니다.</p>

                        <p
                          >예시) 1CCM을 10CENT의 환율로 가정했을 경우 1등급에
                        </p>

                        <p>필요한 CCM은 $2000/20000CCM입니다.</p>

                        <p>※CCM 환율은 매월 22일 기준입니다. </p></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"
                        ><p>> 가입‌ ‌연차대비‌ ‌구간별 수수료 할인율</p>

                        <table border="1" cellspacing="0" cellpadding="0">
                          <tbody>
                            <tr>
                              <td valign="top"><p>등급‌ ‌</p></td>
                              <td valign="top"><p>1년차‌ ‌</p></td>
                              <td valign="top"><p>2년차‌ ‌</p></td>
                              <td valign="top"><p>3년차‌ ‌</p></td>
                              <td valign="top"><p>4년차‌ ‌</p></td>
                              <td valign="top"><p>5년차‌ ‌</p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>3등급‌</p></td>
                              <td valign="top"><p>30%‌ ‌</p></td>
                              <td valign="top"><p>25%‌ ‌</p></td>
                              <td valign="top"><p>20%‌ ‌</p></td>
                              <td valign="top"><p>15%‌ ‌</p></td>
                              <td valign="top"><p>10%‌ ‌</p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>2등급</p></td>
                              <td valign="top"><p>35%‌ ‌</p></td>
                              <td valign="top"><p>30%‌ ‌</p></td>
                              <td valign="top"><p>25%‌ ‌</p></td>
                              <td valign="top"><p>20%‌ ‌</p></td>
                              <td valign="top"><p>15%‌ ‌</p></td>
                            </tr>

                            <tr>
                              <td valign="top"><p>1등급</p></td>
                              <td valign="top"><p>40%‌ ‌</p></td>
                              <td valign="top"><p>35%‌ ‌</p></td>
                              <td valign="top"><p>30%‌ ‌</p></td>
                              <td valign="top"><p>25%‌ ‌</p></td>
                              <td valign="top"><p>20%‌ ‌</p></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td valign="top"><p>정 산 일</p></td>
                      <td valign="top"><p>> 만기일로부터 7영업일 째 </p></td>
                    </tr>

                    <tr>
                      <td valign="top"
                        ><p>원금‌ ‌또는‌ ‌배당‌ ‌</p>

                        <p>지급‌ 관련 ‌제한‌ ‌</p></td
                      >
                      <td valign="top"
                        ><p
                          >> 계좌에‌ ‌압류,‌ ‌가압류‌ ‌등이‌ ‌등록될‌ ‌경우‌
                          ‌원금‌ ‌및‌ ‌배당 ‌지급‌ ‌제한‌ ‌</p
                        ></td
                      >
                    </tr>

                    <tr>
                      <td valign="top"><p>양도‌ ‌및‌ ‌질권설정‌</p></td>
                      <td valign="top"><p>> ‌양도 및 질권설정 불가</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>계약해지 방법</p></td>
                      <td valign="top"><p>> 가입기간 내에 계약해지 가능</p></td>
                    </tr>

                    <tr>
                      <td valign="top"><p>예금자‌ ‌보호‌ ‌여부‌</p></td>
                      <td valign="top"><p>> 해당‌ ‌없음‌ ‌</p></td>
                    </tr>
                  </tbody>
                </table>

                <p><strong>3. 유의사항</strong>‌ ‌</p>

                <p
                  >※ 만기일 이후에 공지되는 배당 자산을 참고하여 각 자산 별로
                  계좌를 개설해야 배당수령이 가능합니다.</p
                >

                <p
                  >※ 아래 자료는 고객의 이해를 돕기 위함으로 영업점 상황 등에
                  따라 변경될 수 있습니다.</p
                >

                <table border="1" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td valign="top"
                        ><p
                          >이‌ ‌적금은‌ ‌COCO‌‌BANK에서‌ ‌개발한‌
                          ‌금융상품입니다.‌ 상품가입‌ ‌후‌ ‌의문사항‌ ‌또는‌
                          ‌불만 (민원)이‌ ‌있을‌ ‌경우‌ ‌고객센터(cocobnk.com)‌
                          ‌1대1‌ ‌문의를‌ ‌통하여‌ ‌문의‌ ‌할‌ ‌수‌ ‌있습니다.‌
                          ‌</p
                        ></td
                      >
                    </tr>
                  </tbody>
                </table>
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- CCM 생애 첫 배당형 펀드 특약 -->
          <el-collapse-item title="CCM 생애 첫 배당형 펀드 특약">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style="margin:0;font-size:15px;line-height:115%;text-align:center;"
                  ><strong
                    ><span style='font-size:24px;line-height:115%;";'
                      >CCM 생애 첫 배당형 펀드 특약</span
                    ></strong
                  ></p
                >
                <p
                  style="margin:0;font-size:15px;line-height:115%;text-align:center;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 1조 약관의 적용</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p
                  style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:32.2pt;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >&ldquo;CCM 생애 첫 배당형 펀드&rdquo; (이하 &lsquo;이
                    펀드&rsquo; 라 함)&nbsp;</span
                  ><span style='";'>거래는</span><span style='";'>&nbsp;</span
                  ><span style='";'>이</span><span style='";'>&nbsp;</span
                  ><span style='";'>특약이</span><span style='";'>&nbsp;</span
                  ><span style='";'>적용되며</span
                  ><span style='";'>,&nbsp;</span><span style='";'>이</span
                  ><span style='";'>&nbsp;</span><span style='";'>특약에서</span
                  ><span style='";'>&nbsp;</span><span style='";'>정하지</span
                  ><span style='";'>&nbsp;</span><span style='";'>아니한</span
                  ><span style='";'>&nbsp;</span><span style='";'>사항은</span
                  ><span style='";'>&nbsp;</span
                  ><span style='";'>예금거래기본약관을 적용합니다.&nbsp;</span
                  ><span style='";'
                    >이 펀드의 거래에 있어서 발생하는 전자금융거래에 관한 사항은
                    전자금융거래기본약관을 적용합니다.&nbsp;</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 2조 용어의 정의</span></strong
                  ></p
                >
                <p
                  style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:18.0pt;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >&lsquo;CCM&rsquo; 이라 함은 코코뱅크가 발행하는 가상화폐
                      자산으로, 시간에 따라 유동적으로 화폐가치가 변화하며, 이
                      펀드 가입시에 사용하는 코인입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;가입기간&rsquo; 이라 함은 신규가입 및 재예치
                      가입일을 의미하며 매월 23일부터 말일까지 입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;재예치예약&rsquo; 이라 함은 익월 상품에 대해 자동
                      재예치 할 수 있는 서비스입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;실행일&rsquo; 이란 이 펀드가 시작되는 날로 매월
                      1일입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;실행기간&rsquo; 이란 해지가 불가한 기간으로 배당액
                      및 지분율 산정을 위한 기간입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;공시일&rsquo; 이라 함은 익월 상품에 대한 등급
                      산정일로 매월 22일입니다. 공시일이 공휴일 및 휴일일 경우
                      다음 영업일입니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;만기일&rsquo; 이라 함은 이 펀드가 해지되는 날로
                      매월 말일 자정입니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >&lsquo;정산일&rsquo; 이라 함은 이 펀드에 대한 배당금
                      지급일로 만기일로부터 7 영업일 째입니다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:39.3pt;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 3조 가입대상&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >만 19세 이상 코코뱅크 가입자&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >보안등급 2단계 인증을 완료해야 가입이 가능합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >1인당 1계좌만 생성이 가능합니다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 4조 계약기간&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >이 펀드의 계약기간은 1개월로 매월 1일부터 말일까지 입니다.
                    이 펀드는 매월 동일한 상품이 새롭게 출시되며 익월 상품에
                    대하여 새롭게 가입을 진행해야 합니다.</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 5조 적립금액</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >이 펀드는 최소 $500/CCM부터 가입할 수 있으며 최고가입
                    금액에 대한 제한은 없습니다.&nbsp;</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong
                    ><span style='";'>&nbsp;6조 등급산정</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >CCM 환율 기준은 매월 22일입니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >영업점 및 홈페이지 그리고 상품설명서에 고시된 가입금액에
                      따라 등급이 부여됩니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >공시일 내에 추가 납입이 이루어지지 않을 시 등급이
                      하향조정 되며 그에 따른 혜택도 달라집니다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 7조 배당금수령</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >배당금은 정산일로부터 수령할 수 있습니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >COCOFX 수수료 수익 중 30%를 백분율로 환산하여 배당
                      총액으로 표기합니다. &nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style="margin:0;margin-left:39.3pt;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >가입자가 보유한 CCM 수에 따라 배당 총액 대비 지분율이
                    정해집니다. COCOFX 수수료는 자사 및 임대 플랫폼을 통하여
                    발생하는 통행료를 기준으로 합니다.&nbsp;</span
                  ></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >만기일 이전에 배당을 수령할 암호자산 자산의 종류를
                      확인합니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >배당금은 코코뱅크 내 계좌로만 수령할 수 있습니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >해당 자산에 맞는 코코뱅크 계좌를 통해 직접 수령해야
                      합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >배당 받을 계좌를 정산일 이후에 개설한 경우에도 배당
                      수령이 가능합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >정산일 이후부터 배당 수령에 대한 기간 제한은
                      없습니다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 8조 중도해지&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >이 펀드는 실행기간동안 해지가 불가한
                      상품입니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >가입기간내에 해지 시, 신규가입자는 배당금 수령 없이 가입
                      시 납입한 CCM만 수령할 수 있습니다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 9조 해지방법</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >만기일 이후 홈페이지 및 모바일에서 직접 해지를 신청해야
                      합니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >만기해지를 신청하지 않을 시 원금 수령이
                      불가합니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >만기 해지할 경우 동일상품의 재가입이
                      불가합니다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 10조 우대혜택&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >계약 기간동안 수수료 할인 혜택이 주어집니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >영업점 및 홈페이지 그리고 상품설명서에 고시한 등급 기준에
                      따라 할인 혜택이 적용됩니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >계약 실행일로부터 홈페이지 &lsquo;마이페이지-수당&rsquo;
                      에서 직접 환급 가능합니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >만기일 이후에도 기간 제한없이 계약기간동안 발생한
                      수수료에 대해서 환급 받을 수 있습니다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 11조 제한사항&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >이 펀드는 자동연장 혹은 자동 해지가 불가합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >이 펀드는 양도에 의한 명의변경이 불가합니다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 12조 부가서비스</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >코코뱅크는 고객이 신청할 경우 익월상품으로 자동 재예치 할
                    수 있는 서비스를 제공합니다.</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >이 서비스는 당월상품 만기 후 해지하지 않은 상태에서 익월
                      상품으로 자동 재가입 신청이 가능합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 신청은 원하는 기간(개월 수)만큼 지정할 수
                      있습니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 신청 가능 기간은 최대 1년입니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 신청은 가입기간동안 가능합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치는 신청한 달의 익월부터 적용됩니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 신청을 하지 않은 경우에는 가입기간에 재가입
                      신청을 수동으로 진행해야 합니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 취소는 가입기간에 홈페이지를 통하여 신청할
                      수 있습니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >자동 재 예치 신청 후에도 가입 기간동안 추가 예치를 진행할
                      수 있습니다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >CCM환율 변동에 따른 등급 변동이 발생할 수있습니다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>부칙&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 1조 시행일</span></strong
                  ><span style='";'
                    >&nbsp;이 약관은 2021년 &nbsp; &nbsp;3 월 &nbsp; 22 일부터
                    시행합니다.&nbsp;</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 개인정보처리방침 -->
          <el-collapse-item title="개인정보처리방침">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                  ><strong
                    ><span style="font-size:19px;"
                      >개인(신용)정보관리보호정책</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <ol style="margin-left:26px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >코코뱅크는 엄격한 원칙에 따라 제공해주시는 고객정보를
                      안전하게 보호하겠습니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >코코뱅크는 고객정보를 상품,&nbsp;서비스 및 다양한 혜택을
                      알려드리거나,&nbsp;업무를 수행함에 있어 최상의 서비스를
                      제공하기 위한 목적으로만 사용하도록 하겠습니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >코코뱅크는 미리 고지해드리거나,&nbsp;고객의 동의 또는
                      허가를 얻은 경우 또는 법률상 허용된 경우 외에는 절대로
                      고객정보를 외부에 유출하지 않겠습니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >코코뱅크는 고객이 원하시는 경우 회사 또는 제휴업체의
                      직접마케팅이 중단되도록 조치하겠습니다.&nbsp;고객의
                      신용정보는 고객이 동의하신 목적으로만
                      활용됩니다.&nbsp;제휴회사 등에 대한 정보의 제공,활용에
                      동의하지 않으시는 경우 제휴서비스 및 부가서비스를 제공받지
                      못하실 수도 있습니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >제휴회사 등에 대한 정보의 제공,활용에 동의하지 않으시는
                      경우 제휴서비스 및 부가서비스를 제공받지 못하실 수도
                      있습니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >고객의 신용정보를 코코뱅크가 제3자에게 제공한 경우
                      제공받은 자,&nbsp;이용목적,&nbsp;제공일자,&nbsp;제공한
                      정보의 주요내용 등에 대해 통보를 요구할 수
                      있으며,&nbsp;고객이 코코뱅크에 제공하신 신용정보의 정정을
                      요구하시는 경우,&nbsp;그 정확성을 확인하여 당해 신용정보를
                      즉시 정정하고 결과를 통보해 드리도록 하겠습니다.</span
                    ></li
                  >
                </ol>
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;text-align:center;'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >개인정보처리방침</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:11.25pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;color:#555;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:11.25pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;"
                    >코코뱅크(이하 &ldquo;회사&rdquo;)은 개인정보보호법 제30조에
                    따라 고객의 개인정보 및 권익을 보호하고 개인정보가 어떠한
                    용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한
                    조치가 취해지고 있는지 알려드립니다.&nbsp;회사는
                    개인정보처리방침을 상품가입 첫 페이지 및 상품설명서를 통해
                    공개함으로써 상품 가입시 귀하께서 자유롭게 열람할 수 있도록
                    조치하고 있습니다.&nbsp;회사의 개인정보처리방침은 정부의
                    법률 및 지침 변경이나 회사 내부 방침변경 등으로 수시로
                    변경될 수 있으며,&nbsp;개인정보처리방침의 지속적인 개선을
                    위하여 필요한 절차를 정하고 있습니다.&nbsp;개인정보
                    보호정책을 개정하는 경우 회사는 그 변경사항을 홈페이지에
                    게시하여 이용자들이 개정된 사항을 쉽게 알아볼 수 있도록 하고
                    있습니다.&nbsp;회사는 고객 개인정보의 수집목적이 달성될
                    때까지 고객의 개인정보를 보유합니다.&nbsp;고객 개인정보는
                    수집목적 달성 후 관련 법령,&nbsp;규정,&nbsp;회계기준 또는
                    회사의 이익보호에 따라 보유하여야 할 경우가 아닌 경우
                    파기됩니다.&nbsp;일반적으로,&nbsp;관할에 따라 적용되는
                    관련법령에 따라 보유기간은 최소한으로 합니다.</span
                  ></p
                >
                <p
                  style='";margin-top:11.25pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;color:#555;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:11.25pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제 1조 정보의 처리 목적</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:11.25pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;"
                    >회사는 개인정보를 다음 각 호의 목적을 위해
                    처리합니다.&nbsp;수집된 개인정보는 다음의 목적 외의 용도로는
                    사용되지 않으며 이용 목적이 변경될 경우에는 별도의 동의를
                    받는 등 필요한 조치를 이행할 예정입니다.</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style='";'>(</span
                      ><span style="font-size:11.0pt;"
                        >금융)거래 관계 관련</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">(</span
                  ><span style="font-size:15px;"
                    >금융)거래과 관련하여 신용정보회사 또는 신용정보집중기관에
                    대한 개인신용정보의 조회, (금융)거래 관계의 설정 여부의
                    판단, (금융)거래 관계의
                    설정,&nbsp;유지,&nbsp;이행,&nbsp;관리,&nbsp;금융사고
                    조사,&nbsp;분쟁 해결,&nbsp;민원 처리 및 법령상 의무이행 등의
                    목적으로 개인정보를 처리합니다.</span
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;"
                    >※ (금융)거래라함은
                    회사업무(여신,&nbsp;수신,&nbsp;내&middot;외국환),&nbsp;겸영업무(파생상품
                    등)&nbsp;및 부수업무(판매 등)와 이와 관련된 거래를
                    의미합니다.</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style='";font-size:11.0pt;'
                        >상품 및 서비스 홍보 및 판매 권유</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style="margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:16px;"
                  ><span style='font-size:15px;";'
                    >고객 만족도 조사를 통한 신규 서비스 개발 및 맞춤 서비스
                    제공,&nbsp;인구통계학적 특성에 따른 서비스 제공 및 광고의
                    게재,&nbsp;서비스의 유효성
                    확인,&nbsp;경품지급,&nbsp;사회사사 등 고객의 편의 및
                    참여기회 제공,&nbsp;접속빈도 파악,&nbsp;회원의 서비스이용에
                    대한 통계 등의 목적으로 개인정보를 처리합니다.</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style='";font-size:11.0pt;'
                        >회원가입 및 관리&nbsp;</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style="margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:16px;"
                  ><span style='font-size:15px;";'
                    >회원가입,&nbsp;회원제 서비스 이용,&nbsp;제한적 본인
                    확인제에 따른
                    본인확인,&nbsp;개인식별,&nbsp;부정이용방지,&nbsp;비인가
                    사용방지,&nbsp;가입의사 확인,&nbsp;만19세 미만 미성년자
                    개인정보 수집 시 법정대리인 동의여부 확인,&nbsp;추후 법정
                    대리인 본인확인,&nbsp;사고조사,&nbsp;분쟁해결,&nbsp;민원처리
                    및 고지사항 전달 등의 목적으로 개인정보를 처리합니다.</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style='";font-size:11.0pt;'
                        >온라인 거래 관련 목적&nbsp;</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style="margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:16px;"
                  ><span style='font-size:15px;";'
                    >전자금융거래법 제21조,&nbsp;제22조에 의해 전자금융거래의
                    내용 추적 및 검색,&nbsp;보안정책 수립용 통계 자료로 활용
                    등을 목적으로 개인정보를 처리합니다.</span
                  ></p
                >
                <p
                  style="margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:16px;"
                  ><span style='font-size:15px;";'>&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제2조 개인정보의 처리 및 보유기간&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'>(</span
                    ><span style='";font-size:11.0pt;'
                      >금융)거래와 관련한 개인(신용)정보는 수집&bull;이용에 관한
                      동의일로부터 (금융)거래 종료일로부터&nbsp;5년까지 위
                      이용목적을 위하여 보유,&nbsp;이용됩니다.&nbsp;단,
                      (금융)거래 종료일 이후에는 금융사고 조사,&nbsp;분쟁
                      해결,&nbsp;민원처리,&nbsp;법령상 의무이행 및 회사의 리스크
                      관리업무만을 위하여 보유,&nbsp;이용됩니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >개인(신용)정보의 조회를 목적으로 수집된 개인(신용)정보는
                      수집&bull;이용에 대한 동의일로부터 고객에 대한 신용정보
                      제공,&nbsp;조회 동의의 효력기간까지
                      보유,&nbsp;이용됩니다.&nbsp;단,&nbsp;신용정보
                      제공,&nbsp;조회 동의의 효력 기간 종료 후에는 금융사고
                      조사,&nbsp;분쟁 해결,&nbsp;민원처리 및 법령상 의무이행만을
                      위하여 보유,&nbsp;이용됩니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >상품 및 서비스 홍보 및 판매 권유 등과 관련한
                      개인(신용)정보는 수집&bull;이용에 관한 동의일로부터 동의
                      철회일까지 보유,&nbsp;이용됩니다.&nbsp;단,&nbsp;동의
                      철회일 후에는 제1조의 목적과 관련된 사고 조사,&nbsp;분쟁
                      해결,&nbsp;민원처리,&nbsp;법령상 의무이행만을 위하여
                      보유,&nbsp;이용됩니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >회원 가입 및 관리 목적으로 수집된 개인(신용)정보는 고객의
                      회원 가입일로부터 회원 탈퇴일까지
                      보유,&nbsp;이용됩니다.&nbsp;단 회원 탈퇴일 후에는 제1조의
                      목적과 관련된 사고 조사,&nbsp;분쟁
                      해결,&nbsp;민원처리,&nbsp;법령상 의무이행 만을 위하여
                      보유,&nbsp;이용됩니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >온라인 거래 관련한 개인(신용)정보는 전자금융거래법 시행령
                      제12조에서<span style="color:red;">&nbsp;</span>정하는
                      기간까지 보유,&nbsp;이용됩니다.</span
                    ></li
                  >
                </ul>
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제 3조 개인정보 수집 출처 등 고지&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:11.0pt;"
                      >회사는 정보주체 이외로부터 수집한 개인정보를 처리하는
                      때에는 정당한 사유가 없는 한 정보주체의 요구가 있은
                      날로부터&nbsp;3영업일 이내에 수집 출처,&nbsp;처리
                      목적,&nbsp;개인정보 처리의 정지를 요구할 권리가 있다는
                      사실을 정보주체에게 알립니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >개인정보 보호법 제20조제4항 각 호에 근거하여 제1항에 따른
                      정보주체의 요구를 거부하는 경우에는,&nbsp;정당한 사유가
                      없는 한 정보주체의 요구가 있은 날로부터&nbsp;3영업일
                      이내에 그 거부의 근거와 사유를 정보주체에게
                      알립니다.</span
                    ></li
                  >
                </ul>
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제 4조 개인정보의 제 3자 제공&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="background:white;"
                      >회사는 회원의 동의가 있거나 관련법령의 규정에 의한
                      경우,&nbsp;회사가 회원에게 제공하는 서비스 또는 상품의
                      공급을 위하여 필요한 경우를 제외하고는 본
                      개인정보처리방침에서 고지한 범위를 넘어 회원의 개인정보를
                      이용하거나 타인 또는 타기업/기관에 제공하지
                      않습니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="background:white;"
                      >회원의 개인정보를 제3자 제공하는 경우에는 사전에 제공받는
                      자,&nbsp;목적,&nbsp;제공하는 개인정보 항목 등을
                      개인정보처리방침 및 홈페이지,&nbsp;전자우편을 통해 고지한
                      후 동의를 구합니다.</span
                    ><span style='";'>&nbsp;</span
                    ><span style="background:white;"
                      >다만,&nbsp;다음의 경우에는 관련 법령의 규정에 의하여
                      회원의 동의 없이 개인정보를 제공할 수도 있으니 이점 양지해
                      주시기 바랍니다.</span
                    >
                    <ol style="list-style-type: decimal;">
                      <li
                        >관련 통계법 등에 따라 통계작성&bull;학술연구 또는
                        시장조사를 위하여 필요한 경우로서 특정 개인을 알아볼 수
                        없는 형태로 가공하여 제공하는 경우</li
                      >
                      <li
                        >금융실명거래 및 비밀보장에 관한 법률,&nbsp;신용정보의
                        이용 및 보호에 관한
                        법률,&nbsp;전기통신기본법,&nbsp;전기통신사업법,&nbsp;지방세법,&nbsp;소비자보호법,&nbsp;한국회사법,&nbsp;형사소송법
                        등 법률에 특별한 규정이 있는 경우</li
                      >
                      <li
                        >정부기관(준정부기관 포함)이나 법원의 명령에 의하여
                        개인정보를 제공하는 경우</li
                      >
                    </ol>
                  </li>
                </ul>
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong><span style="font-size:15px;">제</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;5</span></strong
                  ><strong><span style="font-size:15px;">조</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong
                    ><span style="font-size:15px;">개인정보처리의</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">위탁</span></strong
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="background:white;">회사는</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >서비스</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">향상</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">및</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >원활한</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >계약사항의</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">이행</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">등을</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >위하여</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >개인정보</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >처리업무를</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">외부</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >전문업체에</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">일부</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >위탁하고</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >있으며</span
                    ><span style="font-size:11.5pt;background:white;"
                      >,&nbsp;</span
                    ><span style="background:white;">개인정보</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">처리위탁으로</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">인하여</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">정보주체의</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">개인정보가</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">분실</span
                    ><span style="font-size:11.5pt;background:white;">/</span
                    ><span style="background:white;">도난</span
                    ><span style="font-size:11.5pt;background:white;">/</span
                    ><span style="background:white;">유출</span
                    ><span style="font-size:11.5pt;background:white;">/</span
                    ><span style="background:white;">변조</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">또는</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">훼손되지</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">아니하도록</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">수탁사를</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">교육하고</span
                    ><span style="font-size:11.5pt;background:white;"
                      >,&nbsp;</span
                    ><span style="background:white;">현황점검</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">등을</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">통하여</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">수탁사가</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">개인정보를</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">안전하게</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">처리하는지</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">감독하고</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">있습니다</span
                    ><span style="font-size:11.5pt;background:white;"
                      >.</span
                    ></li
                  >
                  <li
                    ><span style="background:white;">회사는</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >회원의</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >개인정보를</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >제휴업체에</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >제공하거나</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >공유하는</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >경우에</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >사전에</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >회원에게</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >제공받거나</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">공유</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">받는</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">자</span
                    ><span style="font-size:11.5pt;background:white;"
                      >,&nbsp;</span
                    ><span style="background:white;">목적</span
                    ><span style="font-size:11.5pt;background:white;"
                      >,&nbsp;</span
                    ><span style="background:white;">공유되는</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">개인정보항목</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">등에</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">대해</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">개인정보처리방침에</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">고지한</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">후</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">이에</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">대한</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">동의를</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">구합니다</span
                    ><span style="font-size:11.5pt;background:white;"
                      >.</span
                    ></li
                  >
                  <li
                    ><span style="background:white;">회사는</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;"
                      >금융상품</span
                    ><span>&nbsp;</span
                    ><span style="font-size:11.5pt;background:white;">소개</span
                    ><span style="font-size:11.5pt;background:white;"
                      >,&nbsp;</span
                    ><span style="background:white;">제휴</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">서비스</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">제공</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">등을</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">위하여</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">파트너사에</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">개인</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">정보</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">일부를</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">제공하고</span
                    ><span style="font-size:11.5pt;background:white;"
                      >&nbsp;</span
                    ><span style="background:white;">있습니다</span
                    ><span style="font-size:11.5pt;background:white;"
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong><span style="font-size:15px;">제</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;6</span></strong
                  ><strong><span style="font-size:15px;">조</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">고객의</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">권리</span></strong
                  ><strong><span style="font-size:15px;">,&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">의무</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">및</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">그</span></strong
                  ><strong><span style="font-size:15px;">&nbsp;</span></strong
                  ><strong><span style="font-size:15px;">행사방법</span></strong
                  ><span style="font-size:15px;"><br />&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;">고객은</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">언제든지</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">등록되어</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">있는</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">회원의</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >개인정보를</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >열람하거나</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">정정하실</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">수</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">있습니다</span
                  ><span style="font-size:15px;background:white;">.&nbsp;</span
                  ><span style="font-size:15px;background:white;">회원의</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >개인정보에</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">대한</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">열람</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">또는</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">정정을</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">하고자</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">할</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">경우</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">혹은</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">회사의</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">시스템에</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">장애가</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">발생한</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">경우에는</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">회사의</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >고객센터로</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >전화하셔서</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">처리하실</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">수</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">있습니다</span
                  ><span style="font-size:15px;background:white;">.</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >제</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >&nbsp;7</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >조</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >처리하는</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >개인정보의</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >항목</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:left;'
                  ><strong
                    ><span style="font-size:15px;background:white;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;"
                    >회사는&nbsp;(금융)거래의
                    설정,&nbsp;유지,&nbsp;이행,&nbsp;관리 및 상품서비스의 제공을
                    위한 필수정보 및 선택정보를 다음 호와 같이 수집하고
                    있습니다.&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><span style="font-size:15px;background:white;"
                    >&nbsp;</span
                  ></p
                >
                <ol style="margin-left:28px;list-style-type: decimal;">
                  <li
                    >필수정보:&nbsp;성명,&nbsp;주소,&nbsp;연락처,
                    E-MAIL주소,&nbsp;직업,&nbsp;국적(외국인),&nbsp;계좌번호,&nbsp;비밀번호,
                    ID, ID비밀번호,&nbsp;거래내역,&nbsp;자산현황</li
                  >
                  <li
                    >선택정보:&nbsp;실제 생일,&nbsp;결혼여부,&nbsp;결혼기념일
                    정보 등</li
                  >
                  <li
                    >고유식별정보:&nbsp;주민등록번호,&nbsp;여권번호(외국인)</li
                  >
                  <li
                    >신용거래정보&nbsp;:&nbsp;신용능력정보,&nbsp;신용평가를 위한
                    정보</li
                  >
                  <li
                    >민감정보&nbsp;:&nbsp;국가유공자 및 장애인 등&nbsp;(세금우대
                    상품 서비스 신청자에 한함)</li
                  >
                  <li
                    ><span style='";'>APP&nbsp;</span
                    ><span style='";'
                      >사용 관련
                      정보&nbsp;:&nbsp;사진(앨범),&nbsp;기기ID,&nbsp;위치
                      등&nbsp;APP&nbsp;서비스 실행에 필요한 정보&nbsp;(스마트
                      디바이스로 회사&nbsp;APP을 사용하는 고객에 한함)</span
                    ></li
                  >
                </ol>
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:38.0pt;font-size:13px;line-height:normal;background:white;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><span style="font-size:15px;">※</span
                  ><span style="font-size:15px;"
                    >&nbsp;귀하는 위와 같은 개인정보의 수집&bull;이용에 거부할
                    권리가 있으나,&nbsp;필수정보 또는 고유식별정보의
                    수집&bull;이용에 거부할 경우 계좌개설 불가 등 금융거래
                    서비스의 이용에 제약이 있을 수 있습니다.<br />&nbsp;</span
                  ><span style="font-size:15px;">※</span
                  ><span style="font-size:15px;"
                    >&nbsp;회사는 위와 같은 선택정보의 수집&bull;이용에 동의하지
                    않았다는 이유로 귀하에게 서비스 제공을 거부할 수
                    없습니다.</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제 8조 개인정보의 파기</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >회사는 개인정보의 보유기간이 경과된 경우에는 다음 각 호의
                      사유가 없는 한 유기간의 종료일로부터&nbsp;5영업일
                      이내에,&nbsp;개인정보의 처리 목적 달성,&nbsp;해당 서비스의
                      폐지,&nbsp;사업의 종료 등 그 개인정보가 불필요하게 되었을
                      때에는 다음 각 호의 사유가 없는 한 인정보의 처리가 필요한
                      것으로 인정되는 날로부터&nbsp;5영업일 이내에 그 개인정보를
                      파기합니다.</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >신용정보집중기관 또는 신용조회회사가 신용정보의
                      집중관리,&nbsp;활용 또는 개인의 신용도 등을 평가하기 위한
                      목적으로 개인신용정보를 보유하는 경우(보유기간에
                      한함)</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >신용정보회사 등이 민&middot;형사상의 책임 또는 시효가
                      지속되거나 분쟁의 입증자료로서 개인신용정보를 보유하는
                      경우</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >법령에 따라 보존하여야 하는 경우</span
                    ></li
                  >
                </ol>
                <table
                  style="float: left;margin-right:4.85pt;margin-left:4.85pt;border-collapse:collapse;border:none;"
                  summary="보존근거, 보존하는 개인정보항목에 대한 테이블"
                >
                  <thead>
                    <tr>
                      <td
                        style="height:14.5pt;padding:9.75pt 1.5pt 9.0pt 1.5pt;background:#F8F9FB;border-top:solid #555 1.0pt;border-right:none;border-bottom:   solid #E1E1E1 1.0pt;border-left:none;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;">보존근거</span></p
                        >
                      </td>
                      <td
                        style="height:14.5pt;padding:9.75pt 1.5pt 9.0pt 1.5pt;background:#F8F9FB;border-top:solid #555 1.0pt;border-right:none;border-bottom:solid #E1E1E1 1.0pt;border-left:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;color:black;"
                            >보존하는 개인정보항목</span
                          ></p
                        >
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border:none;border-bottom:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;">상법 제33조</span></p
                        >
                      </td>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border-top:none;border-right:none;border-bottom:  solid #E1E1E1 1.0pt;border-left:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >계약서,&nbsp;거래신청서 등 영업에 관한
                            중요서류(전산자료포함)</span
                          ></p
                        >
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border:none;border-bottom:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >신용정보의 이용 및 보호에 관한 법률 제20조의2</span
                          ></p
                        >
                      </td>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border-top:none;border-right:none;border-bottom:  solid #E1E1E1 1.0pt;border-left:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >금융거래 관계 설정 및 거래내역 등
                            금융거래정보</span
                          ></p
                        >
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border:none;border-bottom:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >소득세법 시행령 제201조의10</span
                          ></p
                        >
                      </td>
                      <td
                        style="height:29.7pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border-top:none;border-right:none;border-bottom:  solid #E1E1E1 1.0pt;border-left:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >연도별 납입액,&nbsp;인출액,&nbsp;납입전환 금액,<br />&nbsp;과세제외금액
                            등 연금납입확인서 발급을 위한 정보</span
                          ></p
                        >
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="height:29.1pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border:none;border-bottom:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >특정금융거래의 보고 및 이용에 관한 법률
                            제5조의4</span
                          ></p
                        >
                      </td>
                      <td
                        style="height:29.1pt;padding:9.0pt 12.0pt 8.25pt 12.0pt;border-top:none;border-right:none;border-bottom:  solid #E1E1E1 1.0pt;border-left:solid #E1E1E1 1.0pt;"
                      >
                        <p
                          style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;'
                          ><span style="font-size:15px;"
                            >실지명의 확인 및 보고대상 금융거래자료<br />&nbsp;송금인
                            및 수취인에 관한 정보 등</span
                          ></p
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;background:white;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <ol style="margin-left:52.55px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >기타 이와 유사한 정당한 사유가 있는 경우&nbsp;</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >개인정보가 기록된 출력물,&nbsp;서면 등은 파쇄 또는 소각의
                      방법으로 파기하고,&nbsp;전자적 파일형태의 개인정보는
                      복원이 불가능한 방법으로 영구 삭제하는 방법으로
                      파기합니다.</span
                    ></li
                  >
                </ul>
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:62.55pt;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span style="font-size:15px;line-height:107%;"
                    ><br />&nbsp;</span
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >제</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;9</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >조</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >개인정보</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >안전성</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >확보조치</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >회사는</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >귀하의</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >개인정보가</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >분실</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >,&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >도난</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >,&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >유출</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >,&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >변조</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >또는</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >훼손되지</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >아니하도록</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >내부</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >관리계획</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >수립</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >,&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >접속기록</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >보관</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >등</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >안전성</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >확보에</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >필요한</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >기술적</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >,&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >관리적</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >및</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >물리적</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >조치를</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >다음과</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >같이</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >하고</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >있습니다</span
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >.</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li><span style='";font-size:11.0pt;'>관리적 조치</span></li>
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style='";font-size:11.0pt;'
                      >개인정보의 안전한 처리를 위한 내부관리계획의 수립</span
                    ></li
                  >
                  <li
                    ><span style='";font-size:11.0pt;'
                      >개인정보를 직접 취급하는 임직원 및 수탁자 등에 대한
                      교육계획 수립 및 실시</span
                    ></li
                  >
                  <li
                    ><span style='";font-size:11.0pt;'
                      >내부관리계획에 따른 정기적인 자체 점검의 실시</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";font-size:11.0pt;'
                      >기술적 조치<br />&nbsp;1. &nbsp;&nbsp;시스템에 대한 접근
                      권한을 업무 수행에 필요한 최소 범위로 차등 부여하고
                      있음</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:50.55px;list-style-type: undefined;">
                  <li
                    ><span style='";font-size:11.0pt;'
                      >정보통신망을 통한 불법적인 접근 및 침해사고 방지를 위해
                      침입차단 및 침입탐지시스템을 운영하고
                      있으며&nbsp;24시간&nbsp;365일 보안관제 하고 있음.</span
                    ></li
                  >
                  <li
                    ><span style='";font-size:11.0pt;'
                      >시스템의 접속 기록의 보관 및 위/변조 방지를 위해 로그관리
                      시스템 운영 및 정기 백업을 실시하고 있으며 개인정보 문서의
                      도난/분실에 대응하기 위해 데이터유출솔루션(DLP시스템)을
                      적용하고 있음</span
                    ></li
                  >
                  <li
                    ><span style='";font-size:11.0pt;'
                      >개인정보처리시스템 또는 업무용 컴퓨터에 악성 프로그램을
                      방지/치료할 수 있는 백신소프트웨어 등의 보안 프로그램을
                      설치/운영하고 있음</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li><span style='";font-size:11.0pt;'>물리적 조치</span></li>
                </ul>
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:13px;line-height:107%;background:white;'
                  ><span style='font-size:15px;";'
                    >회사는 정보유출 등을 방지하기 위해 외부인의 출입을 통제하는
                    출입통제 시스템 및 장비를 상시 운영하고 있습니다.&nbsp;또한
                    본사 및 사업장,&nbsp;각
                    지점에서는&nbsp;24시간&nbsp;CCTV&nbsp;및 보안업체의
                    경비시스템이 운영되고 있고 주요 통제구역은 별도의 시건된
                    장소에 설치되어 인가된 자만이 출입할 수 있도록 하고
                    있습니다.</span
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;">&nbsp;</span></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;"
                      >제 10조 개인정보 처리방침의 변경</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><strong
                    ><span style="font-size:15px;">&nbsp;</span></strong
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;">회사가</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">개인정보</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >처리방침을</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">변경하는</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">경우에는</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">변경</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">및</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">시행의</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">시기</span
                  ><span style="font-size:15px;background:white;">,&nbsp;</span
                  ><span style="font-size:15px;background:white;">변경된</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">내용을</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >지속적으로</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">공개하며</span
                  ><span style="font-size:15px;background:white;">,&nbsp;</span
                  ><span style="font-size:15px;background:white;">변경된</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">내용은</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">고객이</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">쉽게</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">확인할</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">수</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">있도록</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">변경</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">전</span
                  ><span style="font-size:15px;background:white;">,&nbsp;</span
                  ><span style="font-size:15px;background:white;">후를</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;">비교하여</span
                  ><span style="font-size:15px;background:white;">&nbsp;</span
                  ><span style="font-size:15px;background:white;"
                    >공개합니다</span
                  ><span style="font-size:15px;background:white;"
                    >.&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:9.0pt;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;'
                  ><span style="font-size:15px;background:white;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >제 11조 개인정보침해 관련 상담 및 신고</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;'
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >개인정보침해에 대한 신고,상담이 필요하신 경우에는
                    한국인터넷진흥원(KISA)내 개인정보침해신고센터로 문의하시기
                    바랍니다.</span
                  ></p
                >
                <p
                  style='margin:0;";margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;background:white;'
                  ><span style='font-size:15px;";'
                    >개인정보침해신고센터<br />&nbsp;전화&nbsp;:
                    (국번없이)118<br />
                    E-mail : privacy@kisa.or.kr<br />&nbsp;URL :
                    http://www.1336.or.kr</span
                  ></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 암호자산예치 표준약관 -->
          <el-collapse-item title="암호자산예치 표준약관">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;text-align:center;";'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >암호자산예치 표준약관</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  >&nbsp;</p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관은 코코뱅크(이하&nbsp;&quot;회사&quot;)가 제공하는
                    암호자산의 보관&nbsp;&middot;&nbsp;예치 및 관련 제반
                    서비스&nbsp;(이하&nbsp;&quot;서비스&quot;)의 이용조건 및
                    절차에 관한 회사와 회원 간의 권리 의무 및
                    책임사항,&nbsp;기타 필요한 사항을 규정함을 목적으로
                    합니다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 1조 약관의 명시,&nbsp;설명과 개정</span
                    ></strong
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >본 약관의 내용은 회사의 서비스 홈페이지에 게시하거나
                      기타의 방법으로 사용자에게 공지하고,&nbsp;이용자가
                      회원으로 가입하면서 본 약관에 동의함으로써 효력이
                      발생한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는&nbsp;&ldquo;약관의 규제에 관한 법률&rdquo;,
                      &ldquo;정보통신망 이용촉진 및 정보보호 등에 관한
                      법률&rdquo;&nbsp;등 관련법을 위배하지 않는 범위에서 본
                      약관을 개정할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 약관을 개정할 경우에는 적용일자 및 개정사유를
                      명시하여 현행약관과 함께 회사 사이트의 초기화면이나
                      팝업화면 또는 공지사항란에 그 적용일자&nbsp;7&nbsp;일
                      전부터 적용일자 전일까지 공지합니다.&nbsp;다만 그 개정이
                      회원에게 불리한 경우에는 적용일자&nbsp;30&nbsp;일 전에
                      공지한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 전항에 따라 개정약관을 홈페이지에 게시하거나
                      통지하면서 회원에게&nbsp;&lsquo;약관 개정내용이 게시되거나
                      통지된 후&nbsp;7&nbsp;일 내에 약관 개정에 이의를 제기하지
                      아니하는 경우 약관 개정에 동의한 것으로 본다&rsquo;는
                      취지를 명확하게 고지하였음에도,&nbsp;회원이 명시적으로
                      거부의 의사표시를 하지 아니한 경우 회원이 약관 개정에
                      동의한 것으로 봅니다.&nbsp;다만 본조 제&nbsp;3항 단서의
                      경우에는&nbsp;30&nbsp;일의 의사표시 기간을 부여해야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원이 개정약관의 적용에 동의하지 않는다는 명시적 의사를
                      표명한 경우 회사는 개정약관의 내용을 적용할 수
                      없으며,&nbsp;이 경우 회사 또는 회원은 이용계약을 해지할 수
                      있습니다.&nbsp;회원은 본조 제&nbsp;4&nbsp;항에서 정한 기간
                      내에도 언제든지 해지할 수
                      있습니다.&nbsp;제&nbsp;3&nbsp;조&nbsp;(약관 외
                      준칙)&nbsp;본 약관에서 정하지 아니한 사항과 본 약관의
                      해석에 관하여는&nbsp;&ldquo;약관의 규제 등에 관한
                      법률&rdquo;&nbsp;및 관련 법령의 규정과 일반 상관례에
                      의한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;2조 약관 외 준칙&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관에서 정하지 아니한 사항과 본 약관의 해석에
                    관하여는&nbsp;&ldquo;약관의 규제 등에 관한
                    법률&rdquo;&nbsp;및 관련 법령의 규정과 일반 상관례에
                    의한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;3조 용어의 정의</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관에서 사용하는 용어의 정의는 다음과 같다.&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원:&nbsp;본 약관을 승인하고 회원가입을 하여 회사와
                      서비스 이용계약을 체결한 자를 말한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원의 종류는 다음 각 목과 같으며,&nbsp;회사는 회원의
                      종류별 또는 서비스의 규모별로 별도의 특별약관에 따라
                      서비스의 내용을 달리할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:38.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">1.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >공공기관회원:&nbsp;회원 중 정부조직법에 따른 중앙행정기관
                    및 중앙행정기관의 보조기관,&nbsp;행정각부 및 행정각부의
                    소속기관,&nbsp;공공기관의 운영에 관한 법률상의
                    공공기관(공기업&middot;준정부기관 및 기타공공기관)&nbsp;또는
                    이에 준하는 성격을 가진 회원을 말한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:38.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">2.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기업&middot;단체회원:&nbsp;회원 중 법인 내지 단체의 성격을
                    가진 회원을 말한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:38.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">3.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >개인회원:&nbsp;회원 중 자연인의 성격을 가진 회원을
                    말한다.&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >아이디(ID):&nbsp;회원의 식별과 서비스 이용을 위하여
                      회사가 승인한 문자와 숫자의 조합대로 회원이 설정한 것을
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >홈페이지:&nbsp;회원이 회사의 서비스를 이용하게 하기
                      위하여 회사가 제공하는 서비스의 웹사이트를 말하는
                      것으로서,&nbsp;도메인 및 경우에 따라 해당 도메인에 부속된
                      하위 웹페이지를 의미한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >비밀번호:&nbsp;회원의 동일성 확인과 회원정보의 보호를
                      위하여 회사가 승인한 문자와 숫자 조합대로 회원이 설정한
                      것을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >개인정보 보호법령:&nbsp;개인정보보호법,&nbsp;정보통신망
                      이용촉진 및 정보보호 등에 관한 법률,&nbsp;신용정보의 이용
                      및 보호에 관한 법률 및 위 법률들의 하위법령과 고시를
                      말한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 4조 이용계약의 성립</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한
                      후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을
                      신청한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원가입은 회사의 승낙이 회원에게 도달한 시점으로
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용계약은 회원 아이디 단위로 체결한다.&nbsp;이용계약이
                      성립되면,&nbsp;이용신청자는 회원으로 등록된다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >실명이 아니거나 타인의 정보를 도용하여 허위 가입한 회원은
                      법적인 보호를 받을 수 없으며,&nbsp;이에 따른
                      민사,&nbsp;형사상의 모든 책임은 가입한 회원이
                      부담한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >만&nbsp;19&nbsp;세 미만의 자는 회원 자격이
                      없으며,&nbsp;이용계약의 당사자가 될 수 없다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;1&nbsp;항에 따른 신청에 있어 회사는 필요 시
                      관계법령에 의하여 이용자의 종류에 따라 전문기관을 통한
                      실명확인 및 본인인증을 요청할 수
                      있습니다.&nbsp;만일,&nbsp;이러한 회사의 요청을 거부하여
                      이용자 본인임이 확인되지 않아 발생하게 되는 불이익에
                      대하여 회사는 책임을 지지 않는다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;5조 이용신청&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용신청은 홈페이지 상에서 회사 소정의 가입신청(Sign
                      Up)&nbsp;양식에서 요구하는 사항을 기록하여
                      신청한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원의 종류별로 회원가입 신청서의 제출 외에,&nbsp;회사가
                      정하는 서류 등 관련자료의 제출이나
                      상급기관&middot;관리자의 확인 등 추가 절차가 필요할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >가입신청 양식에 기재하는 모든 회원 정보 및
                      회원가입&middot;회원자격 유지 단계에서 회사에 제출한
                      일체의 자료는 사실인 것으로 간주하며,&nbsp;실제 정보를
                      입력하지 않거나 사실과 다른 자료를 제출한 사용자는 법적인
                      보호를 받을 수 없고 서비스 사용의 제한을 받을 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >사실과 다른 정보,&nbsp;거짓 정보를 기입&middot;제출하거나
                      추후 그러한 정보임이 밝혀질 경우 회사는 서비스 이용을
                      제한하거나 이용계약을 해지할 수 있습니다.&nbsp;이로 인하여
                      회사 또는 제&nbsp;3&nbsp;자에게 발생한 모든 손해는 해당
                      회원이 부담한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 회원에게 회사의 서비스에 대한 다양하고 유익한
                      정보를&nbsp;E-mail,&nbsp;우편,&nbsp;전화 등을 통하여
                      제공할 수 있다.&nbsp;단,&nbsp;광고성 정보 제공의 경우에는
                      회원의 별도 동의를 전제로 한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 6조 회원정보 사용에 대한 동의</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:38.35px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 회원의 개인정보를 본 이용계약의 이행과 본
                      이용계약상의 서비스제공을 위한 목적으로
                      이용한다.&nbsp;회사는 관련 법령이 정하는 바에 따라 회원의
                      개인정보를 보호하기 위해 노력하며,&nbsp;개인정보의 보호 및
                      사용에 대해서는 관련 법령 및 회사의 개인정보처리방침에
                      따릅니다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원이 회사 및 회사와 제휴한 서비스들을 편리하게 이용할
                      수 있도록 하기 위해 회원 정보는 회사와 제휴한 업체에
                      제공될 수 있다.&nbsp;단,&nbsp;회사는 회원정보 제공 이전에
                      제휴 업체,&nbsp;제공 목적,&nbsp;제공할 회원정보의 내용
                      등을 사전에 공지하고 회원의 동의를 얻어야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 제휴서비스의 이용편의를 위하여 이용안내 및
                      상품정보 등의&nbsp;SMS&nbsp;및&nbsp;SMS URL&nbsp;등 광고성
                      정보를 전송할 수 있으나,&nbsp;회원이 이에 대해 수신거부
                      의사표시를 한 경우에는 광고성 정보를 전송하지
                      않는다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원은 회원정보 수정을 통해 언제든지 개인정보에 대한 열람
                      및 수정을 할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원이 이용신청서에 회원정보를 기재하고,&nbsp;회사에 본
                      약관 및 개인정보 처리방침에 동의하는 것은 회사가 본 약관에
                      따라 이용신청서에 기재된 회원정보를 수집,&nbsp;이용 및
                      제공하는 것에 동의하는 것으로 간주된다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  >&nbsp;</p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;7조 이용신청의 승낙&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 회원이 회사 소정의 가입신청 양식에서 요구하는 모든
                      사항을 정확히 기재하여 이용신청을 한 경우 회원가입을
                      승낙할 수 있다.&nbsp;단,&nbsp;본조
                      제&nbsp;2&nbsp;항,&nbsp;제&nbsp;3&nbsp;항의 경우는 회사는
                      승낙을 유보하거나 승낙을 거절할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 다음 각 호의 하나에 해당하는 이용신청에 대하여는
                      승낙을 유보할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">1.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >설비에 여유가 없는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">2.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기술상 지장이 있는 경우</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">3.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기타 회사의 사정상 이용승낙이 곤란한 경우&nbsp;</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style="font-size:15px;line-height:107%;"
                        >회사는 다음 각 호의 하나에 해당하는 이용신청에 대하여는
                        이를 승낙하지 않을 수 있다.</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">1.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >이름이 실명이 아닌 경우</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">2.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >다른 사람의 명의를 사용하여 신청한 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">3.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >이용신청시 필요내용을 허위로 기재하여 신청한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">4.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >해당 회원의 서비스 이용을 위해 상급기관이나 관리자 등의
                    승인이 필요함에도 이러한 승인사실이 적절한 방법으로 확인되지
                    않는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">5.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >사회의 안녕질서 또는 미풍양속을 저해할 목적으로 신청한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">6.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관 제 8조 제&nbsp;2항에 의하여 이용계약이 해지된
                    사실이 있는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">7.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기타 회사가 정한 이용신청 요건이 미비되었을 때</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong>&nbsp;</strong></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 8조 이용계약의 중지 및 해지</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원이 이용계약을 해지하고자 할 때에는 회원 본인이 회사에
                      해지 신청을 하여야
                      한다.&nbsp;공공기관회원,&nbsp;기업&middot;단체회원의
                      경우에는 회원가입 당시 회사에 통지된 담당자가 회사에 해지
                      신청을 하여야 하며,&nbsp;상급기관이나 관리자 등의 승인을
                      받아 가입한 회원의 경우에는 회사가 해당 승인권자에게 해지
                      의사를 추가 확인할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 회원이 다음 각 호의 하나에 해당하는 행위를 하였을
                      경우 시간을 정하여 서비스 이용을 제한함과 동시에
                      시정요구를 할 수 있다.&nbsp;시정요구에도 불구하고 상당한
                      기간 내에 시정되지 않거나&nbsp;2&nbsp;회 이상 반복적으로
                      동일한 위반행위를 하는 경우에는 이용계약을 해지할 수
                      있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">1.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >타인의&nbsp;ID&nbsp;및 비밀번호를 도용한 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">2.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >서비스 운영을 고의로 방해한 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">3.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >가입한 이름이 실명이 아닌 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">4.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >공공질서 및 미풍양속에 저해되는 내용을 고의로 유포시킨
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">5.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회원이 국익 또는 사회적 공익을 저해할 목적으로 서비스
                    이용을 계획 또는 실행하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">6.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >타인의 명예를 손상시키거나 불이익을 주는 행위를 한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">7.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >서비스의 안정적 운영을 방해할 목적으로 다량의 정보를
                    전송하거나 광고성 정보를 전송하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">8.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >정보통신설비의 오작동이나 정보 등의 파괴를 유발시키는
                    컴퓨터 바이러스 프로그램 등을 유포하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">9.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >타인의 개인정보,&nbsp;이용자&nbsp;ID&nbsp;및 비밀번호로
                    부정하게 사용하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >10.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사의 서비스 정보를 이용하여 얻은 정보를 회사의 사전 승낙
                    없이 복제 또는 유통시키거나 상업적으로 이용하는
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >11.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회원이 회사의 홈페이지와 게시판에 음란물을 게재하거나
                    음란사이트 링크하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >12.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >같은 사용자가 다른&nbsp;ID&nbsp;로 이중등록을 한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >13.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사,&nbsp;다른 회원 또는 제&nbsp;3&nbsp;자의 지적재산권을
                    침해하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >14.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >방송통신심의위원회 등 외부기관의 시정요구가 있거나
                    불법선거운동과 관련하여 선거관리위원회의 유권해석을 받은
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >15.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관을 포함하여 기타 회사가 정한 이용조건을 위반함으로써
                    회원의 이용계약을 유지하기 어려운 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >16.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >다른 이용자에 대한 개인정보를 그 동의
                    없이,&nbsp;수집,&nbsp;저장,&nbsp;공개하는 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >17.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >복제품,&nbsp;해킹,&nbsp;매도목적이 아닌 암호자산을 등록하는
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >18.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >범죄와 결부된다고 객관적으로 판단하는 행위&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >19.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사의 서비스 제공에 반드시 필요한 절차를 이행하지 아니하는
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >20.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >서비스의 운영자 또는 관리자가 이용에 부적합하다고 판단하는
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >21.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사의 서비스 개선을 위한 회사 정책상 불가피한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >22.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기타 관계 법령에 위배되는 행위&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용제한을 하고자 하는 경우에는 그 사유,&nbsp;일시
                      및 기간을 정하여 서면 또는 전화,&nbsp;홈페이지의 메시지
                      기능 등의 방법을 이용하여 해당 회원 또는 대리인에게
                      통지한다.&nbsp;다만,&nbsp;회사가 긴급하게 이용을 중지해야
                      할 필요가 있다고 인정하는 경우에는 전항의 과정 없이 서비스
                      이용을 제한할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >서비스 이용중지를 통지 받은 회원 또는 그 대리인은
                      이용중지에 대하여 이의가 있을 경우 이의 신청을 할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용중지 기간 중에 그 이용중지 사유가 해소된 것이
                      확인된 경우에 한하여 이용중지 조치를 즉시
                      해제한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 서비스 이용을 중지 또는 제한시킨 후 동일한
                      행위가&nbsp;2&nbsp;회 이상 반복되거나&nbsp;30&nbsp;일
                      이내에 그 사유가 시정되지 아니하는 경우,&nbsp;또는
                      제&nbsp;2&nbsp;항의 위반행위가 있는 경우,&nbsp;회사는
                      이용계약을 해지할 수 있습니다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 이용계약을 해지하는 경우에는 회원등록을
                      말소하고,&nbsp;회사가 보관 내지 관리중인 회원의 자산이
                      있는 경우 말소 시점까지 발생한 수수료 기타 비용을 공제한
                      후 회원에게 반환한다.&nbsp;회사는 이 경우 회원에게 이를
                      사전 통지하고,&nbsp;회원등록 말소 전에 소명할 기회를
                      부여한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 9조 회원정보의 변경</span
                    ></strong
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원은 개인정보수정화면을 통하여 언제든지 본인의
                      개인정보를 열람하고 수정할 수
                      있습니다.&nbsp;다만,&nbsp;서비스 관리를 위해 필요한
                      실명,&nbsp;아이디 등은 수정이 불가능하며,&nbsp;회원의
                      종류나 수정하고자 하는 정보의 내용에 따라 회사는
                      상급기관이나 관리자 등의 정보변경 승인여부를 확인할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원은 회원가입 신청 시 기재한 사항이 변경되었을 경우
                      온라인으로 수정해 회사에 대하여 그 변경사항을 알려야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;2&nbsp;항의 변경사항을 회사에 알리지 않아 발생한
                      불이익에 대하여 회사는 책임지지 않는다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 10조 회원 아이디와 비밀번호 관리에 대한 회원의
                      의무&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >아이디와 비밀번호에 관한 모든 관리책임은 회원에게
                      있으며,&nbsp;회원은 아이디 및 비밀번호를 타인에게
                      양도,&nbsp;대여할 수 없다.&nbsp;회사의 귀책사유에 의하지
                      아니한 아이디,&nbsp;비밀번호의
                      유출,&nbsp;양도,&nbsp;대여로 인한 손실이나 손해에 대하여
                      회사는 책임을 지지 않는다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원은 자신의 아이디가 부정하게 사용된 사실을 알게 될
                      경우 반드시 회사에 그 사실을 통지하고 회사의 안내에 따라야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;2&nbsp;항의 경우에 해당 회원이 회사에 그 사실을
                      통지하지 않거나,&nbsp;통지한 경우에도 회사의 안내에 따르지
                      않아 발생한 불이익에 대하여 회사는 책임지지
                      않는다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;11조 정보의 제공&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >회사는 회원이 서비스 이용 중 필요가 있다고 인정되는 다음
                    각호의 하나와 같은 서비스 정보에 대해서 전자우편이나
                    서신우편 등의 방법으로 회원에게 제공할 수 있으며 회원은 원치
                    않을 경우 가입신청메뉴와 회원정보수정 메뉴에서
                    정보수신거부를 할 수 있다.&nbsp;</span
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >암호자산 보관&middot;예치&middot;관리 관련
                      서비스&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이벤트 및 행사관련 등의 서비스&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 회사가 수시로 결정하여 회원에게 제공하는
                      서비스</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;12조 서비스의 종류&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 암호자산 보관&middot;예치 서비스 및 이와 관련된
                      제반 서비스(암호자산의 입금&middot;출금,&nbsp;암호자산
                      관련 정보 제공,&nbsp;전자지갑 제공 등)&nbsp;등을
                      제공한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 제공하는 서비스의 종류는 회사의 사정에 의하여
                      수시로 변경 또는 종료될 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;13조 서비스의 내용 및 유의사항</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >회사가 제공하는 서비스와 관련하여,&nbsp;회원은 다음 각 호의
                    사항을 충분히 이해하고 숙지한 후 서비스를 이용하여야
                    한다.&nbsp;</span
                  ></p
                >
                <ul style="margin-left:38.35px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 서비스와 관련된 모든 거래행위에 대하여 최소
                      이용단위 금액을 설정할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >암호자산의 예치 내지 인출은 블록체인 네트워크의
                      혼잡도,&nbsp;예치 내지 인출을 위한 회사의 다중 보안정책
                      적용 등의 사정으로 해당 예치 내지 인출절차에 소요되는
                      시간이 장기화될 수 있다.&nbsp;특히 예치된 암호자산의
                      인출(다른 전자지갑 주소로의 이체를 포함함)의 경우 회사의
                      서비스 관련 정책에 따라 대면거래가 요구될 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원이 회사의 서비스를 이용하여 암호자산을 예치 내지
                      인출하는 등 거래를 하였을 경우,&nbsp;해당 암호자산의
                      거래내역은 블록체인에 기록이 되어 전 세계의 암호자산
                      이용자가 해당 거래의 진실성 등을 확인할 수 있게
                      된다.&nbsp;다만,&nbsp;통신사업자 등 제3자의
                      귀책사유,&nbsp;회사 내 서버의 점검,&nbsp;블록체인 자체의
                      오류 등으로 인하여 거래내역이 확인되는 블록체인의 정합성이
                      훼손된 경우,&nbsp;회사 또는 회사가 아닌
                      제&nbsp;3&nbsp;자에 의하여 거래내역이 과거의 특정 시점으로
                      복구될 수 있다.&nbsp;서비스의 기반이 되는 블록체인 기술은
                      현재 제&nbsp;3&nbsp;자에 의하여 위,변조 내지 해킹이
                      불가능한 것으로 인정받고 있으나,&nbsp;이는 기술의 발전
                      또한 기타 예상할 수 없는 사정에 의하여 언제든지 변경될 수
                      있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;14조 서비스 내용의 공지 및 변경</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 서비스의 종류에 따라 각 서비스의 특성,&nbsp;절차
                      및 방법에 대한 사항을 서비스 화면을 통하여
                      공지하며,&nbsp;회원은 회사가 공지한 각 서비스에 관한
                      사항을 이해하고 서비스를 이용해야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 본 약관 및 서비스 내용이 변경되는
                      경우,&nbsp;회원의 등록된 전자우편 주소 및 거래소 공지사항
                      페이지를 통하여 회원들에게 통지,&nbsp;공지할 수
                      있으며,&nbsp;회원이 이 내용을 조회하지 않아 입은 손해에
                      대하여는 책임지지 않는다.&nbsp;전자우편 주소의
                      오류,&nbsp;전자우편 서비스의 장애로 인한 경우에도
                      그러하다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;15조 서비스의 유지 및 중지&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >서비스의 이용은 회사의 업무상 또는 기술상 특별한 지장이
                      없는 한 연중무휴 &nbsp;1&nbsp;일&nbsp;24&nbsp;시간을
                      원칙으로 한다.&nbsp;다만 서비스 점검 등의 필요로 회사가
                      정한 날이나 시간은 그러하지 않는다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 서비스를 일정범위로 분할하여 각 범위 별로 이용가능
                      시간을 별도로 정할 수 있으며,&nbsp;이 경우 그 내용을
                      사전에 공지한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 다음 각 호의 하나에 해당하는 경우 서비스 제공을
                      중지할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">1.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >서비스용 설비의 보수 등 공사로 인한 부득이한
                    경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">2.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를
                    중지했을 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">3.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사가 직접 제공하는 서비스가 아닌 제휴업체 등
                    제&nbsp;3&nbsp;자를 이용하여 제공하는 서비스의 경우 제휴업체
                    등의 제&nbsp;3&nbsp;자가 서비스를 중지했을 경우&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">4.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >기타 불가항력적 사유가 있는 경우&nbsp;</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style="font-size:15px;line-height:107%;"
                        >회사는 국가비상사태,&nbsp;정전,&nbsp;서비스 설비의 장애
                        또는 서비스 이용의 폭주 등으로 정상적인 서비스 이용에
                        지장이 있는 때에는 서비스의 전부 또는 일부를 제한하거나
                        정지할 수 있다.</span
                      ></li
                    >
                  </ul>
                </div>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 16조 거래 서비스 이용제한</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원에게 본 이용계약 제 8조 제&nbsp;2항에서 열거된 사유
                      또는 다음 사유가 발생한 경우에는 회사는 로그인 서비스 외
                      다른 서비스의 사용을 제한할 수 있다.&nbsp;다만 이 경우
                      회사는 회원에게 소명기회를 제공하고 회원이 합리적인 소명을
                      하는 경우에는 제한을 즉시 해제하여야 한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:38.35px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >해킹/사기 사고 발생&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >탈퇴 신청&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >거래 이용금액이 회사가 허용한 한도를 초과한
                      경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >국가기관이 관련 법령에 따라 서비스 제한을 요청하는
                      경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >자금세탁,&nbsp;불공정거래,&nbsp;범죄행위 등에 관여하고
                      있거나 관여하고 있다고 합리적으로 의심되는
                      경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회원으로 가입된 이용자가 미성년자로 확인된
                      경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >계정 데이터 정보가 미비하거나 사실과 다름이 확인된
                      경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 정상적인 서비스 진행에 심각한 장애를 유발한다고
                      관리자가 인정하는 경우&nbsp;</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 제&nbsp;1항 각 호에서 정하는 사유가 발생한
                      경우로서 해당 사유가 공공의 이익에 명확히 반하거나 다른
                      회원에 대한 심각한 피해를 유발한다고 인정되는
                      경우,&nbsp;해당 거래의 이행이 완료되었다 하더라도 해당
                      거래를 직권으로 취소하고 원상으로 회복할 수
                      있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;17조 거래 서비스 이용제한의 공지</span
                    ></strong
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >본 이용계약 제&nbsp;16조의 사유가 발생한 경우 회사는 해당
                    내용을 회원에게 전자우편,&nbsp;홈페이지의 메시지 등의 방법을
                    통해 알린다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;18조 서비스 수수료의 내용&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >회사는 회원에게 서비스를 제공하는 대가로 수수료를
                    부과하며,&nbsp;<span style="color:red;"
                      >수수료는 회사의 홈페이지 공지사항란에 명시되어
                      있다.&nbsp;</span
                    >단, 수수료 부과기준은 회사 및 시장의 상황에 따라 변경될 수
                    있으며, 수수료의 변경이 있는 경우 회사는 제 2 조 제 3 항의
                    약관변경 절차에 준하여 고객에게 사전 통지&middot;안내를
                    하기로 한다.</span
                  ></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 예금거래기본약관 -->
          <el-collapse-item title="예금거래기본약관">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style="margin:0;font-size:15px;line-height:115%;text-align:center;"
                  ><strong
                    ><span style='font-size:19px;line-height:115%;";'
                      >예금거래기본약관</span
                    ></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>본&nbsp;</span
                  ><span style='";'
                    >예금거래기본약관(이하&nbsp;&lsquo;약관&rsquo;이라 한다)은
                    코코뱅크(이하&nbsp;&lsquo;회사&rsquo;라 한다)와 고객이 서로
                    믿음을 바탕으로 예금거래를 빠르고 틀림없이 처리하는
                    한편,&nbsp;서로의 이해관계를 합리적으로 조정하기 위하여
                    기본적이고 일반적인 사항을 정한 것이다.&nbsp;회사는 이
                    약관을 코코뱅크 인터넷 홈페이지&nbsp;</span
                  ><span style='";'>및</span><span style='";'>&nbsp;</span
                  ><span style='";'>영업점에&nbsp;</span
                  ><span style='";'>게시하고</span
                  ><span style='";'>,&nbsp;</span><span style='";'>고객은</span
                  ><span style='";'>&nbsp;</span
                  ><span style='";'
                    >영업시간 중 언제든지 이 약관을 볼 수 있고 또한
                    그&nbsp;</span
                  ><span style='";'>제공을</span><span style='";'>&nbsp;</span
                  ><span style='";'>청구할 수 있다.</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제1조 적용범위&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >이 약관은 입출금이 자유로운 예금,&nbsp;거치식 예금 및
                    적립식 예금 거래에 적용한다.&nbsp;</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 2조 거래방법</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><u
                    ><span style='";'
                      ><span style="text-decoration:none;">&nbsp;</span></span
                    ></u
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >고객은 코코뱅크 인터넷 홈페이지를 통해 통하여 모든
                    예금거래를 한다.&nbsp;다만,&nbsp;회사가 정하는 바에 따라
                    영업점이나 다른 금융기관,&nbsp;또는 컴퓨터,&nbsp;테블릿PC등
                    (이하&rdquo;</span
                  ><span style='";'>전자적</span><span style='";'>&nbsp;</span
                  ><span style='";'
                    >장치&rdquo;)을 통하여 거래할 수 있다.</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>&nbsp;</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 3조 입금</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp; &nbsp;</span></p
                >
                <ul
                  style="margin-left:29.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >고객은 회사에 등록이 가능한 암호자산을 지갑 주소와
                      계좌번호를 통해 입금할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >고객은 예금 가입시 회사에서 지정한 암호자산으로 대상
                      계좌에 사전 입금을 해 두어야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:20.0pt;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'
                      >제&nbsp;4조 예금이 되는 시기 &nbsp;</span
                    ></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >예금이 되는 시기는 제3조에 따라 암호자산으로
                      계좌송금하거나 계좌이체 하여 예금 원장에 입금을 기록한
                      때이다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >회사는 특별한 사정이 없는 한 제1항의 확인 또는 기록처리를
                      신속히 하여야 한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'
                      >제 5조 암호자산의 기능 상실&nbsp;</span
                    ></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <div style="margin:0;font-size:15px;line-height:115%;">
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li style="margin:0;font-size:15px;line-height:115%;"
                      ><span style='";'>입금된</span>
                      <span style='";'>암호자산이</span>
                      <span style='";'>기능을</span>
                      <span style='";'>상실한</span>
                      <span style='";'>때에는</span>
                      <span style=";">회사는</span>
                      <span style='";'>그</span>
                      <span style='";'>금액을</span>
                      <span style='";'>예금원장에서</span>
                      <span style='";'>뺀</span>
                      <span style=";">뒤</span>,&nbsp;<span style='";'
                        >고객</span
                      >(<span style='";'>또는</span>
                      <span style='";'>입금의뢰인</span>)<span style='";'
                        >이</span
                      >
                      <span style=";">신고한</span>
                      <span style='";'>연락처로</span>
                      <span style='";'>그</span>
                      <span style='";'>사실을</span>
                      <span style=";">알린다</span>.&nbsp;<span style='";'
                        >다만</span
                      >,&nbsp;<span style='";'>천재지변</span>
                      <span style=";">등</span>
                      <span style='";'>부득이한</span>
                      <span style='";'>사유로</span>
                      <span style='";'>그</span>
                      <span style=";">사실을</span>
                      <span style='";'>알릴</span>
                      <span style='";'>수</span>
                      <span style='";'>없는</span>
                      <span style=";">경우에는</span>
                      <span style='";'>그러하지</span>
                      <span style='";'>아니하다</span>.&nbsp;</li
                    >
                  </ul>
                </div>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제 6조 이자</span></strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >이자는 암호자산을 단위로 하며,&nbsp;약정한 예치기간 또는
                      제6조에 따라 예금이 된 날부터 지급일 전날까지의 기간에
                      대하여 회사가 정한&nbsp;</span
                    ><span style='";'>이율</span
                    ><span style='";'>로 셈한다.&nbsp;</span></li
                  >
                  <li
                    ><span style='";'
                      >회사는 예금종류별 예금이율표를 영업점 및 인터넷
                      홈페이지에 비치&middot;게시하고,&nbsp;이율을 바꾼 때는 그
                      바꾼 내용을 영업점 및 인터넷 홈페이지에&nbsp;1개월 동안
                      게시한다. &nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >제2항에 따라 이율을 바꾼 때에는,&nbsp;입출금이 자유로운
                      예금은 바꾼 날로부터 바꾼&nbsp;</span
                    ><span style='";'>이율을</span><span style='";'>&nbsp;</span
                    ><span style='";'
                      >적용하며,&nbsp;거치식ㆍ적립식 예금은 계약당시의 이율을
                      적용함을 원칙으로 하되,&nbsp;변동금리가 적용되는 예금은
                      바꾼 날로부터 바꾼 이율을 적용한다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >변동이율을 적용하는 거치식ㆍ적립식 예금은 최초 거래 시
                      이율적용방법을 전자적 장치로 표시하며,&nbsp;또한
                      변동이율을 적용하는 적립식예금은 이율을 바꾼 때마다 바뀐
                      이율을 전자적 장치로 안내한다. &nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 7조 휴면예금&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >회사는 예금이 다음 각 호에 해당할 때에는 예금채권의
                      소멸시효가 완성된 것 (이하&ldquo;휴면예금&rdquo;이라
                      한다)으로 본다. &nbsp; &nbsp; &nbsp;&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style='";'
                      >입출금이 자유로운 예금은 이자지급을 포함한
                      최종거래일로부터 5년 이상 경과한 예금</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >거치식ㆍ적립식 예금은 만기일 또는 이자지급을 포함한
                      최종거래일로부터&nbsp;5년 이상 경과한 예금&nbsp;</span
                    ></li
                  >
                </ol>
                <ul
                  style="margin-left:31.299999999999997px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >예금계약은 예금이 제&nbsp;1항 각호에 따라 휴면예금에
                      해당하게 된 시점에 자동 종료하며,&nbsp;해당계좌는 더 이상
                      이용이 불가하다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'>제 8조 지급시기&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:38.35px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >입출금이 자유로운 예금은 고객이 요청할 때 지급한다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >거치식ㆍ적립식 예금은 만기일이 지난 다음 고객이 요청할 때
                      지급한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong
                    ><span style='";'
                      >제 9조 지급 및 해지청구&nbsp; &nbsp;&nbsp;</span
                    ></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >고객이 예금&middot;이자를 찾거나 예금계약을 해지하고자 할
                      때에는 홈페이지를 통해 해지를 신청한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >계좌를 보유한 고객이 전자적 장치를 이용한 서비스에 가입한
                      경우&nbsp;</span
                    ><span style='";'>고객의</span><span style='";'>&nbsp;</span
                    ><span style='";'
                      >예금계약을 해지하고자 할 때에는 전자적 장치를 이용하여
                      해지가 가능하다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >고객이 자동이체 또는 전자적 장치 등을 이용하여 찾을 때는
                      그 약정에서 정한 바에 따른다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong><span style='";'>&nbsp;10</span></strong
                  ><strong
                    ><span style='";'>조 양도 및 질권설정&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:17.1px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >고객이 예금을 양도하거나 질권을 설정하려면 사전에 회사에
                      통지하고 동의를 받아야 한다.&nbsp;다만,&nbsp;법령에 의하여
                      금지되는 경우에는 양도나 질권설정을 할 수 없다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >입출금이 자유로운 예금은 질권을 설정할 수 없다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><strong
                    ><span style='";'
                      >제 11조 사고ㆍ변경사항의 신고</span
                    ></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul
                  style="margin-left:24.200000000000003px;list-style-type: undefined;"
                >
                  <li
                    ><span style='";'
                      >고객은 계좌,&nbsp;지갑 등이 해킹 되었을 때는 온라인
                      고객센터에 신고하거나 영업점에 방문하여 서면으로
                      신고하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >고객은 전자서명,&nbsp;성명,&nbsp;기타 신고사항을 바꿀
                      때에는 온라인 고객센터에 신고하여야
                      한다.&nbsp;다만,&nbsp;고객은 전자메일 주소,&nbsp;비밀번호
                      등의 일부 신고사항에 대하여는 회사가 정한 방법에 따라
                      전자적 장치를 이용하여 변경할 수 있다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >제 1항 및 제2항의 신고는 회사가 이를 접수한 뒤 전산입력
                      등 필요한 조치를 하는데 걸리는 합리적인 시간이 지나면 그
                      효력이 생기며 전산장애 등 불가항력적인 사유로 처리하지
                      못한 때는 복구 등 사유 해제 시 즉시 처리하여야 한다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >제1항의 신고를 철회한 때는 고객 본인이 온라인 고객센터에
                      요청하여야 한다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><strong
                    ><span style='";'>제 12조 계좌 재발급&nbsp;</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:13.5pt;"
                  ><span style='";'
                    >제11조에 따라 계좌에 대한 사고신고가 있을 때에는 회사는
                    신고인이 고객 본인임을 확인하는 등 필요한 조치를 마친 뒤에
                    재발급하거나 지급한다.</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><strong
                    ><span style='";'>제 13조 통지방법 및 효력</span></strong
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:normal;"
                  ><span style='";'>&nbsp;</span></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >회사는 오류의 정정 등 예금거래에서 발생하는 일반적 사항을
                      통보하는 경우에는 고객이 신고한 전자메일주소로 통보할 수
                      있다.&nbsp;이 때,&nbsp;전자메일을 주고받는 대상이 고객
                      본인이 아닌 경우,&nbsp;그 대상자가 회사의 통지내용을
                      이해하고 이를 고객에 전달할 것이라고 믿을 충분한 이유가
                      있는 때에는 고객에게 정당하게 통보한 것으로 본다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >회사는 예금계약의 임의해지 등 중요한 의사표시를 하는
                      때에는 고객에게 통지하여야 하며 그 통지가 고객에게
                      도달되어야 의사표시의 효력이
                      생긴다.&nbsp;다만,&nbsp;관계법령 등에 의하여 예금계약을
                      해지한 경우나 고객이 제13조에 의한 변경신고를 게을리하여
                      도달되지 않은 때에는 그러하지 아니하다.</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;14</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>면책</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >회사는 온라인 고객센터,&nbsp;영업점 등을 통해 고객 또는
                      대리인으로부터 청구서,&nbsp;신고서,&nbsp;위임장 등을 제출
                      받는 경우 해당 서류에 찍힌 인감 또는 서명이 인감증명서에
                      따른 인감 또는 본인서명사실확인서에 따른 서명감과 육안으로
                      주의깊게 비교,&nbsp;대조하여 틀림없다고 여기고,&nbsp;그 외
                      비밀번호 등 본인확인을 위하여 입력 또는 제출 받은 정보가
                      사전 신고된 고객의 정보와 동일하여 고객이 요구하는 업무를
                      처리하였을 때에는 인감이나 서명의 위조,&nbsp;변조 또는
                      도용이나 그 밖의 사고로 인하여 고객에 손해가 생겨도 그
                      책임을 지지 않는다.&nbsp;다만,&nbsp;회사가 인감이나 서명의
                      위조,&nbsp;변조 또는 도용 사실을 알았거나 알 수 있었을
                      때는 그러하지 아니하다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >전자적 장치 등을 이용하거나 거래정보 등의 제공 및
                      금융거래명세 등의 통보와 관련하여 회사가 책임질 수 없는
                      사유로 지갑주소,&nbsp;계좌번호,&nbsp;비밀번호 등의
                      금융정보가 새어 나가 고객이 손해가 생겨도 회사는 그 책임을
                      지지 않는다.</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >회사가 주민등록증 등 실명확인증표로 주의 깊게 실명확인
                      하거나 실명전환한 계좌는 고객이 실명확인증표 또는 서류의
                      위조,&nbsp;변조,&nbsp;도용 등을 한 경우,&nbsp;이로 인하여
                      고객에 손해가 생겨도 회사는 그 책임을 지지
                      않는다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >고객이 제13조 제1항,&nbsp;제2항,&nbsp;제3항의 신고나
                      절차를 미루어 생긴 손해에 대해 회사는 그 책임을 지지
                      않는다.&nbsp;다만,&nbsp;이 경우에도 회사는 고객에 손해가
                      발생하지 않도록 선량한 관리자로서의 주의를 다하여야
                      한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;15</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>수수료</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p
                  style="margin:0;margin-left:20.0pt;font-size:15px;line-height:115%;"
                  >&nbsp;</p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >고객이 전자적 장치 또는 다른 금융기관 등을 통해 거래할 때
                      회사는 온라인수수료나 추심수수료 등을 받을 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >회사는 제1항의 경우 외에도 고객이 부가서비스 등을
                      요청하는 경우 그 사무처리와 관련하여 수수료를 받을 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >제1항,&nbsp;제2항과 관련한 수수료표는 영업점 또는 인터넷
                      홈페이지에 놓아두거나 게시한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;16</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>오류처리</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>등</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >회사가 예금원장이나 계좌 거래내용을 사실과 다르게
                      처리하였을 때에는 이를 확인하여 바르게 고치고 그 사실을
                      고객에게 통지하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >고객은 거래를 마친 때 그 내용이 맞는가를
                      확인하고,&nbsp;거래내용이 사실과 다를 때에는 바르게 고칠
                      것을 요구할 수 있으며,&nbsp;회사는 그 사실을 확인하고
                      바르게 처리하여야 한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;17</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>예금의</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>비밀보장</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <div style="margin:0;font-size:15px;line-height:115%;">
                  <ul
                    style="margin-bottom:0;margin-left:30px;list-style-type: undefined;"
                  >
                    <li style="margin:0;font-size:15px;line-height:115%;"
                      ><span style='";'
                        >회사는 금융실명거래 및 비밀보장에 관한 법률 등 법령에서
                        정한 경우를 제외하고는 고객의 거래내용에 대한 자료나
                        정보를 남에게 제공하지 않는다.&nbsp;</span
                      ></li
                    >
                  </ul>
                </div>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;18</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>약관의</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>변경</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >회사는 이 약관이나 입출금이 자유로운 예금약관 또는
                      거치식ㆍ적립식예금 약관을 변경하고자 할 때에는 변경약관
                      시행일&nbsp;1개월 전에 한달간 영업점과 인터넷홈페이지에
                      게시하여 고객에게 알린다.&nbsp;다만,&nbsp;법령의 개정이나
                      제도의 개선 등으로 인하여 긴급히 약관을 변경한 때에는 즉시
                      이를 게시 또는 공고하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >약관변경의 내용이 고객에게 불리한 경우에는 변경약관
                      시행일&nbsp;1개월 전에 다음 각 호의 방법으로 고객에
                      알린다.</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li><span style='";'>제1항에 의한 게시</span></li>
                  <li
                    ><span style='";'
                      >고객이 신고한 전자우편(E-mail)에 의한 통지</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >코코뱅크 지점에 비치된 CTM&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >온라인 홈페이지 초기 화면에 게시</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >고객은 제1항 및 제2항의 고지 후 변경약관 시행일
                      전영업일까지 온라인 홈페이지를 통해 계약을 해지할 수
                      있으며,&nbsp;이 기간 내에 온라인 고객센터 또는 영업점을
                      통해 고객의 이의가 회사에 도달하지 않으면 이를 승인한
                      것으로 본다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;19</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>약관적용의</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>순서</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='";'
                      >회사와 고객 사이에 개별적으로 합의한 사항이 약관조항과
                      다를 때에는 그 합의사항을 약관에 우선하여
                      적용한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";'
                      >이 약관에 정한 사항과 입출금이 자유로운 예금약관 또는
                      거치식ㆍ적립식 예금약관에서 정한 사항이 다를 때는 입출금이
                      자유로운 예금 약관이나 거치식ㆍ적립식 예금약관을 먼저
                      적용한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p style="margin:0;font-size:15px;line-height:115%;">&nbsp;</p>
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong><span style='";'>제</span></strong
                  ><strong>&nbsp;20</strong
                  ><strong><span style='";'>조</span></strong
                  ><strong>&nbsp;</strong
                  ><strong><span style='";'>기타</span></strong
                  ><strong>&nbsp;</strong></p
                >
                <p
                  style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:40.0pt;font-size:15px;line-height:115%;"
                  >&nbsp;</p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'
                    >이 약관과 입출금이 자유로운 예금약관 또는 거치식ㆍ적립식
                    예금약관에서 정하지 않은 사항은 따로 약정이 없으면 관계법령
                    및 전자금융거래 기본약관,&nbsp;코코뱅크 온라인 뱅킹 서비스
                    이용약관을 적용한다.&nbsp;</span
                  ></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><span style='";'>&nbsp;</span></p
                >
                <p style="margin:0;font-size:15px;line-height:115%;"
                  ><strong>&nbsp;</strong></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 전자금융거래이용약관 -->
          <el-collapse-item title="전자금융거래이용약관">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;text-align:center;";'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >전자금융거래이용약관</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;text-align:center;";'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;1조 목적</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관은 코코뱅크(이하&nbsp;&ldquo;회사&rdquo;라 한다)과
                    이용자 사이의 전자금융거래에 관한 기본적인 사항을
                    정함으로써,&nbsp;거래의 신속하고 효율적인 처리를 도모하고
                    거래당사자 상호간의 이해관계를 합리적으로 조정하는 것을
                    목적으로 한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 2조 용어의 정의&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이 약관에서 사용하는 용어의 의미는 다음 각호와
                      같다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >전자금융거래&ldquo;라 함은 회사가 전자적 장치를 통하여
                      제공하는 금융상품 및 서비스를 이용자가 전자적 장치를
                      통하여 비대면&middot;자동화된 방식으로 직접 이용하는
                      거래를 말한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자&rdquo;라 함은 전자금융거래를 위하여 회사와 체결한
                      계약(이하&nbsp;&quot;전자금융거래 계약&quot;이라 한다)에
                      따라 전자금융거래를 이용하는 고객을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >지급인&rdquo;이라 함은 전자금융거래에 의하여 자금이
                      출금되는 계좌(이하&nbsp;&ldquo;출금계좌&rdquo;라 한다)의
                      명의인을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >수취인&rdquo;이라 함은 전자금융거래에 의하여 자금이
                      입금되는 계좌(이하&nbsp;&ldquo;입금계좌&rdquo;라 한다)의
                      명의인을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >전자적 장치&rdquo;&nbsp;라 함은
                      현금자동지급기,&nbsp;자동입출금기,&nbsp;지급용단말기,&nbsp;컴퓨터,&nbsp;전화기
                      그 밖에 전자적 방법으로 전자금융거래정보를 전송하거나
                      처리하는데 이용되는 장치를 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >접근매체&rdquo;라 함은 전자금융거래에 있어서 거래지시를
                      하거나 이용자 및 거래내용의 진정성을 확보하기 위하여
                      사용되는 다음 각목의 어느 하나에 해당하는 수단 또는 정보를
                      말한다.&nbsp;</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:62.55pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >가.&nbsp;회사가 제공한 전자식 카드 및 이에 준하는 전자적
                    정보&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:62.55pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >나.&nbsp;전자서명법에 따른 전자서명생성정보 또는
                    공인인증서&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:62.55pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >다.&nbsp;회사에 등록된 이용자 번호&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:62.55pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >라.&nbsp;등록되어 있는 이용자의 생체정보&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:62.55pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >마.&nbsp;가목 또는 나목의 수단이나 정보를 사용하는 데
                    필요한 비밀번호&nbsp;</span
                  ></p
                >
                <ol style="margin-left:52.55px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >전자문서&rdquo;라 함은 「전자거래기본법」 제2조 제1호의
                      규정에 따라 작성,&nbsp;송신&middot;수신 또는 저장된 정보를
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >거래지시&rdquo;라 함은 이용자가 전자금융거래계약에 의하여
                      회사에 개별적인 전자금융거래의 처리를 지시하는 것을
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >오류&rdquo;라 함은 이용자의 고의 또는 과실 없이
                      전자금융거래가 약관(개별약관을
                      포함한다),&nbsp;전자금융거래계약 또는 이용자가
                      거래지시한대로 이행되지 아니한 경우를 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌이체&rdquo;라 함은 지급인의 전자적 장치를 통한
                      지급지시에 따라 회사가 지급인의 출금계좌에서 자금을
                      출금하여 같은 회사 또는 다른 회사의 계좌에 입금하는 것을
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >추심이체&rdquo;라 함은 수취인의 전자적 장치를 통한
                      추심지시에 따라 회사가 지급인의 출금계좌에서 자금을
                      출금하여 같은 회사 또는 다른 회사의 계좌에 입금하는 것을
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >예약에 의한 계좌이체&rdquo;라 함은 계좌이체가 장래의
                      특정일자에 이루어지도록 이 용자가 미리 거래지시하고 회사가
                      이를 해당일자에 처리하는 것을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌송금&rdquo;이라 함은 이용자가 자동 입&middot;출금기를
                      통하여 자기 또는 타인의 계좌에 자금을 입금하는 것을
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >예약에 의한 추심이체&rdquo;라 함은 추심이체가 장래의
                      특정일자에 이루어지도록 이용자가 미리 거래지시하고 회사가
                      이를 해당일자에 처리하는 것을 말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >영업일&rdquo;이라 함은 통상 회사가 영업점에서 정상적인
                      영업을 하는 날을 말한다.&nbsp;</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이 약관에서 별도로 정하지 아니한 용어는
                      「전자금융거래법」 및 관계 법령 등에서 정하는 바에
                      따른다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 3조 적용되는 거래</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관은 회사와 이용자 사이에 다음 각호의 전자적 장치를
                    이용하 여 이루어지는 계좌이체(예약에 의한 계좌이체를
                    포함한다.&nbsp;이하 같다),&nbsp;추심이체(예약에 의한
                    추심이체를 포함한다.&nbsp;이하 같다),&nbsp;계좌송금과 관련한
                    조회,&nbsp;입금&middot;출금 등의 전자금융거래에
                    적용된다.&nbsp;</span
                  ></p
                >
                <ol style="margin-left:30px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;">CTM</span
                    ><span style="font-size:15px;line-height:107%;"
                      >기에 의한 거래&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >컴퓨터에 의한 거래&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전화기에 의한 거래</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 전자적 장치에 의한 거래&nbsp;</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 4조 전자금융거래계약의 체결 및 해지&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 전자금융거래를 하고자 하는 경우에는 사전에
                      회사와 별도의 전자금융거래계약을 체결하여야
                      한다.&nbsp;다만,&nbsp;다음 각호의&nbsp;1에 해당하는
                      경우에는 그러하지 아니하다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >단순조회(예금잔액,&nbsp;예금 입&middot;출금내역
                      등)&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >단순히 이용수수료를 납부하고 처리하는 거래&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;">CTM</span
                    ><span style="font-size:15px;line-height:107%;"
                      >에 의한 거래</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 회사가 정하는 거래</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자금융거래 계약을 해지하고자 할 때에는 이용자 본인이
                      전자금융거래에 관한 개별약관에 정한 바에 따라 서면 또는
                      해당 전자적 장치에 의하여 회사에 해지신청을 하여야
                      한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 5조 접근매체의 발급 및 등록&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 접근매체를 발급할 때에는 이용자의 신청이 있는
                      경우에 한하여 본인임을 확인한 후에 발급한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제1항의 규정에도 불구하고 회사는 접근매체의 갱신 또는
                      대체발급 등을 위하여 이용자의 동의를 얻은 경우로서 다음
                      각호에 해당하는 경우에는 이용자의 신청이나 본인확인 없는
                      때에도 발급할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >갱신 또는 대체발급 예정일전&nbsp;6월 이내에 사용된 적이
                      없는 접근매체에 대하여 이용자 로부터 갱신 또는 대체발급에
                      대한 서면(전자서명법 제2조 제3호의 규정에 따른 공인전자서
                      명(이하&nbsp;&quot;공인전자서명&quot;이라 한다)이 있는
                      전자문서 포함)&nbsp;동의를 얻은 경우</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >갱신 또는 대체발급 예정일전&nbsp;6월 이내에 사용된 적이
                      있는 접근매체의 경우에는 그 예정일부터&nbsp;1월 이전에
                      이용자에게 발급 예정사실을 알린 후&nbsp;20일 이내에
                      이용자로부터 이의제기가 없는 경우</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 전자금융거래계약을 체결하고 거래비밀번호 등을
                      전자적 장치를 통하여 직접 등록할 경우에는 계약일
                      포함&nbsp;3영업일 이내에 등록하여야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 6조 접근매체의 관리&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이용자는 다른 법률에 특별한 규정이 없는 한 전자금융거래에
                    필요 한 접근매체를 제3자에게 대여,&nbsp;사용위임 또는
                    양도&middot;담보 제공하거나 본인 이외의 제3자에게 누설해서는
                    안되며,&nbsp;접근수단의 도용이나 위조 또는 변조를 방지하기
                    위한 관리에 충분한 주의를 기울여야 한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 7조 이용시간</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 회사가 정한 시간 이내에서 전자금융거래를 이용할
                      수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용시간은 회사의 사정에 따라 달라질 수
                      있으며,&nbsp;이용시간을 변경하고자 할
                      경우에는&nbsp;1개월전 본점 및 영업점,&nbsp;게시 가능하거나
                      기타 이용자가 접근하기 용이한 전자적 장치를 통하여
                      게시한다.&nbsp;다만,&nbsp;시스템 장애복구,&nbsp;긴급한
                      프로그램 보수,&nbsp;외부요인 등 불가피한 경 우에는 예외로
                      한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 8조 수수료&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 전자금융 수수료를 이용자의 계좌에서
                      출금하며,&nbsp;수납방법은 개별약관에 따른다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >수수료는 회사의 수수료율 계산방법에 따르며,&nbsp;회사가
                      수수료율을 변경하고자 하는 때에는 그 내용을 본점 및
                      영업점에 게시하고 기타 이용자가 접근하기 용이한 전자적
                      장치를 통 하여 변경일&nbsp;1개월 전에
                      게시하여&nbsp;1개월간 알린다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 9조 이체 한도&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이용자는 회사가 정한 지정방법에 따라 계좌이체 및
                    추심이체,&nbsp;계좌송금에 대한 이체 최고한도를 설정하여야
                    한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 10조 거래의 성립&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이용자가 전자금융거래를 하고자 하는 경우에는 다음 각 호의
                    시기에 거래가 성립한다.&nbsp;</span
                  ></p
                >
                <ol style="margin-left:30px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌이체 및 추심이체의 경우에는 이용자가 입력한
                      거래지시의 내용을 회사가 확인하고 출금자금(수수료를
                      포함한다.&nbsp;이하 같다)을 출금계좌원장에 출금기록 한
                      때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >출금의 경우에는 이용자가 입력한 거래지시의 내용을 회사가
                      확인하고 출금자금을 출금계좌원장에 출금기록 한
                      때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌송금의 경우에는 회사가 이용자가 입력한 거래지시의
                      내용 및 입금자금을 모두 확인한 때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >예약에 의한 계좌이체 및 예약에 의한 추심이체의 경우는
                      회사가 이용자의 거래지시 내용을 확인한
                      때.&nbsp;다만,&nbsp;이체시점에 자금이 출금계좌에 입금되어
                      있을 것을 조건으로 한다.</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 11조 거래지시의 처리기준&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용자의 거래지시에 포함된
                      계좌번호,&nbsp;비밀번호,&nbsp;이용자번호 등의 접근매체
                      정보를 신고된 것과 대조하여 그 일치여부를 확인한 후에
                      거래지시를 처리한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자의 거래지시와 관련하여 회사가 수신한 전자문서는 각
                      문서마다 독립된 것으로 본다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제2항의 규정에도 불구하고 거래지시 전자문서가 회사가 정한
                      시간내에 동일한 내용으로 반복 수신된 경우 회사는 전화 기타
                      이용자에게 즉시 통지할 수 있는 전자적 장치 등을 통 하여
                      이용자의 진정한 거래지시 의사를 확인하는 절차를 거친 후
                      나머지 전자문서를 임의로 폐기할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용자의 거래지시에 따라 출금계좌에서 자금을
                      인출할 때 예금거래기본약관에 불구하고 계좌나 지급청구서
                      또는 수표 없이 인출한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >대량계좌이체,&nbsp;타행계좌이체 등과 같이 거래의 특성상
                      수취인의 명의를 확인할 수 없는 경우에는 수취인의
                      계좌번호를 기준으로 하여 거래를 처리한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >타행계좌이체는 당일 중에 처리한다.&nbsp;다만 당일 중
                      처리가 불가능한 경우에는 제19조 제&nbsp;4항에서 정한 바에
                      따라 처리한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >예약에 의한 계좌이체 및 추심이체의 경우 이체시점에
                      출금계좌의 자금이 이용자가 거래 지시한 금액 이상일 때
                      처리한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제7항의 경우 이체지정일이 회사 휴무일로 정해질 때에는
                      익영업일에 거래를 처리한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;12조 추심이체의 출금 동의&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='line-height:107%;";'
                      >회사는 추심이체를 실행하기 위하여 다음 각호에서 정하는
                      방식에 따라 미리 지급인으로부터 출금에 대한 동의를 얻어야
                      한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style='line-height:107%;";'
                      >회사가 지급인으로부터 서면(공인전자서명이 있는 전자문서를
                      포함한다.&nbsp;이하 이 조에서 같다)에 의하여 출금신청을
                      받는 방법&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='line-height:107%;";'
                      >수취인이 지급인으로부터 서면에 의한 출금의 동의를 받아
                      회사에게 전달(전자적인 방법에 의하여 출금동의의 내역을
                      전송하는 경우를 포함한다)하는 방법</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style='line-height:107%;";'
                      >지급인은 수취인의 거래지시에 따라 지급인의 계좌의 원장에
                      출금기록이 끝나기 전까지 회사에 출금동의의 철회를 요청할
                      수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='line-height:107%;";'
                      >제2항의 규정에도 불구하고 대량으로 처리하는 거래 또는
                      예약에 의한 추심이체거래의 경우에는 지급인은 출금일
                      전영업일까지 회사 영업점에 서면으로 출금 동의의 철회를
                      요청할 수 있다.</span
                    ></li
                  >
                  <li
                    ><span style='line-height:107%;";'
                      >회사 및 수취인은 제&nbsp;1항의 출금 동의의 방법을
                      운용함에 있어 다음 각 호의 어느 하나에 해당하는 사실을
                      확인하여야 한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style='line-height:107%;";'
                      >지급인과 추심이체 출금계좌 실지명의인이 동일인인
                      사실&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style='";font-size:11.0pt;line-height:107%;'
                      >지급인과 추심이체 출금계좌 실지명의인이 동일인이 아닐
                      경우에는 지급인이&nbsp;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >당해 계좌에서 출금할 수 있는 권한을 보유하고 있는
                      사실</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:80.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 13조 거래의 제한&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >다음 각호의&nbsp;1에 해당하는 경우에는 전자금융거래의
                      당해 지시에 따른 거래를 제한할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자금융거래의 처리시점에 출금계좌의 자금이 출금자금에
                      미달하는 때.&nbsp;다만,&nbsp;전자금융거래에 관한
                      개별약관에 따로 정한 경우에는 그에 따른다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >입금 또는 출금계좌가 해지되었거나 거래중지계좌에
                      편입되었을 때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이체일에 입금 또는 출금계좌의 잔액증명서가 발급되었을
                      때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 설정한 이체한도를 초과하여 계좌이체 거래지시를
                      할 때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >입금계좌를 지정하여 계좌이체를 이용하기로 한 이용자가
                      지정하지 않은 계좌로 계좌 이체 거래지시를 할
                      때&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >법적 지급제한,&nbsp;전자금융거래법 및 관련법령 위반
                      등으로 거래제공이 부적합하다고 회사가 인정했을 때</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >다음 각호의&nbsp;1에 해당하는 경우에는 해당 전자적 장치를
                      통한 계좌이체의 전부를 제한할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >컴퓨터 또는 전화기로 전자금융거래를 이용하는
                      이용자가&nbsp;12개월 이상 이용실적이 없을 때</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 제1항 및 제2항에 의해 전자금융거래를 제한한
                      경우에는 이용자의 거래지시가 있을 때 해당 전자적 장치를
                      통하여 그 사유를 알려야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 14조 지급의 효력발생시기</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:20.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌이체,&nbsp;추심이체 및 계좌송금의 경우에는 수취인의
                      계좌원장에 입금기록을 마친 때에 지급의 효력이
                      생긴다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자화폐,&nbsp;전자채권 등 그 밖의 전자지급수단으로
                      지급하는 경우에는 거래 지시된 금액의 정보가 수취인의
                      계좌가 개설되어 있는 회사의 전자적 장치에 입력이 끝난 때에
                      지급의 효력이 생긴다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 15조 거래지시의 철회&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 제15조에 의하여 거래가 완료되기 전까지
                      전자금융거래시 이용한 해당 전자적 장치를 통하거나 또는
                      회사가 정하는 절차에 따라 거래지시를 철회할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >대량으로 처리하는 거래 또는 예약에 의한 계좌이체 및
                      추심이체는 이체일 전영업일까지 전자금융거래시 이용한 해당
                      전자적 장치를 통하여 거래지시를 철회할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >실시간 이체되는 거래 등 전자금융거래의 성질상 회사가
                      거래의 완료여부를 즉시 확인할 수 없는 경우에는 제1항의
                      규정에도 불구하고 이용자의 거래지시 철회를 제한할 수
                      있다&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자의 요청에 따라 출금계좌를 해지할 때에는 해당 계좌에
                      등록된 예약에 의한 계좌 이체 거래지시도
                      철회된다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자의 사망&middot;한정치산선고&middot;금치산선고나
                      이용자 또는 회사의 해산&middot;합병&middot;파산은 그
                      자체로는 거래지시를 철회 또는 변경하는 것으로 되지
                      아니하며 회사의 권한에도 영향을 미치지 아니한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 16조 거래내용의 확인&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 제14조의 거래의 처리결과를 이용자가 전자금융거래에
                      이용한 해당 전자적 장치 또는 컴퓨터 등 대체 전자적 장치를
                      통하여 즉시 확인할 수 있도록 하여야
                      한다.&nbsp;다만,&nbsp;타행계좌이체 및 예약에 의한
                      계좌이체의 경우에는 접수결과를 해당 전자적 장치를 통하여
                      이용자에게 즉시 알린다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제1항의 규정에도 불구하고 이용자가 요청하는 거래내용을
                      해당 전자적 장치 및 대체 전 자적 장치로도 즉시 확인을 해
                      주는 것이 곤란할 경우 회사는 해당 거래내용을
                      서면(전자문서를 제외한다)&nbsp;형태로 출력하여 이용자에게
                      교부하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 거래지시와 제1항에 의한 처리결과가 일치하는지
                      여부를 확인하여야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 17조 오류의 정정&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 전자금융거래에 오류가 있음을 안 때에는 즉시
                      회사에 정정을 요구할 수 있으며 이 경우 회사는 즉시
                      조사하여 이체자금의 이동경로를 확인하거나 출금을 제한하는
                      등 필요한 조치를 처리한 후 정정요구를 받은
                      날부터&nbsp;2주일 이내에 그 결 과를 이용자에게 알려야
                      한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 스스로 전자금융거래에 오류가 있음을 안 때에는 이를
                      즉시 조사하여 처리한 후 오류가 있음을 안 날부터&nbsp;2주일
                      이내에 그 결과를 이용자에게 알려야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 18조 사고,&nbsp;장애시의 처리&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 거래계좌에 관한 접근수단의
                      도난,&nbsp;분실,&nbsp;위조 또는 변조의 사실을 알았거나
                      기타 거래절차상 비밀을 요하는 사항이 누설되었음을 알았을
                      때 에는 지체없이 이를 회사에 신고하여야 한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제1항의 신고는 회사가 이를 접수한 즉시 그 효력이
                      생긴다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제1항의 신고를 철회할 경우에는 이용자 본인이 회사에
                      서면으로 신청하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 통신장애 및 기타의 사유로 인하여 거래지시된
                      전자금융거래가 처리 불가능할 경 우 출금계좌로 입금처리하고
                      이용자의 신고된 연락처로 이를 통지하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용자의 요청이 있을 때에는 사고 또는 장애의
                      사유를 지체 없이 조사하여 그 결과를 이용자에게 통지하여야
                      한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 19조 손실부담 및 면책&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 접근매체의 위조나 변조로 발생한
                      사고,&nbsp;계약체결 또는 거래지시의 전자적 전송이나
                      처리과정에서 발생한 사고로 인하여 이용자에게 손해가 발생한
                      경우에 그 금액과&nbsp;1년 만기 정기예금 이율로 계산한
                      경과이자를 보상한다.&nbsp;다만,&nbsp;부정 이체 결과로 당해
                      계좌에서 발생한 손실액이&nbsp;1년 만기 정기예금 이율로
                      계산한 금액을 초과하는 경우에는 당해 손실액을
                      보상한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제1항의 규정에도 불구하고 회사는 다음 각호에 해당하는
                      경우에는 이용자에게 손해가 생기더라도 책임의 전부 또는
                      일부를 지지 아니한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >천재지변,&nbsp;전쟁,&nbsp;테러,&nbsp;또는 회사의 귀책사유
                      없이 발생한 정전,&nbsp;화재,&nbsp;건물의 훼손 또는 테러 등
                      불가항력으로 인한 경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 접근매체를 제3자에게 대여하거나 사용을
                      위임하거나 양도 또는 담보 목적으로 제공한 경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제3자가 권한 없이 이용자의 접근매체를 이용하여
                      전자금융거래를 할 수 있음을 알았거나 쉽게 알 수 있었음에도
                      불구하고 이용자가 자신의 접근매체를 누설 또는 노출하거나
                      방치한 경우&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >법인(「중소기업기본법」제2조제2항에 의한 소기업을
                      제외한다)인 이용자에게 손해 가 발생한 경우로 회사가 사고를
                      방지하기 위하여 보안절차를 수립하고 이를 철저 히 준수하는
                      등 합리적으로 요구되는 충분한 주의의무를 다한 경우</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자로부터 접근매체의 분실이나 도난의 통지를 받은
                      경우에는 회사는 그 때부터 제3&nbsp;자가 그 접근매체를
                      사용함으로 인하여 이용자에게 발생한 손해를 보상한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 20조 거래기록,&nbsp;자료의 제공&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용자의 요청이 있을 경우 금융실명거래 및 비밀
                      보장에 관한 법률 등 다른 법률에 저촉되지 않는 범위내에서
                      회사가 보존&middot;관리하고 있는 전자금융거래 관련
                      기록&middot;자료를 이용자에게 제공하여야 한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 제공 요청을 할 수 있는 거래기록&middot;자료의
                      범위와 대상기간은 제21조 제1항 및 제2항에서 정한 기록 및
                      기간으로 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 서면(전자문서를 제외한다.&nbsp;이하
                      같다)&nbsp;형태의
                      거래기록&middot;자료(이하&nbsp;&ldquo;거래명세 서&rdquo;라
                      한다)를 제공할 것을 회사에 요청하는 경우에는 본인이
                      서면으로 영업점에 신청하여 야 하며,&nbsp;회사는 신청 가능
                      영업점의 주소 및 전화번호 등을 인터넷 등을 통하여 이용자가
                      알 수 있도록 게시하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 이용자로부터 제3항에 따른 거래명세서의 제공요청을
                      받은 경우&nbsp;2주일 이내에 이 용자에게 거래명세서를
                      교부하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 불가피한 사유로 인하여
                      거래기록&middot;자료(거래명세서 포함)의 제공이 불가능한 경
                      우에는 그 사유를 이용자에게 즉시 통보하여야
                      하며,&nbsp;해당 사유가 소멸한 경우 다음 각호에 정한
                      기한내에 이용자에게 확인 및 제공하여야 한다&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자적 장치를 통한 제공의 경우에는 즉시&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >제3항에 따른 서면 제공 방식의 경우에는&nbsp;2주일 이내에
                      거래명세서를 교부하여야 한다.</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 21조 거래기록의 보존&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 전자금융거래와 관련한 다음 각호의
                      거래기록(조회거래는 제외한다)을 &nbsp; 5년간
                      유지,&nbsp;보존하여야 한다&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >거래계좌의 명칭 또는 번호&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >거래의 종류 및 금액,&nbsp;거래상대방을 나타내는
                      정보&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >거래일시,&nbsp;전자적 장치의 종류 및 전자적 장치를 식별할
                      수 있는 정보&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 수취한 전자금융 관련 수수료&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >추심이체의 경우 지급인의 출금동의 내역&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자금융거래 신청,&nbsp;조건변경에 관한 내용&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >해당 전자금융거래와 관련한 전자적 장치의 접속기록</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 전자금융거래와 관련한 다음 각호의
                      거래기록을&nbsp;1년간 유지,&nbsp;보존하여야
                      한다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:70px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >건당 거래금액이&nbsp;1만원 이하인 소액거래에 관한
                      기록&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >거래승인에 관한 기록&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >오류정정 요구 및 처리기록</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 22조 통지방법 및 효력&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 제16조제2항,&nbsp;제18조제4항 및 제5항 등
                      전자금융거래에서 발생하는 사항을 통지하는 경우에는
                      이용자가 신고한 연락처로 전화,&nbsp;서면 또는 기타 전자적
                      장치로 통지하여야 한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 서면으로 통지했을 때에는 천재지변 등 불가항력적인
                      경우 외에는 보통의 우송기간이 지났을 때 도달한 것으로
                      추정한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 제24조에 의한 변경신고를 게을리함에 따라 제2항에
                      의하여 발송한 서면통지가 이용자에게 연착하거나 도달하지
                      아니한 때에는 보통의 우송기간이 경과한 때에 도달한 것으로
                      본다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 23조 신고사항의 변경 등&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가
                      계좌번호,&nbsp;비밀번호,&nbsp;이용자번호,&nbsp;상호,&nbsp;주소,&nbsp;전화번호
                      등 회사에 신고한 사항을 변경하고자 할 경우에는
                      전자금융거래에 관한 개별약관에 정한 바에 따라 신고하여야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >신고사항의 변경은 회사가 제1항의 신고를 접수하고
                      전산입력에 요구되는 합리적인 시간 이 지난 후에 그 효력이
                      생긴다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 제1항에서 정한 신고사항 이외의 각종 통지를
                      회사의 전자금융보조업자에게도 할 수 있다.&nbsp;이 경우
                      전자금융보조업자에게 한 통지는 회사에게 한 것으로
                      본다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 24조 준수사항&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >전자금융거래의 안전한 수행을 위하여 이용자는 회사가 정하는
                    바에 따라 다음 각호의 사항을 준수하여야 한다.&nbsp;</span
                  ></p
                >
                <ol style="margin-left:30px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >비밀번호 유출 및 해킹 등 전자적 침해를 방지하기 위한하여
                      필요한 조치 및 관리방법&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자 보호를 위하여 회사가 제공하는 절차와
                      방법&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 회사가 정하는 사항</span
                    ></li
                  >
                </ol>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 25조 비밀보장의무</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 법령에 정한 경우를 제외하고는 전자금융거래업무를
                      수행함에 있어서 알게 된 이용자의 인적사항 및
                      계좌,&nbsp;접근매체 및 전자금융거래의 내용과 실적에 관한
                      정보 또는 자료를 이용자의 동의 없이는 다른 사람에게
                      제공하거나 누설하거나 업무 목적 외 사용을 하여서는
                      아니된다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사의 관리소홀로 인한 이용자 관련 정보 도난 및
                      유출시에는 회사가 책임을 진다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 26조 약관의 변경&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사가 이 약관을 변경하고자 할 때는 그 변경&nbsp;1개월
                      전에 본점 및 영업점 및 해당 전자금융거래를 수행하는 전자적
                      장치(해당 전자적 장치에 게시하기 어려울 경우에는 이용자가
                      접근하기 용이한 전자적 장치를 포함한다.&nbsp;이하 이조에서
                      같다)를 통하여&nbsp;1개월간 게시하고 이용자의 전자우편
                      주소로 통지하여야 하며,&nbsp;이용자가 이의를 제기할 경우
                      회사는 이용자에게 적절한 방법으로 약관 변경내용을
                      통지하였음을 확인해 주어야 한다.&nbsp;다만,&nbsp;법령의
                      개정이나 제도의 개선 등으로 인하여 긴급히 약관을 변경할
                      때는 전자 적 장치에 즉시 이를 게시(최소&nbsp;1개월 이상
                      게시)하고 이용자의 전자우편 주소로 통지하여야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 제1항의 규정에 따른 약관의 변경내용이 게시되거나
                      통지된 후부터 변경되는 약관의 시행일 전 영업일까지
                      전자금융거래의 계약을 해지할 수 있다.&nbsp;단 전단의 기간
                      안에 이용자의 이의가 회사에 도달하지 않으면 이용자가 이를
                      승인한 것으로 본다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 27조 약관적용의 우선순위&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사와 이용자 사이에 개별적으로 합의한 사항이 이 약관에
                      정한 사항과 다를 때에는 그 합의사항을 이 약관에 우선하여
                      적용한다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >전자금융거래에 관하여 이 약관에 정하지 않은 사항은
                      개별약관이 정하는 바에 따른다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이 약관과 전자금융거래에 관한 개별약관에 정하지 않은
                      사항에 대하여는 다른 약정이 없으면 「전자금융거래법」등
                      관계법령,&nbsp;예금거래기본약관 및
                      은행여신거래기본약관(가계용/기업용)을 적용한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 28조 이의제기 및 협조&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 전자금융거래의 처리에 관하여 이의가 있을 때에는
                      회사의 분쟁처리기구에 그 해결을 요구하거나 금융감독원
                      금융분쟁조정위원회,&nbsp;한국 소비자보호원
                      소비자분쟁조정위원회 등을 통하여 분쟁조정을 신청할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 회사의 본점이나 영업점 또는 회사의
                      분쟁처리기구에 이의를 제기한 경우 회사 은&nbsp;15일 이내에
                      이에 대한 조사 또는 처리결과를 이용자에게 알려야
                      한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 손해배상 등 분쟁처리를 위한 분쟁처리책임자 및
                      담당자를 지정하고,&nbsp;그 연락처를 관련 인터넷 홈페이지에
                      게시하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 제20조 제1항에 정한 사고발생으로 인한 손해배상
                      등 분쟁처리와 관련한 회사의 사고조사 및 관계당국의 수사
                      또는 조사 절차에 협조하여야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 29조 준거법</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관의 해석,&nbsp;적용에 관하여는 대한민국법을
                    적용한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >부칙&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;1조 시행일&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관은 2021년 &nbsp;3월 &nbsp; 22일부터
                    시행한다.&nbsp;</span
                  ></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 코코뱅크 온라인서비스이용약관 -->
          <el-collapse-item title="코코뱅크 온라인서비스이용약관">
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;text-align:center;";'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >코코뱅크 온라인서비스이용약관</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;1조 적용범위&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관은 주식회사 코코뱅크(이하&nbsp;&ldquo;회사&rdquo;라
                    한다)와 회사가
                    제공하는&nbsp;&ldquo;코코뱅크온라인서비스&rdquo;(이하&nbsp;&ldquo;서비스&rdquo;라
                    한다)를 이용하는 이용자(이하&nbsp;&ldquo;이용자&rdquo;라
                    한다)&nbsp;사이의 서비스 이용에 관한 모든 사항을 정함을
                    목적으로 한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;2조 용어의 정의</span
                    ></strong
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관에서 사용하는 용어의 의미는 다음 각호와
                    같다.&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >스마트기기&rdquo;란
                      스마트폰,&nbsp;태블릿&nbsp;PC&nbsp;등과 같이
                      유무선네트워크,&nbsp;통신망 등을 통해 회사가 제공하는
                      서비스를 접속하여 이용할 수 있는 기기를
                      말한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >&ldquo;</span
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자 아이디 및 이용자 비밀번호&rdquo;란 서비스 접속을
                      위한 이용자 식별 정보로서 서비스 계약 시 이용자가
                      신청한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >기타 이 약관에서 사용하는 용어의
                      정의는&nbsp;&ldquo;전자금융거래기본약관&rdquo;이 정하는
                      바에 의한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;3조 전자적 장치&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 다음의 전자적 장치를 통하여 서비스를 이용할 수
                      있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >인터넷뱅킹 :&nbsp;컴퓨터(PC),&nbsp;휴대폰,
                      TV,&nbsp;스마트기기 등&nbsp;</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 서비스 신청 시 전자적 장치를 선택할 수
                      있으며,&nbsp;서비스를 통해 변경할 수 있다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;4조 서비스 종류&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >회사가 제공하는 서비스는 인터넷뱅킹을 통한
                    각종조회,&nbsp;자금이체,&nbsp;계좌신규 및
                    해지,&nbsp;대출,&nbsp;환전,&nbsp;사고신고,&nbsp;공과금납부
                    등의 서비스이며,&nbsp;구체적인 서비스 내용은 전자적 장치를
                    통해 게시한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;5조 서비스 신청</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 회사에 회원가입신청을 한 후,&nbsp;전자금융거래
                      기본약관과 이 약관의 내용에 동의한 경우 서비스 이용계약이
                      성립된다.</span
                    ></li
                  >
                  <li
                    ><span style="background:white;"
                      >서비스 이용 신청에 다음 각 호의 사유가 있는
                      경우,&nbsp;신청에 대해 승낙을 하지 않거나 사후에 서비스
                      이용계약을 해지할 수 있다.</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:11.0pt;"
                      >이용자의&nbsp;본인 확인이 안 되거나 타인의 명의를 이용한
                      경우</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >허위 정보의 기재 또는 신청 내용을 정확히 기재하지 않거나
                      오기 등이 있는 경우</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >대리인이 개인인 이용자 본인을 대리하여 신청하는
                      경우</span
                    ></li
                  >
                  <li
                    ><span style="font-size:11.0pt;"
                      >범죄 또는 불법&middot;탈법행위를 목적으로 서비스를
                      신청하였거나 서비스를 범죄 또는 불법&middot;탈법행위에
                      이용하는 경우</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="background:white;"
                      >회사는 위의 사유로 인해 서비스 가입 승인을 유보하거나
                      가입 후 서비스 이용계약을 해지하는 경우,&nbsp;부득이한
                      사유가 없는 한&nbsp;이용자에게 적절한 방법으로 알리는 것을
                      원칙으로 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;6조 이용자 확인방법</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사는 다음 각 호의 본인확인 방법의 전부 또는 일부가
                      사전에 회사에 등록된 자료와 일치할 경우에 본인으로
                      인정하고 서비스를 제공한다.</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:48px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자 아이디,&nbsp;비밀번호</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >그 외에 준하는 방법</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 제1항에 따라 등록한 수단을 회사가 별도로 정하는
                      절차에 따라 변경 또는 갱신할 수 있다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;7조 계좌이체 한도</span
                    ></strong
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이용자의 통합이체한도는 없다.&nbsp;단,&nbsp;기타 세부사항은
                    회사가 정하는 바에 따른다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 8조 이용계좌 지정&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >출금,&nbsp;대출지정계좌 및 통지대상계좌는 반드시 이용자
                      명의의 코코뱅크 계좌로 지정하여야 한다.&nbsp;단,&nbsp;일부
                      서비스의 경우 이용계좌의 지정이 제한될 수 있다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 서비스를 통해 본인명의의
                      예금(이하&nbsp;&ldquo;근거계좌&rdquo;라 한다)에서 자금을
                      출금하여 예금 및
                      신탁계좌(이하&nbsp;&ldquo;연결계좌&rdquo;라 한다)를 신규할
                      수 있다.</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >연결계좌는 만기일에 자동으로 해지되어 근거계좌로
                      입금된다.&nbsp;단,&nbsp;담보제공되어 있거나 납입지연
                      등으로 자동해지시 이용자에게 불이익이 발생되는 경우에는
                      자동해지 되지 않을 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >연결계좌의 중도해지는 예금주가 직접 서비스를 통하여
                      해지하여야 한다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >연결계좌의 적립금 납입 및 이자지급은 자동이체 처리함을
                      원칙으로 하되,&nbsp;별도 서면 또는 전자적 장치로
                      자동이체를 해제할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >계좌를 보유한 이용자가 전자적 장치를 이용한 서비스에
                      가입한 경우 이용자의 예금계약을 해지하고자 할 때에는 통장
                      대신 전자적 장치를 이용하여 해지도
                      가능하다.&nbsp;이때,&nbsp;해지된 금액은 본인 계좌로
                      입금하여야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;color:red;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 9조 거래의 제한&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >다음 각호에 해당하는 경우에는 서비스의 전부 또는 일부를
                      제한할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:48px;list-style-type: decimal;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >회사 영업시간 종료 후 및 비영업일&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >사고신고 접수된 서비스</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >서비스가 제한된 이용자는 본인확인절차를 거친 후 서비스
                      재개를 신청할 수 있다.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 11조 수수료&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >수수료는&nbsp;[별표&nbsp;1]과 같으며,&nbsp;각종 서비스
                    종료와 동시에 이용자의 인출계좌에서 자동 출금하기로
                    한다.&nbsp;단,&nbsp;회사에서 지정한 일부 서비스는 매월
                    일정한 날에 이용자가 지정한 계좌에서 자동 출금하기로
                    한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;12조 거래내용의 확인&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이용자는 거래지시와 처리결과가 일치하는지 여부를 확인하여야
                    하며,&nbsp;통신장애 등의 사유로 인하여 처리결과를 확인하지
                    못한 경우에는 재접속을 하여 정상처리 여부를 확인하여야
                    한다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;13조 서비스
                      정지,&nbsp;해지,&nbsp;변경,&nbsp;사고신고&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >서비스 이용수수료를 회사에서 정한 기한 내에 납부하지 않을
                      경우 회사는 서비스를 정지할 수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자는 서비스 또는 영업점을 통해 서비스 계약을 해지할
                      수 있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >이용자가 이용자비밀번호 등 비밀번호를 변경하고자 하는
                      경우에는 전자적 장치를 이용하여 변경할 수
                      있다.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span style="font-size:15px;line-height:107%;"
                      >분실,&nbsp;도난 및 각종 비밀번호 누설 등 사고발생시에는
                      즉시 거래 영업점에 서면 또는 전자적 장치를 통하여
                      신고하여야 한다.&nbsp;그러나 긴급하거나 부득이한 경우에는
                      전화 등으로 신고할 수 있으며 이 경우 다음 영업일 중
                      서면으로 신고하여야 한다.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;14조 준용 규정 및 약관변경&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관에서 정하지 아니한 사항은 전자금융거래기본약관에
                    따른다.</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제 15조 분쟁조정&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관과 관련한 소소의 관할법원은 민사소송법상
                    관할법원으로 한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >부칙&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관은 2021년 &nbsp;3&nbsp;월 &nbsp;22&nbsp;일부터
                    시행한다.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;">[</span
                  ><span style="font-size:15px;line-height:107%;"
                    >별표 1]&nbsp;이체수수료&nbsp;</span
                  ></p
                >
                <div
                  align="center"
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <table style="border-collapse:collapse;border:none;">
                    <tbody>
                      <tr>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border: 1pt solid windowtext;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">구분</span></p
                          >
                        </td>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border-top: 1pt solid windowtext;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: none;border-image: initial;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;"
                              >코코뱅크로&nbsp;</span
                            ></p
                          >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">보낼 때</span></p
                          >
                        </td>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border-top: 1pt solid windowtext;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: none;border-image: initial;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;"
                              >타 지갑으로&nbsp;</span
                            ></p
                          >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">보낼 때</span></p
                          >
                        </td>
                      </tr>
                      <tr>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border-top: none;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: 1pt solid windowtext;border-image: initial;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">인터넷뱅킹</span></p
                          >
                        </td>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border-top: none;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: none;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">무료</span></p
                          >
                        </td>
                        <td
                          style="padding: 0 5.4pt;vertical-align: top;border-top: none;border-right: 1pt solid windowtext;border-bottom: 1pt solid windowtext;border-left: none;"
                        >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">12,000</span
                            ><span style="font-size:15px;"
                              >원에 상응하는</span
                            ></p
                          >
                          <p
                            style='margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;font-size:13px;line-height:normal;text-align:center;";'
                            ><span style="font-size:15px;">코인의 개수</span></p
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:38.0pt;font-size:13px;line-height:107%;";'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <div
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                >
                  <ul
                    style="margin-bottom:0;margin-left:28px;list-style-type: undefined;"
                  >
                    <li
                      style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-size:13px;line-height:107%;";'
                      ><span style="font-size:15px;line-height:107%;"
                        >기타 세부기준은 회사가 정하는 바에 따른다.</span
                      ></li
                    >
                  </ul>
                </div>
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
          <!-- 이용자 정보 수집 및 환전 서비스 이용약관 및 동의서 -->
          <el-collapse-item
            title="이용자 정보 수집 및 환전 서비스 이용약관 및 동의서"
          >
            <PerfectScrollbar class="scroll">
              <div class="content">
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><strong
                    ><span style="font-size:19px;line-height:107%;"
                      >이용자 정보 수집 및 환전 서비스 이용약관 및 동의서</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >1</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 적용범위</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >본 약관은&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;">&lsquo;</span
                  ><span style="font-size:15px;line-height:107%;">코코뱅크</span
                  ><span style="font-size:15px;line-height:107%;">&rsquo;(</span
                  ><span style="font-size:15px;line-height:107%;"
                    >이하&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;">&lsquo;</span
                  ><span style="font-size:15px;line-height:107%;">회사</span
                  ><span style="font-size:15px;line-height:107%;">&rsquo;)</span
                  ><span style="font-size:15px;line-height:107%;">와&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;">&lsquo;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >회사가 제공하는 환전 서비스를 이용하는 이용자</span
                  ><span style="font-size:15px;line-height:107%;">&rsquo;(</span
                  ><span style="font-size:15px;line-height:107%;"
                    >이하&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;">&lsquo;</span
                  ><span style="font-size:15px;line-height:107%;">이용자</span
                  ><span style="font-size:15px;line-height:107%;"
                    >&rsquo;)&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >사이에 적용됩니다</span
                  ><span style="font-size:15px;line-height:107%;">.&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >이 약관에서 정하지 않은 사항은 이용자정보처리방침 및
                    예금거래기본약관을 적용합니다</span
                  ><span style="font-size:15px;line-height:107%;">.</span></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >2</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 약관의 교부</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >,&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >설명 및 효력 변경&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul
                  class="decimal_type"
                  style="margin-left:30px;list-style-type: undefined;"
                >
                  <li
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >본 약관의 사본을 회사의 이용약관 페이지에서 전자적인
                      문서의 형태로 이용자에게 제공합니다</span
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >.&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이는 본 약관을 개정할 때에도 해당합니다</span
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >이용자가 본 약관에 동의함으로써 본 약관의 효력이
                      발생합니다</span
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >회사는 고객이 약관의 내용에 대한 설명을 요청하는 경우
                      다음 각 호의 어느 하나의 방법으로 고객에게 약관의
                      중요내용을 설명하여야 합니다</span
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;'
                      ><br />
                      <span style="color:black;background:white;"
                        >1.&nbsp;</span
                      ></span
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >고객에게 직접 설명</span
                    ><span
                      style='font-family:"맑은 고딕";font-size:15px;line-height:107%;'
                      ><br />
                      <span style="color:black;background:white;"
                        >2.&nbsp;</span
                      ></span
                    ><span
                      style='font-family:"맑은 고딕";font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >전자적 장치를 통하여 고객이 알기 쉽게 표시하고
                      고객으로부터 해당 내용을 충분히 인지하였다는 의사표시를
                      수기로 작성하여 수령&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style="font-size:15px;line-height:107%;background:white;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >3</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 이용계약의 성립&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >본</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >약관에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >동의한다는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >의사표시를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >함으로써</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >환전서비스를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >신청합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >만</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;19</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >세</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >미만의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">이용</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >신청하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">경우</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >제한됩니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:40.0pt;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >4</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 이용자정보의 수집 및 관리</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >회원가입</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >보안인증</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >및</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >서비스를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">위해</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >아래의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용자정보를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >수집할</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >필요</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >시에는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >아래와</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >같이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >이용자정보를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >수집합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >수집목적</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >:&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >회원가입</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >보안인증</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">및</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >서비스를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >위한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >정보제공</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >환전내역</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >수집</span
                    ></li
                  >
                  <li
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >필수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >수집</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >항목</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >:&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >성명</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >전화번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >,&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >신분증번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >(</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >주민등록번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >,&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >여권번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >외국인등록번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">등</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >),&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >주소</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >,&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >아이디</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >이메일</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >보유</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용기간</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >:&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >최대</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >5</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >년</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span style="line-height:107%;color:red;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >동의를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >거부할</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >권리가</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >.&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >다만</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >,&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >동의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >거부</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >시</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >서비스를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >이용할</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >&nbsp;</span
                    ><span style="line-height:107%;color:red;background:white;"
                      >없습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:red;background:white;'
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >제</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:yellow;'
                      >5</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >조</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >보안인증</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;'
                      >&nbsp; &nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;'
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >회사의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >회원이어야</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >하며</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >거래</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >시</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >보안등급</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >인증이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >완료되어</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >있어야</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >이용자의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >보안등급에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >따라</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >가능</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >금액이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >제한될</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">수</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >6</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 이용자정보사용에 대한 동의 및 이용신청의 승낙</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용자정보를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >서비스</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >제공을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >위한</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >목적으로만</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >회사가</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >요구하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">모든</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >절차를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >수행하여</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용신청을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >승낙할</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >수</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >다음</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >각호에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >해당하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용신청에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >대하여는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >승낙을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >유보할</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >설비에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >여유가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">없는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >기술상</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >지장이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">있는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >기타</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >회사의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >사정상</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용승낙이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >곤란한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >다음</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >각호에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >해당하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용신청에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >대하여는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">이를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >승낙하지</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >아니할</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >수</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >있습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >실명이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >아닌</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >경우</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >타인의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >명의를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >사용하여</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >신청한</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >경우</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >만</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >19</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >세</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >미만의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >신청하는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >기타</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >정상적인</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >진행에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >심각한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >장애를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >유발한다고</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >관리자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >인정하는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >코코뱅크가</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >보유하고</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">있지</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >않은</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >암호자산</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >및</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >통화를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >요청하였을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">경우</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >제공한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자정보를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >서비스</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >운영을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >위한</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">목적</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이외의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >용도로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >사용하거나</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용자의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >동의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">없이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >제</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >3</span
                    ><span style="font-size:11.0pt;background:white;"
                      >자에게</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >제공하지</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >않습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >단</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >,&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">다음</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >각</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">호의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >경우에는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >예외로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <ol style="margin-left:52.55px;list-style-type: decimal;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >법령에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >근거하여</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용자정보의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용과</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">제</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >3</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >자에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">대한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >정보제공을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >허용하고</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >경우</span
                    ></li
                  >
                </ol>
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용자정보를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >보호하기</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">위해</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자정보처리방침을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >수립하고</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;'
                      >&nbsp;</span
                    ><span
                      style="font-size:15px;line-height:107%;background:white;"
                      >이용자정보</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >보호</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >책임자를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >지정하여</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">이를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >게시하고</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >운영합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:12.0pt;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:12.0pt;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >7</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >조 환전 수수료 및 이용한도</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >이용자에게</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >서비스를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >이용하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >대가로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >수수료를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >부과합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >수수료는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >환전하고자</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >하는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >암호자산</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >및</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >통화에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >따라</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >달라집니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용한도는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용할</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">때</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자들에게</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >개별적으로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >부여되는</span
                    ><span style="font-size:15px;">&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >한도액을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >말하며</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >보안등급에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">따라</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >달라집니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >본</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >통해</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >암호자산</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >또는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">현금</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >(KRW)&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전만</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >가능합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >8</span
                    ></strong
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >조 적용환율&nbsp;</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                    >&nbsp;</span
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >다이렉트</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >현장환전의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">환율</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >적용</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >시점은</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >QR</span
                    ><span style="font-size:11.0pt;background:white;">코드</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >영수증을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >회사에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >제출하여</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >처리하는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >시점입니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >암호자산의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">가격</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >변동성을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이해하며</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">거래</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >완료</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">즉후</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환율</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >변동이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있음을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >인정합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >제&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >9</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >조 환전거래의 변경</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >,&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;background:yellow;"
                      >취소</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span style="font-size:15px;line-height:107%;"
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >거래</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >완료</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >즉후</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >,&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >회사의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >귀책사유가</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >아닌</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >그</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >모든</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >사유로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >인한</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >거래</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >변경</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >또는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >취소를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >신청할</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">수</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >없습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >.</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >잘못된</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">계좌</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >및</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >지갑주소</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >작성으로</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >환전금액이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >회사에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >정상적으로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >전달</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >(</span
                    ><span style="font-size:11.0pt;background:white;">배송</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >)</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >되지</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">않는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >것에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">따른</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >거래</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">변경</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >또는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >취소를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >할</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >없으며</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이에</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >따라</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >발생한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >손해는</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">해당</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이용자가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">모든</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >책임을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >집니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >제</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:yellow;'
                      >&nbsp;10</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >조</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:yellow;"
                      >부가서비스</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >서비스</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >완료</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >후</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >이용자</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >전화번호</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >문자메세지로</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >&nbsp;TXID</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >제공합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >이용자의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >잘못된</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >전화번호를</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >제공함에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >있어</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;TXID&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:yellow;"
                      >수령을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">못</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >받을</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;">시</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >,&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >회사는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:yellow;"
                      >책임이</span
                    ><span
                      style="font-size:11.0pt;color:black;background:yellow;"
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:yellow;"
                      >없습니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:yellow;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >문자</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >수령</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >요금은</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >무료입니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.&nbsp;</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span
                    style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:white;"
                      >제</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:white;'
                      >&nbsp;11</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:white;"
                      >조</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:white;"
                      >서비스</span
                    ></strong
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ></strong
                  ><strong
                    ><span
                      style="font-size:15px;line-height:107%;color:black;background:white;"
                      >유의사항</span
                    ></strong
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><strong
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-size:15px;line-height:107%;background:white;'
                      >&nbsp;</span
                    ></strong
                  ></p
                >
                <ul style="margin-left:30px;list-style-type: undefined;">
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >회사가</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >제공하는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >서비스와</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >관련하여</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >,&nbsp;</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >다음</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >각</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">호의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >사항을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >충분히</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >이해하고</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >숙지한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >후</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >서비스를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용하여야</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >이용자는</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >암호자산</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">및</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >가상화폐의</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">가격</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >변동성에</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">대해</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >충분히</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이해했으며</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">거래</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >완료</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">즉후</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환율</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >변동이</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">수</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >있음을</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >숙지한</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >후</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">환전</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >서비스를</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >이용하여야</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >합니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >.&nbsp;</span
                    ></li
                  >
                  <li
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;line-height:107%;color:black;'
                      >QR</span
                    ><span
                      style="line-height:107%;color:black;background:white;"
                      >코드가</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >찍힌</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >영수증의</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >유효시간은</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">당일</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >환전</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;">마감</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >&nbsp;</span
                    ><span
                      style="font-family:NanumSquareRoundEB;font-size:11.0pt;line-height:107%;color:black;background:white;"
                      >시간</span
                    ><span
                      style="font-size:11.0pt;color:black;background:white;"
                      >&nbsp;</span
                    ><span style="font-size:11.0pt;background:white;"
                      >전까지입니다</span
                    ><span
                      style='font-family:"NanumSquareRoundEB",serif;font-family:"NanumSquareRoundEB",serif;font-size:11.0pt;line-height:107%;color:black;background:white;'
                      >.</span
                    ></li
                  >
                </ul>
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:justify;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><span style="font-size:15px;line-height:107%;"
                    >본인은 본 약관의 내용에 대해 충분한 안내를 받았고
                    숙지하였으며&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><span style="font-size:15px;line-height:107%;"
                    >회사가 제공하는 환전 서비스에 동의합니다</span
                  ><span style="font-size:15px;line-height:107%;"
                    >.&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;[ &nbsp;&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >동의합니다&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;">]</span></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >아이디&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >: &nbsp; &nbsp; &nbsp;&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;">이름</span
                  ><span style="font-size:15px;line-height:107%;"
                    >: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >이메일&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >:&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >생년월일&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;">주소</span
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;:&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >핸드폰 번호&nbsp;</span
                  ><span style="font-size:15px;line-height:107%;"
                    >:&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;">날짜</span
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;:&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;">서명</span
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; (</span
                  ><span style="font-size:15px;line-height:107%;"
                    >서명 또는 인</span
                  ><span style="font-size:15px;line-height:107%;"
                    >) &nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:center;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
                <p
                  style='margin-top:0;margin-right:0;margin-bottom:8.0pt;margin-left:0;font-family:"맑은 고딕",sans-serif;font-size:13px;line-height:107%;text-align:left;'
                  ><span style="font-size:15px;line-height:107%;"
                    >&nbsp;</span
                  ></p
                >
              </div>
            </PerfectScrollbar>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- main 끝 -->
  </div>
</template>

<style lang="scss" module>
// @import '@design';
</style>

<style>
.policy-wrap {
  padding: 40px 0;
}
.policy-wrap .el-collapse-item__header {
  padding-left: 20px;
  background-color: #f4f7ff !important;
  border-bottom: 1px solid #e9e9e9 !important;
}
.policy-wrap .scroll {
  height: 500px;
}
.policy-wrap .scroll .content {
  padding: 13px 24px 0 !important;
}
tr,
td {
  border-bottom: 1px solid #000;
}
</style>
