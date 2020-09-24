import Vue from 'vue';
import axios from 'axios';
import ViewUI from 'view-design';
import utils from '../static/js/util';

Vue.prototype.$axios = axios;
const tip = (msg, onClose, name, title, type = 'error') => {
  let config = {
    title: '接口异常',
    desc: msg
  };
  onClose &&
    Object.assign(config, {
      onClose: onClose
    });
  name &&
    Object.assign(config, {
      name: name + new Date().getTime()
    });
  ViewUI.Notice[type](config);
};
var instance = Vue.prototype.$axios.create({
  //创建axios实例
  //timeout: 1000 * 20,
  //headers: {'Authorization': utils.getCookie('codedriver_authorization') ? utils.getCookie('codedriver_authorization') : ''}
});
instance.defaults.headers.post['Content-Type'] = 'application/json'; //post请求头
instance.defaults.baseURL = BASEURLPREFIX; //默认接口前缀
instance.CancelToken = axios.CancelToken;
//sessionStorage.setItem('codedriver_authorization'
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  if (!NONAUTH) {
    try {
      let path = Vue.prototype.$tsrouter.currentRoute.fullPath == '/' ? window.location.href.split(MODULEID + '.html#')[1] : Vue.prototype.$tsrouter.currentRoute.fullPath;
      window.location.href = HOME + '/login.html#?tenant=' + TENANT + '&redirect=' + MODULEID + '.html#' + path;
    } catch (e) {
      console.log(e);
      window.location.href = HOME + '/login.html#?tenant=' + TENANT;
    }
  } else {
    // try {
    //   top.location.href = HOME;
    // } catch (e) {
    //   console.log(e);
    // }
  }
};
//20200918_zqp_针对put格式的数据object需要处理成serialize格式
const serializeOject = (data) => {
  let str = '';
  if (typeof data == 'string' || !data) {
    str = data || '';
  } else { 
    try {
      Object.entries(data).forEach(([key, value], index) => {
        str += key + '=' + value + (index < Object.entries(data).length - 1 ? '&' : '');
      });
    } catch (error) { console.log(error); }
  }
  return str;
};

//调用接口
instance.interceptors.request.use(config => {
  const token = utils.getCookie('codedriver_authorization');
  if (!token || token == null) {
    toLogin();
  }
  if (config.method === 'post') {
    config.data = JSON.stringify(config.data || {});
  } else if (config.method === 'put') {
    config.headers = Object.assign(config.headers, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }
  return config;
});

//返回数据
instance.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    const token = utils.getCookie('codedriver_authorization');
    if (!token || token == null) {
      toLogin();
    }
    let res = response.request.responseType ? response : response.data;
    return Promise.resolve(res);
  },
  function(error) {
    if (error) {
      if (error.response.config && error.response.config.headers.unConsole) {
        //请求时多携带{unConsole: 1}默认为异常不需要用通用类的异常抛出
        //console.log(error.response.data.Message || error.response.data);
      } else {
        errorHandle(error.response);
      }
      return Promise.reject(error);
    } else {
      if (!window.navigator.onLine) {
        tip('网络连接失败');
      } else {
        return Promise.reject(error);
      }
    }
  }
);
/**
 * 请求失败后的错误统一处理
 */
const errorHandle = res => {
  let status = res.status;
  let other = res.data.Message;
  // 状态码判断
  switch (status) {
    case 401:
      toLogin();
      break;
    case 403:
      tip('登录过期，请重新登录', function() {
        Vue.prototype.$utils.removeCookie('codedriver_authorization');
        toLogin();
      });
      break;
    case 404:
      console.log('接口' + res.config.url + '不存在');
      break;
    case 521:
      //租户问题，需要跳出系统重新输入租户
      Vue.prototype.$utils.removeCookie('codedriver_authorization');
      window.location.href = '/404.html';
      break;
    case 522:
      //用户接口认证有问题,重新登录
      Vue.prototype.$utils.removeCookie('codedriver_authorization');
      toLogin();
      break;
    case 523:
      //用户权限不足，跳回每一个路由的404页面提示无访问权限
      Vue.prototype.$tsrouter.push({
        path: '/404',
        query: {
          des: '暂无访问权限'
        }
      });
      break;
    case 520:
      //已知的接口问题
      tip(other, null, res.config.url, '提示', 'info');
      break;
    default:
      try {
        tip(other, null, res.config.url);
      } catch (e) {
        //throw e;
      }
  }
};

export default instance;
