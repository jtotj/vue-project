<script>
import { fetchCertification } from '@apis/kyc'
import date from 'locutus/php/datetime/date'
import fromPairs from 'lodash/fromPairs'
import { mapState } from 'vuex'
export default {
  page: {
    title: 'KycCertificationDetail',
    meta: [
      {
        name: 'description',
        content: 'KycCertificationDetail',
      },
    ],
  },
  data() {
    return {
      info: null,
      fields: null,
      forms: null,
    }
  },
  computed: {
    ...mapState('common', {
      constants: (state) => state.constants,
    }),
  },
  mounted() {
    this.loadKycInfo()
  },
  methods: {
    fromPairs,
    date,
    async loadKycInfo() {
      const ret_obj = await fetchCertification(this.$route.query.seq).catch(
        (e) => this.$toasted.error(e.message)
      )
      this.info = ret_obj.certification_info
      this.fields = ret_obj.field_values
      this.forms = ret_obj.forms
    },
  },
}
</script>

<template>
  <div class="main">
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit">{{ $t('list_detail') }}</span>
      </div>
    </div>
    <div class="orders-wrap">
      <div class="container">
        <div v-if="info" class="create-body">
          <div class="limitation-section">
            <div class="form-group">
              <label>{{ $t('kyc.regdate') }}</label>
              <div class="form-wrap">
                <input
                  class="text-label"
                  readonly
                  :value="date('Y-m-d H:i:s', new Date(info.regdate))"
                />
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('status') }}</label>
              <div class="form-wrap">
                <input
                  class="text-label"
                  readonly
                  :value="
                    fromPairs(constants.kyc.certification.status)[info.status]
                  "
                />
              </div>
            </div>
            <div v-if="info.expdate" class="form-group">
              <label>{{ $t('my_page.expdate') }}</label>
              <div class="form-wrap">
                <input
                  class="text-label"
                  readonly
                  :value="date('Y-m-d H:i:s', new Date(info.expdate))"
                />
              </div>
            </div>
            <div v-if="info.closed_date" class="form-group">
              <label>{{ $t('private.closed_date') }}</label>
              <div class="form-wrap">
                <input
                  class="text-label"
                  readonly
                  :value="date('Y-m-d H:i:s', new Date(info.closed_date))"
                />
              </div>
            </div>
          </div>
          <div
            v-for="form in forms"
            :key="form.seq"
            class="offer-details limitation-section"
          >
            <h4>{{ form.title }}</h4>
            <div class="offer-extra-fields">
              <template v-for="field in fields">
                <div
                  v-if="form.seq === field.form_seq"
                  :key="field.seq"
                  class="form-group"
                >
                  <label>{{ field.title }}</label>
                  <div class="form-wrap">
                    <input
                      v-if="field.value.length !== 0"
                      class="text-label"
                      readonly
                      :value="field.value"
                    />
                    <template v-for="field_option in field.options">
                      <input
                        :key="field_option.seq"
                        class="text-label"
                        readonly
                        :value="field_option.title"
                      />
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="form-group big-btn">
            <a
              :to="{ name: 'bank-kyc-list' }"
              class="btn-default btn-save-offer"
              @click="$router.go(-1)"
            >
              <i class="fa fa-chevron-left"></i> {{ $t('back') }}</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
