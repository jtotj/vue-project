<script>
import '@assets/css/modal.css'
import map from 'lodash/map'
import filter from 'lodash/filter'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      s_index: null,
      visible: true,
      is_target_today_hide: false,
      modal_list: [
        {
          name: 'account-guide-modal',
          allow_today_hide: true,
        },
        // {
        //   name: 'emergency-modal',
        //   allow_today_hide: true,
        // },
        {
          name: 'application-download-modal',
          allow_today_hide: true,
        },
        // {
        //   name: 'notice-server-modal',
        //   allow_today_hide: true,
        // },
      ],
      disable_modal_list: [],
    }
  },
  computed: {
    ...mapState(['common']),
    c_modal_list() {
      return filter(
        map(this.modal_list, (item) => {
          return {
            ...item,
          }
        }),
        (item) => {
          return this.c_hide_names.indexOf(item.name) === -1
        }
      )
    },
    c_hide_names() {
      const modal_list = filter(this.modal_list, (item) => {
        const storage_data = localStorage.getItem(item.name)
        const now_timestamp = Date.now()

        return storage_data && now_timestamp - storage_data <= 86400 * 1000
      })
      return map(modal_list, (item) => {
        return item.name
      })
    },
  },
  mounted() {
    this.s_index = this.c_modal_list.length - 1
  },
  methods: {
    getImageSrc(name, lang) {
      var default_img = null
      switch (name) {
        case 'account-guide-modal':
          try {
            return require('@assets/img/notice-modal-' + lang + '.png')
          } catch (e) {
            return default_img
          }

        case 'emergency-modal':
          try {
            return require('@assets/img/emergency-modal.png')
          } catch (e) {
            return default_img
          }

        case 'application-download-modal':
          try {
            return require('@assets/img/popup_0722.jpg')
          } catch (e) {
            return default_img
          }

        case 'notice-server-modal':
          try {
            return require('@assets/img/notice-server3.jpg')
          } catch (e) {
            return default_img
          }

        default:
          break
      }
    },
    handleClose(index) {
      if (this.s_index !== index) {
        return
      }

      const d = new Date()
      if (
        this.c_modal_list[this.s_index].allow_today_hide &&
        this.is_target_today_hide
      ) {
        localStorage.setItem(this.c_modal_list[this.s_index].name, d.getTime())
      }
      this.is_target_today_hide = false

      this.s_index = this.s_index - 1
    },
    handleClick(item) {
      switch (item.name) {
        case 'account-guide-modal':
          this.$router.push({ name: 'guide-cocobnk-account' })
          break
        case 'application-download-modal':
          // if (screen.width < 768)
          // window.open('http://3.34.73.97:8080/apk/index.html')
          window.open(
            'https://play.google.com/store/apps/details?id=io.cocoent.cocobank'
          )
          break
        default:
          break
      }
    },
  },
}
</script>

<template>
  <div class="notice-modal">
    <el-dialog
      v-for="(item, index) in c_modal_list"
      :key="item.name"
      :visible="s_index === index"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="false"
      :class="{
        'bg-white':
          item.name === 'emergency-modal' ||
          item.name === 'notice-server-modal',
      }"
      @close="handleClose(index)"
    >
      <div class="notice-wrap">
        <div class="notice-content" @click="handleClick(item)">
          <div
            v-if="item.name === 'notice-server-modal'"
            style="white-space: pre"
            >정식 오픈 준비 중입니다. 서버가 불안정할 수 있으니 이점 유의하시기
            바랍니다. 더욱 안정적이고 좋은 모습으로 다가가려 최선을 다하는 코코
            뱅크가 되겠습니다.</div
          >
          <img v-else :src="getImageSrc(item.name, common.locale)" />
          <!-- <img src="@assets/img/notice-server2.png" /> -->
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        :class="{ 'footer-black': item.name === 'application-download-modal' }"
      >
        <!-- <div v-if="item.name === 'emergency-modal'" class="notice-time">
          <p class="notice-time">Start Time: 2021-04-27 10:00:00 UTC</p>
          <p class="notice-time">End Time: 2021-04-27 14:00:00 UTC</p>
        </div> -->
        <el-checkbox v-model="is_target_today_hide" class="notice-check">{{
          $t('pop_notice.notice_today')
        }}</el-checkbox>
        <span class="notice-close" @click="handleClose(index)">{{
          $t('pop_notice.notice_close')
        }}</span>
      </div>
    </el-dialog>
  </div>
</template>
