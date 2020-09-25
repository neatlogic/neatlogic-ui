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
      <template v-else>{{ selectedList[0] ? selectedList[0][textName] : '' }}</template>
    </span>

    <div v-else :class="borderClass" :style="getStyle">
      <div v-click-outside:false="onClickOutside" v-click-outside:false.mousedown="onClickOutside" v-click-outside:false.touchstart="onClickOutside" :class="getClass" class="select-body">
        <Dropdown ref="dropdownContain" style="width:100%" trigger="custom" :visible="isVisible" :transfer="transfer" placement="bottom-start">
          <div ref="usertop" class="select-top ivu-input" :class="multiple?'ivu-select-multiple':''" :disabled="disabled" tabindex="0" @click="handleOpen" @keydown="handleKeydown" @focus="onSelectFocus" @blur="onSelectBlur">
            <template v-if="multiple">
              <Tag v-for="(selected, nindex) in selectedList" :key="nindex" :name="selected[valueName]" :closable="!disabled" :fade="false" @click.native.stop="handleOpen" @on-close="deleteSeleted(nindex, selected[valueName], selectedList)">{{ selected[textName] }}</Tag>
              <span v-if="selectedList.length <= 0 && !currentSearch" :placeholder="!currentSearch ? getPlaceholder : ''" class="empty-placeholder" style="line-height: 30px;"></span>
            </template>
            <span v-else-if="disabled || readonly || !currentSearch" :placeholder="!currentSearch ? getPlaceholder : ''" class="overflow empty-placeholder single-span">{{ selectedList[0] ? selectedList[0][textName] : '' }}</span>
            <input v-if="!(disabled || readonly) && currentSearch" ref="input" v-model="searchKeyWord" class="search-input ivu-input" :style="setInputwidth(searchKeyWord)" :placeholder="selectedList.length == 0 ? getPlaceholder : ''" @input="changeSearch($event, searchKeyWord)" @focus="changeSearch($event, searchKeyWord)" @keyup.enter="onCreateOption(searchKeyWord)" />
            <i v-if="!dynamicUrl" class="ivu-icon tsfont-down ivu-select-arrow"></i>
            <i v-if="getClearable" class="clearBtn text-icon ivu-icon ivu-icon-ios-close-circle" @click.stop="clearValue"></i>
          </div>
          <DropdownMenu v-if="!(disabled || readonly)" slot="list" ref="dropdown">
            <slot name="first-ul"></slot>
            <li v-if="allowCreate && addItem" class="ivu-dropdown-item overflow" @click.stop="toggleSelect(addItem)">
              {{ addItem[showName ? showName : textName] }}
              <i class="tsfont-arrow-corner-left text-primary"></i>
            </li>
            <template v-for="(node, index) in nodeList">
              <li v-show="!node._isHidden" :key="index" :class="setLicalss(node, index)" @click.stop="toggleSelect(node)">
                <slot name="option" :item="node" :index="index"><div v-html="node.showtxt ? node.showtxt : node[showName ? showName : textName]"></div></slot>
              </li>
            </template>
            <template v-if="(nodeList.length <= 0 || hiddenLength == nodeList.length) && !allowCreate">
              <li class="ivu-dropdown-item"><span class="text-tip">暂无数据</span></li>
            </template>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div v-if="desc" class="text-tip">{{ desc }}</div>
      <transition name="fade">
        <span v-if="validMesage != ''" class="form-error-tip" v-html="validMesage"></span>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from '../../api/http.js';
