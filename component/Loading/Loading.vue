<template>
  <div>
    <div v-if="type == 'fix'">
      <Spin v-if="show" size="large" fix class="text-primary">
        <Icon type="ios-loading" size="18" class="loading"></Icon>
        <div>加载中</div>
      </Spin>
    </div>
    <div v-else class="part-loading">
      <Spin v-if="show" size="large" class="text-primary">
        <Icon type="ios-loading" size="18" class="loading"></Icon>
        <div>加载中</div>
      </Spin>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  components: {},
  props: {
    type: {
      type: String,
      default: ''
    },
    loadingShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.loadingShow,
      loadingtype: this.type
    };
  },

  created() {},

  beforeMount() {},

  mounted() {},

  methods: {},

  computed: {},

  watch: {
    loadingShow: function() {
      this.show = this.loadingShow;
    }
  }
};
</script>
<style lang="less">
.loading {
  animation: ani-demo-spin 1s linear infinite;
}
.part-loading{
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
