<template>
  <div>
    <div class="tstable-container">
      <!-- 用于做固定的表头_start -->
      <div ref="toptable" :style="topleft">
        <table :class="'table-top tstable-body tstable-' + size + (border ? '' : ' tstable-noborder')">
          <colgroup>
            <col v-if="columnList && columnList.length > 0" />
            <col v-if="canDrag" width="40" />
            <col v-for="(hitem, hindex) in getshowList" :key="hindex" :width="hitem.width" />
          </colgroup>
          <thead>
            <tr>
              <th v-if="columnList && columnList.length > 0" style="z-index: 1000; padding: 0;" :style="fixLeft">
                <div class="corner"></div>
              </th>
              <th v-if="canDrag" class="drag-container">
                <slot name="drag-title"></slot>
              </th>
              <th v-for="(hitem, hindex) in getshowList" :key="hindex">
                <template v-if="hitem.key == 'selection'">
                  <div :class="getAllsection" @click.stop="selectAll()"></div>
                </template>
                <template v-else-if="hitem.key == 'action'">
                  <div>{{ hitem.title }}</div>
                </template>
                <template v-else>
                  <slot :name="'th-'+hitem.key" :row="hitem">
                    <div v-if="getSort(hitem)" @click="switchStatus(hitem)">
                      {{ hitem.title }}
                      <span :class="setSortclass(hitem,sortConfig)"></span>
                    </div>
                    <div v-else>{{ hitem.title }}</div>
                  </slot>
                  <div v-if="canResize" class="btn-resize"></div>
                </template>
              </th>
            </tr>
          </thead>
          <tbody v-if="getshowList.length > 0 && tbodyList.length > 0">
            <template v-for="(bitem, bindex) in tbodyList">
              <tr :key="bitem[rowKey]||bindex">
                <th v-if="columnList && columnList.length" :style="fixLeft">
                  <div>{{ columnList[bindex].displayName }}</div>
                </th>
                <td v-if="canDrag" class="drag-container"></td>
                <td v-for="(hitem, hindex) in getshowList" :key="hindex" :class="getClassName(bitem, hitem, bindex)">
                  <div :class="hitem.key == 'action' ? 'action-div' : ''" :style="setPostion(hitem.key)">
                    <div v-if="hitem.key == 'action'" class="action-bg action-bgimg" :style="setActionwidth"></div>
                    <slot :name="hitem.key" :row="bitem">
                      <div v-if="hitem.key == 'selection'"></div>
                      <div v-else-if="hitem.key == 'action'">
                        <div class="tstable-action">
                          <ul class="tstable-action-ul">
                            <li v-for="btn in bitem.action" :key="btn.name">{{ btn.text }}</li>
                          </ul>
                        </div>
                      </div>
                      <div v-else>{{ bitem[hitem.key] }}</div>
                    </slot>
                    <div v-if="hideAction && hitem.key == 'action'" class="btn-hideaction action-bg"><i class="tsfont-right text-primary btn-hideicon"></i></div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr>
              <td :colspan="getshowList.length || 0" class="text-center">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 用于做固定的表头_end -->
      <div ref="tablemain" class="tstable-main" :style="setTableheight(tableheight)" @scroll.stop="scrollTable($event)">
        <table ref="tstable" :class="'table-main tstable-body tstable-' + size + (border ? '' : ' tstable-noborder')">
          <colgroup>
            <col v-if="columnList && columnList.length" />
            <col v-if="canDrag" width="40" />
            <col v-for="(hitem, hindex) in getshowList" :key="hindex" :width="hitem.width" />
          </colgroup>
          <thead>
            <tr>
              <th v-if="columnList && columnList.length" style="z-index: 1000; padding: 0;">
                <div class="corner"></div>
              </th>
              <th v-if="canDrag" class="drag-container">
                <slot name="drag-title"></slot>
              </th>
              <th v-for="(hitem, hindex) in getshowList" :key="hindex">
                <template v-if="hitem.key == 'selection'">
                  <div :class="getAllsection"></div>
                </template>
                <template v-else>
                  <slot :name="'th-'+hitem.key" :row="hitem">
                    <div v-if="getSort(hitem)">
                      {{ hitem.title }}
                      <span :class="setSortclass(hitem,sortConfig)"></span>
                    </div>
                    <div v-else>{{ hitem.title }}</div>
                  </slot>
                  <div v-if="canResize" class="btn-resize"></div>
                </template>
              </th>
            </tr>
          </thead>
          <draggable v-if="getshowList.length > 0 && tbodyList.length > 0" :disabled="!canDrag" tag="tbody" :list="tbodyList" handle=".drag-handle" @mouseleave="clearActionwidth()" @update="dragUpdate">
            <template v-for="(bitem, bindex) in tbodyList">
              <tr :key="bitem[rowKey]||bindex" :class="setRowClass(bitem)" @click="clickTr(bitem)" @mouseenter="initActionwidth($event, bindex)" @mouseleave="toggleShowaction(bindex, 'show')">
                <th v-if="columnList && columnList.length" :style="fixLeft">
                  <div>{{ columnList[bindex].displayName }}</div>
                </th>
                <td v-if="canDrag" class="drag-container drag-handle" style="cursor:move;">
                  <slot name="drag-handle"><i class="ts-bars"></i></slot>
                </td>
                <td v-for="(hitem, hindex) in getshowList" :key="hitem.uuid || hindex" :class="getClassName(bitem, hitem, bindex)" @click="clickTd($event, bitem, hitem)">
                  <div :class="hitem.key == 'action' ? 'action-div' : ''" :style="setPostion(hitem.key)">
                    <div v-if="hitem.key == 'action'" class="action-bg action-bgimg" :style="setActionwidth"></div>
                    <slot :name="hitem.key" :row="bitem">
                      <div v-if="hitem.key == 'selection'" :class="getSection(bitem.isDisabled || false, selectList.indexOf(bitem[rowKey] || bindex) > -1 || false)" @click.stop="selectOne(bitem,bindex)"></div>
                      <div v-else-if="hitem.key == 'action'">
                        <div class="tstable-action">
                          <ul class="tstable-action-ul">
                            <li v-for="btn in bitem.action" :key="btn.name">{{ btn.text }}</li>
                          </ul>
                        </div>
                      </div>
                      <div v-else>{{ bitem[hitem.key] }}</div>
                    </slot>
                    <div v-if="hideAction && hitem.key == 'action'" class="btn-hideaction action-bg" @click="toggleShowaction(bindex)"><i class="tsfont-right text-primary btn-hideicon"></i></div>
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
          <tbody v-else>
            <tr>
              <td :colspan="getshowList.length || 0" class="text-center" v-html="noDataText"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <Poptip v-if="canEdit" placement="bottom-end" width="200" transfer class="btn-setting" popper-class="sort-drop" @on-popper-show="toggleDrop(true)" @on-popper-hide="toggleDrop(false)">
        <div v-if="isshowdrop" class="ts-remove icon-setting"></div>
        <div v-else class="ts-list icon-setting"></div>
        <div slot="content">
          <div class="sort-container">
            <div class="sort-thead">
              <div class="sort-handle">顺序</div>
              <div class="sort-name">列名</div>
              <div class="sort-show">显示</div>
            </div>
            <draggable tag="ul" :list="thList" class="sort-group" handle=".sort-handle">
              <li v-for="li in thList.filter(d => d.key != 'action')" :key="li.key" :class="li.key != 'selection' ? 'sort-item' : 'sort-item disabled'">
                <i class="ts-bars sort-handle"></i>
                <span class="text">{{ li.title ? li.title : '_' }}</span>
                <div class="sort-show">
                  <Checkbox v-model="li.isShow" @on-change="checkshow(li.key, li.isShow)"></Checkbox>
                </div>
              </li>
            </draggable>
          </div>
        </div>
      </Poptip>
    </div>
    <div v-if="rowNum > 0 && pageSize > 0" ref="tablepage" class="tstable-page">
      <Page size="small" :show-sizer="showSizer" :show-total="showTotal" :total="rowNum" :current="currentPage" :page-size="pageSize" :page-size-opts="pageSizeOpts" :transfer="true" @on-change="getPage" @on-page-size-change="getPageSize" />
    </div>
  </div>
