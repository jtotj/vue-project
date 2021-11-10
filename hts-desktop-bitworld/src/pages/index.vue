<template>
    <main class="index-main">
        <div class="visual">
            <div class="main_visual01">
                <div class="main_visual_text">
                    {{ $t('main_title_1') }}
                    <p v-html="$t('main_title_2')" style="font-size: 19px; color: #fff; padding-top: 10px;"></p>
                    <img src="~assets/img/sl_button1.png" style="padding-top: 55px;">
                    <img src="~assets/img/sl_button2.png" style="padding-top: 55px; padding-left: 25px;">
                    <img src="~assets/img/sl_button3.png" style="padding-top: 55px; padding-left: 25px;">
                </div>
            </div>
        </div>
        <TopNotice>
            <span style="color: #fff; display: inline-block; margin-right: 20px;">{{ $t('news') }}</span>
        </TopNotice>
        <div class="price">
            <div class="wrapper">
                <div class="main_price">
                    <div class="price-item" v-for="asset in ticker_assets">
                        <em>{{ fromPairs(constants.asset.asset_codes)[asset] }} <span :class="asset_list[asset].today_vs > 0 ? 'up' : 'down'">{{ asset_list[asset].today_vs > 0 ? '+' : '' }}{{ asset_list[asset].percentage }}%</span></em>
                        <strong>{{ php.number_format(premiums[asset]) }} <span>CCE</span></strong>
                        <p>Vol: <span>{{ php.number_format(asset_list[asset].today_volume) }} {{ fromPairs(constants.asset.asset_codes)[asset].split('/')[0] }}</span></p>
                    </div>
                </div>
            </div>
        </div>
         <div class="btm_bnr1">
            <div class="wrapper">
                <div class="txt">
                    <p class="txt-inner"><br />
                        <span>{{ $t('section1_title') }}</span>
                        <br /> 
                        <br />
                        <br />
                        <span class="title-top" v-html="$t('btm_bnr1.title_top')"></span>
                        <br />
                        <span class="title-bottom">{{ $t('btm_bnr1.title_bottom') }}</span>
                        <ul class="support-list">
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item1') }}</li>
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item2')}}</li>
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item3')}}</li>
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item4')}}</li>
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item5')}}</li>
                          <li class="support-item"><span>✔</span>{{ $t('btm_bnr1.support_item6')}}</li>
                        </ul>
                       <!-- <img src="~assets/img/text1.png"> -->
                        <br />
                        <br />
                        <span v-if="!is_logged"><button @click.prevent="$router.push({ name: 'login' })">{{ $t('login') }}</button>  <button @click.prevent="$router.push({ name: 'join' })">{{ $t('membership') }}</button></span>
                    </p>
                    <div class="img">
                        <img src="~assets/img/hongkong1.png" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="info_area">
            <ul class="global_width">
                <li class="sp_main_before ico_info1">
                    <h4>{{ $t('index.select_coin') }}</h4>
                    <p v-html="$t('index.msg_select_coin_list')">       
                    </p>
                </li>
                <li class="sp_main_before ico_info2">
                    <h4>{{$t('section7_3')}}</h4>
                    <p>
                        <span v-html="$t('section7_3_1')"></span><br>
                        <span v-html="$t('section7_3_2')"></span>
                    </p>
                </li>
                <li class="sp_main_before ico_info3">
                    <h4>{{ $t('index.cs_one_year_one_day') }}</h4>
                     <p v-html="$t('index.cs_online_cs_one_to_one_cs')"></p>
                </li>
                <li class="sp_main_before ico_info4">
                    <h4>{{ $t('section7_1') }}</h4>
                    <p>
                        {{ $t('section7_1_1') }}<br>
                        <span v-html="$t('section7_1_2')"></span><br>
                        {{ $t('section7_1_3') }}
                    </p>
                </li>
                <li class="sp_main_before ico_info5">
                    <h4>{{$t('section7_2')}}</h4>
                    <p>
                        {{$t('section7_2_1')}}<br>
                        {{$t('section7_2_2')}}<br>
                        {{$t('section7_2_3')}}
                    </p>
                </li>
            </ul>
        </div>
        <div class="app_area">
            <div class="global_width">
                <h3 class="tit">{{ $t('index.cocofx_mobile_app_down') }}</h3>
                <p>{{ $t('index.use_aos_ios') }}</p>
                <ul class="ct">
                    <li>
                        <i class="sp_main ico_app_and"></i>
                        <span>{{ $t('index.aos_down') }}</span>
                        <button class="download_btn" @click="alert">{{ $t('index.down') }}</button>
                    </li>
                    <li>
                        <i class="sp_main ico_app_ios"></i>
                        <span>{{ $t('index.ios_down') }}</span>
                        <button class="download_btn" @click="alert">{{ $t('index.down') }}</button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="app_intro3" style="height: 338px;" v-if="0">
            <img src="~assets/img/main_foot_6.jpg" alt="">
        </div>
        
        <div v-if="0" class="contact">
            <div class="wrapper">
                <strong>{{ $t('enquire') }}</strong>
                <div class="ci_wrap">
                    <div class="contact-item">
                        <div class="ci-icon">
                            <i class="fa fa-map-marker"></i>
                        </div>
                        <div class="ci-title font-alt">Zip Cord</div>
                        <div class="ci-text">CENTRE194-204JOHNSTON</div>
                    </div>
                    <div class="contact-item">
                        <div class="ci-icon">
                            <i class="fa fa-map-marker"></i>
                        </div>
                        <div class="ci-title font-alt">Address</div>
                        <div class="ci-text">WAN CHAI HONG KONG</div>
                    </div>
                    <div class="contact-item">
                        <div class="ci-icon">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <div class="ci-title font-alt">Email</div>
                        <div class="ci-text">
                            <a href="mailto:support@cocofx.com">support@cocofx.com</a>
                        </div>
                    </div>
                </div>

                <div class="contact-form">
                    <div class="cf-left-col">
                        <div class="form-group">
                            <input type="text" name="name" id="name" class="input-md round form-control" :placeholder="$t('customer_name')" pattern=".3100" required="">
                        </div>
                        <div class="form-group">
                            <input type="email" name="email" id="email" class="input-md round form-control" placeholder="Email" pattern=".5100" required="">
                        </div>
                    </div>
                    <div class="cf-right-col">
                        <div class="form-group">
                            <textarea name="message" id="message" class="input-md round form-control" placeholder="Message"></textarea>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="btm_bnr">
            <div class="wrapper">
                <div class="txt">
                    <p v-html="$t('head_office_hongkong')"></p>
                    <div class="img">
                        <img src="~assets/img/Australia.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
        
        <modal ref="modal" v-if="0" name="hello-world" height="auto" :width="600">
            <img src="~assets/img/presignup.png" height="758" width="600" alt="">
            <ul class="order_btn">
                <li><button @click="$modal.hide('hello-world')" class="reset">{{ $t('close') }}</button></li>
                <li><button @click.prevent="openEventPage" class="buy">{{ $t('short_cut') }}</button></li>
            </ul>
        </modal>
    </main>
