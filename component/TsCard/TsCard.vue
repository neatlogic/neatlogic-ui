<template>
  <div :class="cardPrev + 'container'" :style="setOuterpadding(padding)">
    <template v-if="cardList.length > 0">
      <!-- 圆点分页_start -->
      <div v-if="pageType != 'scroll'">
        <ul :class="cardPrev + 'ul ivu-row'">
          <li v-for="(card, cindex) in cardList" :key="keyName ? card[keyName] : card.uuid || cindex" :class="setcardliClass(card)">
            <div :class="classname ? cardPrev + 'inner block-container ' + classname : cardPrev + 'inner block-container'">
              <div :class="cardPrev + 'header'" :style="setHeaderpostion()">
                <slot name="header" :row="card"></slot>
              </div>
              <div :class="cardPrev + 'body'">
                <slot :row="card"></slot>
              </div>
              <div :class="cardPrev + 'footer'">
                <slot name="footer" :row="card"></slot>
              </div>
              <div :class="cardPrev + 'modal'">
                <slot name="modal" :row="card"></slot>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="pageType == 'icon'" :class="cardPrev + 'page'">
          <!-- 圆点的分页 -->
          <ol v-if="pageCount && pageCount > 1" :class="cardPrev + 'pageul clearfix'">
            <template v-if="pageCount > maxPage">
              <li v-if="currentPage > 1" :class="cardPrev + 'pageli first toggle'" @click="updatePage(1)">
                <div class="toggle-btn ts-angle-double-left"></div>
              </li>
              <li v-else :class="cardPrev + 'pageli first disabled toggle'">
                <div class="toggle-btn ts-angle-double-left"></div>
              </li>
              <li v-if="currentPage > 1" :class="cardPrev + 'pageli prev toggle'" @click="updatePage(parseInt(currentPage) - 1)">
                <div class="toggle-btn ts-angle-left"></div>
              </li>
              <li v-else :class="cardPrev + 'pageli prev disabled toggle'">
                <div class="toggle-btn ts-angle-left"></div>
              </li>
            </template>
            <li v-if="min > 1" :class="cardPrev + 'more'">...</li>
            <template v-for="page in max">
              <li
                v-if="page >= min && page <= max"
                :key="page"
                :class="currentPage == page ? cardPrev + 'pageli current' : cardPrev + 'pageli'"
                @click="updatePage(parseInt(page))"
              >
                <div :class="cardPrev + 'pagenum bg-op text-title'">{{ page }}</div>
              </li>
            </template>

            <li v-if="max > pageCount" :class="cardPrev + 'more'">...</li>
            <template v-if="pageCount > maxPage">
              <li v-if="currentPage < pageCount" :class="cardPrev + 'pageli next toggle'" @click="updatePage(parseInt(currentPage) + 1)">
                <div class="toggle-btn ts-angle-right"></div>
              </li>
              <li v-else :class="cardPrev + 'pageli next disabled toggle'">
                <div class="toggle-btn ts-angle-right"></div>
              </li>
              <li v-if="currentPage < pageCount" :class="cardPrev + 'pageli last toggle'" @click="updatePage(pageCount)">
                <div class="toggle-btn ts-angle-double-right"></div>
              </li>
              <li v-else :class="cardPrev + 'pageli last disabled toggle'">
                <div class="toggle-btn ts-angle-double-right"></div>
              </li>
            </template>
          </ol>
        </div>
        <div v-else-if="pageType === 'number'" class="text-right">
          <Page
            :total="rowNum"
            size="small"
            :current="currentPage"
            :page-size="pageSize"
            transfer
            show-elevator
            show-total
            show-sizer
            :page-size-opts="sizeList"
            @on-change="updatePage"
            @on-page-size-change="updateSize"
          />
        </div>
      </div>
      <!-- 圆点分页_end -->
      <!-- 下拉加载更多 -->
      <div v-else-if="pageType === 'scroll'" :class="{ [cardPrev + 'no-more']: isNoMore }">
        <Scroll
          :on-reach-bottom="reachBottom"
          height="700"
          :distance-to-edge="-24"
          :loading-text="reachBottomText"
        >
          <ul :class="cardPrev + 'ul ivu-row'">
            <li v-for="(card, cindex) in cardList" :key="keyName ? card[keyName] : cindex" :class="setcardliClass()">
              <div :class="classname ? cardPrev + 'inner block-container ' + classname : cardPrev + 'inner block-container'">
                <div :class="cardPrev + 'header'" :style="setHeaderpostion()">
                  <slot name="header" :row="card"></slot>
                </div>
                <div :class="cardPrev + 'body'">
                  <slot :row="card"></slot>
                </div>
                <div :class="cardPrev + 'footer'">
                  <slot name="footer" :row="card"></slot>
                </div>
                <div :class="cardPrev + 'modal'">
                  <slot name="modal" :row="card"></slot>
                </div>
              </div>
            </li>
          </ul>
          <!-- <div v-show="this.currentPage>=this.pageCount">已经到底了</div> -->
        </Scroll>
      </div>
    </template>
    <template v-else>
      <NoData></NoData>
      <!--<div style="text-align: center; margin-top: 20px;">{{nodataText}}</div>-->
    </template>
  </div>
