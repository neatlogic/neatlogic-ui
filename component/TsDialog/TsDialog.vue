<template>
  <div v-if="isShow">
    <!-- modal -->

    <div v-if="type == 'modal'" v-transfer-dom :data-transfer="isTransferDom">
      <div :class="modalPrev + 'wrap'" @click.stop="maskClose ? onRemove() : ''">
        <div :class="setClass()" :style="setPosition(top, currentWidth)" @click.stop>
          <!-- 头部header内容设置 -->
          <div v-if="hasHeader == true" :class="isFull ? modalPrev + 'header isfull' : modalPrev + 'header'">
            <slot name="header">
              <div v-html="title"></div>
            </slot>

            <div class="btn-dialog-contain">
              <!-- 非全屏状态下面的按钮 -->
              <div v-if="isFull == false && fullscreen == true" class="ts-fullpage btn-dialog-header" @click="onFull()"></div>

              <!-- 全屏状态下面的按钮 -->
              <div v-else-if="isFull == true && fullscreen == true" class="ts-normalsize btn-dialog-header" @click="onFull()"></div>
              <div v-if="showCloseIcon" class="ts-remove btn-dialog-header" @click="onRemove"></div>
            </div>
            <!-- <div class="ts-remove btn-close" @click="onRemove" v-if="isFull == false"></div> -->
          </div>

          <!-- 中间body内容 -->
          <div :class="[modalPrev + 'body', { 'bg-block': bgOp }]" :style="setBody()">
            <div v-if="!hasHeader && showCloseIcon" class="ts-remove btn-close" @click="onRemove"></div>
            <div ref="dialogContent" :class="modalPrev + 'content'" :style="setHeight(height)">
              <slot>
                <div v-html="content"></div>
              </slot>
            </div>
          </div>

          <!-- 底部footer按钮内容 -->
          <div v-if="hasFooter == true" :class="[modalPrev + 'footer', { 'bg-block': bgOp }]">
            <slot name="footer">
              <Button type="text" @click.native="onCancel" v-html="cancelText"></Button>
              <Button :type="btnType" @click.native="onOk" v-html="okText"></Button>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- slider -->
    <div v-else v-transfer-dom :data-transfer="isTransferDom">
      <div :class="hasMask == true ? modalPrev + 'wrap' : ''" @click.stop="maskClose ? onRemove() : ''">
        <div :class="setClass(position)" :style="setWidth()" @click.stop>
          <!-- 头部header内容设置 -->
          <div v-if="hasHeader == true" :class="modalPrev + 'header'">
            <slot name="header">
              <div v-html="title"></div>
            </slot>
            <div class="ts-remove btn-close" @click="onRemove"></div>
          </div>

          <!-- 中间body内容 -->
          <div :class="[modalPrev + 'body', { 'bg-block': bgOp }]" :style="setStyle()">
            <div :class="modalPrev + 'content'">
              <slot></slot>
            </div>
          </div>

          <!-- 底部footer按钮内容 -->
          <div v-if="hasFooter == true" :class="modalPrev + 'footer'">
            <slot name="footer">
              <Button @click.native="onCancel" v-html="cancelText"></Button>
              <Button type="primary" @click.native="onOk" v-html="okText"></Button>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- js初始化 -->
    <div v-if="type == 'confirm'" v-transfer-dom :data-transfer="isTransferDom">
      <div :class="modalPrev + 'wrap'">
        <div :class="setClass()" :style="setPosition(top, currentWidth)" @click.stop>
          <!-- 中间body内容 -->
          <div :class="modalPrev + 'body'" :style="setBody()">
            <div :class="modalPrev + 'content'" :style="setHeight(height)">
              <slot>
                <div v-html="content"></div>
              </slot>
            </div>
          </div>
          <!-- 底部footer按钮内容 -->
          <div v-if="hasFooter == true" :class="modalPrev + 'footer'">
            <slot name="footer">
              <Button type="text" @click.native="onCancel" v-html="cancelText"></Button>
              <Button type="primary" @click.native="onOk" v-html="okText"></Button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TransferDom from '../../directives/transfer-dom';

