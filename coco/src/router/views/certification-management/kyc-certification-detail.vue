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
  <div class="foreground-container">
    <div class="container">
      <div class="big-title-wrap">
        <h2 class="big-title">{{ $t('list_detail') }}</h2>
      </div>
      <div class="kyc-certification-detail">
        <div v-if="info" class="create-body">
          <div class="form-group">
            <label>{{ $t('kyc.regdate') }}</label>
            <div class="form-wrap">
              {{ date('Y-m-d H:i:s', new Date(info.regdate)) }}
            </div>
          </div>
          <div class="form-group">
            <label>{{ $t('status') }}</label>
            <div class="form-wrap">
              <p>
                {{ fromPairs(constants.kyc.certification.status)[info.status] }}
              </p>
            </div>
          </div>
          <div v-if="info.expdate" class="form-group">
            <label>{{ $t('my_page.expdate') }}</label>
            <div class="form-wrap">
              {{ date('Y-m-d H:i:s', new Date(info.expdate)) }}
            </div>
          </div>
          <div v-if="info.closed_date" class="form-group">
            <label>{{ $t('private.closed_date') }}</label>
            <div class="form-wrap">
              {{ date('Y-m-d H:i:s', new Date(info.closed_date)) }}
            </div>
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
                <p v-if="field.value.length !== 0">
                  {{ field.value }}
                </p>
                <div
                  v-for="field_option in field.options"
                  :key="field_option.seq"
                >
                  <p>
                    {{ field_option.title }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="btn-wrap">
        <router-link :to="{ name: 'kyc-list' }" class="btn-grey">
          <div class="long-arrow">
            <img src="@assets/img/longarrow-left-white.svg" alt="화살표" />
          </div>
          {{ $t('service_center.go_back') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
