<template>
  <div :class="containPrev + 'container'">
    <div :class="border == 'border' ? containPrev + 'header input-border' : containPrev + 'header'">
      <slot name="top">
        <Row :gutter="gutter" type="flex" justify="end" align="middle" class="top">
          <Col v-if="$slots.topDefault" style="flex:1;"><slot name="topDefault"></slot></Col>
          <Col v-if="$slots.topRight" span="4" :xxl="4" :xl="4"><slot name="topRight"></slot></Col>
          <Col v-if="$slots.topFilter" span="4" :xxl="4" :xl="4"><slot name="topFilter"></slot></Col>
          <Col v-if="$slots.topSearch" span="9" :xxl="7" :xl="8"><slot name="topSearch"></slot></Col>
        </Row>
      </slot>
    </div>
    <div v-if="type == 'layout'" :class="left ? containPrev + 'body side-left' : containPrev + 'body side-right'" :style="setPadding">
      <div :class="left ? containPrev + 'left bg-op' : containPrev + 'left'" :style="setLeft">
        <slot name="left"></slot>
      </div>
      <div :class="right ? containPrev + 'right bg-op' : containPrev + 'right'" :style="setRight">
        <slot name="right"></slot>
      </div>
    </div>
    <div v-else :class="containPrev + 'body'">
      <slot name="content"></slot>
    </div>
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
    right: String
  },
  data() {
    return {
      containPrev: 'tscontain-'
    };
  },
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
  methods: {},
  computed: {
    setPadding: function() {
      let style = {};
      if (this.left) {
        this.$set(style, 'padding-left', this.left);
      }
      if (this.right) {
        this.$set(style, 'padding-right', this.right);
      }
      return style;
    },
    setLeft: function() {
      return {
        width: this.left
      };
    },
    setRight: function() {
      return {
        width: this.right
      };
    }
  },
  watch: {}
};
</script>
<style lang="less">
@import './contain.less';
</style>
