# JavaScript 原生方法重写

## flat
```javascript
function flatDeep(arr, d = 1) {
    return d > 0 ? arr.reduce((a, b) => a.concat(Array.isArray(b) ?
        flatDeep(b, d - 1) : b), []) : arr.slice();
}
```
```javascript
arr.toString().split(',').map(item => {
    return Number(item)
})
```
```javascript
Array.prototype.flatten = function () {
  return this.reduce((a, b) => {
    return a.concat(Array.isArray(b) ? b.flatten() : b);
  }, []);
};
```

## forEach

```javascript
// 无返回值，调用callback
Array.prototype.myForEach = function (callback) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};
```

## map
```javascript
Array.prototype.map = function (callback) {
  return this.reduce((prev, curr, i) => {
    prev.push(callback(curr, i, this))
    return prev
  }, [])
}
```
```javascript
//返回一个新的数组
Array.prototype.myMap = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(callback(this[i], i, this));
  }
  return res;
};
```
## filter

```javascript
Array.prototype.myFilter = function (callback) {
  const res = [];
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this) && res.push(this[i]);
  }
  return res;
};
```
## 

## reduce

```javascript
Array.prototype.myReduce = function (callback, ...args) {
  let start = 0,
    pre;
  if (args.length) {
    //有参数的话pre等于参数第0项
    pre = args[0];
  } else {
    //没参数的话，默认从数组0项开始
    pre = this[0];
    start = 1;
  }
  for (let i = start; i < this.length; i++) {
    pre = callback(pre, this[i], i, this);
  }
  return pre;
};
```

## fill

```javascript
Array.prototype.myFill = function (initValue, start = 0, end) {
  end = end < 0 ? this.length + end : end;
  for (let i = start; i < end; i++) {
    this[i] = initValue;
  }
  return this;
};
let arr = [3, 3, 21, 3, 14, 12, 4, 1, 2];
console.log(arr.fill(1, 3, 5));
```

## includes

```javascript
Array.prototype.myIncludes = function (value, start = 0) {
  start = start < 0 ? this.length + start : start;
  for (let i = start; i < this.length; i++) {
    if (this[i] == value || (Number.isNaN(value) && Number.isNaN(this[i])))
      return true;
  }
  return false;
};
```
## push

```javascript
Array.prototype.myPush = function (...arg) {
  for (let i = 0; i < arg.length; i++) {
    this[this.length] = arg[i];
  }	
  return this.length;
};
```
## slice

```javascript
Array.prototype.mySlice = function (start, end) {
    // start>=0 min(start,len)  // start<0 max(start+len,0)
    let len = this.length;
    let l = start === undefined ? 0 : start < 0 ? Math.max(start + len, 0) : Math.min(start, len);
    let r = end === undefined ? len : end < 0 ? Math.max(end + len, 0) : Math.min(end, len);
    const res = [];
    while (l < r) {
        res.push(this[l++]);
    }
    return res;
};
const arr = [1, 2, 3, 4, 5]
const res = arr.mySlice(-3)
console.log(res);
```

