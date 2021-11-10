<script>
import PayCertiNav from '@components/pay-certi-nav'
import SecurityRank from '@components/security-rank'
import { fetchKycCertificationTypeForm } from '@apis/form'
import { createCertification, fetchCertificationTypes } from '@apis/kyc'
import FormFieldFile from '@components/form-field-file'

import map from 'lodash/map'

export default {
  name: 'Certikyc',
  page: {
    title: 'Certikyc',
    meta: [
      {
        name: 'description',
        content: 'Certikyc',
      },
    ],
  },
  components: {
    PayCertiNav,
    FormFieldFile,
    SecurityRank,
  },
  data() {
    return {
      kyc_form: [],
      kyc_type_list: [],
    }
  },
  mounted() {
    Promise.all([this.loadKycForm(), this.loadKycTypeList()]).catch((e) =>
      this.$toasted.error(e.message)
    )
  },
  methods: {
    async loadKycTypeList() {
      const ret_obj = await fetchCertificationTypes().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.kyc_type_list = ret_obj.data
    },
    async loadKycForm() {
      const { forms } = await fetchKycCertificationTypeForm({
        target_type: 'KYC_CERTIFICATION',
        type_seq: this.$route.query.step * 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.kyc_form = map(forms, (form) => ({
        ...form,
        field_values: map(form.fields, (field) => ({
          field_seq: field.seq,
          value: '',
          option_seq: null,
          options: [],
        })),
      }))
    },
    handleSubmit() {
      createCertification({
        type_seq: this.$route.query.step * 1,
        field_values: map(
          [].concat(...map(this.kyc_form, (form) => form.field_values)),
          (field_value) => ({
            ...field_value,
            options: map(field_value.options, (option_seq) => ({
              option_seq,
            })),
          })
        ),
      })
        .then(() => {
          this.$toasted.success(this.$t('toasted_msg.register'))
          this.$router.push({ name: 'myprofile' })
        })
        .catch((e) => this.$toasted.error(e.message))
    },
    getImageSrc(idx) {
      return require('@assets/img/pay-img/img-kyc-' + idx + '.png')
    },
  },
}
</script>

<template>
  <div>
    <div class="pay-container certi-manage cs-center">
      <h4 class="tit">{{ $t('header.certification_management') }}</h4>
      <div class="con-wrap">
        <PayCertiNav></PayCertiNav>
        <div class="right-wrap">
          <div class="kyc-certi-wrap">
            <div
              v-for="(kyc, idx) in kyc_type_list"
              :key="kyc.seq"
              class="kyc-certi-list"
            >
              <router-link
                :to="{
                  name:
                    $route.path.indexOf('pay-certi-manage') !== -1
                      ? 'Certikyc'
                      : 'Certikyc',
                  query: { step: kyc.seq },
                }"
                class="kyc-certi-step"
                :class="{
                  'active-step': $route.query.step === kyc_type_list[idx].seq,
                }"
              >
                <div>
                  <img :src="getImageSrc(idx)" alt="" />
                </div>
                {{ kyc.title }}
              </router-link>
            </div>
          </div>
          <div v-if="$route.query.step" class="kyc-certi-steps">
            <SecurityRank v-if="$route.params"></SecurityRank>
            <form @submit.prevent="handleSubmit">
              <div
                v-for="form in kyc_form"
                :key="form.seq"
                class="offer-details payment-section"
              >
                <h3>{{ form.title }}</h3>
                <p v-html="form.description"></p>
                <div class="offer-extra-fields">
                  <div
                    v-for="(field, idx) in form.fields"
                    :key="field.seq"
                    :class="[$style.formGroup]"
                  >
                    <span
                      v-if="field.is_required === 'Y'"
                      :class="[$style.requiredImg]"
                      >*</span
                    >
                    <label>{{ field.title }}</label>
                    <div class="row">
                      <div>
                        <template v-if="field.field_type === 'INPUT'">
                          <el-input
                            v-model="form.field_values[idx].value"
                            :placeholder="
                              field.title + $t('kyc.kyc_placeholder')
                            "
                            :required="field.is_required === 'Y'"
                          ></el-input>
                        </template>
                        <template v-if="field.field_type === 'TEXTAREA'">
                          <textarea
                            v-model="form.field_values[idx].value"
                            :placeholder="field.placeholder"
                            class="form-control"
                            :required="field.is_required === 'Y'"
                          ></textarea>
                        </template>
                        <template v-if="field.field_type === 'RADIO'">
                          <div
                            v-for="option in field.options"
                            :key="option.seq"
                          >
                            <el-radio
                              v-model="form.field_values[idx].option_seq"
                              :label="option.seq"
                              >{{ option.title }}</el-radio
                            >
                          </div>
                        </template>
                        <template v-if="field.field_type === 'SELECT'">
                          <el-select
                            v-model="form.field_values[idx].option_seq"
                            :clearable="field.is_required !== 'Y'"
                            :placeholder="
                              field.placeholder.length
                                ? field.placeholder
                                : $t('no_select')
                            "
                          >
                            <el-option
                              v-for="option in field.options"
                              :key="option.seq"
                              :label="option.title"
                              :value="option.seq"
                            ></el-option>
                          </el-select>
                        </template>
                        <template v-if="field.field_type === 'CHECKBOX'">
                          <ElCheckboxGroup
                            v-model="form.field_values[idx].options"
                          >
                            <ElCheckbox
                              v-for="option in field.options"
                              :key="option.seq"
                              :label="option.seq"
                              >{{ option.title }}</ElCheckbox
                            >
                          </ElCheckboxGroup>
                        </template>
                        <template v-if="field.field_type === 'FILE'">
                          <FormFieldFile
                            v-model="form.field_values[idx].value"
                            :field_seq="field.seq"
                          ></FormFieldFile>
                        </template>
                        <template v-if="field.field_type === 'MULTISELECT'">
                          <el-select
                            v-model="form.field_values[idx].options"
                            multiple
                          >
                            <el-option
                              v-for="option in field.options"
                              :key="option.seq"
                              :label="option.title"
                              :value="option.seq"
                            ></el-option>
                          </el-select>
                        </template>
                      </div>
                      <div class="explanation">
                        {{ field.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="btn-wrap">
                <button class="btn" type="submit">
                  {{ $t('apply') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
@import '@src/design/service-center.scss';
@import '@src/design/kyc.scss';
</style>
