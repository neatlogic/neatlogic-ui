<template>
  <div class="form-li">
    <div v-if="readonly" v-html="currentValue?currentValue:'-'"></div>
    <div v-else :class="getClass" :style="'width:' + width">
      <ckeditor ref="tsckeditor" v-model="currentValue" :editor="editor" :config="editorConfig" tag-name="textarea" :disabled="readonly" :placeholder="placeholder" @blur="onBlur"></ckeditor>
      <!-- <i class="ck-expandedbtn ts-angle-up text-action" @click="isHidebar = !isHidebar;"></i> -->
      <transition name="fade">
        <span v-show="validMesage!=''" class="form-error-tip">{{ validMesage }}</span>
      </transition>
    </div>
    <div v-if="desc" class="text-tip">{{ desc }}</div>
  </div>
</template>
<script>

import './js/translations/zh-cn';
import ClassicEditor from './js/ckeditor.js';
import CKEditor from './js/ckeditor-vue.js';
export default {
  name: 'TsCkeditor',
  tagComponent: 'TsForm',
  components: {
    ckeditor: CKEditor.component
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    width: {
      type: String,
      default: '75%'
    },
    value: {
      //初始数据
      type: String,
      default: ''
    },
    editorDataS: {
      type: String,
      default: ''
    }, //初始数据
    validateList: {
      //只对required的情况考虑
      type: Array
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    desc: String,
    toolbar: {
      type: Array,
      default: function() {
        return ['Bold', 'Italic', 'Underline', 'Strikethrough', 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', 'Link', 'Unlink', 'Image', 'Table', 'HorizontalRule', 'Font', 'FontSize', 'TextColor', 'BGColor', 'Maximize', 'RemoveFormat', 'Undo', 'Redo'];
      }
    }
  },
  data() {
    let _this = this;
    return {
      editor: ClassicEditor, //引用类型，基础模式
      editorConfig: {
        //基本配置
        language: 'zh-cn',
        removePlugins: ['MediaEmbed'],
        ckfinder: {
          uploadUrl: BASEURLPREFIX + '/api/binary/image/upload' 
        },
        toolbarCanCollapse: true,
        toolbarStartupExpanded: false
      },
      validMesage: '',
      currentValue: _this.value || '',
      currentValidList: this.validateList,
      isHidebar: true
    };
  },
  mounted() {
  },
  beforeDestroy() {
    this.dom = null;
  },
  methods: {
    onBlur(evt, editor) {
      this.valid();
      this.$emit('on-blur', this.currentValue);
    },
    valid() {
      if (!this.currentValue && this.validateList && this.validateList.length > 0 && this.validateList[0] == 'required') {
        this.validMesage = '请输入内容';
        return false;
      } else {
        this.validMesage = '';
        return true;
      }
    }
  },
  computed: {
    getClass() {
      let stylelist = 'ckeditor-outer';
      if (this.readonly) {
        stylelist += ' tsform-edit-readonly';
      }
      if (this.isHidebar) {
        stylelist += ' hidetoolbar';
      }
      return stylelist;
    }
  },
  watch: {
    value: function(val) {
      this.currentValue = val || '';
    },
    currentValue: function(newValue, oldValue) {
      //当值改变时触发的方法
      let _this = this;

      if (newValue != oldValue) {
        _this.valid();
        _this.$emit('changeVal', newValue);
        _this.$emit('change', newValue);
        _this.$emit('on-change', newValue);
      } 
      if (_this.$refs.tsckeditor && !_this.$refs.tsckeditor.instance) {
        setTimeout(function() {
          _this.$refs.tsckeditor.instance.setData(newValue);
        }, 0);
      }
    },
    validateList(newValue, oldValue) {
      this.currentValidList = newValue;
    }
  }
};
</script>

<style lang="less">
@import './ckeditor.less';
</style>
