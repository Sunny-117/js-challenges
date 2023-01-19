const arr = [1, 2, 3];
Array.prototype._map = function (callback, objThis) {
	if (typeof callback !== "function") {
		throw new TypeError("callback type error!");
	}

	const res = [];
	for (let i = 0; i < this.length; ++i) {
		res.push(callback.call(objThis, this[i], i, this));
	}
	return res;
};

console.log(arr.map((item) => item * 2, [1, 2, 3]));
console.log(arr._map((item) => item * 2, [1, 2, 3]));
console.log(arr.map((item) => item * 2, new Set()));
console.log(arr._map((item) => item * 2, new Set()));
