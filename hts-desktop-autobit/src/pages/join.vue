<template>
    <section class="join" v-loading="loading || signup_loading">
        <div class="box">
            <h2>{{ $t('membership') }}
<span><i class="require">*</i>{{ $t('mypage.mgs_must_do') }}</span></h2>
            <div class="input_group" v-if="!loading">
                <template v-for="field in config.signupForm">
                    <div v-if="field.isIdentifier">
                        <div class="label_input">
                            <label v-show="!params[field.name] || !params[field.name].length" :for="`field_${field.name}`">* {{ field.title }}</label>
                            <input :id="`field_${field.name}`" v-model="params[field.name]" type="text">
                        </div>
                    </div>
                    <div v-else-if="field.name === 'password'">
                        <div class="label_input">
                            <label v-show="!params[field.name] || !params[field.name].length" :for="`field_${field.name}`">* {{ field.title }}</label>
                            <input :id="`field_${field.name}`" v-model="params[field.name]" type="password">
                        </div>
                        <div class="label_input">
                            <label v-show="!params.password2 || !params.password2.length" for="pw_chk">{{ $t('mypage.pwd_check') }}</label>
                            <input id="pw_chk" v-model="params.password2" type="password">
                        </div>
                    </div>
                    <div v-else-if="field.name === 'email_address'">
                        <div class="label_input">
                            <label v-show="!params[field.name] || !params[field.name].length" for="`field_${field.name}`">* {{ field.title }}</label>
                            <input id="`field_${field.name}`" v-model="params[field.name]" type="text">
                        </div>
                        <label><input type="checkbox" v-model="params.allow_mailing" true-value="Y" false-value="N"><span>{{ $t('mypage.mail_receipt_consent') }}</span></label>
                    </div>
                    <div v-else-if="field.name === 'find_account_question'">
                        <p :class="{ require: field.required }"><label for="">{{ field.title }}</label></p>
                        <select v-model="params[field.name]" class="question">
                            <option value="">{{ $t('mypage.cmd_pwd_question_selection') }}</option>
                            <option v-for="(item, idx) in config.find_account_question_items" :value="idx">{{ item }}</option>
                        </select>
                        <input type="text">
                    </div>
                    <div v-else-if="field.name === 'birthday'">
                        <div>
                            <p :class="{ require: field.required }"><label for="">{{ field.title }}</label></p>
                            <masked-input v-model="params[field.name]" style="font-family: monospace;" mask="1111-11-11" placeholder="생년월일" type="text" />
                            <button @click="params[field.name] = null" type="button">{{ $t('mypage.delete') }}</button>
                        </div>
                    </div>
                    <div v-else-if="field.type === 'tel'">
                        <div class="phone">
                            <p :class="{ require: field.required }"><label for="">{{ field.title }}</label></p>
                            <input :id="`field_${field.name}`" v-model="params[field.name][0]" type="text"> -
                            <input v-model="params[field.name][1]" type="text"> -
                            <input v-model="params[field.name][2]" type="text">
                        </div>
                    </div>
                    <div v-else-if="field.type === 'select'">
                        <div>
                            <p :class="{ require: field.required }"><label for="">{{ field.title }}</label></p>
                            <select v-model="params[field.name]">
                                <option value="">{{ $t('mypage.select') }}</option>
                                <option v-for="val in field.default_value" :value="val">{{ val }}</option>
                            </select>
                            <p v-if="field.description && field.description.length">{{ field.description }}</p>
                        </div>
                    </div>
                    <div v-else-if="field.name === 'inviter_code'">
                        <div class="label_input">
                            <label v-show="(!params[field.name] || !params[field.name].length) && !preset_inviter_code" :for="`field_${field.name}`">
                                <template v-if="field.required">*</template>
                                {{ field.title }}
                            </label>
                            <input v-if="preset_inviter_code" :id="`field_${field.name}`" :value="preset_inviter_code" disabled type="text">
                            <input v-else :id="`field_${field.name}`" v-model="params[field.name]" type="text">
                            <p v-if="field.description && field.description.length">{{ field.description }}</p>
                        </div>
                    </div>
                    <div v-else>
                        <div class="label_input">
                            <label v-show="!params[field.name] || !params[field.name].length" :for="`field_${field.name}`">
                                <template v-if="field.required">*</template>
                                {{ field.title }}
                            </label>
                            <input :id="`field_${field.name}`" v-model="params[field.name]" type="text">
                            <p v-if="field.description && field.description.length">{{ field.description }}</p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="box">
            <h2>{{ $t('mypage.join_clause') }}</h2>
            <perfect-scrollbar class="terms" v-html="config.agreement"></perfect-scrollbar>
            <label><input v-model="params.accept_agreement" true-value="Y" false-value="N" type="checkbox"><span>{{ $t('mypage.msg_clause_agreement') }}</span></label>
        </div>
        <div class="join_btn">
            <button @click.prevent="submit" type="button">{{ $t('mypage.registration_complete') }}</button>
        </div>
    </section>
</template>