## unshift
```javascript
Array.prototype.myUnshift = function (...items) {
    this.reverse().push(...items.reverse())
    this.reverse()
    return this.length
}
```
## getLevel
```javascript
Array.prototype.getLevel = function () {
    let max = 1
    for (const a of this) {
        if (a instanceof Array) {
            const depth = a.getLevel() + 1
            if (max < depth) max = depth
        }
    }
    return max
};
const a1 = [1, 2, [1], [1, [2, [3]]]];
console.log(a1.getLevel()); //4
```
## copy
```javascript
Array.prototype.copy = function () {
    return [...this, ...this]
}
console.log([1, 2, 3, 4, 5].copy());
```
## get
```javascript
const obj = {
    a: {
        b: 123
    },
    arr: [
        {
            demo: 'demo'
        }
    ]
}
function getKey(obj, str) {
    str = str.split('.')
    let len = str.length;
    for (let i = 0; i < len; i++) {
        if (str[i] && str[i].indexOf('[') !== -1) {
            let index = str[i].match(/\[(\d+)\]/)[1]
            let name = str[i].split('[')[0]
            if (name in obj) {
                obj = obj[name][index]
            } else {
                return undefined
            }
        } else if (str[i] in obj && obj[str[i]]) {
            obj = obj[str[i]]
        } else {
            return undefined
        }

    }
    return obj
}
console.log(getKey(obj, 'a.b'));
console.log(getKey(obj, 'arr[0].demo'));
```
## set，map
```javascript
class MySet {
  constructor(iterator = []) {//不传默认空数组
    if (typeof iterator[Symbol.iterator] !== "function") {
      throw new TypeError(`你提供的${iterator}不是一个可迭代的对象`)
    }
    this._datas = [];
    for (const item of iterator) {
      this.add(item);
    }
  }

  get size() {
    return this._datas.length;
  }

  add(data) {
    if (!this.has(data)) {// 不包含data,才加入
      this._datas.push(data);
    }
  }

  has(data) {// 是否有data
    for (const item of this._datas) {
      if (this.isEqual(data, item)) {// isEqual判断两个数据是否相等
        return true;
      }
    }
    return false;
  }
  delete(data) {
    for (let i = 0; i < this._datas.length; i++) {
      const element = this._datas[i];
      if (this.isEqual(element, data)) {
        //删除
        this._datas.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  clear() {
    this._datas.length = 0;
  }
  *[Symbol.iterator]() {// 遍历效果
    for (const item of this._datas) {
      yield item;
    }
  }
  forEach(callback) {
    for (const item of this._datas) {
      callback(item, item, this);
    }
  }
  /**
     * 判断两个数据是否相等
     * @param {*} data1 
     * @param {*} data2 
     */
  isEqual(data1, data2) {
    if (data1 === 0 && data2 === 0) {
      return true;
    }
    return Object.is(data1, data2);
  }
}
```
```javascript
class MyMap {
  constructor(iterable = []) {
    //验证是否是可迭代的对象
    if (typeof iterable[Symbol.iterator] !== "function") {
      throw new TypeError(`你提供的${iterable}不是一个可迭代的对象`)
    }
    this._datas = [];
    for (const item of iterable) {
      // item 也得是一个可迭代对象
      if (typeof item[Symbol.iterator] !== "function") {
        throw new TypeError(`你提供的${item}不是一个可迭代的对象`);
      }
      const iterator = item[Symbol.iterator]();
      //不一定是数组，所以用这种方式
      const key = iterator.next().value;
      const value = iterator.next().value;
      this.set(key, value);
    }

  }

  set(key, value) {
    const obj = this._getObj(key);
    if (obj) {//已经有了就是要修改
      //修改
      obj.value = value;
    }
    else {//没有的话添加
      this._datas.push({
        key,
        value
      })
    }
  }

  get(key) {
    const item = this._getObj(key);
    if (item) {
      return item.value;
    }
    return undefined;// 找不到
  }

  get size() {
    return this._datas.length;
  }

  delete(key) {
    for (let i = 0; i < this._datas.length; i++) {
      const element = this._datas[i];
      if (this.isEqual(element.key, key)) {
        this._datas.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  clear() {
    this._datas.length = 0;
  }

  /**
     * 根据key值从内部数组中，找到对应的数组项
     * @param {*} key 
     */
  _getObj(key) {
    for (const item of this._datas) {
      if (this.isEqual(item.key, key)) {
        return item;
      }
    }
  }

  has(key) {
    return this._getObj(key) !== undefined;
  }

  /**
     * 判断两个数据是否相等
     * @param {*} data1 
     * @param {*} data2 
     */
  isEqual(data1, data2) {
    if (data1 === 0 && data2 === 0) {
      return true;
    }
    return Object.is(data1, data2);
  }

  *[Symbol.iterator]() {//迭代器创建函数本身就是生成器函数  *
    for (const item of this._datas) {
      yield [item.key, item.value];
    }
  }

  forEach(callback) {
    for (const item of this._datas) {
      callback(item.value, item.key, this);
    }
  }
}
```
## 实现填充字符串
```javascript
String.prototype.zpadStart = function (targetLength, padString) {
    let string = this
    while (string.length < targetLength) {
        string = padString + string
    }
    return string
}
const res = 'abc'.padStart(8, "0");
```
## plainObj
```javascript
function isPlainObject(obj) {
  if (typeof obj !== "object") {
    return false;
  }
  return Object.getPrototypeOf(obj) === Object.prototype;
}
```
## Object.assign
```javascript
Object.assign2 = function(target, ...source) {
  let ret = Object(target) 
  source.forEach(function(obj) {
    if (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key]
        }
      }
    }
  })
  return ret
}
const obj1 = {a: 1}
const obj2 = {b: 2}
const res = Object.assign2(obj1, obj2)
console.log(obj1);
```

