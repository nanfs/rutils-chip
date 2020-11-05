import "core-js/modules/es7.object.get-own-property-descriptors";
import "core-js/modules/es6.symbol";
import "antd/lib/message/style";
import _message from "antd/lib/message";
import "core-js/modules/es6.regexp.replace";
import "core-js/modules/es6.array.find";
import "core-js/modules/es6.string.iterator";
import "core-js/modules/es6.map";
import "core-js/modules/es6.promise";
import "core-js/modules/es6.regexp.split";
import "core-js/modules/es6.regexp.match";
import "core-js/modules/es6.regexp.to-string";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import "core-js/modules/es6.array.sort";
import "core-js/modules/es7.array.includes";
import "core-js/modules/es6.string.includes";
import "core-js/modules/es6.function.name";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import "core-js/modules/web.dom.iterable";
import "core-js/modules/es6.array.iterator";
import "core-js/modules/es6.object.to-string";
import "core-js/modules/es6.object.keys";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import dayjs from 'dayjs';
// 时间格式化
export function dateFormat(val) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';

  if (!val) {
    return val;
  }

  return dayjs(val).format(format);
} // // 对象转数组

export function obj2KeyValueArray(obj) {
  var array = [];
  if (!obj) return array;
  Object.keys(obj).forEach(function (o) {
    array.push({
      key: o,
      value: obj[o]
    });
  });
  return array;
} // // 对象转数组

export function dataToOptions(objArr) {
  var options = [];

  if (Array.isArray(objArr)) {
    objArr && objArr.forEach(function (item) {
      var disable = Object.prototype.hasOwnProperty.call(item, 'disable') ? {
        disable: item.disable
      } : null;
      options.push(_objectSpread({
        label: item.label || item.name,
        value: item.id || item.value
      }, disable));
    });
  }

  return options;
}
export function nodes2Tree(nodes) {
  var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'parentId';

  if (!Array.isArray(nodes) || !Object.keys(nodes[0]).includes(parentId)) {
    console.warn('数据格式不符合');
    return [];
  }

  nodes.sort(function (a, b) {
    return a[parentId] - b[parentId];
  });

  var nodeArr = _toConsumableArray(nodes);

  var tree = {};

  for (var i = nodes.length - 1; i >= 0; i--) {
    var nowPid = nodes[i].parentId ? nodes[i].parentId.toString() : nodes[i].parentId;
    var nowId = nodes[i].id.toString(); // 建立当前节点的父节点的children 数组

    if (tree[nowPid]) {
      tree[nowPid].push(nodes[i]);
    } else {
      tree[nowPid] = [];
      tree[nowPid].push(nodes[i]);
    } // 将children 放入合适的位置


    if (tree[nowId]) {
      nodeArr[i].children = tree[nowId];
      delete tree[nowId];
    }
  }

  return tree[Object.keys(tree)[0]];
} // 判断对象是否有value为true，用于控制抽屉显示

export function objhasTrue(obj) {
  if (!obj || !Object.keys(obj).length) {
    return false;
  }

  return Object.keys(obj).some(function (item) {
    return obj[item] === true;
  });
} // 获取搜索中的键值对

