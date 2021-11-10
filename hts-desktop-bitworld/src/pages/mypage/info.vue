<template>
<!-- pc -->
  <div class="cnt" v-loading="loading">
    <h3>{{ $t('mypage.myinfo') }}</h3>
    <div class="table_box" v-loading="apply_coupon_loading">
      <div class="info_wrap">
        <div class="info_box">
          <h2>{{ $t('mypage.email_registration_name') }}</h2>
          <dl>
            <dt>{{ $t('mypage.email') }} :</dt>
            <dd>{{ logged_info.email_address }}</dd>
            <dt>{{ $t('mypage.join') }} :</dt>
            <dd>{{ func.zdate(logged_info.regdate, 'Y-m-d') }}</dd>
            <dt>{{ $t('mypage.name') }} :</dt>
            <dd>{{ logged_info.user_name }}</dd>
          </dl>
        </div>
        <div class="info_change_box">
          <h2>{{ $t('mypage.nickname_pwd') }}</h2>
          <dt>{{ $t('mypage.nickname') }} :</dt>
          <dd>{{ logged_info.nick_name }}</dd>
          <dt>{{ $t('mypage.pwd_change') }}</dt>
          <dd v-if="modifybtn"><button type="button" class="chg_btn" @click="showPasswordForm" style="margin-top:-2px;">{{ $t('mypage.modification') }}</button></dd>
          <dd v-else>
            <p><input type="password" v-model="params.current_password" :placeholder="$t('mypage.pwd_currently')" class="nickname_chg" style="height:40px;"></p>
                <p><input type="password" v-model="params.password1" :placeholder="$t('mypage.pwd_new')" class="nickname_chg" style="height:40px;"></p>
                <p>
                  <input type="password" v-model="params.password2" :placeholder="$t('mypage.pwd_new_check')" class="nickname_chg" style="height:40px;">
                  <button type="button" class="chg_btn" @click.prevent="handleUpdateMemberPassword">{{ $t('mypage.change') }}</button>
                </p>
          </dd>
        </div>
      </div>
      <!-- 모바일 -->
      <div class="m-myinfo hide_desktop">
        <div class="myinfo-title">{{ $t('mypage.id_pwd_info') }}</div>
        <div class="myinfo-main">
          <div class="email">
            <span class="title-name">{{ $t('mypage.name') }}</span>
            <span class="title-des">{{ logged_info.user_name }}</span>
          </div>
          <div class="email">
            <span class="title-name">{{ $t('mypage.nickname') }}</span>
            <span class="title-des">{{ logged_info.nick_name }}</span>
          </div>
          <div class="email">
            <span class="title-name">{{ $t('mypage.email') }}</span>
            <span class="title-des">{{ logged_info.email_address }}</span>
          </div>
          <div class="email">
            <span class="title-name">{{ $t('mypage.join') }}</span>
            <span class="title-des">{{ func.zdate(logged_info.regdate, 'Y-m-d') }}</span>
          </div>
          <div class="pwd-box">
            <span class="pwd-name">{{ $t('mypage.pwd_change') }}</span>
            <span class="pwd-input">
              <p><input type="password" v-model="params.current_password" :placeholder="$t('mypage.pwd_currently')" class="nickname_chg"></p>
              <p><input type="password" v-model="params.password1" :placeholder="$t('mypage.pwd_new')" class="nickname_chg"></p>
              <p class="last-p" >
                <input type="password" v-model="params.password2" :placeholder="$t('mypage.pwd_new_check')" class="nickname_chg aa">
                <button type="button" class="chg_btn last-cha" @click.prevent="handleUpdateMemberPassword">{{ $t('mypage.change') }}</button>
              </p>
            </span>
          </div>
        </div>
        <div class="myinfo-title">{{ $t('mypage.etc_management') }}</div>
        <div class="myinfo-main">
          <div class="email">
            <span class="title-name">{{ $t('mypage.recommender_link') }}</span>
            <span class="title-des">
              <a href="#" @click.prevent="handleCopyReferalUrl" v-tooltip="$t('mypage.msg_link_copy')">{{ referal_url }}</a>
            </span>
          </div>
          <div class="email" v-if="hide_account">
            <span  class="title-msg"> ※ {{ $t('mypage.cmd_pc_version') }}</span>
         </div>
        </div>
      </div>
       <table v-if="!hide_account" style="border:1px solid #ccc;">
        <colgroup>
          <col width="200" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr class="hide_desktop">
            <th scope="row">{{ $t('mypage.nickname') }}</th>
            <td v-if="0" class="a_l">
              <input type="text" :value="logged_info.nick_name" class="nickname_chg">
              <button type="button" class="chg_btn">닉네임변경</button>
              <p class="tb_warning">2~12자, 특수문자/띄어쓰기 불가, 닉네임은 변경 시점으로부터 6개월 뒤 변경 가능합니다.</p>
            </td>
            <td class="a_l" v-else>{{ logged_info.nick_name }}</td>
          </tr> 
          <tr v-if="0">
            <th scope="row">회원 그룹</th>
            <td class="a_l">준회원</td>
          </tr>
          <tr v-if="0">
            <th scope="row">휴대폰</th>
            <td class="a_l">010-3333-7777</td>
          </tr>
          <tr>
            <th scope="row">{{ $t('mypage.recommender_link') }}</th>
            <td class="a_l">
              <a href="#" @click.prevent="handleCopyReferalUrl" v-tooltip="$t('mypage.msg_link_copy')">{{ referal_url }}</a>
            </td>
          </tr>
          <template v-if="s_account_info">
            <tr>
              <th scope="row">{{ $t('mypage.account_type') }}</th>
              <td class="a_l">{{ fromPairs(constants.account.account_types)[s_account_info.account_type] }}</td>
            </tr>
            <tr>
              <th scope="row">{{ $t('mypage.transaction_type') }}
                </th>
              <td class="a_l">{{ fromPairs(constants.account.trade_types)[s_account_info.trade_type] }}</td>
            </tr>
            <tr>
              <th scope="row">{{ $t('mypage.average') }}
                </th>
              <td class="a_l">
                <vue-slider style="float: left;" tooltip-dir="top" width="80%" :piecewise="true" formatter="1:{value}" :piecewiseLabel="true" :min="1" :data="c_available_leverages" tooltip="always" :max="account_setting.max_leverage" ref="slider" v-model="params.leverage"></vue-slider>

                
                <button style="margin-left: 15px;" type="button" class="chg_btn" @click.prevent="handleUpdateAccountLeverage">{{ $t('mypage.application') }}
                  </button>
              </td>
            </tr>
            <tr>
              <th scope="row">{{ $t('mypage.security_level') }}
                </th>
              <td class="a_l">{{ $t('mypage.lev1') }}
                </td>
            </tr>
            <tr>
              <th scope="row">{{ $t('mypage.promotion_code') }}
                </th>
              <td class="a_l">
                <masked-input v-model="coupon_code" style="font-family: monospace;" mask="####-####-####-####" :placeholder="$t('mypage.promotion_code_16')" class="nickname_chg" type="text" />
                <button type="button" class="chg_btn" @click.prevent="applyCouponCode">{{ $t('mypage.application') }}
                  </button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <th scope="row" colspan="2">{{ $t('mypage.msg_information_disclosure') }}
              </th>
          </tr>
        </tbody>
      </table> 
    </div>
    <div v-if="0" class="table_box col_50_left">
      <h4>회원님의 현재 거래수수료 (부가세 포함)</h4>
      <table>
        <colgroup>
          <col width="200" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">CCE 마켓</th>
            <td class="a_l">0.05%</td>
          </tr>
          <tr>
            <th scope="row">BTC 마켓</th>
            <td class="a_l">0.25%</td>
          </tr>
          <tr>
            <th scope="row">ETH 마켓</th>
            <td class="a_l">0.25%</td>
          </tr>
          <tr>
            <th scope="row">USDT 마켓</th>
            <td class="a_l">0.25%</td>
          </tr>
        </tbody>
      </table>
      <p>※ 페이백 할인이 진행 중인 경우, 화면에 표시된 거래수수료를 선 수취 후 할인 금액만큼을 회원님 계정으로 입금해 드립니다.</p>
      <a href="">거래수수료(부가세포함) 상세안내 ></a>
    </div>
    <div v-if="0" class="table_box col_50_right">
      <h4>이벤트 등 안내(이메일, SMS) 수신</h4>
      <table class="event_agree">
        <colgroup>
          <col width="200" />
          <col width="" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">이벤트 안내 수신 설정/거부</th>
            <td class="a_l">
              <label><input type="radio"><span>ON</span></label>
              <label><input type="radio"><span>OFF</span></label>
            </td>
          </tr>
        </tbody>
      </table>
      <p>※ 입출금 안내 등 중요한 고지사항은 이벤트 안내 수신 동의 여부와 관계없이 이메일로 발송됩니다.</p>
      <a href="" class="btn">수신 동의 설정 변경</a>
    </div>
  </div>
