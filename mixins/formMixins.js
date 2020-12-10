
export default {
  methods: {
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
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    dealNoExist(selectList, value) {
      let data = null;
      if (value instanceof Array) {
        data = [];
        value && value.forEach(val => {
          let sel = selectList.find(item => {
            return item[this.valueName] === val;
          });
          sel && data.push(val);
        });
      } else if (typeof value == 'string') {
        data = '';
        if (value) {
          let sel = selectList.find(item => {
            return item[this.valueName] === value;
          });
          if (sel != null && sel != undefined) {
            data = value;
          } 
        } else {
          data = value;
        }
      } else {
        data = value;
      }
      this.currentValue = data;
      this.$emit('change', data);
      return data;
    },
    filterValid(validateList) {
      let _this = this;
      this.isRequired = false;
      let resultValidtorJson = [];
      let validtorJson = require('../component/TsForm/TsValidtor').default;
     
      if (validateList && validateList.length > 0) {
        //默认值的初始化
        //表单验证 对required进行特殊处理添加 required: true属性
        
        validateList.forEach(function(valid, c) {
          if (typeof valid == 'string') {
            //出入key值，利用默认数据
            validtorJson[valid] && (valid == 'required' ? resultValidtorJson.push(Object.assign({ required: true }, validtorJson[valid])) : resultValidtorJson.push(validtorJson[valid]));
            if (valid == 'required') {
              _this.isRequired = true;
            }
          } else if (typeof valid == 'object') {
            if (validtorJson[valid.name] && valid.name == 'regex' && valid.pattern) {
              // ^[a-z]+$   正则表达式
              resultValidtorJson.push(Object.assign({}, validtorJson.regex, valid));
            } else if (validtorJson[valid.name]) {
              //利用默认key值，但是修改message提示
              valid.name == 'required' ? resultValidtorJson.push(Object.assign({ required: true }, validtorJson[valid.name], valid)) : resultValidtorJson.push(Object.assign({}, validtorJson[valid.name], valid));
              if (valid.name == 'required') {
                _this.isRequired = true;
              }
            } else if (typeof valid.validator == 'function') {
              resultValidtorJson.push(Object.assign({}, validtorJson[valid.name], valid));
            }
          }
        });
      }
      return resultValidtorJson;
    },
    valid: function(val) {
      let _this = this;
      let isValid = true;
      if (_this.currentValidList && _this.currentValidList.length > 0 && !this.readonly && !this.disabled) {
        for (let i = 0; i < _this.currentValidList.length; i++) {
          let valid = _this.currentValidList[i];
          isValid = true;
          let value = val || _this.currentValue;
          !(value instanceof Array) && (value = [value]);
          if (value.length == 0 && valid.required) {
            _this.$set(_this, 'validMesage', valid.message);
            isValid = false;
          }
          for (let cindex = 0; cindex < value.length; cindex++) {
            let v = value[cindex];
            if (!valid.validator('', v, _this)) {
              _this.$set(_this, 'validMesage', valid.message);
              isValid = false;
              break;
            }
          }
          if (isValid && !!this.errorMessage) {
            _this.$set(_this, 'validMesage', this.errorMessage);
            isValid = false;
            break;
          }
          if (isValid && !!_this.validMesage) {
            _this.$set(_this, 'validMesage', '');
          } else if (!isValid) {
            break;
          }
        }
      }
      return isValid;
    },
    canValid(way, validateList) {
      let canWary = false;
      for (let i = 0; i < validateList.length; i++) {
        if (validateList[i].trigger.indexOf(way) >= 0) {
          canWary = true;
          break;
        }
      }
      return canWary;
    }
  }
};
