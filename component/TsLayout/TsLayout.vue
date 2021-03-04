<!--菜单栏显示切换-->
<template>
  <div class="body-row">
    <div class="rowtoggle">
      <!--分割布局-->
      <Split
        v-if="isSplit"
        v-model="split"
        class="split"
        min="200px"
        max="200px"
      >
        <div slot="left">
          <slot name="left"></slot>
        </div>
        <div slot="right">
          <slot name="right"></slot>
        </div>
      </Split>
      <!--左侧收起布局-->
      <div v-if="isLeft" :class="{ hideleft: !rowstatus }">
        <div class="content" :style="{ 'padding-left': PaddingLeft }">
          <transition name="fade-left">
            <div v-show="rowstatus" class="hideLeft-left" :style="{ width: LeftWidth }">
              <slot name="left"></slot>
            </div>
          </transition>
          <span
            v-show="isHideleftbtn"
            class="hideLeft-btn"
            :style="{ left: BtnLeft }"
            @click="toggle"
          >
            <i :class="[rowstatus ? 'ts-caret-left' : 'ts-caret-right']"></i>
          </span>
          <div class="hideLeft-right">
            <slot name="right"></slot>
          </div>
        </div>
      </div>
      <!--右侧收起布局-->
      <div v-if="isRight">
        <div class="content" :style="{ 'padding-right': PaddingRight }">
          <div class="hideRight-left"></div>
          <span
            v-show="isHiderightbtn"
            class="hideRight-btn"
            :style="{ right: BtnRight }"
            @click="toggleRight"
          >
            <i :class="[rightstatus ? 'ts-caret-right' : 'ts-caret-left']"></i>
          </span>
          <transition name="fade-right">
            <div v-if="rightstatus" class="hideRight-right" :style="{ width: RightWidth }"></div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TsLayout',

  components: {},
  props: {
    sessionName: String,
    leftWidth: [Number, String], //左边区域所占的宽度或者百分比，字符串类型或者Number类型
    rightWidth: [Number, String], //右边区域所占的宽度或者百分比
    showLeft: {
      //左边收起布局
      type: Boolean,
      default: false
    },
    showLeftbtn: {
      //是否显示左边收起按钮
      type: Boolean,
      default: false
    },
    showSplit: {
      //拖拽布局
      type: Boolean,
      default: false
    },
    showRight: {
      //右边收起布局
      type: Boolean,
      default: false
    },
    showRightbtn: {
      //右边收起按钮
      type: Boolean,
      default: false
    },
    leftStatus: {
      //默认左边收起展开
      type: Boolean,
      default: true
    },
    rightStatus: {
      //默认右边收起展开
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      rowstatus: this.leftStatus, //左侧收起布局默认展开
      rightstatus: this.rightStatus, //右侧收起布局默认展开
      split: this.leftWidth,
      isLeft: this.showLeft,
      isSplit: this.showSplit,
      isHideleftbtn: this.showLeftbtn,
      isRight: this.showRight,
      isRightwidth: this.rightWidth,
      isHiderightbtn: this.showRightbtn,
      padding: 0
    };
  },

  beforeMount() {},

  created() {
    let hide_session = localStorage.getItem('hideleft_' + this.sessionName);
    if (hide_session == null) {
      this.rowstatus = this.leftStatus;
    } else {
      if (hide_session == 'false') {
        this.rowstatus = false;
      } else {
        this.rowstatus = true;
      }
    }

    if (this.showLeft && this.showSplit && this.showRight) {
      this.isLeft = true;
      this.isRight - false;
      this.isSplit = false;
    }
    if (this.showLeft == false && this.showSplit == false && this.showRight == false) {
      this.isLeft = true;
    }
    if (this.split == undefined) {
      this.split = '300';
    }
    if (this.split == 0) {
      this.rowstatus = false;
      this.isHideleftbtn = false;
    }
    if ((this.showLeft && this.showSplit) || (this.showLeft == false && this.showSplit == false) || (this.showLeft && this.showSplit == false)) {
      if (typeof this.split === 'number') {
        this.split = this.split * 100;
      }
    }
    if (typeof this.isRightwidth === 'number') {
      this.isRightwidth = this.isRightwidth * 100;
    }
    if (this.isRightwidth == 0) {
      this.rightstatus = false;
      this.isHiderightbtn = false;
    }
  },

  mounted() {},

  methods: {
    toggle() {
      this.rowstatus = !this.rowstatus;
      return this.rowstatus;
    },
    toggleRight() {
      this.rightstatus = !this.rightstatus;
    }
  },

  computed: {
    PaddingLeft: function() {
      let padding_left = new Number();
      if (typeof this.split === 'string') {
        padding_left = parseInt(this.split) + this.padding + `px`;
        if (this.rowstatus == false) {
          padding_left = `0px`;
        }
      } else if (typeof this.split === 'number') {
        padding_left = `calc(${this.split}% + ${this.padding}px)`;
        if (this.rowstatus == false) {
          padding_left = `0%`;
        }
      }
      return padding_left;
    },
    LeftWidth: function() {
      let width = new Number();
      if (typeof this.split === 'string') {
        width = parseInt(this.split) + `px`;
      } else if (typeof this.split === 'number') {
        width = this.split + `%`;
      }
      return width;
    },
    BtnLeft: function() {
      let left = new Number();
      if (typeof this.split === 'string') {
        left = parseInt(this.split) + `px`;
      } else if (typeof this.split === 'number') {
        left = `calc(${this.split}% )`;
      }
      if (this.rowstatus == false) {
        left = `-24px`;
      }
      return left;
    },
    PaddingRight: function() {
      let padding_right = new Number();
      if (typeof this.isRightwidth === 'string') {
        padding_right = parseInt(this.isRightwidth) + this.padding + `px`;
        if (this.rightstatus == false) {
          padding_right = `0px`;
        }
      } else if (typeof this.isRightwidth === 'number') {
        padding_right = `calc(${this.isRightwidth}% + ${this.padding}px)`;
        if (this.rightstatus == false) {
          padding_right = `0%`;
        }
      }
      return padding_right;
    },
    RightWidth: function() {
      let rightWidth = new Number();
      if (typeof this.isRightwidth === 'string') {
        rightWidth = parseInt(this.isRightwidth) + `px`;
      } else if (typeof this.isRightwidth === 'number') {
        rightWidth = this.isRightwidth + `%`;
      }
      return rightWidth;
    },
    BtnRight: function() {
      let btnRight = new Number();
      if (typeof this.isRightwidth === 'string') {
        btnRight = parseInt(this.isRightwidth) + `px`;
      } else if (typeof this.isRightwidth === 'number') {
        btnRight = `calc(${this.isRightwidth}% )`;
      }
      if (this.rightstatus == false) {
        btnRight = `-24px`;
      }
      return btnRight;
    }
  },

  watch: {
    rowstatus: function() {
      if (this.sessionName !== undefined && this.sessionName !== '') {
        localStorage.setItem('hideleft_' + this.sessionName, this.rowstatus);
      }
    }
  }
};
</script>
