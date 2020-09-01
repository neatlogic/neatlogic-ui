<template>
  <div class="upload" :class="className">
    <Upload ref="upload" :type="type" :format="format" :multiple="multiple" :data="filedata" :on-format-error="FormatError" :on-progress="progress" :before-upload="before" :on-success="success" :on-error="error" :action="action" :show-upload-list="false" :max-size="maxsize" :on-exceeded-size="exceeded" :default-file-list="defaultFileLIst" :headers="headerConfig">
      <div v-if="styleType == 'button'">
        <Button v-if="className == 'smallUpload'" icon="tsfont tsfont-upload">上传文件</Button>
      </div>
      <div v-else>
        <p class="title">{{ title }}</p>
        <div v-if="type == 'drag'" class="drag">
          <i class="icon-tip ts-plus"></i>
          <p>上传附件</p>
        </div>
        <Button v-else>点击上传</Button>
      </div>
    </Upload>
    <div class="upload_block">
      <TsRow>
        <Col v-for="(item, index) in uploadList" :key="index" :span="rowSpan">
        <div class="upload_item">
          <span class="ts-link"></span>
          <span class="file_name overflow">{{ item.name }}</span>
          <i class="ts-download file_down" title="下载" @click="fileDownload(item)"></i>
          <i class="ts-remove file_del" title="删除" @click="handleRemove(item)"></i>
          <Progress v-if="item.showProgress" class="progress" :percent="percent(item.percentage)" :stroke-width="5" :status="fileStatus"></Progress>
        </div>
        </Col>
      </TsRow>
    </div>
  </div>
</template>

<script>
export default {
  name: '',

  components: {},
  props: {
    title: {
      //上传标题
      type: String,
      default: ''
    },
    type: {
      //上传类型，默认拖拽
      type: String,
      default: 'drag' //drag or select
    },
    multiple: {
      //是否支持多文件上传，默认否
      type: Boolean,
      default: false
    },
    //支持的文件类型，默认为空
    format: {
      type: Array,
      default: function() {
        return [];
      }
    },
    //上传参数
    dataType: {
      type: String,
      default: ''
    },
    dataParam: {
      type: String,
      default: 'file'
    },
    //文件格式判断
    handleFormatError: {
      type: Function,
      default: function(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件名为 ' + file.name + ' 格式不正确.'
        });
      }
    },
    //上传前方法
    beforeUpload: {
      type: Function,
      default: function() {}
    },
    maxsize: {
      type: Number,
      default: 1000000
    },
    defaultList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    styleType: {
      type: String,
      default: '' //button
    },
    className: {
      type: String,
      default: '' //smallUpload
    },
    rowSpan: {
      type: String,
      default: '12'
    }
  },
  data() {
    return {
      action: BASEURLPREFIX + `/api/binary/file/upload`,
      filedata: {
        param: this.dataParam,
        type: this.dataType,
        responseType: 'blob'
      },
      uploadList: [],
      defaultFileLIst: [],
      fileStatus: 'normal',
      headerConfig: {
        Authorization: sessionStorage.getItem('codedriver_authorization') ? sessionStorage.getItem('codedriver_authorization') : ''
      }
    };
  },

  beforeMount() {},

  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },

  created() {},

  methods: {
    FormatError: function(file) {
      this.handleFormatError(file);
    },
    before: function(file) {
      this.fileStatus = 'normal';
      this.beforeUpload(file);
    },
    //上传成功
    success: function(res, file, fileList) {
      if (res.Status == 'OK') {
        file.id = res.Return.id;
        this.$Notice.success({
          title: '上传成功'
        });
        this.$emit('getFileList', fileList);
        this.fileStatus = 'success';
      }
    },
    //上传失败
    error: function(res, file, fileList) {
      if (file.Status == 'ERROR') {
        this.$Notice.error({
          title: '上传失败',
          desc: file.Message
        });
      }
    },
    //上传时的接口
    progress: function(event, file) {},
    //移除
    handleRemove: function(item) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(item), 1);
      this.$emit('remove', this.$refs.upload.fileList);
      return false;
    },
    //下载请求
    fileDownload: function(item) {
      let data = {
        id: item.id
      };
      this.$api.common.downLoad(data).then(res => {
        this.download(res, item.name);
      });
    },
    //下载
    download(data, fileName) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    },
    //文件大小限制
    exceeded: function() {
      this.$Message.warning('文件大小超出限制');
    },
    // 清除upload方法
    handleClearFiles() {
      this.$refs.upload.fileList.splice(0);
    }
  },

  computed: {
    percent() {
      return function(val) {
        let num = val;
        if (num == '100') {
          num = num - 1;
        }
        return num;
      };
    }
  },
  watch: {
    defaultList: {
      handler(newVal) {
        if (newVal) {
          let list = [];
          newVal.forEach(item => {
            let data = {
              name: item.name,
              id: item.id
            };
            list.push(data);
          });
          this.defaultFileLIst = list;
          this.$nextTick(() => {
            this.uploadList = this.$refs.upload.fileList;
          });
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less">
@import (reference) '~@assets/css/my-theme.less';
.upload {
  .ivu-upload {
    width: 125px;
    height: 125px;
  }
  .title {
    color: @text-color;
    padding-top: 20px;
  }
  .drag {
    // padding: 20px 0;
    // color: @primary-color;
    .icon-tip {
      font-size: 24px;
      padding-bottom: 10px;
    }
  }
  .upload_block {
    position: relative;
    margin-top: 8px;
    .upload_item {
      width: 100%;
      display: inline-block;
      margin-bottom: 8px;
      .file_name {
        padding: 0 8px;
        position: relative;
        top: -2px;
        display: inline-block;
        max-width: 66%;
      }
      .file_down {
        cursor: pointer;
      }
      .file_del {
        margin-left: 64px;
        display: none;
        cursor: pointer;
      }
      .progress {
        width: 80%;
        display: block;
      }
      &:hover {
        .file_del {
          display: inline-block;
        }
      }
    }
  }
  &.smallUpload {
    .ivu-upload {
      width: 110px;
      height: auto;
    }
    .ivu-upload-drag {
      border: none;
    }
  }
}
</style>