</template>

<style>
.index-main .guide { background-image: url(~assets/img/main_sl_back.png); }
.index-main .guide ul li:first-child { background-image: url(~assets/img/main_sl1.png) !important; }
.index-main .order_btn {display: table; width: 100%;}
.index-main .order_btn > li:first-child {padding-left: 0;}
.index-main .order_btn>li{height:40px;display:table-cell;position:relative}.order_btn>li>button.reset{background:#b0b0b0}
.index-main .order_btn>li>button{display:block;width:100%;height:100%;text-align:center;font-weight:700;font-size:13px;color:#fff}
.index-main .order_btn>li>button.buy,.order_control .order_btn>li>button.buyNow{background:#e95653}.main_price{display:flex;justify-content:space-between;align-items:center}
.index-main .price-item{box-shadow:0 2px 20px 0 rgba(0,0,0,.05);box-shadow:0 10px 38px -9px rgba(0,0,0,.13);transition:all .3s;width:200px;border-radius:3px;background:#fff;padding:15px 0 0 20px;margin-top:25px;box-sizing:border-box}
.index-main .price-item:hover{transform:translate3d(0,-10px,10px);box-shadow:0 10px 38px -9px rgba(0,0,0,.59)}

/*  */
.index-main .btm_bnr1 .txt { position: relative; }
.index-main .btm_bnr1 .txt .txt-inner { position: absolute; left: 0; top: 0; }
.index-main .btm_bnr1 .txt .title-top { font-size: 35px; letter-spacing: 1px; color: #111; }

.index-main .btm_bnr1 .txt .title-bottom { display: inline-block; width: 55%; padding-top: 20px; font-size: 35px; line-height: 1.2; color: #111;}
.index-main .btm_bnr1 .txt .blue-point {position: relative; color: #004576;}
.index-main .btm_bnr1 .txt .blue-point::after {content:''; position: absolute; left: 50%; top: 0px; width: 8px; height: 8px; border-radius: 50%; background-color: #004576; transform: translateX(-50%)}

.index-main .btm_bnr1 .txt .support-list { display: flex; flex-wrap: wrap; width: 60%; margin-top: 30px; }
.index-main .btm_bnr1 .txt .support-item { font-size: 20px; padding: 15px 30px 0 0; }
.index-main .btm_bnr1 .txt .support-item span { color: #0068C1; }
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import TopNotice from '@/components/TopNotice'
import _ from 'lodash'
import php from 'phpjs'

export default {
    name: 'index',
    components: { TopNotice },
    data () {
        return {
            tbHeadFixed: false,
            search_keyword: '',
            display_asset_code: false,
            sort_order: 'premium',
            order_type: 'DESC',
            showModal: true,
            ticker_assets: ['BTCKRW', 'ETHKRW', 'XRPKRW', 'ETCKRW', 'LTCKRW'],
        };
    },
    mounted() {
        this.$modal.show('hello-world');
    },
    methods: {
        handleScroll () {
            this.tbHeadFixed = window.scrollY > 92;
        },

        changeSort(sort_order) {
            if(sort_order != this.sort_order) {
                this.order_type = 'DESC';
            } else {
                this.order_type = this.order_type == 'DESC' ? 'ASC' : 'DESC';
            }

            this.sort_order = sort_order;
        },

        /**
         * @brief 사전가입신청
         */
        openEventPage() {
            window.open('//cocofx.com/CIBRequest?act=dispBoardWrite', 'FindAccount', 'width=800,height=1000');
        },
        alert() {
            window.alert('준비중입니다.')
        }
    },
    computed: {
        ...mapState({
            asset_settings: state => state.asset.settings,
            assets_statistics: state => state.asset.assets_statistics,
            premiums: state => state.asset.premiums,
            constants: state => state.common.constants,
        }),
        ...mapGetters(['is_logged', 'asset_list']),
        _() {
            return _;
        },
        php() {
            return php;
        },
        c_asset_list() {
            var asset_codes = this.fromPairs(this.constants.asset.asset_codes);
            return _.chain(this.constants.asset.assets).map(([asset, title]) => {
                var statistics = this.assets_statistics[asset];
                var asset_info = {
                    ...this.asset_settings[asset],
                    asset,
                    title,
                    yesterday_first: statistics.yesterday_first,
                    today_volume: statistics.today_volume,
                    percentage: (this.premiums[asset] / statistics.yesterday_first * 100 - 100).toFixed(2) * 1,
                    updown: statistics.yesterday_first > this.premiums[asset] ? 'down' : 'up',
                    asset_code: asset_codes[asset],
                    premium: this.premiums[asset],
                }

                if(asset_info.percentage === Infinity) asset_info.percentage = 0;

                // 캔들 계산
                var max_oc = ((statistics.today_first - this.premiums[asset]) > 0) ? statistics.today_first : this.premiums[asset];
                asset_info.line_css = {
                    height: Math.abs(((statistics.today_high - statistics.today_low) / 200 * 30)) + 1,
                    top: 30 - ((statistics.today_high + 100) / 200 * 30) + 1,
                }
                asset_info.plane_css = {
                    height: Math.abs(((statistics.today_first - this.premiums[asset]) / 200 * 30)) + 1,
                    top: 30 - ((max_oc + 100) / 200 * 30) + 1,
                }

                return asset_info;
            }).filter((asset_info) => {
                if(asset_info.is_active != 'Y') return false;

                if(!this.search_keyword.length) return true;

                if(!~asset_info.title.indexOf(this.search_keyword) && !~asset_info.asset.indexOf(this.search_keyword.toUpperCase())) {
                    return false;
                }

                return true;
            }).orderBy([this.sort_order], [this.order_type.toLowerCase()]).value();
        }
    },
    beforeMount () {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy () {
        window.removeEventListener('scroll', this.handleScroll);
    }
}
</script>
