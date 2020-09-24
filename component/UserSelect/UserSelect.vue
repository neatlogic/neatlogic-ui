<template>
  <div class="userselect-container form-li" :style="readonly ? 'display:inline;vertical-align: initial;' : ''" :title="readonly ? showallTxt : ''">
    <span v-if="readonly" :class="readonlyClass" :title="readonlyTitle">
      <span v-for="(aitem, aindex) in selectedList" :key="aindex" class="userlist">{{ aitem.text }}</span>
    </span>
    <div v-else v-click-outside:false="onClickOutside" v-click-outside:false.mousedown="onClickOutside" v-click-outside:false.touchstart="onClickOutside" :class="borderClass" :style="getStyle" class="userselect-body">
      <input v-model="currentValue" type="hidden" />
      <Dropdown ref="dropdownContain" style="width:100%" trigger="custom" :visible="isVisible" :transfer="transfer" placement="bottom-start" :class="getClass">
        <div ref="usertop" class="userselect-top ivu-input" :disabled="disabled" @click="focusInput()" @keydown.stop="handleKeydown">
          <template v-if="multiple">
            <Tag v-for="(user, aindex) in selectedList" :key="user.value" :name="user.value" :closable="!disabled" :fade="false" :title="user.text" @click.stop @on-close="deleteSeleted(aindex, user.value, selectedList)">
              <i v-if="isIcon && groupList.length > 1" :class="iconType(user.value)" style="opacity:.6;"></i>
              {{ user.text }}
            </Tag>
          </template>
          <input ref="input" v-model="keyword" class="userselect-input ivu-input" :disabled="disabled" :style="setInputwidth(keyword)" :placeholder="selectedList.length <= 0 ? placeholder : ''" @input="changeSearch($event, keyword)" @focus="changeSearch($event, keyword)" />
          <i v-if="clearable && selectedList && selectedList.length > 0" class="clearBtn text-icon ivu-icon ivu-icon-ios-close-circle" @click="clearValue"></i>
        </div>
        <DropdownMenu slot="list" ref="dropdown" class="userselect-dropdown">
          <!-- :class="dropdownCls" -->

          <ul v-if="userList.length > 0" class="dropdown-ul">
            <li v-for="(group, gindex) in userList" :key="gindex" class>
              <div v-if="groupList.length > 1" class="text-grey userselect-title">
                {{ group.text }}
              </div>
              <ul v-if="group.dataList && group.dataList.length > 0">
                <li v-for="(user, uindex) in group.dataList" :key="gindex + '_' + uindex" :class="setLicalss(user)" @click="toggleSelect(user)">
                  <slot v-if="user.value !='......'" name="option" :row="user" :group="group">
                    {{ user.text }}
                  </slot>
                  <div v-else>{{ user.text }}</div>
                </li>
              </ul>
            </li>
          </ul>
          <ul v-else class="dropdown-ul">
            <li class="ivu-dropdown-item ivu-dropdown-item-disabled">
              暂无数据
            </li>
          </ul>
        </DropdownMenu>
      </Dropdown>
      <transition name="fade">
        <span v-show="validMesage != ''" class="form-error-tip">{{ validMesage }}</span>
      </transition>
    </div>
    <div v-if="desc" class="text-tip">{{ desc }}</div>
  </div>
