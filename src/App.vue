<template>
  <TimeSelect v-bind="timeconfig"></TimeSelect>
</template>
<script>
export default {
  data() {
    return {
      timeconfig: {
        valueType: 'format',
        type: 'datetimerange',
        format: 'yyyy-MM-dd HH:mm:ss',
        placement: 'bottom-end',
        timerWidth: '300px',
        clearable: false,
        transfer: true,
        options: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          }
        }
      }
    };
  }
};
</script>
