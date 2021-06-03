<template>
  <div :class="wrapClasses">
    <template v-if="type !== 'textarea'">
      <div v-if="prepend" v-show="slotReady" :class="[prefixCls + '-group-prepend']">
        <slot name="prepend"></slot>
      </div>
      <i v-if="clearable && currentValue && !itemDisabled" class="ivu-icon" :class="['ivu-icon-ios-close-circle', prefixCls + '-icon', prefixCls + '-icon-clear' , prefixCls + '-icon-normal']" @click="handleClear"></i>
      <i v-else-if="icon" class="ivu-icon" :class="['ivu-icon-' + icon, prefixCls + '-icon', prefixCls + '-icon-normal']" @click="handleIconClick"></i>
      <i v-else-if="search && enterButton === false" class="ivu-icon ivu-icon-ios-search" :class="[prefixCls + '-icon', prefixCls + '-icon-normal', prefixCls + '-search-icon']" @click="handleSearch"></i>
      <span v-else-if="showSuffix" class="ivu-input-suffix">
        <slot name="suffix"><i v-if="suffix" class="ivu-icon" :class="['ivu-icon-' + suffix]"></i></slot>
      </span>
      <span v-else-if="showWordLimit && !showRemain" class="ivu-input-word-count">{{ textLength }}/{{ upperLimit }}</span>
      <span v-else-if="showWordLimit && showRemain" class="ivu-input-word-count">{{Math.max(parseInt(upperLimit) -  parseInt(textLength),0) }}</span>
      <span v-else-if="password" class="ivu-input-suffix" @click="handleToggleShowPassword">
        <i v-if="showPassword" class="ivu-icon ivu-icon-ios-eye-off-outline"></i>
        <i v-else class="ivu-icon ivu-icon-ios-eye-outline"></i>
      </span>
      <transition name="fade">
        <i v-if="!icon" class="ivu-icon ivu-icon-ios-loading ivu-load-loop" :class="[prefixCls + '-icon', prefixCls + '-icon-validate']"></i>
      </transition>
      <input :id="elementId" ref="input" :autocomplete="autocomplete" :spellcheck="spellcheck" :type="currentType" :class="inputClasses" :placeholder="placeholder" :disabled="itemDisabled" :maxlength="maxlength" :readonly="readonly" :name="name" :value="currentValue" :number="number" :autofocus="autofocus" @keyup.enter="handleEnter" @keyup="handleKeyup" @keypress="handleKeypress" @keydown="handleKeydown" @focus="handleFocus" @blur="handleBlur" @compositionstart="handleComposition" @compositionupdate="handleComposition" @compositionend="handleComposition" @input="handleInput" @change="handleChange">
      <div v-if="append" v-show="slotReady" :class="[prefixCls + '-group-append']">
        <slot name="append"></slot>
      </div>
      <div v-else-if="search && enterButton" :class="[prefixCls + '-group-append', prefixCls + '-search']" @click="handleSearch">
        <i v-if="enterButton === true" class="ivu-icon ivu-icon-ios-search"></i>
        <template v-else>{{ enterButton }}</template>
      </div>
      <span v-else-if="showPrefix" class="ivu-input-prefix">
        <slot name="prefix"><i v-if="prefix" class="ivu-icon" :class="['ivu-icon-' + prefix]"></i></slot>
      </span>
    </template>
    <template v-else>
      <textarea :id="elementId" ref="textarea" :wrap="wrap" :autocomplete="autocomplete" :spellcheck="spellcheck" :class="textareaClasses" :style="textareaStyles" :placeholder="placeholder" :disabled="itemDisabled" :rows="rows" :maxlength="maxlength" :readonly="readonly" :name="name" :value="currentValue" :autofocus="autofocus" @keyup.enter="handleEnter" @keyup="handleKeyup" @keypress="handleKeypress" @keydown="handleKeydown" @focus="handleFocus" @blur="handleBlur" @compositionstart="handleComposition" @compositionupdate="handleComposition" @compositionend="handleComposition" @input="handleInput">
            </textarea>
      <span v-if="showWordLimit&& !showRemain" class="ivu-input-word-count">{{ textLength }}/{{ upperLimit }}</span>
      <span v-else-if="showWordLimit&& showRemain" class="ivu-input-word-count">{{Math.max(parseInt(upperLimit) -  parseInt(textLength),0) }}</span>
    </template>
  </div>
</template>
<script>
import { oneOf, findComponentUpward } from '../../utils/assist';
import calcTextareaHeight from '../../utils/calcTextareaHeight';
import Emitter from '../../mixins/emitter';
import mixinsForm from '../../mixins/form';

const prefixCls = 'ivu-input';