## Object.is

```javascript
Object.is = function (x, y) {
  if (x === y) {
    // 当前情况下，只有一种情况是特殊的，即 +0 -0
    // 如果 x !== 0，则返回true
    // 如果 x === 0，则需要判断+0和-0，则可以直接使用 1/+0 === Infinity 和 1/-0 === -Infinity来进行判断
    return x !== 0 || 1 / x === 1 / y;
  }
  // x !== y 的情况下，只需要判断是否为NaN，如果x!==x，则说明x是NaN，同理y也一样
  // x和y同时为NaN时，返回true
  return x !== x && y !== y;
};
```

## Object.create()
```javascript
Object.create2 = function(proto, propertyObject = undefined) {
    function F() {}
    F.prototype = proto
    const obj = new F()
    if (propertyObject != undefined) {
        Object.defineProperties(obj, propertyObject)
    }
    if (proto === null) {
        // 创建一个没有原型对象的对象，Object.create(null)
        obj.__proto__ = null
    }
    return obj
}
```
## JSON.stringify
实现一个函数toJSON，将传入的数据转换为JSON格式的字符串
```javascript
function toJSON(data){

}

// test
toJSON(""); // -> ""
toJSON("abc"); // -> "abc"
toJSON(123); // -> 123
toJSON({a:1, b:2}); // -> {"a":1, "b":2}
toJSON(["1", 3, {name:"monica", age:18}]); //-> ["1", 3, {"name":"monica", "age":18}]
```

```javascript
var specialTypes = ["function", "symbol", "undefined"];

function isArrayItemToNull(item) {//数组的元素是不是转换成null
  const itemType = typeof item;
  return (
    specialTypes.includes(itemType) || (isNaN(item) && itemType === "number")//判断NaN
  );
}

function isDropProp(data) {
  return specialTypes.includes(typeof data);
}

function hanldeObject(data) {
  // 是不是null
  if (data === null) {
    return "null";
  }
  data = data.valueOf();
  if (typeof data !== "object") {
    // 说明data已经是原始类型
    return toJSON(data);
  }
  // 是数组的情况
  if (Array.isArray(data)) {
    return `[${data
      .map((it) => (isArrayItemToNull(it) ? "null" : toJSON(it)))
      .join(", ")}]`;
  }
  // 是普通对象的情况
  const result = Object.entries(data)
  .flatMap(([k, v]) => (isDropProp(v) ? [] : `"${k}": ${toJSON(v)}`))
  .join(",");
  return `{${result}}`;
}

/**
 * 将传入的数据转换为 JSON 格式的字符串
 * @param {any} data 要转换的数据
 * @returns {String|undefined} 返回转换后的 JSON 字符串
 */
function toJSON(data) {
  const type = typeof data; // 拿到data的数据类型
  switch (type) {
    case "boolean":
    case "number":
      return "" + data;
    case "bigint":
      throw new TypeError("Do not know how to serialize a BigInt");
    case "string":
      return `"${data}"`;
    case "function":
    case "undefined":
    case "symbol":
      return;
    case "object":
      return hanldeObject(data);
  }
}

// test
console.log(
  toJSON({
    a: undefined,
    b: Symbol("1"),
    d: () => {},
    c: "abc",
    e: {
      a: 1,
      b: [{ name: "monica", age: 18 }, 44, {}],
    },
  })
);
// console.log(toJSON(""));
// toJSON(""); // -> ""
// toJSON("abc"); // -> "abc"
// toJSON(123); // -> 123
// toJSON({ a: 1, b: 2 }); // -> {"a":1, "b":2}
// toJSON(["1", 3, { name: "monica", age: 18 }]); //-> ["1", 3, {"name":"monica",
```
## JSON.parse

