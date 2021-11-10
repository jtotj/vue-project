<script>
import { mapGetters, mapState } from 'vuex'

export default {
  page: {
    title: 'b2c-main',
    meta: [{ name: 'description', content: 'b2c-main' }],
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapGetters('auth', ['loggedIn']),
  },
  methods: {
    tradeLink() {
      if (window.screen.width < 768) {
        this.$router.push({ name: 'exchange-order' })
      } else this.$router.push({ name: 'exchange' })
    },
  },
}
</script>

<template>
  <div class="b2c-contents">
    <section :class="[$style.banner]">
      <div :class="[$style.container]">
        <div :class="[$style.textBox]">
          <p :class="[$style.first]"> {{ $t('fast_stable_deal') }} </p>
          <p :class="[$style.second]"> {{ $t('cryptocurrency_exchange') }} </p>
          <ul :class="[$style.buttonArea, $style.clear]">
            <li>
              <button @click="tradeLink"> {{ $t('go_transaction') }} </button>
            </li>
            <li v-if="!loggedIn">
              <button
                @click="
                  $router.push({
                    name: 'register',
                    query: { redirectFrom: 'b2c-main' },
                  })
                "
              >
                {{ $t('create_an_account') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!-- //banner -->

    <section v-if="0" :class="[$style.pc, $style.exchange]">
      <div :class="[$style.container]">
        <div :class="[$style.tabSearchArea, $style.clear]">
          <div :class="[$style.tabArea]">
            <!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
            <el-tabs>
              <el-tab-pane :label="$t('market')" name="first">{{
                $t('market')
              }}</el-tab-pane>
              <el-tab-pane
                :label="$t('account_transfer.favorites')"
                name="second"
                >{{ $t('account_transfer.favorites') }}</el-tab-pane
              >
              <el-tab-pane :label="$t('retention')" name="third">{{
                $t('retention')
              }}</el-tab-pane>
            </el-tabs>
          </div>
          <div :class="[$style.searchArea]">
            <form :class="[$style.inputBox]">
              <input
                type="text"
                :placeholder="$t('b2c_exchange.coin_name_and_symbol_search')"
              />
              <img src="@assets/img/b2c/search.png" alt="search" />
            </form>
          </div>
        </div>

        <table>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th :class="[$style.textL]">
                <div>
                  <span>{{ $t('Coin_name') }} </span>
                  <div :class="[$style.arrowArea]">
                    <div :class="[$style.arrowBox]">
                      <img src="@assets/img/b2c/topArrow.png" alt="top Arrow" />
                    </div>
                    <div :class="[$style.arrowBox]">
                      <img
                        src="@assets/img/b2c/bottomArrow.png"
                        alt="bottom Arrow"
                      />
                    </div>
                  </div>
                </div>
              </th>
              <th :class="[$style.textR]">
                <div>
                  <span>{{ $t('b2c_exchange.present_price') }}</span>
                  <div :class="[$style.arrowArea]">
                    <div :class="[$style.arrowBox]">
                      <img src="@assets/img/b2c/topArrow.png" alt="top Arrow" />
                    </div>
                    <div :class="[$style.arrowBox]">
                      <img
                        src="@assets/img/b2c/activeBottomArrow.png"
                        alt="bottom Arrow"
                      />
                    </div>
                  </div>
                </div>
              </th>
              <th>
                <div>
                  <span>{{
                    $t('b2c_exchange.compared_to_the_previous_day')
                  }}</span>
                  <div :class="[$style.arrowArea]">
                    <div :class="[$style.arrowBox]">
                      <img src="@assets/img/b2c/topArrow.png" alt="top Arrow" />
                    </div>
                    <div :class="[$style.arrowBox]">
                      <img
                        src="@assets/img/b2c/bottomArrow.png"
                        alt="bottom Arrow"
                      />
                    </div>
                  </div>
                </div>
              </th>
              <th :class="[$style.textR]">
                <div>
                  <span>{{ $t('b2c_exchange.transaction_price') }}</span>
                  <div :class="[$style.arrowArea]">
                    <div :class="[$style.arrowBox]">
                      <img src="@assets/img/b2c/topArrow.png" alt="top Arrow" />
                    </div>
                    <div :class="[$style.arrowBox]">
                      <img
                        src="@assets/img/b2c/bottomArrow.png"
                        alt="bottom Arrow"
                      />
                    </div>
                  </div>
                </div>
              </th>
              <th :class="[$style.textR, $style.amount]">
                <div>
                  <span>시가총액</span>
                  <img src="@assets/img/b2c/question.png" alt="question" />
                  <div :class="[$style.popup]">
                    <div :class="[$style.triangle]"></div>
                    <span>코인마켓캡 제공</span>
                  </div>
                  <div :class="[$style.arrowArea]">
                    <div :class="[$style.arrowBox]">
                      <img src="@assets/img/b2c/topArrow.png" alt="top Arrow" />
                    </div>
                    <div :class="[$style.arrowBox]">
                      <img
                        src="@assets/img/b2c/bottomArrow.png"
                        alt="bottom Arrow"
                      />
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :class="[$style.textL]">
                <img
                  :class="[$style.favorite]"
                  src="@assets/img/b2c/voidStar.png"
                  alt="star"
                />
                <div :class="[$style.coinName]">
                  <img
                    :class="[$style.coinImg]"
                    src="@assets/img/b2c/bit.png"
                    alt="bit coin"
                  />
                  <span>비트코인</span>
                  <em :class="[$style.noSpace]">BTC/CCF</em>
                </div>
              </td>
              <td :class="[$style.textR]">
                <span :class="[$style.up, $style.noSpace]">9,389.00</span>
                <span :class="[$style.noSpace]">11,321,000</span>
                <em :class="[$style.noSpace]">KRW</em>
              </td>
              <td>
                <span :class="[$style.up, $style.noSpace]">+ 0.14%</span></td
              >
              <td :class="[$style.textR]">
                <span :class="[$style.noSpace]">5,149.62</span>
                <span :class="[$style.noSpace]">3,190.44</span>
                <em>백만원</em>
              </td>
              <td :class="[$style.textR]">
                204조 2851억
              </td>
            </tr>
            <tr> </tr
            ><tr>
              <td :class="[$style.textL]">
                <img
                  :class="[$style.favorite]"
                  src="@assets/img/b2c/activeStar.png"
                  alt="star"
                />
                <div :class="[$style.coinName]">
                  <img
                    :class="[$style.coinImg]"
                    src="@assets/img/b2c/ider.png"
                    alt="bit coin"
                  />
                  <span>이더리움</span>
                  <em :class="[$style.noSpace]">ETH/CCF</em>
                </div>
              </td>
              <td :class="[$style.textR]">
                <span :class="[$style.down, $style.noSpace]">9,389.00</span>
                <span :class="[$style.noSpace]">11,321,000</span>
                <em :class="[$style.noSpace]">KRW</em>
              </td>
              <td>
                <span :class="[$style.down, $style.noSpace]">- 0.14%</span></td
              >
              <td :class="[$style.textR]">
                <span :class="[$style.noSpace]">5,149.62</span>
                <span :class="[$style.noSpace]">3,190.44</span>
                <em>백만원</em>
              </td>
              <td :class="[$style.textR]">
                204조 2851억
              </td>
            </tr>
            <tr>
              <td :class="[$style.textL]">
                <img
                  :class="[$style.favorite]"
                  src="@assets/img/b2c/voidStar.png"
                  alt="star"
                />
                <div :class="[$style.coinName]">
                  <img
                    :class="[$style.coinImg]"
                    src="@assets/img/b2c/riple.png"
                    alt="bit coin"
                  />
                  <span>리플</span>
                  <em :class="[$style.noSpace]">XRP/CCF</em>
                </div>
              </td>
              <td :class="[$style.textR]">
                <span :class="[$style.up, $style.noSpace]">9,389.00</span>
                <span :class="[$style.noSpace]">11,321,000</span>
                <em :class="[$style.noSpace]">KRW</em>
              </td>
              <td>
                <span :class="[$style.up, $style.noSpace]">+ 0.14%</span></td
              >
              <td :class="[$style.textR]">
                <span :class="[$style.noSpace]">5,149.62</span>
                <span :class="[$style.noSpace]">3,190.44</span>
                <em>백만원</em>
              </td>
              <td :class="[$style.textR]">
                204조 2851억
              </td>
            </tr>
            <tr>
              <td :class="[$style.textL]">
                <img
                  :class="[$style.favorite]"
                  src="@assets/img/b2c/voidStar.png"
                  alt="star"
                />
                <div :class="[$style.coinName]">
                  <img
                    :class="[$style.coinImg]"
                    src="@assets/img/b2c/light.png"
                    alt="bit coin"
                  />
                  <span>라이트코인</span>
                  <em :class="[$style.noSpace]">LTC/CCF</em>
                </div>
              </td>
              <td :class="[$style.textR]">
                <span :class="[$style.down, $style.noSpace]">9,389.00</span>
                <span :class="[$style.noSpace]">11,321,000</span>
                <em :class="[$style.noSpace]">KRW</em>
              </td>
              <td>
                <span :class="[$style.down, $style.noSpace]">- 0.14%</span></td
              >
              <td :class="[$style.textR]">
                <span :class="[$style.noSpace]">5,149.62</span>
                <span :class="[$style.noSpace]">3,190.44</span>
                <em>백만원</em>
              </td>
              <td :class="[$style.textR]">
                204조 2851억
              </td>
            </tr>
            <!-- 거래소 없을 떄 -->
            <!-- <tr>
                <td></td>
                <td></td>
                <td :class="[$style.voidMarketArea]">
                  <div :class="[$style.noneMarket]">
                    <img src="@assets/img/b2c/noneIcon.png" alt="coin is none]">
                    <p>검색된 마켓이 없습니다.</p>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr> -->
            <!-- //거래소 없을 떄 -->
          </tbody>
        </table>

        <div :class="[$style.exchangeEnter, $style.textC]">
          <a href=""
            >거래소 둘러보기
            <i class="fas fa-chevron-right"></i>
          </a>
        </div>
      </div>
    </section>
    <!-- //거래소 -->

    <section style="padding-top: 0;" :class="[$style.advantage, $style.clear]">
      <div :class="[$style.advantageImgArea]">
        <div :class="[$style.advantageImgText]">
          <p>{{ $t('cryptocurrency_exchange') }}{{ $t('more_than_that') }}</p>
          <strong>Advantage</strong>
          <strong>Delivered</strong>
        </div>
      </div>
      <div :class="[$style.advantageTextArea]">
        <ul>
          <li :class="[$style.clear]">
            <img src="@assets/img/b2c/trust.png" alt="trust icon" />
            <div :class="[$style.textArea]">
              <strong>{{ $t('vision_title') }}</strong>
              <p>{{ $t('vision_text1') }}</p>
              <p>{{ $t('vision_text2') }}</p>
            </div>
          </li>
          <li :class="[$style.clear]">
            <img src="@assets/img/b2c/fee.png" alt="fee icon" />
            <div :class="[$style.textArea]">
              <strong>{{ $t('fee_title') }}</strong>
              <p>{{ $t('fee_text1') }}</p>
              <p>{{ $t('fee_text2') }}</p>
            </div>
          </li>
          <li :class="[$style.clear]">
            <img src="@assets/img/b2c/barrier.png" alt="barrier icon" />
            <div :class="[$style.textArea]">
              <strong>{{ $t('row_title') }}</strong>
              <p>{{ $t('row_text1') }}</p>
              <p>{{ $t('row_text2') }}</p>
            </div>
          </li>
          <li :class="[$style.clear]">
            <img src="@assets/img/b2c/interface.png" alt="interface icon" />
            <div :class="[$style.textArea]">
              <strong>{{ $t('easy_title') }}</strong>
              <p>{{ $t('easy_text1') }}</p>
              <p>{{ $t('easy_text2') }}</p>
            </div>
          </li>
          <li :class="[$style.clear]">
            <img src="@assets/img/b2c/fullTime.png" alt="fullTime icon" />
            <div :class="[$style.textArea]">
              <strong>{{ $t('full_time') }}</strong>
              <p>{{ $t('full_time_text1') }}</p>
              <p>{{ $t('full_time_text2') }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!-- //거래소 소개 seciton 2 -->

    <section :class="[$style.mobileApp]">
      <div :class="[$style.container, $style.clear]">
        <div :class="[$style.imgArea]">
          <div :class="[$style.gaussian]"></div>
          <img
            :class="[$style.mobilePhone]"
            src="@assets/img/b2c/mobile.png"
            alt="mobile phone"
          />
        </div>
        <div :class="[$style.textArea, $style.textR, $style.clear]">
          <h4>{{ $t('easy_sellbuy') }}</h4>
          <h4
            >{{ $t('so_easy') }} <strong>{{ $t('b2c_mobile') }}</strong></h4
          >
          <p>{{ $t('app_sellbuy') }}</p>
          <p>{{ $t('anywhere_use') }}</p>
          <ul :class="[$style.buttonArea]">
            <li>
              <a
                href="void(0);"
                :class="[$style.noSpace]"
                onclick="alert('준비 중입니다');return false;"
              >
                <img
                  src="@assets/img/b2c/android.png"
                  alt="android logo"
                  :class="$style.OffImg"
                />
                <img
                  src="@assets/img/b2c/android-on.png"
                  alt="android logo"
                  :class="$style.OnImg"
                />
                Google Play
              </a>
            </li>
            <li>
              <a
                href="void(0);"
                :class="[$style.noSpace]"
                onclick="alert('준비 중입니다');return false;"
              >
                <img
                  src="@assets/img/b2c/apple.png"
                  alt="apple logo"
                  :class="$style.OffImg"
                />
                <img
                  src="@assets/img/b2c/apple-on.png"
                  alt="apple logo"
                  :class="$style.OnImg"
                />
                App Store
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!-- //모바일 앱 -->

    <section :class="[$style.trade]">
      <div :class="[$style.textArea]">
        <h3>{{ $t('now_start_buy') }}</h3>
        <ul :class="[$style.buttonArea, $style.mobileButton]">
          <li>
            <button @click="tradeLink">{{ $t('go_transaction') }}</button>
          </li>
          <li v-if="!loggedIn">
            <button
              @click="
                $router.push({
                  name: 'register',
                  query: { redirectFrom: 'b2c-main' },
                })
              "
              >{{ $t('create_an_account') }}</button
            >
          </li>
        </ul>
      </div>
    </section>
    <!-- //거래 -->
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/b2c/common.scss';
@import '@src/design/b2c/b2c.scss';
</style>
