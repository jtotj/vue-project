<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import find from 'lodash/find'
import remove from 'lodash/remove'
import draggable from 'vuedraggable'
import AddressRegistration from '@components/favorite-address-registration'

export default {
  components: {
    AddressRegistration,
    draggable,
  },
  props: {
    selected_asset_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      input_target_account: '',
      active_sub_tab: 'all',

      other_title_list: [],
      target_group_title: null,
      other_account_list: [],

      /* account modal */
      account_modal: false,
      section_condition: 'other',

      /* group modal */
      group_modal: false,
      group_title: '',
      delete_title: null,
      // draggable
      enabled: false,
      dragging: false,
      dragging_btn_text: '순서 변경',
    }
  },
  computed: {
    ...mapState('assets', ['assets']),
    ...mapState('auth', ['currentUser']),

    c_other_wallet_title_currentUser() {
      return `other_wallet_title_${this.currentUser.seq}`
    },
    c_other_wallet_favorite_address() {
      return `other_wallet_favorite_address_${this.currentUser.seq}`
    },
    c_group_condition_info() {
      return filter(
        this.other_account_list,
        (list) =>
          (list.group_name.includes(this.active_sub_tab) ||
            list.group_name.includes(this.target_group_title)) &&
          (!this.input_target_account ||
            list.nick_name
              .toLowerCase()
              .includes(this.input_target_account.toLowerCase()) ||
            list.favorite_address.includes(this.input_target_account))
      )
    },
    c_condition_group_title: {
      get() {
        return filter(
          this.other_title_list,
          (list) => list.asset_seq === this.selected_asset_seq
        )
      },
      set(newlist) {
        remove(
          this.other_title_list,
          (list) => list.asset_seq === this.selected_asset_seq
        )
        newlist.forEach((list) => this.other_title_list.push(list))
      },
    },
    c_favorite_condition_group() {
      return find(this.c_condition_group_title, {
        name: this.active_sub_tab,
      })
    },
  },
  watch: {
    selected_asset_seq() {
      this.target_group_title = null
    },
  },
  mounted() {
    if (localStorage.getItem(this.c_other_wallet_title_currentUser)) {
      this.other_title_list = JSON.parse(
        localStorage.getItem(this.c_other_wallet_title_currentUser)
      )
    }
    if (localStorage.getItem(this.c_other_wallet_favorite_address)) {
      this.other_account_list = JSON.parse(
        localStorage.getItem(this.c_other_wallet_favorite_address)
      )
    }
  },
  methods: {
    groupInfoBtn() {
      if (this.selected_asset_seq === 0) {
        return this.$alert(this.$t('private.please_select_asset'), {
          type: 'info',
        })
      }
      this.group_modal = !this.group_modal
      this.target_group_title = null
    },
    accountCraeteBtn() {
      if (this.selected_asset_seq === 0) {
        return this.$alert(this.$t('private.please_select_asset'), {
          type: 'info',
        })
      }
      this.account_modal = !this.account_modal
      this.target_group_title = null
    },
    /* 타 지갑 */
    createOtherGroup() {
      if (this.group_title === '') {
        return this.$alert('그룹명을 입력해주세요', {
          type: 'info',
        })
      }
      this.other_title_list.push({
        asset_seq: this.selected_asset_seq,
        name: this.group_title,
      })
      localStorage.setItem(
        this.c_other_wallet_title_currentUser,
        JSON.stringify(this.other_title_list)
      )
      this.group_title = ''
    },
    titleDelete() {
      if (this.delete_title !== null) {
        localStorage.removeItem(this.c_other_wallet_title_currentUser)
        localStorage.removeItem(this.c_other_wallet_favorite_address)
        this.other_title_list = filter(
          this.other_title_list,
          (list) => list.name !== this.delete_title
        )
        this.other_account_list = filter(
          this.other_account_list,
          (list) => list.group_name !== this.delete_title
        )
        localStorage.setItem(
          this.c_other_wallet_title_currentUser,
          JSON.stringify(this.other_title_list)
        )
        localStorage.setItem(
          this.c_other_wallet_favorite_address,
          JSON.stringify(this.other_account_list)
        )
        this.delete_title = null
      }
    },
    targetDeleteTitle(name) {
      if (this.delete_title === name) this.delete_title = null
      else this.delete_title = name
    },
    toggleGroupTitle(name) {
      if (this.target_group_title === name) this.target_group_title = null
      else this.target_group_title = name
    },
    dragActiveBtn() {
      if (this.enabled === true) {
        localStorage.removeItem(this.c_other_wallet_title_currentUser)
        localStorage.setItem(
          this.c_other_wallet_title_currentUser,
          JSON.stringify(this.other_title_list)
        )
        this.enabled = false
        this.dragging_btn_text = '순서 변경'
      } else {
        this.enabled = true
        this.dragging_btn_text = '순서 변경 저장'
      }
    },
    resetDragBtn() {
      this.enabled = true
      this.dragging_btn_text = '순서 변경'
      this.group_modal = !this.group_modal
    },
    alertPrepare() {
      this.$toasted.info(this.$t('help.prepare'))
    },
  },
}
</script>
<template>
  <section :class="[$style.sectionWrap]">
    <div :class="[$style.accountList]">
      <div :class="[$style.account_search]">
        <el-input
          v-model="input_target_account"
          prefix-icon="el-icon-search"
          :placeholder="$t('account_transfer.pls_search_account')"
          :class="[$style.input_account_search]"
        />
      </div>
      <el-tabs v-model="active_sub_tab" type="card">
        <el-tab-pane
          v-for="title in c_condition_group_title"
          :key="title.index"
          :label="title.name"
          :name="title.name"
          class="tabContent"
        >
          <template
            v-if="c_favorite_condition_group !== undefined"
            :class="[$style.contentWrap]"
            class="contentWrap"
          >
            <PerfectScrollbar class="perfectScrollbar">
              <p :class="[$style.titleInfo]">
                입금계좌를 자주쓰는 계좌로 등록하면 이체 시 계좌번호를 입력 할
                필요가 없어 편리합니다.
              </p>
              <div
                :class="[
                  $style.GroupTitle,
                  {
                    [$style.active]:
                      target_group_title === c_favorite_condition_group.name,
                  },
                ]"
              >
                <p :class="[$style.titleName]">
                  {{ c_favorite_condition_group.name }}
                </p>
                <div v-if="c_group_condition_info.length">
                  <div
                    v-for="list in c_group_condition_info"
                    :key="list.index"
                    :class="[$style.addressInfoWrap]"
                  >
                    <i class="el-icon-arrow-right" @click="alertPrepare" />
                    <p>{{ list.user_name }}</p>
                    <ul :class="[$style.addressInfo]">
                      <li>{{ list.nick_name }}</li>
                      <li>
                        <span>
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        {{ list.favorite_address }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div :class="[$style.groupInfoText]">
                <p>
                  자주쓰는 계좌에 등록한 계좌를 해약하더라도 등록내역이 자동
                  {{ $t('pay_login.deleting') }}되지 않으므로, 등록내역을
                  {{ $t('pay_login.deleting') }}한 후 이용해주세요.
                </p>
                <p>
                  [그룹관리]에서 계좌그룹 생성하거나
                  {{ $t('pay_login.deleting') }}할 수 있습니다.
                </p>
                <p>
                  [순서변경]에서 그룹별 자주쓰는 계좌의 순위를 변경할 수
                  있습니다.
                </p>
                <p>
                  기본정렬순서: 숫자 > 대문자 > 소문자 > 한글
                </p>
              </div>
            </PerfectScrollbar>
          </template>
          <template v-else>
            <p :class="[$style.titleInfo]">
              입금계좌를 자주쓰는 계좌로 등록하면 이체 시 계좌번호를 입력 할
              필요가 없어 편리합니다.
            </p>
            <div :class="[$style.noDealList]">
              <div :class="[$style.imgWrap]">
                <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
              </div>
              <p :class="[$style.textWrap]">
                {{ $t('account_transfer.no_inquiry_history') }}
              </p>
            </div>
          </template>
          <el-row>
            <el-button type="info" plain @click="group_modal = !group_modal"
              >그룹관리</el-button
            >
            <el-button type="primary" @click="account_modal = !account_modal">
              계좌등록
            </el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="'전체'" :name="'all'" class="tabContent">
          <template
            v-if="c_condition_group_title.length"
            :class="[$style.contentWrap]"
            class="contentWrap"
          >
            <PerfectScrollbar class="perfectScrollbar">
              <p :class="[$style.titleInfo]">
                입금계좌를 자주쓰는 계좌로 등록하면 이체 시 계좌번호를 입력 할
                필요가 없어 편리합니다.
              </p>
              <div
                v-for="title in c_condition_group_title"
                :key="title.index"
                :class="[
                  $style.GroupTitle,
                  {
                    [$style.active]: target_group_title === title.name,
                  },
                ]"
              >
                <div @click="toggleGroupTitle(title.name)">
                  <p :class="[$style.titleName]">
                    {{ title.name }}
                  </p>
                </div>
                <div
                  v-if="
                    c_group_condition_info.length &&
                      target_group_title === title.name
                  "
                >
                  <div
                    v-for="list in c_group_condition_info"
                    :key="list.index"
                    :class="[$style.addressInfoWrap]"
                  >
                    <i class="el-icon-arrow-right" @click="alertPrepare" />
                    <p>{{ list.user_name }}</p>
                    <ul :class="[$style.addressInfo]">
                      <li>{{ list.nick_name }}</li>
                      <li>
                        <span>
                          {{ $t('wallet_page.withdraw_bank_address') }}
                        </span>
                        {{ list.favorite_address }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </PerfectScrollbar>
          </template>
          <template v-else>
            <p :class="[$style.titleInfo]">
              입금계좌를 자주쓰는 계좌로 등록하면 이체 시 계좌번호를 입력 할
              필요가 없어 편리합니다.
            </p>
            <div :class="[$style.noDealList]">
              <div :class="[$style.imgWrap]">
                <img src="@assets/img/no-list.png" alt="목록 없음 아이콘" />
              </div>
              <p :class="[$style.textWrap]">{{
                $t('account_transfer.no_inquiry_history')
              }}</p>
            </div>
          </template>
          <el-row>
            <el-button type="info" plain @click="groupInfoBtn"
              >그룹관리</el-button
            >
            <el-button type="primary" @click="accountCraeteBtn">
              계좌등록
            </el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- group modal -->
    <el-dialog
      title="그룹 목록"
      :visible.sync="group_modal"
      width="40%"
      :append-to-body="true"
      :before-close="resetDragBtn"
      class="group-modal"
    >
      <div :class="[$style.createGroupWrap]">
        <input v-model="group_title" placeholder="그룹명을 입력해주세요" />
        <button @click="accountCraeteBtn">그룹추가</button>
      </div>
      <div :class="[$style.groupTitleWrap]">
        <p :class="$style.groupTitle">등록된 그룹</p>
        <el-row :class="$style.groupTitleBtn">
          <el-button
            id="disabled"
            type="button"
            class="form-check-input"
            @click="dragActiveBtn"
          >
            {{ dragging_btn_text }}
          </el-button>
          <el-button @click="titleDelete">{{
            $t('pay_login.deleting')
          }}</el-button>
        </el-row>
      </div>
      <PerfectScrollbar class="group-perfcet-scroll">
        <draggable
          v-model="c_condition_group_title"
          :disabled="!enabled"
          class="list-group"
          ghost-class="ghost"
        >
          <div
            v-for="title in c_condition_group_title"
            :key="title.index"
            class="list-group-item"
            :class="[
              $style.groupListWrap,
              { [$style.active]: delete_title === title.name },
            ]"
            @click="targetDeleteTitle(title.name)"
          >
            <i
              v-if="enabled"
              class="el-icon-d-caret"
              :class="$style.dragIcon"
            />
            <ul>
              <li>그룹명</li>
              <li :class="[$style.groupName]">{{ title.name }}</li>
            </ul>
          </div>
        </draggable>
      </PerfectScrollbar>
    </el-dialog>

    <!-- account modal -->
    <el-dialog
      title="계좌 등록"
      :visible.sync="account_modal"
      width="40%"
      :append-to-body="true"
      :show-close="false"
    >
      <AddressRegistration
        v-if="account_modal"
        v-model="account_modal"
        :section_condition="section_condition"
        :c_group_favorite_address="c_other_wallet_favorite_address"
        :c_condition_group_title="c_condition_group_title"
        :selected_asset_seq="selected_asset_seq"
        :group_title_list="other_title_list"
        :favorite_account_list="other_account_list"
      />
    </el-dialog>
  </section>
</template>

<style lang="scss" module>
@import '@src/design/favorite-address-list.scss';
</style>
