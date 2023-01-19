Promise._all = (iterObj) => {
    // 1. iterObj 必须是一个可迭代对象, 否则, 无法正常进行则抛出错误
    if(!(typeof iterObj === "object" && iterObj !== null && typeof iterObj[Symbol.iterator] === "function")){
        throw new TypeError(`${iterObj} is not iterable`);
    }
    iterObj = [...iterObj];
    /*
     *  2. 函数返回值为 `<Promise>` 对象, 当参数 `iterObj` 内所有的 `Promise` 成功, 
     *     该 `<Promise>` 对象成功, 成功数据为所有成功的 `Promise` 结果数组,
     *     有一个不成功, 则该 `<Promise>` 不成功, 失败数据为失败原因字符串
     */
    return new Promise((resolve, reject) => {
        const len = iterObj.length;
        let count = 0;
        if(len === 0) return resolve([]);

        const res = new Array(len);
        iterObj.forEach(async (item, index) => {
            const newItem = Promise.resolve(item);
            try{
                const result = await newItem;
                res[index] = result;
                if(++count === len){
                    resolve(res)
                }
            }catch(err){
                reject(err);
            }
        })
    })
}

// 验证:
function test(){
    try{
        Promise._all(null).then(res=>console.log(res), rej=>console.log(rej)); 
        // throw err: null is not iterable
    }catch(e){
        console.log(e)
    }

    try{
        Promise._all({}).then(res=>console.log(res), rej=>console.log(rej)); 
        // throw err: [object object] is not iterable
    }catch(e){
        console.log(e)
    }
    
    Promise._all([]).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise._all(new Set()).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise._all(new Map()).then(res=>console.log(res), rej=>console.log(rej)); 
    // []
    
    Promise._all([
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
        4,
      ]).then(res=>console.log(res), rej=>console.log(rej))
    
    // [1, 2, 3, 4]
    
    Promise._all([
        Promise.reject(1),
        Promise.resolve(2),
        Promise.resolve(3),
        4,
      ]).then(res=>console.log(res), rej=>console.log(rej))
    // 1
}
test();