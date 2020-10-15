<template>
  <div class="form-li">
    <span v-if="readonly" :class="readonlyClass" :title="readonlyTitle">
      <template v-if="multiple">
        <span v-if="selectedList.length > 0">
          <template v-for="(selected, sindex) in selectedList">
            <span :key="sindex">
              {{ selected[textName] }}
              <span v-if="sindex < selectedList.length - 1" class="tsform-readonly-sperate">{{ sperateText }}</span>
            </span>
          </template>
        </span>
      </template>
      <template v-else>{{ selectedList[0] ? selectedList[0][textName] : '-' }}</template>
    </span>
    <div v-else :class="borderClass" :style="getStyle">
      <div v-click-outside:false="onClickOutside" v-click-outside:false.mousedown="onClickOutside" v-click-outside:false.touchstart="onClickOutside" class="select-body" :class="getClass">
        <Dropdown ref="dropdownContain" style="width:100%" trigger="custom" :visible="isVisible" :transfer="transfer" placement="bottom-start">
          <div tabindex="-1" class="ivu-input  select-top" @click="isVisible=!isVisible">
            <template v-if="multiple">
              <Tag v-for="(selected, index) in selectedList" :key="index" :name="selected[valueName]" closable :fade="false" @on-close="removeItem($event, index, selected.nodeKey)">{{ selected[textName] }}</Tag>
              <input v-if="search && url" v-model="searchKeyWord" type="text" :placeholder="placeholder" autocomplete="off" spellcheck="false" class="ivu-input search-input" @input="filterNode($event)" />
            </template>
            <template v-else>
              <input v-if="search && url" v-model="searchKeyWord" type="text" :placeholder="placeholder" autocomplete="off" spellcheck="false" class="ivu-input search-input" @input="filterNode($event)" />
              <span v-else class="overflow empty-placeholder single-span" :placeholder="placeholder"></span>
            </template>
            <i class="ivu-icon tsfont-down ivu-select-arrow"></i>
            <i v-if="clearable" class="clearBtn text-icon ivu-icon ivu-icon-ios-close-circle" @click.stop="clearValue"></i>
          </div>
          <DropdownMenu slot="list" ref="dropdown">
            <Tree v-if="nodeList && nodeList.length>0" :ref="treeRef" class="tsFormTree dropdown-ul" :class="[{'single':!multiple} ]" :data="nodeList" :render="renderContent" :multiple="multiple || false" :show-checkbox="multiple || false" :check-strictly="true" :childrenKey="childrenKey" @on-select-change="onSelectChange" @on-check-change="onCheckChange"></Tree>
            <li v-else class="ivu-dropdown-item"><span class="text-tip">暂无数据</span></li>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <transition name="fade">
      <span v-show="validMesage != ''" class="form-error-tip">{{ validMesage }}</span>
    </transition>
  </div>
