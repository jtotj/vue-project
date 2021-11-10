<script>
export default {
  name: 'PayMain',
  page: {
    title: 'PayMain',
    meta: [
      {
        name: 'description',
        content: 'PayMain',
      },
    ],
  },
  data() {
    return {
      activeName: 'first',
    }
  },
}
</script>

<template>
  <div>
    <div class="pay-container paymain">
      <div class="month-list">
        <div class="top-tit">
          <h4
            >{{ $t('cocopay.month_current') }}<br /><span class="balan"
              >1,000,000,000,000</span
            ><span>CCF</span></h4
          >
          <div class="line"></div>
        </div>
        <el-tabs type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('cocopay.trade_stat')">1</el-tab-pane>
          <el-tab-pane :label="$t('cocopay.settle_cal')">2</el-tab-pane>
          <el-tab-pane :label="$t('cocopay.appro_cal')">3</el-tab-pane>
          <el-tab-pane :label="$t('cocopay.trans_his')">4</el-tab-pane>
        </el-tabs>
      </div>
      <div class="quick-menu-wrap">
        <h4>{{ $t('cocopay.quick_menu') }}</h4>
        <div class="line"></div>
        <div class="quick-menu">
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-1.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-1-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('header.shop_info') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-2.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-2-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('header.calculation_account_list') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-3.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-3-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('one_one_inquiry') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-4.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-4-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('service_center.contact_history') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-5.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-5-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('cocopay.q_mailcert') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-6.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-6-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('cocopay.q_otp') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-7.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-7-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('cocopay.q_seculevel') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-8.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-8-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('my_page.auth_withdraw_address') }}</p>
          </router-link>
          <router-link :to="{ name: '' }" class="btn-quick">
            <div class="q-img">
              <img src="@assets/img/pay-img/btn-quick-9.png" alt="" />
              <img
                class="q-img-hover"
                src="@assets/img/pay-img/btn-quick-9-hov.png"
                alt=""
              />
            </div>
            <p>{{ $t('frequently_asked_questions') }}</p>
          </router-link>
        </div>
      </div>
      <div class="bot-con-wrap">
        <div class="rt-notice bot-con">
          <div class="title">
            <h4>공지사항</h4>
            <router-link :to="{ name: '' }" class="btn-more">
              <img src="@assets/img/pay-img/btn_more.png" alt="" />
            </router-link>
          </div>
          <div class="line"></div>
          <div class="notice">
            <router-link :to="{ name: '' }">
              <p
                ><strong>[공지사항]</strong> 공지사항입니다. 공지사항입니다.
                공지사항입니다. 공지사항입니다. 공지사항입니다. 공지사항입니다.
              </p>
            </router-link>
            <router-link :to="{ name: '' }">
              <p><strong>[공지사항]</strong> 공지사항입니다.</p>
            </router-link>
            <router-link :to="{ name: '' }">
              <p><strong>[공지사항]</strong> 공지사항입니다.</p>
            </router-link>
            <router-link :to="{ name: '' }">
              <p><strong>[공지사항]</strong> 공지사항입니다.</p>
            </router-link>
            <router-link :to="{ name: '' }">
              <p><strong>[공지사항]</strong> 공지사항입니다.</p>
            </router-link>
          </div>
        </div>
        <div class="lf-banner bot-con">
          <img src="@assets/img/pay-img/img-banner-1.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
