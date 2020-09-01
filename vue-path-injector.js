const path = require('path');
//const loaderUtils = require('loader-utils')

module.exports = function(content) {
  const loaderContext = this;

  const { rootContext, resourcePath } = loaderContext;

  const context = rootContext || process.cwd();
  //const options = loaderUtils.getOptions(loaderContext) || {}
  const rawShortFilePath = path
    .relative(context, resourcePath)
    .replace(/^(\.\.[\/\\])+/, '');

  //找到vue文件中单独一行<template 开头的内容
  let tmplStartPos = content.search(/^\s*<\s*template\W/mi);
  if (tmplStartPos >= 0) {
    let tmplEndPos = content.indexOf('>', tmplStartPos + 9);
    let pos = content.indexOf('>', tmplEndPos + 1);

    if (pos > 0) {
      //获取<template>后续一行标签行，如果是transition设置，则再获取下一行标签的结束位置
      let tmplFirstLine = content.substring(tmplEndPos + 1, pos + 1);
      let transPosInLine = tmplFirstLine.search(/^\s*<\s*transition\W/mi);
      if (transPosInLine >= 0) {
        pos = content.indexOf('>', pos + 1);
      }
    }

    if (pos > 0) {
      content = content.slice(0, pos) + ' src-path="' + rawShortFilePath + '"' + content.slice(pos);
    }
    if (rawShortFilePath.lastIndexOf('Modal.vue') > 0) {
      console.log(content);
    }
  }

  return content;
};
