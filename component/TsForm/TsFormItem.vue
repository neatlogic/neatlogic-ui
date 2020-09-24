<template>
  <div :class="classes" :style="getWitdh">
    <label :class="[prefixCls + '-label','overflow']" :for="labelFor" :style="labelStyles" :title="label.length>6?label:''">
      <FormSlot>{{ label }}</FormSlot>
    </label>
    <div :class="[prefixCls + '-content']" :style="contentStyles">
      <slot></slot>
    </div>
  </div>
</template>
<script>
const prefixCls = 'ivu-form-item';
import FormSlot from './label-slot';
export default {
  name: 'TsFormItem',
  tagComponent: 'TsForm',
  components: { FormSlot },
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      default: 120
    },
    error: {
      type: String
    },
    labelFor: {
      type: String
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    validateList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    name: {
      type: String
    },
    itemWidth: {
      type: [Number, String], //数字和百分比
      default: '100%'
    }
  },
  data() {
    let _this = this;
    return {
      prefixCls: prefixCls,
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    };
  },
  created() {
    let _this = this;
  },
  methods: {
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate('change');
    },
    dispatch(componentName, eventName, params) {
      let parent = this.$parent || this.$root;
      let name = parent.$options.name;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.name;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    }
  },
  computed: {
    classes() {
      let required = getRequired(this.validateList, this.required);
      return [
        'ivu-form-item',
        'tsform-item',
        `ivu-form-label-${this.labelPosition}`,
        {
          [`${prefixCls}-required`]: required || false
        }
      ];
    },
    labelStyles() {
      let style = {};
      //const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance ? this.FormInstance.labelWidth :0;
      const labelWidth = this.labelWidth || 0;
      if (this.labelPosition != 'top') {
        style.width = `${labelWidth}px`;
      }
      return style;
    },
    contentStyles() {
      let style = {};
      //const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance ? this.FormInstance.labelWidth :0;
      const labelWidth = this.labelWidth || 0;
      if (this.labelPosition != 'top') {
        style.marginLeft = `${labelWidth}px !important`;
      }
      return style;
    },
    getWitdh: function() {
      let _this = this;
      let resultJson = {};
      if (typeof _this.itemWidth == 'number') {
        resultJson.width = _this.itemWidth + 'px';
      } else if (typeof _this.itemWidth == 'string' && _this.itemWidth.indexOf('%') >= 0) {
        resultJson.width = _this.itemWidth;
      }
      return resultJson;
    }
  },
  watch: {
    error: {
      handler(val) {
        this.validateMessage = val;
      },
      immediate: true
    },

    required(n, o) {
      this.isRequired = n;
      if (o && !n) {
        this.resetField();
      }
    }
  }
};

function getRequired(validateList, required) {
  let hasRequired = false;
  if (validateList && validateList.length > 0) {
    for (let i = 0; i < validateList.length; i++) {
      let valid = validateList[i];
      if ((typeof valid == 'string' && valid == 'required') || (typeof valid == 'object' && valid.name == 'required')) {
        hasRequired = true;
        break;
      }
    }
  }
  !hasRequired && (hasRequired = required || false);

  return hasRequired;
}
</script>
<style scoped>
.ivu-form-label-right > .ivu-form-item-label {
  padding: 8px 12px 8px 0;
}
.ivu-form-label-left > .ivu-form-item-label {
  position: absolute;
}
.ivu-form-item .ivu-form-item {
  margin-bottom: 24px;
}
</style>