export default {
  name: 'TsDialog',
  tagComponent: 'TsDialog',
  directives: { TransferDom },
  components: {},
  props: {
    type: {
      //弹窗类型，默认modal中间弹窗；slider侧滑窗
      type: String,
      default: 'modal'
    },
    fullscreen: {
      //modal 是否可以全屏
      type: Boolean,
      default: false
    },
    top: String,
    hasHeader: {
      //是否有顶部栏
      type: Boolean,
      default: true
    },
    hasFooter: {
      //是否有底部栏
      type: Boolean,
      default: true
    },
    position: {
      //弹窗位置
      type: String,
      default: 'right'
    },
    hasMask: {
      //是否有遮罩层
      type: Boolean,
      default: true
    },
    width: {
      //宽度设置
      type: String,
      default: 'small'
    },
    height: String,
    maskClose: {
      //是否允许点击关闭空白处关闭遮罩层
      type: Boolean,
      default: false
    },
    className: String, //额外添加class
    isShow: {
      //是否关闭弹窗
      type: Boolean,
      default: false
    },
    okText: {
      //确定按钮的文案
      type: String,
      default: '确定'
    },
    cancelText: {
      //取消按钮的文案
      type: String,
      default: '取消'
    },
    title: {
      //header显示文案
      type: String
    },
    content: {
      //内容显示文案
      type: String
    },
    showCloseIcon: {
      //是否显示关闭按钮
      type: Boolean,
      default: true
    },
    btnType: {
      //确定按钮的颜色  error  primary
      type: String,
      default: 'primary'
    },
    bgOp: {
      //弹出框的背景颜色是否是白底
      type: Boolean,
      default: false
    }
  },
  data() {
    let _this = this;
    return {
      isTransferDom: true,
      modalPrev: _this.type == 'modal' ? 'tsmodal-' : 'tsslider-',
      placement: _this.type == 'modal' ? 'middle' : 'right',
      canBlur: _this.maskClose, //slider，失去焦点的数据
      isFull: false, //modal情况下面是否满屏 ,
      currentWidth: getWidth(_this.width)
    };
  },
  created() {},
  mounted() {
    var _this = this;
    if (_this.type == 'slider' && _this.canBlur && !_this.hasMask) {
      //当遮罩层不存在，允许点击其他地方关闭
      document.addEventListener('click', function() {
        // _this.cancel();点击之后关闭弹出框
      });
    }
  },
  destroyed() {
    this.onRemove();
  },
  methods: {
    onOk: function() {
      //确定时
      this.$emit('on-ok');
      this['on-ok'] && typeof this['on-ok'] == 'function' && this['on-ok'](this);
    },
    onCancel: function() {
      this.$emit('on-cancel');
      this['on-cancel'] && typeof this['on-cancel'] == 'function' && this['on-cancel'](this); //利用js来初始化数据取消按钮
      this.onRemove();
    },
    onRemove: function() {
      this.isfull = false;
      this['on-move'] && typeof this['on-move'] == 'function' && this['on-move'](this); //利用js来初始化数据 关闭按钮
      this.closeDailog && typeof this.closeDailog == 'function' && this.closeDailog(); //利用js来关闭数据
      this.$emit('update:isShow', false);
      this.$emit('on-close');
    },

    //针对modal全屏的方法
    onFull: function() {
      if (this.isFull) {
        this.isFull = false;
      } else {
        this.isFull = true;
      }
    }
  },
  computed: {
    //slider数据
    setClass() {
      var _this = this;
      return function(position) {
        var classLi = _this.modalPrev + 'container';
        if (position) {
          classLi = classLi + ' ' + position;
        }
        if (_this.className) {
          classLi = classLi + ' ' + _this.className;
        }
        return classLi;
      };
    },
    setStyle() {
      var _this = this;
      return function() {
        var remainHeight = 0;
        if (_this.top) {
          var top = parseInt(_this.top.split('_')[0]);
          remainHeight = remainHeight + top;
        }
        if (_this.hasHeader) {
          remainHeight = remainHeight + 51;
        }
        if (_this.hasFooter) {
          remainHeight = remainHeight + 57;
        }
        return {
          height: `calc(100% - ${remainHeight}px)`
        };
      };
    },
    setWidth() {
      return function() {
        return {
          width: `${this.currentWidth}`,
          top: `${this.top}`
        };
      };
    },

    setPosition() {
      //modal,当全屏数据发生变化时改变模态框的宽度和高度
      return function(top, width) {
        var style = { width: `${width}` };
        if (top) {
          style.top = `${top}`;
        }
        if (this.isFull) {
          style.top = `0px`;
          style.width = `100%`;
          style.transform = 'translate(0, 0)';
        }
        return style;
      };
    },
    setHeight() {
      let _this = this;
      return function(height) {
        let style = { overflow: 'auto' };
        !_this.hasHeader && (style['padding-top'] = '20px');
        !_this.hasFooter && (style['padding-top'] = '20px');
        !_this.hasHeader && _this.showCloseIcon && (style['padding-top'] = '35px');
        if (height) {
          style.height = height;
        } else {
          let remainHeight = 150; //top的值，之后改成动态
          this.isFull && (remainHeight = 10);
          //let top = '150px';
          this.hasHeader && (remainHeight = remainHeight + 47);
          this.hasFooter && (remainHeight = remainHeight + 57);
          //!this.top &&  (top = this.top);
          style['max-height'] = `calc(100vh - ${remainHeight}px)`;
        }
        return style;
      };
    },
    setBody() {
      //modal,当全屏数据发生变化时改变内容的高度
      return function() {
        if (this.isFull) {
          var remainHeight = 0;
          if (this.hasHeader) {
            remainHeight = remainHeight + 57;
          }
          if (this.hasFooter) {
            remainHeight = remainHeight + 57;
          }
          return {
            height: `calc(100vh - ${remainHeight}px)`
          };
        }
      };
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      if (newVal == false && oldVal == true) {
        this.$emit('on-close'); //关闭弹出框时条用的方法
      }
    },
    width(newVal) {
      this.currentWidth = getWidth(newVal);
    }
  }
};

function getWidth(width) {
  //三个指定尺寸的设置
  let widthType = ['large', 'medium', 'small'];
  let widthList = { large: 1000, medium: 800, small: 600 };
  if (widthType.indexOf(width) >= 0) {
    return widthList[width] + 'px';
  } else {
    return width;
  }
}
</script>
<style lang="less">
@import './dialog.less';
</style>
