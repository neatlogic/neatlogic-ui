<template>
  <span>
    <span class="import-text" @click="showDialog">导入</span>
    <TsDialog
      type="modal"
      :isShow.sync="isModalShow"
      height="320px"
      className="upload-dialog"
      @on-close="hideDialog"
    >
      <template v-slot:header>
        <div>导入文件</div>
      </template>
      <template v-slot>
        <div class="dialog-content">
          <div class="left-container">
            <Upload
              ref="upload"
              class="upload-fieldset"
              :class="{'upload-fieldset-small':fileList.length}"
              :action="actionUrl"
              :headers="headerConfig"
              :multiple="multiple"
              :show-upload-list="false"
              type="drag"
              :format="formatList"
              :accept="'.'+formatList.join(',.')"
              :max-size="maxSize * 1024"
              :before-upload="handleBeforeUpload"
              :on-progress="handleProgress"
              :on-success="handleSuccess"
              :on-error="handleError"
              :data="filedata"
            >
              <div class="drag-area bg-block">
                <div class="upload-icon"><img src="./upload-icon.png" alt="导入图标"></div>
                <div class="upload-tip text-default">拖曳文件到此处或点击上传</div>
                <div class="upload-limit text-tip">支持同时导入{{ multiple?'多':'单' }}个后缀为{{ '.' + formatList.join('、.') }}的文件<br />单个文件限制{{ maxSize }}MB</div>
              </div>
            </Upload>
          </div>
          <ul class="upload-file-list" :class="{'upload-file-list-show':fileList.length}">
            <li v-for="item in fileList" :key="item.uuid" class="upload-file-item">
              <Tooltip :content="item.file.name" :delay="300" theme="light">
                <h5 class="file-name text-default overflow">{{ item.file.name }}</h5>
              </Tooltip>
              <p class="file-size text-tip">{{ item.file.size | bytesSize }}</p>
              <div class="upload-status">
                <i-circle
                  v-if="item.status == 'OK'"
                  stroke-color="#25b865"
                  :trail-color="isDarkMode?'#4f515a':'#eaeef2'"
                  :percent="100"
                  :size="26"
                >
                  <i class="tsfont-check"></i>
                </i-circle>
                <i-circle
                  v-else-if="item.status == 'ERROR'"
                  stroke-color="#f71010"
                  :trail-color="isDarkMode?'#4f515a':'#eaeef2'"
                  :percent="100"
                  :size="26"
                >
                  <i class="tsfont-close"></i>
                </i-circle>
                <i-circle
                  v-else-if="item.status == 0"
                  :trail-color="isDarkMode?'#4f515a':'#eaeef2'"
                  :percent="item.status"
                  :size="26"
                >
                  <i class="ts-refresh"></i>
                </i-circle>
                <i-circle
                  v-else
                  :trail-color="isDarkMode?'#4f515a':'#eaeef2'"
                  :percent="item.status"
                  :size="26"
                  class="uploading"
                >
                  <span class="tips">{{ Math.round(item.status) }}</span>
                </i-circle>
              </div>
              <span v-if="item.status!=='OK'" class="remove-file">
                <i class="tsfont-close text-action" @click="removeFile(item)"></i>
              </span>
            </li>
          </ul>
        </div>
      </template>
      <template v-slot:footer>
        <template v-if="!isAllUploaded">
          <Button type="text" @click="hideDialog">取消</Button>
          <Button type="primary" @click="okImport">导入</Button>
        </template>
        <template v-else>
          <Button type="primary" @click="hideDialog">完成</Button>
        </template>
      </template>
    </TsDialog>
  </span>
</template>

