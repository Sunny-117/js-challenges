

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

