<script>
export default {
  data() {
    return {
      menu: null,
    }
  },
  methods: {
    menuOpen(params) {
      this.menu = params
    },
  },
}
</script>

<template>
  <nav class="sub-nav">
    <ul class="tab-nav">
      <li
        :class="[
          'main-menu',
          {
            active: $route.path.indexOf('manage') !== -1,
            expand: menu === 'manage',
          },
        ]"
        @mouseover="menuOpen('manage')"
        @mouseleave="menuOpen"
      >
        <a
          >관리
          <span class="icon icon-arrow"></span>
        </a>
        <ul v-if="menu === 'manage'" class="dropdown-menu">
          <li>
            <router-link :to="{ name: 'invoice-manage' }"
              >인보이스 관리</router-link
            >
          </li>
          <li>
            <a>반복 시리즈 관리</a>
          </li>
          <li>
            <a>견적 관리</a>
          </li>
        </ul>
      </li>
      <li
        :class="[
          'main-menu',
          {
            active: $route.path.indexOf('create') !== -1,
            expand: menu === 'create',
          },
        ]"
        @mouseover="menuOpen('create')"
        @mouseleave="menuOpen"
      >
        <a
          >생성
          <span class="icon-arrow"></span>
        </a>
        <ul v-if="menu === 'create'" class="dropdown-menu">
          <li>
            <router-link :to="{ name: 'invoice-create' }"
              >인보이스 생성</router-link
            >
          </li>
          <li>
            <a>견적 생성</a>
          </li>
        </ul>
      </li>
      <li
        :class="['main-menu', { active: $route.path.indexOf('items') !== -1 }]"
      >
        <router-link :to="{ name: 'invoice-items' }">상품</router-link>
      </li>
      <li
        :class="[
          'main-menu',
          {
            active: $route.path.indexOf('setting') !== -1,
            expand: menu === 'setting',
          },
        ]"
        @mouseover="menuOpen('setting')"
        @mouseleave="menuOpen"
      >
        <a
          >설정
          <span class="icon-arrow"></span>
        </a>
        <ul v-if="menu === 'setting'" class="dropdown-menu">
          <li>
            <router-link :to="{ name: 'invoice-contact-book' }"
              >주소록</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'invoice-business-info' }"
              >비즈니스 정보</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'invoice-taxes' }">세금 정보</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'invoice-template' }">템플릿</router-link>
          </li>
        </ul>
      </li>
      <li
        :class="[
          'main-menu',
          {
            active: $route.path.indexOf('help') !== -1,
          },
        ]"
      >
        <router-link :to="{ name: 'invoice-features-help' }"
          >도움말</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" module>
@import '@design';
</style>
