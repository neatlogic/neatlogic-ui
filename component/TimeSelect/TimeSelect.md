### TimeSelect  


#### 模版使用
```javascript
<TimeSelect v-model="time" valueType="format" type="datetimerange" format="yyyy-MM-dd HH:mm:ss" :placement="placement" :timerWidth="width" @on-ok="changeTimer"> </TimeSelect>
```

#### 参数、方法说明


>> 参数


参数名|数据类型|默认值|必传|用途|说明
:---:|:---:|:---:|:---:|:---:|:---|
value|Object|无|否|插件的值，可用v-model进行双向绑定数据| 值为当为起始时间时：{ "startTime": 开始时间, "endTime": 结束时间}或者为固定的下拉选项时：{timeRange:对应的value值，timeUnit:对应的单位} 
isMore|Boolean|true|否|是否支持自定义时间|  
dataList|Array|有|是|固定的下拉选项的下拉枚举
placement|String|‘bottom-start’|否|如果开启了自定义模式时间选择器的位置|`[toptop-start,top-end,bottom,bottom-start,bottom-end,left,left-start,left-end,right,right-start,right-end]`
labelWidth|Number|120|否|label显示的宽度|当labelPosition值为right 和 left 有效
itemWidth|Number, String|100%|否|每一个每项控件整体占用的宽度，实现栅格布局| 包含label  
width|String, Number|75%|否|控件显示的宽度 |不包含label


>>  方法(通过ref调用方法)


 方法名|返回数据|用途|说明
:---:|:---:|:---:|:---
valid|Boolean|校验表单是否通过|-
clearForm|-|清空表单值|-
resetForm|-|重置表单值|-
getFormValue|Object|获取表单值|-

***

>>>特殊数据说明

1. itemList,与tbody的数据对应键名保持一致，title为显示文案），例子：

```javascript
itemList:{
  name1:{
    type:"text",//控件类型 text | textarea | number | url | email | tel | password  | select | radio |checkbox |date  |datetime |datetimerange | year | month | time  | timerange  | tree | quartz | switch  |  textspan | slot| ckeditor|userselect | codemirror
    label:"textlabel",//控件标题
    hideLabel:true,//是否隐藏label让其不占位置
    isHidden:true,//是否隐藏这个配置项对应的控件
    validateList:[//教养
      "required",//通用校验，如果想知道全部教养可以参考 tsValidtor.js文件
      {name:"number",message:"错误提示"},//在现有的基础上面，更改校验提示
      {name: "regex", pattern: "^[a-z]+$", message: "错误提示" }//正则表达式校验
      {name:"custom", message: '错误提示', validator: function(rule, value) { return value?true:false;}},//自定义方法校验
   ],
   onChange:function(val){}//控件对应的值发生改变时，调用的方法
   ...//每个控件自身对应的属性，请参考相对应控件的具体属性
  },
  name2:{
    type:"slot",
    label:"slotlable",
    value:"",
  }
}
```
