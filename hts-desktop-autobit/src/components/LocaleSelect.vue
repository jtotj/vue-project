<script>
  import { getParentNodes } from '@/utils/dom';
  import { mapState, mapActions } from 'vuex';

  export default {
    name: 'LocaleSelect',
    data() {
      return {
        show_options: false,
      }
    },
    computed: {
      ...mapState(['common']),
    },
    beforeMount() {
      document.body.addEventListener('click', this.onBodyClick);
    },
    beforeDestroy() {
      document.body.removeEventListener('click', this.onBodyClick);
    },
    methods: {
      ...mapActions(['SetLocale']),
      onBodyClick(e) {
        const parentNodes = getParentNodes(e.target);
        const chk1 = e.target != this.$refs.type_sel;
        const chk2 = !~parentNodes.indexOf(this.$refs.type_sel);

        if (chk1 && chk2) this.show_options = false;
      },
      handleChange(locale) {
        this.$i18n.locale = locale;
        this.SetLocale(locale);
      }
    }
  }
</script>
<style scoped>
 
 .setLocale{display:inline-block;width:115px;position:relative;text-align:center;font-size:16px;box-sizing:border-box;cursor:pointer;margin:2px 30px 0 30px}
 .setLocaleCurrentLocale{display:inline-block;cursor:pointer;box-sizing:border-box;width:100%;text-align:left;height:35px;padding-left:10px}
 .setLocaleIcon{width:15px;position:absolute;top:10px;left:2px;color:#fff}
 .localeName{display:inline-block;line-height:35px;text-align:center;color:#888;font-size:16px}.otherName{font-size:14px}
 .setLocaleOptions{display:none;position:absolute;width:100%;z-index:1000;background-color:#fff;border-radius:3px;box-shadow:0 0 4px rgba(0,0,0,.4)}
 .setLocaleOpen .setLocaleOptions {display: block;  }
 .setLocaleOption:hover {background-color: #e9ecef; cursor: pointer;  }
 .setLocaleOption:first-child:hover { border-top-left-radius: 3px; border-top-right-radius: 3px;}
 .setLocaleOption:last-child:hover {border-bottom-left-radius: 3px; border-bottom-right-radius: 3px;}

.checked{display:block;background:url(~assets/img/checked.svg);background-repeat:no-repeat;background-position:10px center}
</style>
<template>
  <div :class="[{ setLocaleOpen: show_options }, 'setLocale']" ref="type_sel" @click="show_options = !show_options">
    <div class="setLocaleCurrentLocale"> 
      <img class="setLocaleIcon" src="~assets/img/globe-6-42.png" alt="">
      <span class="localeName" style="color:#fff">{{ common.locales[common.locale] }}</span>
    </div>

    <div class="setLocaleOptions select">
      <div v-for="(name, locale) in common.locales" @click="handleChange(locale)" :class="['setLocaleOption', { checked: common.locale === locale }]">
        <div class="setLocaleCheckedWrapper">
          <span class="localeName otherName">{{ name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
