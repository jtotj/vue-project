<script>
import request from '@utils/request'
import { isCancel, CancelToken } from 'axios'
import { deleteFormFieldFile } from '@apis/form'

export default {
  props: {
    field_seq: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dnd_capable: false,
      files: [],
      file: null,
      file_seq: null,
      token: null,
      cancel_source: null,
      current_idx: null,
      current_progress: 0,
      uploaded: false,
      uploading: false,
    }
  },
  watch: {
    '$attrs.value'(to) {
      this.token = to
    },
    $route(to) {
      this.handleCancel()
    },
    token(to) {
      this.$emit('input', to)
    },
  },
  mounted() {
    this.dnd_capable = this.determineDragAndDropCapable()
    if (!this.dnd_capable) return

    this.attachListener()
  },
  methods: {
    determineDragAndDropCapable() {
      const div = document.createElement('div')

      return (
        ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) &&
        'FormData' in window &&
        'FileReader' in window
      )
    },

    attachListener() {
      ;[
        'drag',
        'dragstart',
        'dragend',
        'dragover',
        'dragenter',
        'dragleave',
        'drop',
      ].forEach((evt) => {
        this.$refs.dnd.addEventListener(
          evt,
          (e) => {
            e.preventDefault()
            e.stopPropagation()
          },
          false
        )
      })

      this.$refs.dnd.addEventListener('drop', this.handleChange)
    },

    handleChange(e) {
      if (this.uploading) return e.preventDefault()

      const file_type_regexp = /.*/i
      const [file] = (e.dataTransfer || e.target).files

      if (!file) return

      if (!file_type_regexp.test(file.type)) return

      this.file = file
      this.$refs.input_file.value = null

      this.handleSubmit()
    },

    handleSubmit() {
      this.submit().catch((e) => {
        this.$toasted.error(e.message)
      })
    },

    handleCancel() {
      this.cancelUpload()
    },

    handleDelete() {
      deleteFormFieldFile({
        file_seq: this.file_seq,
        token: this.token,
      })
        .then(() => {
          this.file_seq = null
          this.token = null
          this.file = null
        })
        .catch((e) => this.$toasted.error(e.message))
    },

    cancelUpload() {
      this.cancel_source.cancel()
    },

    async submit() {
      try {
        const oFormData = new FormData()
        oFormData.append('FileData', this.file)

        this.uploading = true
        this.uploaded = false
        this.current_progress = 0
        this.cancel_source = CancelToken.source()
        const data = await request.post(
          `/form/field/${this.field_seq}/file`,
          oFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            cancelToken: this.cancel_source.token,
            timeout: 0,
            onUploadProgress: this.onUploadProgress,
          }
        )

        this.uploaded = true
        this.token = data.token
        this.file_seq = data.seq
      } catch (e) {
        this.file = null

        if (!isCancel(e)) throw e
      } finally {
        this.uploading = false
        this.current_idx = null
        this.current_progress = 0
      }
    },

    onUploadProgress(e) {
      this.current_progress = ((e.loaded * 100) / e.total) | 0
    },
  },
}
</script>

<template>
  <div
    ref="dnd"
    :class="$style.dragdrop"
    @click="() => $refs.input_file.click()"
  >
    <template v-if="file">
      <div class="uploading">
        <template v-if="uploading">
          <i class="el-icon-loading"></i>
        </template>
        {{ file.name }}
        <template v-if="uploading">
          ({{ current_progress }}%)
          <ElButton
            size="mini"
            type="danger"
            @click.native.stop="handleCancel"
          ></ElButton>
        </template>
        <ElButton
          v-if="uploaded"
          size="mini"
          type="danger"
          @click.native.stop="handleDelete"
        ></ElButton>
      </div>
    </template>
    <template v-else>
      <div :class="[$style.noUploading]">
        <i class="el-icon-upload2"></i>
        {{ $t('upload_btn') }}
      </div>
    </template>

    <input
      v-show="false"
      ref="input_file"
      :disabled="uploading"
      type="file"
      @change="handleChange"
    />
  </div>
</template>

<style lang="scss" module>
@import '@design';

.dragdrop {
  box-sizing: border-box;
  display: block;
  padding: 10px !important;
  margin-bottom: 10px;
  font-size: 12px;
  color: #999;
  text-align: center;
  cursor: pointer;
  background: #f6f6f6;
}
.noUploading {
  padding: 0 !important;
}
</style>

<style scoped>
.no-uploading {
  padding: 15px;
}
</style>