</template>
<script>
//差一个点击其他地方收起的，还有单选模式的，还有滚动时定位重新计算
import axios from '../../api/http.js';
import formMixins from '../../mixins/formMixins.js';
import formScrollMixins from '../../mixins/formScrollMixins.js';
import { directive as ClickOutside } from '../../directives/v-click-outside-x';
export default {
  name: 'UserSelect',
  tagComponent: 'TsForm',
  directives: {ClickOutside },
  mixins: [formMixins, formScrollMixins],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    width: {
      //宽度
      type: [String, Number],
      default: '100%'
    },
    value: {
      //默认值
      type: [Array, String, Object]
    },
    disabled: {
      //是否禁用
      type: Boolean,
      default: false
    },
    multiple: {
      //是否多选
      type: Boolean,
      default: true
    },
    groupList: {
      //分组条件
      type: [Boolean, Array],
      default: function() {
        return ['processUserType', 'user', 'team', 'role', 'common'];
      }
    },
    transfer: {
      type: Boolean,
      default: false
    },
    readonly: {
      //只读文本模式
      type: Boolean,
      default: false
    },
    validateList: {
      //校验
      type: Array
    },
    defaultDataList: {
      //主要是用于默认值回显，如果存在则不再调用接口进行初始化text值  {value :"",text:""} userselect 的默认格式必须是这个
      type: [Array, Object]
    },
    excludeList: {
      //黑名单，主要针对具体的值，比如过滤掉“所有人”
      type: [Boolean, Array],
      default: false
    },
    includeList: {
      //白名单
      type: [Boolean, Array],
      default: false
    },
    extendCondition: {
      //拓展属性，格式为{key:value,key:value}，针对定制化非通用的参数
      type: [Boolean, Object],
      default: false
    },
    isChangeWrite: {
      //赋值时，是否需要出发on-change事件
      type: Boolean,
      default: true
    },
    isIcon: {
      //是否需要图标
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    readonlyClass: {
      type: String
    },
    desc: {
      type: [Boolean, String],
      default: false
    },
    onChange: Function, //改变时触发
    scrollParent: [Object, String], //因为 transfer 导致元素在滚出父容器时 下拉选项依然存在问题
    errorMessage: String,
    border: String, //控件的样式 border bottom none
    total: { //下拉选项的数量
      type: Number,
      default: 18
    }
  },
  data() {
    let _this = this;
    return {
      focusIndex: 0, //通过键盘选中列表
      userList: [], //搜索下拉列表
      selectedList: [], //选中的列表，精确匹配
      currentValue: getCurrentValue(_this.value, _this.multiple) || [], //默认值的设置  currentValue 始终是数组
      actualValue: _this.value instanceof Array ? _this.value.concat([]) : _this.value, //复制给value对应的值 ,主要是为了区分数组和字符串
      isLoading: false, //条用接口加载中
      alluser: [],
      validMesage: _this.errorMessage || '',
      currentValidList: _this.filterValid(_this.validateList) || [],
      moretip: {
        text: '更多',
        value: '......',
        _disabled: true
      },
      icontypeList: ['user', 'team', 'role'],
      iconConfig: {
        user: 'tsfont-user',
        team: 'tsfont-team',
        role: 'tsfont-role'
      },
      keyword: '', //搜索关键字
      isTransferDom: true,
      isVisible: false,
      readonlyTitle: null
    };
  },
  created() {},
  mounted() {
    this.initValue();
    this.validMesage = '';
    this.$nextTick(function() {
      this.readonly && this.initReadolyTitle();
    });
  },
  beforeDestroy() {},
  methods: {
    initReadolyTitle() {
      let width = this.$el.clientWidth;
      let text_length = 0;
      let str = '';
      this.selectedList.forEach((i, sindex) => {
        let text = '';
        if (sindex < this.selectedList.length - 1) {
          text = i.text + '、';
        } else {
          text = i.text;
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
      this.readonlyTitle = width > (text_length * 14) ? null : str;
    },
    getUserlist(query) {
      //获取选中的值回显的
      let _this = this;
      let params = { total: this.total };
      let valueList = query || [];
      //不管是不是数组都统一处理为数组（兼容后台valueList字段是[]）
      if (valueList.length <= 0) {
        _this.selectedList = [];
        return;
      }
      
      if (this.defaultDataList && this.defaultDataList instanceof 'Array' && this.defaultDataList.length > 0) {
        //defaultDataList是数组时 ，默认值的初始化
        _this.selectedList = [];
        this.defaultDataList.forEach(data => {
          _this.currentValue.indexOf(data.value);
          _this.selectedList = _this.selectedList.concat(data);
        });
        _this.changeSelectedList(_this.selectedList, true);
      } else if (this.defaultDataList && !this.multiple && typeof this.defaultDataList == 'object' && this.defaultDataList.text) {
        //defaultDataList 是json时，默认值的初始化 单选的时候
        _this.selectedList = [];
        this.value == this.defaultDataList.value;
        _this.selectedList.push({
          value: this.defaultDataList.value,
          text: this.defaultDataList.text
        });
        _this.changeSelectedList(_this.selectedList, true);
      } else {
        //调用接口获取默认值的初始化
        params = { valueList: valueList };
        if (this.groupList) {
          params.groupList = this.groupList;
        }
        if (this.excludeList) {
          params.excludeList = this.excludeList;
        }
        if (this.includeList) {
          params.includeList = this.includeList;
        }
        if (this.extendCondition && typeof this.extendCondition == 'object') {
          Object.assign(params, this.extendCondition);
        }
        axios
          .post('/api/rest/user/role/team/search', params)
          .then(res => {
            _this.selectedList = [];
            if (res) {
              if (res.Status == 'OK') {
                let userList = res.Return;
                _this.selectedList = [];
                userList.forEach(users => {
                  let datalist = users.dataList;
                  if (datalist && datalist.length > 0) {
                    _this.selectedList = _this.selectedList.concat(datalist);
                  }
                });
                // _this.dealNoExist(_this.selectedList, _this.currentValue);
                _this.changeSelectedList(_this.selectedList, true);
                _this.readonly && _this.initReadolyTitle();
              } else {
                _this.$Notice.warning({
                  title: '操作失败',
                  desc: res.Message
                });
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    initValue() {
      //初始化选中
      if (this.currentValue && this.currentValue.length > 0) {
        //有值时调接口获取text
        this.getUserlist(this.currentValue);
      } else {
        this.selectedList = [];
      }
    },
    onChangeValue(val) {
      let _this = this;
      //值改变的时候
      let isSame = JSON.stringify(this.actualValue) == JSON.stringify(this.value);
      let value = JSON.parse(JSON.stringify(this.actualValue));
      let selectItem = this.multiple ? [] : null;
      if (this.multiple && this.selectedList.length > 0) {
        selectItem = this.selectedList;
      } else if (!this.multiple && this.selectedList.length > 0) {
        selectItem = this.selectedList[0];
      }

      if (!this.multiple && this.selectedList.length > 0) {
        selectItem;
      } else {
        selectItem = this.multiple ? [] : null;
      }
      //改变值时出发on-change事件
      this.$emit('update:value', value);
      this.$emit('change', value);
      if (!(!this.isChangeWrite && isSame)) {
        this.$emit('on-change', value, selectItem);
        typeof _this.onChange == 'function' && _this.onChange(value, selectItem);
        _this.multiple && this.updatePosition();
      }
      if (!isSame) {
        //防止第一次初始化值时，调用change事件
        if (this.currentValidList.length > 0) {
          this.valid(val);
        }
      } else {
        this.validMesage = '';
      }
    },
    changeSelectedList: function(val, isInit) {
      //没有使用watch进行监听的原因
      if (this.multiple && this.currentValue instanceof Array) {
        this.actualValue = JSON.parse(JSON.stringify(this.currentValue));
      } else if (!this.multiple) {
        this.currentValue instanceof Array ? (this.actualValue = this.currentValue[0] || '') : (this.actualValue = this.currentValue);
      }
      this.keyword = this.multiple ? '' : (this.selectedList.length > 0 ? this.selectedList[0].text : '');
      !isInit && this.onChangeValue(val);
    },
    clearValue() {
      //清除数据
      this.keyword = '';
      this.currentValue = [];
      this.selectedList = [];
      this.multiple ? (this.actualValue = []) : (this.actualValue = '');
      this.onChangeValue();
    },
    deleteSeleted(ind, value, list) {
      list.splice(ind, 1);
      this.currentValue.splice(this.currentValue.indexOf(value), 1);
      this.changeSelectedList(this.selectedList);
    },
    changeSearch(event, keyword) {
      let _this = this;
      this.searchTime && clearTimeout(this.searchTime);
      this.searchTime = setTimeout(function() {
        _this.search(keyword);
      }, 250);
    },
    search(keyword) {
      let _this = this;
      let params = { keyword: keyword, total: this.total };
      _this.isLoading = true;
      if (_this.groupList) {
        params.groupList = _this.groupList;
      }
      if (_this.excludeList) {
        params.excludeList = _this.excludeList;
      }
      if (_this.includeList) {
        params.includeList = _this.includeList;
      }
      if (_this.extendCondition && typeof _this.extendCondition == 'object') {
        Object.assign(params, _this.extendCondition);
      }
      axios
        .post('/api/rest/user/role/team/search', params)
        .then(res => {
          _this.isLoading = false;
          if (res) {
            if (res.Status == 'OK') {
              _this.isVisible = true;
              setWidth(this.$el.querySelector('.userselect-body') || null, this.$refs.dropdown ? this.$refs.dropdown.$el : null);
              let userList = res.Return;
              _this.userList = [];
              userList.forEach(users => {
                let datalist = users.dataList;
                if (users.isMore && datalist.length > 0) {
                  datalist.push(_this.moretip);
                }
                if (datalist && datalist.length > 0) {
                  _this.userList.push(users);
                }
              });
              this.updatePosition();
            } else {
              _this.$Notice.warning({
                title: '操作失败',
                desc: res.Message
              });
            }
          }
        })
        .catch(error => {
          _this.isLoading = false;
          console.log(error);
        });
    },
    focusInput() {
      this.$refs.input && this.$refs.input.focus();
    },
    toggleSelect(item) {
      if (item._disabled) {
        return;
      }
      let selectli = this.selectedList;
      if (selectli && selectli.length > 0) {
        if (this.multiple) {
          //多选
          if (this.currentValue.indexOf(item.value) > -1) {
            this.currentValue.splice(this.currentValue.indexOf(item.value), 1);
            selectli.forEach((se, ind) => {
              if (se.value == item.value) {
                selectli.splice(ind, 1);
              }
            });
          } else {
            selectli.push(item);
            this.currentValue.push(item.value);
          }
        } else {
          //单选
          this.selectedList = [];
          this.selectedList.push(item);
          this.currentValue = [item.value];
          this.isVisible = false;
        }
      } else {
        selectli.push(item);
        this.currentValue = [];
        this.currentValue.push(item.value);
        !this.multiple && (this.isVisible = false);
      }

      this.changeSelectedList(this.selectedList);
    },
    onClickOutside(event) {
      //点击外部，dropdown消失
      if (this.isVisible) {
        if (event.type === 'mousedown') {
          event.preventDefault();
        }
        const $el = this.$refs.dropdown ? this.$refs.dropdown.$el || null : null;
        if ((!$el && $el === event.target) || $el.contains(event.target)) {
          return;
        }

        event.stopPropagation();
        event.preventDefault();
        this.isVisible = false;
        const $contain = this.$refs.dropdownContain ? this.$refs.dropdownContain.$el || null : null;
        if ((!$contain && $contain === event.target) || $contain.contains(event.target)) {
          return;
        } else {
          //如果点击区域不是自身元素则失去焦点
          this.$refs.input.blur();
        }
      } else {
        this.caretPosition = -1;
      }
    },
    updatePosition() {
      //更新dropdown，下拉框的位置
      let parentNode = this.$refs.dropdown && this.$refs.dropdown.$el ? this.$refs.dropdown.$el.parentNode : null;
      setWidth(this.$el.querySelector('.userselect-body') || null, this.$refs.dropdown ? this.$refs.dropdown.$el : null);
      this.$refs.dropdownContain && this.$refs.dropdownContain.$children[0].update();
    },
    handleKeydown(e) {
      if (this.userList && this.userList.length > 0) {
        let length = getDataLength(this.userList);
        const keyCode = e.keyCode;

        if (keyCode == '38') {
          // up
          e.preventDefault();
          this.focusIndex = this.focusIndex <= 1 ? length : this.focusIndex - 1;
          let focusItem = this.setFocusItem();
          if (focusItem._disabled) {
            this.focusIndex = this.focusIndex <= 1 ? length : this.focusIndex - 1;
            this.setFocusItem();
          }
        }

        if (keyCode == '40') {
          // down
          e.preventDefault();
          this.focusIndex = this.focusIndex >= length ? 1 : this.focusIndex + 1;
          let focusItem = this.setFocusItem();

          if (focusItem._disabled) {
            this.focusIndex = this.focusIndex >= length ? 1 : this.focusIndex + 1;
            this.setFocusItem();
          }
        }

        if (keyCode == '13') {
          // enter
          e.preventDefault();
          let selectData = this.setFocusItem();
          selectData && this.toggleSelect(selectData);
        }
      }
    },
    setFocusItem() {
      //利用键盘，选中的元素样色
      let length = 0;
      let _this = this;
      let selectData = null;
      this.userList.forEach(item => {
        item.dataList.forEach(data => {
          length++;
          data['_focusSelect'] && (data['_focusSelect'] = false);
          length == _this.focusIndex && _this.$set(data, '_focusSelect', true) && (selectData = data);
        });
      });
      this.$nextTick(function() {
        //内容的滚动
        let $scrollContain = _this.$refs.dropdown.$el.parentNode;
        let $selected = $scrollContain.querySelector(' .userselect-li.hover');
        if ($selected) {
          $scrollContain.scrollTop = $selected.offsetTop - 100;
        }
      });
      return selectData;
    },
    onScroll: function(event) {
      if (this.isVisible && this.$refs.dropdown) {
        let $contain = event.target;
        let $target = this.$refs.dropdown.$el.parentNode;
        let targetTop = $target.offsetTop;
        let containTop = $contain.getBoundingClientRect().top;
        if (!(targetTop > containTop + 10 && targetTop < containTop + $contain.clientHeight)) {
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
      } else if (typeof _this.width == 'string') {
        resultJson.width = _this.width;
      }
      return resultJson;
    },
    getClass() {
      let _this = this;
      let resultjson = [];
      _this.validMesage && resultjson.push('tsForm-formItem-error');
      _this.disabled && resultjson.push('tsform-select-disabled');
      return resultjson;
    },
    showallTxt() {
      let title = '';
      let userlist = this.selectedList;
      if (userlist && userlist.length > 0) {
        userlist.forEach((it, index) => {
          title += it.text + (index < userlist.length - 1 && userlist.length > 1 ? '、' : '');
        });
      }
      return title;
    },
    iconType() {
      return function(value) {
        let icon = 'tsfont-layer';
        let icontype = value.split('#')[0] || null;
        if (icontype && this.icontypeList.indexOf(icontype) > -1) {
          icon = this.iconConfig[icontype] || 'tsfont-layer';
        }
        return icon;
      };
    },
    setLicalss() {
      return function(list) {
        let classtxt = 'userselect-li ivu-dropdown-item overflow text-action';
        if (list && list.value == '......') {
          classtxt = 'userselect-li ivu-dropdown-item ivu-dropdown-item-disabled overflow';
        } else if (this.currentValue && this.currentValue.indexOf(list.value) > -1) {
          classtxt = 'userselect-li ivu-dropdown-item selected overflow text-href';
        }

        if (list._focusSelect) {
          classtxt = classtxt + ' hover';
        }
        return classtxt;
      };
    },
    setInputwidth() {
      return function(keyword) {
        let style = { maxWidth: '100%', minWidth: '30px' };
        if (keyword) {
          let text_length = 0;
          for (var i = 0; i < keyword.length; i++) {
            if (keyword.charCodeAt(i) > 256) {
              text_length = text_length + 1;
            } else {
              text_length = text_length + 0.5;
            }
          }
          Object.assign(style, {
            width: text_length * 14 + 30 + 'px'
          });
        } else {
          let txtwidth = '30px';
          if (this.placeholder) {
            let text_length = 0;
            for (let i = 0; i < this.placeholder.length; i++) {
              if (this.placeholder.charCodeAt(i) > 256) {
                text_length = text_length + 1;
              } else {
                text_length = text_length + 0.5;
              }
            }
            txtwidth = text_length * 14 + 30 + 'px';
          }
          Object.assign(style, { width: txtwidth });
        }
        return style;
      };
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
    value: {
      handler: function(val) {
        if (JSON.stringify(val) != JSON.stringify(this.actualValue)) {
          this.currentValue = getCurrentValue(val, this.multiple) || []; //默认值的设置  currentValue 始终是数组
          this.initValue();
          this.validMesage = '';
        }
      },
      deep: true
    },
    validateList(val) {
      let _this = this;
      _this.currentValidList = _this.filterValid(_this.validateList) || [];
      _this.validMesage = '';
    },
    isVisible: function(val) {
      let _this = this;
      if (val) {
        this.$nextTick(function() {
          _this.updatePosition();
        });
      }
    },
    groupList: {
      handler: function(val) {
        if (this.currentValue.length > 0) {
          this.initValue();
        }
      },
      deep: true
    },
    errorMessage: {
      handler: function(val) {
        this.validMesage = val;
      },
      immediate: true
    }
  }
};

function setWidth($contain, $target) {
  if ($contain && $target) {
    let newWidth = $contain.clientWidth || 0;
    let oldWidth = $target.clientWidth || 0;
    if (newWidth != oldWidth) {
      $target.parentNode.style.minWidth = newWidth - 5 + 'px';
    }
  }
}

function getCurrentValue(val, multiple) {
  let valueList = [];
  if (multiple && val instanceof Array) {
    valueList = val.concat([]);
  } else if (!multiple && typeof val == 'string') {
    valueList.push(val);
  }
  return valueList;
}

function getDataLength(list) {
  let length = 0;
  list &&
    list.forEach(item => {
      if (item.dataList) {
        length = length + item.dataList.length;
      }
    });
  return length;
}
</script>
<style lang="less" scoped>
.userselect-container {
  width: 100%;
  /deep/ .ivu-select-dropdown {
    max-height: 200px;
    overflow: auto;
    &.ivu-select-dropdown-transfer {
      max-height: auto;
    }
  }
  .userlist:not(:last-of-type) {
    position: relative;
    &:after {
      content: '、';
      display: inline-block;
      text-align: center;
      opacity: 0.7;
    }
  }
  .userselect-text {
    height: auto;
    padding: 2px 4px;
  }
  .userselect-input {
    height: 28px;
    border: 0 none !important;
    padding: 0 0px !important;
  }
  .userselect-top {
    width: 100%;
    display: inline-block;
    min-height: 32px;
    line-height: 30px;
    border-radius: 2px;
    height: auto;
    padding: 0 8px;
    vertical-align: middle;
    .clearBtn {
      position: absolute;
      right: 5px;
      top: 9px;
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
  }
  .userselect-body {
    position: relative;
  }
}
.userselect-dropdown {
  .userselect-title {
    opacity: 0.8;
    padding-left: 8px;
  }
  .userselect-li {
    min-width: 200px;
    padding-right: 30px;

    &.selected {
      //   background: transparent;
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
