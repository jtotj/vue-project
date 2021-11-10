<script>
import '@assets/css/register.css'
import { createMember, validateMemberParameter } from '@apis/member'
import { fetchMemberConfig } from '@apis/config'
import LocaleSelect from '@components/LocaleSelect'
import fromPairs from 'lodash/fromPairs'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  components: {
    LocaleSelect,
  },
  data() {
    return {
      params: {
        user_id: '',
        password: '',
        confirm_password: '',
        inviter_identifier: '',
        user_name: '',
        email_address: '',
        email_sample: '',
      },
      loading: false,
      check_list: [],
      list_length: '',
      step: null,
      is_focus: null,
      is_focus_sample: null,
      active: 1,
      checkAll: false,
      checkedTerms: [],
      terms: [
        {
          required: this.$t('required'),
          content: this.$t('register_title'),
        },
        {
          required: this.$t('required'),
          content: this.$t('register_title_2'),
        },
        {
          required: this.$t('required'),
          content: this.$t('register_title_3'),
          explanation: this.$t('register_msg_4'),
        },
        {
          required: this.$t('option'),
          content: this.$t('register_title_4'),
        },
        {
          required: this.$t('required'),
          content: this.$t('register_title_5'),
        },
        {
          required: this.$t('option'),
          content: this.$t('register_title_6'),
        },
        {
          required: this.$t('option'),
          content: this.$t('register_title_7'),
        },
      ],
      isIndeterminate: false,
      dialog_visible: false,
      dialog_visible_index: null,

      validation_message_id: null,
      validation_message_email: null,
      validation_message_inviter_identifier: null,

      member_config: null,
    }
  },
  computed: {
    ...mapState('common', {
      config: (state) => state.config,
    }),
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
    ...mapState('common', { inviter_code: (state) => state.inviter_code }),
    c_is_required_list() {
      return _.chain(this.c_terms_list)
        .filter(
          (data) =>
            data.is_required === 'Y' || data.required === this.$t('required')
        )
        .map((data) => {
          return data
        })
        .value()
    },
    c_sample_required_list() {
      return _.chain(this.terms)
        .filter((data) => data.required === this.$t('required'))
        .map((data) => {
          return data
        })
        .value()
    },
    c_use_signup() {
      if (this.config) {
        return _.chain(this.config.terms)
          .filter((data) => data.use_signup === 'Y')
          .map((data) => {
            return data
          })
          .value()
      } else {
        return []
      }
    },
    c_check_terms() {
      return _.every(
        this.c_is_required_list,
        (service) => this.checkedTerms.indexOf(service) !== -1
      )
    },

    c_input_check() {
      if (
        this.params.user_id &&
        this.params.password &&
        this.params.confirm_password &&
        this.params.user_name &&
        this.params.email_address &&
        this.params.email_sample
      ) {
        return true
      } else {
        return false
      }
    },
    c_terms_list() {
      if (this.c_use_signup) {
        let list = this.c_use_signup.slice()
        list.push(this.terms[0])
        return list
      } else {
        return []
      }
    },
  },

  watch: {
    check_list: {
      handler(val, oldVal) {
        if (val.length < oldVal.length) {
          this.check_all = false
        }
        if (val.length === this.c_use_signup.length) {
          this.check_all = true
        }
      },
      deep: true,
    },

    step() {
      if (this.step === 'confirm') {
        this.params.email_address =
          this.params.email_address + '@' + this.params.email_sample
      } else if (this.step === 'input') {
        this.params.email_address = this.params.email_address.substring(
          0,
          this.params.email_address.indexOf('@') + 0
        )
      }
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      Promise.all([this.loadMemberConfig()])
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
      if (this.inviter_code) this.params.inviter_identifier = this.inviter_code
    },
    async loadMemberConfig() {
      const { config } = await fetchMemberConfig()

      this.member_config = config
    },
    handleSubmit() {
      this.loading = true

      createMember({
        user_id: this.params.user_id,
        email_address: this.params.email_address,
        user_name: this.params.user_name,
        password: this.params.password,
        confirm_password: this.params.confirm_password,
        inviter_identifier: this.params.inviter_identifier,
      })
        .then(() => {
          this.$toasted.success(this.$t('register_success'))
          this.$router.push({
            name: 'home',
          })
        })
        .catch((e) => this.$toasted.error(e.message))
        .finally(() => {
          this.loading = false
        })
    },
    // checkAll() {
    //   this.check_list = []
    //   if (!this.check_all) {
    //     for (var i = 0; i < this.c_use_signup.length; i++) {
    //       this.check_list.push(this.c_use_signup[i])
    //     }
    //   }
    // },
    handleCheckAllChange(val) {
      this.checkedTerms = val ? this.c_terms_list : []
      this.isIndeterminate = false
    },
    handleCheckedTermsChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.c_terms_list.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.c_terms_list.length
    },
    fromPairs,
    goHome() {
      this.$router.push({
        name: 'home',
      })
    },
    oepnDialogVisible(e, index) {
      this.dialog_visible_index = index
      this.dialog_visible = true
    },
    handleAgree() {
      if (!this.c_check_terms) {
        this.$toasted.show(this.$t('required_check'))
      } else if (this.c_check_terms) {
        this.step = 'input'
      }
    },
    handleNext() {
      if (!this.c_input_check) {
        this.$toasted.show(this.$t('check_input'))
      } else if (
        this.validation_message_id !== null ||
        this.validation_message_email !== null
      ) {
        this.$toasted.show(this.$t('toasted_msg.duplicate_check'))
      } else {
        this.step = 'confirm'
      }
    },
    handleValidationId() {
      validateMemberParameter({
        name: 'user_id',
        value: this.params.user_id,
      })
        .then((this.validation_message_id = null))
        .catch((e) => {
          this.validation_message_id = e.message
        })
    },
    handleValidationEmail() {
      if (
        this.params.email_address.length !== 0 &&
        this.params.email_sample.length !== 0
      ) {
        this.email_valid_check_data =
          this.params.email_address + '@' + this.params.email_sample
        validateMemberParameter({
          name: 'email_address',
          value: this.email_valid_check_data,
        })
          .then((this.validation_message_email = null))
          .catch((e) => {
            this.validation_message_email = e.message
          })
      }
    },
    handleValidationInviterIdentifier() {
      validateMemberParameter({
        name: 'inviter_identifier',
        value: this.params.inviter_identifier,
      })
        .then((this.validation_message_inviter_identifier = null))
        .catch((e) => {
          this.validation_message_inviter_identifier = e.message
        })
    },
  },
}
</script>

