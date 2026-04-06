export default function (MyPromise) {
    MyPromise.all = function (iterable) {
        return new MyPromise(function (resolve, reject) {
            var results = []
            var remaining = 0
            var index = 0

            try {
                for (var item of iterable) {
                    (function (currentIndex) {
                        remaining++
                        MyPromise.resolve(item).then(function (value) {
                            results[currentIndex] = value
                            remaining--
                            if (remaining === 0) {
                                resolve(results)
                            }
                        }, reject)
                    })(index)
                    index++
                }
            } catch (error) {
                reject(error)
                return
            }

            if (index === 0) {
                resolve([])
            }
        })
    }
}