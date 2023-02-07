# 树-场景题（hot）

## DOM2JSON

题目大意：

给出一个 DOM 结构，书写 DOM2JSON 函数，传入根 DOM 节点后，该函数返回对应的 JSON。类似真实 DOM 转换成虚拟 DOM

题目思路：

- 整体框架
- 分析 JSON 对象的属性：tag 和 children
- DOM 元素获取 tag 和 children 的属性：dom.tagNames, dom.childNodes
- 处理 children：结构一致，层级不确定，符合递归条件

答案头脑风暴

https://juejin.cn/post/7005853073167876109

https://github.com/Sunny-117/js-challenges/issues/36

```html
<div>
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>

<script>
  // DOM2JSON
  const json = {
    tag: "DIV",
    children: [
      {
        tag: "SPAN",
        children: [{ tag: "A", children: [] }],
      },
      {
        tag: "SPAN",
        children: [
          { tag: "A", children: [] },
          { tag: "A", children: [] },
        ],
      },
    ],
  };
  function dom2json(dom) {
    const res = {};
    res.tag = dom.tagName;
    res.children = [];
    dom.childNodes.forEach((child) => {
      res.children.push(dom2json(child));
    });
    return res;
  }
  const div = document.getElementsByTagName("div")[0];
  const res = dom2json(div);
  console.log("[ res ] >", res);
</script>
```
