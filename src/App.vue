<template>
  <div>
    <TsFormDatePicker
      v-model="value"
      transfer
      width="100%"
      v-bind="getSetting"
    ></TsFormDatePicker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      config: { 'config': { 'defaultValue': '', 'valueType': 'timestamp', 'format': 'yyyy-MM-dd HH:mm:ss', 'type': 'datetimerange', 'sperateText': '、' }, 'controller': 'date', 'defaultExpression': 'between', 'expressionList': [{ 'expression': 'between', 'expressionEs': " %s between '%s' and '%s' ", 'expressionName': '属于', 'isShowConditionValue': 1 }, { 'expression': 'is-null', 'expressionEs': " %s = '' ", 'expressionName': '为空', 'isShowConditionValue': 0 }, { 'expression': 'is-not-null', 'expressionEs': " not %s = '' ", 'expressionName': '不为空', 'isShowConditionValue': 0 }], 'freemarkerTemplate': '${DATA.starttime}', 'isEditable': 1, 'label': '上报时间', 'name': 'starttime', 'paramType': 'date', 'paramTypeName': '日期', 'type': 'common', 'handler': 'formdate' }
    };
  },
  computed: {
    getSetting() {
      let setting = this.config.config;
      let json = setting;
      if (setting.styleType) {
        //format的处理
        let styleType = this.config.config.styleType || '-';
        json.format = this.config.config.showType.replace(/\-/g, styleType);
      }

      //type的处理
      if (!setting.type && setting.showType && setting.showType.indexOf(' HH') >= 0) {
        json.type = 'datetime';
      } else if (!setting.type && setting.showType) {
        setting.showType == 'yyyy' && (json.type = 'year');
        setting.showType == 'yyyy-MM' && (json.type = 'month');
        setting.showType == 'yyyy-MM-dd' && (json.type = 'date');
      }

      //valueType的处理
      if (!setting.valueType) {
        json.valueType = 'format';
      }
      json.width = '100%';
      json.desc = '';
      json.isRequired = false;
      return json;
    }
  }
};
</script>
