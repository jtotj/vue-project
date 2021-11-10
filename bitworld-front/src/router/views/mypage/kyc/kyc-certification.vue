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
  <div class="main">
    <!-- 대 타이틀 -->
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('kyc.kyc_enroll') }}</span>
      </div>
    </div>
    <div class="verify-wrap container">
      <div class="kyc-type-list-wrap">
        <ul>
          <li v-for="kyc in kyc_type_list" :key="kyc.seq" class="kyc-type-list">
            <router-link
              :to="{
                name: $route.path.indexOf('bank') !== -1 ? 'bank-kyc' : 'kyc',
                params: { type_seq: kyc.seq },
              }"
              class="list-item"
              >{{ kyc.title }}</router-link
            >
          </li>
        </ul>
      </div>
      <div class="verify">
        <div class="identity">
          <div class="identity-bot">
            <template>
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
                    class="form-group"
                  >
                    <div v-if="field.is_required === 'Y'" class="required-img"
                      >*</div
                    >
                    <label>{{ field.title }}</label>
                    <div class="remi-colorized-field">
                      <template v-if="field.field_type === 'INPUT'">
                        <el-input
                          v-model="form.field_values[idx].value"
                          :placeholder="field.placeholder"
                        ></el-input>
                      </template>
                      <template v-if="field.field_type === 'TEXTAREA'">
                        <textarea
                          v-model="form.field_values[idx].value"
                          :placeholder="field.placeholder"
                          class="form-control"
                        ></textarea>
                      </template>
                      <template v-if="field.field_type === 'RADIO'">
                        <div v-for="option in field.options" :key="option.seq">
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

                    <span class="explanation">{{ field.description }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div class="upload-box">
              <a class="btn" @click="handleSubmit">
                {{ $t('apply') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
