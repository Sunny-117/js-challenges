

```javascript

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

