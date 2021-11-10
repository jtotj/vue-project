<script>
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import uniq from 'lodash/uniq'
import { mapState } from 'vuex'
import AssetSelector from '@components/asset-selector'

export default {
  page: {
    title: 'DormancyAccountList',
    meta: [{ name: 'description', content: 'DormancyAccountList' }],
  },
  components: {
    AssetSelector,
  },
  data() {
    return {
      selected_asset_seq: 0,
      input_target_account: '',
      reset: false,

      favorite_dormancy: [],
      activeName: 'first',
      activeNames: '',

      dormancy_list: [
        {
          _no: 11,
          account_number: '20200728-5-2-25081',
          address: null,
          address_seq: null,
          asset_code: 'CCF',
          asset_seq: 5,
          asset_title: 'CCF',
          balance: '0.00000000',
          code: 'CCF',
          email_address: 'admin@1.1',
          holding_balance: '0.00000000',
          member_seq: 2,
          regdate: '2020-07-27T22:17:26.000Z',
          seq: 15,
          status: 'OPEN',
          title: 'test',
          user_id: 'admin',
          user_name: '관리자',
        },
        {
          _no: 10,
          account_number: '20200602-1-2-40690',
          address: null,
          address_seq: null,
          asset_code: 'ETH',
          asset_seq: 1,
          asset_title: '이더리움',
          balance: '999737.40000000',
          code: 'ETH',
          email_address: 'admin@1.1',
          holding_balance: '470.00000000',
          member_seq: 2,
          regdate: '2020-06-01T21:39:28.000Z',
          seq: 11,
          status: 'OPEN',
          title: '',
          user_id: 'admin',
        },
      ],
    }
  },

  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['currentUser']),

    c_active_dormancy() {
      return filter(
        this.dormancy_list,
        (dormancy) =>
          dormancy.asset_seq === this.selected_asset_seq &&
          !find(this.c_favorite_dormancy, { seq: dormancy.seq }) &&
          (!this.input_target_account ||
            dormancy.title
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            dormancy.account_number.includes(this.input_target_account))
      )
    },
    c_favorite_dormancy_currentUser() {
      return `favorite_dormancy_${this.currentUser.seq}`
    },
    c_favorite_dormancy() {
      const accounts = uniq(
        map(this.favorite_dormancy, (value) =>
          find(this.dormancy_list, { seq: value })
        )
      ).filter(
        (favorite_dormancy) =>
          favorite_dormancy.asset_seq === this.selected_asset_seq
      )
      return accounts
    },
  },
  mounted() {
    if (localStorage.getItem(this.c_favorite_dormancy_currentUser)) {
      this.favorite_dormancy = JSON.parse(
        localStorage.getItem(this.c_favorite_dormancy_currentUser)
      )
    }
  },
  methods: {
    toggleDormancyFavorites(seq) {
      const index = this.favorite_dormancy.indexOf(seq)

      if (index !== -1) {
        this.favorite_dormancy.splice(index, 1)
        localStorage.setItem(
          this.c_favorite_dormancy_currentUser,
          JSON.stringify(this.favorite_dormancy)
        )
        return
      }
      this.favorite_dormancy.push(seq)
      localStorage.setItem(
        this.c_favorite_dormancy_currentUser,
        JSON.stringify(this.favorite_dormancy)
      )
    },
    restoreMessage() {
      const h = this.$createElement
      this.$msgbox({
        title: '복원신청',
        message: h('p', null, [
          h('span', null, this.$t('dormancy_text1')),
          h('span', null, this.$t('dormancy_text2')),
        ]),
        center: true,
        showCancelButton: true,
        cancelButtonText: '취소',
        confirmButtonText: '복원',
        cancelButtonClass: 'elBtn',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: 'completed',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'canceled',
          })
        })
    },
    deleteMessage(bal) {
      const h = this.$createElement
      if (bal > 0) {
        this.$msgbox({
          title: '삭제신청',
          message: h('p', null, [
            h(
              'span',
              null,
              this.$t('dormancy_text3') + bal + this.$t('dormancy_text4')
            ),
            h('span', null, this.$t('dormancy_text5')),
          ]),
          type: 'warning',
          center: true,
          showCancelButton: true,
          cancelButtonText: '취소',
          confirmButtonText: '확인',
          cancelButtonClass: 'elBtn',
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'completed',
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: 'canceled',
            })
          })
      } else {
        this.$msgbox({
          title: '삭제신청',
          message: h('p', null, [h('span', null, this.$t('dormancy_text6'))]),
          type: 'warning',
          center: true,
          showCancelButton: true,
          cancelButtonText: '취소',
          confirmButtonText: '확인',
          cancelButtonClass: 'elBtn',
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: 'completed',
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: 'canceled',
            })
          })
      }
    },
  },
}
</script>