<script>
export default {
  filters: {
    bytesSize: function(num) {
      // jacked from: https://github.com/sindresorhus/pretty-bytes
      if (typeof num !== 'number' || isNaN(num)) {
        throw new TypeError('Expected a number');
      }
      var exponent;
      var unit;
      var neg = num < 0;
      var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      if (neg) {
        num = -num;
      }
      if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
      }
      exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
      num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
      unit = units[exponent];
      return (neg ? '-' : '') + num + ' ' + unit;
    }
  },
  props: {
    formatList: {
      //文件格式，如['doc','docx']
      type: Array,
      default: function() {
        return [];
      }
    },
    actionUrl: {
      //后台服务器URL
      type: String,
      required: true
    },
    maxSize: {
      //文件大小限制，单位为MB
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: true
    },
    beforeUpload: {
      //自定义的上传前处理函数
      type: Function,
      default: null
    }
  },
  data() {
    return {
      isModalShow: false,
      fileList: [],
      headerConfig: {
        Authorization: sessionStorage.getItem('codedriver_authorization') ? sessionStorage.getItem('codedriver_authorization') : ''
      },
      filedata: {
        type: 'file',
        responseType: 'blob'
      }
    };
  },
  methods: {
    showDialog() {
      //如果有自定义的上传前处理函数，但是函数返回的不是真值，那么不显示上传对话框
      if (!this.beforeUpload) {
        this.isModalShow = true;
        return;
      }
      let result = this.beforeUpload();
      if (result instanceof Promise) {
        result.then(res => {
          if (res === true) this.isModalShow = true;
        });
      } else this.isModalShow = !!result;
    },
    hideDialog() {
      this.isModalShow = false;
      this.fileList = [];
    },
    handleBeforeUpload(file) {
      if (!this.multiple && this.fileList.length !== 0) {
        this.$Notice.warning({
          title: '提示',
          desc: '仅支持导入单个文件'
        });
        return false;
      }
      if (this.fileList.some(item => item.file.name === file.name && item.file.size === file.size)) {
        this.$Notice.warning({
          title: '提示',
          desc: '导入的文件不能重复'
        });
        return false;
      }
      if (this.formatList.length) {
        if (!this.formatList.includes(file.name.split('.').pop())) {
          this.$Notice.warning({
            title: '提示',
            desc: `导入的文件后缀必须是${'.' + this.formatList.join('或.')}`
          });
          return false;
        }
      }
      this.fileList.push({
        file,
        status: 0,
        uuid: this.$utils.setUuid()
      });
      return false;
    },
    handleProgress(event, file, fileList) {
      this.fileList.find(item => item.file.name === file.name).status = event.percent;
    },
    handleSuccess(response, file) {
      if (response.Status === 'OK') {
        this.$Notice.success({
          title: '导入成功',
          desc: response.Return.result || JSON.stringify(response.Return)
        });
      } else if ((response.Status = 'ERROR')) {
        this.$Notice.error({
          title: '导入失败',
          desc: response.Return.result || JSON.stringify(response.Return)
        });
      }
      this.fileList.find(item => item.file.name === file.name).status = response.Status;
      this.$emit('on-success', response);
    },
    handleError(error, response, file) {
      if ((file.Status = 'ERROR')) {
        this.$Notice.error({
          title: '导入失败',
          desc: response.Message
        });
        this.fileList.find(item => item.file.name === file.name).status = response.Status;
      }
    },
    removeFile(file) {
      this.fileList.splice(this.fileList.indexOf(file), 1);
    },
    okImport() {
      let items = this.fileList;
      this.fileList
        .filter(item => item.Status !== 'OK' && item.Status !== 'ERROR')
        .map(item => {
          this.$refs.upload.post(item.file);
        });
    }
  },
  computed: {
    isAllUploaded() {
      return this.fileList.length && this.fileList.every(item => item.status === 'OK' || item.status === 'ERROR');
    },
    isDarkMode() {
      return this.$store.getters.getThemeType === 'dark';
    }
  },
  watch: {
    isAllUploaded(newValue) {
      if (newValue === true) {
        this.$emit('on-all-upload');
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) '../../static/css/theme.less';

.import-text {
  vertical-align: 1.5px;
}
.upload-dialog {
  position: relative;
  .dialog-content {
    .left-container {
      position: absolute;
      top: 80px;
      left: 24px;
      width: 552px;
      user-select: none;
      .upload-fieldset {
        width: 552px;
        transition: width 0.3s ease-in-out;
        &-small {
          width: 271px;
        }
        .drag-area {
          height: 290px;
          padding: 0 46px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .upload-icon {
            width: 96px;
            height: 95px;
            margin-top: 59px;
          }
          .upload-tip {
            margin-top: 20px;
          }
          .upload-limit {
            margin-top: 4px;
          }
        }
      }
      .upload-success {
        width: 271px;
        height: 290px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &-icon {
          font-size: 60px;
          color: @default-primary-color;
        }
      }
    }
    .upload-file-list {
      margin-left: 305px;
      // width: 0;
      width: 45%;
      padding: 12px 0;
      opacity: 0;
      transition: opacity 0.5s 0.3s ease-out;
      &-show {
        opacity: 1;
      }
      .upload-file-item {
        position: relative;
        & + .upload-file-item {
          margin-top: 24px;
        }
        .file-name {
          margin-left: 38px;
          font-size: 13px;
          font-weight: normal;
          line-height: 18px;
          width: 190px;
          cursor: default;
        }
        .file-size {
          margin-left: 38px;
          margin-top: 2px;
        }
        .upload-status {
          position: absolute;
          top: 4px;
          left: 0;
          font-size: 16px;
          .tsfont-check {
            color: @success-color;
          }
          .tsfont-close {
            color: @error-color;
          }
          .ts-refresh {
            color: @default-primary-color;
          }
        }
        .remove-file {
          display: none;
          position: absolute;
          right: 0;
          top: 5px;
          font-size: 16px;
        }
        &:hover .remove-file {
          display: inline-block;
        }
      }
    }
  }
}
</style>