</template>
<script>
import axios from '@api/http.js';
import formMixins from '@mixins/formMixins.js';
import formScrollMixins from '@mixins/formScrollMixins.js';
import { directive as ClickOutside } from '@directives/v-click-outside-x';
export default {
  name: 'TsFormTree',
  directives: { ClickOutside },
  mixins: [formMixins, formScrollMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: String,
    multiple: {
      default: false
    },
    value: {
      //多选是是array 单选是String
      type: [String, Array, Number]
    },
    transfer: {
      type: Boolean,
      default: false
    },
    onChange: Function, //改变时触发
    url: String,
    search: {
      type: Boolean,
      default: false
    },
    rootName: {
      //通过url来获取数据的rootName
      type: String,
      default: ''
    },
    valueName: {
      //option渲染值
      type: String,
      default: 'value'
    },
    textName: {
      //text渲染值
      type: String,
      default: 'text'
    },
    keyword: {
      type: String,
      default: 'keyword'
    },
    dataList: Array,
    size: {
      default: ''
    },
    readonly: {
      default: false
    },
    disabled: {
      default: false
    },
    childrenKey: {
      default: 'children'
    },
    className: {
      //额外添加class
      type: String
    },
    validateList: {
      type: Array
    },
    width: {
      //small  medium   large  block    输入数值    输入百分比
      type: [String, Number],
      default: '100%'
    },
    params: Object,
    readonlyClass: {
      type: String,
      default: 'text-grey tsform-readonly'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    selectLastLevel: {
      type: Boolean,
      default: false
    },
    showPath: {
      //之争对与单选
      type: Boolean,
      default: false
    },
    sperateText: {
      type: String,
      default: '/'
    },
    ajaxType: {
      type: String,
      default: 'post'
    }
  },
  data() {
    let _this = this;
    return {
      isVisible: false, //下拉选项显示
      currentValue: _this.value,
      showValue: '',
      selectedList: [], //选中的列表，精确匹配
      treeRef: 'trf' + new Date().toString(),
      nodeList: [],
      validMesage: '',
      currentValidList: _this.filterValid(_this.validateList) || [],
      readonlyTitle: null,
      searchKeyWord: ''
    };
  },
  created() {
    var _this = this;
    _this.initNodeList();
  },
  mounted() {
    this.$nextTick(function() {
      this.readonly && this.initReadolyTitle();
    });
  },
  beforeDestroy() {},
  methods: {
    initNodeList: function() {
      var _this = this;
      //通过url获取数据
      if (_this.url) {
        let params = {};
        typeof _this.params == 'object' && Object.assign(params, _this.params);
        let ajaxArr = { method: _this.ajaxType, url: _this.url};
        let needdataLi = ['post', 'put'];
        needdataLi.indexOf(_this.ajaxType) < 0 ? Object.assign(ajaxArr, {params: params}) : Object.assign(ajaxArr, {data: params});
        axios(ajaxArr).then(res => {
          if (res && res.Status == 'OK') {
            _this.nodeList = res.Return;
            if (_this.rootName) {
              let rootAry = _this.rootName.split('.');
              rootAry.forEach(str => {
                _this.nodeList = _this.nodeList[str];
              });
            }
            _this.selectedList = [];
            _this.nodeList.forEach(item => _this.flattenChildren(item, null, ''));
            if (!_this.multiple) {
              _this.searchKeyWord = _this.selectedList[0] ? (_this.showPath ? _this.selectedList[0]._path : _this.selectedList[0][_this.textName]) : '';
            }
            this.readonly && this.initReadolyTitle();
          }
        });
      } else {
        _this.nodeList = _this.dataList || [];
        _this.currentValue && _this.nodeList.forEach(item => flattenChildren(item));
        if (!this.multiple) {
          this.searchKeyWord = this.selectedList[0] ? (this.showPath ? this.selectedList[0]._path : this.selectedList[0][this.textName]) : '';
        }
        this.readonly && this.initReadolyTitle();
      }
    },
    flattenChildren(node, parent, path, isSearch) {
      //node当前节点，parent父节点，path对应的层级路径，isSearch搜索是不对selectedList进行改改
      let _this = this;
      node._path = path + (path ? ' ' + this.sperateText + ' ' + node[this.textName] : node[this.textName]);
      if (!_this.multiple && node[_this.valueName] == _this.currentValue) {
        //单选
        _this.$set(node, 'selected', true);
        !isSearch && _this.selectedList.push(node);
        parent && _this.$set(parent, 'expand', true);
        return false;
      } else if (!!_this.multiple && _this.currentValue.indexOf(node[_this.valueName]) >= 0) {
        //多选
        _this.$set(node, 'checked', true);
        _this.$set(node, 'selected', true);
        parent && _this.$set(parent, 'expand', true);
        !isSearch && _this.selectedList.push(node);
      } else {
        _this.$set(node, 'checked', false);
        _this.$set(node, 'selected', false);
        parent && _this.$set(parent, 'expand', false);
      }

      if (node[_this.childrenKey] && node[_this.childrenKey].length > 0) {
        this.selectLastLevel && (node.disabled = true);
        node[_this.childrenKey].forEach(child => _this.flattenChildren(child, node, node._path, isSearch));
      }
      parent && node.expand && _this.$set(parent, 'expand', true);
      if (isSearch && this.searchKeyWord && parent) {
        this.$set(parent, 'expand', true);
      }
    },
    searchNodeByUrl(searchKeyWord) {
      let _this = this;
      let params = {};
      typeof this.params == 'object' && Object.assign(params, this.params);
      params[this.keyword] = searchKeyWord;

      let cancel = this.cancelAxios;
      cancel && (this.cancelAxios = null) && cancel.cancel();

      const CancelToken = axios.CancelToken;
      this.cancelAxios = CancelToken.source();
      let ajaxArr = {method: _this.ajaxType, url: _this.url, cancelToken: _this.cancelAxios.token};
      let needdataLi = ['post', 'put'];
      needdataLi.indexOf(_this.ajaxType) < 0 ? Object.assign(ajaxArr, {params: params}) : Object.assign(ajaxArr, {data: params});
      axios(ajaxArr).then(res => {
        if (res && res.Status == 'OK') {
          _this.nodeList = res.Return;
          if (_this.rootName) {
            let rootAry = _this.rootName.split('.');
            rootAry.forEach(str => {
              _this.nodeList = _this.nodeList[str];
            });
            _this.nodeList.forEach(item => _this.flattenChildren(item, '', '', true));
          }
        }
        this.cancelAxios = null;
        this.setTimeSearch = null;
      });
    },
    renderContent: function(h, { root, node, data }) {
      let _this = this;
      return h('span', {
        class: {
          // 'select-li': true,
          // 'selected': data.selected
        },
        props: {
          data: data
        },
        domProps: {
          innerHTML: data[_this.textName]
        },
        on: {
          click: function(event) {
            if (data[_this.childrenKey] && data[_this.childrenKey].length > 0 && _this.selectLastLevel) {
              _this.$set(data, 'expand', !data.expand);
            }
          }
        }
      });
    },
    onSelectChange: function(selectAllNode, node) {
      //点击文案
      let _this = this;
      let selectValue = [];
      selectAllNode.forEach(element => {
        selectValue.push(element[_this.valueName]);
      });
      if (this.multiple) {
        node.checked != node.selected && _this.$refs[_this.treeRef].handleCheck({ checked: node.selected, nodeKey: node.nodeKey }); //手动选择树节点
        _this.currentValue = selectValue;
      } else {
        _this.currentValue = selectValue[0];
      }
      this.selectedList = selectAllNode;
      this.onChangeValue();
      !this.multiple && (this.isVisible = false);
    },
    onCheckChange: function(selectAllNode, node) {
      //点击checkbox
      let _this = this;
      let selectValue = [];
      selectAllNode.forEach(element => {
        selectValue.push(element[_this.valueName]);
      });
      node.checked != node.selected && _this.$refs[_this.treeRef].handleSelect(node.nodeKey); //手动选择树节点
      _this.currentValue = selectValue;
      _this.selectedList = selectAllNode;
      this.onChangeValue();
    },
    filterNode: function() {
      !this.isVisible && (this.isVisible = true);
      this.setTimeSearch && clearTimeout(this.setTimeSearch);
      this.setTimeSearch = setTimeout(() => {
        this.searchNodeByUrl(this.searchKeyWord);
      }, 250);
    },
    removeItem: function(event, index, nodeKey) {
      let _this = this;
      _this.selectedList.splice(index, 1);
      _this.currentValue.splice(index, 1);
      this.onChangeValue();
      _this.$refs[_this.treeRef].handleCheck({
        checked: false,
        nodeKey: nodeKey
      });
      //手动选择树节点
      if (_this.currentValidList.length > 0) {
        _this.valid(_this.currentValue);
      }
    },
    onChangeValue() {
      if (!this.multiple) {
        this.searchKeyWord = this.selectedList[0] ? (this.showPath ? this.selectedList[0]._path : this.selectedList[0][this.textName]) : '';
      }

      this.$emit('change', this.currentValue);
      this.$emit('on-change', this.currentValue);
      typeof this.onChange == 'function' && this.onChange(this.currentValue, this.name);
    },
    updatePosition() {
      setWidth(this.$el.querySelector('.select-body') || null, this.$refs.dropdown ? this.$refs.dropdown.$el : null, this.transfer);
      this.$refs.dropdownContain && this.$refs.dropdownContain.$refs.drop && this.$refs.dropdownContain.$refs.drop.update();
    },
    onClickOutside(event) {
      //点击外部，dropdown消失
      if (this.isVisible || !this.firstOutside) {
        this.firstOutside = true;
        if (event.type === 'mousedown') {
          event.preventDefault();
        }
        const $el = this.$refs.dropdown ? this.$refs.dropdown.$el || null : null;
        if (!$el || $el === event.target || $el.contains(event.target)) {
          return;
        }
        event.stopPropagation();
        event.preventDefault();

        const $contain = this.$refs.dropdownContain ? this.$refs.dropdownContain.$el || null : null;

        if ((!$contain && $contain === event.target) || $contain.contains(event.target)) {
          return;
        } else {
          //如果点击区域不是自身元素则失去焦点
          this.isVisible = false;
          if (!this.multiple) {
            //单选
            let value = this.selectedList[0] ? (this.showPath ? this.selectedList[0]._path : this.selectedList[0][this.textName]) : '';
            if (this.searchKeyWord !== value) {
              this.searchKeyWord = value;
              this.initNodeList();
            }
          } else if (this.searchKeyWord) {
            this.searchKeyWord = '';
            this.initNodeList();
          }
        }
      }
    },
    clearValue() {
      //清楚数据
      this.selectedList.forEach(item => {
        item.selected = false;
        item.checked = false;
      });
      this.selectedList = [];
      this.multiple ? (this.currentValue = []) : (this.currentValue = '');
      this.onChangeValue();
      this.isVisible && this.filterNode();
      this.searchKeyWord = '';
    },
    initReadolyTitle() {
      if (!this.$el) {
        return;
      }
      let width = this.$el.clientWidth;
      let text_length = 0;
      let str = '';
      this.selectedList.forEach((i, sindex) => {
        let text = '';
        if (sindex < this.selectedList.length - 1) {
          text = i[this.textName] + this.sperateText;
        } else {
          text = i[this.textName];
        }
        str = str + text;
      });
      for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 256) {
          text_length = text_length + 1;
        } else {
          text_length = text_length + 0.5;
        }
      }
      this.readonlyTitle = width > text_length * 14 ? null : str;
    }
  },
  computed: {
    getStyle: function() {
      let _this = this;
      let resultJson = {};
      if (typeof _this.width == 'number') {
        resultJson.width = _this.width + 'px';
      } else if (typeof _this.width == 'string' && _this.width.indexOf('%') >= 0) {
        resultJson.width = _this.width;
      }
      return resultJson;
    },
    getClass: function() {
      let _this = this;
      let resultjson = [];
      // if (typeof _this.width == 'string' && ['small', 'large', 'middle'].indexOf(_this.width) >= 0) {
      //   resultjson.push("input-" + small);
      // }
      _this.disabled && resultjson.push('tsform-select-disabled');
      _this.readonly && resultjson.push('tsform-select-readonly');
      _this.validMesage && resultjson.push('tsForm-formItem-error');
      _this.isVisible && resultjson.push('ivu-select-visible');
      _this.focussing && resultjson.push('tsform-select-focus');
      return resultjson;
    },
    borderClass: function() {
      let resultJson = { 'form-tree': true };
      if (this.border) {
        resultJson['tsForm-border-' + this.border] = true;
        resultJson['tsForm-item'] = true;
      }
      this.className && (resultJson[this.className] = true);
      return resultJson;
    }
  },
  watch: {
    dataList() {
      this.initNodeList();
    },
    value: function(newValue, oldValue) {
      let _this = this;
      if (JSON.stringify(newValue) != JSON.stringify(this.currentValue)) {
        this.currentValue = this.$utils.deepClone(newValue);
        this.selectedList = [];
        this.currentValue && this.currentValue.length > 0 && this.nodeList.forEach(item => this.flattenChildren(item));
        this.validMesage = '';
      }
    },
    validateList() {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
    },
    isVisible(val) {
      if (val) {
        this.$nextTick(() => {
          this.updatePosition();
        });
        this.firstOutside = false;
      }
    },
    params: {
      handler(newValue, oldValue) {
        if (newValue != oldValue && JSON.stringify(newValue) == JSON.stringify(oldValue)) {
          return false;
        } else {
          this.initNodeList();
        }
      },
      deep: true
    }
  }
};

