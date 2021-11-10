<script>
import { fetchKycCertificationTypeForm } from '@apis/form'
import { createCertification, fetchCertificationTypes } from '@apis/kyc'
import FormFieldFile from '@components/form-field-file'

import map from 'lodash/map'

export default {
  components: { FormFieldFile },

  page: {
    title: 'KycCertification',
    meta: [
      {
        name: 'description',
        content: 'KycCertification',
      },
    ],
  },
  data() {
    return {
      modal_display: false,
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
      const ret_obj = await fetchCertificationTypes({
        type_seq: this.$route.params.type_seq * 1,
      }).catch((e) => this.$toasted.error(e.message))
      this.kyc_type_list = ret_obj.data
    },

    async loadKycForm() {
      const { forms } = await fetchKycCertificationTypeForm({
        target_type: 'KYC_CERTIFICATION',
        type_seq: this.$route.params.type_seq * 1,
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
        type_seq: this.$route.params.type_seq * 1,
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
  },
}
</script>

<template>
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('kyc.kyc_enroll') }}</h2>
      </div>
      <div class="verify-wrap">
        <div :class="[$style.kycTypeListWrap]">
          <ul>
            <li
              v-for="kyc in kyc_type_list"
              :key="kyc.seq"
              :class="[$style.kycTypeList]"
            >
              <router-link
                :to="{
                  name: $route.path.indexOf('bank') !== -1 ? 'kyc' : 'kyc',
                  params: { type_seq: kyc.seq },
                }"
                class="list-item"
                >{{ kyc.title }}</router-link
              >
            </li>
          </ul>
        </div>
        <div :class="[$style.verify]">
          <div class="identity">
            <div class="identity-bot">
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
  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/kyc.scss';
</style>
<style scoped>
.kyc-certification_kycTypeListWrap_145wu
  .kyc-certification_kycTypeList_1eB23
  a.router-link-exact-active {
  font-weight: bold;
  color: #0068c1;
  border-bottom: 1px solid #0068c1;
}

.list-item {
  cursor: auto;
}
</style>
