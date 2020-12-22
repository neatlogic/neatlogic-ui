/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  publicPath: '/techsure/',
  assetsDir: 'resource',
  productionSourceMap: false,
  runtimeCompiler: true,
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-path-injector')
      .loader(require.resolve('./vue-path-injector.js'))
      .after('vue-loader')
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 102400 }));
      
    config.resolve.alias.set('@static', resolve('static'));
    config.resolve.alias.set('@component', resolve('component'));
    config.resolve.alias.set('@directives', resolve('directives'));
    config.resolve.alias.set('@filters', resolve('filters'));
    config.resolve.alias.set('@mixins', resolve('mixins'));
    config.resolve.alias.set('@api', resolve('api'));
    config.resolve.alias.set('@iview', resolve('iview'));
  },
  devServer: {
    open: true,
    port: '8080',
    https: false,
    hotOnly: false,
    disableHostCheck: true
  }
};
