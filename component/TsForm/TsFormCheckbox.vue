<template>
  <div class="form-li">
    <span v-if="readonly" class="tsform-readonly">
      <template v-if="nodeList.length > 0">
        <span v-for="(val, dindex) in value" :key="dindex" class="tsform-readonly-item">
          {{ getText(val) }}
          <span v-if="dindex < value.length - 1" class="text-grey tsform-readonly-sperate">{{ sperateText }}</span>
        </span>
      </template>
      <template v-else>-</template>
    </span>
    <CheckboxGroup v-else v-model="currentValue" :class="getClass" :readonly="readonly" @on-change="onChangeValue">
      <Checkbox v-for="(data, index) in nodeList" :key="index" :label="data[valueName]" :disabled="disabled || data.disabled"><slot name="label" :node="data" :index="index">{{ data[textName] }}</slot></Checkbox>
    </CheckboxGroup>
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
  name: 'TsFormCheckbox',
  tagComponent: 'TsForm',
  mixins: [formMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    dataList: Array,
    name: String,
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
      //默认值
      type: Array,
      default: new Array()
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
    validateList: {
      type: Array
    },
    vertical: {
      //横向 false，纵向 true
      type: Boolean,
      default: false
    },
    className: {
      //额外添加class
      type: String
    },
    onChange: Function, //改变时触发
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
    sperateText: {
      type: String,
      default: '|'
    },
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
    test() {
      return false;
    },
    initDataListByUrl: function() {
      let _this = this;
      if (_this.url) {
        _this.nodeList = [];
        let params = { needPage: false };
        typeof _this.params == 'object' && (params = Object.assign(params, _this.params));
        _this.nodeList = [];
        axios.post(_this.url, params).then(res => {
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
        });
      }
    },
    onChangeValue() {
      let _this = this;
      let isSame = JSON.stringify(this.value) == JSON.stringify(this.currentValue);
      let value = JSON.parse(JSON.stringify(this.currentValue));
      _this.$emit('update:value', value);
      _this.$emit('change', value);
      if (!(!this.isChangeWrite && isSame)) {
        //改变值时出发on-change事件
        _this.$emit('on-change', value);
        typeof _this.onChange == 'function' && _this.onChange(value);
      }
      if (!isSame) {
        //值不相同时，触发校验
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
      let reslutClass = { 'ivu-checkbox-group-vertical': this.vertical };
      this.className && (reslutClass[this.className] = true);
      return reslutClass;
    },
    getText() {
      let _this = this;
      return function(val) {
        let node = _this.nodeList.find(item => item[_this.valueName] == val);
        return node ? node[_this.textName] : '';
      };
    }
  },
  watch: {
    value(newValue, oldValue) {
      let _this = this;
      if (JSON.stringify(newValue) != JSON.stringify(_this.currentValue)) {
        _this.currentValue = JSON.parse(JSON.stringify(newValue));
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
    url(newValue, oldValue) {
      if (newValue != oldValue) {
        this.initDataListByUrl();
      }
    },
    params(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
        this.initDataListByUrl();
      }
    },
    errorMessage(newValue) {
      this.validMesage = newValue;
    }
  }
};
</script>
<style lang="less" scoped>
.ivu-checkbox-group-vertical {
  .ivu-checkbox-group-item {
    display: block;
    height: 30px;
    line-height: 30px;
  }
}
//只读模式的样式修改
.tsform-checkbox-readonly {
  .ivu-checkbox-wrapper-disabled,
  .ivu-checkbox-disabled {
    opacity: 0.7;
  }
}
</style>