<style>
.mx-calendar-header > a { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo'; }
</style>
<style scoped>
/* 회원가입 */
.join {padding-top:50px; background:#e9ecf1; height:auto !important;}
.join > .box {max-width:580px; margin:0 auto 25px; padding:13px 35px 23px; background:#fff}
.join h2 {height:40px; margin-top:20px; border-bottom:1px solid #ddd; font-size:20px; font-weight:bold}
.join h2 > span {margin-left:20px; font-size:13px; font-weight:normal}
.join i.require {position:relative; color:#f00; margin-right:3px}
.join input[type=text],
.join input[type=password] {box-sizing:border-box; height:40px; line-height:40px; border:1px solid #ddd; padding:0 10px 0 20px; font-size:15px}
.input_group {padding:30px 0}
.input_group > div {font-size:0; margin-bottom:15px}
.input_group > div > label {height:40px; margin-left:20px; line-height:40px; vertical-align:top}
.input_group > div > label > input[type=checkbox] + span {height:40px; line-height:40px}
.input_group > div > label > input[type=checkbox] + span:before {top:10px}
.input_group p {margin:7px 0 5px}
.input_group p > label {padding-left:0}
.input_group p.require > label:before {content:'*'; display:inline; margin-right:5px; color:#f00}

.row {display:block}
.label_input {display:inline-block; position:relative}
.label_input + .label_input,
.label_input + label {margin-left:0 !important}
.label_input:first-child {margin-right:10px;}
.label_input > label {position: absolute; left: 10px; height:40px; margin:0; padding:0; line-height: 40px; font-size: 13px; color: #848484}
.input_group select {min-width:100px; height: 40px; line-height: 38px; box-sizing: border-box; -moz-box-sizing: border-box; border: 1px solid #cdcdcf; padding-left: 10px; padding-right: 30px; font-size: 14px; cursor:pointer}
.input_group select + input {margin-left:0px;}
.input_group select { margin-right: 10px; }
.input_group button {width:60px; height:40px; margin-left:10px; border:1px solid #2D3D51; color:#fff; background:#2D3D51}

.input_group .phone > input {width:80px}
.input_group .phone > i {font-size:13px; margin:0 5px}
.join .terms {overflow:auto; height:180px; margin-bottom:15px; padding:7px; border:1px solid #d3d3d3; background:none;flex-flow: column;}
.input_group label > input[type=checkbox] + span  { display:inline-block;line-height:20px;padding-left:7px;vertical-align:middle; }

.join_btn {max-width:650px; margin:0 auto; padding-bottom:70px; text-align:center}
.join_btn > button {width:100%; padding:10px; border:1px solid #f30000; border-radius:7px; font-size:18px; color:#fff; background-color:#f30000}
.join_btn > button:hover {background:#fff; color:#ff2544}
</style>

<script>
import _ from 'lodash'
import DatePicker from 'vue2-datepicker'
import MaskedInput from 'vue-masked-input'
import { mapState } from 'vuex';
import { fetchConfig, createMember } from '@/api/member'

export default {
    name: 'join',
    components: { DatePicker, MaskedInput },
    data() {
        return {
            loading: false,
            signup_loading: false,
            config: {},
            params: {
                allow_mailing: 'N',
                password2: '',
            },
            lang: {
              days: [this.$t('mypage.sunday'), this.$t('mypage.monday'), this.$t('mypage.tuesday'), this.$t('mypage.wednesday'), this.$t('mypage.thursday'), this.$t('mypage.friday'), this.$t('mypage.saturday')],
                months: [this.$t('mypage.january'), this.$t('mypage.february'), this.$t('mypage.march'), this.$t('mypage.april'), this.$t('mypage.may'), this.$t('mypage.june'), this.$t('mypage.july'), this.$t('mypage.august'), this.$t('mypage.september'), this.$t('mypage.october'), this.$t('mypage.november'), this.$t('mypage.december')],
                pickers: [this.$t('mypage.next_7day'), this.$t('mypage.next_30day'), this.$t('mypage.recently_7day'), this.$t('mypage.recently_30day')],
                placeholder: {
                    date: this.$t('mypage.date_selection'),
                    dateRange: this.$t('mypage.section_select')
                },
            },
        }
    },
    mounted() {
        this.loadConfig();
    },
    computed: {
        ...mapState({
            preset_inviter_code: ({ common }) => common.inviter_code,
        }),
    },
    methods: {
        submit() {
            this.signup_loading = true;
            return createMember(this.params).then(ret_obj => {
                this.$toasted.success(this.$t('mypage.msg_membership_complete'));
                // this.signup_loading = false;
                return this.$store.dispatch('LoginByUserId', this.params);
            }).then(() => {
                this.$router.replace(this.$route.query.return_url || '/');
            }).catch(() => {
                this.signup_loading = false;
            })
        },
        loadConfig() {
            this.loading = true;
            return fetchConfig().then(ret_obj => {
                this.config = _.omit(ret_obj, 'error', 'message');

                this.config.signupForm.forEach(({ name, type, default_value }) => {
                    if(type === 'tel') this.$set(this.params, name, ['', '', '']);
                    else if(name === 'birthday') this.$set(this.params, name, null);
                    else if(name === 'inviter_code') this.$set(this.params, name, this.preset_inviter_code);
                    // if(type === 'select') this.$set(this.params, name, default_value[0]);
                    else this.$set(this.params, name, '');
                })

                this.loading = false;
            }).catch(() => {
                this.loading = false;
            })
        }
    }
}
</script>
