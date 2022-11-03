



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

