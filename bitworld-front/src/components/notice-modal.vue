<script>
import '@assets/css/modal.css'
import { mapState } from 'vuex'
import map from 'lodash/map'
import filter from 'lodash/filter'

export default {
  data() {
    return {
      selected_index: null,
      is_target_agreed: false,
      is_target_today_hide: false,
      modal_list: [
        {
          name: 'login-guide-modal',
          title: '긴급공지',
          title_icon: true,
          sub_title: '서버 점검의 문제로 현재 로그인이 불가능합니다',
          content:
            '고객님의 원활한 거래소 이용을 위하여, 빠른 시일 내에 점검 완료 하겠습니다.',
          content_icon: false,
          allow_today_hide: true,
          is_agree_required: false,
        },
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
    this.selected_index = this.c_modal_list.length - 1
  },
  methods: {
    handleClose(index) {
      if (
        this.selected_index !== index ||
        (this.c_modal_list[this.selected_index].is_agree_required &&
          !this.is_target_agreed)
      ) {
        return
      }

      const d = new Date()
      if (
        this.c_modal_list[this.selected_index].allow_today_hide &&
        this.is_target_today_hide
      ) {
        localStorage.setItem(
          this.c_modal_list[this.selected_index].name,
          d.getTime()
        )
      }
      this.is_target_agreed = false
      this.is_target_today_hide = false

      this.selected_index = this.selected_index - 1
    },
  },
}
</script>

<template>
  <div>
    <el-dialog
      v-for="(item, index) in c_modal_list"
      :key="item.name"
      width="600px"
      :visible="selected_index === index"
      class="notice-modal"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
      :show-close="false"
      @close="handleClose(index)"
    >
      <div slot="title" class="el-dialog__title">
        <i v-if="item.title_icon" class="el-icon-warning-outline"></i>
        {{ item.title }}
      </div>
      <div class="notice-wrap" v-html="item.sub_title"> </div>
      <div class="content-wrap">
        <i
          v-if="item.content_icon"
          class="el-icon-warning-outline"
          style="font-size:25px;"
        ></i>
        <div class="notice-content" v-html="item.content"></div>
      </div>

      <div slot="footer" class="notice-footer">
        <el-checkbox
          v-if="item.allow_today_hide"
          v-model="is_target_today_hide"
          >{{ $t('modal.not_seeing_day') }}</el-checkbox
        >
        <el-checkbox v-if="item.is_agree_required" v-model="is_target_agreed">{{
          $t('notice_modal.agree')
        }}</el-checkbox>

        <!-- 위 유의사항에 동의합니다가 체크되지 않았을 경우 확인버튼 비활성화 -->
        <el-button
          :disabled="item.is_agree_required && !is_target_agreed"
          @click="handleClose(index)"
          >{{ $t('verify') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
