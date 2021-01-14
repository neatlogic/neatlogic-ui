<template>
  <div :class="type == 'fix'?'':'part-loading'">
    <Spin v-if="loadingShow" size="large" :fix="type == 'fix'?true:false" class="text-primary">
      <Icon type="ios-loading" size="18" class="loading"></Icon>
      <div v-if="text">加载中</div>
    </Spin>
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
    },
    text: {
      type: [Boolean, String],
      default: '加载中'      
    }
  },
  data() {
    return {
    };
  },
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {
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
