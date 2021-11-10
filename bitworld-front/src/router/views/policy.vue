<script>
import { mapState } from 'vuex'
import fromPairs from 'lodash/fromPairs'
import filter from 'lodash/filter'

export default {
  page: {
    title: 'Policy',
    meta: [{ name: 'description', content: 'Policy' }],
  },
  data() {
    return {
      menu_tab: this.$route.params.type.toUpperCase(),
    }
  },
  computed: {
    ...mapState('common', { constants: (state) => state.constants }),
    ...mapState('common', { config: (state) => state.config }),
    c_display_terms() {
      return filter(this.config.terms, { display: 'Y' })
    },
  },
  methods: {
    fromPairs,
    toRoute(p) {
      this.$router.push({
        name: 'policy',
        params: {
          type: p,
        },
      })
    },
  },
}
</script>

<template>
  <div class="main">
    <!-- main 시작 -->
    <div class="big-tit-wrap">
      <div class="container">
        <span class="big-tit"></span>
      </div>
    </div>
    <div class="policy-wrap">
      <div class="container">
        <div class="tit-box">
          <template v-for="list in config.terms">
            <h1
              v-if="menu_tab === list.type"
              :key="list.type"
              class="policy-tit"
              >{{ fromPairs(constants.service.term_types)[list.type] }}</h1
            >
          </template>
        </div>
        <div class="cont-box">
          <div class="policy-box">
            <div class="policy-nav">
              <ul>
                <template v-for="list in c_display_terms">
                  <li
                    :key="list.type"
                    :class="{ active: menu_tab === list.type }"
                  >
                    <a @click="toRoute(list.type.toLowerCase())">{{
                      fromPairs(constants.service.term_types)[list.type]
                    }}</a>
                  </li>
                </template>
              </ul>
            </div>
            <div class="pre-scrollable-box">
              <template v-for="list in c_display_terms">
                <p
                  v-if="menu_tab === list.type && list.display === 'Y'"
                  :key="list.type"
                  class="pre-scrollable"
                  v-html="list.content"
                >
                </p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div> </div
  ><!-- main 끝 -->
</template>
