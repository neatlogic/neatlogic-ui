<template>
  <div>
    <input v-model="currentValue" type="hidden" class="test" @change="onChangeValue" />
    <div v-if="desc" class="text-tip">{{ desc }}</div>
  </div>
</template>
<script>
import Quartz from './quartz';
import './quartz.less';
export default {
  name: 'TsQuartz',
  components: {},
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String,
    showType: {
      default: 'edit',
      String: String
    },
    desc: String
  },
  data() {
    var _this = this;
    return {
      currentValue: _this.value || '',
      quartzDom: null
    };
  },
  mounted() {
    let _this = this;
    _this.currentValue = _this.value;
    this.initQuartz();
    //new Quartz(_this.$el.querySelector('.test'),{value:_this.currentValue,setValue:_this.setCurrentValue,type:_this.showType});
  },
  destroyed() {},

  methods: {
    onChangeValue: function() {
      var _this = this;
      _this.$emit('change', _this.currentValue);
    },
    setCurrentValue: function(value) {
      var _this = this;
      _this.currentValue = value;
      _this.onChangeValue();
    },
    initQuartz: function() {
      let _this = this;
      _this.quartzDom = new Quartz(_this.$el.querySelector('.test'), {
        value: _this.currentValue,
        setValue: _this.setCurrentValue,
        type: _this.showType
      });
    }
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      if (this.showType == 'read') {
        this.quartzDom.updateValue(val);
      }
    }
  }
};
</script>
