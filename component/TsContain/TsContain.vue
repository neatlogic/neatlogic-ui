<template>
  <div :class="containPrev + 'container'">
    <div v-if="$slots.top" :class="border == 'border' ? containPrev + 'header input-border' : containPrev + 'header'">
      <slot name="top">
        <Row :gutter="gutter" type="flex" justify="end" align="middle" class="top">
          <Col v-if="$slots.topDefault" style="flex:1;"><slot name="topDefault"></slot></Col>
          <Col v-if="$slots.topRight" span="4" :xxl="4" :xl="4"><slot name="topRight"></slot></Col>
          <Col v-if="$slots.topFilter" span="4" :xxl="4" :xl="4"><slot name="topFilter"></slot></Col>
          <Col v-if="$slots.topSearch" span="9" :xxl="7" :xl="8"><slot name="topSearch"></slot></Col>
        </Row>
      </slot>
    </div>
    <div v-if="type == 'layout'" :class="left ? containPrev + 'body side-left' : containPrev + 'body side-right'" :style="setPadding(isFolded)">
      <div :class="left ? containPrev + 'left bg-grey' : containPrev + 'left'" :style="setLeft(isFolded)">
        <slot name="left"></slot>
      </div>
      <div :class="right ? containPrev + 'right bg-grey' : containPrev + 'right'" :style="setRight(isFolded)">
        <slot name="right"></slot>
      </div>
    </div>
    <div v-else :class="$slots.top?containPrev + 'body':containPrev + 'body notop'">
      <slot name="content"></slot>
    </div>
    <div v-if="canFolded" class="btn-toggle text-action border-color bg-grey" :class="setBtnclass(isFolded)" :style="setTogglebtn(isFolded)" @click="toggleFolder()"></div>
  </div>
</template>
<script>
export default {
  name: 'TsContain',
  components: {},
  props: {
    gutter: {
      type: Number,
      default: 16
    },
    border: {
      type: String,
      default: 'border'
    },
    type: {
      type: String,
      default: 'custom'
    },
    left: String,
    right: String,
    canFolded: {//是否可以收起侧边栏
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      containPrev: 'tscontain-',
      isFolded: false
    };
  },
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    toggleFolder(status) {
      //切换展开收起状态
      if (status != null) {
        this.isFolded = status;
      } else {
        this.isFolded = !this.isFolded;
      }
    }
  },
  computed: {
    setPadding() {
      return function(status) {
        let style = {};
        if (this.left) {
          this.$set(style, 'padding-left', status ? '20px' : this.left);
        }
        if (this.right) {
          this.$set(style, 'padding-right', status ? '20px' : this.right);
        }
        return style;
      };
    },
    setLeft() {
      return function(status) {
        return this.left ? {
          
          width: status ? 0 : this.left
        } : {};
      };
    },
    setRight() {
      return function(status) {
        return this.right ? {
          width: status ? 0 : this.right
        } : {};
      };
    },
    setTogglebtn() {
      return function(status) {
        let styles = {};
        if (this.left) {
          Object.assign(styles, {
            left: status ? '4px' : this.left
          });
        } else if (this.right) {
          Object.assign(styles, {
            right: status ? '4px' : this.right
          });          
        }
        return styles;
      };
    },
    setBtnclass() {
      return function(status) {
        return status ? 'ts-angle-left' : 'ts-angle-right';
      };
    }

  },
  watch: {}
};
</script>
<style lang="less">
@import './contain.less';
</style>
<style lang="less" scoped>
.btn-toggle{
    position: absolute;
    top: 50%;
    border: 1px solid;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    z-index: 9;
    transform: translate(15px, 15px);
    border-radius: 50%;
    &:before{
      margin-right: 0;
    }
}
</style>
