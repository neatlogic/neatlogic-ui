<template>
  <div class="form-li">
    <span v-if="readonly" class="tsform-readonly">{{ getText }}</span>
    <RadioGroup v-else v-model="currentValue" :class="getClass" :type="radioType" :vertical="vertical" @on-change="onChangeValue">
      <Radio v-for="(data, index) in nodeList" :key="index" :label="data[valueName]" :disabled="disabled || data.disabled || readonly" :class="{ 'tsform-radio-readonly': readonly }">
        <span><slot name="label" :node="data" :index="index">{{ data[textName] }}</slot></span>
      </Radio>
    </RadioGroup>
    <div v-if="desc" class="text-tip">{{ desc }}</div>
    <transition name="fade">
      <span v-if="validMesage != ''" class="form-error-tip" v-html="validMesage"></span>
    </transition>
  </div>
</template>
<script>
import axios from '../../api/http.js';
import formMixins from '../../mixins/formMixins.js';
export default {
  name: 'TsFormRadio',
  tagComponent: 'TsForm',
  mixins: [formMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    dataList: Array,
    name: String,
    radioType: String, //取值 button
    disabled: {
      type: Boolean,
      default: false
    }, //true  false  默认为false
    valueName: {
      default: 'value'
    },
    textName: {
      default: 'text'
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    }, //默认值
    validateList: {
      type: Array
    },
    url: {
      //通过url初始化数据
      type: String,
      default: ''
    },
    params: Object,
    rootName: {
      //通过url来获取数据的rootName
      default: ''
    },
    className: {
      //额外添加class
      type: String
    },
    onChange: Function, //改变时触发
    vertical: Boolean, //是否纵向排列
    readonly: {
      type: Boolean,
      default: false
    },
    isChangeWrite: {
      //赋值时，是否需要出发on-change事件
      type: Boolean,
      default: true
    },
    desc: String,
    errorMessage: String, //从外部设置校验信息
    dealDataByUrl: {//特殊情况 通过url获取的数据可能需要额外的封装之后才能使用
      type: Function
    }
  },
  data() {
    let _this = this;
    return {
      currentValue: _this.value,
      validMesage: _this.errorMessage || '',
      nodeList: _this.url ? [] : _this.dataList,
      currentValidList: _this.filterValid(_this.validateList) || []
    };
  },
  created: function() {
    this.initDataListByUrl();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    initDataListByUrl: function() {
      let _this = this;
      if (_this.url) {
        let params = { needPage: false };
        typeof _this.params == 'object' && (params = Object.assign(params, _this.params));
        _this.nodeList = [];
        axios.post(_this.url, params).then(res => {
          if (res) {
            if (res.Status == 'OK') {
              _this.nodeList = _this.rootName ? res.Return[_this.rootName] : res.Return;
              _this.nodeList.length > 500 && (_this.nodeList.length = 500);
              if (_this.dealDataByUrl && typeof _this.dealDataByUrl == 'function') {
                _this.nodeList = _this.dealDataByUrl(_this.nodeList);
              }
            } else {
              _this.$Notice.warning({
                title: '操作失败',
                desc: res.Message
              });
            }
          }
        });
      }
    },
    onChangeValue() {
      let _this = this;

      let isSame = _this.value == _this.currentValue;
      _this.$emit('update:value', _this.currentValue);
      _this.$emit('change', _this.currentValue);
      if (!(!this.isChangeWrite && isSame)) {
        //改变值时出发on-change事件
        _this.$emit('on-change', _this.currentValue);
      }

      if (!isSame) {
        typeof _this.onChange == 'function' && _this.onChange(_this.currentValue);
        if (_this.currentValidList.length > 0) {
          _this.valid(_this.currentValue);
        }
      } else {
        _this.validMesage = '';
      }
    }
  },
  computed: {
    getClass() {
      let reslutClass = {};
      this.className && (reslutClass[this.className] = true);
      return reslutClass;
    },
    getText() {
      let node = this.nodeList.find(item => item[this.valueName] == this.value);
      return node ? node[this.textName] : '-';
    }
  },
  watch: {
    value(newValue, oldValue) {
      let _this = this;
      if (newValue != _this.currentValue) {
        _this.currentValue = newValue;
        _this.validMesage = '';
      }
    },
    validateList() {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
    },
    dataList(newValue) {
      if (!this.url) {
        this.$set(this, 'nodeList', newValue);
      }
    },
    url() {
      this.initDataListByUrl();
    },
    params(newValue) {
      this.initDataListByUrl();
    },
    errorMessage(newValue) {
      this.validMesage = newValue;
    }
  }
};
</script>
<style lang="less" scoped>
//只读模式的样式修改
.tsform-radio-readonly {
  .ivu-radio-wrapper-disabled,
  .ivu-radio-disabled {
    opacity: 0.7;
  }
}
</style>
