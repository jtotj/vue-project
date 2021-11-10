<script>
import { mapState } from 'vuex'
import find from 'lodash/find'
import { fetchLevels } from '@apis/security'

export default {
  data() {
    return {
      levels: null,
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),

    c_find_my_level() {
      return find(this.levels, { level: this.currentUser.security_level })
    },
  },
  mounted() {
    this.loadLevels()
  },
  methods: {
    async loadLevels() {
      const { data } = await fetchLevels().catch((e) =>
        this.$toasted.error(e.message)
      )
      this.levels = data
    },
  },
}
</script>

<template>
  <div class="security-rank box-skyblue">
    <i18n class="step" tag="p" path="admin_security">
      <span place="action">{{ currentUser.user_name }}</span>
      <span v-if="c_find_my_level" place="limit" class="color-common">
        {{ c_find_my_level.title }}
      </span>
    </i18n>
    <div class="rank-view">
      <router-link
        :to="{
          name: $route.path.indexOf('bank') !== -1 ? 'security' : 'security',
        }"
      >
        <span>
          {{ $t('my_page.show_security') }}
        </span>
        <span class="icon">
          <img src="@assets/img/longarrow-right-black.svg" alt="화살표" />
        </span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>

<style scoped>
.security-rank {
  margin-bottom: 20px;
}

.security-rank .step {
  float: left;
}

.security-rank .rank-view {
  float: right;
}

.security-rank .rank-view a {
  float: left;
}

.security-rank .rank-view span {
  cursor: pointer;
}

.security-rank .rank-view .icon {
  float: right;
  padding-left: 5px;
}
</style>