</template>
<style scoped>
@import '~assets/css/vue-slider.css';
.hide_desktop { display: none; }
.table_box table tbody tr:nth-child(even) { background:#fff !important;}
</style>

<script>
  import _ from 'lodash'
  /* import CommonLayout from './CommonLayout.vue' */
  import {
    mapGetters
  } from 'vuex'
  import func from '@/classes/func.inc'
  import MaskedInput from 'vue-masked-input'
  import {
    applyCouponCode
  } from '@/api/coupon'
  import {
    updateAccountLeverage
  } from '@/api/account'
  import {
    updateMemberPassword
  } from '@/api/member'
  import vueSlider from 'vue-slider-component/src/vue2-slider.vue'
  
  export default {
    name: 'info-mypage',
    components: {
      MaskedInput,
      vueSlider,
     /*  components: { CommonLayout }, */
    },
    props: ['hide_account'],
    data() {
      return {
        func,
        apply_coupon_loading: false,
        coupon_code: '',
        params: {},
        loading: false,
        modifybtn: true
      }
    },
    computed: {
      ...mapGetters(['logged_info', 's_account_info', 'constants', 'account_setting']),
      c_available_leverages() {
        return _.filter(this.constants.account.leverages, ([key, title]) => {
          return key <= this.account_setting.max_leverage;
        }).map(([key]) => key);
      },
      referal_url() {
        const {
          protocol,
          host
        } = window.location;
        const {
          user_id = ''
        } = this.logged_info || {};

        return `${protocol}//${host}/@${user_id}?to_name=join`;
      }
    },
    mounted() {
      this.params = {
        leverage: this.s_account_info ? this.s_account_info.leverage : 1,
      }
    },
    watch: {
      s_account_info({
        leverage = 1
      } = {}) {
        this.params = {
          leverage,
        };
      },
    },
    methods: {
      applyCouponCode() {
        this.apply_coupon_loading = true
        applyCouponCode({
          account_srl: this.s_account_info.account_srl,
          coupon_code: this.coupon_code.replace(/[^A-Z0-9]/g, '')
        }).then(() => {
          this.$toasted.info(this.$t('mypage.msg_promotion_success'));
          this.coupon_code = '';
          this.apply_coupon_loading = false;
        }).catch(() => {
          this.apply_coupon_loading = false;
        })
      },
      handleCopyReferalUrl() {
        this.$copyText(this.referal_url)
          .then(() => this.$toasted.success(this.$t('mypage.msg_recommender_link_copy')))
          .catch(() => this.$toasted.error(this.$t('mypage.msg_drag_copy')))
      },
      handleUpdateMemberPassword() {
        this.loading = true;
        return updateMemberPassword(this.params)
          .then(() => {
            this.loading = false;
            this.$toasted.info(this.$t('mypage.msg_pwd_change'));
            this.params = {
              ...this.params,
              current_password: '',
              password1: '',
              password2: '',
            }
            this.modifybtn = !this.modifybtn;
          }).catch(() => {
            this.loading = false;
          })
      },
      handleUpdateAccountLeverage() {
        this.loading = true;
        return updateAccountLeverage(this.s_account_info.account_srl, this.params.leverage)
          .then(({
            message
          }) => {
            this.loading = false;
            this.$toasted.info(message);

            return this.$store.dispatch('getAccounts');
          })
          .catch(() => {
            this.loading = false;
          })
      },
      showPasswordForm() {
        this.modifybtn = !this.modifybtn;
      }
    }
  }

</script>