<template>
  <div class="bank-container">
    <div class="contents">
      <div class="big-title-wrap">
        <h2 class="big-title">
          {{ $t('dormant_account_check') }}
        </h2>
      </div>
      <div :class="[$style.tradesWrap]">
        <div :class="[$style.tradesBox]">
          <!-- 자산별 검색 -->
          <div :class="[$style.tradesLeft]">
            <p :class="[$style.tradesHead]">{{
              $t('wallet_page.asset_list')
            }}</p>
            <AssetSelector v-model="selected_asset_seq" />
          </div>
          <!-- 계좌별 검색 -->
          <div :class="[$style.tradesRight]">
            <p :class="[$style.tradesHead]">
              {{ $t('account_transfer.search_transfer_account') }}
            </p>

            <div :class="[$style.accountList]">
              <div :class="[$style.account_search]">
                <el-input
                  v-model="input_target_account"
                  prefix-icon="el-icon-search"
                  :placeholder="$t('account_transfer.pls_search_account')"
                  :class="[$style.input_account_search]"
                />
              </div>
              <el-tabs type="card" :class="[$style.tabs]">
                <el-tab-pane label="계좌">
                  <PerfectScrollbar>
                    <ul :class="[$style.dealList]">
                      <template v-if="c_favorite_dormancy.length">
                        <div :class="[$style.favoriteAccount]">
                          <li
                            v-for="favorite in c_favorite_dormancy"
                            :key="favorite.seq"
                          >
                            <div
                              :class="[
                                $style.favorite,
                                {
                                  [$style.active]:
                                    favorite_dormancy.indexOf(favorite.seq) !==
                                    -1,
                                },
                              ]"
                              @click.prevent="
                                toggleDormancyFavorites(favorite.seq)
                              "
                            >
                            </div>
                            <div :class="[$style.accountInfo]">
                              <strong :class="[$style.info_title]">
                                {{ favorite.title }}
                              </strong>
                              <p :class="[$style.accountNumberWrap]">
                                <span :class="[$style.accountText]">
                                  {{ $t('wallet_page.withdraw_bank_address') }}
                                </span>
                                <span :class="[$style.account_number]">
                                  {{ favorite.account_number }}
                                </span>
                              </p>
                            </div>
                            <div
                              class="accountNumberBtn"
                              :class="[$style.account_number_btn]"
                            >
                              <el-button @click="restoreMessage">
                                복원
                              </el-button>
                              <el-button
                                @click="deleteMessage(dormancy.balance)"
                              >
                                삭제
                              </el-button>
                            </div>
                          </li>
                        </div>
                      </template>
                      <template>
                        <li
                          v-for="dormancy in c_active_dormancy"
                          :key="dormancy.seq"
                          :label="dormancy.account_number"
                          :value="dormancy.seq"
                        >
                          <div
                            :class="[
                              $style.favorite,
                              {
                                [$style.active]:
                                  favorite_dormancy.indexOf(dormancy.seq) !==
                                  -1,
                              },
                            ]"
                            @click.prevent="
                              toggleDormancyFavorites(dormancy.seq)
                            "
                          >
                          </div>

                          <div :class="[$style.accountInfo]">
                            <strong :class="[$style.info_title]">
                              {{ dormancy.title }}
                            </strong>

                            <p :class="[$style.accountNumberWrap]">
                              <span :class="[$style.accountText]">
                                {{ $t('wallet_page.withdraw_bank_address') }}
                              </span>
                              <span :class="[$style.account_number]">
                                {{ dormancy.account_number }}
                              </span>
                            </p>
                          </div>
                          <div
                            class="accountNumberBtn"
                            :class="[$style.account_number_btn]"
                          >
                            <el-button @click="restoreMessage">
                              복원
                            </el-button>
                            <el-button
                              class="deleteBtn"
                              @click="deleteMessage(dormancy.balance)"
                            >
                              삭제
                            </el-button>
                          </div>
                        </li>
                        <!-- 자산을 선택해주세요. -->
                        <template v-if="!selected_asset_seq">
                          <div :class="[$style.noSelectAsset]">
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
                        <!-- 계좌가 없을 떄 -->
                        <template
                          v-if="
                            selected_asset_seq &&
                              c_active_dormancy.length === 0 &&
                              c_favorite_dormancy.length === 0
                          "
                        >
                          <div :class="[$style.noDealList]">
                            <div :class="[$style.imgWrap]">
                              <img
                                src="@assets/img/no-list.png"
                                alt="목록 없음 아이콘"
                              />
                            </div>
                            <p :class="[$style.textWrap]">
                              {{ currentUser.user_name }}고객님은 코코뱅크에
                              휴면계좌가 없습니다. 항상 코코뱅크를 이용해주셔서
                              감사합니다.
                            </p>
                          </div>
                        </template>
                      </template>
                    </ul>
                  </PerfectScrollbar>
                </el-tab-pane>
                <el-tab-pane :label="$t('favorites')">
                  <PerfectScrollbar>
                    <ul :class="[$style.dealList]">
                      <template v-if="c_favorite_dormancy.length">
                        <div :class="[$style.favoriteAccount]">
                          <li
                            v-for="favorite in c_favorite_dormancy"
                            :key="favorite.seq"
                          >
                            <div
                              :class="[
                                $style.favorite,
                                {
                                  [$style.active]:
                                    favorite_dormancy.indexOf(favorite.seq) !==
                                    -1,
                                },
                              ]"
                              @click.prevent="
                                toggleDormancyFavorites(favorite.seq)
                              "
                            >
                            </div>
                            <div :class="[$style.accountInfo]">
                              <strong :class="[$style.info_title]">
                                {{ favorite.title }}
                              </strong>
                              <p :class="[$style.accountNumberWrap]">
                                <span :class="[$style.accountText]">
                                  {{ $t('wallet_page.withdraw_bank_address') }}
                                </span>
                                <span :class="[$style.account_number]">
                                  {{ favorite.account_number }}
                                </span>
                              </p>
                            </div>
                            <div
                              class="accountNumberBtn"
                              :class="[$style.account_number_btn]"
                            >
                              <el-button @click="restoreMessage">
                                복원
                              </el-button>
                              <el-button
                                @click="deleteMessage(dormancy.balance)"
                              >
                                삭제
                              </el-button>
                            </div>
                          </li>
                        </div>
                      </template>
                    </ul>
                  </PerfectScrollbar>
                </el-tab-pane>
              </el-tabs>
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
.elBtn {
  color: #fff;
}
</style>
