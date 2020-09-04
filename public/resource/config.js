var _pathname = window.location.pathname;
var TENANT = _pathname.split('/')[1];
var BASEURLPREFIX = '';
var HOME = '/' + TENANT;
if (TENANT.indexOf('.') <= -1) {
  BASEURLPREFIX += '/' + TENANT;
} else {
  TENANT = '';
  HOME = '/';
}
var BASELANGUAGES = 'zh';
var MODULEID = '';
var MENULIST = [];
var MENUTYPE = [];

var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
if (isIE) {
  var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
  reIE.test(userAgent);
  var fIEVersion = parseFloat(RegExp['$1']);
  if (fIEVersion * 1 < 10) {
    window.location.href = '/iealert.html';
  }
}
