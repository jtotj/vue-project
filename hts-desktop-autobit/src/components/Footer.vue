<template>
  <div>
    <footer>
      <section class="coinUseArea">
        <div class="container">
          <strong>{{ $t('footer.footer_msg') }}</strong>
          <p>{{ $t('footer.footer_sub_msg') }}</p>
        </div>
      </section>
      <el-collapse accordion>
        <div class="container">
          <el-collapse-item style="display:none;">
            <template slot="title">
              <ul class="footerMenu" >
                <li>
                  <a href="https://c2c.gix.zone/" target="_blank">
                    {{$t('footer.c2c')}}
                  </a>
                </li>
                <li>
                 <a @click="handleSetTrade('MARGIN','index')">
                          {{$t('footer.margin_exchange')}}
                  </a>                 
                </li>
                <li>
                 <a @click="handleSetTrade('FUTURES','index')">
                        {{ $t('footer.gift_exchange') }}
                  </a>
                </li>
                 <li>
                  <a href="https://binary.gix.zone" target="_blank">
                    {{ $t('footer.Binary') }}
                  </a>
                </li>
                <li>
                  <a href="http://c2c.gix.zone/policy/service" target="_blank">
                    {{ $t('footer.term') }}
                  </a>
                </li>
              </ul>
            </template>
            <ul>
              <li>
                <ul>
                  <li></li>
                  <li>
                    <a href="http://c2c.gix.zone/create-ads/buy" target="_blank">
                      {{ $t('footer.buy') }}
                    </a>
                  </li>
                  <li>
                    <a href="http://c2c.gix.zone/create-ads/sell" target="_blank">
                      {{ $t('footer.sell') }}
                    </a>
                  </li>
                  <!-- <li>
                    <a href="http://c2c.gix.zone/create-ads/buy" target="_blank">
                      {{ $t('footer.buy_sell') }}
                    </a>
                  </li> -->
                </ul>
              </li>         
              <li>
                <ul>
                  <li>
                    <a @click="handleSetTrade('MARGIN','traderoom')">
                        {{ $t('footer.exchange') }}
                    </a>
                  </li>
                  <li>
                    <a @click="handleSetTrade('MARGIN','invest')">
                       {{ $t('footer.transfer_record') }}
                    </a>
                  </li>
                  <li>
                     <a @click="handleSetTrade('MARGIN','fee')">
                       {{ $t('fee_guide') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                  <a @click="handleSetTrade('FUTURES','traderoom')">
                        {{ $t('footer.exchange')}}
                    </a>
                  </li>
                  <li>
                    <a @click="handleSetTrade('FUTURES','invest')">
                        {{ $t('footer.transfer_record') }}
                    </a>
                  </li>
                  <li>
                    <a @click="handleSetTrade('FUTURES','myinfo')">
                        {{ $t('footer.Leverage') }}
                    </a>
                  </li>      
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <a href="https://app.binary.gix.zone/" target="_blank">
                       {{ $t('footer.live_exchange') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://app.binary.gix.zone/" target="_blank">
                       {{ $t('footer.demo_exchange') }}
                    </a>
                  </li>
                  <li>
                    <a href="https://binary.gix.zone/mass_meeting?act=dispPlatformTournamentList" target="_blank">
                       {{ $t('footer.contest') }}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <ul>
                  <li>
                    <a href="https://c2c.gix.zone/policy/privacy" target="_blank">
                      {{ $t('footer.privacy') }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </el-collapse-item>
        </div>
      </el-collapse>
      <div class="container">
        <div class="textBox">
          <p class="danger">
            {{ $t('footer.law_warn') }}
            {{ $t('footer.law_1') }}
          </p>
          <p class="danger">{{ $t('footer.law_2') }}</p>
          
        </div>
        <div class="footerLogo">
            <img src="~assets/img/autobitlogo_w.png" alt="풋터로고" />
          </div>
      </div>
      <div class="copy">
        <div class="container">
          <p>ⓒ GIX Pty Ltd</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import 'assets/css/footer_renewal_pc.css';
import { mapState } from 'vuex';
export default {
  name: 'Footer',
  computed: {
    ...mapState(['common']),
  },
  methods: {
    alert() {
      window.alert(
        this.common.locale === 'ko-KR'
          ? '현재 국가에서 지원하지 않는 서비스 입니다.'
          : 'Comming Soon'
      );
    },
    serviceAlert() {
      const message =
        this.common.locale === 'ko-KR'
          ? '서비스 준비중입니다.'
          : 'Comming Soon';
      window.alert(message);
    },
    handleSetTrade(type, title) {
      this.$store.dispatch('setTradeMethod', type)
      this.$router.push({name: title, query: { trade: type }})
    },
  },
};
</script>
