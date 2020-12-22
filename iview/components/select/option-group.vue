<template>
  <li v-show="!hidden" :class="[prefixCls + '-wrap']">
    <div :class="[prefixCls + '-title']">{{ label }}</div>
    <ul>
      <li ref="options" :class="[prefixCls]">
        <slot></slot>
      </li>
    </ul>
  </li>
</template>
<script>
const prefixCls = 'ivu-select-group';

export default {
  name: 'OptionGroup',
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      hidden: false // for search
    };
  },
  mounted() {
    this.$on('on-query-change', () => {
      this.queryChange();
      return true;
    });
  },
  methods: {
    queryChange() {
      this.$nextTick(() => {
        const options = this.$refs.options.querySelectorAll('.ivu-select-item');
        let hasVisibleOption = false;
        for (let i = 0; i < options.length; i++) {
          if (options[i].style.display !== 'none') {
            hasVisibleOption = true;
            break;
          }
        }
        this.hidden = !hasVisibleOption;
      });
    }
  }
};
</script>
