import setting from './quartz-seting';

/* istanbul ignore next */
function addClass(el, cls) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
function removeClass(el, cls) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}

/* istanbul ignore next */
function closestParent(el, cls) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.parentNode.className + ' ';
  if (curClass.indexOf(cls) >= 0) {
    return el.parentNode;
  } else {
    return closestParent(el.parentNode, cls);
  }
}

function createNode(txt) {
  let tempNode = document.createElement('div');
  tempNode.innerHTML = txt;
  return tempNode.firstChild;
}

var Quartz = function(target, options) {
  this.target = target;
  if (options) {
    this.option = options;
  } else {
    this.option = {};
  }
  this.container = document.createElement('div');
  this.container.className = 'jquery-quartz-container';
  this.option.type != 'edit' && addClass(this.container, 'quartz-show') && (this.container.tabindex = 0);
  this.container.setAttribute('tabindex', 0);

  this.target.parentNode.insertBefore(this.container, this.target);
  this.target.parentNode.removeChild(this.target);
  this.container.appendChild(this.target);

  this.cronexpression = this.option.value || this.target.value || '';
  this.currentdropdown = null;
  this.SECOND = null;
  this.MINUTE = null;
  this.HOUR = null;
  this.DAYOFMONTH = null;
  this.MONTH = null;
  this.DAYOFWEEK = null;
  this.YEAR = null;
  this.init();
};

