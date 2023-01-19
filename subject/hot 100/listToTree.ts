interface _Node {
	id: number;
	name: string;
	pid: number;
	children?: _Node[];
}

const list = [
	{ id: 1, name: "部门1", pid: 0 },
	{ id: 2, name: "部门2", pid: 1 },
	{ id: 3, name: "部门3", pid: 1 },
	{ id: 4, name: "部门4", pid: 3 },
	{ id: 5, name: "部门5", pid: 4 },
	{ id: 6, name: "部门6", pid: 0 },
];
//  方法1: 
// function createTree(arr: _Node[]): _Node[] {
// 	const res: _Node[] = [];
// 	/**
// 	 * 传入一个指定的父id, 返回满足条件的子节点
// 	 * 这个方法不写也没关系, 也就是进行行二次封装, 为了语义化, 方便理解
// 	 * @returns 
// 	 */
// 	const findChild = (arr: _Node[], pid: number): _Node[] => {
// 		const res = arr.filter(item => item.pid === pid);
// 		return res;
// 	};

// 	for (const item of arr) {
// 		const children = findChild(arr, item.id);
// 		children.length && (item.children = children)
// 	}

// 	return findChild(arr, 0);
// }

// 方法2:
function createTree(arr: _Node[]): _Node[] {
	// 解题思路: 每一个节点都可能是父节点
	const len = arr.length;
	/*
	 * 构建父节点数组, 以空间换时间
	 * 该数组结构: 以父id为下标, 值为子元素数组
	 */ 
	const res = new Array(len).fill('').map(_ => new Array() as _Node[]);

	// 一次遍历找出所有关系
	for(let i = 0; i < len; ++i){
		res[i].push()
	}

	return res[0];
}

const ans = createTree(list);
console.log(ans);