</template>
<script>

import draggable from 'vuedraggable';
export default {
  name: 'TsTable',
  components: {
    draggable
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    rowNum: { type: Number }, //总个数
    currentPage: { type: Number }, //当前第几页
    pageSize: {
      type: Number,
      default: 20
    }, //每一页多少
    pageSizeOpts: {
      //每页条数切换的配置
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    canEdit: {
      //是否可编辑
      type: Boolean,
      default: false
    },
    canDrag: {
      //是否可拖拽排序
      type: Boolean,
      default: false
    },
    canResize: {
      //是否可拖拽改变宽度
      type: Boolean,
      default: false
    },
    theadList: { type: Array }, //表头数据
    tbodyList: {
      type: Array,
      default: function() {
        return [];
      }
    }, //正文数据
    columnList: { type: Array }, //纵列表头数据
    storage: {
      //是否需要存本地
      type: [Boolean, String],
      default: false
    },
    size: {
      type: String,
      default: 'normal'
    },
    border: {
      type: Boolean,
      default: true
    },
    height: {
      type: [Boolean, String],
      default: false
    },
    hideAction: {
      //是否可以收起浮动操作栏
      type: Boolean,
      default: true
    },
    selectedRemain: {
      //是否分页保留每一页选中状态,默认不需要，如果为true，需要传rowKey回显唯一标志
      type: Boolean,
      default: false
    },
    rowKey: {
      //每一行的唯一标志（分页保留需要，不然回显没标志判断）
      type: String
    },
    classKey: {
      // 给每个<tr>标签设置值为row[classKey]的class，其中row为tbodyList数组的元素
      type: String
    },
    value: {
      // 如果有选中的记录选中列（只会存标志位的list）
      type: Array      
    },
    noDataText: {
      //无数据提示
      type: String,
      default: '暂无数据'
    },
    showTotal: {
      //是否显示总条数
      type: Boolean,
      default: true   
    },
    showSizer: {
      //是否分页器
      type: Boolean,
      default: true   
    },
    sortList: {
      //支持排序的表头,默认无，如有需传递一个[{a:'ASC'},{b:'DESC'},{c:''}]标志哪些表头支持排序
      type: [Boolean, Array],
      default: false        
    },
    sortMapping: {
      //排序对应的映射，支持值修改但是数据必须是
      //{
      //   up: 'ASC',
      //   down: 'DESC',
      //   none: ''
      // }
      type: Object,
      default: function() {
        return {
          down: 'ASC',
          up: 'DESC',
          none: ''          
        };
      } 
    },
    sortMulti: {
      //是否支持表头多个字段排序
      type: Boolean,
      default: true     
    },
    sortOrder: {
      //已有的排序顺序
      type: [Array, Object],
      default: function() {
        return {};
      } 
    }
    
  },
  data() {
    return {
      current: '',
      thList: [],
      tableheight: '1000px',
      scrollTop: 0,
      scrollLeft: 0,
      isshowdrop: false, //设置表单格是否打开
      actionwidth: 0, //每次移上去的操作栏的宽度
      activeTr: null, //移上去的第一个tr,从1开始
      actionstatusList: [], //操作栏是否展开状态
      offsetWidth: 0,
      topleft: null,
      selectList: [], //选中列表数据(只有rowKey)
      selectallConfig: [], //选中列表数据(每一行完整的数据)
      sortConfig: {}, //表头排序用
      sortSetting: {
        up: 'ASC',
        down: 'DESC',
        none: ''
      }, //排序对应的字段
      sorttypeList: ['up', 'down', 'none'] //排序数组
    };
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    let _this = this;
    if (this.height) {
      this.tableheight = this.height - this.$refs.toptable.clientHeight;
      this.setWidth();
    } else {
      _this.initTable();
      window.addEventListener('resize', _this.initTable);
    }
    //window.onresize=_this.initTable;
  },
  beforeDestroy() {
    let _this = this;
    if (!_this.height) {
      window.removeEventListener('resize', _this.initTable);
    }
  },
  methods: {
    getPage(page) {
      this.current = page;
      this.$emit('changeCurrent', this.current);
    },
    getPageSize(size) {
      this.$emit('changePageSize', size);
    },
    checkshow(key, val) {
      this.thList.forEach(th => {
        if (th.key == key) {
          this.$set(th, 'isShow', val);
        }
      });
    },
    initTable() {
      let tableheight = window.innerHeight - (this.$refs.tablemain ? this.$refs.tablemain.getBoundingClientRect().top : 0);
      if (this.$refs.tablepage) {
        tableheight = tableheight - this.$refs.tablepage.clientHeight;
      }
      this.tableheight = tableheight - 10 + 'px';
      this.setWidth();
    },
    scrollTable: function(e) {
      let sTop = e.srcElement.scrollTop;
      let sLeft = e.srcElement.scrollLeft;
      this.scrollTop = sTop;
      this.scrollLeft = sLeft;
    },
    selectOne: function(item, index) {
      if (!item.isDisabled) {
        if (this.checkIsselected(item, index)) {
          //选中
          this.$nextTick(() => {
            this.selectList.splice(this.selectList.indexOf(item[this.rowKey] || index), 1);
            this.selectallConfig.splice(this.selectList.indexOf(item[this.rowKey] || index), 1);
            this.$emit('cancelSelected', item);
          });
        } else {
          //没选中
          this.$nextTick(() => {
            this.selectList.push(item[this.rowKey] || index);
            this.selectallConfig.push(item);
            this.$emit('selectedItem', item);
          });
        }
        this.$nextTick(() => {
          this.getSelectlist();
        });
      }
    },
    selectAll() {
      let _this = this;
      if (this.tbodyList && this.tbodyList.length > 0) {
        let isSelecedall = true;
        this.tbodyList.forEach((d, dindex) => {
          if (!_this.checkIsselected(d, dindex) && !d.isDisabled) {
            isSelecedall = false;
          }
        });
        if (isSelecedall) {
          //取消全选
          this.tbodyList.forEach((d, dindex) => {
            if (!d.isDisabled) {
              _this.$nextTick(() => {
                if (_this.selectList.indexOf(d[_this.rowKey] || dindex) > -1) {
                  _this.selectList.splice(_this.selectList.indexOf(d[_this.rowKey] || dindex), 1);
                  _this.selectallConfig.splice(_this.selectList.indexOf(d[_this.rowKey] || dindex), 1);
                }
              });
            }
          });
        } else {
          //全选
          this.tbodyList.forEach((d, dindex) => {
            if (!d.isDisabled) {
              _this.$nextTick(() => {
                if (_this.selectList.indexOf(d[_this.rowKey] || dindex) < 0) {
                  _this.selectList.push(d[_this.rowKey] || dindex);
                  _this.selectallConfig.push(d);
                }
              });
            }
          });
        }
      }
      this.$nextTick(() => {
        this.getSelectlist();
      });
    },
    getSelectlist() {
      //统一出口获取选中列表
      this.$emit('change', this.selectList);
      this.$emit('getSelected', this.selectList, this.selectallConfig);
    },
    checkIsselected(item, index) {
      //检查当前项是否选中,返回：false没有，1～n:选中列表的数组第几个
      let isSelected = false;
      let key = this.rowKey || (index + 1);
      let itemlist = this.selectList;
      if (item && key) {
        if (this.selectList.length > 0) {
          let itemval = item[this.rowKey] || index;
          if (this.selectList.indexOf(itemval) > -1) {
            isSelected = this.selectList.indexOf(itemval) + 1;
          }
        }
      }
      return isSelected;
    },
    toggleDrop(status) {
      if (status) {
        this.isshowdrop = true;
      } else {
        this.isshowdrop = false;
        this.$emit('changeHeader', this.thList);
      }
    },
    clickTd(event, bitem, hitem) {
      if (hitem.key === 'action') {
        event.stopPropagation();
      }
    },
    clickTr(item) {
      this.$emit('clickTr', item);
    },
    initActionwidth(e, ind) {
      let width = e && e.srcElement && e.srcElement.querySelector('.tstable-action-ul') && e.srcElement.querySelector('.tstable-action-ul').getBoundingClientRect().width ? e.srcElement.querySelector('.tstable-action-ul').getBoundingClientRect().width + 10 : 0;
      this.actionwidth = width;
      this.setWidth();
    },
    clearActionwidth() {
      this.activeTr = null;
    },
    toggleShowaction(index, type) {
      if (type) {
        this.actionstatusList[index] = false;
      } else {
        this.$set(this.actionstatusList, index, !this.actionstatusList[index]);
      }
    },
    setWidth() {
      if (this.$refs.tstable) {
        this.offsetWidth = Math.max(0, this.$refs.tstable.getBoundingClientRect().width - this.$el.getBoundingClientRect().width);
      }
    },
    setTopleft() {
      let styles = {};
      if (this.scrollLeft) {
        Object.assign(styles, {
          marginLeft: -this.scrollLeft + 'px'
        });
      }
      this.topleft = styles;
    },
    switchStatus(item) {
      this.setStatusclass(item.key);
      this.$nextTick(() => {
        this.$emit('updateSort', this.sortConfig);
      });
    },
    setStatusclass(keyname) {
      //更新排序状态
      let _this = this;
      if (this.sortConfig && Object.keys(this.sortConfig).length > 0) {
        //获取当前key对应的值
        let keyval = '';
        let isExsit = false;
        Object.entries(this.sortConfig).forEach(([key, val]) => {
          if (key == keyname) {
            keyval = val;
            isExsit = true;
          }
        });
        //值对应的映射
        let classkey = '';
        for (let i in this.sortSetting) {
          if (keyval === this.sortSetting[i]) {
            classkey = i;
          }
        }
        let newval = this.sorttypeList[this.sorttypeList.indexOf(classkey) == this.sorttypeList.length - 1 ? 0 : parseInt(this.sorttypeList.indexOf(classkey)) + 1];
        let newobj = {};
        newobj[keyname] = this.sortSetting[newval];
        if (!this.sortMulti) {
          this.sortConfig = newobj;
        } else {
          if (isExsit && keyval) {
            Object.assign(this.sortConfig, newobj);
          } else {
            Object.assign(this.sortConfig, newobj);
          }
        }
      } else {
        let obj = {};
        //值对应的映射
        let classkey = '';
        for (let i in this.sortSetting) {
          if (!this.sortSetting[i]) {
            classkey = i;
          }
        }
        let newval = this.sorttypeList[this.sorttypeList.indexOf(classkey) == this.sorttypeList.length - 1 ? 0 : parseInt(this.sorttypeList.indexOf(classkey)) + 1];
        obj[keyname] = this.sortSetting[newval];
        Object.assign(this.sortConfig, obj);
      }
      this.$forceUpdate();
    },
    dragUpdate(event) {
      this.$emit('updateRowSort', event);
    },
    clearSelected() {
      this.selectList = [];
      this.selectallConfig = [];
      this.$nextTick(() => {
        this.getSelectlist();
      });      
    },
    getScrollbarwidth() {
      let width = 0;
      this.$nextTick(() => {
        let outwidth = this.$refs.tablemain && this.$refs.tablemain.offsetWidth ? this.$refs.tablemain.offsetWidth : 0;
        let inwidth = this.$refs.tablemain && this.$refs.tablemain.clientWidth ? this.$refs.tablemain.clientWidth : 0;
        this.$set(this, 'scrollbarWidth', Math.max(0, outwidth - inwidth));
      });
    }
  },
  computed: {
    getshowList() {
      let showList = [];
      if (this.thList && this.thList.length > 0) {
        showList = this.thList.filter(th => {
          return th.isShow || th.isShow == undefined;
        });
      }
      return showList;
    },
    setTableheight() {
      return function(tableheight) {
        return {maxHeight: typeof tableheight == 'number' ? tableheight + 'px' : tableheight};
      };
    },
    fixLeft() {
      let translateStyle = '';
      if (this.scrollLeft && this.scrollLeft > 0) {
        translateStyle = 'translate3d(' + (this.scrollLeft % 2 == 0 ? parseInt(this.scrollLeft) : parseInt(this.scrollLeft) - 1) + 'px,0,0)';
      } else {
        translateStyle = 'none';
      }
      return {
        transform: translateStyle
      };
    },
    fixTopLeft() {
      let translateStyle = '';
      if ((this.scrollLeft && this.scrollLeft > 0) || (this.scrollTop && this.scrollTop > 0)) {
        translateStyle = 'translate3d(' + parseInt(this.scrollLeft) + 'px,' + parseInt(this.scrollTop) + 'px,0)';
      } else {
        translateStyle = 'none';
      }
      return {
        transform: translateStyle
      };
    },
    getClassName() {
      return function(bitem, hitem, bindex) {
        let sectionList = '';
        if (hitem.className) {
          sectionList += hitem.className;
        }
        if (this.actionstatusList[bindex] == true) {
          sectionList += ' hideAction';
        }
        if (hitem.key == 'action') {
          sectionList += ' action-tr';
        }
        return sectionList;
      };
    },
    getSection() {
      return function(isDisabled, isSelected) {
        let sectionList = 'tstable-selection';
        if (isDisabled) {
          sectionList += ' disabled';
        }
        if (isSelected) {
          sectionList += ' selected';
        }
        return sectionList;
      };
    },
    getAllsection: function() {
      let allsection = 'tstable-selection';
      let _this = this;
      let dataList = this.tbodyList;
      if (dataList && dataList.length > 0) {
        let alllength = dataList.length;
        let selectedlength = 0;
        dataList.forEach((d, dindex) => {
          if (_this.checkIsselected(d, dindex)) {
            selectedlength = selectedlength + 1;
          }
        });
        if (selectedlength == alllength) {
          allsection += ' selected';
        } else if (selectedlength == 0) {
          allsection += '';
        } else {
          allsection += ' some';
        }
      } else {
        allsection += ' disabled';
      }

      return allsection;
    },
    setActionwidth() {
      let style = { width: 0 };
      Object.assign(style, {
        width: this.actionwidth + 8 + 'px'
      });
      return style;
    },
    setPostion() {
      return function(type) {
        let style = '';
        if (type == 'action') {
          style = {
            marginRight: Math.max(0, this.offsetWidth - this.scrollLeft) + 'px'
          };
        }
        return style;
      };
    },
    setSortclass() {
      return function(item, config) {
        let classtxt = 'tssort';
        let keyval = '';
        Object.entries(config).forEach(([key, val]) => {
          if (key == item.key) {
            keyval = val;
          }
        });
        if (keyval) {
          for (let i in this.sortSetting) {
            if (keyval === this.sortSetting[i]) {
              classtxt += ' ' + i;
            }
          }
        } else {
          classtxt += ' none';
        }
        return classtxt;
      };
    },
    setRowClass() {
      if (!this.classKey) return () => 'tstable-tr'; 
      return row => 'tstable-tr ' + row[this.classKey];
    },
    getSort() {
      //是否要显示排序按钮
      return function(item) {
        let isSort = false;
        if (this.sortList && this.sortList.length > 0) {
          //排序的可能['a','b'],或者[{a:'ASC'},{b:'DESC'}]
          let isObj = (typeof this.sortList[0] == 'object');
          if (isObj) {
            let sortkeyList = this.sortList.map((s) => {
              return Object.keys(s)[0];
            });
            if (sortkeyList.indexOf(item.key) > -1) {
              isSort = true;
            }
          } else {
            if (this.sortList.indexOf(item.key) > -1) {
              isSort = true;
            }
          }
        }
        return isSort;
      };
    }
  },
  watch: {
    height: {
      handler(val) {
        if (val) {
          this.tableheight = 'calc(' + val + ' - 40px)';
        }
      },
      immediate: true
    },
    theadList: {
      handler(val, oldval) {
        let _this = this;
        let alllist = val;
        if (!oldval || (oldval && oldval != val)) {
          if (alllist) {
            // if (_this.storage && localStorage.getItem('tstable_' + _this.storage)) {
            //   //如果本地有设置历史，本地的如果key相同，新数据需用本地key的显示状态
            //   let locstor = JSON.parse(localStorage.getItem('tstable_' + _this.storage)) || null;
            //   if (locstor && locstor.length > 0) {
            //     let hasLast = false;
            //     let loclist = locstor.map((lo, ind) => {
            //       if (lo.key == 'action') {
            //         hasLast = true;
            //       }
            //       return lo.key;
            //     });
            //     alllist.forEach(all => {
            //       if (loclist.indexOf(all.key) < 0) {
            //         //证明是新加的
            //         _this.$set(all, 'isShow', true);
            //         if (hasLast) {
            //           locstor.splice(locstor.length - 1, 0, all);
            //         } else {
            //           locstor.push(all);
            //         }
            //       }
            //     });
            //     _this.thList.splice(0, _this.thList.length, ...locstor);
            //   }
            // } else {
            _this.thList.splice(0, _this.thList.length, ...alllist);
          //}
          } else {
            _this.thList.splice(0, _this.thList.length);
          } 
        }
        if (val && val.length > 0) {
          val.forEach(v => {
            if (Object.prototype.hasOwnProperty.call(v, 'sort')) {
              let newconf = {};
              newconf[v.key] = v.sort;
              Object.assign(_this.sortConfig, newconf);
            }
          });
        }
      },
      deep: true,
      immediate: true
    },
    thList: {
      handler(val, oldval) {
        if (this.storage) {
          localStorage.setItem('tstable_' + this.storage, JSON.stringify(this.thList));
        }
      },
      deep: true
    },
    tbodyList: {
      handler: function(val, oldval) {
        let _this = this;
        if (!_this.selectedRemain) {
          _this.selectList = [];
          _this.selectallConfig = [];
        } else {
          _this.selectList = this.value || [];
        }
        if (val && val.length > 0) {
          val.forEach(v => {
            if (v.isSelected) {
              _this.selectList.push(v[_this.rowKey]);
              _this.selectallConfig.push(v);
            }
          });
        }
        if (!oldval || val.length != oldval.length) {
          _this.actionstatusList = [];
          if (val && val.length > 0) {
            val.forEach(v => {
              _this.actionstatusList.push(false);
            });
          }
        }
      },
      deep: true,
      immediate: true
    },
    scrollLeft: {
      handler: function(val, oldval) {
        this.setTopleft();
      },
      immediate: true
    },
    value: {
      handler: function(val) {
        this.selectList = val || [];
      },
      deep: true,
      immediate: true   
    },
    sortMapping: {
      handler: function(val) {
        if (val && val != this.sortSetting) {
          this.sortSetting = val;
        }
      },
      immediate: true,
      deep: true      
    },
    sortList: {
      handler: function(val, oldval) {
        //这里负责哪些选项可以选择，还有默认值
        if (val && val.length > 0) {
          //排序的可[{a:'ASC'},{b:'DESC'}]
          if (Object.keys(this.sortConfig).length == 0) {
            let isObj = (typeof val[0] == 'object');
            if (isObj) {
              val.forEach((s) => {
                if (Object.values(s)) {
                  Object.assign(this.sortConfig, s);
                }
              });
            } 
          }
        }
        if (this.sortOrder && Object.keys(this.sortOrder).length > 0) {
          Object.assign(this.sortConfig, this.sortOrder);
        }
      },
      immediate: true,
      deep: true         
    }

  }
};
</script>
<style lang="less">
@import './table.less';
.corner {
  width: 100%;
  height: 100%;
}
.drag-container {
  width: 40px;
  min-width: 30px;
  text-align: center;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.table-action {
  tr {
    td {
      cursor: pointer;
    }
  }
}
tr {
  th:first-child,
  td:first-child {
    padding-left: 24px;
  }
  th:last-child,
  td:last-child {
    padding-right: 24px;
  }
}
.fontBold {
  font-weight: bold !important;
}
</style>
