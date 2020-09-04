<template>
  <ul :id="id" class="ztree"></ul>
</template>
<script>
import '../../static/js/jquery-1.11.1.js';
import './js/jquery.ztree.all.min.js';
export default {
  name: 'TsCheckZtree',
  components: {},
  props: {
    zNodes: Array,
    url: String,
    rootName: String,
    setting: Object,
    id: { type: String, required: true },
    initAsyncyZtree: String //异步加载，当值改变时重绘ztree
  },
  data: function() {
    return {};
  },
  mounted() {
    this.getZtree();
    if (this.setting.addDomList && this.setting.addDomList.length > 0) {
      $('ul#' + this.id).addClass('hoverDom');
    }
  },
  methods: {
    getZtree: function() {
      var _this = this;
      var defaultSetting = {
        //默认的配置文件
        view: {
          showIcon: true,
          dblClickExpand: true,
          showLine: false,
          selectedMulti: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'parentId',
            rootPId: 1
          }
        },
        check: {
          enable: true,
          chkStyle: 'checkbox',
          chkboxType: {
            Y: '',
            N: ''
          }
        },
        callback: {
          onClick: _this.onclick
        }
      };

      _this.configSetting = _this.deepClone(defaultSetting, this.setting);
      if (_this.initAsyncyZtree) {
        $.fn.zTree.init($('#' + _this.id), _this.configSetting, null).expandAll(true);
      } else if (_this.url) {
        _this
          .$axios({ method: 'get', url: _this.url })
          .then(res => {
            if (res) {
              if (res.Status == 'OK') {
                var zNodes = _this.rootName ? res.Return[_this.rootName] : res.Return;
                $.fn.zTree.init($('#' + _this.id), _this.configSetting, zNodes).expandAll(true);
              } else {
                //
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (_this.zNodes) {
        $.fn.zTree.init($('#' + _this.id), _this.configSetting, _this.zNodes).expandAll(true);
      }
    },
    onclick: function(event, treeId, treeNode) {
      var _this = this;
      var treeObj = $.fn.zTree.getZTreeObj(_this.id);
      treeObj.checkNode(treeNode, true, true);
    },
    deepClone: function(oldValue, newValue) {
      var returnValue = Object.assign({}, oldValue, newValue);
      if (!newValue) {
        return returnValue;
      }
      var item = null;
      for (item in newValue) {
        oldValue[item] && (returnValue[item] = Object.assign({}, oldValue[item], newValue[item]));
      }
      return returnValue;
    }
  },
  watch: {
    url: function(val, oldVal) {
      //通过url来获取数据
      this.getZtree();
    },
    zNodes: function(val, oldVal) {
      //通过zNodes来获取数据
      this.getZtree();
    },
    initAsyncyZtree: function(val, oldVal) {
      //通过异步来获取数据
      this.getZtree();
    }
  }
};
</script>
<style scoped>
@import 'css/zTreeStyle.css';
</style>
