<template>
  <div class="form-li" :class="borderClass">
    <span v-if="readonly" :class="readonlyClass" :title="readonlyTitle">{{ currentValue ? currentValue : '-' }}</span>
    <Input v-else v-model="currentValue" :placeholder="placeholder" :style="getStyle" :class="getClass" :type="type" :disabled="isDisabled" :size="size" :maxlength="maxlength" :show-word-limit="getShowWordLimit" :password="type == 'password' ? showPassword : false" :autosize="type == 'textarea' ? autosize : ''" :clearable="getClearable" :icon="suffix" @on-change="onChangeValue" @on-focus="onFocusValue" @on-enter="onEnterValue" @on-blur="onBlurValue" @on-click="onEnterValue"><span v-if="prepend" slot="prepend" v-html="prepend"></span><span v-if="append" slot="append" v-html="append"></span></Input>
    <div v-if="desc" class="text-tip">{{ desc }}</div>
    <transition name="fade">
      <span v-if="validMesage != ''" class="form-error-tip" v-html="validMesage"></span>
    </transition>
  </div>
</template>
<script>
import formMixins from '../../mixins/formMixins.js';
import validtorJson from './TsValidtor.js';
export default {
  name: 'TsFormInput',
  tagComponent: 'TsForm',
  mixins: [formMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    type: String,
    name: String,
    disabled: {
      //true  false  默认为false
      type: Boolean,
      default: false
    },
    value: {
      //默认值
      type: [String, Number],
      default: ''
    },
    size: String, // large  small  default   默认为default
    maxlength: [Number, String], //最长值
    placeholder: {
      type: String,
      default: '请输入'
    },
    onChange: Function, //改变时触发
    onBlur: Function, //失去焦点时触发
    onFocus: Function, //获取焦点时触发
    width: {
      //small  medium   large  block    输入数值    输入百分比
      type: [String, Number],
      default: '100%'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    filterSpecial: {
      //true | false  过滤掉特殊的字符串 默认为true
      type: Boolean,
      default: true
    },
    hasPoptip: {
      //false | true   当文字过长时显示tip的提示
      type: Boolean,
      default: true
    },
    showPassword: {
      //当类型为password时，是否显示明文和密码的切换
      type: Boolean,
      default: true
    },
    validateList: {
      type: Array
    },
    autosize: {
      //当类型为textarea时高度随内容变化
      type: [Boolean, Object]
    },
    border: String, //控件的样式 border bottom none
    className: {
      //额外添加class
      type: String
    },
    isChangeWrite: {
      //赋值时，是否需要出发on-change事件
      type: Boolean,
      default: true
    },
    desc: String,
    clearable: Boolean,
    readonlyClass: {
      type: String,
      default: 'tsform-readonly'
    },
    errorMessage: String, //从外部设置校验信息
    prepend: String,
    append: String,
    suffix: String
  },
  data: function() {
    let _this = this;
    return {
      currentValue: _this.value,
      validMesage: _this.errorMessage || '',
      currentValidList: _this.filterValid(_this.validateList) || [],
      readonlyTitle: null
    };
  },
  mounted() {
    this.readonly && this.initReadolyTitle();
  },
  beforeDestroy() {},

  methods: {
    onChangeValue: function() {
      let _this = this;
      let value = _this.currentValue.trim();
      let isSame = this.value == value;
      _this.type == 'number' && value && (value = parseInt(value));
      _this.$emit('change', value);
      _this.$emit('update:value', value);
      if (!(!this.isChangeWrite && isSame)) {
        //改变值时出发on-change事件
        _this.$emit('on-change', value);
        typeof _this.onChange == 'function' && _this.onChange(value);
      }

      if (!isSame) {
        if (_this.currentValidList.length > 0 && _this.canValid('change', _this.currentValidList)) {
          _this.valid(_this.currentValue);
        }
      } else {
        _this.validMesage = '';
      }
    },
    onFocusValue: function() {
      typeof this.onFocus == 'function' && this.onFocus();
      this.$emit('on-focus');
    },
    onEnterValue: function() {
      this.$emit('on-enter', this.currentValue);
    },
    onBlurValue: function() {
      typeof this.onBlur == 'function' && this.onBlur();
      this.$emit('on-blur', this.currentValue);
    },
    initReadolyTitle() {
      let width = this.$el.clientWidth;
      let text_length = 0;
      let str = this.currentValue;
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 256) {
          text_length = text_length + 1;
        } else {
          text_length = text_length + 0.5;
        }
      }
      this.readonlyTitle = width > text_length * 14 ? null : str;
    }
  },
  computed: {
    isDisabled: function() {
      if (this.value === '未分类') return true;
      return this.disabled;
    },
    getStyle: function() {
      let _this = this;
      let resultJson = {};

      if (typeof _this.width == 'number') {
        resultJson.width = _this.width + 'px';
      } else if (typeof _this.width == 'string') {
        resultJson.width = _this.width;
      }
      return resultJson;
    },
    getClass: function() {
      let _this = this;
      let resultjson = [];
      if (typeof _this.width == 'string' && ['small', 'large', 'middle'].indexOf(_this.width) >= 0) {
        resultjson.push('input-' + small);
      }
      _this.validMesage && resultjson.push('tsForm-formItem-error');
      return resultjson;
    },
    getShowWordLimit: function() {
      let _this = this;
      if (_this.type == 'password') {
        return false;
      }
      return !!_this.maxlength;
    },
    borderClass: function() {
      let resultJson = {};
      if (this.border) {
        resultJson['tsForm-border-' + this.border] = true;
        resultJson['tsForm-item'] = true;
      }
      this.readonly && (resultJson['tsform-input-readonly'] = true);
      this.className && (resultJson[this.className] = true);
      return resultJson;
    },
    getClearable: function() {
      let _this = this;
      let clearable = this.clearable;
      if (typeof this.clearable == 'undefined') {
        clearable = true;
        _this.validateList &&
          _this.validateList.forEach(item => {
            typeof item == 'string' && item == 'required' && !_this.multiple && (clearable = false);
            typeof item == 'object' && item.name == 'required' && !_this.multiple && (clearable = false);
          });
      }
      return clearable;
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== this.currentValue) {
        // 20200720by:qinqx，由于0为假值，当newValue = 0时，表达式 newValue || '' 的值为''，而不是0，
        // 因此如果TsFormInput组件的this.$props.value变成了0，那么输入框显示的值将是''，而不是预想中的0，
        // _this.currentValue = newValue || ''; // 有bug
        // _this.currentValue = newValue ?? ''; // 解决了bug但是有兼容性问题，有些环境的babel转译不成功
        if (newValue !== null && newValue !== undefined && this.currentValue !== null && this.currentValue !== undefined && newValue.toString() == this.currentValue.toString()) { //主要是兼容 number  和 string 對比相同的情况下面 1 和 "1"
          return;
        }

        this.currentValue = newValue !== null && newValue !== undefined ? newValue : ''; //解决了bug的兼容性写法
        this.validMesage = '';
      }
    },
    validateList() {
      this.currentValidList = this.filterValid(this.validateList) || [];
      this.validMesage = '';
    },
    errorMessage(newValue) {
      this.validMesage = newValue;
    }
  }
};
</script>
<style lang="less" scoped>
.tsform-input-readonly {
  opacity: 0.7;
  cursor: not-allowed;
  .ivu-input {
    cursor: not-allowed;
  }
  .ivu-input-icon-clear {
    display: none !important;
  }
}
</style>
