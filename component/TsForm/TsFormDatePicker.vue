<template>
  <span v-if="readonly" :class="readonlyClass " :title="readonlyTitle">
    <template v-if="type.indexOf('range')>=0 && (currentValue instanceof Array)"> {{ currentValue[0] }} - {{ currentValue[1] }}</template>
    <template v-else> {{ currentValue || '-' }}</template>
  </span>
  <div v-else :class="borderClass" class="form-li">
    <DatePicker
      v-if="type != 'time' && type != 'timerange'"
      v-model="currentValue"
      :placement="placement"
      :class="getClass"
      :type="type"
      :format="getFormat"
      :readonly="readonly"
      :disabled="disabled"
      :size="size"
      :multiple="currentMultiple"
      :placeholder="getPlaceholder"
      :clearable="getClearable"
      :split-panels="splitPanels"
      :style="getStyle"
      :transfer="transfer"
      :editable="false"
      :options="options"
      :confirm="confirm"
      :open="open"
      :separator="separator"
      @on-change="onChangeValue"
      @on-ok="onOk"
      @on-clear="onClear"
      @on-clickoutside="onClickoutside"
    >
      <slot></slot>
    </DatePicker>
    <TimePicker
      v-else
      v-model="currentValue"
      :separator="separator"
      :placement="placement"
      :class="getClass"
      :type="type"
      :format="getFormat"
      :readonly="readonly"
      :disabled="disabled"
      :size="size"
      :multiple="multiple"
      :placeholder="getPlaceholder"
      :split-panels="splitPanels"
      :value="currentValue"
      :clearable="getClearable"
      :style="getStyle"
      :transfer="transfer"
      :editable="false"
      :confirm="confirm"
      :open="open"
      @on-change="onChangeValue"
      @on-ok="onOk"
      @on-clickoutside="onClickoutside"
      @on-clear="onClear"
    >
      <slot></slot>
    </TimePicker>
    <div v-if="desc" class="text-tip">{{ desc }}</div>
    <transition name="fade">
      <slot name="validMessage">
        <span
          v-if="validMesage != ''"
          class="form-error-tip"
          :title="validMesage"
          v-html="validMesage"
        ></span>
      </slot>
    </transition>
  </div>
