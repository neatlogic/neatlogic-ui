<!-- 授权 -->
<template>
  <div class="form-li">
    <div v-if="disabled" class="bg-grey border-color text-tip read-container">{{ showText }}</div>
    <div v-else v-click-outside:false="onClickOutside" v-click-outside:false.mousedown="onClickOutside" v-click-outside:false.touchstart="onClickOutside" :class="borderClass" :style="getStyle" @click.stop>
      <Dropdown ref="dropdownContain" style="width:100%" trigger="custom" :visible="isVisible" :transfer="transfer" placement="bottom-start">
        <div class="search-contain" @click="isVisible = !isVisible">
          <span class="search-input ivu-select-selection empty-placeholder" :placeholder="placeholder">{{ showText }}</span>
          <i :class="['ivu-select-arrow', { 'tsfont-down': !isVisible }, { 'tsfont-up': isVisible }]"></i>
          <i v-if="showText && clearable" class="clearBtn ivu-icon ivu-icon-ios-close-circle" @click="clearValue"></i>
        </div>
        <DropdownMenu slot="list" ref="dropdown" class="list-contain">
          <li v-for="(item, index) in timeList" :key="index" :class="getliClass(item)" @click="onChange(item.value, item)">
            {{ item.text }}
          </li>
          <template v-if="isMore">
            <li class="ivu-dropdown-item line border-color"></li>
            <li :class="getliClass(datetimerange)" :style="{'width': timerWidth}" @click="onChange(datetimerange.value, datetimerange)">
              {{ datetimerange.text }}
            </li>
            <li v-if="showTimeRange" style="min-width: 225px;" :style="{'width': timerWidth}" @click.stop>
              <TsFormDatePicker v-model="timeValue" border="border" :placement="placement" :type="type" :splitPanels="isRelative" :format="format" :value-type="valueType" :placeholder="placeholder" :separator="' '+separator+' '" @on-change="saveTimeRange" @on-ok="confirmTimeRange"></TsFormDatePicker>
            </li>
          </template>
        </DropdownMenu>
      </Dropdown>
      <transition name="fade">
        <span v-show="validMesage != ''" class="form-error-tip">{{ validMesage }}</span>
      </transition>
    </div>
  </div>
