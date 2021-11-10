<script>
import { fetchAccount } from '@apis/account'
import { mapState } from 'vuex'
import find from 'lodash/find'

export default {
  props: {
    selected_asset_seq: {
      type: Number,
      default: 0,
    },
    group_title_list: {
      type: Array,
      default: () => [],
    },
    c_condition_group_title: {
      type: Array,
      default: () => [],
    },
    favorite_account_list: {
      type: Array,
      default: () => [],
    },
    c_group_favorite_address: {
      type: String,
      default: null,
    },
    section_condition: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      value_select: '',
      input_account_num: null,
      account_nickname: null,
      disabled: false,
      toggle_btn: '이체계좌 확인',

      account_modal: false,
      account_info: {},
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),

    c_address_validation() {
      if (!this.account_info) return undefined
      else
        return find(this.favorite_account_list, {
          favorite_address: this.account_info.account_number,
        })
    },
  },
  methods: {
    async findAcccountNumber() {
      await fetchAccount({
        account_seq_or_number: this.input_account_num,
        for_transfer: 1,
      })
        .then((res) => {
          if (res.account_info) {
            this.account_info = res.account_info
            this.disabled = true
            this.toggle_btn = '이체계좌 변경'
            this.$toasted.success('등록 가능한 계좌입니다.')
          } else {
            this.$toasted.error(
              this.$t('account_transfer.msg_not_search_account')
            )
            this.toggle_btn = '이체계좌 확인'
            this.input_account_num = null
          }
        })
        .catch((e) => {
          this.$toasted.error(e.message)
          this.input_account_num = null
        })
    },
    handleFaoriteAccount() {
      if (this.value_select === '') {
        return this.$toasted.error('그룹을 선택해주세요')
      } else if (this.input_account_num === null) {
        return this.$toasted.error('계좌를 입력해주세요')
      } else if (this.c_address_validation !== undefined) {
        return this.$toasted.error('등록된 계좌입니다.')
      } else {
        this.favorite_account_list.push({
          user_name: this.currentUser.user_name,
          group_name: this.value_select,
          favorite_address: this.input_account_num,
          nick_name: this.account_nickname,
          asset_seq: this.selected_asset_seq,
        })
        localStorage.setItem(
          this.c_group_favorite_address,
          JSON.stringify(this.favorite_account_list)
        )
        this.handleModalChange()
      }
    },
    handleModalChange() {
      this.$emit('input', this.account_modal)
    },
    ToggleAddressBtn() {
      if (this.disabled === true) {
        this.disabled = false
        this.input_account_num = null
        this.toggle_btn = '이체계좌 확인'
      } else {
        this.findAcccountNumber()
        this.toggle_btn = '이체계좌 변경'
      }
    },
  },
}
</script>
<template>
  <div :class="[$style.accountModalWrap]">
    <!-- 비트월드 -->
    <template v-if="section_condition === 'bank'">
      <div>
        <p :class="[$style.inputText]">그룹 선택</p>
        <el-select v-model="value_select" placeholder="그룹을 선택해주세요">
          <el-option
            v-for="item in c_condition_group_title"
            :key="item.index"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <p :class="[$style.inputText]">{{
          $t('account_transfer.to_account_input')
        }}</p>
        <input v-model="input_account_num" :disabled="disabled" />
        <el-button @click="ToggleAddressBtn">{{ toggle_btn }}</el-button>
      </div>
      <div>
        <p :class="[$style.inputText]">계좌 별명</p>
        <input v-model="account_nickname" type="text" />
      </div>
      <el-row>
        <el-button @click="handleModalChange">{{ $t('cancel') }}</el-button>
        <el-button :class="$style.registerBtn" @click="handleFaoriteAccount">
          {{ $t('otp.otp_register') }}
        </el-button>
      </el-row>
    </template>

    <!-- 타 지갑 -->
    <template v-if="section_condition === 'other'">
      <div>
        <p :class="[$style.inputText]">그룹 선택</p>
        <el-select v-model="value_select" placeholder="그룹을 선택해주세요">
          <el-option
            v-for="item in c_condition_group_title"
            :key="item.index"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <p :class="[$style.inputText]">지갑 주소 등록</p>
        <input v-model="input_account_num" :disabled="disabled" />
      </div>
      <div>
        <p :class="[$style.inputText]">계좌 별명</p>
        <input v-model="account_nickname" type="text" />
      </div>
      <el-row>
        <el-button @click="handleModalChange">{{ $t('cancel') }}</el-button>
        <el-button @click="handleFaoriteAccount">{{
          $t('otp.otp_register')
        }}</el-button>
      </el-row>
    </template>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/favorite-address-list.scss';
</style>
