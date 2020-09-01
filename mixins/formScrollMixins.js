export default {
  mounted() {
    !this.readonly && this.transfer && this.$nextTick(function() {
      if (this.scrollParent) {
        this.addScrollListener('add');
      } else if (this.transfer) {
        let dialogNode = this.getParentIsDialog(this);
        if (dialogNode) {
          let domNode = dialogNode.$refs.dialogContent;
          domNode && this.addScrollListener('add', domNode);
        }
      }
    });
  },
  beforeDestroy() {
    this.addScrollListener();
  },
  methods: {
    getParentIsDialog(vnode) {
      if (vnode && vnode.$parent && vnode.$parent.$options.tagComponent == 'TsDialog') {
        return vnode.$parent;
      } else if (vnode) {
        return this.getParentIsDialog(vnode.$parent) || null;
      } else {
        return null;
      }
    },
    addScrollListener: function(type, dom) {
      if (this.transfer) {
        let $scroll = null;
        if (dom) {
          $scroll = dom;
        } else {
          typeof this.scrollParent == 'object' ? ($scroll = this.scrollParent) : typeof this.scrollParent == 'string' ? ($scroll = document.querySelector(this.scrollParent)) : '';
        }
        this.$scroll && this.$scroll.removeEventListener('scroll', this.onScroll);
        this.$scroll && this.$scroll.removeEventListener('DOMMouseScroll', this.onScroll);

        if (type == 'add') {
          $scroll && $scroll.addEventListener('scroll', this.onScroll);
          $scroll && $scroll.addEventListener('DOMMouseScroll', this.onScroll);
        }
        $scroll && (this.$scroll = $scroll);
      }
    }
  }
};
