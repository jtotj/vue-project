<script>
export default {
  data() {
    return {
      krw_dialog: false,
    }
  },
}
</script>

<template>
  <el-dialog
    :title="$t('kiosk_re.krw_dialog_tit')"
    :visible.sync="krw_dialog"
    class="krw-dialog"
  >
    <div class="txt">
      <p>{{ $t('kiosk_re.krw_dialog_txt_1') }}</p>
      <p>{{ $t('kiosk_re.krw_dialog_txt_2') }}</p>
    </div>
    <div class="buy-info">
      <p class="warning">{{ $t('kiosk_re.krw_dialog_txt_3') }}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="btn-cancel" @click="acc_dialog = false">{{
        $t('cancel')
      }}</el-button>
      <el-button
        class="btn-comple"
        type="primary"
        @click="acc_dialog = false"
        >{{ $t('kiosk_re.buy_reserv') }}</el-button
      >
    </span>
  </el-dialog>
</template>
