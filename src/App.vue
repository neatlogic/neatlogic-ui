<template>
  <div>
    <TsFormInput
      v-model="value"
      v-bind="settings"
      border="border"
    ></TsFormInput>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      settings: {
        type: 'number'
      }
    };
  }
};
</script>