- eval 实现

```javascript
var json = '{"a":"1", "b":2}';
var obj = eval("(" + json + ")");  // obj 就是 json 反序列化之后得到的对象
```

- New Function

```javascript
var json = '{"name":"小姐姐", "age":20}';
var obj = (new Function('return ' + json))();
```

## call apply bind

```javascript
Function.prototype.call2 = function(context, ...args) {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}
Function.prototype.apply2 = function(context, args) {
  context = (context === undefined || context === null) ? window : context
  context.__fn = this
  let result = context.__fn(...args)
  delete context.__fn
  return result
}
Function.prototype.bind2 = function(context, ...args1) {
  context = (context === undefined || context === null) ? window : context
  let _this = this
  return function(...args2) {
    context.__fn = _this
    let result = context.__fn(...[...args1, ...args2])
    delete context.__fn
    return result
  }
}
```
## promisify
> 手动实现一个promisify函数的意思是：我们把一个异步请求的函数，封装成一个可以具有 then方法的函数，并且在then方法中返回异步方法执行结果的这么一个函数
> 1. 具有 then 方法
> 1. then 方法里返回异步接口执行结果

```javascript
// 首先定一个需要进行 promisify 的函数
function asyncFn(a, b, callback) {
        // 异步操作，使用 setTimeout 模拟
        console.log('异步请求参数', a, b)
        setTimeout(function() {
                callback('异步请求结果')
        }, 3000)
}

// 我们希望调用的方式是
const proxy = promisify(asyncFn)
proxy(11,22).then(res => {
        // 此处输出异步函数执行结果
        console.log(res)
})

// 定义一个方法， 需要针对异步方法做封装，所以需要一个入参，既需要promisify的原异步方法
function promisify(func) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      const callback = (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data)
        }
      };
      func.call(this, ...args, callback);
    });
  }
}
```
## instanceof
> instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。 
> 1. 首先获取类型的原型
> 1. 然后获得对象的原型
> 1. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
      prototype = right.prototype; // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
function Person() { };
var p = new Person();
console.log(myInstanceof(p, Object));
// console.log(p instanceof Person);//true
```
## trim
> return str.replace(/(^\s+)|(\s+$)/g,'')//将前空格和后空格替换为空

## new
> （1）首先创建了一个新的空对象
> （2）设置原型，将对象的原型设置为函数的 prototype 对象。
> （3）让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
> （4）判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。

```javascript
function myNew(constructorFn, ...args) {
    let newObj = {}
    newObj.__proto__ = constructorFn.prototype;
    // newObj = Object.create(constructor.prototype);
    let result = constructorFn.apply(newObj, args)
    return result instanceof Object ? result : newObj
}
function Animal(name) {
    this.name = name;
}
let animal = myNew(Animal, 'dog')
console.log(animal);
```
## repeat
输入字符串s，以及其重复的次数，输出重复的结果，例如输入abc，2，输出abcabc。**不用循环**
```javascript
String.prototype.repeat = function (n) {// 我写的
    let str = this;
    let res = ''
    while (n) {
        res += str;
        n--
    }
    return res
}
console.log('abc'.repeat(3));
```

```javascript
function repeat(src, n) {
  return new Array(n + 1).join(src);
}
console.log(repeat("abc", 4));
```
```javascript
方法3:递归
function repeat(src, n) {
  return n > 0 ? src.concat(repeat(src, --n)) : "";
}
```
## 

