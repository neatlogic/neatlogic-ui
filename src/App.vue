<template>
  <div>
    <TsFormSelect v-model="selectedv" v-bind="pluginConfig" :dataList="componentList" />
  </div>
  
</template>
<script>
export default {
  data() {
    return {
      pluginConfig: {
        clearable: false,
        border: 'bottom',
        width: 180,
        placeholder: '请选择插件',
        multiple: true,
        height: 32,
        selectAll: true,
        maxTagCount: 1
      },
      componentList: [{
        text: '124',
        value: 123
      }, {
        text: '122222',
        value: 12
      }, {
        text: '122232',
        value: 132
      }, {
        text: '122',
        value: 12555
      }],
      selectedv: [123, 12, 132, 12555]
    };
  }
};
</script>
