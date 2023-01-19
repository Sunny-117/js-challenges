Function.prototype._call = function (obj, ...args) {
	!obj && (obj = globalThis);
	// this代表要执行的函数
	obj._fn = this;
	const res = obj._fn(...args);
	delete obj._fn;
	return res;
};

Function.prototype._apply = function (obj, args) {
	// 第二个参数必须为数组或类数组对象, 否则初始化为空对象
	const arr = [];
	for (let i = 0; i < args?.length; ++i) {
		arr.push(args[i]);
	}
	return this._call(obj, ...arr);
};

Function.prototype._bind = function (obj, ...args1) {
	!obj && (obj = globalThis);
	return (...args2) => {
        obj._fn = this;
		const res = obj._fn(...[...args1, ...args2]);
		delete obj._fn;
		return res;
	};
};

function test(a, b, c) {
	console.log(this.a);
	console.log(a, b, c);
	return a + b + c;
}
// test(...{ 0: 0, 1: 1 });
const fn = test._bind(null, 1, 2);
console.log(fn(3));