export function searchObj(string) {
  if (!string || !string.indexOf('?')) {
    return {};
  }

  var validUrl = string.match(/\?([^#]+)/)[1];
  var urlParamArr = validUrl.split('&');
  var urlParam = {};

  for (var i = 0; i < urlParamArr.length; i++) {
    var subArr = urlParamArr[i].split('=');
    var key = decodeURIComponent(subArr[0]);
    var value = decodeURIComponent(subArr[1]);
    urlParam[key] = value;
  }

  return urlParam;
}
export function getFileStream(fileUrl, fileName) {
  fetch(fileUrl, {
    method: 'POST',
    // body: window.JSON.stringify(params),
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).then(function (res) {
    return res.blob();
  }).then(function (blob) {
    var a = document.createElement('a');
    var url = window.URL.createObjectURL(blob);
    var filename = fileName;
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
export function formatTimeToString(time) {
  var formatString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY/MM/DD';

  if (typeof time === 'string') {
    return time;
  }

  return time.format(formatString);
}
export var genderOptions = [{
  label: '男',
  value: 0
}, {
  label: '女',
  value: 1
}];
export var statusOptions = [{
  label: '在岗',
  value: 0
}, {
  label: '离职',
  value: 1
}, {
  label: '已退休',
  value: 2
}];
export var taskPpriorityOptions = [{
  label: '普通',
  value: 3
}, {
  label: '重要',
  value: 2
}, {
  label: '紧急',
  value: 1
}];
export var taskStatusOptions = [{
  label: '进行中',
  value: 1
}, {
  label: '未开始',
  value: 2
}, {
  label: '已完成',
  value: 3
}, {
  label: '暂停',
  value: 4
}];
export function wrapResponse(res) {
  return new Promise(function (resolve, reject) {
    var _res$data;

    switch (res.code) {
      case 200:
        if (res.success !== undefined && res.success === false) {
          reject(res);
          break;
        }

        resolve(res.data);
        break;

      case 201:
        if (res.success !== undefined && res.success === false) {
          reject(res);
          break;
        }

        resolve(res.data);
        break;

      case 404:
        reject(res);
        break;

      default:
        if (((_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.data) && res.data.data.errorCode && res.data.data.errorCode.indexOf('TOKEN-') === 0) {
          reject(res);
          break;
        }

    }
  });
}
export function scrollToAnchor(id) {
  document.getElementById(id).scrollIntoView();
} // 把字符串中的汉字转换成Unicode

export function ch2Unicdoe(str) {
  if (!str) {
    return;
  }

  var unicode = '';

  for (var i = 0; i < str.length; i++) {
    var temp = str.charAt(i);

    if (/[\u4e00-\u9fa5]/.test(temp)) {
      unicode += "\\u".concat(temp.charCodeAt(0).toString(16));
    } else {
      unicode += temp;
    }
  }

  return unicode;
}
/**
 * @description
 * @author lishuai
 * @date 2020-04-08
 * @param flow
 * @param name
 */

export function downloadFile(flow, name) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'vv';
  var typeMap = new Map([['vv', 'application/x-virt-viewer;charset=UTF-8'], ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
  var blob = new Blob([flow], {
    type: typeMap.get(type)
  });
  var objUrl = URL.createObjectURL(blob);
  var aLink = document.createElement('a');
  aLink.download = "".concat(name, ".").concat(type);
  document.body.appendChild(aLink);
  aLink.style.display = 'none';
  aLink.href = objUrl;
  aLink.click();
  document.body.removeChild(aLink);
  window.URL.revokeObjectURL(objUrl);
  aLink.setAttribute('download', name);
} // 防抖动函数

export function debounce(fn, wait) {
  var timer = null;
  return function () {
    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(fn, wait);
  };
}
export function onlineStringTime(value) {
  // return second
  // 按照秒计算
  if (!value) {
    return '';
  }

  var days = Math.floor(value / 86400);
  var hours = Math.floor(value / 3600) - days * 24;
  var minutes = Math.floor(value / 60) - days * 1440 - hours * 60;
  var second = Math.ceil(value % 60);
  var timeString = '';

  if (value === 0 || value === '0') {
    return '0秒';
  }

  if (days) {
    timeString += "".concat(days, "\u5929");
  }

  if (hours) {
    timeString += "".concat(hours, "\u5C0F\u65F6");
  }

  if (minutes) {
    timeString += "".concat(minutes, "\u5206");
  }

  if (second !== 0) {
    timeString += "".concat(second, "\u79D2");
  }

  return timeString;
}
export function findArrObj(arr, key, target) {
  var current = (arr === null || arr === void 0 ? void 0 : arr.find(function (item) {
    return item[key] === target;
  })) || {};
  return current;
}
export function week2num(week) {
  switch (week) {
    case 'MON':
      return 1;

    case 'TUE':
      return 2;

    case 'WED':
      return 3;

    case 'THU':
      return 4;

    case 'FRI':
      return 5;

    case 'SAT':
      return 6;

    case 'SUN':
      return 7;

    default:
      return 0;
  }
}
/**
 * @description 用于限制inputNumber 组件格式化只能输入整数
 * @author lishuai
 * @date 2020-04-30
 * @export
 */

export function limitDecimals(value) {
  console.log(value);
  return value === null || value === void 0 ? void 0 : value.replace(/^(0+)|[^\d]+/g, '');
}
/**
 * @description 用于处理后端返回的message为数组的情况
 * @author linghu
 * @date 2020-08-11
 * @export
 */

export function handleVmMessage(msg, selectData) {
  // const msg = JSON.parse(res.message)
  msg.forEach(function (item) {
    selectData.forEach(function (data) {
      if (item.desktopId === data.id) {
        item.msg.length > 0 ? _message.error("\u865A\u62DF\u673A".concat(data.name, "\u64CD\u4F5C\u5931\u8D25\uFF0C\u5931\u8D25\u539F\u56E0\uFF1A").concat(item.msg)) : _message.error("\u865A\u62DF\u673A".concat(data.name, "\u64CD\u4F5C\u5931\u8D25"));
      }
    });
  });
}
/**
 * @description 用于处理后端返回的message为数组的情况
 * @author linghu
 * @date 2020-08-11
 * @export
 */

export function handleTcMessage(msg, selectData) {
  // const msg = JSON.parse(res.message)
  msg.forEach(function (item) {
    selectData.forEach(function (data) {
      if (item.sn === data.sn) {
        item.msg.length > 0 ? _message.error("\u7EC8\u7AEF".concat(data.name, "\u64CD\u4F5C\u5931\u8D25\uFF0C\u5931\u8D25\u539F\u56E0\uFF1A").concat(item.msg)) : _message.error("\u7EC8\u7AEF".concat(data.name, "\u64CD\u4F5C\u5931\u8D25"));
      }
    });
  });
}