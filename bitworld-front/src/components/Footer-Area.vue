<script>
import '@assets/css/c2c.css'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: 'Home' }],
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      dialogTableVisible: false,
      value: '',
      scrollPosition: null,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    handleToTop() {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<template>
  <footer id="footer">
    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="footer-logo">
              <img src="@src/assets/images/f_logo.png" alt="푸터 로고" />
            </div>
          </div>
          <div class="col">
            <div class="text-area">
              <p
                >FH Financial House Trust Kommanditbolag Org.nm: 969778-0162
                Bit<br />
                World All rights reserved</p
              >
            </div>
          </div>
        </div>
      </div>
    </div></footer
  >
  <!-- //footer -->
</template>

<style lang="scss" module>
@import '@src/design/common.scss';
@import '@src/design/footer.scss';
</style>
<style scoped>
/* ----Footer---- */
#footer {
  background-color: #0d0049;
}

/* footer-use-wrap */
.footer-use-wrap {
  width: 100%;
  background-color: #f2f3f8;
}

.footer-use-wrap .container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 30px 0;
}

.footer-use-wrap .container h3 {
  padding-bottom: 0;
}

/* footer-pc */
.footer-pc-wrap.pc {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #415165;
}

.footer-pc-wrap .container {
  position: relative;
}

.footer-pc-wrap .container::after {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: 1px;
  content: '';
}

.btn-footer-open {
  display: flex;
  align-items: center;
  justify-content: center;
  float: right;
  width: 30px;
  height: 30px;
  padding: 0;
  margin-top: 23px;
  background-color: #000;
  border-radius: 50%;
  transition: 0.5s ease;
  transform: rotate(0deg);
}

.btn-footer-open.dropdown-menu {
  transform: rotate(180deg);
}

.btn-footer-open img {
  width: 8px;
  height: 14px;
}

.footer-menu {
  width: 100%;
}

.footer-menu-list.locale-position-none .footer-menu-item {
  position: static;
}

.footer-menu-list {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 78px;
  overflow: hidden;
  transition: 0.5s ease;
}

.footer-menu-list.dropdown-menu.footer-menu-list-height-middle {
  height: 640px;
}

.footer-menu-list.dropdown-menu.footer-menu-list-height-large {
  height: 770px;
}

.footer-menu-list.dropdown-menu {
  height: 610px;
}

.footer-menu-item {
  position: relative;
}
.footer-menu-item:last-child {
  padding: 0;
  margin-right: 30px;
}

.footer-menu-item a {
  color: #fff;
}

.footer-menu-item a:hover {
  text-decoration: underline;
}

.footer-menu-item:first-child {
  padding-left: 0;
}

.footer-menu-item > a {
  display: block;
  display: flex;
  align-items: center;
  padding: 0;
  margin-top: 26px;
}

.footer-sub-menu-list {
  position: absolute;
  margin-top: 12px;
  line-height: 1;
}

.footer-sub-menu-item {
  padding: 5px 0;
  font-size: 14px;
  line-height: 1;
}

.footer-sub-menu-title {
  font-size: 13px;
}

.footer-sub-menu-title strong {
  color: #fff;
  cursor: auto;
}

.footer-menu-list.locale-break-none .footer-sub-menu-item a {
  word-break: normal;
}

.footer-sub-menu-item a {
  font-size: 13px;
  color: #758394;
  word-break: break-all;
}

/* footer-footer-mobile */
#footer .sitemap-wrap {
  border-bottom: 1px solid #415165 !important;
}

#footer .sitemap-wrap .sitemap-item {
  padding: 30px 0;
}

#footer .sitemap-wrap .sitemap-item li ul {
  box-sizing: border-box;
  display: inline-block;
  float: left;
  width: 10%;
  margin-right: 10px;
}

#footer .sitemap-wrap .sitemap-item li ul li:last-child {
  margin-right: 0;
}

#footer .sitemap-wrap .sitemap-item strong {
  color: white;
}

#footer .sitemap-wrap .sitemap-item a {
  color: #758394;
}

.footer-mobile-wrap.mobile {
  display: none;
}

/* foorer-copy */
#footer .footer-bottom {
  padding: 30px 0;
}

#footer .footer-bottom .row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 0;
}

#footer .footer-bottom .row .col:first-child {
  display: flex;
  justify-content: center;
}

#footer .footer-bottom .row .col:last-child {
  flex: 1;
}

#footer .footer-bottom .row .col:last-child .text-area p {
  margin-left: 120px;
  font-size: 14px;
  color: #ccc;
}

/* #footer .footer-bottom .footer-logo {
  float: left;
  width: 100px;
  padding-right: 80px;
}

#footer .footer-bottom .text-box {
  float: right;
  width: 83%;
} */

/* #footer .footer-bottom .text-box p {
  font-size: 12px;
  color: #ccc;
} */

.danger p {
  color: #f69e00 !important;
}

#footer .copyright {
  padding: 10px 0;
  background-color: #263444;
}

@media (max-width: 1200px) {
  #footer .footer-bottom {
    padding: 0;
  }
  .footer-mobile-wrap.mobile {
    display: block;
  }

  .footer-pc-wrap.pc {
    display: none;
  }

  #footer .footer-bottom .text-box {
    float: none;
  }

  #footer .cocobnk-use-wrap .container {
    padding: 46px 16px !important;
  }

  .el-menu-item-group ul li strong {
    font-size: 13px;
  }

  .el-menu-item-group ul li a {
    font-size: 13px;
    color: #758394 !important;
  }

  #footer .sitemap-wrap .el-submenu .el-menu-item {
    padding: 0 20px !important;
    background: #263444;
  }

  #footer .sitemap-wrap .el-submenu .el-menu-item strong {
    display: block;
    cursor: auto;
  }

  #footer .sitemap-wrap .el-submenu .el-menu-item a {
    display: block;
  }

  #footer .sitemap-wrap a,
  #footer .sitemap-wrap strong,
  #footer .sitemap-wrap p {
    color: white;
  }

  .el-menu-item-group__title {
    padding: 0 !important;
  }

  .el-submenu-opacity a {
    display: inline-block;
    width: 100%;
  }

  .el-submenu-opacity .el-submenu__title i {
    color: #364455;
  }

  /* #footer .footer-bottom .footer-logo {
    float: none;
    padding: 40px;
    margin: 0 auto;
  } */
}

@media (max-width: 850px) {
  #footer .cocobnk-use-wrap .container h3,
  #footer .cocobnk-use-wrap .container p {
    float: none;
  }

  #footer .footer-bottom .row {
    flex-direction: column;
  }

  #footer .footer-bottom .row .col:first-child .footer-logo {
    width: 70%;
  }

  #footer .footer-bottom .row .col:last-child .text-area p {
    margin-top: 20px;
    margin-left: 0;
    font-size: 12px;
    text-align: center;
  }
}

@media (max-width: 1280px) {
  .footer-pc-wrap.pc .container {
    width: 100%;
    padding: 0 16px !important;
  }

  /* #footer .footer-bottom .footer-logo {
    margin-bottom: 20px;
  } */

  #footer .footer-bottom .text-box {
    width: 100%;
  }

  .copyright .container {
    padding: 0 !important;
  }
}
#footer .container {
  display: block;
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}
#footer .copyright p {
  font-size: 12px;
  color: #ccc;
  text-align: center;
  letter-spacing: 0;
}

@media (max-width: 1280px) {
  #footer .container {
    padding: 40px 20px !important;
  }
}
</style>
