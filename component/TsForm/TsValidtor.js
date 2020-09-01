//true 代表校验通过，  false代表校验不通过
let validtor = {
  required: {
    trigger: 'change',
    message: '请输入内容',
    validator: function(rule, value) {
      if (typeof value == 'string') {
        return value.trim() != '';
      } else if (typeof value == 'undefined' || value == null) {
        return false;
      } else if (value instanceof Array && value.length === 0) {
        return false;
      }
      return true;
    }
  },
  number: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      return /^[0-9]\d*$/.test(value);
    },
    trigger: 'change',
    message: '请输入数字'
  },
  float: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      return /^\d+(\.\d+)?$/.test(value);
    },
    trigger: 'change',
    message: '请输入浮点数'
  },
  mail: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      return /^[_a-zA-Z0-9-]{1}([\._a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+){1,3}$/.test(value);
    },
    trigger: 'change',
    message: '请输入邮箱地址'
  },
  char: {
    validator: function(rule, value) {
      return /^[a-z\_\-A-Z]*$/.test(value);
    },
    trigger: 'change',
    message: '请输入英文字符'
  },
  chinese: {
    validator: function(rule, value) {
      return /^[\u4e00-\u9fff]$/.test(value);
    },
    trigger: 'change',
    message: '请输入汉字'
  },
  dbindex: {
    validator: function(rule, value) {
      return /^[\d]+,[\d]+$/.test(value);
    },
    trigger: 'change',
    message: '格式不正确'
  },
  smtp: {
    validator: function(rule, value) {
      return /^smtp\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){1,3}(\:[0-9]+){0,1}$/.test(value);
    },
    trigger: 'change',
    message: '请输入正确的SMTP服务器地址'
  },
  pop: {
    validator: function(rule, value) {
      return /^pop\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){1,3}(\:[0-9]+){0,1}$/.test(value);
    },
    trigger: 'change',
    message: '请输入正确的POP服务器地址'
  },
  imap: {
    validator: function(rule, value) {
      return /^imap\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){1,3}(\:[0-9]+){0,1}$/.test(value);
    },
    trigger: 'change',
    message: '请输入正确的IMAP服务器地址'
  },
  ip: {
    validator: function(rule, value) {
      if (value != '') {
        return /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/.test(value);
      } else {
        return true;
      }
    },
    trigger: 'change',
    message: '请输入正确的IP地址'
  },
  cidr: {
    validator: function(rule, value) {
      if (value != '' && value != '*') {
        return /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/.test(value);
      } else {
        return true;
      }
    },
    trigger: 'change',
    message: '请输入正确的CIDR地址'
  },
  url: {
    validator: function(rule, value) {
      if (value != '') {
        return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+$/.test(value);
      } else {
        return true;
      }
    },
    trigger: 'change',
    message: '请输入正确的URL地址'
  },
  phone: {
    validator: function(rule, value) {
      if (value != '') {
        return /^[1][3,4,5,7,8][0-9]{9}$/.test(value);
      } else {
        return true;
      }
    },
    trigger: 'change',
    message: '请输入正确的电话号码'
  },
  maxNum: {
    validator: function(rule, value) {
      return /^[0-9]\d*|(\-1)$/.test(value);
    },
    trigger: 'change',
    message: '请输入-1或正数'
  },
  PeriodOfTime: {
    validator: function(rule, value) {
      return /^(?:[0-1]?[0-9]|2[0-3]):[0-5]?[0-9]-(?:[0-1]?[0-9]|2[0-3]):[0-5]?[0-9](?: +(?:[0-1]?[0-9]|2[0-3]):[0-5]?[0-9]-(?:[0-1]?[0-9]|2[0-3]):[0-5]?[0-9])*$/.test(value);
    },
    trigger: 'change',
    message: '请输正确的时间段,格式为10:00-12:00,多个用空格隔开.'
  },
  exclude: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      if (/^(((\d)(-\d)?(,)?)*)$/.test(value)) {
        var flag = true;
        var arr = new Array();
        arr = value.trim().split(/-|,/);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] < 0 || arr[i] > 255 || arr[i] > arr[i + 1]) {
            flag = false;
          }
        }
        if (flag) {
          return true;
        }
      }
      return false;
    },
    trigger: 'change',
    message: '请输入正确的保留地址。'
  },
  port: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      if (isNaN(value)) {
        return false;
      }

      if (parseInt(value, 10) != value) {
        return false;
      }

      if (parseInt(value, 10) < 0 || parseInt(value) > 65535) {
        return false;
      }
      return true;
    },
    trigger: 'change',
    message: '请输入0至65535之间的整数'
  },
  mask: {
    validator: function(rule, value) {
      if (value == '') {
        return true;
      }
      if (isNaN(value)) {
        return false;
      }

      if (parseInt(value, 10) != value) {
        return false;
      }

      if (parseInt(value, 10) < 8 || parseInt(value) > 32) {
        return false;
      }
      return true;
    },
    trigger: 'change',
    message: '请输入正确的掩码'
  },
  integer_p: {
    validator: function(rule, value) {
      if (value == '') return true;
      if (isNaN(value)) return false;
      if (parseInt(value) != value) return false;
      if (parseInt(value) <= 0) return false;
      return true;
    },
    trigger: 'change',
    message: '请输入正整数'
  },
  integer_natural: {
    validator: function(rule, value) {
      if (value == '') return true;
      if (isNaN(value)) return false;
      if (parseInt(value) != value) return false;
      if (parseInt(value) < 0) return false;
      return true;
    },
    trigger: 'change',
    message: '请输入非负整数'
  },
  integer: {
    validator: function(rule, value) {
      if (isNaN(value)) return false;
      if (parseInt(value) != value) return false;
      return true;
    },
    trigger: 'change',
    message: '请输入整数'
  },
  range: {
    validator: function(rule, value) {
      if (value.indexOf('-') == -1) {
        return false;
      } else {
        var vs = value.split('-');
        if (vs.length != 2) {
          return false;
        }
        if (isNaN(parseFloat(vs[0])) || isNaN(parseFloat(vs[1]))) {
          return false;
        }
        if (parseFloat(vs[0]) > parseFloat(vs[1])) {
          return false;
        }
      }
      return true;
    },
    trigger: 'change',
    message: '请按照格式要求输入'
  },
  stepindex: {
    validator: function(rule, value) {
      value = value.trim();
      if (value != '') {
        if (value.indexOf('.') > -1) {
          var vl = value.split('.');
          for (var v in vl) {
            if (v % 2 == 0) {
              if (isNaN(parseInt(vl[v], 10))) {
                return false;
              }
            } else {
              if (vl[v].length != 1) {
                return false;
              }
              var cc = vl[v].charCodeAt();
              if ((cc >= 65 && cc <= 90) || (cc >= 97 && cc <= 122)) {
                //
              } else {
                return false;
              }
            }
          }
        } else {
          if (isNaN(parseInt(value, 10))) {
            return false;
          }
        }
      }
      return true;
    },
    trigger: 'change',
    message: '请输入序号,格式范例：1或1.A或1.A.1'
  },
  enchar: {
    validator: function(rule, value) {
      return /^[a-z\_\-A-Z\d\.\_]*$/.test(value);
    },
    trigger: 'change',
    message: '请输入英文字符或数字'
  },
  enchar_space: {
    name: 'enchar_space',
    validator: function(rule, value) {
      return /^[a-z\_\-A-Z\d\.\ \_]*$/.test(value);
    },
    trigger: 'change',
    message: '请输入英文字符或数字,允许空格'
  },
  parameter: {
    validator: function(rule, value) {
      return /^[a-zA-Z_][a-zA-Z0-9_\.]*$/.test(value);
    },
    trigger: 'change',
    message: '变量名只能以字母、数字、下划线和.组成，且开头不能是数字'
  },
  month: {
    validator: function(rule, value) {
      if (value == '') {
        return false;
      }
      if (isNaN(value)) {
        return false;
      }
      if (parseInt(value) < 1 || parseInt(value) > 12) {
        return false;
      }
      return true;
    },
    trigger: 'change',
    message: '请输入1至12之间的整数'
  },
  check: {
    validator: function(rule, value) {
      if (!value) {
        return false;
      }
      return true;
    },
    trigger: 'change',
    message: '请选择'
  },
  'non-special': {
    validator: function(rule, value) {
      if (value) {
        return !/[<>"']/.test(value);
      }
      return true;
    },
    trigger: 'change',
    message: '请不要输入&lt; &gt; &quot; &apos; 等特殊符号'
  },
  passcode: {
    validator: function(rule, value) {
      return /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,20}$/.test(value);
    },
    trigger: 'change',
    message: '请输入长度在8~20之间的字符串，至少有字母、数字、特殊字符其中2种组合'
  },
  'name-special': {
    validator: function(rule, value) {
      return /^[A-Za-z_\d\u4e00-\u9fa5]*$/.test(value);
    },
    trigger: 'change',
    message: '仅支持汉字、字母、数字和下划线'
  },
  token: {
    validator: function(rule, value) {
      return /^[A-Za-z\d_/]+$/.test(value);
    },
    trigger: 'change',
    message: '仅支持字母、数字、斜杠和下划线'
  },
  regex: {
    validator: function(rule, value) {
      let pattern = rule.pattern || this.pattern;
      if (typeof value != 'undefined' && value != null && typeof value == 'string' && value.trim() != '') {
        var reg = new RegExp(pattern);
        return reg.test(value);
      }
      return true;
    },
    pattern: '', //  ^ [a - z] + $ 正则表达式
    trigger: 'change',
    message: '请输入正确格式的字符串'
  }
};

//module.exports.default =module.exports = validtor;

export default validtor;
