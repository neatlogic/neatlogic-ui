<template>
  <div :class="className">
    <div class="content">
      <img :src="nodata" :class="type === 'small' ? 'small' : ''" />
      <p v-if="type === 'small'" class="text-grey">{{ errortext }}</p>
    </div>
  </div>
</template>

<script>
import nodata from '../../static/images/error/nodata.png';
export default {
  name: 'NoData',
  props: {
    type: {
      type: String,
      default: 'small'
    },
    text: {
      type: String,
      default: '暂时没有数据'
    },
    className: {
      type: String,
      default: 'nodata' //fullNodata
    }
  },
  data() {
    return {
      errortext: this.text,
      nodata: nodata
    };
  }
};
</script>
<style lang="less">
.nodata {
  text-align: center;
  .small {
    width: 200px;
    max-width: 100%;
  }
  p {
    margin-top: 20px;
  }
}
.fullNodata {
  position: absolute;
  top: 180px;
  width: 100%;
  // height: calc(100vh - 56px);
  .content {
    position: absolute;
    top: 40%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    text-align: center;
    img {
      margin-top: 50px;
      width: 300px;
    }
  }
}
</style>