import formMixins from '../../mixins/formMixins.js';
import formScrollMixins from '../../mixins/formScrollMixins.js';
import { directive as ClickOutside } from '../../directives/v-click-outside-x';
export default {
  name: 'TsFormSelect',
  tagComponent: 'TsForm',
  directives: { ClickOutside },
  mixins: [formMixins, formScrollMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    name: String,
    value: {
      //默认值
      type: [String, Number, Array, Boolean],
      default: function() {
        if (this.multiple == true) {
          return new Array();
        } else {
          return '';
        }
      }
    }, //默认值
    disabled: {
      //true  false  默认为false
      type: Boolean,
      default: false
    },
    size: String, // large  small  default   默认为default
    width: {
      //small  medium   large  block    输入数值    输入百分比
      type: [String, Number],
      default: '100%'
    },
    search: {
      type: Boolean,
      default: false
    }, //true  false
    preIcon: {
      //控件前面的图标
      type: String,
      default: ''
    },
    keyword: {
      type: String,
      default: 'keyword'
    },
    idListName: {
      type: String,
      default: 'valueList'
    },
    placeholder: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      //是否允许通过enter ，创建新的option
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    url: {
      //通过url初始化数据
      type: String,
      default: ''
    },
    params: Object,
    defaultValueIsFirst: {
      //当参数url生效是这个参数才生效,默认第一个选中
      type: Boolean,
      default: false
    },
    dynamicUrl: {
      //通过url实时获取数据
      type: String,
      default: ''
    },
    rootName: {
      //通过url来获取数据的rootName
      default: ''
    },
    dataList: Array, //通过已有的数据来渲染控件
    defaultDataList: {
      //主要是用于默认值回显，如果存在则不再调用接口进行初始化text值  {value :"",text:""}
      type: [Array, Object]
    },
    valueName: {
      //option渲染值
      default: 'value'
    },
    textName: {
      //text渲染值
      default: 'text'
    },
    showName: String,
    validateList: {
      type: Array
    },
    transfer: {
      type: Boolean,
      default: false
    },
    className: {
      //额外添加class
      type: String
    },
    clearable: { type: Boolean, default: true },
    border: String, //控件的样式 border bottom none
    onBlur: Function, //失去焦点时触发
    onFocus: Function, //获取焦点时触发
    onChange: Function, //改变时触发
    isChangeWrite: {
      //赋值时，是否需要出发on-change事件
      type: Boolean,
      default: true
    },
    desc: String,
    errorMessage: String,
    onChangelabel: Function, //改变时获取text触发
    scrollParent: [Object, String],
    sperateText: {
      type: String,
      default: '|'
    },
    dealDataByUrl: {
      //特殊情况 通过url获取的数据可能需要额外的封装之后才能使用
      type: Function
    },
    readonlyClass: {
      type: String,
      default: 'text-grey tsform-readonly'
    },
    ajaxType: {
      type: String,
      default: 'post'
    }
  },
  data: function() {
    let _this = this;
    return {
      focussing: false, //是否处于焦点中
      focusIndex: -1, //通过键盘选中列表
      searchKeyWord: '', //搜索对应可以word
      currentValue: _this.value instanceof Array ? _this.value.concat([]) : _this.value,
      isVisible: false, //下拉选项显示
      selectedList: [], //选中的集合{text："",value:""}
      nodeList: _this.url ? [] : JSON.parse(JSON.stringify(this.dataList || [])),
      loading: false,
      validMesage: _this.errorMessage || '',
      currentValidList: this.filterValid(this.validateList) || [],
      currentSearch: _this.search || !!_this.dynamicUrl,
      cancelAxios: null, //实时搜索，取消接口调用
      liHtml: _this.showName ? _this.showName : _this.textName,
      addItem: null,
      readonlyTitle: null
    };
  },
  beforeCreate() {},
  created: function() {
    this.initDataListByUrl();
  },
  mounted() {
    this.$nextTick(function() {
      this.readonly && this.initReadolyTitle();
    });
  },
  beforeDestroy() {},
  methods: {
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
    },
    handleOpen: function() {
      if (this.disabled || this.readonly) {
        return;
      }
      this.focussing = true;

      this.isVisible = !this.isVisible;
      this.$refs.input && this.$refs.input.focus();
      this.isVisible && this.updatePosition();
    },
    initDataListByUrl: function(isChange) {
      //isChange: Boolean 如果是value 改变时这个时候不希望调用search来初始化nodelist
      //初始化数据
      let _this = this;
      this.hiddenLength = 0;
      if (_this.url) {
        //url
        let params = { needPage: false };
        typeof _this.params == 'object' && Object.assign(params, _this.params);
        _this.nodeList = [];
        let ajaxArr = { method: _this.ajaxType, url: _this.url};
        let needdataLi = ['post', 'put'];
        needdataLi.indexOf(_this.ajaxType) < 0 ? Object.assign(ajaxArr, {params: params}) : Object.assign(ajaxArr, {data: params});
        axios(ajaxArr).then(res => {
          if (res && res.Status == 'OK') {
            _this.nodeList = _this.setNodeList(res.Return);
            _this.nodeList && _this.nodeList.length > 500 && (_this.nodeList.length = 500);
            _this.nodeList && _this.nodeList.length > 20 && !_this.search ? (_this.currentSearch = true) : (_this.currentSearch = _this.search); //当search参数值不存在时  如果长度大于20增加搜索功能，
            if (_this.defaultValueIsFirst && !((_this.multiple && _this.currentValue && _this.currentValue.length > 0) || !!_this.currentValue)) {
              //默认选中第一个
              _this.multiple ? (_this.currentValue = [_this.nodeList[0][_this.valueName]]) : (_this.currentValue = _this.nodeList[0][_this.valueName]);
              _this.onChangeValue();
            }
            _this.initValueByNodeList();
          } 
        });
      } else if (_this.dynamicUrl) {
        //dynamicUrl
        _this.currentSearch = true;

        !isChange && _this.dynamicSearch('', true);
        if (_this.value && _this.value.length > 0) {
          _this.dynamicInit();
        } else {
          //情况值，在同一个组件，不同数据之间切换时，初始化数据没有清掉的情况
          _this.selectedList = [];
          _this.searchKeyWord = '';
        }
      } else {
        //nodeList
        _this.nodeList && _this.nodeList.length > 20 && !_this.search ? (_this.currentSearch = true) : (_this.currentSearch = _this.search); //当search参数值不存在时  如果长度大于20增加搜索功能，
        _this.initValueByNodeList();
      }
    },
    initValueByNodeList() {
      //通过nodeList，初始化selectedList
      let ary = [];
      let _this = this;
      this.selectedList = [];
      if (this.multiple && this.currentValue && this.currentValue.length > 0) {
        //多选
        ary = this.currentValue;
      } else if (!this.multiple && this.currentValue) {
        //单选
        ary = [this.currentValue];
      }
      if (ary.length > 0) {
        _this.nodeList.forEach(function(item) {
          ary.indexOf(item[_this.valueName]) >= 0 && _this.selectedList.push(item);
        });
      } else if (ary.length <= 0 && this.isRequired && _this.nodeList.length == 1) { //如果必填，而且下拉值只有一个则默认选中第一个
        _this.selectedList.push(_this.nodeList[0]);
        ary = [_this.nodeList[0][this.valueName]];
        this.multiple ? this.currentValue = [_this.nodeList[0][this.valueName]] : this.currentValue = _this.nodeList[0][this.valueName];
        _this.onChangeValue();
      }
    
      if (ary.length > _this.selectedList.length && this.allowCreate && !this.multiple) {
        //如果不是通过接口调用写死的单独做一次性回显的，在下次初始化时把值回显回去
        this.searchKeyWord = this.currentValue;
      } else {
        if (!this.multiple) {
          //当收起下拉框时，是单选
          this.searchKeyWord = this.selectedList[0] ? this.selectedList[0][this.textName] : '';
        }
      }

      let selectItem = this.multiple ? _this.selectedList : _this.selectedList[0] || {};
      //_this.dealNoExist(_this.selectedList, _this.currentValue);
      _this.$emit('update:selectItemList', selectItem);
      let labelList = [];
      if (selectItem.length > 0) {
        selectItem.forEach(select => {
          labelList.push(select[_this.textName]);
        });
      }
      _this.$emit('change-label', labelList);
      _this.initReadolyTitle();
    },
    onCreateOption: function(val) {},
    remoteMethod: function(query) {
      let _this = this;
      if (!_this.dynamicUrl) {
        return;
      }
      if (query == '') {
        _this.nodeList = [];
        return;
      }

      if ((_this.currentValue instanceof Array && _this.currentValue.indexOf(query) > 0) || _this.currentValue == query) {
        return;
      }
      this.dynamicSearch(query);
    },
    changeSearch(event, keyword) {
      //searchKeyWord改变时，进行搜索
      // if (!this.isVisible || !this.allowCreate) {
      //   return;
      // }
      if (event && event.type == 'focus' && !this.dynamicUrl) {
        //如果不是实时搜索，则获取焦点的时候数据全部显示出来
        keyword = '';
      } else if (event && event.type == 'input') {
        this.openOption();
      }
      if (this.dynamicUrl) {
        let _this = this;
        if (this.setTimeoutDynaic) {
          clearTimeout(this.setTimeoutDynaic);
        }
        this.setTimeoutDynaic = setTimeout(() => {
          this.dynamicSearch(keyword);
          this.setTimeoutDynaic = false;
        }, 250);
      } else {
        this.filterNodeList(keyword);
      }
      if (!this.allowCreate) {
        return;
      }
      if (this.allowCreate) {
        if (keyword) {
          this.addItem = { _isAddItem: true };
          this.$set(this.addItem, this.valueName, keyword);
          this.$set(this.addItem, this.textName, keyword);
          this.focusIndex == -1 && (this.focusIndex = 0);
        } else {
          this.$set(this, 'addItem', null);
        }
      }
    },
    deleteSeleted(ind, value, list) {
      list.splice(ind, 1);
      this.currentValue.splice(this.currentValue.indexOf(value), 1);
      this.$refs.input && this.$refs.input.focus();
      this.onChangeValue();
    },
    clearValue() {
      //清除数据
      this.selectedList = [];
      this.multiple ? (this.currentValue = []) : (this.currentValue = '');
      this.onChangeValue();
      this.isVisible && this.changeSearch();
      this.searchKeyWord = '';
    },
    filterNodeList(query) {
      //nodeList进行搜索过滤
      let _this = this;
      this.hiddenLength = 0;
      _this.liHtml = _this.showName ? _this.showName : _this.textName;
      this.nodeList.forEach(item => {
        if (item) {
          if (!query || item[_this.textName].toString().indexOf(query) >= 0 || item[_this.valueName].toString().indexOf(query) >= 0) {
            _this.$set(item, '_isHidden', false);
            if (query) {
              let newtext = item[_this.liHtml].replace(new RegExp('(' + query + ')', 'ig'), '<b class="text-primary">$1</b>');
              _this.$set(item, 'showtxt', newtext);
            } else {
              _this.$set(item, 'showtxt', item[_this.liHtml]);
            }
          } else {
            _this.$set(item, '_isHidden', true);
            _this.$set(item, 'showtxt', item[_this.liHtml]);
            this.hiddenLength++;
          }
        }
      });
      _this.updatePosition();
    },
    dynamicInit() { //通过dynamicurl初始化数据
      let _this = this;
      this.hiddenLength = 0;
      let params = {};
      if (this.value instanceof Array) {
        params[_this.idListName] = this.value;
      } else if (typeof this.value == 'string') {
        params[_this.idListName] = [this.value];
      }
      typeof _this.params == 'object' && Object.assign(params, _this.params);
      let ajaxArr = { method: _this.ajaxType, url: _this.dynamicUrl};
      let needdataLi = ['post', 'put'];
      needdataLi.indexOf(_this.ajaxType) < 0 ? Object.assign(ajaxArr, {params: params}) : Object.assign(ajaxArr, {data: params});
      axios(ajaxArr).then(res => {  
        if (res && res.Status == 'OK') {
          //初始化数据时需要text值
          _this.selectedList = [];
          let selectList = _this.setNodeList(res.Return);
          selectList && selectList.length > 0 && (_this.selectedList = selectList);
          if (!_this.multiple) {
            //是单选,进行赋值处理
            _this.searchKeyWord = _this.selectedList[0] ? _this.selectedList[0][_this.textName] : '';
          }
          let selectItem = this.multiple ? _this.selectedList : _this.selectedList[0] || {};
          // _this.dealNoExist(_this.selectedList, _this.currentValue);
          _this.$emit('update:selectItemList', selectItem);
          let labelList = [];
          if (selectItem.length > 0) {
            selectItem.forEach(select => {
              labelList.push(select[_this.textName]);
            });
          }
          _this.$emit('change-label', labelList);              
          this.readonly && this.initReadolyTitle();
        }
      });
    },
    dynamicSearch(query, isFirst) { //query:搜索的关键字，isFirst 是否第一次初始化下拉值，主要为了必填时只有一个下拉值时默认填充
      let _this = this;
      this.hiddenLength = 0;
      //取消正在搜索的请求
      let cancel = this.cancelAxios;
      cancel && (this.cancelAxios = null) && cancel.cancel();

      const CancelToken = axios.CancelToken;
      this.cancelAxios = CancelToken.source();
      _this.loading = true;
      let params = {currentPage: 1, pageSize: 20};
      params[_this.keyword] = query ? query.trim() : '';
      typeof _this.params == 'object' && Object.assign(params, _this.params);
      let ajaxArr = {method: _this.ajaxType, url: _this.dynamicUrl, cancelToken: _this.cancelAxios.token };
      let needdataLi = ['post', 'put'];
      needdataLi.indexOf(_this.ajaxType) < 0 ? Object.assign(ajaxArr, {params: params}) : Object.assign(ajaxArr, {data: params});
      axios(ajaxArr).then(res => {
        _this.loading = false;
        if (res && res.Status == 'OK') {
          _this.nodeList = _this.setNodeList(res.Return);
          if (_this.allowCreate && query) {
            let newNode = {};
            newNode[_this.valueName] = query;
            newNode[_this.textName] = query;
          }
          _this.nodeList.splice(0, {});
          _this.updatePosition();
          if (isFirst && (!_this.currentValue || _this.currentValue.length <= 0) && _this.isRequired && _this.nodeList.length == 1) { //如果必填，而且下拉值只有一个则默认选中第一个
            _this.selectedList.push(_this.nodeList[0]);
            _this.multiple ? _this.currentValue = [_this.nodeList[0][_this.valueName]] : _this.currentValue = _this.nodeList[0][_this.valueName];
            if (!_this.multiple) {
            //是单选,进行赋值处理
              _this.searchKeyWord = _this.selectedList[0] ? _this.selectedList[0][_this.textName] : '';
            }
            _this.onChangeValue();
          }
        }
      });
    },
    setNodeList(res) { //统一处理接口返回的数据
      let nodeList = res;
      if (this.rootName) {
        let rootAry = this.rootName.split('.');
        rootAry.forEach(str => {
          nodeList = nodeList[str];
        });
      }
      if (this.dealDataByUrl && typeof this.dealDataByUrl == 'function') {
        nodeList = this.dealDataByUrl(nodeList);
      }
      return nodeList;
    },
    onChangeValue() {
      let _this = this;
      let isSame = false;
      let label = this.multiple ? [] : '';
      let valueObject = this.multiple ? [] : {};
      let selectItem = this.multiple ? [] : null;
      if (this.multiple && this.selectedList.length > 0) {
        this.selectedList.forEach(function(item) {
          label.push(item[_this.textName]);
          valueObject.push({
            value: item[_this.valueName],
            text: item[_this.textName]
          });
        });
        selectItem = this.selectedList;
      } else if (!this.multiple && this.selectedList.length > 0) {
        label = this.selectedList[0][this.textName];
        valueObject = {
          value: this.selectedList[0][_this.valueName],
          text: this.selectedList[0][_this.textName]
        };
        selectItem = this.selectedList[0];
      }
      let toValue = this.currentValue; //额外赋值主要是为了避免引用数据导致值的联动
      if (this.multiple) {
        isSame = JSON.stringify(this.value) == JSON.stringify(this.currentValue);
        toValue = this.currentValue.concat([]);
      } else if (this.value == this.currentValue) {
        isSame = true;
      }
      _this.$emit('change', toValue);
      _this.$emit('update:value', toValue);
      _this.$emit('update:selectItemList', selectItem);
      this.$emit('change-label', label);
      if (!(!this.isChangeWrite && isSame)) {
        //改变值时出发on-change事件
        _this.$emit('on-change', toValue, valueObject, selectItem);
        typeof _this.onChange == 'function' && _this.onChange(toValue, valueObject, selectItem);
        typeof _this.onChangelabel == 'function' && _this.onChangelabel(label);
        _this.multiple && _this.updatePosition();
      }

      if (!isSame) {
        if (_this.currentValidList.length > 0) {
          _this.valid(_this.currentValue);
        }
      } else {
        _this.validMesage = '';
      }
    },
    onSelectFocus: function() {
      typeof this.onFocus == 'function' && this.onFocus();
      this.$emit('on-focus');
    },
    onSelectBlur: function() {
      typeof this.onBlur == 'function' && this.onBlur();
      this.$emit('on-blur');
    },
    toggleSelect(item) {
      //选中调用的方法
      if (item && item._disabled) {
        return;
      }
      let selectli = this.selectedList;
      let value = item[this.valueName];
      if (selectli && selectli.length > 0) {
        if (this.multiple) {
          //多选
          if (this.currentValue.indexOf(value) > -1) {
            this.currentValue.splice(this.currentValue.indexOf(value), 1);
            selectli.forEach((se, ind) => {
              if (se[this.valueName] == value) {
                selectli.splice(ind, 1);
              }
            });
          } else {
            selectli.push(item);
            this.currentValue.push(value);
          }
          this.searchKeyWord = '';
        } else {
          //单选
          this.selectedList = [];
          this.selectedList.push(item);
          this.currentValue = value;
          this.hideOption();
        }
      } else {
        selectli.push(item);
        if (this.multiple) {
          //多选
          this.currentValue = [];
          this.currentValue.push(value);
          this.searchKeyWord = '';
        } else {
          //单选
          this.currentValue = value;
          this.hideOption();
        }
      }
      this.onChangeValue();
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
        this.hideOption(typeof this.$listeners['enter-search'] == 'function' && !this.multiple);
        const $contain = this.$refs.dropdownContain ? this.$refs.dropdownContain.$el || null : null;

        if ((!$contain && $contain === event.target) || $contain.contains(event.target)) {
          return;
        } else {
          //如果点击区域不是自身元素则失去焦点
          this.$refs.input && this.$refs.input.blur();
        }
      } else {
        this.caretPosition = -1;
      }
      if (this.focussing) {
        this.focussing = false;
      }
    },
    updatePosition() {
      setWidth(this.$el.querySelector('.select-body') || null, this.$refs.dropdown ? this.$refs.dropdown.$el : null, this.transfer);
      this.$refs.dropdownContain && this.$refs.dropdownContain.$refs.drop && this.$refs.dropdownContain.$refs.drop.update();
    },
    hideOption(isEnterSearch) {
      var _this = this;
      this.isVisible = false;
      if (!isEnterSearch) {
        !this.multiple ? (this.searchKeyWord = this.selectedList.length > 0 ? this.selectedList[0][this.textName] : '') : (this.searchKeyWord = '');
      }
      if (!this.multiple && this.dynamicUrl && this.selectedList.length > 0) { //如果是单选实时搜索在收起元素时，然后下拉里面的值为当前选中项
        setTimeout(() => {
          // this.dynamicSearch('search', this.selectedList[0][this.textName]);
          this.selectedList.length > 0 && _this.nodeList && (_this.nodeList = _this.nodeList.filter(item => item[_this.valueName] == _this.selectedList[0][_this.valueName]));
        });
      }
    },
    openOption() {
      this.isVisible = true;
    },
    handleKeydown(e) {
      let _this = this;
      if ((this.nodeList && this.nodeList.length > 0) || e.keyCode == 13) {
        let maxLength = this.nodeList.length;
        let minLength = this.allowCreate ? 0 : 1;

        const keyCode = e.keyCode;
        if (keyCode == '38') {
          // up
          e.preventDefault();

          this.focusIndex = this.focusIndex < minLength ? maxLength : this.focusIndex - 1;
          let focusItem = this.setFocusItem(minLength, maxLength, 'up');
        } else if (keyCode == '40') {
          // down
          e.preventDefault();
          this.focusIndex = this.focusIndex == maxLength ? minLength : this.focusIndex + 1;
          let focusItem = this.setFocusItem(minLength, maxLength, 'down');
        } else if (keyCode == '13') {
          // enter
          let _this = this;
          e.preventDefault();
          if (!this.isVisible) {
            //显示下拉框
            this.openOption();
            return;
          } else if (this.focusIndex == -1 && this.isVisible) {
            if (this.$listeners['enter-search'] && !this.multiple) {
              this.$emit('enter-search', this.searchKeyWord);
              this.selectedList = [];
              this.multiple ? (this.currentValue = []) : (this.currentValue = '');
              this.hideOption(true);
            } else {
              this.hideOption();
            }
            return;
          }
          let selectData = this.setFocusItem();
          selectData && this.toggleSelect(selectData);
          //键盘回车，如果val与当前下拉某一个一样的就是选中当前一个，如果是回车新加的继续新加逻辑
          let isExist = false;
          let keyval = _this.addItem ? _this.addItem[_this.textName] || this.searchKeyWord : this.searchKeyWord;
          if (keyval && _this.nodeList && _this.nodeList.length > 0) {
            _this.nodeList.find(no => {
              if (no[_this.valueName] === keyval || no[_this.textName] === keyval) {
                isExist = true;
              }
              return isExist;
            });
          }
          if (!_this.allowCreate || (_this.allowCreate && isExist)) {
            _this.$set(_this, 'addItem', null);

            return;
          } else {
            _this.nodeList.unshift(_this.addItem);
            if (_this.$listeners && _this.$listeners['on-create']) {
              _this.$emit('on-create', keyval);
            }
            _this.toggleSelect(_this.nodeList[0]);
            _this.$set(_this, 'addItem', null);
          }
        } else if (keyCode == '8') {
          if (this.multiple && !this.searchKeyWord && this.selectedList.length > 0) {
            let lastLi = this.selectedList.length - 1;
            let lastval = this.selectedList[lastLi][this.valueName];
            this.currentValue.splice(this.currentValue.indexOf(lastval), 1);
            this.selectedList.splice(lastLi, 1);
            this.onChangeValue();
          }
        }
      }
    },
    setFocusItem(maxLength, minLength, type) {
      //利用键盘，选中的元素样色
      let length = 0;
      let _this = this;
      let selectData = null;
      this.nodeList.forEach((item, iindex) => {
        if (iindex + 1 === _this.focusIndex) {
          _this.$set(item, '_focusSelect', true);
          selectData = item;
        } else {
          _this.$set(item, '_focusSelect', false);
        }
      });

      if (selectData && selectData._disabled && selectData._isHidden) {
        this.focusIndex = this.focusIndex == maxLength ? minLength : this.focusIndex + (type == 'up' ? -1 : 1);
        selectData = this.setFocusItem(maxLength, minLength, type);
      } else {
        this.$nextTick(function() {
          //内容的滚动
          let $scrollContain = _this.$refs.dropdown.$el.parentNode;
          let $selected = $scrollContain.querySelector(' .select-li.hover');
          if ($selected) {
            $scrollContain.scrollTop = $selected.offsetTop - 100;
          }
        });
      }

      return selectData;
    }
  },
  computed: {
    getPlaceholder: function() {
      if (this.placeholder) {
        return this.placeholder;
      } else if (this.dynamicUrl) {
        return '请输入';
      } else {
        return '请选择';
      }
    },
    getStyle: function() {
      let _this = this;
      let resultJson = {};

      if (typeof _this.width == 'number') {
        resultJson.width = _this.width + 'px';
      } else if (typeof _this.width == 'string') {
        resultJson.width = _this.width;
      }
      return resultJson;
    },
    getClearable: function() {
      let _this = this;
      let clearable = _this.clearable;
      !clearable &&
        _this.validateList &&
        _this.validateList.forEach(item => {
          typeof item == 'string' && item == 'required' && !_this.multiple && (clearable = false);
          typeof item == 'object' && item.name == 'required' && !_this.multiple && (clearable = false);
        });
      if (this.disabled || this.readonly || this.selectedList.length == 0) {
        clearable = false;
      }

      return clearable;
    },
    borderClass: function() {
      let resultJson = { TsFormSelect: true };
      if (this.border) {
        resultJson['tsForm-border-' + this.border] = true;
        resultJson['tsForm-item'] = true;
      }
      this.className && (resultJson[this.className] = true);
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
    setLicalss() {
      return function(node, index) {
        let _this = this;
        let classtxt = 'select-li ivu-dropdown-item overflow';
        if (this.multiple && this.currentValue && this.currentValue.indexOf(node[_this.valueName]) > -1) {
          classtxt = classtxt + ' selected';
        } else if (!this.multiple && this.currentValue === node[_this.valueName]) {
          classtxt = classtxt + ' selected';
        }
        if (index + 1 == _this.focusIndex || node['_focusSelect']) {
          classtxt = classtxt + ' hover';
        }
        if (node['_disabled']) {
          classtxt = classtxt + ' ivu-dropdown-item-disabled';
        }
        return classtxt;
      };
    },
    setInputwidth() {
      let _this = this;
      return function(keyword) {
        let style = { width: '100%' };
        if (!_this.multiple) {
          //单选时直接让宽度为100%
          return style;
        } else {
          style = { maxWidth: '100%', minWidth: '30px' };
          if (keyword) {
            let text_length = 0;
            for (var i = 0; i < keyword.length; i++) {
              if (keyword.charCodeAt(i) > 256) {
                text_length = text_length + 1;
              } else {
                text_length = text_length + 0.5;
              }
            }
            Object.assign(style, { width: text_length * 14 + 30 + 'px' });
          } else {
            let txtwidth = '30px';
            if (this.getPlaceholder) {
              let text_length = 0;
              for (let i = 0; i < this.getPlaceholder.length; i++) {
                if (this.getPlaceholder.charCodeAt(i) > 256) {
                  text_length = text_length + 1;
                } else {
                  text_length = text_length + 0.5;
                }
              }
              txtwidth = text_length * 14 + 30 + 'px';
            }
            Object.assign(style, { width: txtwidth });
          }
        }
        return style;
      };
    }
  },
  watch: {
    value(newValue, oldValue) {
      let _this = this;
      let isSame = false;
      if ((this.multiple && JSON.stringify(newValue) == JSON.stringify(this.currentValue)) || (!this.multiple && newValue == this.currentValue)) {
        isSame = true;
      }
      if (!isSame) {
        this.multiple ? (_this.currentValue = newValue.concat([])) : (_this.currentValue = newValue);
        _this.validMesage = '';
        _this.initDataListByUrl(true);
      }
    },
    validateList() {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
    },
    dataList: {
      handler: function(newValue, oldValue) {
        if (!this.url) {
          this.nodeList = JSON.parse(JSON.stringify(this.dataList || []));
          this.nodeList && this.nodeList.length > 20 && !this.search ? (this.currentSearch = true) : (this.currentSearch = this.search); //当search参数值不存在时  如果长度大于20增加搜索功能，
          this.initDataListByUrl(true);
        }
      },
      deep: true
    },
    url(newValue, oldValue) {
      if (newValue == oldValue) {
        return;
      }
      if (newValue) {
        this.initDataListByUrl(true);
      } else {
        this.nodeList = JSON.parse(JSON.stringify(this.dataList || []));
      }
    },
    dynamicUrl(newValue, oldValue) {
      if (newValue == oldValue) {
        return;
      }
      if (newValue) {
        this.initDataListByUrl();
      } else {
        this.nodeList = JSON.parse(JSON.stringify(this.dataList || []));
      }
    },
    params(newValue, oldValue) {
      if (JSON.stringify(newValue) != JSON.stringify(oldValue)) {
        this.initDataListByUrl();
      }
    },
    errorMessage(newValue) {
      this.validMesage = newValue;
    },
    isVisible: function(val) {
      let _this = this;
      if (val) {
        this.$nextTick(function() {
          _this.updatePosition();
        });
        this.$emit('on-open-change', val);
        typeof this.onOpenChange == 'function' && this.onOpenChange(val);
        this.firstOutside = false;
      } else if (!val && !this.multiple) {
        //当收起下拉框时，是单选
        if (this.selectedList[0] && !this.allowCreate && typeof this.$listeners['enter-search'] != 'function') {
          if (this.searchKeyWord === this.selectedList[0][this.textName] || this.searchKeyWord === this.selectedList[0][this.valueName]) {
            this.searchKeyWord = this.selectedList[0] ? this.selectedList[0][this.textName] : '';
          }
        }
      }
      if (!val && _this.nodeList.length > 0) {
        _this.nodeList.forEach(no => {
          no['_focusSelect'] = false;
        });
        _this.focusIndex = -1;
      }
      this.$emit('on-open-change', val);
    },
    multiple: function(val) {
      if (this.multiple == true && typeof this.currentValue == 'string') {
        this.currentValue = [this.currentValue];
      } else if (this.multiple == false && typeof this.currentValue == 'object') {
        this.currentValue = this.currentValue[0] || '';
      }
      this.searchKeyWord = '';
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
    // if (transfer) {
    //   $target.parentNode.style.width = 'auto';
    // }
  }
}
</script>
<style lang="less" scoped>
.TsFormSelect {
  display: inline-block;
  line-height: normal;
  vertical-align: middle;
  .empty-placeholder {
    line-height: 30px;
    &:empty:before {
      content: attr(placeholder);
    }
  }
  /deep/ .ivu-select-dropdown {
    width: auto;
    max-height: 200px;
    overflow: auto;
    &.ivu-select-dropdown-transfer {
      max-height: auto;
    }
  }
  // .tsform-select-focus {
  //   .select-top {
  //     border-color: #00bcd4;
  //   }
  // }
  .select-top {
    width: 100%;
    display: inline-block;
    min-height: 32px;
    line-height: 30px;
    border-radius: 2px;
    height: auto;
    padding: 0 8px 0 8px;
    padding-right: 18px;
    vertical-align: middle;
    cursor: pointer;
    text-align: left;
    .single-span {
      width: 100%;
      display: inline-block;
      vertical-align: top;
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
    .search-input {
      height: 28px;
      border: 0 none !important;
      padding:0px 0px;
    }
    &:hover {
      .clearBtn {
        display: block;
      }
    }
    /deep/ .ivu-tag {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 4px;
      float: left;
    }
  }
  .tsform-select-readonly {
    .ivu-input {
      opacity: 0.7;
    }
  }
  .tsform-select-disabled {
    .select-top {
      cursor: not-allowed;
       /deep/ .ivu-tag .ivu-tag-text {
        margin-right: 0px;
      }
    }
  }
}
</style>
<style lang="less">
.ivu-select-dropdown {
  top: 0px;
  left: 0px;
}
.ivu-dropdown-menu {
  min-width: auto;
  width: auto;
  .select-li {
    padding-right: 30px;
    &.selected {
      position: relative;
      &:after {
        content: '';
        font-size: 16px;
        position: absolute;
        right: 10px;
        top: 9px;
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
</style>