Quartz.prototype = {
  init: function() {
    let that = this;
    let times = that.cronexpression.split(' ') || [];

    function dataseting(name, index) {
      if (times && times.length > 0 && that.validField(name, times[index])) {
        that[name.toUpperCase()] = times[index];
      } else {
        that[name.toUpperCase()] = index == 0 ? 0 : index == 5 && that.MONTH != '?' ? '?' : '*';
      }
    }
    let array = ['second', 'minute', 'hour', 'dayofmonth', 'month', 'dayofweek', 'year'];
    array.forEach((name, index) => {
      dataseting(name, index);
    });

    that.generateController(that.getFitType());

    that.container.addEventListener('blur', function() {
      if (that.isEntered && !that.isEnter && that.currentdropdown) {
        that.currentdropdown.style.display = 'none';
        that.currentdropdown = null;
      }
    });
  },
  getFitType: function() {
    let that = this;
    if (that.MONTH != '*') {
      return 'year';
    } else if (that.DAYOFMONTH != '*' && that.DAYOFMONTH != '?') {
      return 'month';
    } else if (that.DAYOFWEEK != '*' && that.DAYOFWEEK != '?') {
      return 'dayofweek';
    } else if (that.HOUR != '*') {
      return 'dayofmonth';
    } else if (that.MINUTE != '*') {
      return 'hour';
    } else {
      return 'minute';
    }
  },
  checkIsSelected: function(field, value) {
    let that = this;
    let currentValue = that[field];

    if (currentValue) {
      let checkValueList = new Array();
      if (currentValue.indexOf(',') > -1 || currentValue.indexOf('-') > -1) {
        let vs = new Array();
        if (currentValue.indexOf(',') > -1) {
          vs = currentValue.split(',');
        } else {
          vs.push(currentValue);
        }
        for (let i = 0; i < vs.length; i++) {
          if (vs[i].indexOf('-') > -1) {
            let s = parseInt(vs[i].split('-')[0], 10);
            let e = parseInt(vs[i].split('-')[1], 10);
            for (let d = s; d <= e; d++) {
              checkValueList.push(d);
            }
          } else {
            checkValueList.push(vs[i]);
          }
        }
      } else {
        checkValueList.push(currentValue);
      }

      for (let d = 0; d < checkValueList.length; d++) {
        if (checkValueList[d] == value) {
          return true;
        }
      }
    }
    return false;
  },
  validField: function(field, value) {
    var that = this;
    if (setting[field + 's']) {
      let checkValueList = new Array();
      if (value && (value.indexOf(',') > -1 || value.indexOf('-') > -1)) {
        let vs = new Array();
        if (value.indexOf(',') > -1) {
          vs = value.split(',');
        } else {
          vs.push(value);
        }
        for (let i = 0; i < vs.length; i++) {
          if (vs[i].indexOf('-') > -1) {
            let s = parseInt(vs[i].split('-')[0], 10);
            let e = parseInt(vs[i].split('-')[1], 10);
            checkValueList.push(s);
            checkValueList.push(e);
          } else {
            checkValueList.push(vs[i]);
          }
        }
      } else {
        checkValueList.push(value);
      }
      for (let i = 0; i < setting[field + 's'].length; i++) {
        for (let d = 0; d < checkValueList.length; d++) {
          if (checkValueList[d] == setting[field + 's'][i]) {
            return true;
          }
        }
      }
    }
    return false;
  },
  translate: function(text) {
    let that = this;
    text = text.toString();
    var finaltext = setting.dict[text] || text;
    if (text.indexOf(',') > -1) {
      var texts = text.split(',');
      for (var t = 0; t < texts.length; t++) {
        finaltext = finaltext.replace(texts[t], setting.dict[texts[t]] || texts[t]);
      }
    }
    if (text.indexOf('-') > -1) {
      let texts = text.split('-');
      for (let t = 0; t < texts.length; t++) {
        finaltext = finaltext.replace(texts[t], setting.dict[texts[t]] || texts[t]);
      }
    }
    return finaltext;
  },
  setValue: function(type) {
    var that = this;
    let array = ['minute', 'hour', 'dayofmonth', 'month', 'dayofweek', 'year'];
    var index = array.indexOf(type);

    array.forEach((name, i) => {
      if (i >= index) {
        if (type == 'dayofweek' && name == 'dayofweek') {
          let dayofweek = that.container.querySelector('.DAYOFWEEK').dataset['value'];
          that[name.toUpperCase()] = dayofweek == '?' ? '*' : dayofweek;
        } else if (type == 'month' && name == 'dayofmonth') {
          let dayofmonth = that.container.querySelector('.DAYOFMONTH').dataset['value'];
          that[name.toUpperCase()] = dayofmonth == '?' ? '*' : dayofmonth;
        } else if (name == 'dayofweek') {
          that[name.toUpperCase()] = '?';
        } else {
          that[name.toUpperCase()] = '*';
        }
      } else {
        that[name.toUpperCase()] = that.container.querySelector('.' + name.toUpperCase()) ? that.container.querySelector('.' + name.toUpperCase()).dataset['value'] : '';
      }
      type == 'dayofweek' && (that.DAYOFMONTH = '?') && (that.MONTH = '*');
      type == 'year' && (that.DAYOFWEEK = '?');
    });
    let inputvalue = that.SECOND + ' ' + that.MINUTE + ' ' + that.HOUR + ' ' + that.DAYOFMONTH + ' ' + that.MONTH + ' ' + that.DAYOFWEEK + ' ' + that.YEAR;
    that.option.setValue(inputvalue.replace(/\s+/g, ' '));
  },
  getValue: function() {
    alert('getValue');
  },
  toggleDropdownlist: function() {
    alert('download');
  },
  formatValue: function(value) {
    if (value.indexOf(',') == -1) {
      return value;
    }
    var vs = value.split(',');
    for (let i = 0; i < vs.length; i++) {
      if (isNaN(parseInt(vs[i], 10))) {
        return value;
      }
    }
    var newvalue = '';
    var max = 0;

    vs.sort(function(a, b) {
      if (!isNaN(parseInt(a, 10)) && !isNaN(parseInt(b, 10))) {
        return parseInt(a, 10) - parseInt(b, 10);
      } else {
        return 0;
      }
    });

    for (var i = 0; i < vs.length; i++) {
      var cur = parseInt(vs[i], 10);
      if (newvalue == '') {
        newvalue += cur;
      } else {
        if (cur - max == 1) {
          if (newvalue.substring(newvalue.length - 1) != '-') {
            newvalue += '-';
          }
        } else {
          if (newvalue.substring(newvalue.length - 1) == '-' && i > 1) {
            newvalue += parseInt(vs[i - 1], 10);
          }
          newvalue += ',' + cur;
        }
      }
      max = cur;
    }
    if (newvalue.substring(newvalue.length - 1) == '-') {
      newvalue += cur;
    }
    return newvalue;
  },
  generateController: function(type) {
    var that = this;
    if (!type) {
      type = 'minute';
    }
    var json = setting.controllerList[type];
    that.container.querySelectorAll('.dynamic-item').forEach(item => {
      item && item.parentNode.removeChild(item);
    });
    for (var i = 0; i < json.length; i++) {
      var conf = json[i];
      if (!that.option.readonly) {
        if (conf.type == 'label') {
          that.container.appendChild(createNode('<label class="jquery-quartz-controller-label dynamic-item">' + conf.text + '</label>'));
        } else if (conf.type == 'controller') {
          var c = document.createElement('div');
          c.setAttribute('class', 'jquery-quartz-controller-container dynamic-item');
          var ct = document.createElement('div');
          ct.setAttribute('class', 'jquery-quartz-controller-text');
          if (conf.target) {
            ct.innerText = that.translate(that[conf.target]) || '-所有-';
            ct.dataset['value'] = that[conf.target];
            addClass(ct, conf.target);
          }
          if (conf['get'] == 'type') {
            ct.innerText = that.translate(type);
          }

          if (that.option.type != 'edit') {
            c.appendChild(ct);
            that.container.appendChild(c);
            continue;
          }

          var dropdown = document.createElement('div');
          dropdown.setAttribute('class', 'jquery-quartz-dropdown-container');

          if (!that.option.direction || that.option.direction == 'down') {
            dropdown.style.top = '30px';
          } else {
            dropdown.style.bottom = '30px';
          }
          dropdown.style.width = typeof conf.width == 'number' ? conf.width + 'px' : conf.width;
          dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
          });
          c.addEventListener('click', function() {
            that.isEntered = false;
            let dropdown = this.querySelector('.jquery-quartz-dropdown-container');
            if (dropdown) {
              if (dropdown.style.display && dropdown.style.display != 'none') {
                //dropdown.style.display = 'none';
                that.currentdropdown = null;
              } else {
                if (that.currentdropdown) {
                  that.currentdropdown.style.display = 'none';
                }
                dropdown.style.display = 'block';
                that.currentdropdown = dropdown;
                that.currentdropdown.addEventListener('mouseenter', function() {
                  that.isEnter = true;
                  that.isEntered = true;
                });

                that.currentdropdown.addEventListener('mouseleave', function() {
                  that.isEnter = false;
                });
              }
            }
          });
          if (setting[conf.datasource]) {
            for (var d = 0; d < setting[conf.datasource].length; d++) {
              var item = document.createElement('div');
              item.setAttribute('class', 'jquery-quartz-dropdown-item');
              item.dataset['value'] = setting[conf.datasource][d];
              item.innerHTML = that.translate(setting[conf.datasource][d]);
              if (conf['get'] == 'type') {
                if (type == setting[conf.datasource][d]) {
                  addClass(item, 'selected');
                }
                item.addEventListener('click', function() {
                  that.generateController(this.dataset['value']);
                });
              } else if (conf['get'] == 'value') {
                if (that.checkIsSelected(conf.target, setting[conf.datasource][d])) {
                  addClass(item, 'selected');
                }
                item.addEventListener('click', function(e) {
                  e.stopPropagation();
                  if (this.getAttribute('class').indexOf('selected') < 0) {
                    addClass(this, 'selected');
                  } else {
                    removeClass(this, 'selected');
                  }

                  var parent = closestParent(this, 'jquery-quartz-dropdown-container');
                  var targettext = parent.parentNode.querySelector('.jquery-quartz-controller-text');
                  var text = '';
                  var val = '';
                  parent.querySelectorAll('.jquery-quartz-dropdown-item.selected').forEach(function(item) {
                    if (text) {
                      text += ',';
                      val += ',';
                    }
                    text += that.translate(item.dataset['value']);
                    val += item.dataset['value'];
                  });
                  if (text != '') {
                    targettext.innerText = that.formatValue(text);
                    targettext.dataset['value'] = that.formatValue(val);
                  } else {
                    targettext.innerText = '-所有-';
                    targettext.dataset['value'] = '*';
                  }
                  that.setValue(type);
                });
              }
              dropdown.appendChild(item);
            }
          }
          c.appendChild(ct);
          c.appendChild(dropdown);
          that.container.appendChild(c);
        }
      } else {
        if (conf.type == 'label') {
          that.container.appendChild(conf.text);
        } else if (conf.type == 'controller') {
          var text = '';
          if (conf.target) {
            text += that.translate(setting[conf.target]) ? that.translate(setting[conf.target]) : '-所有-';
          }
          if (conf['get'] == 'type') {
            text += that.translate(type);
          }
          that.container.appendChild(text);
        }
      }
    }
    if (!that.option.readonly) {
      that.setValue(type);
    }
  },
  updateValue: function(val) {
    this.cronexpression = val;
    this.init();
  }
};

export default Quartz;
