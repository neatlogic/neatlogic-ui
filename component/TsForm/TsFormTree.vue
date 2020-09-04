<template>
  <div class="form-tree form-li" :class="borderClass" :style="getStyle" :size="size" :readonly="readonly" :disabled="disabled">
    <div v-click-outside:false="onClickOutside" v-click-outside:false.mousedown="onClickOutside" v-click-outside:false.touchstart="onClickOutside" class="select-body" :class="getClass">
      <Dropdown ref="dropdownContain" style="width:100%" trigger="custom" :visible="isVisible" :transfer="transfer" placement="bottom-start">
        <div tabindex="-1" class="ivu-input select-top" @click="isVisible=!isVisible">
          <div class="ivu-select-visible">
            <template v-if="multiple">
              <div v-for="(item, index) in selectedList" :key="index" class="ivu-tag ivu-tag-checked">
                <span class="ivu-tag-text">{{ item[textName] }}</span>
                <i class="ivu-icon ivu-icon-ios-close" @click.stop="removeItem($event, index, item.nodeKey)"></i>
              </div>
              <input v-if="!!(url && search)" type="text" placeholder autocomplete="off" spellcheck="false" class="ivu-select-input" @input="filterNode($event)" />
            </template>
            <template v-else>
              <input :value="selectedList[0]?selectedList[0][textName]:''" type="text" placeholder autocomplete="off" spellcheck="false" class="ivu-select-input" :readonly="!(url && search)" @input="filterNode($event)" />
            </template>
            <i class="ivu-icon tsfont-down ivu-select-arrow"></i>
          </div>
        </div>
        <DropdownMenu slot="list" ref="dropdown">
          <Tree 
            :ref="treeRef" 
            class="tsFormTree dropdown-ul"
            :class="[{'single':!multiple} ]" 
            :data="nodeList" 
            :render="renderContent" 
            :multiple="multiple || false" 
            :show-checkbox="multiple || false" 
            :check-strictly="true" 
            :childrenKey="childrenKey" 
            @on-select-change="onSelectChange" 
            @on-check-change="onCheckChange"
          ></Tree>
        </DropdownMenu>
      </Dropdown>
    </div>
    <transition name="fade">
      <span v-show="validMesage != ''" class="form-error-tip">{{ validMesage }}</span>
    </transition>
  </div>