<template>
  <div class="main">
    <div
      v-loading="loading"
      :class="[$style.registerWrap]"
      class="register-wrap"
    >
      <div :class="[$style.container]">
        <div class="membership-explanation">
          <div class="go-back">
            <div class="arrow-wrap">
              <a>
                <img
                  src="@assets/img/longarrow-left-black.svg"
                  alt="화살표"
                  @click="$router.go(-1)"
                />
              </a>
            </div>
            <div class="logo-wrap">
              <router-link :to="{ name: 'home' }">
                <img src="@assets/img/cocobank-logo.svg" alt="로고" />
              </router-link>
            </div>
          </div>
          <h2 v-html="$t('register_msg_1')"></h2>
          <p>{{ $t('register_msg_3') }}</p>
        </div>
        <div class="localeSelectWrap">
          <LocaleSelect class="localeSelect"></LocaleSelect>
        </div>

        <form v-if="step === null" :class="[$style.agreeForm]">
          <template v-if="c_use_signup">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
              >{{ $t('all_agree') }}</el-checkbox
            >
            <p class="add-explanation" v-html="$t('register_msg_all')"></p>
            <el-checkbox-group
              v-model="checkedTerms"
              class="terms-wrap"
              @change="handleCheckedTermsChange"
            >
              <template v-for="(term, index) in terms.slice(0, 1)">
                <div :key="index">
                  <el-checkbox :class="[$style.checkLabel]" :label="term">
                    <span v-if="index !== 0">{{ term.required }}</span>
                    <span class="checkbox-content">{{ term.content }}</span>
                  </el-checkbox>
                </div>
              </template>
              <template v-for="(term, idx) in c_use_signup">
                <div :key="term.type">
                  <el-checkbox :class="[$style.checkLabel]" :label="term">
                    <span>{{
                      term.is_required === 'Y' ? $t('required') : $t('option')
                    }}</span>
                    <span class="checkbox-content">{{
                      fromPairs(constants.service.term_types)[term.type]
                    }}</span>
                  </el-checkbox>
                  <div class="img-wrap" @click="oepnDialogVisible($event, idx)">
                    <img src="@assets/img/arrow-right.svg" />
                  </div>
                </div>
              </template>
            </el-checkbox-group>
          </template>

          <div :class="[$style.btnWrap]" style="text-align:right;">
            <button
              :class="[$style.nextBtn, { disabled: !c_check_terms }]"
              @click.prevent="handleAgree"
              >{{ $t('agree') }}</button
            >
          </div>
        </form>

        <form
          v-if="step === 'input'"
          :class="[$style.inputForm]"
          class="input-form"
        >
          <div class="brief">
            <h3 v-html="$t('register_title_8')"></h3>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'id' },
                { hasValue: params.user_id.length !== 0 },
              ]"
            >
              <label for="user_id" :class="[$style.textLabel]">{{
                $t('id')
              }}</label>
              <input
                id="user_id"
                v-model="params.user_id"
                type="text"
                :class="[$style.formControl]"
                :placeholder="$t('input.id')"
                @blur="handleValidationId"
              />
              <div v-if="validation_message_id" :class="[$style.validation]">
                {{ validation_message_id }}
              </div>
            </div>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'password' },
                { hasValue: params.password.length !== 0 },
              ]"
            >
              <label for="password" :class="[$style.textLabel]">{{
                $t('password')
              }}</label>
              <input
                id="password"
                v-model="params.password"
                type="password"
                :class="[$style.formControl]"
                :placeholder="$t('input.password')"
                @focus="is_focus = 'password'"
                @blur="is_focus = null"
              />
            </div>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'confirm' },
                { hasValue: params.confirm_password.length !== 0 },
              ]"
            >
              <label for="confirm_password" :class="[$style.textLabel]">{{
                $t('repeat_password')
              }}</label>
              <input
                id="confirm_password"
                v-model="params.confirm_password"
                type="password"
                :class="[$style.formControl]"
                :placeholder="$t('input.repeat_password')"
                @focus="is_focus = 'confirm'"
                @blur="is_focus = null"
              />
            </div>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'name' },
                { hasValue: params.user_name.length !== 0 },
              ]"
            >
              <label for="user_name" :class="[$style.textLabel]">{{
                $t('my_page.user_name')
              }}</label>
              <input
                id="user_name"
                v-model="params.user_name"
                type="text"
                :class="[$style.formControl]"
                :placeholder="$t('input.user_name')"
                @focus="is_focus = 'name'"
                @blur="is_focus = null"
              />
              <div class="explanation">
                {{ $t('register_user_name_tit') }}
              </div>
            </div>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'email' },
                { isFocusSample: is_focus_sample === 'email-sample' },
                { hasValue: params.email_address.length !== 0 },
                { hasValueSample: params.email_sample.length !== 0 },
              ]"
            >
              <label for="email" :class="[$style.textLabel]">{{
                $t('my_page.email_address')
              }}</label>
              <div class="email-wrap">
                <div class="email">
                  <input
                    id="email"
                    v-model="params.email_address"
                    type="text"
                    :class="[$style.formControl]"
                    :placeholder="$t('input.email_address')"
                    @blur="handleValidationEmail"
                  />
                </div>
                <div class="email-sample">
                  <span class="whelk">@</span>
                  <input
                    id="email-sample"
                    v-model="params.email_sample"
                    type="text"
                    :class="[$style.formControl]"
                    placeholder="sample.com"
                    @blur="handleValidationEmail"
                  />
                </div>
                <div
                  v-if="validation_message_email"
                  :class="[$style.validation]"
                >
                  {{ validation_message_email }}
                </div>
                <div class="explanation">
                  {{ $t('register_password_tit') }}
                </div>
              </div>
            </div>
            <div
              :class="[
                $style.formWrap,
                { isFocus: is_focus === 'inviter_identifier' },
                { hasValue: params.inviter_identifier.length !== 0 },
              ]"
            >
              <label for="inviter_identifier" :class="[$style.textLabel]">{{
                fromPairs(constants.member.inviter_identifiers)[
                  member_config.inviter_identifier
                ]
              }}</label>
              <input
                id="inviter_identifier"
                v-model="params.inviter_identifier"
                type="text"
                :class="[$style.formControl]"
                :disabled="inviter_code"
                :placeholder="
                  fromPairs(constants.member.inviter_identifiers)[
                    member_config.inviter_identifier
                  ]
                "
                @blur="handleValidationInviterIdentifier"
              />
              <div
                v-if="validation_message_inviter_identifier"
                :class="[$style.validation]"
              >
                {{ validation_message_inviter_identifier }}
              </div>
            </div>
            <div :class="[$style.btnWrap]">
              <button
                :class="[$style.nextBtn, { disabled: !c_input_check }]"
                @click.prevent="handleNext"
                >{{ $t('next') }}</button
              >
            </div>
          </div>
        </form>

        <form
          v-if="step === 'confirm'"
          :class="[$style.inputForm]"
          class="input-form"
        >
          <div class="brief">
            <h3 class="tit">
              <span>{{ $t('register_title_9') }}</span>
            </h3>
            <div class="profileListWrap">
              <div class="profileList">
                <div class="listLeft">{{ $t('id') }}</div>
                <div class="listRight">
                  <strong class>{{ params.user_id }}</strong>
                </div>
              </div>
              <div class="profileList password">
                <div class="listLeft">{{ $t('password') }}</div>
                <div class="listRight">
                  <input
                    type="password"
                    class="text-label"
                    readonly
                    :value="params.password"
                  />
                </div>
              </div>
              <div class="profileList">
                <div class="listLeft">{{ $t('my_page.user_name') }}</div>
                <div class="listRight">
                  <strong class>{{ params.user_name }}</strong>
                </div>
              </div>
              <div class="profileList">
                <div class="listLeft">{{ $t('my_page.email_address') }}</div>
                <div class="listRight">
                  <strong class>{{ params.email_address }}</strong>
                </div>
              </div>
            </div>
            <div class="btn-wrap">
              <button class="btn-grey" @click="step = 'input'">{{
                $t('before')
              }}</button>
              <button class="btn" @click.prevent="handleSubmit">{{
                $t('register')
              }}</button>
            </div>
          </div>
        </form>

        <!-- <form v-if="step === 'success'" :class="[$style.inputForm]">
        <div :class="[$style.msgArea]">
          <p :class="[$style.msg]">회원가입 되었습니다</p>
          <div :class="[$style.btnWrap]">
            <button
              type="button"
              :class="[$style.registerButton]"
              @click="goHome"
              >메인으로 이동</button
            >
          </div>
        </div>
      </form>-->
      </div>
    </div>
    <el-dialog
      v-if="dialog_visible_index !== null"
      :title="
        fromPairs(constants.service.term_types)[
          c_use_signup[dialog_visible_index].type
        ]
      "
      :visible.sync="dialog_visible"
    >
      <div v-html="c_use_signup[dialog_visible_index].content"></div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.validation {
  padding-top: 5px;
  font-size: 12px;
  line-height: 20px;
  color: red;
}
.registerWrap {
  position: relative;
  box-sizing: border-box;
  max-width: 450px;
  padding: 50px 0;
  margin: 50px auto;
  background: #fff;
}
.registerTitle {
  margin: 0;
  margin-bottom: 20px;
  font-size: 30px;
}