export default {
  name: 'Input',
  mixins: [Emitter, mixinsForm],
  props: {
    type: {
      validator(value) {
        return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date', 'number', 'tel']);
      },
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: ''
    },
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default']);
      },
      default() {
        return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size;
      }
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    readonly: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    number: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    spellcheck: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    elementId: {
      type: String
    },
    wrap: {
      validator(value) {
        return oneOf(value, ['hard', 'soft']);
      },
      default: 'soft'
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    search: {
      type: Boolean,
      default: false
    },
    enterButton: {
      type: [Boolean, String],
      default: false
    },
    // 4.0.0
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 4.0.0
    password: {
      type: Boolean,
      default: false
    },
    showRemain:{//在开启showWordLimit前提下，显示剩余字数，默认是显示已输入数/总数，将此参数设为true只显示剩余字数
      type: Boolean,
      default: true      
    }
  },
  data() {
    return {
      currentValue: this.value,
      prefixCls: prefixCls,
      slotReady: false,
      textareaStyles: {},
      isOnComposition: false,
      showPassword: false
    };
  },
  mounted() {
    this.slotReady = true;
    this.resizeTextarea();
  },
  methods: {
    handleEnter(event) {
      this.$emit('on-enter', event);
      if (this.search) this.$emit('on-search', this.currentValue);
    },
    handleKeydown(event) {
      this.$emit('on-keydown', event);
    },
    handleKeypress(event) {
      this.$emit('on-keypress', event);
    },
    handleKeyup(event) {
      this.$emit('on-keyup', event);
    },
    handleIconClick(event) {
      this.$emit('on-click', event);
    },
    handleFocus(event) {
      this.$emit('on-focus', event);
    },
    handleBlur(event) {
      this.$emit('on-blur', event);
      if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
        this.dispatch('FormItem', 'on-form-blur', this.currentValue);
      }
    },
    handleComposition(event) {
      if (event.type === 'compositionstart') {
        this.isOnComposition = true;
      }
      if (event.type === 'compositionend') {
        this.isOnComposition = false;
        this.handleInput(event);
      }
    },
    handleInput(event) {
      if (this.isOnComposition) return;

      let value = event.target.value;
      if (this.number && value !== '') value = Number.isNaN(Number(value)) ? value : Number(value);
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('on-change', event);
    },
    handleChange(event) {
      this.$emit('on-input-change', event);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.$nextTick(() => {
        this.resizeTextarea();
      });
      this.currentValue = value;
      if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
        this.dispatch('FormItem', 'on-form-change', value);
      }
    },
    resizeTextarea() {
      const autosize = this.autosize;
      if (!autosize || this.type !== 'textarea') {
        return false;
      }

      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },
    focus() {
      if (this.type === 'textarea') {
        this.$refs.textarea.focus();
      } else {
        this.$refs.input.focus();
      }
    },
    blur() {
      if (this.type === 'textarea') {
        this.$refs.textarea.blur();
      } else {
        this.$refs.input.blur();
      }
    },
    handleClear() {
      const e = { target: { value: '' } };
      this.$emit('input', '');
      this.setCurrentValue('');
      this.$emit('on-change', e);
      this.$emit('on-clear');
    },
    handleSearch() {
      if (this.itemDisabled) return false;
      this.$refs.input.focus();
      this.$emit('on-search', this.currentValue);
    },
    handleToggleShowPassword() {
      if (this.itemDisabled) return false;
      this.showPassword = !this.showPassword;
      this.focus();
      const len = this.currentValue.length;
      setTimeout(() => {
        this.$refs.input.setSelectionRange(len, len);
      }, 0);
    }
  },
  computed: {
    currentType() {
      let type = this.type;
      if (type === 'password' && this.password && this.showPassword) type = 'text';
      return type;
    },
    prepend() {
      let state = false;
      if (this.type !== 'textarea') state = this.$slots.prepend !== undefined;
      return state;
    },
    append() {
      let state = false;
      if (this.type !== 'textarea') state = this.$slots.append !== undefined;
      return state;
    },
    showPrefix() {
      let state = false;
      if (this.type !== 'textarea') state = this.prefix !== '' || this.$slots.prefix !== undefined;
      return state;
    },
    showSuffix() {
      let state = false;
      if (this.type !== 'textarea') state = this.suffix !== '' || this.$slots.suffix !== undefined;
      return state;
    },
    wrapClasses() {
      return [
        `${prefixCls}-wrapper`,
        {
          [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
          [`${prefixCls}-type-${this.type}`]: this.type,
          [`${prefixCls}-group`]: this.prepend || this.append || (this.search && this.enterButton),
          [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append || (this.search && this.enterButton)) && !!this.size,
          [`${prefixCls}-group-with-prepend`]: this.prepend,
          [`${prefixCls}-group-with-append`]: this.append || (this.search && this.enterButton),
          [`${prefixCls}-hide-icon`]: this.append, // #554
          [`${prefixCls}-with-search`]: this.search && this.enterButton,
          [`${prefixCls}-wrapper-disabled`]: this.itemDisabled // #685
        }
      ];
    },
    inputClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.itemDisabled,
          [`${prefixCls}-with-prefix`]: this.showPrefix,
          [`${prefixCls}-with-suffix`]: this.showSuffix || (this.search && this.enterButton === false)
        }
      ];
    },
    textareaClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-disabled`]: this.itemDisabled
        }
      ];
    },
    upperLimit() {
      return this.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }

      return (this.value || '').length;
    }
  },
  watch: {
    value(val) {
      this.setCurrentValue(val);
    }
  }
};
</script>
