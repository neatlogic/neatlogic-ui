<template>
  <div class="form-li">
    <i-switch
      v-model="currentValue"
      :true-value="trueValue"
      :false-value="falseValue"
      :disabled="disabled"
      @on-change="onChangeValue"
    />
    <div v-if="desc" class="text-tip">{{ desc }}</div>
  </div>
</template>
<script>
export default {
  name: 'TsFormSwitch',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: String,
    disabled: {
      type: Boolean,
      default: false
    }, //true  false  默认为false
    falseValue: {
      //false 时对应的值
      type: [String, Number, Boolean],
      default: 0
    },
    trueValue: {
      //true 时对应的值
      type: [String, Number, Boolean],
      default: 1
    },
    value: {
      type: [String, Number, Boolean],
      default: false
    }, //默认值
    validateList: {
      type: Array
    },
    className: {
      //额外添加class
      type: String
    },
    onChange: Function, //改变时触发,
    readonly: {
      type: Boolean,
      default: false
    },
    desc: String
  },
  data() {
    let _this = this;
    return {
      currentValue: _this.value
    };
  },
  methods: {
    onChangeValue() {
      let _this = this;
      _this.$emit('update:value', _this.currentValue);
      _this.$emit('change', _this.currentValue);
      _this.$emit('on-change', _this.currentValue);
      typeof _this.onChange == 'function' && _this.onChange(_this.currentValue);
    }
  },
  watch: {
    value(newValue, oldValue) {
      let _this = this;
      if (newValue != _this.currentValue) {
        _this.currentValue = newValue;
      }
    }
  }
};
</script>
