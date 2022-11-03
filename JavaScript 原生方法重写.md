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

