interface DataItem {
	id: number;
	text: string;
	parentId: number;
	children?: DataItem[];
}

function treeToList(data: DataItem[]) {
	const res: DataItem[] = [];
	for (const item of data) {
		dfs(item, res);
	}
	/**
	 * 该函数用于深度遍历第一个参数tree, 并格式化收集到第二个参数res
	 * @param tree
	 * @param res
	 */
	function dfs(tree: DataItem, res: DataItem[]): void {
		const newTree = {
			id: tree.id,
			text: tree.text,
			parentId: tree.parentId,
		};
		res.push(newTree);

		if (tree.children) {
			for (const item of tree.children) {
				dfs(item, res);
			}
		}
	}
	return res;
}
