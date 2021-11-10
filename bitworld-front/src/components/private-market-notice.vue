<script>
export default {
  props: {
    private_type: {
      default: null,
      type: String,
    },
  },
  data() {
    return {
      step: null,
    }
  },
  methods: {
    handleAgree() {
      this.$dialog
        .confirm(this.$t('toasted_msg.msg_read_care'), {
          type: 'hard',
          verification: this.$t('toasted_msg.answer_care'),
          okText: this.$t('toasted_msg.continuation'),
          cancelText: this.$t('cancel'),
          verificationHelp: this.$t('toasted_msg.continue_entry'),
        })
        .then(() => this.$emit('close_notice'))
    },
  },
}
</script>

<template>
  <div :class="$style.marketNotice">
    <template v-if="private_type === 'sell'">
      <div>
        <h2>※ {{ $t('private_notice.msg_false_deal_title') }}</h2>
        <ul>
          <li>
            {{ $t('private_notice.msg_false_deal_content_1') }}
          </li>
          <li>
            {{ $t('private_notice.msg_false_deal_content_2') }}
          </li>
        </ul>
      </div>
      <div>
        <h2>※ {{ $t('private_notice.msg_deal_confirm_click_title') }}</h2>
        <ul>
          <li>
            {{ $t('private_notice.msg_deal_confirm_click_content_1') }}
          </li>
          <li>
            {{ $t('private_notice.msg_deal_confirm_click_content_2') }}
          </li>
        </ul>
      </div>
      <div>
        <h2>※ {{ $t('private_notice.msg_deal_confirm_not_click_title') }}</h2>
        <ul>
          <li>
            {{ $t('private_notice.msg_deal_confirm_not_click_content_1') }}
          </li>
          <li>
            {{ $t('private_notice.msg_deal_confirm_not_click_content_2') }}
          </li>
        </ul>
      </div>
      <div>
        <h2>※ {{ $t('private_notice.msg_c2c_title') }}</h2>
        <ul>
          <li>
            {{ $t('private_notice.msg_c2c_content_1') }}
          </li>
          <li>
            {{ $t('private_notice.msg_c2c_content_2') }}
          </li>
          <li>
            {{ $t('private_notice.msg_c2c_content_3') }}
          </li>
        </ul>
      </div>
      <div class="form-group big-btn">
        <a
          class="btn btn-default btn-save-offer"
          style="display:inline-block;"
          @click="handleAgree"
          >{{ $t('toasted_msg.continuation') }}</a
        >
      </div>
    </template>
    <template v-else>
      <div>
        <h2>※ {{ $t('private_notice.msg_false_hold_title') }}</h2>
        <ul>
          <li>{{ $t('private_notice.msg_false_hold_content_1') }} </li>
          <li>
            {{ $t('private_notice.msg_false_hold_content_2') }}
          </li>
          <li>
            {{ $t('private_notice.msg_false_hold_content_3') }}
          </li>
          <li>
            {{ $t('private_notice.msg_false_hold_content_4') }}
          </li>
          <li>
            {{ $t('private_notice.msg_false_hold_content_5') }}
          </li>
        </ul>
      </div>

      <div>
        <h2>※ {{ $t('private_notice.msg_c2c_title') }}</h2>
        <ul>
          <li>
            {{ $t('private_notice.msg_c2c_content_1') }}
          </li>
          <li>
            {{ $t('private_notice.msg_c2c_content_2') }}
          </li>
          <li>
            {{ $t('private_notice.msg_c2c_content_3') }}
          </li>
        </ul>
      </div>
      <div class="form-group big-btn">
        <a
          class="btn btn-default btn-save-offer"
          style="display:inline-block;"
          @click="handleAgree"
          >{{ $t('toasted_msg.continuation') }}</a
        >
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.marketNotice {
  ul {
    li {
      font-size: 15px;
      line-height: 1.5;
    }
  }
}
</style>
