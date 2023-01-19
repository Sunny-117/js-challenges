// 实现Array.prototype.flat方法
Array.prototype._flat = function (deep = 1) {
	if(deep === 0) return this;
	let res = [];
	for (const item of this) {
		if (Array.isArray(item)) {
			res = res.concat(item._flat(--deep));
		} else {
			res.push(item);
		}
	}
	return res;
};

// 实现多维数组转一维数组
// Array.prototype._flat = function () {
// 	let res = [];
// 	for (const item of this) {
// 		if (Array.isArray(item)) {
// 			res = res.concat(item._flat());
// 		} else {
// 			res.push(item);
// 		}
// 	}
// 	return res;
// };

const arr = [12, 2, 4, [1, 3, [2, 34,[34,5]]]];

console.log(arr._flat())