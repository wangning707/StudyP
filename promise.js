class Promise {
    // 构造器
    constructor(executor) {
        // 初始化 state 为等待态
        this.state = 'pending';
        // 成功的值
        this.value = undefined;
        // 失败的原因
        this.reason = undefined;
        // 成功存放的数组
        this.onResolvedCallbacks = [];
        // 失败存放的数组
        this.onRejectedCallbacks = [];
        // 成功
        let resolve = value => {
            // state 改变，resolve 调用就会失败
            if (this.state === 'pending') {
                // resolve 调用后，state 转化为成功态
                this.state = 'fulfilled';
                // 储存成功的值
                this.value = value;
                // 一旦 resolve 执行，调用成功数组的函数
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };
        // 失败
        let reject = reason => {
            // state 改变，reject 调用就会失败
            if (this.state === 'pending') {
                // reject 调用后，state 转化为失败态
                this.state = 'rejected';
                // 储存失败的原因
                this.reason = reason;
                // 一旦 reject 执行，调用失败数组的函数
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        // 如果 executor 执行错误，直接执行 reject
        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    // then 方法有两个参数 onFulfilled onRejected
    then(onFulfilled, onRejected) {
        // onFulfilled 如果不是函数，就忽略 onFulfilled，直接返回 value
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        // onRejected 如果不是函数，就忽略 onRejected，直接扔出错误
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        // 声明返回的 promise2
        let promise2 = new Promise((resolve, reject) => {
            // 状态为 fulfilled，执行 onFulfilled，传入成功的值
            if (this.state === 'fulfilled') {
                // 异步
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        // resolvePromise 函数，处理自己 return 的 promise 和默认的 promise2 的关系
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            // 状态为 rejected，执行 onRejected，传入失败的原因
            if (this.state === 'rejected') {
                // 异步
                setTimeout(() => {
                    // 如果报错
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            // 当状态 state 为 pending 时
            if (this.state === 'pending') {
                // onFulfilled 传入到成功数组
                this.onResolvedCallbacks.push(() => {
                    // 异步
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                // onRejected 传入到失败数组
                this.onRejectedCallbacks.push(() => {
                    // 异步
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        // 返回 promise，完成链式
        return promise2;
    } catch(fn) {
        return this.then(null, fn);
    }
}
function resolvePromise(promise2, x, resolve, reject) {
    // 循环引用报错
    if (x === promise2) {
        // reject 报错
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 防止多次调用
    let called;
    // x 不是 null，且 x 是对象或者函数
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            // A+规定，声明 then = x 的 then 方法
            let then = x.then;
            // 如果 then 是函数，就默认是 promise 了
            if (typeof then === 'function') {
                // 就让 then 执行，第一个参数是 this，后面是成功的回调和失败的回调
                then.call(x, y => {
                    // 成功和失败只能调用一个
                    if (called) return;
                    called = true;
                    // resolve 的结果依旧是 promise，那就继续解析
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    // 成功和失败只能调用一个
                    if (called) return;
                    called = true;
                    reject(err);// 失败了就失败了
                });
            } else {
                resolve(x);// 直接成功即可
            }
        } catch (e) {
            // 也属于失败
            if (called) return;
            called = true;
            // 取 then 出错了那就不要在继续执行了
            reject(e);
        }
    } else {
        resolve(x);
    }
}

// resolve 方法
Promise.resolve = function (val) {
    return new Promise((resolve, reject) => {
        resolve(val);
    });
}

// reject 方法
Promise.reject = function (val) {
    return new Promise((resolve, reject) => {
        reject(val);
    });
}

// reace 方法
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(resolve, reject);
        }
    })
}

// all 方法（获取所有的 promise，都执行then，把结果放到数组，一起返回）
Promise.all = function (promises) {
    let arr = [];
    let i = 0;
    function processData(index, data) {
        arr[index] = data;
        i++;
        if (i == promises.length) {
            resolve(arr);
        }
    }
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises; i++) {
            promises[i].then(data => {
                processData(i, data);
            }, reject);
        }
    });
}

Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;

// sudo npm i promises-aplus-tests -g
// promises-aplus-tests [js文件名]