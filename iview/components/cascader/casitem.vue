<template>
  <li :class="classes">
    <Tooltip
      placement="top-start"
      max-width="300"
      transfer
      theme="light"
      style="width: 100%"
      :content="data.label"
      :disabled="!data.label || !!(data.label && data.label.length < 20)"
    >
      <div class="overflow tip-label">{{ data.label }}</div>
    </Tooltip>
    <Icon v-if="showArrow" :type="arrowType" :custom="customArrowType" :size="arrowSize" />
    <i v-if="showLoading" class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-cascader-menu-item-loading"></i>
  </li>
</template>
<script>
import Icon from '../icon/icon.vue';

export default {
  name: 'Casitem',
  components: { Icon },
  props: {
    data: Object,
    prefixCls: String,
    tmpItem: Object
  },
  computed: {
    classes() {
      return [
        `${this.prefixCls}-menu-item`,
        {
          [`${this.prefixCls}-menu-item-active`]: this.tmpItem.value === this.data.value,
          [`${this.prefixCls}-menu-item-disabled`]: this.data.disabled
        }
      ];
    },
    showArrow() {
      return (this.data.children && this.data.children.length) || ('loading' in this.data && !this.data.loading);
    },
    showLoading() {
      return 'loading' in this.data && this.data.loading;
    },
    // 3.4.0, global setting customArrow 有值时，arrow 赋值空
    arrowType() {
      let type = 'ios-arrow-forward';

      if (this.$IVIEW) {
        if (this.$IVIEW.cascader.customItemArrow) {
          type = '';
        } else if (this.$IVIEW.cascader.itemArrow) {
          type = this.$IVIEW.cascader.itemArrow;
        }
      }
      return type;
    },
    // 3.4.0, global setting
    customArrowType() {
      let type = '';

      if (this.$IVIEW) {
        if (this.$IVIEW.cascader.customItemArrow) {
          type = this.$IVIEW.cascader.customItemArrow;
        }
      }
      return type;
    },
    // 3.4.0, global setting
    arrowSize() {
      let size = '';

      if (this.$IVIEW) {
        if (this.$IVIEW.cascader.itemArrowSize) {
          size = this.$IVIEW.cascader.itemArrowSize;
        }
      }
      return size;
    }
  }
};
</script>
<style lang="less" scoped>
.tip-label {
  max-width: 300px;
}
</style>