</template>
<script>
import formMixins from '../../mixins/formMixins.js';
import formScrollMixins from '../../mixins/formScrollMixins.js';
export default {
  name: 'TsFormDatePicker',
  tagComponent: 'TsForm',
  mixins: [formMixins, formScrollMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    type: String, // text textarea  number   select   dynamicSelect  radio  checkbox  date time  timerange
    name: String,
    width: {
      //small  medium   large  block    输入数值    输入百分比
      type: [String, Number],
      default: '100%'
    },
    format: String, //yyyy-MM-dd HH:mm
    multiple: {
      //默认为false  是否可以选择多个日期
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
      //true  false  默认为false
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      //默认值
      default: function() {
        if (this.type == 'datetimerange' || this.type == 'timerange' || this.multiple == true) {
          return new Array();
        } else {
          return '';
        }
      }
    },
    placeholder: String,
    validateList: {
      type: Array
    },
    className: {
      //额外添加class
      type: String
    },
    valueType: {
      //最终获取到的value值是否是时间搓
      type: String,
      default: 'normal' // normal timestamp  format
    },
    splitPanels: {
      //range时的联动
      type: Boolean,
      default: false
    },
    transfer: Boolean, //设置transfer的值
    border: String, //控件的样式 border bottom none
    size: String, // large  small  default   默认为default
    onBlur: Function, //失去焦点时触发
    onFocus: Function, //获取焦点时触发
    onChange: Function, //改变时触发
    isChangeWrite: {
      //赋值时，是否需要出发on-change事件
      type: Boolean,
      default: true
    },
    desc: String,
    readonlyClass: {
      type: String,
      default: 'text-grey tsform-readonly'
    },
    scrollParent: [Object, String],
    options: [Object], //选择器额外配置，比如不可选日期与快捷选项，具体项详见下表 1、不可选  disabledDate：Funtion（value）{return Boolean}  2、shortcuts ：[{text:string, value:function(){return value}，onClick :function(){}}]
    errorMessage: String, //从外部设置校验信息
    confirm: {
      //是否显示底部控制栏
      type: Boolean,
      default: false
    },
    open: {
      //手动控制时间选择器的显示状态，true 为显示，false 为收起。
      type: Boolean,
      default: null
    },
    separator: {
      //分隔符
      type: String,
      default: '-'          
    },
    placement: {
      type: String,
      default: 'bottom-start'      
    }
  },
  data() {
    let _this = this;
    let value = _this.getCurrentValue();
    return {
      currentMultiple: value.multiple,
      validMesage: _this.errorMessage || '',
      currentValidList: _this.filterValid(_this.validateList) || [],
      currentValue: value.value,
      readonlyTitle: null
    };
  },
  mounted() {
    this.readonly && this.initReadolyTitle();
  },
  beforeDestroy() {},
  methods: {
    getCurrentValue: function() {
      let _this = this;
      let format = formatSeting(_this.type, _this.format);
      let valueType = this.valueType;
      let value = null;
      let multiple = _this.multiple;
      if (typeof _this.value == 'number') {
        value = _this.changeDateFormat(new Date(_this.value), format, true, valueType);
      } else if (_this.value instanceof Array) {
        let arry = [];
        arry = _this.value.map(function(item) {
          if (typeof item == 'number') {
            return _this.changeDateFormat(new Date(item), format, true, valueType);
          } else if (format.indexOf('yyyy') >= 0 && !_this.readonly) {
            return new Date(_this.changeDateFormat(new Date(item), format, true, valueType));
          } else {
            return item;
          }
        });
        value = arry;
      } else {
        value = _this.value;
      }
      if (value instanceof Array) {
        multiple = true;
      }
      return {value: value, multiple: multiple};
    },
    onChangeValue() {
      let _this = this;
      let time = _this.getFormatValue();

      let isSame = _this.value == time;
      _this.$emit('update:value', time);
      _this.$emit('change', time);
      if (!(!this.isChangeWrite && isSame)) {
        //改变值时出发on-change事件
        _this.$emit('on-change', time);
      }

      if (!isSame) {
        typeof _this.onChange == 'function' && _this.onChange(time);
        if (_this.currentValidList.length > 0) {
          _this.valid(time);
        }
      } else {
        _this.validMesage = '';
      }
    },
    getFormatValue() {
      let _this = this;
      let format = formatSeting(_this.type, _this.format);
      if (_this.currentValue instanceof Date) {
        return _this.changeDateFormat(_this.currentValue, format, false, _this.valueType);
      } else if (_this.currentValue instanceof Array) {
        return _this.currentValue.map(item => {
          return _this.changeDateFormat(item, format, false, _this.valueType);
        });
      } else {
        return _this.currentValue === '' ? null : _this.currentValue;
      }
    },
    onOk() {
      this.$emit('on-ok');
    },
    onClickoutside() {
      //点击外部关闭下拉菜单时触发
      this.$emit('on-clickoutside');
    },
    onClear() {
      this.$emit('on-clear');
    },
    initReadolyTitle() {
      let width = this.$el.clientWidth;
      let text_length = 0;
      let str = '';
      if (this.type.indexOf('range') >= 0 && this.currentValue instanceof Array) {
        str = this.currentValue[0] + ' - ' + this.currentValue[1];
      } else {
        str = this.currentValue || '';
      }
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 256) {
          text_length = text_length + 1;
        } else {
          text_length = text_length + 0.5;
        }
      }
      this.readonlyTitle = width > text_length * 14 ? null : str;
    },
    //监听父容器滚动时，导致滚出对应的容器的问题
    onScroll: function(event) {
      if (this.$children[0].visible && this.$children[0].$refs.drop) {
        let $contain = event.target;
        let $target = this.$children[0].$refs.drop.$el;
        let targetTop = $target.offsetTop;
        let containTop = $contain.getBoundingClientRect().top;
        if (!(targetTop > containTop + 10 && targetTop < containTop + $contain.clientHeight)) {
          this.$children[0].visible = false;
        }
      }
    },
    changeDateFormat(value, format, isInit, valueType) {
      if (!value) {
        //当value值为空时
        return value;
      }

      let newValue = '';
      let styleType = '-';
      format && format.indexOf('/') >= 0 && (styleType = '/');

      if (format.indexOf('yyyy') < 0 || format.indexOf('MM') < 0) {
        //如果format 不含有 年  月 ，直接返回字符串
        return value;
      }

      if (this.readonly && typeof value == 'string') {
        return value;
      }

      // normal timestamp  format
      if ((format == 'yyyy-MM-dd HH:mm:ss' || format == 'yyyy/MM/dd HH:mm:ss' || valueType == 'timestamp') && !isInit && valueType != 'format') {
        //不是初始化值，并且format完整，直接获取uuid
        return new Date(value).getTime();
      }

      //初始化  valueType=='format'  格式完整
      value instanceof Number && (value = new Date(value));

      let arrayFormat = ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss'];
      if (format.indexOf('yyyy') >= 0) {
        newValue = value.getFullYear();
      }

      if (format.indexOf('MM') >= 0) {
        let mm = value.getMonth() + 1;
        mm < 10 && (mm = '0' + mm);
        newValue = newValue ? newValue + styleType + mm : mm;
      }

      if (format.indexOf('dd') >= 0) {
        let dd = value.getDate();
        dd < 10 && (dd = '0' + dd);
        newValue = newValue ? newValue + styleType + dd : newValue + dd;
      }

      if (format.indexOf('HH') >= 0) {
        let HH = value.getHours();
        HH < 10 && (HH = '0' + HH);
        newValue = newValue ? newValue + ' ' + HH : newValue + HH;
      }

      if (format.indexOf('mm') >= 0) {
        let mm = value.getMinutes();
        mm < 10 && (mm = '0' + mm);
        newValue = format.indexOf('HH') >= 0 ? newValue + ':' + mm : newValue + ' ' + mm;
      }

      if (format.indexOf('ss') >= 0) {
        let ss = value.getSeconds();
        ss < 10 && (ss = '0' + ss);
        newValue = format.indexOf('mm') >= 0 ? newValue + ':' + ss : newValue + ' ' + ss;
      }
      return newValue.toString().trim();
    }
  },
  computed: {
    getFormat: function() {
      let _this = this;
      return formatSeting(_this.type, _this.format);
    },
    getPlaceholder: function() {
      let _this = this;
      let placeholder = '';
      if (_this.placeholder) {
        placeholder = _this.placeholder;
      } else if (_this.type == 'datetime' || _this.type == 'datetimerange') {
        placeholder = '请选择日期';
      } else if (_this.type == 'year') {
        placeholder = '请选年份';
      } else if (_this.type == 'month') {
        placeholder = '请选择月份';
      } else if (_this.type == 'time') {
        placeholder = '请选择时间';
      } else if (_this.type == 'timerange') {
        placeholder = '请选择时间范围';
      }
      return placeholder;
    },
    getClearable: function() {
      let _this = this;
      let clearable = _this.clearable;
      _this.validateList &&
        _this.validateList.forEach(item => {
          typeof item == 'string' && item == 'required' && !_this.multiple && (clearable = false);
          typeof item == 'object' && item.name == 'required' && !_this.multiple && (clearable = false);
        });
      return clearable;
    },
    borderClass: function() {
      let resultJson = {};
      if (this.border) {
        resultJson['tsForm-border-' + this.border] = true;
        resultJson['tsForm-item'] = true;
      }
      this.readonly && (resultJson['tsform-date-readonly'] = true);
      this.className && (resultJson[this.className] = true);
      return resultJson;
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
      // if (typeof _this.width == 'string' && ['small', 'large', 'middle'].indexOf(_this.width) >= 0) {
      //   resultjson.push("input-" + small);
      // }
      _this.validMesage && resultjson.push('tsForm-formItem-error');
      return resultjson;
    }
  },
  watch: {
    value(newValue, oldValue) {
      let _this = this;
      if (newValue instanceof Array) {
        if (JSON.stringify(newValue) != JSON.stringify(this.getFormatValue())) {
          let value = _this.getCurrentValue();
          _this.currentValue = value.value;
          _this.currentMultiple = value.multiple;
          _this.validMesage = '';
        }
      } else if (newValue != this.getFormatValue()) {
        let value = _this.getCurrentValue();
        _this.currentValue = value.value;
        _this.currentMultiple = value.multiple;
        _this.validMesage = '';
      }
    },
    validateList() {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
    },
    errorMessage(newValue) {
      this.validMesage = newValue;
    },
    format(newValue, oldValue) {
      this.$emit('change', this.getFormatValue());
    }
  }
};

function formatSeting(type, format) {
  let resultJson = 'yyyy-MM-dd HH:mm:ss';
  if (format) {
    resultJson = format;
  } else if (type == 'year') {
    resultJson = 'yyyy';
  } else if (type == 'mouth') {
    resultJson = 'MM';
  } else if (type == 'time' || type == 'timerange') {
    resultJson = 'HH:mm:ss';
  }
  return resultJson;
}
</script>
<style lang="less" scoped>
.tsform-date-readonly {
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
