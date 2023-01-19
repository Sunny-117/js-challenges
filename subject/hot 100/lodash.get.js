const obj = {
	a: {
		b: 123,
	},
	arr: [
		{
			demo: "demo",
		},
	],
};
function getKey(obj, path, defaltVal) {
	str = str.replace(/\[[\d+]\]/g, (match) => {
		return "." + match.slice(1, match.length - 1);
	});
	const arr = str.split(".");
	try {
		for (const item of arr) {
			obj = obj[item];
		}
	} finally{
        // 如果第二个参数格式错误, obj为undefined
        if(obj){
            return obj
        }
        return defaltVal
    }
}
console.log(getKey(obj, "a.b", "err"));
console.log(getKey(obj, "arr[0].demo", "err"));
console.log(getKey(obj, "arr[1].demo", "err"));

