### 输入框（TsFormInput）  


#### 模版使用
```javascript
<TsFormInput v-model="item.value" v-bind="config" @on-change="changeFn"></TsFormInput>
```

#### 参数、方法说明


>> 参数


参数名|数据类型|默认值|必传|用途|说明
:---:|:---:|:---:|:---:|:---:|:---|
type|String|-|是|文本框类型|text 、 textarea 、 number 、 url 、 email 、 tel 、 password  
value|String, Number|''|否|控件值|-
disabled|Boolean|false|否|是否可以编辑|-
readonly|Boolean|false|否|是否只读|显示文案，不会出现边框
placeholder|String|请输入|否|-|-
size|String|default|否|控件大小，主要设置高度|large 、 small 、 default   
maxlength|Number, String|-|否|文本框内最多可以输入字符的个数|-
width|String, Number|100%|否|控件显示的宽度|-
validateList|Array|-|否|校验|-
showPassword|Boolean|true|否|是否显示明文和密码的切换|当类型为password时生效
autosize|Boolean, Object|-|否|高度随内容变化|当类型为textarea时生效
border|String|-|否|控件边框|border 、 bottom 、 none
className|String|-|否|控件最外层添加className|-
readonlyClass|String|tsform-readonly|否|只读最外层添加className|不同页面只读样式不相同，因此如需特殊样式可以通过添加class来控制
desc|String|-|否|描述|统一描述位子，在控件底部
clearable|Boolean|-|否|是否有清除按钮|如果必填清除按钮不出现
errorMessage|String|-|否|外部控制校验提示|如果值不为空，则校验不通过
prepend|String|-|否|前置内容|仅在 text 类型下有效
append|String|-|否|后置内容|仅在 text 类型下有效
suffix|String|-|否|输入框尾部图标|-
onChange|Function|-|否|值改变时执行的方法|主要用于结合TsForm一起使用
onBlur|Function|-|否|失去焦点执行的方法|主要用于结合TsForm一起使用





>>  方法(通过@调用方法)


 方法名|用途|说明
:---:|:---:|:---
on-change|数据改变时触发| 入参 value：文本框值
on-blur|失去焦点时触发|-
on-enter|enter键触发|-
on-focus|获取焦点时触发|-





#### 入参

```javascript
config:{
  type:'text,
  disabled:false,
  value:'',
  size:'default',   
  maxlength:50,
  placeholder:'请输入',
  onChange:function(vale){},
  onBlur:function(vale){},
  width:'75%',
  readonly:true,
  showPassword:true,
  validateList:[],
  autosize:true,
  border:'bottom',
  className:'',
  desc:'文本框描述',
  clearable:false,
  readonlyClass:'',
  errorMessage:'请输入正确数据',
  prepend:'http',
  append:'$',
  suffix:'ts-search'
}
```