.tit {
  margin-top: 35px;
  font-size: 38px;
  font-weight: bold;
  line-height: 1.2;
  color: #333;
  text-align: center;
  letter-spacing: -0.09em;
}

.agreeForm {
  box-sizing: border-box;
  width: 450px;
  margin: 0 auto;
}

.stepBtn {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  height: 50px;
  padding: 0 20px;
  overflow: hidden;
  font-weight: bold;
  line-height: 46px;
  color: #fff;
  text-align: center;
  background: #0068c1;
  border: 2px solid #0068c1;
  border-radius: 2px;
}

.formWrap {
  position: relative;
  padding-bottom: 10px;
  overflow: hidden;
}

.textLabel {
  display: block;
  padding: 5px 0;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  white-space: nowrap;
  -webkit-transition: opacity 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
}

.formControl:focus {
  outline: rgba(0, 0, 0, 0);
}
.inputForm {
  position: relative;
  box-sizing: border-box;
  width: 450px;
  padding: 0 !important;
  margin: 0 auto;
}

.inputRegister {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 50px;
  border-radius: 3px;
  transition: box-shadow 0.1s ease, -webkit-box-shadow 0.1s ease;
}

.registerLink {
  margin-right: 10px;
  margin-bottom: 30px;
  cursor: pointer;
}