function setWidth($contain, $target, transfer) {
  if ($contain && $target) {
    let newWidth = $contain.clientWidth || 0;
    let oldWidth = $target.clientWidth || 0;
    if (newWidth != oldWidth) {
      $target.parentNode.style.minWidth = newWidth + 'px';
    }
    $target.parentNode.style.width = 'auto';
  }
}
</script>
<style lang="less">
.form-tree {
  .empty-placeholder {
    line-height: 30px;
    &:empty:before {
      content: attr(placeholder);
    }
  }
  .ivu-dropdown {
    position: relative;
  }
  .ivu-select-dropdown {
    min-width: 100%;
    width: auto;
  }
  .select-body {
    .select-top {
      width: 100%;
      display: inline-block;
      min-height: 32px;
      line-height: 30px;
      border-radius: 2px;
      height: auto;
      padding: 0 8px;
      padding-right: 18px;
      vertical-align: middle;
      cursor: pointer;
      text-align: left;
      .single-span {
        width: 100%;
        display: inline-block;
        vertical-align: top;
      }
      .search-input {
        height: 28px;
        border: 0 none !important;
        padding: 0;
      }
      .clearBtn {
        position: absolute;
        right: 2px;
        top: 6px;
        padding: 2px;
        font-size: 14px;
        cursor: pointer;
        display: none;
        opacity: 0.8;
      }
      &:hover {
        .clearBtn {
          display: block;
        }
      }
      /deep/.ivu-tag {
        margin-top: 4px;
        float: left;
      }
    }
  }

}
.ivu-tree {
  li {
    padding: 0px 10px !important;
  }
  &.single{
      .ivu-tree-arrow-disabled{
        &+.ivu-tree-title:hover{
          background: transparent;
          cursor: pointer;;
        }
      }
  }
}
</style>
