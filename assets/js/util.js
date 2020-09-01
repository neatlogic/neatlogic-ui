/*
getCookie(name)                 获取cookie为name的值
setCookie(name, value, time)    设置cookie为name的值为value，期限是time(如果是数字，单位为天；如果是字符串，直接赋值结束时间)
removeCookie(name)              清除cookie为name的值
deepClone(data)                 复制数据（不改动原数据）
setUuid()                       生成32位随机uuid
getCurrenttime(format)          根据指定格式格式化当前时间输出格式
sortNumber()                    数字排序
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
    //参数默认格式：年月日 时:分:秒，其他选项：["HH:mm:ss","yyyy-MM-dd","HH:mm")]
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
    //时间戳，转成字符串
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
    //合并多个数组且去重
    return Array.from(new Set(a.concat(...arr)));
  }
};
