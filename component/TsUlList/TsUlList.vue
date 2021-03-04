<template>
  <div class="ivu-cell-group" :class="{ level: level, group: isGroup }">
    <LiItem
      v-for="(item, index) in currentList"
      :key="index"
      :liData="item"
      :textName="textName"
      :valueName="valueName"
      :childName="childName"
      :isGroup="isGroup"
    ></LiItem>
  </div>
</template>
<script>
import LiItem from './li-item';
export default {
  name: 'TsUlList',
  components: { LiItem },
  props: {
    dataList: Array,
    textName: {
      type: String,
      default: 'name'
    },
    valueName: {
      type: String,
      default: 'id'
    },
    childName: {
      type: String,
      default: 'children'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    level: {
      type: Boolean,
      default: false
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    groupTextName: {
      type: String,
      default: 'name'
    },
    groupValueName: {
      type: String,
      default: 'id'
    },
    onClick: null
  },
  data() {
    let _this = this;
    return {
      currentList: _this.dataList || [],
      flatList: [],
      selectedValue: _this.multiple ? [] : ''
    };
  },
  created() {},
  mounted() {
    let _this = this;
    _this.$on('on-click', this.handleClick);
    _this.filterData();
  },
  methods: {
    handleClick(val) {
      let _this = this;
      let item = _this.flatList.get(val);
      if (_this.multiple) {
        if (!item._isSelected) {
          _this.selectedValue.push(val);
        } else {
          _this.selectedValue.splice(_this.selectedValue.indexOf(val), 1);
        }
      } else if (!_this.multiple && _this.selectedValue == val) {
        return;
      } else {
        (_this.selectedValue != null && _this.selectedValue != undefined) && _this.$set(_this.flatList.get(_this.selectedValue), '_isSelected', false);
        _this.selectedValue = val;
      }
      _this.$set(item, '_isSelected', !item._isSelected);
      _this.$emit('li-click', _this.selectedValue);
    },
    filterData() {
      let _this = this;
      _this.flatList = new Map();
      function compileFlatList(dataList, valueName, childName, value) {
        dataList.forEach(item => {
          _this.multiple ? (_this.selectedValue.indexOf(item[valueName]) >= 0 ? _this.$set(item, '_isSelected', true) : '') : _this.selectedValue == item[valueName] && _this.$set(item, '_isSelected', true);
          _this.flatList.set(item[valueName], item);
          if (item[childName] && item[childName].length > 0) {
            compileFlatList(item[childName], valueName, childName);
          }
        });
      }
      if (_this.currentList && _this.currentList.length) {
        compileFlatList(_this.currentList, _this.valueName, _this.childName);
      }
    }
  },
  computed: {},
  watch: {
    dataList(oldValue, newValue) {
      let _this = this;
      _this.currentList = _this.dataList || [];
      _this.filterData();
    }
  }
};
</script>
