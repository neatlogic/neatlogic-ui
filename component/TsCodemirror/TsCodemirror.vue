<template>
  <div class="tscodemirror" :class="cmOptions.readOnly?'disabled':''">
    <codemirror ref="myCode" v-model="content" :options="cmOptions" class="tscodemirror-code border-color" :class="classCodeStyle" :style="setHeight" @blur="onBlur" @focus="onFocus" @cursorActivity="cursorActivity"></codemirror>
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
//主题色
import 'codemirror/theme/eclipse.css'; //白
//import "codemirror/theme/abcdef.css";//黑
import 'codemirror/theme/monokai.css';
// //导入自动提示核心文件及样式
// import 'codemirror/addon/hint/show-hint.css';
// import 'codemirror/addon/hint/show-hint.js';
// //导入指定语言的提示文件
// import 'codemirror/addon/hint/javascript-hint.js';
import './codemirror.less';

//编辑模式引入选择
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/htmlmixed/htmlmixed');

//代码折叠
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/xml-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/comment-fold.js';

export default {
  name: 'TsCodemirror',
  components: { codemirror },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }, //初始数据
    codeMode: {
      //代码模式，text/javascript、htmlmixed
      type: String,
      default: 'text/javascript'
    },
    classCode: {
      //样式
      type: String,
      default: ''
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'eclipse'
    },
    height: {
      type: String,
      default: '100%'
    },
    code: {
      type: String,
      default: ''
    },
    blurText: {
      type: String,
      default: ''
    },
    disabled: {//是否不可操作
      type: Boolean,
      default: false
    }
  },
  data: function() {
    const _this = this;
    return {
      content: this.value,
      classCodeStyle: this.classCode,
      cmOptions: {
        mode: this.codeMode, //模式
        theme: 'eclipse', //默认主题
        indentUnit: 2, //缩近单位，默认2
        smartIndent: true, //是否智能缩近
        tabSiae: 4, //Tab缩近，默认4
        readOnly: _this.isReadOnly || _this.disabled, //是否只读
        lineNumbers: true, //是否显示行号
        firstLineNumber: 1, //默认起始行号1
        foldGutter: true, //折叠
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineWrapping: true
      },
      event: null,
      myCode: '',
      doc: null, //实例对象
      pos: null, //光标位置
      myBlurText: ''
    };
  },
  mounted() {
  },
  methods: {
    cursorActivity: function(event) {
      this.event = event;
      this.doc = event.getDoc();
      const cursor = this.doc.getCursor();
      this.pos = {
        line: cursor.line,
        ch: cursor.ch
      };
    },
    changeCode() {
      this.$nextTick(() => {
        this.doc.replaceRange(this.myCode, this.pos);
        this.event.setCursor(this.pos);
        this.event.focus();
        this.$emit('repeatClick', this.myBlurText);
      });
    },
    saveData: function() {
      var _this = this.$refs.myCode.codemirror;
      var val = _this.getValue();
      return val;
    },
    onBlur(e) {
      this.$emit('onBlur');
    },
    onFocus(e) {
      if (!this.doc) {
        //定位光标所在行数
        let event = this.$refs.myCode.codemirror;
        this.cursorActivity(event);
      }
      this.$emit('onFocus');
    },
    refresh() {
      //新增手动刷新编辑器
      this.$nextTick(() => {
        this.$refs.myCode && this.$refs.myCode.refresh();
      });
    }
  },
  computed: {
    codemirror() {
      return this.$refs.myCode.codemirror;
    },
    setHeight() {
      return { height: this.height };
    }
  },
  watch: {
    content: {
      handler: function(val) {
        this.$emit('update:value', val);
        this.$emit('change', val);
      },
      deep: true,
      immediate: true
    },
    value: {
      handler: function(val) {
        this.content = val;
      },
      deep: true,
      immediate: true
    },
    code: {
      handler: function(val) {
        this.myCode = val;
      },
      deep: true,
      immediate: true
    },
    blurText: {
      handler: function(val) {
        if (val) {
          this.myBlurText = val;
        }
        //  else {
        //   this.myBlurText = this.myBlurText;
        // }
      },
      deep: true
    },
    disabled: {
      handler: function(val) {
        this.$set(this.cmOptions, 'readOnly', val);
        this.refresh();
      },
      immediate: true
    }
  }
};
</script>
<style lang="less">
.tscodemirror {
  .tscodemirror-code {
    border: 1px solid;
  }
  .CodeMirror {
    height: 100%;
  }
}
</style>
