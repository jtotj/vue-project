<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      visible: true,
      is_target_today_hide: false,
    }
  },
  computed: {
    ...mapState(['common']),
  },
  created() {
    const storage_data = localStorage.getItem('account-guide-modal')
    const now_timestamp = Date.now()
    if (storage_data && now_timestamp - storage_data <= 86400 * 1000) {
      this.visible = false
    } else {
      this.visible = true
    }
  },
  methods: {
    getImageSrc(lang) {
      var default_img = null
      try {
        return require('@assets/img/notice-modal-' + lang + '.png')
      } catch (e) {
        return default_img
      }
    },
    handleClose() {
      const d = new Date()
      if (this.is_target_today_hide) {
        localStorage.setItem('account-guide-modal', d.getTime())
      }
      this.visible = false
    },
  },
}
</script>

<template>
  <div class="notice-modal">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="false"
      @close="handleClose"
    >
      <div class="notice-wrap">
        <div
          class="notice-content"
          @click="$router.push({ name: 'guide-cocobnk-account' })"
        >
          <img src="../../assets/img/notice-server3.jpg" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <div class="notice-time">
          <p>Start Time: 2021-04-27 10:00:00 UTC</p>
          <p>End Time: 2021-04-27 14:00:00 UTC</p>
        </div> -->
        <el-checkbox v-model="is_target_today_hide" class="notice-check">{{
          $t('pop_notice.notice_today')
        }}</el-checkbox>
        <span class="notice-close" @click="handleClose">{{
          $t('pop_notice.notice_close')
        }}</span>
      </div>
    </el-dialog>
  </div>
</template>
<style>
/* 팝업 엘리먼트 ui */
.notice-modal .el-dialog .container,
.notice-modal .el-dialog__body,
.notice-modal .el-dialog__header {
  padding: 0 !important;
}

.notice-modal .el-dialog__wrapper div.el-dialog {
  width: 400px !important;
  min-height: 600px;
  cursor: pointer;
}

.el-dialog__body .notice-wrap {
  padding-bottom: 0;
}
.el-dialog__body .notice-wrap .notice-content img {
  width: 100%;
}

/* 팝업 엘리먼트 ui footer */
.notice-modal .el-dialog__footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 20px;
  background-color: #333;
}

.notice-modal .dialog-footer {
  width: 100%;
}

/* 팝업 엘리먼트 ui button css */
.notice-modal .el-checkbox__inner {
  background: none;
  border: 1px solid #fff;
  border-radius: 4px;
}

.notice-modal .el-checkbox__inner:hover {
  border-color: #fff;
}

.notice-modal .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff !important;
}

.notice-modal .el-checkbox__input.is-focus .el-checkbox__inner {
  color: #fff;
  border-color: rgb(255, 255, 255);
}

.notice-modal .el-checkbox__input.is-checked .el-checkbox__inner,
.notice-modal .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: none !important;
  border-color: #fff !important;
}

.notice-modal .el-checkbox__label {
  padding-left: 8px;
  font-family: NotoSansCJKKR;
  font-size: 12px;
  font-style: normal;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1;
  color: #fff;
}

/* 체크박스  크기 */
.notice-modal .el-checkbox__inner::after {
  top: 2px;
  height: 5px;
}

/* 팝업 닫기 버튼 */
.notice-modal .notice-close {
  float: right;
  padding: 11px 0;
  font-family: NotoSansCJKKR;
  font-size: 12px;
  font-style: normal;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1;
  color: #fff;
  cursor: pointer;
}

.notice-modal .notice-check {
  float: left;
  padding: 9px 0;
  line-height: 1 !important;
  text-align: left;
}

.notice-modal .notice-time {
  padding: 2px 0;
  font-family: NotoSansCJKKR;
  font-size: 16px;
  color: #fff;
  text-align: center;
}
.notice-modal .notice-time p {
  font-size: 16px;
}

/* 모바일 */
@media (max-width: 768px) {
  .notice-modal .el-dialog__wrapper div.el-dialog {
    width: 90% !important;
    min-height: 550px;
  }
}

@media (max-width: 360px) {
  .notice-modal .el-dialog__wrapper div.el-dialog {
    min-height: 500px;
  }
}
</style>
