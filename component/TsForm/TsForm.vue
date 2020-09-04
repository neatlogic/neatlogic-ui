
<script>
import validtorJson from './TsValidtor.js';
import TsFormItem from './TsFormItem';
import item from './item.js';
const ITEMTYPELIST = {
  text: 'TsFormInput', //text类型
  textarea: 'TsFormInput', //textarea
  password: 'TsFormInput', //password
  number: 'TsFormInput', //number
  url: 'TsFormInput', //url
  email: 'TsFormInput', //email
  tel: 'TsFormInput', //tel
  select: 'TsFormSelect', //下拉选择框
  radio: 'TsFormRadio', //radio
  switch: 'TsFormSwitch', //
  checkbox: 'TsFormCheckbox',
  datetime: 'TsFormDatePicker', //年-月-日 时：分：秒
  datetimerange: 'TsFormDatePicker', //年-月-日 时：分：秒   范围
  year: 'TsFormDatePicker', //年
  month: 'TsFormDatePicker', //月
  time: 'TsFormDatePicker', //时间 时：分：秒
  timerange: 'TsFormDatePicker',
  tree: 'TsFormTree', //ztree树形插件
  quartz: 'TsQuartz', //定时器插件
  textspan: '', //存文本显示
  userselect: 'UserSelect', //用户授权
  ckeditor: 'TsCkeditor', //富文本编辑框
  codemirror: 'TsCodemirror'
};

export default {
  name: 'TsForm',
  components: {
    ...item
  },
  props: {
    labelPostion: {
      //取值  top  right
      type: String,
      default: 'right'
    },
    itemList: { type: [Array, Object], required: true },
    dataConfig: { type: Object }, //格式{name1:value1,name2:value2}
    labelWidth: {
      type: Number,
      default: 120
    },
    border: {
      //控件的样式
      type: String, //border bottom none
      default: 'border'
    },
    itemWidth: {
      type: [Number, String], //数字和百分比
      default: '100%'
    },
    width: {
      type: [String, Number],
      default: '75%'
    }
  },
  data: function() {
    let _this = this;
    let formSetting = _this.getFormSetting(_this.itemList);
    return {
      ref: new Date().toString() + Math.random(),
      formItem: _this.getFormSetting(_this.itemList),
      initItem: _this.getFormSetting(_this.itemList, true)
    };
  },
  created() {},
  methods: {
    getFormSetting: function(itemList, isRest) {
      let _this = this;
      let isArray = itemList instanceof Array;
      let resultItemJson = {};
      if (itemList) {
        let isArray = _this.itemList instanceof Array;
        for (let key in itemList) {
          let item = itemList[key];
          let keyName = isArray ? item.name : key;
          if ((typeof item.value == 'undefined' || item.value == null || (typeof item.value == 'string' && item.value.trim() == '')) && !isRest) {
            resultItemJson[keyName] = null;
          } else {
            resultItemJson[keyName] = item.value;
          }
        }
      }
      return resultItemJson;
    },
    getFormValue: function() {
      let _this = this;
      _this.formItem = _this.getFormSetting(_this.itemList);
      return _this.formItem;
    },
    getItemByName: function(name) {
      var _this = this;
      var resultJson = null;
      let isArray = _this.itemList instanceof Array;
      for (let key in _this.itemList) {
        let item = _this.itemList[key];
        let keyName = isArray ? item.name : key;
        if ((keyName = name)) {
          resultJson = item;
          return false;
        }
      }
      return resultJson;
    },
    resetForm: function() {
      let _this = this;
      let isArray = _this.itemList instanceof Array;
      for (let key in _this.itemList) {
        let item = _this.itemList[key];
        let keyName = isArray ? item.name : key;
        item.value = _this.initItem[keyName];
      }
    },
    clearForm: function(val, name) {
      var _this = this;
      for (let key in _this.itemList) {
        let item = _this.itemList[key];
        if ((item.type == 'select' && item.multiple == true) || item.type == 'checkbox' || item.type == 'datetimerange' || item.type == 'timerange' || (item.multiple == true && item.type == 'userselect')) {
          item.value = [];
        } else {
          item.value = '';
        }
      }
    },
    valid: function() {
      this.$children[0].$options.customOption;
      let _this = this;
      let isValid = true;
      this.$children.forEach(item => {
        item.$children.forEach(component => {
          if (component.$options.tagComponent == 'TsForm' && component.valid) {
            !component.valid() && (isValid = false);
          }
        });
      });
      return isValid;
    }
  },
  computed: {
    widthClass() {
      let _this = this;
      let returnClass = { tsForm: true };
      returnClass['tsForm-border-' + _this.border] = true; // 边框的样式
      _this.itemWidth != '100%' && (returnClass.formFlex = true);
      returnClass['ivu-form-label-' + _this.labelPostion] = true;
      return returnClass;
    }
  },
  render(h, cx) {
    let $formItem = [];
    let _this = this;
    let isArray = false;
    _this.itemList instanceof Array ? (isArray = true) : ''; //判断值是array还是object
    for (let i in _this.itemList) {
      let item = _this.itemList[i];
      let $handler = null;
      !isArray && (item.name = i);
      //当不含有value值时,需要动态的设置值
      //20200901_zqp_修改item.hasOwnProperty('value)写法
      if (!Object.prototype.hasOwnProperty.call(item, 'value')) {
        if ((item.type == 'select' && item.multiple == true) || item.type == 'checkbox' || item.type == 'datetimerange' || item.type == 'timerange' || (item.multiple == true && item.type == 'userselect')) {
          _this.$set(item, 'value', []);
        } else {
          _this.$set(item, 'value', '');
        }
      }

      if (item.isHidden) {
        continue;
      }
      if (item.type == 'slot') {
        //卡槽类型的判断
        $handler = _this.$slots[item.name] ? _this.$slots[item.name][0] : null;
      } else if (item.type == 'textspan') {
        //纯文本的显示
        $handler = h('div', { domProps: { innerHTML: item.value } });
      } else if (ITEMTYPELIST[item.type]) {
        item.width = item.width || _this.width;
        $handler = h(ITEMTYPELIST[item.type], {
          props: item,
          on: {
            change(val) {
              //实现v-model功能
              _this.dataConfig && typeof _this.dataConfig[item.name] != 'undefined' && (_this.dataConfig[item.name] = val);
              item.value = val;
            }
          }
        });
      }

      let $item = h(
        TsFormItem,
        {
          props: {
            label: item.label,
            validateList: item.validateList,
            itemWidth: item.itemWidth || _this.itemWidth,
            labelPostion: item.labelPostion || _this.labelPostion,
            labelWidth: item.labelWidth || _this.labelWidth,
            name: item.name
          }
        },
        [$handler]
      );

      $formItem.push($item);
    }
    return h('div', { class: _this.widthClass }, $formItem);
  }
};
</script>
<style scoped>
.formFlex {
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}
.formFlex > .ivu-form-item {
  padding: 0px 10px;
}
</style>