</template>
<script>
import axios from '../../api/http.js';
import TsFormDatePicker from '../TsForm/TsFormDatePicker';
import TransferDom from '../../directives/transfer-dom';
import { directive as ClickOutside } from '../../directives/v-click-outside-x';
export default {
  name: 'TimeSelect',
  components: { TsFormDatePicker },
  tagComponent: 'TsForm',
  directives: { TransferDom, ClickOutside },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    isMore: {
      //是否支持自定义时间
      type: Boolean,
      default: true
    },
    dataList: {
      type: Array,
      default: () => {
        return [
          { value: '1', text: '最近一天', timeUnit: 'day' },
          { value: '1', text: '最近一周', timeUnit: 'week' },
          { value: '15', text: '最近半个月', timeUnit: 'day' },
          { value: '1', text: '最近一个月', timeUnit: 'month' },
          { value: '6', text: '最近半年', timeUnit: 'month' },
          { value: '1', text: '最近一年', timeUnit: 'year' }
        ];
      }
    }, //自定义下拉数据
    value: Object,
    border: String, //控件的样式 border bottom none
    clearable: {
      type: Boolean,
      default: true
    },
    type: {
      //自定义时间的类型
      type: String,
      default: 'daterange'
    },
    format: {
      //自定义时间的时间格式
      type: String,
      default: 'yyyy-MM-dd'
    },
    placeholder: {
      type: String,
      default: '请选择时间段'
    },
    valueType: {
      //获取时间 字符串  时间戳  等
      type: String,
      default: 'timestamp' // timestamp  format
    },
    validateList: {
      type: Array
    },
    transfer: {
      type: Boolean,
      default: true
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    isRelative: {
      type: Boolean,
      default: true
    },
    separator: {
      type: String,
      default: '-'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom-start'      
    },
    timerWidth: {
      type: [String, Number],
      default: 200      
    }
  },
  data() {
    let _this = this;
    let dataList = JSON.parse(JSON.stringify(_this.dataList));
    var datetimerange = { value: '_datetimerange', text: '自定义' };
    // if (this.isMore) {
    //   dataList.push(datetimerange);
    // }
    return {
      datetimerange: datetimerange,
      isVisible: false,
      timeList: dataList,
      timeValue: null,
      showText: '',
      showTimeRange: false,
      currentValue: _this.value || {},
      validMesage: ''
    };
  },
  created() {
    this.initShowText();
  },
  beforeMount() {},
  mounted() {
    if (this.$refs.dropdown) {
      this.$refs.dropdown.$el.parentNode.style.maxHeight = 'initial';
      this.$refs.dropdown.$el.parentNode.style.overflow = 'initial';
    }
  },
  beforeDestroy() {
  },
  methods: {
    initShowText() {
      let _this = this;
      if (this.currentValue && this.currentValue.timeRange) {
        //回写固定时间
        let selectedItem = this.timeList.find(function(item, index) {
          if (item.value == _this.currentValue.timeRange && (!item.timeUnit || item.timeUnit == _this.currentValue.timeUnit)) {
            _this.$set(_this.timeList[index], 'selected', true);
            return item;
          }
        });
        selectedItem && (this.showText = selectedItem.text);
        this.showTimeRange = false;
      } else if (this.currentValue && this.currentValue.startTime) {
        //会写自定义时间
        this.showTimeRange = true;
        _this.$set(_this.datetimerange, 'selected', true);
        this.dealTimeValue(true, true);
      } else {
        this.showTimeRange = false;
        this.timeValue = null;
        this.showText = '';
      }
    },
    onChange(value, item) {
      if (item.selected) {
        return;
      }

      if (value == '_datetimerange') {
        //自定义
        this.showTimeRange = true;
        this.$nextTick(function() {
          this.updatePosition();
        });
      } else {
        this.showTimeRange = false;
        this.timeValue = null;
        this.timeList.forEach(time => {
          time.selected && (time.selected = false);
        });
        this.datetimerange.selected = false;
        this.$set(item, 'selected', true);
        this.showText = item.text;
        this.currentValue = { timeRange: item.value, timeUnit: item.timeUnit };
        this.valid();
        this.$emit('on-change', this.currentValue);
        this.$emit('change', this.currentValue);
        this.isVisible = false;
      }
    },
    saveTimeRange() {
      //时间插件确认按钮
      this.timeList.forEach(time => {
        time.selected && (time.selected = false);
      });
      this.$set(this.datetimerange, 'selected', true);
      this.dealTimeValue(false, true);
      if (!this.showText.trim()) {
        this.showText = '';
        this.currentValue = null;
      } else if (this.type.indexOf('range') >= 0) {
        this.currentValue = { startTime: this.timeValue[0] || null, endTime: this.timeValue[1] || null };
      } else {
        this.currentValue = { startTime: this.timeValue || null, endTime: this.timeValue || null };
      }
      this.valid();
      this.$emit('on-change', this.currentValue);
      this.$emit('change', this.currentValue);
    },
    clearValue() {
      //清除值
      this.showText = '';
      this.timeValue = null;
      this.showTimeRange = false;
      this.currentValue = null;
      this.isVisible = false;
      this.timeList.forEach(time => {
        time.selected && (time.selected = false);
      });
      this.datetimerange.selected = false;
      this.$emit('on-change', this.currentValue);
      this.$emit('change', this.currentValue);
    },
    hideOption() {
      this.isVisible = false;
    },
    dealTimeValue(setValue, setText) {
      if (setValue) {
        let timeValue = null;
        if (this.type.indexOf('range') >= 0) {
          timeValue = [this.currentValue.startTime, this.currentValue.endTime];
        } else {
          timeValue = this.currentValue.startTime;
        }
        this.timeValue = timeValue;
      }

      if (setText) {
        let showText = '';
        if (this.timeValue instanceof Array) {
          //数组的回显
          this.timeValue.forEach(item => {
            let text = this.valueType == 'timestamp' && item ? this.$utils.getDateByFormat(item, this.format) : item;
            showText = showText ? (showText + ' ' + this.separator + ' ' + text) : (showText + text);
          });
        } else {
          //字符串的回显
          this.valueType == 'timestamp' && this.timeValue ? (showText = this.$utils.getDateByFormat(this.timeValue, this.format)) : (showText = this.timeValue);
        }
        this.showText = showText;
      }
    },
    onClickOutside(event) {
      //点击外部，dropdown消失
      if (this.isVisible) {
        if (event.type === 'mousedown') {
          event.preventDefault();
        }
        const $el = this.$refs.dropdown ? this.$refs.dropdown.$el || null : null;
        if (!$el || $el === event.target || $el.contains(event.target)) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();
        this.isVisible = false;
        !this.datetimerange.selected && (this.showTimeRange = false);
        const $contain = this.$refs.dropdownContain ? this.$refs.dropdownContain.$el || null : null;
        if ((!$contain && $contain === event.target) || $contain.contains(event.target)) {
          return;
        }
      }
    },
    updatePosition() {
      //更新dropdown，下拉框的位置
      this.$refs.dropdownContain && this.$refs.dropdownContain.$children[0].update();
    },
    valid() {
      if (!this.currentValue && this.validateList && this.validateList.length > 0 && this.validateList[0] == 'required') {
        if (!this.currentValue || (!this.currentValue.timeRange && !this.currentValue.startTime)) {
          this.validMesage = '请输入内容';
          return false;
        }
      } else {
        this.validMesage = '';
        return true;
      }
    },
    confirmTimeRange() {
      this.isVisible = false;
      this.$emit('on-ok', this.currentValue);
    }
  },
  computed: {
    getStartDate() {
      let startDate = null;
      if (this.startTime) {
        startDate = new Date(startDate);
      }
      return startDate;
    },
    getliClass() {
      return function(item) {
        return ['ivu-dropdown-item', { selected: item.selected }];
      };
    },
    borderClass: function() {
      let resultJson = { 'timeselect-contain': true };
      if (this.border) {
        resultJson['tsForm-border-' + this.border] = true;
        resultJson['tsForm-item'] = true;
      }
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
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue && JSON.stringify(newValue) != JSON.stringify(this.currentValue)) {
        this.currentValue = this.value;
        this.timeList.forEach(item => {
          this.$set(item, 'selected', false);
        });
        this.datetimerange.selected = false;
        this.initShowText();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.read-container {
  border: 1px solid;
  line-height: 30px;
  padding: 0 8px;
  border-radius: 2px;
}
.timeselect-contain {
  position: relative;
  display: block;
  vertical-align: middle;
  width: 100%;
  .search-contain {
    position: relative;
    .search-input {
      line-height: 30px;
      padding-right: 20px;
      overflow: hidden;
      padding: 0px 8px;
      height: 30px;
      &:empty:before {
        content: attr(placeholder);
      }
    }
    &:hover {
      .clearBtn {
        display: block;
      }
    }
    .clearBtn {
      position: absolute;
      right: 8px;
      top: 10px;
      display: none;
    }
    .dropIcon {
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
}
ul.list-contain {
  min-width: 100%;
  border-radius: 2px;
  z-index: 2;
  line-height: 1.6;
  &.bottom-start {
    left: 0px;
  }
  &.bottom-end {
    right: 0px;
    left: auto;
  }
  &.top-start {
    bottom: 32px;
  }
  &.top-end {
    bottom: 32px;
    right: 0px;
    left: auto;
  }
  > li {
    cursor: pointer;
    padding: 7px 16px;
    min-width: 225px;
  }
  .datetimerange {
    border-top: 1px solid;
    padding-top: 8px;
    padding-bottom: 8px;
  }
}
</style>
<style lang="less">
.ivu-select-dropdown {
  .ivu-dropdown-item.line {
    border-top: 1px solid;
    padding: 0px;
    margin: 5px 0px;
    cursor: auto;
  }
}
</style>