.registerButton {
  width: calc(50% - 5px);
  height: 50px;
  padding: 0 20px;
  margin-right: 10px;
  font-weight: bold;
  line-height: 46px;
  color: #fff !important;
  text-align: center;
  cursor: pointer;
  background: #0068c1;
  border: 2px solid #0068c1;
  border-radius: 2px;
}

.btnWrap {
  margin-top: 20px;
  &::after {
    display: block;
    clear: both;
    content: '';
  }
  .inputBtn {
    width: 100%;
    height: 50px;
    padding: 15px;
    margin-right: 10px;
    font-size: 16px;
    font-weight: normal;
    line-height: 10px;
    color: #666 !important;
    text-align: center;
    cursor: pointer;
    background-color: #eee;
    border: none;
    border-radius: 2px;

    &:first-child {
      &::before {
        position: absolute;
        top: 50%;
        left: 10px;
        display: block;
        width: 8px;
        height: 14px;
        margin-top: -7px;
        overflow: hidden;
      }
    }

    &:last-child {
      margin-right: 0;

      &::before {
        position: absolute;
        top: 50%;
        right: 10px;
        display: block;
        width: 8px;
        height: 14px;
        margin-top: -7px;
        overflow: hidden;
      }
    }
  }
}

.nextBtn {
  width: 100%;

  &.disabled {
    color: #666 !important;
    background-color: #eee !important;
    border: none;
  }
}

.btnWrap .registerButton:last-child {
  margin-right: 0;
}

.registerButton:hover {
  background: #ea4624;
  border: none;
}

.registerButton:disabled {
  background-color: #ea4624 !important;
  border: none !important;
}

.contentWrap {
  box-sizing: border-box;
  height: 230px;
  padding: 15px;
  margin: 15px 0;
  overflow-y: auto;
  font-family: 'Malgun Gothic';
  font-size: 12px;
  line-height: 1.6;
  color: #666;
  letter-spacing: -1px;
  background-color: #f4f4f4;
  border-radius: 5px;
}

.checkText {
  margin-left: 5px;
  font-size: 14px;
  color: #666;
}

.msg {
  font-size: 23px;
}

.msgArea {
  box-sizing: border-box;
  min-height: 280px;
  padding: 140px 15px 60px;
  color: #333;
  text-align: center;
  background-color: #fff;
  background-image: url(@assets/img/msg_success.png);
  background-repeat: no-repeat;
  background-position: center 60px;
}
.container {
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .inputForm {
    width: 100%;
  }
  .agreeForm {
    width: 100%;
  }
  .container {
    padding: 0 5%;
  }
  .registerWrap {
    margin: 0 auto;
  }
}
</style>
