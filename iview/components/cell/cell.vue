<template>
  <div :class="classes">
    <a v-if="to" :href="linkUrl" :target="target" class="ivu-cell-link" @click.exact="handleClickItem($event, false)" @click.ctrl="handleClickItem($event, true)" @click.meta="handleClickItem($event, true)">
      <CellItem :title="title" :label="label" :extra="extra">
        <slot slot="icon" name="icon"></slot>
        <slot slot="default"></slot>
        <slot slot="extra" name="extra"></slot>
        <slot slot="label" name="label"></slot>
      </CellItem>
    </a>
    <div v-else class="ivu-cell-link" @click="handleClickItem">
      <CellItem :title="title" :label="label" :extra="extra">
        <slot slot="icon" name="icon"></slot>
        <slot slot="default"></slot>
        <slot slot="extra" name="extra"></slot>
        <slot slot="label" name="label"></slot>
      </CellItem>
    </div>
    <div v-if="to" class="ivu-cell-arrow">
      <slot name="arrow">
        <Icon :type="arrowType" :custom="customArrowType" :size="arrowSize" />
      </slot>
    </div>
  </div>
</template>
<script>
import CellItem from './cell-item.vue';
import Icon from '../icon/icon.vue';
import mixinsLink from '../../mixins/link';

const prefixCls = 'ivu-cell';

export default {
  name: 'Cell',
  inject: ['cellGroup'],
  components: { CellItem, Icon },
  mixins: [mixinsLink],
  props: {
    name: {
      type: [String, Number]
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    extra: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      prefixCls: prefixCls
    };
  },
  methods: {
    handleClickItem(event, new_window) {
      this.cellGroup.handleClick(this.name);

      this.handleCheckClick(event, new_window);
    }
  },
  computed: {
    classes() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-selected`]: this.selected,
          [`${prefixCls}-with-link`]: this.to
        }
      ];
    },
    // 3.4.0, global setting customArrow 有值时，arrow 赋值空
    arrowType() {
      let type = 'ios-arrow-forward';

      if (this.$IVIEW) {
        if (this.$IVIEW.cell.customArrow) {
          type = '';
        } else if (this.$IVIEW.cell.arrow) {
          type = this.$IVIEW.cell.arrow;
        }
      }
      return type;
    },
    // 3.4.0, global setting
    customArrowType() {
      let type = '';

      if (this.$IVIEW) {
        if (this.$IVIEW.cell.customArrow) {
          type = this.$IVIEW.cell.customArrow;
        }
      }
      return type;
    },
    // 3.4.0, global setting
    arrowSize() {
      let size = '';

      if (this.$IVIEW) {
        if (this.$IVIEW.cell.arrowSize) {
          size = this.$IVIEW.cell.arrowSize;
        }
      }
      return size;
    }
  }
};
</script>
