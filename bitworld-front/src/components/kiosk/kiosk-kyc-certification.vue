<script>
import '@assets/css/kiosk/kiosk-certified.css'
import { fetchKycCertificationTypeForm } from '@apis/form'
import { createCertification, fetchCertificationTypes } from '@apis/kyc'
import FormFieldFile from '@components/form-field-file'
import map from 'lodash/map'

export default {
  components: { FormFieldFile },
  data() {
    return {
      modal_display: false,
      kyc_form: [],
      kyc_type_list: [],
      s_kyc_type_seq: 0,

      tab_value: '0',
    }
  },
  watch: {
    s_kyc_type_seq() {
      this.loadKycForm()
    },
  },
  mounted() {
    Promise.all([this.loadKycTypeList()])
      .then(() => {
        this.loadKycForm()
        this.tab_value = String(this.kyc_type_list[0].seq)
        this.s_kyc_type_seq = this.kyc_type_list[0].seq
      })
      .catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
  },
  methods: {
    async loadKycTypeList() {
      const ret_obj = await fetchCertificationTypes().catch((e) =>
        this.$toasted.error(e.message, {
          theme: 'toasted-primary',
          containerClass: 'kiosk-toasted',
        })
      )
      this.kyc_type_list = ret_obj.data
    },

    async loadKycForm() {
      if (this.kyc_type_list.length) {
        const { forms } = await fetchKycCertificationTypeForm({
          target_type: 'KYC_CERTIFICATION',
          type_seq: this.s_kyc_type_seq,
        }).catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
        this.kyc_form = map(forms, (form) => ({
          ...form,
          field_values: map(form.fields, (field) => ({
            field_seq: field.seq,
            value: '',
            option_seq: null,
            options: [],
          })),
        }))
      }
    },
    handleSubmit() {
      createCertification({
        type_seq: this.s_kyc_type_seq,
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
          this.$toasted.success(this.$t('toasted_msg.register'), {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
          this.$emit('drawer_close')
        })
        .catch((e) =>
          this.$toasted.error(e.message, {
            theme: 'toasted-primary',
            containerClass: 'kiosk-toasted',
          })
        )
    },
    handleClick(tab) {
      this.s_kyc_type_seq = Number(tab.name)
    },
  },
}
</script>

<template>
  <div :class="$style.kioskCertified" class="kiosk-certified">
    <div :class="$style.container">
      <div :class="$style.kioskCertifiedKyc" class="kiosk-certified-kyc">
        <el-tabs v-model="tab_value" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="kyc_type in kyc_type_list"
            :key="kyc_type.seq"
            :name="String(kyc_type.seq)"
            :label="kyc_type.title"
          >
            <PerfectScrollbar
              :class="$style.perfectScrollbar"
              class="kyc-scrollbar"
            >
              <div :class="$style.kioskKyc">
                <template v-for="form in kyc_form">
                  <div
                    v-for="(field, idx) in form.fields"
                    :key="field.seq"
                    class="kiosk-kyc-form kiosk-select-box"
                  >
                    <h2
                      >{{ field.title }}
                      <strong v-if="field.is_required === 'Y'">*</strong></h2
                    >
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
                      <template v-for="option in field.options">
                        <el-radio
                          :key="option.seq"
                          v-model="form.field_values[idx].option_seq"
                          :label="option.seq"
                          >{{ option.title }}</el-radio
                        >
                      </template>
                    </template>
                    <template v-if="field.field_type === 'SELECT'">
                      <el-select
                        v-model="form.field_values[idx].option_seq"
                        :clearable="field.is_required !== 'Y'"
                        :placeholder="
                          field.placeholder.length
                            ? field.placeholder
                            : $t('kiosk.no_choice')
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
                      <ElCheckboxGroup v-model="form.field_values[idx].options">
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
                        :class="$style.formFIle"
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
                </template>
              </div>
              <div class="transfer">
                <el-button @click="handleSubmit">{{ $t('apply') }}</el-button>
              </div>
            </PerfectScrollbar>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/kiosk/kiosk-certified.scss';
</style>