</template>
<script>
export default {
  name: 'Card',
  components: {},
  props: {
    cardInfo: Object,
    classname: String,
    pageCount: Number,
    rowNum: Number,
    pageSize: Number,
    currentPage: Number,
    cardList: Array,
    nodataText: {
      type: String,
      default: '暂无数据'
    },
    headerPosition: [String], //顶部位置，默认正常占位，可设置right\left
    headerStyle: [Object], //顶部样式自定义
    xs: Number,
    sm: {
      type: Number,
      default: 12
    },
    md: Number,
    lg: {
      type: Number,
      default: 8
    },
    xl: {
      type: Number,
      default: 6
    },
    xxl: {
      type: Number,
      default: 4
    },
    span: {
      type: Number,
      default: 24
    },
    pageType: {
      type: String,
      default: 'icon'
    },
    keyName: {
      type: String
    },
    padding: {
      type: [Boolean],
      default: false
    },
    classKey: {
      type: [Boolean, String],
      default: false
    },
    sizeList: {
      type: [Boolean, Array],
      default: function() {
        return [10, 20, 40, 50, 100];
      }
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: false
    }
  },
  data() {
    return {
      cardPrev: 'tscard-',
      maxPage: 5, //分页显示的最大个数
      minPage: 1, //分页显示的最小个数
      max: 1, //分页区间最大
      min: 1, //分页区间最小
      reachBottomText: '',
      isNoMore: false
    };
  },
  created() {},
  beforeMount() {},
  mounted() {
  },
  beforeDestroy() {},
  methods: {
    updatePage(pa) {
      let page = parseInt(pa) || 1;
      if (page != this.currentPage) {
        this.$emit('updatePage', page);
      }
    },
    updateSize(size) {
      let page = parseInt(size) || 1;
      if (page != this.pageSize) {
        this.$emit('updateSize', page);
      }
    },
    getBorderpage(current) {
      this.max = Math.min(parseInt(current) + 4, this.pageCount);
      this.min = Math.max(parseInt(current) - 4, 1);
    },
    reachBottom() {
      if (this.currentPage >= this.pageCount) {
        this.isNoMore = true;
        this.reachBottomText = '到底了';
      }
      return new Promise(resolve => {
        // setTimeout(() => {
        this.$emit('reach-bottom', this.currentPage + 1);
        resolve();
        // }, 500); //添加个延迟，防止数据请求过快，动画不好看
      });
    }
  },
  computed: {
    setHeaderpostion() {
      return function() {
        let _this = this;
        let stylelist = {};
        if (_this.headerStyle) {
          stylelist = _this.headerStyle;
        } else if (_this.headerPosition) {
          stylelist = {
            position: 'absolute'
          };
          _this.$set(stylelist, _this.headerPosition, 0);
        }
        return stylelist;
      };
    },
    setcardliClass() {
      return function(list) {
        let liStyle = this.cardPrev + 'li ivu-col';
        if (this.span) {
          liStyle += ' ivu-col-span-' + this.span;
        }
        if (this.xs) {
          liStyle += ' ivu-col-span-xs-' + this.xs;
        }
        if (this.sm) {
          liStyle += ' ivu-col-span-sm-' + this.sm;
        }
        if (this.md) {
          liStyle += ' ivu-col-span-md-' + this.md;
        }
        if (this.lg) {
          liStyle += ' ivu-col-span-lg-' + this.lg;
        }
        if (this.xl) {
          liStyle += ' ivu-col-span-xl-' + this.xl;
        }
        if (this.xxl) {
          liStyle += ' ivu-col-span-xxl-' + this.xxl;
        }
        if (this.classKey) {
          liStyle += ' li-' + list[this.classKey];
        }
        if (this.activeValue && list[this.classKey] == this.activeValue) {
          liStyle += ' li-selected';
        }
        if (this.headerPosition) {
          liStyle += ' li-fixed';
        }
        return liStyle;
      };
    },
    setOuterpadding() {
      return function(val) {
        let stylelist = {};
        if (val) {
          Object.assign(stylelist, {
            padding: 0,
            margin: '-8px'
          });
        }
        return stylelist;
      };
    }
  },
  watch: {
    currentPage: {
      handler: function(val) {
        this.getBorderpage(val);
        this.list = this.tbodyList ? this.tbodyList : this.cardList;
      },
      immediate: true
    },
    pageCount: {
      handler: function(val) {
        this.getBorderpage(this.currentPage);
      }
    }   
  }
};
</script>
<style lang="less">
@import './card.less';
</style>