</template>
<script>
import axios from '../../api/http.js';
import formMixins from '../../mixins/formMixins.js';
import formScrollMixins from '../../mixins/formScrollMixins.js';
import { directive as ClickOutside } from '../../directives/v-click-outside-x';
export default {
  name: 'TsFormTree',
  directives: {ClickOutside },
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
      type: [String, Array]
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
      default: ''
    },
    searchKey: {
      default: 'keyword'
    },
    valueName: {
      //option渲染值
      default: 'value'
    },
    textName: {
      //text渲染值
      default: 'text'
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
      default: 200
    },
    params: Object
  },
  data() {
    let _this = this;
    return {
      isVisible: false, //下拉选项显示
      placeholder: '请输入',
      currentValue: _this.value,
      showValue: '',
      selectedList: [], //选中的列表，精确匹配
      treeRef: 'trf' + new Date().toString(),
      nodeList: [],
      validMesage: '',
      currentValidList: _this.filterValid(_this.validateList) || []
    };
  },
  created() {
    var _this = this;
    _this.initNodeList(true);
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    initNodeList: function(isInit, searchKeyWord) {
      var _this = this;
      //通过url获取数据
      if (_this.url) {
        let params = {};
        typeof _this.params == 'object' && Object.assign(params, _this.params);
        axios.post(_this.url, params).then(res => {
          if (res) {
            if (res.Status == 'OK') {
              _this.nodeList = res.Return;
              if (_this.rootName) {
                let rootAry = _this.rootName.split('.');
                rootAry.forEach(str => {
                  _this.nodeList = _this.nodeList[str];
                });
              }
              _this.selectedList = [];
              _this.currentValue && _this.nodeList.forEach(item => _this.flattenChildren(item));
            } else {
              _this.$Notice.warning({
                title: '操作失败',
                desc: res.Message
              });
            }
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        _this.nodeList = _this.dataList || [];
        _this.currentValue && _this.nodeList.forEach(item => flattenChildren(item));
        console.log(_this.nodeList);
      }
    },
    flattenChildren(node, parent) {
      let _this = this;
      if (!_this.multiple && node[_this.valueName] == _this.currentValue) {
        _this.$set(node, 'selected', true);
        _this.selectedList.push(node);
        parent && _this.$set(parent, 'expand', true);
        return false;
      } else if (!!_this.multiple && _this.currentValue.indexOf(node[_this.valueName]) >= 0) {
        _this.$set(node, 'checked', true);
        _this.$set(node, 'selected', true);
        parent && _this.$set(parent, 'expand', true);
        _this.selectedList.push(node);
      } else {
        _this.$set(node, 'checked', false);
        _this.$set(node, 'selected', false);
        parent && _this.$set(parent, 'expand', false);
      }

      if (node[_this.childrenKey]) {
        node[_this.childrenKey].forEach(child => _this.flattenChildren(child, node));
      }
      parent && node.expand && _this.$set(parent, 'expand', true);
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
            // if (!_this.multiple && !data.selected) {
            //   _this.$refs[_this.treeRef].handleSelect(data.nodeKey); //手动选择树节点
            // } else if (_this.multiple) {
            //   _this.$refs[_this.treeRef].handleCheck({
            //     checked: !data.checked,
            //     nodeKey: data.nodeKey
            //   }); //手动选择树节点
            // }
          }
        }
      });
    },
    onSelectChange: function(selectAllNode, node) { //点击文案
      let _this = this;
      let selectValue = [];
      selectAllNode.forEach(element => {
        selectValue.push(element[_this.valueName]);
      });
      if (this.multiple) {
        node.checked != node.selected && _this.$refs[_this.treeRef].handleCheck({checked: node.selected, nodeKey: node.nodeKey}); //手动选择树节点
        _this.currentValue = selectValue;
      } else {
        _this.currentValue = selectValue[0];
      }
      this.selectedList = selectAllNode;
      console.log('onSelectChange');
      this.onChangeValue();
    },
    onCheckChange: function(selectAllNode, node) { //点击checkbox
      let _this = this;
      let selectValue = [];
      selectAllNode.forEach(element => {
        selectValue.push(element[_this.valueName]);
      });
      node.checked != node.selected && _this.$refs[_this.treeRef].handleSelect(node.nodeKey); //手动选择树节点
      _this.currentValue = selectValue;
      _this.selectedList = selectAllNode;
      console.log('onCheckChange');
      this.onChangeValue();
    },
    filterNode: function(event) {
      let _this = this;
      _this.initNodeList(false, event.target.value);
    },
    removeItem: function(event, index, nodeKey) {
      let _this = this;
      _this.selectedList.splice(index, 1);
      _this.currentValue.splice(index, 1);
      console.log('removeItem');
      this.onChangeValue();
      _this.$refs[_this.treeRef].handleCheck({
        checked: false,
        nodeKey: nodeKey
      }); //手动选择树节点
      if (_this.currentValidList.length > 0) {
        _this.valid(_this.currentValue);
      }
    },
    onChangeValue() {
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
      if (this.isVisible) {
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
        }
      } 
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
      let resultJson = { TsFormSelect: true };
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
      console.log('change');
      if (JSON.stringify(newValue) != JSON.stringify(this.currentValue)) {
        console.log('agin');
        this.currentValue = this.utils.deepClone(newValue);
        this.selectedList = [];
        this.currentValue && this.nodeList.forEach(item => flattenChildren(item));
        this.validMesage = '';
      }
    },
    validateList() {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
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
.form-tree{
  .ivu-dropdown {
    position: relative;
  }
  .ivu-select-dropdown {
    min-width: 100%;
  }
   .select-top {
    width: 100%;
    display: inline-block;
    min-height: 32px;
    line-height: 30px;
    border-radius: 2px;
    height: auto;
    padding: 0 4px;
    vertical-align: middle;
    cursor: pointer;
    text-align: left;
  }
} 
.ivu-tree{
  li{
    padding: 0px 10px !important;
  }
  &.single{
     li{
      >.ivu-tree-title{
        position: relative;
        padding-right: 20px;
        &.ivu-tree-title-selected::after{
            content: '';
            font-size: 16px;
            position: absolute;
            right: 10px;
            top: 5px;
            width: 5px;
            height: 10px;
            border: 2px solid;
            border-top-color: transparent;
            border-left-color: transparent;
            border-radius: 2px;
            transform: rotate(45deg);
        }
      } 
    }
  }
}

</style>
