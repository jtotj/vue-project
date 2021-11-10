<script>
import appConfig from '@src/app.config'
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  data() {
    return {
      login_interval: null,
    }
  },
  computed: {
    ...mapGetters('common', ['is_inited']),
    ...mapState('common', ['locale']),
    ...mapState('auth', ['access_token']),
    ...mapGetters('auth', ['loggedIn']),
  },
  watch: {
    loggedIn() {
      if (!this.loggedIn) clearInterval(this.login_interval)
      else this.authTokenTimer()
    },
    access_token(val, oldVal) {
      if (oldVal) clearInterval(this.login_interval)
      this.authTokenTimer()
    },
  },
  mounted() {
    if (this.loggedIn) this.authTokenTimer()
  },
  methods: {
    authTokenTimer() {
      if (!this.loggedIn) return
      const decode_token = this.$jwt.decode(this.access_token)
      const exp = moment.unix(decode_token.exp)
      this.login_interval = setInterval(async () => {
        const now = moment()
        if (exp.diff(now, 'seconds') < 5) {
          try {
            await this.$store.dispatch('auth/refreshToken')
          } catch (e) {
            this.$store.dispatch('auth/logOut')
            if (this.$route.meta.authRequired)
              this.$router.push({ name: 'auto-logout' })
          }
        }
      }, 1000)
    },
  },
}
</script>

<template>
  <div id="app" :class="{ loading: !is_inited }">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView v-if="is_inited" :key="`${$route.fullPath}|${locale}`" />
    <vue-loaders-line-scale-pulse-out-rapid
      v-else
      color="#fff"
      size="100px"
    ></vue-loaders-line-scale-pulse-out-rapid>
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

// Design variables and utilities from src/design.
@import '@design';
@import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
body {
  background: $color-body-bg;
}

#nprogress .bar {
  background: $color-link-text;
}
</style>
<style scoped>
.loading {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #272a2f;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
}
</style>
