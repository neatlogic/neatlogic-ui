/*
getCookie(name)                              获取cookie为name的值
setCookie(name, value, time)                 设置cookie为name的值为value，期限是time(如果是数字，单位为天；如果是字符串，直接赋值结束时间)
removeCookie(name)                           清除cookie为name的值
deepClone(data)                              复制数据（不改动原数据）
setUuid()                                    生成32位随机uuid
getCurrenttime(format)                       根据指定格式格式化当前时间输出格式
sortNumber()                                 数字排序
getDateByFormat(value, format, styleType)    通过时间戳获取指定格式的日期
toggleClass(el, classname, type)             修改class 1、el:目标元素  2、cls:需要操作的class  3、type:"add"代表添加对应的class  "remove"代码删除对应的class 如果不传则有则删除，没有则添加
getValueByPath(value, path, isArrary)        值的为空判断 如果是数组，数组的长度判断 //1、value：[Nothing]需要做判断的值, 2、path：[String]需要层层遍历的  3、isArrary:[Boolean]最终获取的值是数组，而且数组的长度大于0
checkType(value, type)                       检查value类型，如果type为空着放回值的类型
validForm($el,$scroll)                       整体表单控件校验,并且滚动到报错地方 可以传dom对象，也可以传选择器字符串
*/
export default {
  getCookie: function(name) {
    if (name) {
      let cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        let ci = cookies[i];
        while (ci.charAt(0) == ' ') ci = ci.substring(1);
        if (ci.indexOf(name) >= 0) {
          return ci.substring(name.length + 1, ci.length);
        }
      }
    }
  },
  setCookie: function(name, value, time) {
    if (time) {
      if (typeof time == Number) {
        let d = new Date();
        d.setTime(d.getTime() + time * 24 * 60 * 60 * 1000);
        let expires = 'expires=' + d.toGMTString();
        document.cookie = name + '=' + value + '; ' + expires + ';path=/;';
      } else {
        document.cookie = name + '=' + value + '; expires=' + time + ';path=/;';
      }
    } else {
      document.cookie = name + '=' + escape(value);
    }
  },
  removeCookie: function(name) {
    this.setCookie(name, ' ', new Date(0).toUTCString());
  },
  deepClone(data) {
    var obj;
    if (data instanceof Array) {
      obj = [];
    } else if (data instanceof Object) {
      obj = {};
    } else {
      return data;
    }
    if (data instanceof Array) {
      for (var i = 0, len = data.length; i < len; i++) {
        obj.push(this.deepClone(data[i]));
      }
    } else if (data instanceof Object) {
      for (var key in data) {
        obj[key] = this.deepClone(data[key]);
      }
    }
    return obj;
  },
  setUuid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (Math.random() * 16) | 0;
      let v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  getCurrenttime(format) {
    // 参数默认格式：年月日 时:分:秒，其他选项：["HH:mm:ss","yyyy-MM-dd","HH:mm")]
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (hours <= 9) {
      hours = '0' + hours;
    }
    if (minutes <= 9) {
      minutes = '0' + minutes;
    }
    if (seconds <= 9) {
      seconds = '0' + seconds;
    }
    let timestr = year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds;
    if (format == 'HH:mm:ss') {
      timestr = hours + ':' + minutes + ':' + seconds;
    } else if (format == 'yyyy-MM-dd') {
      timestr = year + '-' + month + '-' + day + '-';
    } else if (format == 'HH:mm') {
      timestr = hours + ':' + minutes;
    }
    return timestr;
  },
  getDateByFormat(value, format, styleType) {
    // 时间戳，转成字符串
    value = new Date(value);
    styleType = styleType || '-';
    format = format || 'yyyy-MM-dd HH:mm:ss';
    let newValue = '';
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
  },
  sortNumber() {
    return function(a, b) {
      return a - b;
    };
  },
  concatArr(a, ...arr) {
    // 合并多个数组且去重
    return Array.from(new Set(a.concat(...arr)));
  },
  validForm($el, $scroll) {
    //校验表单插件 dom对象，选择器字符串
    let isVaild = true;
    let $error = null;
    if ($el) {
      //进行校验
      let childrendom = [];
      if (this.checkType($el, 'string')) {
        childrendom = document.querySelectorAll($el + ' .form-li');
      } else {
        childrendom = $el.querySelectorAll('.form-li');
      }

      if (childrendom && childrendom.length > 0) {
        childrendom.forEach(children => {
          if (children.__vue__ && children.__vue__.valid) {
            if (!children.__vue__.valid()) {
              isVaild && ($error = children);
              isVaild = false;
            }
          }
        });
      }
    }
    if (!isVaild && $scroll) {
      //如果校验不通过滚动到具体的位置
      this.checkType($scroll, 'string') && ($scroll = document.querySelector($scroll));
      let targetConfig = $error.getBoundingClientRect();
      let containConfig = $scroll.getBoundingClientRect();
      if (!(targetConfig.top > containConfig.top && targetConfig.top < containConfig.top + containConfig.height)) {
        $scroll.scrollTop = Math.abs(targetConfig.top - containConfig.top) + 50;
      }
    }
    return isVaild;
  },
  toggleClass(el, cls, type) {
    // 1、el:目标元素  2、cls:需要操作的class  3、type:"add"代表添加对应的class  "remove"代码删除对应的class 如果不传则有则删除，没有则添加
    if (!el || !cls) {
      return;
    }
    cls = cls.trim().split(' '); // 需要处理的class数组
    let curClass = el.className ? el.className.trim().split(' ') : []; // 现有的class数组

    for (let i = 0, j = cls.length; i < j; i++) {
      const clsName = cls[i];
      if (!clsName.trim()) {
        continue;
      }
      let index = curClass.indexOf(clsName);
      if (index >= 0 && type !== 'add') {
        curClass.splice(index, 1);
      } else if (index < 0 && type !== 'remove') {
        curClass.push(clsName);
      }
    }
    el.className = curClass.join(' ');
  },
  getValueByPath(value, path, isArrary) {
    //1、value：[Nothing]需要做判断的值, 2、path：[Array]需要层层遍历的  3、isArrary:[Boolean]最终获取的值是数组，而且数组的长度大于0
    let result = value;
    if (value === null || value === undefined) {
      result = false;
    } else if (path && !value) {
      result = false;
    } else if (typeof value == 'object' && path) {
      let pathList = path.split('.');
      let val = value;
      pathList &&
        pathList.forEach((item, i) => {
          val !== false && (val = this.getDeepData(val[item]));
        });
      result = val;
    } else if (path && typeof value !== 'object') {
      result = false;
    }
    if (!(result && isArrary && result instanceof Array && result.length > 0)) {
      result = false;
    }
    return result;
  },
  checkType(value, type) {
    // 检查数据类型 1、value:[nothing]需要检查的数据 2、type :[string]类型,如果type不存在直接返回类型 null undefined number boolean string object array set map function  date regexp  promise symbol error
    let result = false;
    let str = Object.prototype.toString.call(value).slice(8, -1);
    if (!type) {
      //如果type不存在则放回类型
      return str;
    }
    if (typeof type == 'string') {
      if (str.toUpperCase() == type.toUpperCase()) {
        result = true;
      }
    } else if (type instanceof Array) {
      type.find(item => {
        if (str.toUpperCase() == item.toUpperCase()) {
          result = true;
          return true;
        }
        return false;
      });
    }
    return result;
  },
  checkStringNotEmpty(value) {
    // 检查数据类型 1、value:[nothing]需要检查的数据 2、type :[string]类型,如果type不存在直接返回类型 null undefined number boolean string object array set map function  date regexp  promise symbol error
    return !this.checkType(value, ['null', 'undefined']) && value !== '';
  },
  equalStr(str1, str2) {
    //判断两个字符串是否是相同 主要是为了对 0 和 '0'需要判断相同的情况下面
    if (this.checkType(str1, 'null') || this.checkType(str1, 'undefined')) {
      //当两个值有
      if (this.checkType(str2, 'null') || this.checkType(str2, 'undefined')) {
        return true;
      }
    } else if (str1 === 0) {
      if ((this.checkType(str2, 'number') && str2 === 0) || (this.checkType(str2, 'string') && str2 === '0')) {
        return true;
      }
    } else if (str2 === 0) {
      if ((this.checkType(str1, 'number') && str1 === 0) || (this.checkType(str1, 'string') && str1 === '0')) {
        return true;
      }
    } else {
      return str1 == str2;
    }
    return false;
  }
};
