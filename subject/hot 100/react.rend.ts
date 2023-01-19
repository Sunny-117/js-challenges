/**
 * {
  tag: 'DIV',
  attrs:{
    id:'app'
  },
  children: [
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] }
      ]
    },
    {
      tag: 'SPAN',
      children: [
        { tag: 'A', children: [] },
        { tag: 'A', children: [] }
      ]
    }
  ]
}
把上诉虚拟Dom转化成下方真实Dom
<div id="app">
  <span>
    <a></a>
  </span>
  <span>
    <a></a>
    <a></a>
  </span>
</div>
 */

function _render(vnode) {
  // 考虑非一般性, 临界值
	if (typeof vnode === "number") {
		vnode = String(vnode);
	}
	if (typeof vnode === "string") {
		return document.createTextNode(vnode);
	}
  // 不失一般性
	const dom = document.createElement(vnode.tag);
	if (vnode.attrs) {
		for (const key in vnode.attrs) {
			dom.setAttribute(key, vnode.attrs[key]);
		}
	}
	if (vnode.children) {
		vnode.children.forEach((newVnode) => {
			dom.appendChild(_render(newVnode));
		});
	}
	return dom;
}
