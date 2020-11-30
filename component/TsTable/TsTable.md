### 表格（TsTable）  


#### 模版使用
```javascript
<TsTable ref="showtable" v-bind="tableDdata" @changeCurrent="changeCurrent" @changePageSize="changePageSize" @getSelected="getSelected">
  <template slot="action" slot-scope="{ row }">
    <div class="tstable-action">
      <ul class="tstable-action-ul">
        <li class="ts-list" @click="viewIssue(row.uuid)">详情</li>
      </ul>
    </div>
  </template>
</TsTable>
```

#### 参数、方法说明


>> 参数(即tableDdata的数据结构)


参数名|数据类型|默认值|必传|用途|说明
:---:|:---:|:---:|:---:|:---:|:---|
rowNum|Number|无|是|总条数|-
currentPage|Number|无|是|当前第几页|-
pageSize|Number|无|是|当前第几页|-
pageSizeOpts|Array|[10, 20, 30, 40]|否|分页器的数组|-
theadList|Array|无|是|表头列表|见特殊数据说明
tbodyList|Array|无|是|表格正文数据|见特殊数据说明 
rowKey|String|id|否|行数据的唯一标志位键名|如果需要勾选的为必传 
classKey|String|无|否|每一行额外加的class后缀|给每个`<tr>`标签设置值为`row[classKey]`的class，其中row为tbodyList数组的元素 
value|Array|无|否|默认选中的list|只有每一行选中的标志位的数据集合（可以用v-model） 
noDataText|String|'暂无数据'|否|自定义无数据的文案|- 
showTotal|Boolean|true|否|是否显示总条数|不管是否展示，接口必须返回（使用场景：部分接口返回总条数有误差但是分页数量没问题） 
showSizer|Boolean|true|否|是否显示分页器|- 
sortMapping|Object|true|否|排序对应的字段映射|- 
sortOrder|Object、Array|true|否|已有的排序顺序|- 


--|--|--|--|--|--  
size|String|normal|否|表格间隙大小|支持 'normal'、'small'
type|Boolean、String|false|否|样式布局|支持 false、'card'(card为202009新增的一行一块显示，中间有空白的布局)
border|Boolean、String|true|否|表格边框|支持 true（最多场景的无外层边框有里层列边框）、false（完全无内外边框）、’all’（内外都有列、行边框）
height|Boolean、String|false|否|是否指定高度|支持 false、指定高度（字符串格式）  (不指定时，外层容器必须有高度)
--|--|--|--|--|--
hideAction|Boolean|true|否|是否提供收起操作栏功能|设为true后操作栏最后跟上一个箭头提供操作栏展开收起，鼠标移出当前行还原展开状态
selectedRemain|Boolean|false|否|是否分页保留每一页选中状态|如果为true，需要传rowKey回显唯一标志
disabledHover|Boolean|false|否|是否禁用tr移上去背景颜色效果|-
canEdit|Boolean|false|否|是否可编辑表头|包括显示隐藏行、拖拽排序
canDrag|Boolean|false|否|是否可拖拽列排序|-
~~canResize~~|Boolean|false|否|是否可调整行宽|该功能还没开发完成
sortMulti|Boolean|true|否|是否支持表头多个字段排序|-


>>  方法（方法前面加@）


 方法名|返回数据|用途（触发条件）|说明
:---:|:---:|:---:|:---
changeCurrent|当前第几页|分页改变时|-
changePageSize|每页数据条数|每页数量变化时|-
changeCurrent|当前第几页|分页改变时|-
getSelected|返回2个参数，一个是选中、行的主键集合，一个是选中行的所有数据集合|选中改变时|-
cancelSelected|取消的那一行的数据|取消选中某一行|-
selectedItem|选中的那一行的数据|选中某一行|-
clickTr|选中行的时间|点击某一行执行的事件，返回点击行的所有数据|如果td有自定义点击事件需阻止冒泡
***

>>>特殊数据说明


1. theadList（每一个th的列必须包含key,与tbody的数据对应键名保持一致，title为显示文案），例子：


```javascript
[ {//这个是第一行选中框
key: "selection"
},{//其他普通tr，title为显示文案
title: "标题5",
key: "title5",
},{//这个是最后一行操作栏,一般需要根据实际写操作按钮
key:"action"
}]
``` 

2. tbodyList（每一列的键名与theadList对应，只有对应上表头的数据才会显示，对应提供键名插槽自定义td内容），例子：


```javascript
[{//每一行数据，如果theadList设置了selection和action，数据里不需要传这两列
'key1': '12344',
'key2': '标题2',
'isDisabled': true,//如果有选中框的当行不可选，设为true
'isSelected': true//如果有选中框的当行选中，设为true
}]
``` 


#### 入参说明（数据对接用）
```javascript
[{
rowNum:Number, //总条数
currentPage:Number, //当前第几页
pageSize:Number, //当前第几页
theadList:Array //表头列表
tbodyList:Array //表格正文数据
}]
```
