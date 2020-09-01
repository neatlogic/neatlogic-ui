const formatDate = (value, format) => {
  let result = '';
  if (value) {
    let date = new Date(value);
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let min = date.getMinutes();
    let s = date.getSeconds();
    
    if (format == undefined) {
      result = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d} ${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}:${s < 10 ? '0' + s : s}`;
    }
    if (format == 'yyyy-mm-dd') {
      result = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
    }
    if (format == 'yyyy-mm') {
      result = `${y}-${m < 10 ? '0' + m : m}`;
    }
    if (format == 'mm-dd') {
      result = ` ${mm < 10 ? '0' + mm : mm}:${ddmin < 10 ? '0' + dd : dd}`;
    }
    if (format == 'hh:mm') {
      result = ` ${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}`;
    }
    if (format == 'yyyy') {
      result = `${y}`;
    }
    if (format == 'hh:mm:ss') {
      result = ` ${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}:${s < 10 ? '0' + s : s}`;
    }
  }

  return result;
};
//转义特殊字符为html
const unescapeHtml = html => {
  return html
    .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

//处理耗时
const formatTimeCost = (value, {
  language = 'zh', // 时间单位的语言，默认是中文
  unit = 'second', // 时间单位，默认是秒
  isMillisecond = true, // 时间戳是否为毫秒，默认是
  unitNumber = 5, // 显示多少个时间单位，默认全部显示
  separator = '' // 每个时间单位的分隔符，默认不分隔
} = {}) => {
  if (!isMillisecond) {
    value = value * 1000;
  }
  value = value > 0 ? value : -value;
  let unitConfig = {
    'day': language == 'en' ? 'd' : '天',
    'hour': language == 'en' ? 'h' : '小时',
    'minute': language == 'en' ? 'min' : '分钟',
    'second': language == 'en' ? 's' : '秒',
    'millisecond': language == 'en' ? 'ms' : '毫秒'
  };
  let unitList = Object.keys(unitConfig);
  let unitIndex = unitList.indexOf(unit);
  let result = '';
  if (value) {
    // let days = (unitIndex == 0 ? value / (1000 * 60 * 60 * 24) : Math.floor(value / (1000 * 60 * 60 * 24)));
    // let hours = (unitIndex == 1 ? (value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) : Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    // let minutes = (unitIndex == 2 ? (value % (1000 * 60 * 60)) / (1000 * 60) : Math.floor((value % (1000 * 60 * 60)) / (1000 * 60)));
    // let seconds = (unitIndex == 3 ? (value % (1000 * 60)) / 1000 : Math.floor((value % (1000 * 60)) / 1000));
    let days = Math.floor(value / (1000 * 60 * 60 * 24));
    let hours = Math.floor((value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((value % (1000 * 60)) / 1000);
    let milseconds = Math.floor(value % 1000);
    if (days > 0 && unitIndex > -1 && --unitNumber >= 0) {
      result += days + unitConfig['day'];
    }
    if (hours > 0 && unitIndex > 0 && --unitNumber >= 0) {
      if (result) result += separator;
      result += hours + unitConfig['hour'];
    }
    if (minutes > 0 && unitIndex > 1 && --unitNumber >= 0) {
      if (result) result += separator;
      result += minutes + unitConfig['minute'];
    }
    if (seconds > 0 && unitIndex > 2 && --unitNumber >= 0) {
      if (result) result += separator;
      result += seconds + unitConfig['second'];
    }
    if (milseconds > 0 && unitIndex > 3 && --unitNumber >= 0) {
      if (result) result += separator;
      result += milseconds + unitConfig['millisecond'];
    }
  }
  if (!result) {
    result = '0' + unitConfig[unit];
  }
  return result;
};

export { formatDate, formatTimeCost, unescapeHtml };
